"""Tests for the WhatsApp FAQ assistant (matching + webhook)."""

import json
import urllib.error
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from content.models import FaqCategory, FaqItem
from whatsapp_bot import ai, retrieval, views
from whatsapp_bot.i18n import detect_language
from whatsapp_bot.models import WhatsAppContact, WhatsAppMessage
from whatsapp_bot.retrieval import FaqMatcher, tokenize


class _FakeCategory:
    def __init__(self, title):
        self.title = title


class _FakeItem:
    """A lightweight stand-in so matcher logic can be tested without the DB."""

    def __init__(self, question, answer, keywords="", category="General", translations=None):
        self.question = question
        self.answer = answer
        self.keywords = keywords
        self.category = _FakeCategory(category)
        self.translations = translations or {}

    def answer_for(self, language):
        translation = self.translations.get(language) or {}
        return translation.get("answer") or self.answer


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
        item, score = self.matcher.best_match("how do I apply")
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


class TranslatedRetrievalTests(TestCase):
    """Swahili FAQ data must participate in matching, not just be stored."""

    def setUp(self):
        self.item = _FakeItem(
            "How to apply?",
            "Create an account via Join us.",
            "apply, sign up, register",
            translations={
                "sw": {
                    "question": "Jinsi ya kuomba?",
                    "answer": "Fungua akaunti kupitia Join us.",
                    "keywords": "kuomba, maombi, kujiunga, jisajili",
                }
            },
        )
        self.matcher = FaqMatcher([self.item])

    def test_swahili_question_matches_through_its_translation(self):
        item, score = self.matcher.best_match("Jinsi ya kuomba?")

        self.assertIs(item, self.item)
        self.assertGreaterEqual(score, 0.34)
        self.assertEqual(item.answer_for("sw"), "Fungua akaunti kupitia Join us.")

    def test_swahili_keywords_match_through_their_translation(self):
        item, _ = self.matcher.best_match("Maombi ya kujiunga?")

        self.assertIs(item, self.item)

    def test_swahili_answer_falls_back_to_english_when_untranslated(self):
        self.assertEqual(self.item.answer_for("fr"), self.item.answer)


class ComposeReplyTests(TestCase):
    """The removed fallback setting must never be read by the webhook."""

    def setUp(self):
        self.matcher = FaqMatcher(
            [_FakeItem("How to apply?", "Create an account via Join us.", "apply, register")]
        )

    @override_settings(WHATSAPP_AI_ENABLED=False)
    def test_unmatched_message_returns_no_reply(self):
        reply, matched, score = views._compose_reply(
            "what is the weather in nairobi", self.matcher, "en"
        )

        self.assertIsNone(reply)
        self.assertIsNone(matched)
        self.assertGreaterEqual(score, 0.0)

    @override_settings(WHATSAPP_AI_ENABLED=False)
    def test_matched_message_uses_the_requested_language(self):
        item = _FakeItem(
            "How to apply?",
            "Create an account via Join us.",
            "apply, register",
            translations={"sw": {"answer": "Fungua akaunti kupitia Join us."}},
        )
        matcher = FaqMatcher([item])

        reply, matched, _ = views._compose_reply("how do i apply", matcher, "sw")

        self.assertIs(matched, item)
        self.assertEqual(reply, "Fungua akaunti kupitia Join us.")


