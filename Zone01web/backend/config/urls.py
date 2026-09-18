"""Root URL configuration for the Zone01 django CMS site."""

from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.i18n import JavaScriptCatalog

from core.views import health

admin.site.site_header = "Zone01 CMS"
admin.site.site_title = "Zone01 CMS"
admin.site.index_title = "Content dashboard"

urlpatterns = [
    path("healthz", health, name="health"),
] + i18n_patterns(
    path("jsi18n/", JavaScriptCatalog.as_view(), name="javascript-catalog"),
    path("admin/", admin.site.urls),
    path("filer/", include("filer.urls")),
    path("", include("cms.urls")),
    prefix_default_language=False,
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
