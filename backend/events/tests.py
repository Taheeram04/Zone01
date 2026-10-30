from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from events.models import Event, EventRegistration


class EventModelTests(TestCase):
    def test_str_and_is_past(self):
        event = Event.objects.create(
            title="Open Day",
            slug="open-day",
            start_at=timezone.now() + timedelta(days=1),
        )

        self.assertEqual(str(event), "Open Day")
        self.assertFalse(event.is_past)
        self.assertEqual(event.status, Event.Status.DRAFT)

    def test_registration_str(self):
        event = Event.objects.create(title="Open Day", slug="open-day", start_at=timezone.now())
        registration = EventRegistration.objects.create(
            event=event,
            full_name="Amina Otieno",
            email="amina@example.com",
        )

        self.assertIn("Amina Otieno", str(registration))
