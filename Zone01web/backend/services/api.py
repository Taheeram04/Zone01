"""Read-only JSON API for the service catalogue behind the *Hire Talent* page.

Endpoints (all GET):

* ``/api/services/``            - every service, plus the groups used by the
  technologies grid.
* ``/api/services/<slug>/``     - a single service by slug (service detail page).

The response shapes mirror the 01talentke_website Inertia props so the ported
frontend sections can consume them unchanged:

``{"services": [...], "navbar_services": {...}}``
``{"service": {...}, "navbar_services": {...}}``
"""

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET

from services.models import Service

# Attributes of ``navbar_services`` in the original app.
GROUP_KEYS = {
    "what_we_offer": "what_we_offer",
    "language": "languages",
    "framework": "frameworks",
    "specialization": "specializations",
}


def _media_url(request, media):
    """Return an absolute URL for an uploaded file, or ``None`` when absent."""
    if not media:
        return None
    try:
        return request.build_absolute_uri(media.url)
    except ValueError:
        return None


def serialize_service(request, service):
    return {
        "id": str(service.id),
        "name": service.name,
        "title": service.title,
        "slug": service.slug,
        "description": service.description,
        "category": service.category,
        "image": _media_url(request, service.image),
        "order": service.order,
        "created_at": service.created_at.isoformat() if service.created_at else None,
    }


def grouped_services(request):
    """Group services for the technologies grid, keyed like the original app."""
    groups = {key: [] for key in GROUP_KEYS.values()}
    for service in Service.objects.all():
        group = GROUP_KEYS.get(service.category)
        if group:
            groups[group].append(serialize_service(request, service))
    return groups


@require_GET
def service_list(request):
    services = Service.objects.all()
    return JsonResponse(
        {
            "services": [serialize_service(request, service) for service in services],
            "navbar_services": grouped_services(request),
        }
    )


@require_GET
def service_detail(request, slug):
    service = get_object_or_404(Service, slug=slug)
    return JsonResponse(
        {
            "service": serialize_service(request, service),
            "navbar_services": grouped_services(request),
        }
    )
