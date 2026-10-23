"""Keyword-based FAQ matching for the WhatsApp assistant.

No external AI service is used: a visitor's message is scored against every
active FAQ using token overlap weighted by inverse document frequency (IDF),
with small bonuses for question-word overlap and fuzzy (typo-tolerant) matches.
The single best answer is returned when its score clears a configurable
threshold, otherwise ``None`` so the caller can send a fallback.

The whole thing is deterministic and cheap, which keeps it easy to test and to
reason about. :class:`FaqMatcher` is a pure object over a list of
:class:`~content.models.FaqItem` instances, so it can be reused by the website
or any future channel; :func:`get_matcher` just builds and briefly caches one
from the database.
"""

from __future__ import annotations

import math
import re
import time
from difflib import SequenceMatcher

from django.conf import settings

from content.models import FaqItem

#: Words ignored when matching. Kept small and generic.
STOPWORDS = frozenset(
    """
    a an the and or but if then else of to in on at by for from with without into over
    is are was were be been being am do does did doing have has had having i me my we
    our you your he she it they them his her its this that these those as not no so
    can could would should will shall may might must about per via again there here what
    which who whom whose when where why how all any some more most other such only own
    get got getting need needs want wants know make made take give tell say said see find
    look looking help please thanks thank hello hi hey ok okay just really very able
    going something anything everything
    """.split()
)

_WORD_RE = re.compile(r"[a-z0-9]+")

# Term weights when building each FAQ document. Question words and curated
# keywords are "strong"; category and answer words only weakly support a match.
_QUESTION_WEIGHT = 4
_KEYWORD_WEIGHT = 5
_CATEGORY_WEIGHT = 2
_ANSWER_WEIGHT = 1

# Fuzzy matches below this ratio are ignored (catches typos, not random words).
_FUZZY_MIN_RATIO = 0.85

# Cached matcher lifetime, in seconds.
_CACHE_TTL = 120.0

_SUFFIXES = ("ingly", "edly", "ing", "ies", "ed", "es", "s")


def _stem(word: str) -> str:
    """Very light suffix stripping so "applying"/"apply" and "jobs"/"job" match.

    It is applied identically to queries and documents, so consistency matters
    more than linguistic correctness.
    """
    for suffix in _SUFFIXES:
        if len(word) > len(suffix) + 2 and word.endswith(suffix):
            return word[: -len(suffix)]
    return word


def tokenize(text: str) -> list[str]:
    """Lowercase, strip stopwords, and stem into a list of searchable tokens."""
    tokens = []
    for raw in _WORD_RE.findall((text or "").lower()):
        if len(raw) < 2 or raw in STOPWORDS:
            continue
        tokens.append(_stem(raw))
    return tokens


class FaqMatcher:
    """Score free-text messages against a fixed list of FAQ items."""

    def __init__(self, items):
        self.items = list(items)
        self.documents = [self._document(item) for item in self.items]
        self._idf = self._compute_idf(self.documents)
        self._max_idf = max(self._idf.values(), default=1.0) + 0.5

    # -- index building ----------------------------------------------------

    @staticmethod
    def _document(item) -> dict[str, int]:
        terms: dict[str, int] = {}

        def add(text, weight):
            for token in tokenize(text):
                if weight > terms.get(token, 0):
                    terms[token] = weight

        add(item.question, _QUESTION_WEIGHT)
        add(getattr(item.category, "title", ""), _CATEGORY_WEIGHT)
        add(item.keywords, _KEYWORD_WEIGHT)
        add(item.answer, _ANSWER_WEIGHT)
        return terms

    @staticmethod
    def _compute_idf(documents) -> dict[str, float]:
        total = max(len(documents), 1)
        df: dict[str, int] = {}
        for doc in documents:
            for term in doc:
                df[term] = df.get(term, 0) + 1
        return {term: math.log((total + 1) / (count + 1)) + 1.0 for term, count in df.items()}

    # -- scoring -----------------------------------------------------------

    def _fuzzy_match(self, term: str, doc: dict[str, int]) -> float:
        best = 0.0
        for candidate in doc:
            if candidate[0] != term[0]:
                continue
            ratio = SequenceMatcher(None, term, candidate).ratio()
            if ratio > best:
                best = ratio
        return best if best >= _FUZZY_MIN_RATIO else 0.0

    def _score(self, tokens, doc, question_tokens) -> float:
        matched = 0.0
        total = 0.0
        for token in tokens:
            weight = self._idf.get(token, self._max_idf)
            total += weight
            if token in doc:
                # Words from the question or curated keywords count far more than
                # ones that only appear in the answer body.
                strength = min(doc[token], _QUESTION_WEIGHT) / _QUESTION_WEIGHT
                matched += weight * strength
            else:
                fuzzy = self._fuzzy_match(token, doc)
                if fuzzy:
                    matched += weight * fuzzy * 0.7
        if total == 0:
            return 0.0

        score = matched / total
        # Reward messages that contain the whole question (or vice versa).
        if question_tokens and question_tokens <= set(tokens):
            score += 0.25
        return min(score, 1.0)

    def best_match(self, message: str):
        """Return ``(item, score)`` for the best answer, or ``(None, score)``."""
        tokens = tokenize(message)
        if not tokens:
            return None, 0.0

        best_item = None
        best_score = 0.0
        for item, doc in zip(self.items, self.documents, strict=True):
            question_tokens = {t for t, w in doc.items() if w >= _QUESTION_WEIGHT}
            score = self._score(tokens, doc, question_tokens)
            if score > best_score:
                best_score = score
                best_item = item

        threshold = getattr(settings, "WHATSAPP_MATCH_THRESHOLD", 0.34)
        if best_item is not None and best_score >= threshold:
            return best_item, best_score
        return None, best_score


_cache: dict[str, object] = {"built": 0.0, "matcher": None}


def get_matcher(force: bool = False) -> FaqMatcher:
    """Build (and briefly cache) a matcher over the active FAQ items."""
    now = time.monotonic()
    cached = _cache["matcher"]
    if force or cached is None or (now - float(_cache["built"])) > _CACHE_TTL:
        items = list(
            FaqItem.objects.filter(is_active=True, category__is_active=True)
            .select_related("category")
            .order_by("order", "id")
        )
        cached = FaqMatcher(items)
        _cache["matcher"] = cached
        _cache["built"] = now
    return cached


def answer_for(message: str):
    """Convenience wrapper: return ``(FaqItem | None, score)`` for ``message``."""
    return get_matcher().best_match(message)
