"""Operational endpoints for liveness and connectivity checks."""

from django.conf import settings
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_GET

from core.models import PiscineCountdown


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


@require_GET
def piscine_countdown(request):
    """Public config for the homepage "Next Piscine" countdown.

    ``is_active`` is only true while the piscine is enabled and still in the
    future, so the countdown switches itself off automatically once D-day
    arrives (or an editor disables it).
    """
    now = timezone.now()
    setting = PiscineCountdown.objects.filter(pk=1).first()
    starts_at = setting.starts_at if setting else None

    is_active = bool(setting and setting.is_enabled and starts_at is not None and starts_at > now)

    payload = {
        "label": setting.label if setting else "Next Piscine",
        "starts_at": starts_at.isoformat() if starts_at else None,
        "is_active": is_active,
        "server_time": now.isoformat(),
    }

    response = JsonResponse(payload)
    # Public, read-only endpoint consumed by the separate frontend origin.
    response["Access-Control-Allow-Origin"] = "*"
    return response
