"""Public JSON endpoint that accepts application-form submissions."""

import json

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from applicants.forms import ApplicationForm
from applicants.models import Applicant


def _request_data(request):
    """Return the submitted data, supporting JSON and form-encoded bodies."""
    if request.content_type == "application/json":
        try:
            return json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return None
    return request.POST


def _invalid_json_response():
    errors = {"__all__": [{"message": "Invalid JSON body.", "code": "invalid"}]}
    return JsonResponse({"ok": False, "errors": errors}, status=400)


@csrf_exempt
@require_POST
def apply(request):
    """Validate and store an application, returning JSON.

    * 201 - stored, with an ``id`` and human-friendly ``reference``.
    * 400 - validation failed (``errors`` keyed by field).
    * 409 - an application with that email already exists.
    """
    data = _request_data(request)
    if data is None:
        return _invalid_json_response()

    form = ApplicationForm(data)
    if not form.is_valid():
        errors = form.errors.get_json_data()
        duplicate = any(err.get("code") == "duplicate" for err in errors.get("email", []))
        return JsonResponse({"ok": False, "errors": errors}, status=409 if duplicate else 400)

    applicant = form.save(commit=False)
    applicant.status = Applicant.Status.SUBMITTED
    now = timezone.now()
    applicant.submitted_at = now
    applicant.consented_at = now
    applicant.save()

    payload = {
        "ok": True,
        "id": applicant.id,
        "reference": f"Z01-{applicant.id:06d}",
    }
    return JsonResponse(payload, status=201)
