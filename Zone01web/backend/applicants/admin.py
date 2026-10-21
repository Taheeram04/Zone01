from django.contrib import admin

from applicants.models import Applicant
from core.search import TrigramSearchMixin


@admin.register(Applicant)
class ApplicantAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("name", "email", "choice", "created_at")
    list_filter = ("choice",)
    # Kept in sync with the GIN/trigram indexes on the model: an unindexed
    # column here would make the whole OR a sequential scan.
    search_fields = ("name", "email", "phone", "motivation")
    trigram_search_fields = ("name", "email", "phone", "motivation")
    search_help_text = (
        "Searches name, email, phone and motivation. Results are ordered by how closely they match."
    )
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    show_full_result_count = False
