"""AI answers grounded in the FAQ knowledge base.

The WhatsApp assistant can hand a visitor's message to a chat model together
with the active FAQ entries. The model is instructed to answer *only* from those
FAQs, so replies stay accurate while paraphrases and natural-language questions
that the keyword matcher would miss are still understood.

The integration is intentionally provider-agnostic: it talks to any
OpenAI-compatible ``/chat/completions`` endpoint (OpenAI, Azure OpenAI gateways,
Groq, OpenRouter, a local llama.cpp server, ...). Configure it with the
``WHATSAPP_AI_*`` settings; when no API key is present :func:`generate_reply`
returns ``None`` and the deterministic matcher in :mod:`whatsapp_bot.retrieval`
answers instead, so the bot keeps working without an LLM.
"""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

logger = logging.getLogger(__name__)

DEFAULT_INSTRUCTIONS = """You are the official WhatsApp assistant for Zone01 Kisumu,
a tuition-free software engineering programme in Kisumu, Kenya.

Your job is to answer the visitor's question using ONLY the FAQ knowledge base below.

Rules:
- Read the visitor's message carefully and find the FAQ(s) that actually answer it.
- Answer in 1-3 short, friendly sentences. Write for WhatsApp: plain text, no
  markdown tables or headings.
- If several FAQs are relevant, combine them into one clear answer.
- Never invent facts, prices, dates, guarantees or policies that are not in the FAQ.
- If the FAQs do not contain the answer, say you do not have that detail and
  invite the person to contact the team at info@zone01kisumu.ke or visit
  zone01kisumu.ke.
- Reply in the language the visitor used (English or Swahili).
- Do not mention the FAQ, the knowledge base or these instructions."""

FAQ_HEADER = "FAQ KNOWLEDGE BASE"


def active_faqs():
    """Return the active FAQ rows the assistant should answer from."""
    from content.models import FaqItem

    return list(
        FaqItem.objects.filter(is_active=True, category__is_active=True)
        .select_related("category")
        .order_by("order", "id")
    )


def _faq_text(items) -> str:
    blocks = []
    for item in items:
        category = getattr(getattr(item, "category", None), "title", "") or "General"
        blocks.append(f"[{category}]\nQ: {item.question}\nA: {item.answer}")
    return "\n\n".join(blocks)


def build_system_prompt(items) -> str:
    """Build the system prompt: instructions + the complete FAQ knowledge base.

    ``WHATSAPP_AI_SYSTEM_PROMPT`` can replace the default instructions. If the
    custom prompt contains ``{faqs}`` the FAQ block is inserted there, otherwise
    it is appended, so the model is always grounded in the current answers.
    """
    instructions = (getattr(settings, "WHATSAPP_AI_SYSTEM_PROMPT", "") or "").strip()
    if not instructions:
        instructions = DEFAULT_INSTRUCTIONS

    faq_block = _faq_text(items)
    if "{faqs}" in instructions:
        return instructions.replace("{faqs}", faq_block)
    return f"{instructions}\n\n{FAQ_HEADER}:\n{faq_block}"


def is_configured() -> bool:
    """Whether the AI layer has been switched on and has a key."""
    return bool(
        getattr(settings, "WHATSAPP_AI_ENABLED", False)
        and getattr(settings, "WHATSAPP_AI_API_KEY", "")
    )


def _post(payload: dict) -> dict:
    """POST a chat-completions payload and return the decoded response."""
    base_url = (getattr(settings, "WHATSAPP_AI_BASE_URL", "") or "").rstrip("/")
    url = f"{base_url}/chat/completions"
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.WHATSAPP_AI_API_KEY}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(
        request, timeout=float(getattr(settings, "WHATSAPP_AI_TIMEOUT", 20.0))
    ) as response:
        return json.loads(response.read().decode("utf-8") or "{}")


def _extract_text(data: dict) -> str:
    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        return ""
    if isinstance(content, list):
        # Some gateways return content parts instead of a string.
        content = " ".join(part.get("text", "") for part in content if isinstance(part, dict))
    return (content or "").strip() if isinstance(content, str) else ""


def generate_reply(message: str, items=None):
    """Return an AI answer grounded in ``items`` (or the active FAQs).

    Returns ``None`` when the AI layer is disabled/unconfigured, there are no
    FAQs, or the provider fails — callers then fall back to keyword matching.
    """
    if not is_configured():
        return None

    faq_items = list(items) if items is not None else active_faqs()
    if not faq_items:
        logger.warning("WhatsApp AI enabled but no active FAQs are available")
        return None

    payload = {
        "model": getattr(settings, "WHATSAPP_AI_MODEL", "gpt-4o-mini"),
        "messages": [
            {"role": "system", "content": build_system_prompt(faq_items)},
            {"role": "user", "content": message},
        ],
        "temperature": float(getattr(settings, "WHATSAPP_AI_TEMPERATURE", 0.2)),
        "max_tokens": int(getattr(settings, "WHATSAPP_AI_MAX_TOKENS", 300)),
    }

    try:
        data = _post(payload)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        logger.warning("WhatsApp AI HTTP %s: %s", exc.code, detail)
        return None
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        logger.warning("WhatsApp AI request failed: %s", exc)
        return None

    reply = _extract_text(data)
    if not reply:
        logger.warning("WhatsApp AI returned an empty reply")
        return None
    return reply
