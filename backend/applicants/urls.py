"""URL routes for the applicants API."""

from django.urls import path

from applicants import views

app_name = "applicants"

urlpatterns = [
    path("", views.ApplicationSubmitView.as_view(), name="apply"),
]
