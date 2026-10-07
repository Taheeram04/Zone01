"""Operational endpoints for liveness and connectivity checks."""

import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from django.shortcuts import render
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
