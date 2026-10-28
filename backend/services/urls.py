"""URL routes for the service catalogue JSON API."""

from django.urls import path

from services import api

app_name = "services_api"

urlpatterns = [
    path("", api.service_list, name="service-list"),
    path("<slug:slug>/", api.service_detail, name="service-detail"),
]
