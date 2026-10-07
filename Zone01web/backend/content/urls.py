"""URL routes for the content JSON API."""

from django.urls import path

from content import api

app_name = "content_api"

urlpatterns = [
    path("content/", api.content_index, name="content-index"),
    path("partners/", api.partner_list, name="partner-list"),
    path("staff/", api.staff_list, name="staff-list"),
    path("news/", api.news_list, name="news-list"),
    path("impact/", api.impact_list, name="impact-list"),
    path("links/", api.link_list, name="link-list"),
    path("piscine/", api.piscine_detail, name="piscine-detail"),
    path("pages/", api.page_list, name="page-list"),
    path("pages/<slug:slug>/", api.page_detail, name="page-detail"),
]
