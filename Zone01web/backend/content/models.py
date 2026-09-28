"""Site content that editors manage from the Django admin.

Each model backs one block of the public website:

* :class:`Partner`      - partner logos shown in the "Our partners" strip.
* :class:`StaffMember`  - team members and their roles.
* :class:`NewsUpdate`   - news posts (title, image, information).
* :class:`ImpactUpdate` - impact stories (title, image, information).
* :class:`PiscineRegistration` - the "Apply now" alert banner and its date.

The same data is exposed as JSON under ``/api/`` so the React frontend can
consume it, whether it runs locally or on a hosted domain.
"""

from django.db import models
from django.utils import timezone
from filer.fields.image import FilerImageField


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
    information = models.TextField(blank=True, help_text="The impact story.")
    is_published = models.BooleanField(default=True, help_text="Uncheck to hide from the website.")

    class Meta(OrderedContent.Meta):
        verbose_name = "impact update"
        verbose_name_plural = "impact"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class PiscineRegistration(models.Model):
    """Singleton controlling the next-piscine alert under "Apply now".

    Only one row ever exists (``pk=1``). Editors flip :attr:`is_active` to
    show/hide the alert and edit :attr:`next_piscine_date`.
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

    @classmethod
    def get_solo(cls):
        """Return the single settings row, creating it on first access."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
