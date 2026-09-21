from django.urls import path

from pages import views

app_name = "pages"

urlpatterns = [
    path("pages/", views.page_list, name="page-list"),
    path("pages/<slug:slug>/", views.page_detail, name="page-detail"),
]
