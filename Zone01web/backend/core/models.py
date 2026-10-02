"""Global, admin-editable site settings."""

from django.db import models


class PiscineCountdown(models.Model):
    """Singleton homepage "Next Piscine" countdown configuration.

    The homepage reads these values over the API so editors can move the
    countdown target (or switch it off) from the CMS admin without a deploy.
    Once ``starts_at`` is in the past the countdown switches itself off.
    """

    label = models.CharField(max_length=100, default="Next Piscine")
    starts_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Local date and time the next piscine begins.",
    )
    is_enabled = models.BooleanField(
        default=True,
        help_text="Uncheck to hide the countdown from the homepage.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Piscine countdown"
        verbose_name_plural = "Piscine countdown"

    def __str__(self):
        if self.starts_at:
            return f"{self.label} — {self.starts_at:%Y-%m-%d %H:%M}"
        return self.label

    def save(self, *args, **kwargs):
        # Single-row setting: every save reuses the same record.
        self.pk = 1
        super().save(*args, **kwargs)
