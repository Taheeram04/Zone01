"""Root URL configuration for the Zone01 site.

One Django service hosts the whole product:

* ``/api/``     - the read-only JSON API the React frontend consumes.
  ``/api/services/`` serves the Hire Talent service catalogue.
* ``/admin/``   - the Django admin (content editing, applicants, events).
* ``/healthz``  - liveness check.
* ``/webhooks/whatsapp/`` - Meta WhatsApp Cloud API webhook (FAQ assistant).
* everything else - the built React SPA (client-side routing), served by
  :func:`core.views.spa`. Build it with ``make frontend``.
"""

from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.i18n import JavaScriptCatalog

from core.views import api_not_found, frontend_status, health, robots_txt, sitemap_xml, spa

admin.site.site_header = "Zone01 CMS"
admin.site.site_title = "Zone01 CMS"
admin.site.index_title = "Content dashboard"
admin.site.index_template = "admin/frontend_status_index.html"

urlpatterns = [
    path("healthz", health, name="health"),
    path("api/services/", include("services.urls")),
    path("api/", include("content.urls")),
    path("api/applicants/", include("applicants.urls")),
    # Unknown API paths must 404 as JSON, not fall through to the SPA.
    re_path(r"^api/.*$", api_not_found, name="api-not-found"),
    # WhatsApp Cloud API webhook (GET verify + POST events). Public and
    # CSRF-exempt; see whatsapp_bot.views.
    path("webhooks/whatsapp/", include("whatsapp_bot.urls")),
] + i18n_patterns(
    path("jsi18n/", JavaScriptCatalog.as_view(), name="javascript-catalog"),
    path("admin/frontend-status/", frontend_status, name="frontend-status"),
    path("admin/", admin.site.urls),
    path("filer/", include("filer.urls")),
    prefix_default_language=False,
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Crawler files must live at the domain root, before the SPA catch-all. The
# built frontend ships both files; the views read them from FRONTEND_DIST.
urlpatterns += [
    path("robots.txt", robots_txt, name="robots-txt"),
    path("sitemap.xml", sitemap_xml, name="sitemap"),
]

# The SPA is the catch-all and must be registered last: it owns every remaining
# public path (client-side routing). Assets are requested under /static/, which
# the staticfiles app (dev) or WhiteNoise (production) serves before this.
urlpatterns += [re_path(r"^(?P<path>.*)$", spa, name="spa")]
