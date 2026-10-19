from django.contrib import admin

from applicants.models import Applicant


@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "choice", "created_at")
    list_filter = ("choice",)
    search_fields = ("name", "email", "phone", "motivation")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    show_full_result_count = False
