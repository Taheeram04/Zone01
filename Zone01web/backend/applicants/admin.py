from django.contrib import admin

from applicants.models import Applicant


@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "county", "education_level", "status", "submitted_at")
    list_filter = ("status", "education_level", "gender", "county")
    search_fields = ("first_name", "last_name", "email", "phone")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
