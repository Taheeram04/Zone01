"""Conversation log for the WhatsApp FAQ assistant.

The assistant answers incoming WhatsApp messages with the closest FAQ. These
models keep a lightweight audit trail so staff can see what people ask and how
well the automatic matching performed.

* :class:`WhatsAppContact` - one row per phone number that has messaged us.
* :class:`WhatsAppMessage` - every inbound message and the reply we sent (or
  tried to send), including which FAQ matched and the match score.
"""

from django.db import models

from content.models import FaqItem


class WhatsAppContact(models.Model):
    """A person who has messaged the Zone01 WhatsApp number."""

    wa_id = models.CharField(
        max_length=32,
        unique=True,
        help_text="WhatsApp phone number (E.164 without the leading +).",
    )
    profile_name = models.CharField(max_length=150, blank=True)
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
    message_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-last_seen"]
        verbose_name = "WhatsApp contact"
        verbose_name_plural = "WhatsApp contacts"

    def __str__(self):
        return self.profile_name or self.wa_id


class WhatsAppMessage(models.Model):
    """One inbound or outbound message in a conversation."""

    class Direction(models.TextChoices):
        INBOUND = "in", "Inbound"
        OUTBOUND = "out", "Outbound"

    class Status(models.TextChoices):
        RECEIVED = "received", "Received"
        SENT = "sent", "Sent"
        DRY_RUN = "dry_run", "Dry run (not sent)"
        FAILED = "failed", "Failed"

    contact = models.ForeignKey(
        WhatsAppContact,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    direction = models.CharField(max_length=3, choices=Direction.choices)
    body = models.TextField()
    # Meta's message id, used to ignore webhook retries (duplicate deliveries).
    wa_message_id = models.CharField(max_length=128, blank=True, null=True, unique=True)
    matched_faq = models.ForeignKey(
        FaqItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="whatsapp_messages",
    )
    match_score = models.FloatField(null=True, blank=True)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.RECEIVED,
    )
    error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "WhatsApp message"
        verbose_name_plural = "WhatsApp messages"
        indexes = [
            models.Index(fields=["contact", "-created_at"], name="wa_msg_contact_created_idx"),
        ]

    def __str__(self):
        preview = (self.body[:60] + "...") if len(self.body) > 60 else self.body
        return f"{self.get_direction_display()}: {preview}"
