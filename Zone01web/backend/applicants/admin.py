from django.contrib import admin

from applicants.models import Applicant
from core.search import TrigramSearchMixin


@admin.register(Applicant)
class ApplicantAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("full_name", "email", "county", "education_level", "status", "submitted_at")
    list_filter = ("status", "education_level", "gender", "county")
    # Kept in sync with the GIN/trigram indexes on the model: an unindexed
    # column here would make the whole OR a sequential scan.
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "county",
        "current_occupation",
        "motivation",
    )
    trigram_search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "county",
        "current_occupation",
        "motivation",
    )
    search_help_text = (
        "Searches name, email, phone, county, occupation and motivation. "
        "Results are ordered by how closely they match."
    )
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    # Skip the extra COUNT(*) over the whole table on every changelist load.
    show_full_result_count = False
