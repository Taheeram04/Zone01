"""URL routes for the public application API."""

from django.urls import path

from applicants import api

app_name = "applicants_api"

urlpatterns = [
    path("apply/", api.apply, name="apply"),
]
