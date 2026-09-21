"""Read-only JSON API consumed by the React frontend.

Sections live on django CMS pages (see :mod:`pages.models`), so these views read
the *published* page content and hand the frontend a presentation-free payload.
Implemented with plain Django views (no DRF) to keep the backend
dependency-light. Every response is JSON and carries CORS headers for the
origins configured in ``settings.API_CORS_ALLOWED_ORIGINS``.
"""

from cms.models.pagemodel import PageUrl
from django.conf import settings
from django.http import JsonResponse
from django.utils.translation import get_language
from django.views.decorators.http import require_GET

from pages.models import PageSections


def _allowed_origin(request):
    allowed = getattr(settings, "API_CORS_ALLOWED_ORIGINS", ["*"])
    if "*" in allowed:
        return "*"
    origin = request.headers.get("Origin")
    if origin and origin in allowed:
        return origin
    return None


def _json(request, payload, status=200):
    response = JsonResponse(payload, status=status, json_dumps_params={"indent": 2})
    origin = _allowed_origin(request)
    if origin:
        response["Access-Control-Allow-Origin"] = origin
        response["Vary"] = "Origin"
    return response


def _published_content(page, language):
    """The published page content, or ``None`` when the page is not published."""
    content = page.get_content_obj(language)
    return content if getattr(content, "pk", None) else None


def _sections(page, language):
    content = _published_content(page, language)
    if content is None:
        return []
    extension = PageSections.objects.filter(extended_object=content).first()
    return extension.sections if extension else []


@require_GET
def page_list(request):
    """GET /api/v1/pages/ — published pages available to the frontend."""
    language = get_language()
    pages = []
    seen = set()
    for url in PageUrl.objects.filter(language=language).select_related("page"):
        if url.page_id in seen:
            continue
        content = _published_content(url.page, language)
        if content is None:
            continue
        seen.add(url.page_id)
        pages.append({"slug": url.slug, "path": url.path, "title": content.title})
    return _json(request, {"pages": pages})


@require_GET
def page_detail(request, slug):
    """GET /api/v1/pages/<slug>/ — a page with its ordered visible sections."""
    language = get_language()
    url = PageUrl.objects.filter(slug=slug, language=language).select_related("page").first()
    if url is None:
        return _json(request, {"detail": "Page not found."}, status=404)

    content = _published_content(url.page, language)
    if content is None:
        return _json(request, {"detail": "Page not found."}, status=404)

    return _json(
        request,
        {
            "slug": url.slug,
            "path": url.path,
            "title": content.title,
            "sections": _sections(url.page, language),
        },
    )
