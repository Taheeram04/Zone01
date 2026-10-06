"""Draft schema for Zone01 events and attendance.

Sprint 5 draft: covers both in-person and virtual events plus a lightweight
registration record. Open for review before the schema is locked.
"""

from django.db import models
from django.utils import timezone
from filer.fields.image import FilerImageField


class Event(models.Model):
    """A public Zone01 event such as a bootcamp, open day, or workshop."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    class Format(models.TextChoices):
        IN_PERSON = "in_person", "In person"
        VIRTUAL = "virtual", "Virtual"
        HYBRID = "hybrid", "Hybrid"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    summary = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    format = models.CharField(max_length=20, choices=Format.choices, default=Format.IN_PERSON)
    location_name = models.CharField(max_length=200, blank=True)
    location_address = models.CharField(max_length=255, blank=True)
    online_url = models.URLField(blank=True)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    cover_image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="event_covers",
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_at"]
        indexes = [
            models.Index(fields=["status", "start_at"]),
        ]

    def __str__(self):
        return self.title

    @property
    def is_past(self):
        return self.start_at is not None and self.start_at < timezone.now()


class EventRegistration(models.Model):
    """A sign-up for an :class:`Event`, optionally linked to an applicant."""

    class Status(models.TextChoices):
        REGISTERED = "registered", "Registered"
        WAITLISTED = "waitlisted", "Waitlisted"
        ATTENDED = "attended", "Attended"
        CANCELLED = "cancelled", "Cancelled"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    applicant = models.ForeignKey(
        "applicants.Applicant",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="event_registrations",
    )
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REGISTERED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["event", "email"],
                name="unique_event_registration_email",
            ),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.event})"
