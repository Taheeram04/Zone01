from django.contrib import admin

from core.models import PiscineCountdown


@admin.register(PiscineCountdown)
class PiscineCountdownAdmin(admin.ModelAdmin):
    """Admin for the single homepage countdown setting."""

    list_display = ("label", "starts_at", "is_enabled", "updated_at")
    fields = ("label", "starts_at", "is_enabled", "updated_at")
    readonly_fields = ("updated_at",)

    def has_add_permission(self, request):
        # Only ever one countdown record.
        return not PiscineCountdown.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
