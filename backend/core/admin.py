"""Admin configuration for operational models.

Editors manage the pages shown on the "Frontend status" board from here.
"""

from django.contrib import admin

from core.models import FrontendPage


@admin.register(FrontendPage)
class FrontendPageAdmin(admin.ModelAdmin):
    list_display = ("label", "path", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("label", "path")
    readonly_fields = ("created_at",)
    ordering = ("order", "id")
