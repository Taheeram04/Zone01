from django.contrib import admin

from events.models import Event, EventRegistration


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "format", "start_at", "status", "is_featured")
    list_filter = ("status", "format", "is_featured")
    search_fields = ("title", "summary", "location_name")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = [EventRegistrationInline]


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "event", "status", "created_at")
    list_filter = ("status", "event")
    search_fields = ("full_name", "email")
    readonly_fields = ("created_at", "updated_at")
