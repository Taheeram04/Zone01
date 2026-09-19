"""Operational endpoints for liveness and connectivity checks."""

from django.conf import settings
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_GET


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
