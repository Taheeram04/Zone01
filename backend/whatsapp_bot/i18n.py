"""Language detection for incoming WhatsApp messages.

The assistant serves English- and Swahili-speaking visitors. Django's locale
machinery is not used here: the language of a WhatsApp message is decided from
the message text itself, then used to pick the matching FAQ translation.

Detection is deliberately lightweight and dependency-free. It looks for
distinctive Swahili words rather than trying to classify every language, and
defaults to English when the message is ambiguous. That is safe: an English
answer is still useful to a bilingual visitor, and the AI layer (when enabled)
is instructed to mirror the visitor's language.
"""

from __future__ import annotations

import re

DEFAULT_LANGUAGE = "en"
SWAHILI = "sw"

#: Words that are distinctive enough to identify a Swahili message. Common
#: one-letter particles ("na", "ya", "ni") are intentionally excluded because
#: they also occur in names and English abbreviations.
SWAHILI_MARKERS = frozenset(
    """
    habari asante karibu tafadhali samahani ndiyo hapana nini vipi lini wapi gani
    ngapi kwa katika hii hiyo huyu wangu yetu yako mimi wewe sisi ninyi wao
    ninaweza unaweza tunaweza nataka unataka tunataka naomba kuomba maombi
    kujiunga kujisajili masomo mafunzo shule mwanafunzi wanafunzi mwalimu
    walimu kusoma kufanya kazi ajira pesa bei gharama malipo bure posho msaada
    malazi chakula usafiri mahali muda siku wiki mwezi mwaka miaka leo kesho
    jana sawa pole kwaheri mambo jambo hujambo sijambo niaje mzuri vizuri
    kidogo sana pia lakini hadi kutoka kwenye iko ziko yuko niko tuna mna wana
    hakuna kuna una nina ana
    """.split()
)

_WORD_RE = re.compile(r"[a-z']+")


def detect_language(text: str) -> str:
    """Return ``"sw"`` for Swahili messages, otherwise ``"en"``."""
    words = _WORD_RE.findall((text or "").lower())
    if not words:
        return DEFAULT_LANGUAGE

    markers = sum(1 for word in words if word in SWAHILI_MARKERS)
    if not markers:
        return DEFAULT_LANGUAGE

    # Short greetings ("habari", "msaada tafadhali") are overwhelmingly
    # Swahili; for longer messages require a reasonable share so an English
    # sentence that happens to mention a Swahili word is not misclassified.
    if len(words) <= 6:
        return SWAHILI
    return SWAHILI if markers >= 3 or markers / len(words) >= 0.2 else DEFAULT_LANGUAGE
