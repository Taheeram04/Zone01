from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from core.models import PiscineCountdown


class HealthEndpointTests(TestCase):
    def test_health_reports_ok(self):
        response = self.client.get("/healthz")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["database"], "ok")
        self.assertIn("version", body)


class PiscineCountdownEndpointTests(TestCase):
    def test_reports_active_countdown_for_a_future_piscine(self):
        PiscineCountdown.objects.update_or_create(
            pk=1,
            defaults={
                "label": "Next Piscine",
                "is_enabled": True,
                "starts_at": timezone.now() + timedelta(days=5),
            },
        )

        response = self.client.get("/api/piscine/")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["label"], "Next Piscine")
        self.assertTrue(body["is_active"])
        self.assertIsNotNone(body["starts_at"])
        self.assertEqual(response["Access-Control-Allow-Origin"], "*")

    def test_countdown_switches_off_once_the_piscine_starts(self):
        PiscineCountdown.objects.update_or_create(
            pk=1,
            defaults={
                "is_enabled": True,
                "starts_at": timezone.now() - timedelta(minutes=1),
            },
        )

        response = self.client.get("/api/piscine/")

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["is_active"])

    def test_disabled_countdown_reports_inactive(self):
        PiscineCountdown.objects.update_or_create(
            pk=1,
            defaults={
                "is_enabled": False,
                "starts_at": timezone.now() + timedelta(days=5),
            },
        )

        response = self.client.get("/api/piscine/")

        self.assertFalse(response.json()["is_active"])
