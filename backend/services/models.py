"""Service catalogue powering the public *Hire Talent* page.

Ported from the 01talentke_website ``services`` app. Each :class:`Service`
belongs to one category:

* ``what_we_offer`` — the service cards (Software Development, Staff
  Augmentation, ...).
* ``language`` / ``framework`` / ``specialization`` — the technologies the
  talent pool is proficient in.
* ``technical_expertise`` — kept for parity with the original app; not shown
  on the public page yet.
"""

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

# Icons are usually SVGs, but PNG/JPEG/WebP are accepted so editors can upload
# raster logos without converting them first.
ICON_EXTENSIONS = (".svg", ".png", ".jpg", ".jpeg", ".webp")


def validate_icon(file):
    """Accept SVG/bitmap icons and make sure SVGs are really SVGs."""
    name = (file.name or "").lower()
    if not name.endswith(ICON_EXTENSIONS):
        raise ValidationError("Upload an SVG, PNG, JPEG or WebP icon.")

    if name.endswith(".svg"):
        try:
            file.seek(0)
            content = file.read(2048).decode("utf-8", errors="ignore")
            file.seek(0)
        except (OSError, UnicodeError) as exc:
            raise ValidationError("Invalid SVG file.") from exc
        if "<svg" not in content.lower():
            raise ValidationError("File is not a valid SVG.")


class Service(models.Model):
    CATEGORY_CHOICES = [
        ("what_we_offer", "What We Offer"),
        ("technical_expertise", "Technical Expertise"),
        ("language", "Language"),
        ("framework", "Framework"),
        ("specialization", "Specialization"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, default="Untitled")
    name = models.CharField(max_length=255)
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text="URL-friendly identifier. Generated from the name when left blank.",
    )
    description = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="what_we_offer",
        help_text="Category of the service",
    )
    image = models.FileField(
        upload_to="services/",
        null=True,
        blank=True,
        validators=[validate_icon],
        help_text="Icon shown next to the service (SVG preferred).",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers are shown first within a category.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "services"
        ordering = ["category", "order", "name"]
        verbose_name = "service"
        verbose_name_plural = "services"

    def __str__(self):
        return self.title or self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._unique_slug()
        super().save(*args, **kwargs)

    def _unique_slug(self):
        base = slugify(self.name)[:240] or "service"
        slug = base
        suffix = 2
        clashes = Service.objects.exclude(pk=self.pk)
        while clashes.filter(slug=slug).exists():
            slug = f"{base}-{suffix}"
            suffix += 1
        return slug
