"""Site content that editors manage from the Django admin.

Two families of models live in this app:

**Block content** backs each block of the public website and is served to the
React frontend as JSON under ``/api/``:

* :class:`Partner`      - partner logos shown in the "Our partners" strip.
* :class:`StaffMember`  - team members and their roles.
* :class:`NewsUpdate`   - news posts (title, image, information).
* :class:`ImpactUpdate` - impact stories (title, image, information, report PDF).
* :class:`PiscineDate`    - scheduled piscine start dates (one row per date).
* :class:`PiscineRegistration` - the "Apply now" alert banner configuration.
* :class:`Page` + :class:`PageSection` - editable content for a frontend page
  (home, about-us, community, ...), built from ordered reusable sections.

**Editorial stream** (SEO work) covers the time-stamped article/blog stream and
its taxonomy, which is what the public content pages are generated from:

* :class:`Category` - a taxonomy term used to group articles.
* :class:`Article`  - a news item, story or impact update with a workflow status.

Both sets are searchable from the Django admin through
:class:`core.search.TrigramSearchMixin`, backed by per-column GIN/trigram
indexes declared with :class:`core.indexes.GinTrigramIndex`.
"""

import datetime
from zoneinfo import ZoneInfo

from django.conf import settings
from django.db import models
from django.utils import timezone
from filer.fields.file import FilerFileField
from filer.fields.image import FilerImageField

from core.indexes import GinTrigramIndex

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
        indexes = [
            GinTrigramIndex(fields=["name"], name="partner_name_trgm"),
        ]

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
        indexes = [
            GinTrigramIndex(fields=["name"], name="staff_name_trgm"),
            GinTrigramIndex(fields=["role"], name="staff_role_trgm"),
        ]

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
        indexes = [
            GinTrigramIndex(fields=["title"], name="news_title_trgm"),
        ]

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
        indexes = [
            GinTrigramIndex(fields=["title"], name="impact_title_trgm"),
        ]

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


class PiscineDate(models.Model):
    """One scheduled piscine start date.

    Editors add a row per date for the year (or years) ahead. Each date starts
    at 09:00 Kisumu time (EAT). The website always targets the soonest upcoming
    active row, so the countdown rolls on to the next date automatically once a
    piscine begins -- no manual re-activation needed.
    """

    date = models.DateField(
        help_text="Date this piscine starts (09:00 EAT).",
    )
    label = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional label for this date. Leave blank for the default.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this date from the website.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "id"]
        verbose_name = "piscine date"
        verbose_name_plural = "piscine dates"

    def __str__(self):
        if self.label:
            return f"{self.date:%d %b %Y} - {self.label}"
        return f"{self.date:%d %b %Y}"

    @property
    def starts_at(self):
        """Timezone-aware start moment (09:00 EAT on :attr:`date`)."""
        naive = datetime.datetime.combine(self.date, PISCINE_START_TIME)
        return timezone.make_aware(naive, PISCINE_TIMEZONE)

    @property
    def is_upcoming(self):
        """True while this date's 09:00 EAT start is still ahead."""
        return self.starts_at > timezone.now()

    @classmethod
    def upcoming(cls):
        """Active dates whose start is still ahead, soonest first."""
        now = timezone.now()
        return [obj for obj in cls.objects.filter(is_active=True) if obj.starts_at > now]

    @classmethod
    def next_upcoming(cls):
        """The soonest upcoming active date, or ``None`` when there are none."""
        return next(iter(cls.upcoming()), None)


