"""Admin configuration for the Hire Talent service catalogue."""

from django.contrib import admin

from services.models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "name", "category", "order", "created_at")
    list_filter = ("category",)
    search_fields = ("name", "title", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("category", "order", "name")
    readonly_fields = ("created_at",)
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "name",
                    "slug",
                    "category",
                    "description",
                )
            },
        ),
        (
            "Presentation",
            {
                "fields": ("image", "order"),
                "description": (
                    "The image is shown beside the service and in the "
                    "technologies grid. Content appears on /hire."
                ),
            },
        ),
        ("Metadata", {"fields": ("created_at",), "classes": ("collapse",)}),
    )
