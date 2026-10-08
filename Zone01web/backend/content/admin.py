"""Django admin configuration for site content.

Each model gets a compact, image-aware admin so editors can add and delete
partners, staff, news, impact updates and frontend pages without touching code.
The editorial stream models (:class:`~content.models.Category` and
:class:`~content.models.Article`) use :class:`core.search.TrigramSearchMixin` so
their searches run against the GIN/trigram indexes on the model.
"""

from django.contrib import admin
from django.utils.html import format_html

from content.models import (
    Article,
    Category,
    ImpactUpdate,
    NewsUpdate,
    Page,
    PageSection,
    Partner,
    PiscineDate,
    PiscineRegistration,
    SiteLink,
    StaffMember,
)
from core.search import TrigramSearchMixin


class ImagePreviewMixin:
    """Show a small thumbnail for the model's image field in the list view."""

    image_field = "image"
    preview_height = 48

    @admin.display(description="Preview")
    def preview(self, obj):
        image = getattr(obj, self.image_field, None)
        if not image:
            return "-"
        try:
            url = image.url
        except ValueError:
            return "-"
        return format_html(
            '<img src="{}" style="height:{}px;width:auto;border-radius:4px;object-fit:cover;" />',
            url,
            self.preview_height,
        )


@admin.register(Partner)
class PartnerAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    image_field = "logo"
    list_display = ("preview", "name", "order", "created_at")
    list_editable = ("order",)
    # Only the columns that carry a trigram index: see
    # core.tests.SearchIndexCoverageTests for why the free-text blobs are left out.
    search_fields = ("name",)
    trigram_search_fields = ("name",)
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(StaffMember)
class StaffMemberAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    image_field = "photo"
    list_display = ("preview", "name", "role", "order", "created_at")
    list_editable = ("order",)
    search_fields = ("name", "role")
    trigram_search_fields = ("name", "role")
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(NewsUpdate)
class NewsUpdateAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("preview", "title", "is_published", "published_at", "order")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title",)
    trigram_search_fields = ("title",)
    readonly_fields = ("created_at",)
    date_hierarchy = "published_at"


@admin.register(ImpactUpdate)
class ImpactUpdateAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("preview", "title", "report_link", "is_published", "order", "created_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title",)
    trigram_search_fields = ("title",)
    readonly_fields = ("created_at",)
    ordering = ("order", "id")

    @admin.display(description="Report")
    def report_link(self, obj):
        if not obj.report:
            return "-"
        try:
            url = obj.report.url
        except ValueError:
            return "-"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener">Download</a>',
            url,
        )


@admin.register(SiteLink)
class SiteLinkAdmin(admin.ModelAdmin):
    list_display = ("label", "url", "order", "is_active", "open_in_new_tab", "show_chevron")
    list_editable = ("order", "is_active")
    list_filter = ("is_active", "open_in_new_tab")
    search_fields = ("label", "url")
    readonly_fields = ("created_at",)
    ordering = ("order", "id")


@admin.register(PiscineDate)
class PiscineDateAdmin(admin.ModelAdmin):
    """Manage the list of scheduled piscine dates.

    Editors add one row per date; the website always uses the soonest upcoming
    active date and advances to the next one automatically.
    """

    list_display = ("date", "label", "is_active", "upcoming", "created_at")
    list_editable = ("label", "is_active")
    list_filter = ("is_active",)
    date_hierarchy = "date"
    ordering = ("date", "id")
    readonly_fields = ("created_at",)
    search_fields = ("label",)

    @admin.display(boolean=True, description="Upcoming")
    def upcoming(self, obj):
        return obj.is_upcoming


@admin.register(PiscineRegistration)
class PiscineRegistrationAdmin(admin.ModelAdmin):
    list_display = ("is_active", "live", "next_date", "updated_at")
    list_display_links = ("next_date",)
    # Flip the countdown on/off straight from the list.
    list_editable = ("is_active",)
    readonly_fields = ("updated_at",)

    @admin.display(description="Next date")
    def next_date(self, obj):
        return obj.next_piscine_date or "-"

    @admin.display(boolean=True, description="Live now")
    def live(self, obj):
        # True while the toggle is on and an upcoming piscine date exists.
        return obj.is_live

    def has_add_permission(self, request):
        # Keep a single settings row, but let editors edit the banner: the add
        # form upserts pk=1 (see PiscineRegistration.save).
        return True

    def get_changeform_initial_data(self, request):
        # Prefill the add form from the current row so editing the banner starts
        # from the existing values instead of blanks.
        initial = super().get_changeform_initial_data(request)
        current = PiscineRegistration.objects.filter(pk=1).first()
        if current is not None:
            initial.setdefault("is_active", current.is_active)
            initial.setdefault("message", current.message)
        return initial

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Category)
class CategoryAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    # Kept in sync with the GIN/trigram indexes on the model: an unindexed
    # column here would make the whole OR a sequential scan.
    search_fields = ("name", "slug", "description")
    trigram_search_fields = ("name", "slug", "description")
    list_per_page = 50


@admin.register(Article)
class ArticleAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("title", "category", "author", "status", "published_at")
    list_filter = ("status", "category")
    # Every column here is trigram-indexed, either on this model or on the
    # category it joins to; adding an unindexed column would turn the whole
    # OR into a sequential scan.
    search_fields = ("title", "summary", "body", "slug", "category__name")
    trigram_search_fields = ("title", "summary", "body", "slug")
    search_help_text = (
        "Searches title, summary, body, slug and category. "
        "Results are ordered by how closely they match."
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"
    list_select_related = ("category", "author")
    # Skip the extra COUNT(*) over the whole table on every changelist load.
    show_full_result_count = False


class PageSectionInline(admin.StackedInline):
    """Edit a page's ordered sections right on the page form."""

    model = PageSection
    extra = 1
    fields = (
        "order",
        "heading",
        "subheading",
        "body",
        "image",
        "cta_label",
        "cta_url",
    )
    ordering = ("order", "id")
    show_change_link = True


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "section_count", "order", "updated_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "subtitle", "meta_description")
    readonly_fields = ("updated_at",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = (PageSectionInline,)
    ordering = ("order", "title")

    @admin.display(description="Sections")
    def section_count(self, obj):
        return obj.sections.count()
