"""WhatsApp Cloud API webhook.

One endpoint handles both halves of the Meta webhook contract:

* ``GET``  - verification handshake (echo the ``hub.challenge`` when the token
  matches ``WHATSAPP_VERIFY_TOKEN``).
* ``POST`` - event delivery. Each inbound text message is matched against the
  FAQ knowledge base (see :mod:`whatsapp_bot.retrieval`) and answered.

Processing is synchronous and always returns ``200`` to Meta, even when an
internal error occurs, so a transient failure cannot trigger an endless retry
loop. Failures are logged and captured on the message row for staff to review.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import logging

from django.conf import settings
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.views.decorators.csrf import csrf_exempt

from whatsapp_bot import client
from whatsapp_bot.models import WhatsAppContact, WhatsAppMessage
from whatsapp_bot.retrieval import get_matcher

logger = logging.getLogger(__name__)


@csrf_exempt
def webhook(request):
    """Dispatch the verification handshake and event deliveries by method."""
    if request.method == "GET":
        return _verify(request)
    if request.method == "POST":
        return _receive(request)
    return HttpResponseNotAllowed(["GET", "POST"])


def _verify(request):
    """Answer Meta's ``hub.challenge`` when the verify token matches."""
    mode = request.GET.get("hub.mode")
    token = request.GET.get("hub.verify_token") or ""
    challenge = request.GET.get("hub.challenge") or ""
    expected = settings.WHATSAPP_VERIFY_TOKEN or ""
    if mode == "subscribe" and expected and hmac.compare_digest(token, expected):
        return HttpResponse(challenge, content_type="text/plain")
    return HttpResponse("Verification failed", status=403, content_type="text/plain")


def _signature_ok(request) -> bool:
    """Verify the ``X-Hub-Signature-256`` header against the app secret.

    Signing is skipped when ``WHATSAPP_APP_SECRET`` is unset (local/dev), which
    keeps the webhook usable without real credentials.
    """
    secret = settings.WHATSAPP_APP_SECRET
    if not secret:
        return True
    header = request.headers.get("X-Hub-Signature-256", "")
    prefix = "sha256="
    if not header.startswith(prefix):
        return False
    expected = hmac.new(secret.encode("utf-8"), request.body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(header[len(prefix) :], expected)


def _receive(request):
    if not _signature_ok(request):
        return HttpResponse("Invalid signature", status=403, content_type="text/plain")
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError):
        return HttpResponseBadRequest("Invalid JSON")
    try:
        _process(payload)
    except Exception:  # noqa: BLE001 - never bounce an error back to Meta
        logger.exception("Error while processing WhatsApp webhook payload")
    return JsonResponse({"status": "ok"})


def _process(payload):
    """Walk a webhook payload and answer every inbound text message."""
    matcher = get_matcher()
    for entry in payload.get("entry", []) or []:
        for change in entry.get("changes", []) or []:
            value = change.get("value", {}) or {}
            names = {
                contact.get("wa_id"): (contact.get("profile") or {}).get("name", "")
                for contact in value.get("contacts", []) or []
            }
            for message in value.get("messages", []) or []:
                _handle_message(message, names, matcher)


def _compose_reply(text, matcher):
    """Return ``(reply_text, matched_faq | None, score)`` for an inbound message."""
    item, score = matcher.best_match(text)
    if item is not None:
        return item.answer, item, score
    return settings.WHATSAPP_FALLBACK_MESSAGE, None, score


def _handle_message(message, names, matcher):
    """Answer one inbound message, logging both sides of the exchange."""
    if message.get("type") != "text":
        return
    wa_id = message.get("from")
    wa_message_id = message.get("id")
    if not wa_id or not wa_message_id:
        return
    # Meta retries deliveries; a known id means we already handled this one.
    if WhatsAppMessage.objects.filter(wa_message_id=wa_message_id).exists():
        return

    body = ((message.get("text") or {}).get("body") or "").strip()
    name = names.get(wa_id, "")

    contact, _created = WhatsAppContact.objects.get_or_create(
        wa_id=wa_id, defaults={"profile_name": name}
    )
    if name and name != contact.profile_name:
        contact.profile_name = name
    contact.message_count += 1
    contact.save(update_fields=["profile_name", "message_count", "last_seen"])

    WhatsAppMessage.objects.create(
        contact=contact,
        direction=WhatsAppMessage.Direction.INBOUND,
        body=body,
        wa_message_id=wa_message_id,
        status=WhatsAppMessage.Status.RECEIVED,
    )

    reply, matched, score = _compose_reply(body, matcher)
    outbound = WhatsAppMessage(
        contact=contact,
        direction=WhatsAppMessage.Direction.OUTBOUND,
        body=reply,
        matched_faq=matched,
        match_score=score,
    )
    try:
        message_id, status = client.send_text(wa_id, reply)
        outbound.wa_message_id = message_id
        outbound.status = status
    except client.WhatsAppSendError as exc:
        outbound.status = WhatsAppMessage.Status.FAILED
        outbound.error = str(exc)
        logger.warning("Failed to send WhatsApp reply to %s: %s", wa_id, exc)
    outbound.save()
