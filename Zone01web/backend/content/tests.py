from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from content.models import ImpactUpdate, NewsUpdate, Partner, PiscineRegistration, StaffMember


class ContentModelTests(TestCase):
    def test_partner_str(self):
        partner = Partner.objects.create(name="Acme")
        self.assertEqual(str(partner), "Acme")

    def test_staff_str(self):
        member = StaffMember.objects.create(name="Jane Doe", role="Lead Instructor")
        self.assertEqual(str(member), "Jane Doe - Lead Instructor")

    def test_news_ordering_prefers_newest(self):
        NewsUpdate.objects.create(title="Older", published_at=timezone.now() - timezone.timedelta(days=30))
        NewsUpdate.objects.create(title="Newer", published_at=timezone.now())
        self.assertEqual(NewsUpdate.objects.first().title, "Newer")

    def test_impact_publish_flag(self):
        ImpactUpdate.objects.create(title="Hidden", is_published=False)
        ImpactUpdate.objects.create(title="Shown", is_published=True)
        self.assertEqual(list(ImpactUpdate.objects.values_list("title", flat=True)), ["Shown"])

    def test_piscine_is_singleton(self):
        first = PiscineRegistration.get_solo()
        first.is_active = True
        first.save()
        second = PiscineRegistration.get_solo()
        self.assertEqual(first.pk, second.pk)
        self.assertEqual(PiscineRegistration.objects.count(), 1)


class ContentApiTests(TestCase):
    def test_content_index_returns_all_blocks(self):
        Partner.objects.create(name="Acme")
        StaffMember.objects.create(name="Jane Doe", role="Coach")
        NewsUpdate.objects.create(title="We launched")
        ImpactUpdate.objects.create(title="1000 graduates")

        response = self.client.get(reverse("content_api:content-index"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload["partners"]), 1)
        self.assertEqual(len(payload["staff"]), 1)
        self.assertEqual(len(payload["news"]), 1)
        self.assertEqual(len(payload["impact"]), 1)
        self.assertIn("is_active", payload["piscine"])

    def test_news_list_hides_unpublished(self):
        NewsUpdate.objects.create(title="Draft", is_published=False)
        NewsUpdate.objects.create(title="Live", is_published=True)

        response = self.client.get(reverse("content_api:news-list"))

        self.assertEqual(response.status_code, 200)
        titles = [item["title"] for item in response.json()["results"]]
        self.assertEqual(titles, ["Live"])

    def test_piscine_detail_exposes_date_and_toggle(self):
        piscine = PiscineRegistration.get_solo()
        piscine.is_active = True
        piscine.next_piscine_date = "2025-10-06"
        piscine.save()

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["is_active"])
        self.assertEqual(payload["next_piscine_date"], "2025-10-06")
