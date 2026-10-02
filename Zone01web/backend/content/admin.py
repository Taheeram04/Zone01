"""Django admin configuration for site content.

Each model gets a compact, image-aware admin so editors can add and delete
partners, staff, news and impact updates without touching code.
"""

from django.contrib import admin
from django.utils.html import format_html

from content.models import (
    ImpactUpdate,
    NewsUpdate,
    Partner,
    PiscineRegistration,
    StaffMember,
)


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
class PartnerAdmin(ImagePreviewMixin, admin.ModelAdmin):
    image_field = "logo"
    list_display = ("preview", "name", "order", "created_at")
    list_editable = ("order",)
    search_fields = ("name", "information")
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(StaffMember)
class StaffMemberAdmin(ImagePreviewMixin, admin.ModelAdmin):
    image_field = "photo"
    list_display = ("preview", "name", "role", "order", "created_at")
    list_editable = ("order",)
    search_fields = ("name", "role", "bio")
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(NewsUpdate)
class NewsUpdateAdmin(ImagePreviewMixin, admin.ModelAdmin):
    list_display = ("preview", "title", "is_published", "published_at", "order")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title", "information")
    readonly_fields = ("created_at",)
    date_hierarchy = "published_at"


@admin.register(ImpactUpdate)
class ImpactUpdateAdmin(ImagePreviewMixin, admin.ModelAdmin):
    list_display = ("preview", "title", "report_link", "is_published", "order", "created_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title", "information")
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
    list_display = ("is_active", "next_piscine_date", "updated_at")

    def has_add_permission(self, request):
        # Only ever one settings row.
        return not PiscineRegistration.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