class PiscineRegistration(models.Model):
    """Singleton holding the next-piscine banner configuration.

    Only one row ever exists (``pk=1``). This model holds the master
    :attr:`is_active` switch and an optional custom :attr:`message`; the actual
    dates live in :class:`PiscineDate`. The banner targets the soonest upcoming
    date and advances to the following one automatically, so it never needs to
    be re-enabled between piscines.
    """

    is_active = models.BooleanField(
        default=False,
        help_text="Turn the next-piscine alert on or off.",
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
        next_date = self.next_date
        if next_date:
            return f"Next piscine: {next_date.date:%d %b %Y}"
        return "Next piscine"

    def save(self, *args, **kwargs):
        self.pk = 1
        # The row is a singleton pinned to pk=1. A plain "Add" from the admin
        # would try to INSERT another pk=1 row and clash, so replace the
        # existing row instead (upsert).
        if not kwargs.get("force_insert") and type(self).objects.filter(pk=1).exists():
            kwargs["force_update"] = True
        super().save(*args, **kwargs)

    @property
    def next_date(self):
        """The soonest upcoming :class:`PiscineDate`, or ``None``."""
        return PiscineDate.next_upcoming()

    @property
    def next_piscine_date(self):
        """Date of the next upcoming piscine, or ``None``."""
        next_date = self.next_date
        return next_date.date if next_date else None

    @property
    def starts_at(self):
        """Timezone-aware start moment of the next upcoming piscine."""
        next_date = self.next_date
        return next_date.starts_at if next_date else None

    @property
    def is_live(self):
        """True while the toggle is on and an upcoming piscine date exists.

        The date itself auto-advances (see :meth:`PiscineDate.next_upcoming`),
        so this only turns off when the master switch is off or no future dates
        remain.
        """
        return bool(self.is_active and self.next_date is not None)

    @classmethod
    def get_solo(cls):
        """Return the single settings row, creating it on first access."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Category(models.Model):
    """A taxonomy term for grouping articles."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"
        # One GIN/trigram index per column searched in the admin: see
        # core.indexes.GinTrigramIndex for why these are single-column.
        indexes = [
            GinTrigramIndex(fields=["name"], name="category_name_trgm"),
            GinTrigramIndex(fields=["slug"], name="category_slug_trgm"),
            GinTrigramIndex(fields=["description"], name="category_description_trgm"),
        ]

    def __str__(self):
        return self.name


class Article(models.Model):
    """A news item, story, or impact update."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        IN_REVIEW = "in_review", "In review"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(
        Category,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="articles",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="articles",
    )
    summary = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    cover_image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="article_covers",
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            # Named explicitly: the changelist filters on this pair, and a
            # generated name would change if the field list is ever reordered.
            models.Index(fields=["status", "published_at"], name="article_status_published_idx"),
            # One GIN/trigram index per column searched in the admin: see
            # core.indexes.GinTrigramIndex for why these are single-column.
            GinTrigramIndex(fields=["title"], name="article_title_trgm"),
            GinTrigramIndex(fields=["summary"], name="article_summary_trgm"),
            GinTrigramIndex(fields=["body"], name="article_body_trgm"),
            GinTrigramIndex(fields=["slug"], name="article_slug_trgm"),
        ]

    def __str__(self):
        return self.title


class Page(OrderedContent):
    """Editable content for one frontend page.

    A page is identified by its ``slug`` (the URL segment, e.g. ``about-us``)
    and is built from any number of ordered :class:`PageSection` rows. Editors
    create the page in the admin and add sections as needed, so the same
    structure works for every page of the site.
    """

    slug = models.SlugField(
        max_length=100,
        unique=True,
        help_text="URL segment, e.g. about-us. Use 'home' for the landing page.",
    )
    title = models.CharField(max_length=200, help_text="Page name shown in the nav/header.")
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional hero subtitle under the title.",
    )
    hero_image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="page_hero_images",
        help_text="Optional hero/banner image for the page.",
    )
    meta_title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Optional SEO title. Falls back to the page title.",
    )
    meta_description = models.CharField(
        max_length=300,
        blank=True,
        help_text="Optional SEO description.",
    )
    is_published = models.BooleanField(default=True, help_text="Uncheck to hide from the website.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(OrderedContent.Meta):
        verbose_name = "page"
        verbose_name_plural = "pages"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        if self.slug == "home":
            return "/"
        return f"/{self.slug}"


class PageSection(models.Model):
    """One ordered block of content inside a :class:`Page`.

    Sections are intentionally generic (heading, copy, image and an optional
    call to action) so editors can compose any page without code changes.
    """

    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    heading = models.CharField(max_length=200, blank=True)
    subheading = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True, help_text="Section copy.")
    image = FilerImageField(
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="page_section_images",
    )
    cta_label = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional button text, e.g. Learn more.",
    )
    cta_url = models.CharField(
        max_length=500,
        blank=True,
        help_text="Optional button target: a path (/hire-talent) or full URL.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first on the page.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "page section"
        verbose_name_plural = "page sections"

    def __str__(self):
        return self.heading or f"Section {self.pk} of {self.page.title}"
