"""Relevance ranking for the Django admin changelist search.

Django's built-in changelist search compiles ``search_fields`` into a chain of
``icontains`` predicates, which :mod:`core.lookups` renders as ``ILIKE
'%term%'``. Combined with the ``pg_trgm`` indexes declared via
:class:`core.indexes.GinTrigramIndex`, PostgreSQL answers those from a GIN index
rather than a sequential scan, so *filtering* is already fast.

What Django cannot do is *rank* the matches: the changelist falls back to the
model's default ordering, which for these models means "newest first" and so
buries the best match. :class:`TrigramSearchMixin` adds a ``SIMILARITY()`` score
over the searched columns and orders the results by it, so the closest match
comes first while the matching rows themselves are unchanged.

The mixin is a no-op on non-PostgreSQL backends, on admin classes that do not
opt in, and whenever the search term has no trigram-sized word, in which case
Django's own search behaviour is used unchanged.
"""

import re
from itertools import islice

from django.contrib.admin.views.main import ORDER_VAR
from django.contrib.postgres.search import TrigramSimilarity
from django.db import connection
from django.db.models import Case, F, FloatField, TextField, Value, When
from django.db.models.functions import Coalesce, Concat

#: A trigram needs three characters, so shorter words cannot be scored and are
#: left to Django's own matching.
TRIGRAM_MIN_TERM_LENGTH = 3

#: Annotation holding the relevance score, and the prefix for the per-term scores.
RANK_ANNOTATION = "trigram_rank"
SCORE_PREFIX = "trigram_score_"

_WORD_RE = re.compile(r"\w+")


class TrigramSearchMixin:
    """Order changelist search results by trigram similarity.

    Subclass alongside :class:`~django.contrib.admin.ModelAdmin` and list the
    columns to score in :attr:`trigram_search_fields`::

        @admin.register(Article)
        class ArticleAdmin(TrigramSearchMixin, admin.ModelAdmin):
            trigram_search_fields = ("title", "summary", "body")

    An explicit column ordering from the changelist (the ``?o=`` parameter) or
    from the admin's own ``ordering`` still wins; ranking only fills in for the
    default ordering, and only while a search term is present.
    """

    #: Columns concatenated into a single text value that is scored.
    trigram_search_fields: tuple[str, ...] = ()

    #: Upper bound on scored words, which keeps the generated SQL small.
    trigram_max_terms = 4

    def trigram_search_enabled(self) -> bool:
        """Whether this admin can be ranked on the current database."""
        return bool(self.trigram_search_fields) and connection.vendor == "postgresql"

    def trigram_terms(self, search_term: str) -> list[str]:
        """Scoreable words of ``search_term``, capped at :attr:`trigram_max_terms`."""
        words = (
            word for word in _WORD_RE.findall(search_term) if len(word) >= TRIGRAM_MIN_TERM_LENGTH
        )
        return list(islice(words, self.trigram_max_terms))

    def _trigram_rank_terms(self, request, search_term: str) -> list[str]:
        """Terms to score for this request, or empty when ranking is not wanted."""
        if not self.trigram_search_enabled() or self.ordering:
            return []
        if request.GET.get(ORDER_VAR):
            return []
        return self.trigram_terms(search_term)

    def _trigram_search_blob(self) -> Concat:
        """The scored columns as one NULL-free text expression."""
        empty = Value("", output_field=TextField())
        space = Value(" ", output_field=TextField())
        parts: list = [space]
        for path in self.trigram_search_fields:
            parts.extend((Coalesce(F(path), empty, output_field=TextField()), space))
        return Concat(*parts[1:-1], output_field=TextField())

    def _best_score(self, aliases: list[str]):
        """The highest of the per-term scores, referencing them by alias.

        Comparing the already-annotated scores keeps the SQL linear in the number
        of terms, rather than nesting the ``SIMILARITY()`` calls inside each
        ``CASE`` of the next one.
        """
        best = F(aliases[0])
        for alias in aliases[1:]:
            best = Case(
                When(**{f"{alias}__gt": best}, then=F(alias)),
                default=best,
                output_field=FloatField(),
            )
        return best

    def get_search_results(self, request, queryset, search_term):
        queryset, may_have_duplicates = super().get_search_results(request, queryset, search_term)
        terms = self._trigram_rank_terms(request, search_term)
        if not terms:
            return queryset, may_have_duplicates

        blob = self._trigram_search_blob()
        annotations = {
            f"{SCORE_PREFIX}{position}": TrigramSimilarity(blob, Value(term))
            for position, term in enumerate(terms)
        }
        annotations[RANK_ANNOTATION] = self._best_score(list(annotations))
        queryset = queryset.annotate(**annotations)

        # The changelist resolves ORDER BY before running the search, so the
        # score cannot be injected through get_ordering(); prepend it to the
        # ordering already chosen here instead. The primary key is appended as a
        # tiebreaker when the model has no default ordering, to keep pagination
        # stable across identical scores.
        ordering = [f"-{RANK_ANNOTATION}", *queryset.query.order_by]
        if len(ordering) == 1:
            ordering.append("-pk")
        return queryset.order_by(*ordering), may_have_duplicates
