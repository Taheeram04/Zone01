"""Root URL configuration for the Zone01 site."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.i18n import JavaScriptCatalog

from core.views import health

admin.site.site_header = "Zone01 CMS"
admin.site.site_title = "Zone01 CMS"
admin.site.index_title = "Content dashboard"

urlpatterns = [
    path("healthz", health, name="health"),
    path("jsi18n/", JavaScriptCatalog.as_view(), name="javascript-catalog"),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
