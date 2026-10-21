"""Tests for the service catalogue API and model helpers."""

from django.test import TestCase
from django.urls import reverse

from services.models import Service


class ServiceModelTests(TestCase):
    def setUp(self):
        # The seed migration adds starter content; start from a clean slate.
        Service.objects.all().delete()

    def test_slug_is_generated_from_name(self):
        service = Service.objects.create(
            name="Software Development as a Service",
            title="Software Development as a Service",
            description="Custom software delivery.",
        )
        self.assertEqual(service.slug, "software-development-as-a-service")

    def test_duplicate_names_get_unique_slugs(self):
        first = Service.objects.create(
            name="React", title="React", description="Frontend library."
        )
        second = Service.objects.create(
            name="React", title="React", description="Also a frontend library."
        )
        self.assertEqual(first.slug, "react")
        self.assertEqual(second.slug, "react-2")


class ServiceApiTests(TestCase):
    def setUp(self):
        Service.objects.all().delete()
        self.offer = Service.objects.create(
            name="Staff Augmentation",
            title="Staff Augmentation",
            description="Scale teams with pre-vetted developers.",
            category="what_we_offer",
            order=1,
        )
        self.language = Service.objects.create(
            name="Python",
            title="Python",
            description="Backend and data engineering.",
            category="language",
            order=1,
        )
        self.framework = Service.objects.create(
            name="Django",
            title="Django",
            description="Batteries-included web framework.",
            category="framework",
            order=1,
        )
        self.specialization = Service.objects.create(
            name="DevOps",
            title="DevOps",
            description="Delivery automation and reliability.",
            category="specialization",
            order=1,
        )

    def test_list_returns_services_and_groups(self):
        response = self.client.get(reverse("services_api:service-list"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload["services"]), 4)
        self.assertEqual(
            payload["navbar_services"]["what_we_offer"][0]["name"],
            "Staff Augmentation",
        )
        self.assertEqual(payload["navbar_services"]["languages"][0]["name"], "Python")
        self.assertEqual(payload["navbar_services"]["frameworks"][0]["name"], "Django")
        self.assertEqual(
            payload["navbar_services"]["specializations"][0]["name"], "DevOps"
        )

    def test_detail_returns_service_by_slug(self):
        response = self.client.get(
            reverse("services_api:service-detail", args=[self.language.slug])
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["service"]["name"], "Python")
        self.assertEqual(payload["service"]["category"], "language")
        self.assertIn("languages", payload["navbar_services"])

    def test_detail_404s_for_unknown_slug(self):
        response = self.client.get(
            reverse("services_api:service-detail", args=["does-not-exist"])
        )

        self.assertEqual(response.status_code, 404)
