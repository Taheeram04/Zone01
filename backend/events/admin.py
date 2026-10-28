from django.contrib import admin

from core.search import TrigramSearchMixin
from events.models import Event, EventRegistration


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    autocomplete_fields = ("applicant",)


@admin.register(Event)
class EventAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("title", "format", "start_at", "status", "is_featured")
    list_filter = ("status", "format", "is_featured")
    date_hierarchy = "start_at"
    # Kept in sync with the GIN/trigram indexes on the model: an unindexed
    # column here would make the whole OR a sequential scan.
    search_fields = ("title", "summary", "description", "location_name", "slug")
    trigram_search_fields = ("title", "summary", "description", "location_name", "slug")
    search_help_text = (
        "Searches title, summary, description, venue and slug. "
        "Results are ordered by how closely they match."
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = [EventRegistrationInline]
    # Skip the extra COUNT(*) over the whole table on every changelist load.
    show_full_result_count = False


@admin.register(EventRegistration)
class EventRegistrationAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("full_name", "email", "event", "status", "created_at")
    list_filter = ("status", "event")
    # event__title is served by the event's own trigram index through the join.
    search_fields = ("full_name", "email", "phone", "event__title")
    trigram_search_fields = ("full_name", "email", "phone")
    search_help_text = "Searches name, email, phone and the event title."
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("applicant",)
    list_select_related = ("event", "applicant")
    # Skip the extra COUNT(*) over the whole table on every changelist load.
    show_full_result_count = False
