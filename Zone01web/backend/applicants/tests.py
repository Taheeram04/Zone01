from django.db import IntegrityError, transaction
from django.test import TestCase

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
