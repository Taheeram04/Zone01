"""WhatsApp Cloud API webhook.

One endpoint handles both halves of the Meta webhook contract:

* ``GET``  - verification handshake (echo the ``hub.challenge`` when the token
  matches ``WHATSAPP_VERIFY_TOKEN``).
* ``POST`` - event delivery. Each inbound text message is matched against the
  FAQ knowledge base (see :mod:`whatsapp_bot.retrieval`) and answered in the
  visitor's language. The first message of a conversation (or the first after
  24 hours of silence) also gets a welcome message.

If a question cannot be answered from the FAQs, no reply is sent: the message
stays in the admin inbox for the communication team to handle personally.

Processing is synchronous and always returns ``200`` to Meta, even when an
internal error occurs, so a transient failure cannot trigger an endless retry
loop. Failures are logged and captured on the message row for staff to review.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
from datetime import timedelta

from django.conf import settings
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from whatsapp_bot import ai, client
from whatsapp_bot.i18n import SWAHILI, detect_language
from whatsapp_bot.models import WhatsAppContact, WhatsAppMessage
from whatsapp_bot.retrieval import get_matcher, tokenize

logger = logging.getLogger(__name__)

#: WhatsApp's customer-service window. A reply more than 24 hours after the
#: last inbound message starts a new conversation, so we greet again.
SESSION_WINDOW = timedelta(hours=24)

#: Bare greetings. They get the welcome message but no FAQ answer.
GREETING_WORDS = frozenset(
    {
        "hi",
        "hello",
        "hey",
        "habari",
        "jambo",
        "mambo",
        "sasa",
        "vipi",
        "niaje",
        "hujambo",
        "sijambo",
        "habari yako",
        "habari za asubuhi",
        "habari za mchana",
        "habari za jioni",
        "mambo vipi",
        "morning",
        "afternoon",
        "evening",
        "good morning",
        "good afternoon",
        "good evening",
    }
)


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


def _compose_reply(text, matcher, language):
    """Return ``(reply_text | None, matched_faq | None, score)``.

    The AI layer, when configured, answers from the FAQ knowledge base with a
    real language model and mirrors the visitor's language. The keyword matcher
    runs first so its best FAQ is recorded for the audit trail and used as the
    fallback if the AI call fails or is disabled.

    ``None`` means the question is not covered by the FAQs. The caller then
    sends nothing, leaving the conversation for the communication team.
    """
    item, score = matcher.best_match(text)
    ai_reply = ai.generate_reply(
        text,
        items=getattr(matcher, "items", None),
        language=language,
    )
    if ai_reply:
        return ai_reply, item, score
    if item is not None:
        return item.answer_for(language), item, score
    return None, None, score


def _welcome_for(language: str) -> str:
    """Return the welcome message for ``language`` (English if untranslated)."""
    setting = "WHATSAPP_WELCOME_MESSAGE_SW" if language == SWAHILI else "WHATSAPP_WELCOME_MESSAGE"
    return (
        getattr(settings, setting, "") or getattr(settings, "WHATSAPP_WELCOME_MESSAGE", "") or ""
    ).strip()


def _is_greeting(text: str) -> bool:
    """Whether a message is only a greeting (so no FAQ answer is needed)."""
    cleaned = " ".join(text.lower().strip("!.,?¿¡ ").split())
    return not cleaned or cleaned in GREETING_WORDS or not tokenize(cleaned)


def _starts_new_session(contact) -> bool:
    """Whether this inbound message opens a fresh 24-hour conversation."""
    if contact.message_count == 0:
        return True
    return timezone.now() - contact.last_seen > SESSION_WINDOW


def _send_and_record(contact, wa_id, body, matched=None, score=None):
    """Send one outbound message and persist it, logging any delivery error."""
    outbound = WhatsAppMessage(
        contact=contact,
        direction=WhatsAppMessage.Direction.OUTBOUND,
        body=body,
        matched_faq=matched,
        match_score=score,
    )
    try:
        message_id, status = client.send_text(wa_id, body)
        outbound.wa_message_id = message_id
        outbound.status = status
    except client.WhatsAppSendError as exc:
        outbound.status = WhatsAppMessage.Status.FAILED
        outbound.error = str(exc)
        logger.warning("Failed to send WhatsApp reply to %s: %s", wa_id, exc)
    outbound.save()
    return outbound


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
    language = detect_language(body)
    name = names.get(wa_id, "")

    contact, _created = WhatsAppContact.objects.get_or_create(
        wa_id=wa_id, defaults={"profile_name": name}
    )
    new_session = _starts_new_session(contact)
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

    if new_session:
        welcome = _welcome_for(language)
        if welcome:
            _send_and_record(contact, wa_id, welcome)
        # A bare "hi"/"hello" is answered by the welcome itself.
        if _is_greeting(body):
            return

    reply, matched, score = _compose_reply(body, matcher, language)
    if reply:
        _send_and_record(contact, wa_id, reply, matched, score)
