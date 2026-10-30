from django.contrib import admin

from core.search import TrigramSearchMixin


# Applicant intake is handled by the public API; this admin is intentionally
# not registered, so Applicants does not appear in the CMS. The class is kept
# for the search tests in core.tests and for future reuse.
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
