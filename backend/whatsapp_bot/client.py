"""Minimal client for the Meta WhatsApp Cloud API.

Only text replies are needed, so this wraps the ``/messages`` endpoint directly
with the standard library (no extra dependency). Set ``WHATSAPP_DRY_RUN=true``
(the default) to log replies instead of sending them, which is how you exercise
the webhook locally without a real WhatsApp number.
"""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

logger = logging.getLogger(__name__)

GRAPH_BASE = "https://graph.facebook.com"


class WhatsAppSendError(Exception):
    """Raised when the Cloud API rejects or cannot be reached for a send."""


def is_configured() -> bool:
    """Whether an access token and phone number id are present."""
    return bool(settings.WHATSAPP_ACCESS_TOKEN and settings.WHATSAPP_PHONE_NUMBER_ID)


def send_text(wa_id: str, body: str):
    """Send a text message to ``wa_id``.

    Returns ``(message_id, status)``. In dry-run mode (or when unconfigured) no
    HTTP call is made and ``message_id`` is ``None``. Raises
    :class:`WhatsAppSendError` on failure so the caller can log it.
    """
    if settings.WHATSAPP_DRY_RUN or not is_configured():
        logger.info("[WhatsApp dry-run] -> %s: %s", wa_id, body)
        return None, "dry_run"

    url = (
        f"{GRAPH_BASE}/{settings.WHATSAPP_API_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    )
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": wa_id,
        "type": "text",
        "text": {"preview_url": False, "body": body},
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=settings.WHATSAPP_TIMEOUT) as response:
            result = json.loads(response.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise WhatsAppSendError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise WhatsAppSendError(str(exc)) from exc

    messages = result.get("messages") or []
    message_id = messages[0].get("id") if messages else None
    return message_id, "sent"
