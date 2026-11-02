"""Operational endpoints for liveness and connectivity checks."""

import base64
import hashlib
import re
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.db import connections
from django.db.utils import OperationalError
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_GET

from core.models import FrontendPage


@require_GET
def health(request):
    database_ok = True
    try:
        connections["default"].cursor()
    except OperationalError:
        database_ok = False

    payload = {
        "status": "ok" if database_ok else "degraded",
        "database": "ok" if database_ok else "unreachable",
        "time": timezone.now().isoformat(),
        "version": settings.APP_VERSION,
    }
    return JsonResponse(payload, status=200 if database_ok else 503)


def build_page_url(base_url, path):
    """Join a frontend path onto the base URL without doubling slashes."""
    return f"{base_url.rstrip('/')}/{path.lstrip('/')}"


def probe_url(url, timeout):
    """Request ``url`` and return a status dict without raising on failure."""
    started = time.perf_counter()
    status_code = None
    error = None

    try:
        probe = Request(url, headers={"User-Agent": "Zone01 admin frontend check"})
        with urlopen(probe, timeout=timeout) as response:
            response.read(1024)
            status_code = response.status
    except HTTPError as exc:
        # Server answered, but with an error status.
        status_code = exc.code
    except (URLError, TimeoutError, OSError) as exc:
        error = str(getattr(exc, "reason", exc))

    return {
        "status_code": status_code,
        "error": error,
        "latency_ms": round((time.perf_counter() - started) * 1000),
        "reachable": status_code is not None and 200 <= status_code < 400,
    }


@staff_member_required
def frontend_status(request):
    """Admin page that checks the hosted frontend and each configured page.

    The frontend root is always checked first, followed by every active
    :class:`~core.models.FrontendPage`. Editors can confirm the React app and
    its individual pages are up without leaving the dashboard.
    """
    base_url = settings.FRONTEND_URL
    timeout = settings.FRONTEND_HEALTH_TIMEOUT

    pages = [{"label": "Home", "url": base_url}]
    for page in FrontendPage.objects.filter(is_active=True):
        pages.append({"label": page.label, "url": build_page_url(base_url, page.path)})

    for page in pages:
        page.update(probe_url(page["url"], timeout))

    up_count = sum(1 for page in pages if page["reachable"])

    context = {
        **admin.site.each_context(request),
        "title": "Frontend status",
        "frontend_url": base_url,
        "timeout": timeout,
        "pages": pages,
        "total": len(pages),
        "up_count": up_count,
        "all_up": up_count == len(pages),
        "checked_at": timezone.now(),
    }
    return render(request, "admin/frontend_status.html", context)


def _content_security_policy(html):
    """CSP for the SPA, allowing the inline JSON-LD block by its hash.

    React/framer-motion use inline ``style`` attributes and the public pages
    have no inline event handlers, so styles allow ``unsafe-inline`` while
    scripts stay limited to the bundle plus the exact structured-data hash.
    """
    hash_part = ""
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    if match:
        digest = hashlib.sha256(match.group(1).encode("utf-8")).digest()
        hash_part = f" 'sha256-{base64.b64encode(digest).decode()}'"

    return (
        "default-src 'self'; "
        "base-uri 'self'; "
        "object-src 'none'; "
        f"script-src 'self'{hash_part}; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: blob: https:; "
        "font-src 'self' data:; "
        "media-src 'self' blob:; "
        "connect-src 'self' https:; "
        "worker-src 'self' blob:; "
        "frame-ancestors 'self'; "
        "form-action 'self' mailto:"
    )


def spa(request, path=""):
    """Serve the built React app's ``index.html`` for client-side routes.

    The SPA owns every public path; Django keeps ``/api/``, ``/admin/`` and
    ``/healthz``. Assets are referenced as ``/static/...`` and served by the
    staticfiles app (development) or WhiteNoise (production). When the bundle
    has not been built yet, a clear 404 tells the developer what to run.
    """
    try:
        html = settings.FRONTEND_INDEX.read_text(encoding="utf-8")
    except FileNotFoundError:
        # Backend-only development: no SPA build yet, so send the root URL to
        # the CMS login instead of showing a dead 404. In production the bundle
        # is built into the image and this branch is never reached.
        if settings.DEBUG and request.path in ("", "/"):
            return redirect("admin:index")
        raise Http404(
            "Frontend build not found. Run `make frontend` (or build the "
            "frontend with VITE_BASE=/static/) and try again."
        ) from None
    response = HttpResponse(html, content_type="text/html")
    response["Content-Security-Policy"] = _content_security_policy(html)
    return response


def api_not_found(request):
    """JSON 404 for unknown ``/api/`` paths, instead of falling through to the SPA."""
    return JsonResponse({"detail": "Not found"}, status=404)


@require_GET
def robots_txt(request):
    """Serve ``robots.txt`` from the built frontend, with a safe fallback."""
    path = settings.FRONTEND_DIST / "robots.txt"
    try:
        body = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        body = "User-agent: *\nAllow: /\n"
    return HttpResponse(body, content_type="text/plain")


@require_GET
def sitemap_xml(request):
    """Serve the generated sitemap from the built frontend."""
    path = settings.FRONTEND_DIST / "sitemap.xml"
    try:
        body = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        body = (
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
        )
    return HttpResponse(body, content_type="application/xml")
