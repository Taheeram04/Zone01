"""Django admin configuration for site content.

Each model gets a compact, image-aware admin so editors can add and delete
partners, staff, news and impact updates without touching code. The editorial
stream models (:class:`~content.models.Category` and
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
    Partner,
    PiscineRegistration,
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


@admin.register(PiscineRegistration)
class PiscineRegistrationAdmin(admin.ModelAdmin):
    list_display = ("is_active", "live", "next_piscine_date", "updated_at")
    list_display_links = ("next_piscine_date",)
    # Flip the countdown on/off straight from the list.
    list_editable = ("is_active",)
    readonly_fields = ("updated_at",)

    @admin.display(boolean=True, description="Live now")
    def live(self, obj):
        # True while the toggle is on and the 09:00 EAT start is still ahead.
        return obj.is_live

    def has_add_permission(self, request):
        # Only ever one settings row.
        return not PiscineRegistration.objects.exists()

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
