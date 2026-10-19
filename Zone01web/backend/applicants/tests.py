from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from applicants.models import Applicant


class ApplicantAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/applicants/"

    def test_create_applicant_success(self):
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+254700000000",
            "choice": "fullstack",
            "motivation": "I want to learn.",
        }
        res = self.client.post(self.url, payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.data["success"])
        self.assertEqual(Applicant.objects.count(), 1)

    def test_duplicate_email_rejected(self):
        Applicant.objects.create(
            name="Jane Doe",
            email="jane@example.com",
            choice="fullstack",
            motivation="x",
        )
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "choice": "fullstack",
            "motivation": "x",
        }
        res = self.client.post(self.url, payload, format="json")
        self.assertEqual(res.status_code, 400)

    def test_missing_fields_rejected(self):
        res = self.client.post(self.url, {}, format="json")
        self.assertEqual(res.status_code, 400)
