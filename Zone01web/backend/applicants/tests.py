import json

from django.db import IntegrityError, transaction
from django.test import TestCase
from django.urls import reverse

from applicants.models import Applicant


class ApplicantModelTests(TestCase):
    def test_defaults_and_full_name(self):
        applicant = Applicant.objects.create(
            first_name="Amina",
            last_name="Otieno",
            email="amina@example.com",
        )

        self.assertEqual(applicant.full_name, "Amina Otieno")
        self.assertEqual(applicant.status, Applicant.Status.DRAFT)

    def test_email_is_unique(self):
        Applicant.objects.create(first_name="A", last_name="B", email="dup@example.com")

        with self.assertRaises(IntegrityError), transaction.atomic():
            Applicant.objects.create(first_name="C", last_name="D", email="dup@example.com")


def application_payload(**overrides):
    payload = {
        "first_name": "Amina",
        "last_name": "Otieno",
        "email": "amina@example.com",
        "phone": "0712345678",
        "county": "Kisumu",
        "education_level": "degree",
        "current_occupation": "Student",
        "motivation": "I want to build software that matters.",
        "consent": True,
    }
    payload.update(overrides)
    return payload


class ApplicationApiTests(TestCase):
    def setUp(self):
        self.url = reverse("applicants_api:apply")

    def post_json(self, payload):
        return self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_submission_is_validated_and_stored(self):
        response = self.post_json(application_payload())

        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertTrue(body["ok"])
        self.assertEqual(body["reference"], f"Z01-{body['id']:06d}")

        applicant = Applicant.objects.get(email="amina@example.com")
        self.assertEqual(applicant.status, Applicant.Status.SUBMITTED)
        self.assertEqual(applicant.full_name, "Amina Otieno")
        self.assertIsNotNone(applicant.submitted_at)
        self.assertIsNotNone(applicant.consented_at)

    def test_email_is_lowercased_and_trimmed(self):
        self.post_json(application_payload(email="  Amina@Example.COM "))

        self.assertTrue(Applicant.objects.filter(email="amina@example.com").exists())

    def test_missing_required_fields_return_400_and_store_nothing(self):
        response = self.post_json({"email": "someone@example.com"})

        self.assertEqual(response.status_code, 400)
        errors = response.json()["errors"]
        self.assertIn("first_name", errors)
        self.assertIn("last_name", errors)
        self.assertIn("consent", errors)
        self.assertFalse(Applicant.objects.exists())

    def test_duplicate_email_returns_409(self):
        Applicant.objects.create(first_name="A", last_name="B", email="dup@example.com")

        response = self.post_json(application_payload(email="dup@example.com"))

        self.assertEqual(response.status_code, 409)
        self.assertEqual(Applicant.objects.count(), 1)

    def test_invalid_email_returns_400(self):
        response = self.post_json(application_payload(email="not-an-email"))

        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.json()["errors"])

    def test_malformed_json_returns_400(self):
        response = self.client.post(
            self.url,
            data="{not json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()["ok"])

    def test_form_encoded_submission_is_accepted(self):
        response = self.client.post(self.url, data=application_payload())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Applicant.objects.filter(email="amina@example.com").exists())

    def test_get_is_not_allowed(self):
        self.assertEqual(self.client.get(self.url).status_code, 405)
