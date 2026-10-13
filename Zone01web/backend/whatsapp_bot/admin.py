"""Read-only admin for the WhatsApp conversation log.

Messages are written by the webhook, never by hand, so both models are
read-only here: staff can inspect what was asked, which FAQ matched and whether
the reply was sent, but cannot edit the audit trail.
"""

from django.contrib import admin

from whatsapp_bot.models import WhatsAppContact, WhatsAppMessage


class WhatsAppMessageInline(admin.TabularInline):
    model = WhatsAppMessage
    extra = 0
    can_delete = False
    fields = ("created_at", "direction", "status", "matched_faq", "match_score", "body")
    readonly_fields = fields
    ordering = ("-created_at",)
    show_change_link = True

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(WhatsAppContact)
class WhatsAppContactAdmin(admin.ModelAdmin):
    list_display = ("wa_id", "profile_name", "message_count", "last_seen", "first_seen")
    search_fields = ("wa_id", "profile_name")
    readonly_fields = ("wa_id", "profile_name", "first_seen", "last_seen", "message_count")
    inlines = (WhatsAppMessageInline,)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(WhatsAppMessage)
class WhatsAppMessageAdmin(admin.ModelAdmin):
    list_display = ("created_at", "contact", "direction", "status", "matched_faq", "match_score")
    list_filter = ("direction", "status")
    search_fields = ("body", "contact__wa_id")
    list_select_related = ("contact", "matched_faq")
    date_hierarchy = "created_at"
    readonly_fields = (
        "contact",
        "direction",
        "body",
        "wa_message_id",
        "matched_faq",
        "match_score",
        "status",
        "error",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
