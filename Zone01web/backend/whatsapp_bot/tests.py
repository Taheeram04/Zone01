"""Tests for the WhatsApp FAQ assistant (matching + webhook)."""

import json

from django.test import TestCase, override_settings
from django.urls import reverse

from content.models import FaqCategory, FaqItem
from whatsapp_bot import retrieval
from whatsapp_bot.models import WhatsAppMessage
from whatsapp_bot.retrieval import FaqMatcher, tokenize


class _FakeCategory:
    def __init__(self, title):
        self.title = title


class _FakeItem:
    """A lightweight stand-in so matcher logic can be tested without the DB."""

    def __init__(self, question, answer, keywords="", category="General"):
        self.question = question
        self.answer = answer
        self.keywords = keywords
        self.category = _FakeCategory(category)


class TokenizeTests(TestCase):
    def test_stopwords_are_removed_and_words_are_stemmed(self):
        self.assertEqual(tokenize("How do I apply?"), ["apply"])
        self.assertEqual(tokenize("What about the jobs?"), ["job"])

    def test_empty_input(self):
        self.assertEqual(tokenize(""), [])


class RetrievalTests(TestCase):
    def setUp(self):
        self.items = [
            _FakeItem(
                "How to apply?",
                "Create an account via Join us.",
                "apply, sign up, register",
                "Application Progress",
            ),
            _FakeItem(
                "How much does the training cost?",
                "It's tuition-free.",
                "cost, fees, tuition, price",
                "Course",
            ),
            _FakeItem(
                "When and where does the Piscine take place?",
                "On campus in Kisumu.",
                "piscine, location",
                "The Piscine",
            ),
        ]
        self.matcher = FaqMatcher(self.items)

    def test_matches_by_question_words(self):
        item, score = self.matcher.best_match("how do I apply for the program")
        self.assertEqual(item.question, "How to apply?")
        self.assertGreaterEqual(score, 0.34)

    def test_matches_by_keywords(self):
        item, _ = self.matcher.best_match("how much is the tuition")
        self.assertEqual(item.question, "How much does the training cost?")

    def test_typo_tolerance(self):
        item, _ = self.matcher.best_match("where is the piscne")
        self.assertEqual(item.question, "When and where does the Piscine take place?")

    def test_unrelated_message_returns_none(self):
        item, _ = self.matcher.best_match("what is the weather in nairobi tomorrow")
        self.assertIsNone(item)

    def test_empty_message_returns_none(self):
        item, score = self.matcher.best_match("")
        self.assertIsNone(item)
        self.assertEqual(score, 0.0)


@override_settings(
    WHATSAPP_VERIFY_TOKEN="verify-me",
    WHATSAPP_APP_SECRET="",
    WHATSAPP_DRY_RUN=True,
    WHATSAPP_FALLBACK_MESSAGE="Sorry, I could not find an answer for that.",
)
class WebhookTests(TestCase):
    def setUp(self):
        # The matcher is cached at module level; clear it so each test builds
        # one from the rows created inside this (rolled-back) transaction.
        retrieval._cache["matcher"] = None
        self.category = FaqCategory.objects.create(
            slug="application-progress",
            title="Application Progress",
        )
        self.item = FaqItem.objects.create(
            category=self.category,
            question="How to apply?",
            answer="Create an account via Join us.",
            keywords="apply, sign up, register",
        )

    def _payload(self, text, mid="wamid.TEST1", wa_id="254700000001"):
        return {
            "object": "whatsapp_business_account",
            "entry": [
                {
                    "id": "0",
                    "changes": [
                        {
                            "field": "messages",
                            "value": {
                                "messaging_product": "whatsapp",
                                "contacts": [{"wa_id": wa_id, "profile": {"name": "Test User"}}],
                                "messages": [
                                    {
                                        "from": wa_id,
                                        "id": mid,
                                        "timestamp": "1",
                                        "type": "text",
                                        "text": {"body": text},
                                    }
                                ],
                            },
                        }
                    ],
                }
            ],
        }

    def _post(self, payload):
        return self.client.post(
            reverse("whatsapp_bot:webhook"),
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_verification_handshake_echoes_challenge(self):
        response = self.client.get(
            reverse("whatsapp_bot:webhook"),
            {
                "hub.mode": "subscribe",
                "hub.verify_token": "verify-me",
                "hub.challenge": "1234",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b"1234")

    def test_verification_rejects_wrong_token(self):
        response = self.client.get(
            reverse("whatsapp_bot:webhook"),
            {
                "hub.mode": "subscribe",
                "hub.verify_token": "wrong",
                "hub.challenge": "1234",
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_inbound_message_gets_the_matching_answer(self):
        response = self._post(self._payload("how do i apply"))
        self.assertEqual(response.status_code, 200)

        inbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.INBOUND)
        outbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.OUTBOUND)
        self.assertEqual(inbound.contact.wa_id, "254700000001")
        self.assertEqual(inbound.contact.message_count, 1)
        self.assertEqual(outbound.body, self.item.answer)
        self.assertEqual(outbound.matched_faq, self.item)
        self.assertEqual(outbound.status, WhatsAppMessage.Status.DRY_RUN)

    def test_unknown_message_falls_back(self):
        self._post(self._payload("what is the weather in nairobi"))
        outbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.OUTBOUND)
        self.assertIsNone(outbound.matched_faq)
        self.assertEqual(outbound.body, "Sorry, I could not find an answer for that.")

    def test_duplicate_delivery_is_ignored(self):
        payload = self._payload("how do i apply")
        self._post(payload)
        self._post(payload)
        self.assertEqual(
            WhatsAppMessage.objects.filter(direction=WhatsAppMessage.Direction.INBOUND).count(),
            1,
        )

    def test_non_text_message_is_ignored(self):
        payload = self._payload("how do i apply")
        message = payload["entry"][0]["changes"][0]["value"]["messages"][0]
        message["type"] = "image"
        self._post(payload)
        self.assertEqual(WhatsAppMessage.objects.count(), 0)
