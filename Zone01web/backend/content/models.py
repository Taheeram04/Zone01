"""Site content that editors manage from the Django admin.

Each model backs one block of the public website:

* :class:`Partner`      - partner logos shown in the "Our partners" strip.
* :class:`StaffMember`  - team members and their roles.
* :class:`NewsUpdate`   - news posts (title, image, information).
* :class:`ImpactUpdate` - impact stories (title, image, information, report PDF).
* :class:`PiscineRegistration` - the "Apply now" alert banner and its date.

The same data is exposed as JSON under ``/api/`` so the React frontend can
consume it, whether it runs locally or on a hosted domain.
"""

import datetime
from zoneinfo import ZoneInfo

from django.db import models
from django.utils import timezone
from filer.fields.file import FilerFileField
from filer.fields.image import FilerImageField

# Next-piscine alerts always start at 09:00 Kisumu time (EAT).
PISCINE_TIMEZONE = ZoneInfo("Africa/Nairobi")
PISCINE_START_TIME = datetime.time(9, 0)


class OrderedContent(models.Model):
    """Shared behaviour for content that is listed in a fixed order."""

    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first on the website.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class Partner(OrderedContent):
    """A partner organisation displayed with its logo."""

    name = models.CharField(max_length=150)
    logo = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="partner_logos",
        help_text="Square or wide logo, PNG/SVG preferred.",
    )
    information = models.TextField(blank=True, help_text="Short blurb about the partner.")

    class Meta(OrderedContent.Meta):
        verbose_name = "partner"
        verbose_name_plural = "partners"

    def __str__(self):
        return self.name


class StaffMember(OrderedContent):
    """A member of the Zone01 team."""

    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150, help_text="e.g. Lead Instructor")
    photo = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="staff_photos",
        help_text="Portrait photo of the staff member.",
    )
    bio = models.TextField(blank=True, help_text="Short biography.")

    class Meta(OrderedContent.Meta):
        verbose_name = "staff member"
        verbose_name_plural = "staff"

    def __str__(self):
        return f"{self.name} - {self.role}"


class NewsUpdate(OrderedContent):
    """A news post shown on the website."""

    title = models.CharField(max_length=200)
    image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="news_images",
    )
    information = models.TextField(blank=True, help_text="The news story.")
    is_published = models.BooleanField(default=True, help_text="Uncheck to hide from the website.")
    published_at = models.DateTimeField(default=timezone.now)

    class Meta(OrderedContent.Meta):
        verbose_name = "news update"
        verbose_name_plural = "news"
        ordering = ["-published_at", "order", "id"]

    def __str__(self):
        return self.title


class ImpactUpdate(OrderedContent):
    """An impact story shown on the website."""

    title = models.CharField(max_length=200)
    image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="impact_images",
    )
    report = FilerFileField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="impact_reports",
        help_text="Optional PDF report visitors can download from this impact story.",
    )
    information = models.TextField(blank=True, help_text="The impact story.")
    is_published = models.BooleanField(default=True, help_text="Uncheck to hide from the website.")

    class Meta(OrderedContent.Meta):
        verbose_name = "impact update"
        verbose_name_plural = "impact"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class SiteLink(OrderedContent):
    """A navigation link rendered in the website header.

    Editors add, reorder and hide header links from the admin. :attr:`url` may
    be an internal path (``/about``) or a full external URL (``https://...``).
    """

    label = models.CharField(max_length=100)
    url = models.CharField(
        max_length=500,
        help_text="Internal path (e.g. /about) or a full external URL (https://...).",
    )
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide from the website.")
    open_in_new_tab = models.BooleanField(
        default=False,
        help_text="Open this link in a new tab.",
    )
    show_chevron = models.BooleanField(
        default=False,
        help_text="Show a small dropdown chevron next to the label.",
    )

    class Meta(OrderedContent.Meta):
        verbose_name = "site link"
        verbose_name_plural = "site links"

    def __str__(self):
        return self.label

    @property
    def is_external(self):
        """True when the link points off-site, so the frontend can use an ``<a>``."""
        return self.url.startswith(("http://", "https://", "//"))


class PiscineRegistration(models.Model):
    """Singleton controlling the next-piscine countdown in the hero.

    Only one row ever exists (``pk=1``). Editors toggle :attr:`is_active` on to
    show the countdown and set :attr:`next_piscine_date`; the alert switches
    itself off automatically at 09:00 EAT on that date.
    """

    is_active = models.BooleanField(
        default=False,
        help_text="Turn the next-piscine alert on or off.",
    )
    next_piscine_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date the next piscine starts.",
    )
    message = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional custom text. Leave blank for the default message.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "next piscine registration"
        verbose_name_plural = "next piscine registration"

    def __str__(self):
        if self.next_piscine_date:
            return f"Next piscine: {self.next_piscine_date:%d %b %Y}"
        return "Next piscine"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @property
    def starts_at(self):
        """Timezone-aware start moment (09:00 EAT on :attr:`next_piscine_date`)."""
        if not self.next_piscine_date:
            return None
        naive = datetime.datetime.combine(self.next_piscine_date, PISCINE_START_TIME)
        return timezone.make_aware(naive, PISCINE_TIMEZONE)

    @property
    def is_live(self):
        """True only while the toggle is on and the start moment is still ahead."""
        starts = self.starts_at
        return bool(self.is_active and starts and starts > timezone.now())

    @classmethod
    def get_solo(cls):
        """Return the single settings row, creating it on first access.

        Also lazily flips the toggle off once the start time has passed, so the
        alert switches itself off on D-day and must be re-activated for the next
        piscine.
        """
        obj, _ = cls.objects.get_or_create(pk=1)
        if obj.is_active and obj.starts_at and obj.starts_at <= timezone.now():
            obj.is_active = False
            obj.save(update_fields=["is_active", "updated_at"])
        return obj