@override_settings(
    WHATSAPP_VERIFY_TOKEN="verify-me",
    WHATSAPP_APP_SECRET="",
    WHATSAPP_DRY_RUN=True,
    WHATSAPP_WELCOME_MESSAGE="",
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

    def test_unknown_message_gets_no_reply(self):
        self._post(self._payload("what is the weather in nairobi"))
        self.assertFalse(
            WhatsAppMessage.objects.filter(direction=WhatsAppMessage.Direction.OUTBOUND).exists()
        )

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


@override_settings(
    WHATSAPP_APP_SECRET="",
    WHATSAPP_DRY_RUN=True,
    WHATSAPP_AI_ENABLED=True,
    WHATSAPP_AI_API_KEY="test-key",
    WHATSAPP_AI_MODEL="test-model",
    WHATSAPP_WELCOME_MESSAGE="",
)
class AIAnswerTests(TestCase):
    def setUp(self):
        retrieval.clear_cache()
        self.category = FaqCategory.objects.create(
            slug="application-progress",
            title="Application Progress",
        )
        self.item = FaqItem.objects.create(
            category=self.category,
            question="How to apply?",
            answer="Create an account via Join us, then take the cognitive tests.",
            keywords="apply, sign up, register",
        )

    def _payload(self, text):
        return {
            "entry": [
                {
                    "changes": [
                        {
                            "value": {
                                "contacts": [
                                    {
                                        "wa_id": "254700000002",
                                        "profile": {"name": "AI Tester"},
                                    }
                                ],
                                "messages": [
                                    {
                                        "from": "254700000002",
                                        "id": "wamid.AI1",
                                        "type": "text",
                                        "text": {"body": text},
                                    }
                                ],
                            }
                        }
                    ]
                }
            ]
        }

    def _post(self, text):
        return self.client.post(
            reverse("whatsapp_bot:webhook"),
            data=json.dumps(self._payload(text)),
            content_type="application/json",
        )

    def test_system_prompt_contains_the_faq_answers(self):
        prompt = ai.build_system_prompt([self.item])
        self.assertIn(self.item.question, prompt)
        self.assertIn(self.item.answer, prompt)
        self.assertIn("Zone01 Kisumu", prompt)

    def test_ai_reply_is_used_when_configured(self):
        fake = {"choices": [{"message": {"content": "Create an account via Join us."}}]}
        with patch("whatsapp_bot.ai._post", return_value=fake) as post:
            self._post("how do I get started?")

        outbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.OUTBOUND)
        self.assertEqual(outbound.body, "Create an account via Join us.")
        payload = post.call_args.args[0]
        self.assertEqual(payload["model"], "test-model")
        self.assertIn(self.item.answer, payload["messages"][0]["content"])
        self.assertEqual(payload["messages"][1]["content"], "how do I get started?")

    def test_ai_failure_falls_back_to_the_faq_answer(self):
        with patch("whatsapp_bot.ai._post", side_effect=urllib.error.URLError("offline")):
            self._post("how do i apply")

        outbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.OUTBOUND)
        self.assertEqual(outbound.body, self.item.answer)

    def test_ai_disabled_uses_keyword_match(self):
        with override_settings(WHATSAPP_AI_ENABLED=False), patch("whatsapp_bot.ai._post") as post:
            self._post("how do i apply")
        post.assert_not_called()
        outbound = WhatsAppMessage.objects.get(direction=WhatsAppMessage.Direction.OUTBOUND)
        self.assertEqual(outbound.body, self.item.answer)

    def test_no_answer_sentinel_produces_no_reply(self):
        fake = {"choices": [{"message": {"content": "NO_ANSWER"}}]}
        with patch("whatsapp_bot.ai._post", return_value=fake):
            self._post("what is the weather in nairobi")
        self.assertFalse(
            WhatsAppMessage.objects.filter(direction=WhatsAppMessage.Direction.OUTBOUND).exists()
        )

    def test_swahili_prompt_instructs_the_model(self):
        prompt = ai.build_system_prompt([self.item], language="sw")
        self.assertIn("Swahili", prompt)

    def test_faq_edits_clear_the_matcher_cache(self):
        retrieval.get_matcher()
        self.assertIsNotNone(retrieval._cache["matcher"])
        self.item.answer = "Updated answer."
        self.item.save()
        self.assertIsNone(retrieval._cache["matcher"])


class LanguageDetectionTests(TestCase):
    def test_english_is_the_default(self):
        self.assertEqual(detect_language("How much is the tuition?"), "en")
        self.assertEqual(detect_language(""), "en")

    def test_swahili_questions_are_detected(self):
        self.assertEqual(detect_language("Bei ya masomo ni ngapi?"), "sw")
        self.assertEqual(detect_language("Ninaweza kujiunga vipi?"), "sw")
        self.assertEqual(detect_language("Habari"), "sw")

    def test_english_sentence_with_a_swahili_word_stays_english(self):
        message = "I am applying from Nairobi and I would like to know the fees for the programme."
        self.assertEqual(detect_language(message), "en")


