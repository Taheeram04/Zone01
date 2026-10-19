"""Applicant intake model for the Zone01 application form."""

from django.db import models

from core.indexes import GinTrigramIndex


class Applicant(models.Model):
    """A person applying to a Zone01 programme."""

    class Track(models.TextChoices):
        FULLSTACK = "fullstack", "Full-Stack Development"
        DATA = "data", "Data & AI"
        DEVOPS = "devops", "DevOps & Cloud"
        CYBERSECURITY = "cybersecurity", "Cybersecurity"
        OTHER = "other", "Other"

    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    choice = models.CharField(max_length=30, choices=Track.choices)
    motivation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            # One GIN/trigram index per admin search field: see core.indexes.
            GinTrigramIndex(fields=["name"], name="applicant_name_trgm"),
            GinTrigramIndex(fields=["email"], name="applicant_email_trgm"),
            GinTrigramIndex(fields=["phone"], name="applicant_phone_trgm"),
            GinTrigramIndex(fields=["motivation"], name="applicant_motivation_trgm"),
        ]

    def __str__(self):
        return f"{self.name} <{self.email}>"
