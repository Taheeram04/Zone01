"""Draft schema for applicant intake and review.

Sprint 5 draft: field names and choices are open for review before the schema
is locked. Kept intentionally close to the application form so it can back both
the public "Apply" flow and the internal review workflow.
"""

from django.db import models


class Applicant(models.Model):
    """A person applying to a Zone01 programme."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        SCREENING = "screening", "Screening"
        INTERVIEW = "interview", "Interview"
        ACCEPTED = "accepted", "Accepted"
        WAITLISTED = "waitlisted", "Waitlisted"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    class EducationLevel(models.TextChoices):
        SECONDARY = "secondary", "Secondary school"
        CERTIFICATE = "certificate", "Certificate"
        DIPLOMA = "diploma", "Diploma"
        DEGREE = "degree", "Bachelor's degree"
        POSTGRADUATE = "postgraduate", "Postgraduate"
        SELF_TAUGHT = "self_taught", "Self-taught"
        OTHER = "other", "Other"

    class Gender(models.TextChoices):
        FEMALE = "female", "Female"
        MALE = "male", "Male"
        OTHER = "other", "Other"
        UNDISCLOSED = "undisclosed", "Prefer not to say"

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, blank=True)
    county = models.CharField(max_length=100, blank=True)
    education_level = models.CharField(max_length=20, choices=EducationLevel.choices, blank=True)
    current_occupation = models.CharField(max_length=150, blank=True)
    motivation = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    referral_source = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    reviewer_notes = models.TextField(blank=True)
    consented_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["county"]),
        ]

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