@override_settings(
    WHATSAPP_APP_SECRET="",
    WHATSAPP_DRY_RUN=True,
    WHATSAPP_AI_ENABLED=False,
    WHATSAPP_WELCOME_MESSAGE="Welcome to Zone01!",
    WHATSAPP_WELCOME_MESSAGE_SW="Karibu Zone01!",
)
class WelcomeMessageTests(TestCase):
    """The greeting is sent once per conversation, before the first answer."""

    wa_id = "254700000003"

    def setUp(self):
        retrieval.clear_cache()
        self.category = FaqCategory.objects.create(
            slug="application-progress",
            title="Application Progress",
        )
        self.item = FaqItem.objects.create(
            category=self.category,
            question="How to apply?",
            answer="Create an account via Join us.",
            keywords="apply, sign up, register",
            translations={
                "sw": {
                    "question": "Jinsi ya kuomba?",
                    "answer": "Fungua akaunti kupitia Join us.",
                    "keywords": "kuomba, maombi, kujiunga",
                }
            },
        )

    def _post(self, text, mid):
        payload = {
            "entry": [
                {
                    "changes": [
                        {
                            "value": {
                                "contacts": [
                                    {
                                        "wa_id": self.wa_id,
                                        "profile": {"name": "Welcome Tester"},
                                    }
                                ],
                                "messages": [
                                    {
                                        "from": self.wa_id,
                                        "id": mid,
                                        "type": "text",
                                        "text": {"body": text},
                                    }
                                ],
                            }
                        }
                    ]
                }
            ]
        }
        return self.client.post(
            reverse("whatsapp_bot:webhook"),
            data=json.dumps(payload),
            content_type="application/json",
        )

    def _outbound_bodies(self):
        return [
            message.body
            for message in WhatsAppMessage.objects.filter(
                direction=WhatsAppMessage.Direction.OUTBOUND
            ).order_by("created_at")
        ]

    def test_first_message_gets_welcome_then_answer(self):
        self._post("how do i apply", "wamid.W1")

        self.assertEqual(
            self._outbound_bodies(),
            ["Welcome to Zone01!", self.item.answer],
        )
        welcome = WhatsAppMessage.objects.filter(
            direction=WhatsAppMessage.Direction.OUTBOUND
        ).order_by("created_at")[0]
        self.assertEqual(welcome.status, WhatsAppMessage.Status.DRY_RUN)

    def test_greeting_gets_only_the_welcome(self):
        self._post("hi", "wamid.W2")

        self.assertEqual(self._outbound_bodies(), ["Welcome to Zone01!"])

    def test_follow_up_in_the_same_session_skips_the_welcome(self):
        self._post("hi", "wamid.W3")
        self._post("how do i apply", "wamid.W4")

        self.assertEqual(
            self._outbound_bodies(),
            ["Welcome to Zone01!", self.item.answer],
        )

    def test_welcome_returns_after_24_hours_of_silence(self):
        self._post("hi", "wamid.W5")
        WhatsAppContact.objects.update(last_seen=timezone.now() - timedelta(hours=25))
        self._post("how do i apply", "wamid.W6")

        self.assertEqual(
            self._outbound_bodies(),
            ["Welcome to Zone01!", "Welcome to Zone01!", self.item.answer],
        )

    def test_swahili_message_gets_swahili_welcome_and_answer(self):
        self._post("Jinsi ya kuomba?", "wamid.SW1")

        self.assertEqual(
            self._outbound_bodies(),
            ["Karibu Zone01!", "Fungua akaunti kupitia Join us."],
        )

    def test_english_message_still_gets_english_answer(self):
        self._post("how do i apply", "wamid.EN1")

        self.assertEqual(
            self._outbound_bodies(),
            ["Welcome to Zone01!", self.item.answer],
        )

    def test_untranslated_answer_falls_back_to_the_english_text(self):
        self.item.translations = {}
        self.item.keywords = "apply, sign up, register, jinsi, kuomba, maombi"
        self.item.save()
        retrieval.clear_cache()

        self._post("Jinsi ya kuomba?", "wamid.SW2")

        self.assertEqual(
            self._outbound_bodies(),
            ["Karibu Zone01!", self.item.answer],
        )
