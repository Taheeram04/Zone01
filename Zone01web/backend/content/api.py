"""Read-only JSON API for the public website.

The React frontend calls these endpoints to render partners, staff, news,
impact and the next-piscine alert. Everything here is read-only; editing
happens in the Django admin.

Endpoints (all GET):

* ``/api/content/``  - everything in one request (preferred by the frontend)
* ``/api/partners/``
* ``/api/staff/``
* ``/api/news/``
* ``/api/impact/``
* ``/api/piscine/``
* ``/api/pages/``            - published pages with their sections
* ``/api/pages/<slug>/``     - a single page by slug (e.g. about-us)
"""

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET

from content.models import (
    ImpactUpdate,
    NewsUpdate,
    Page,
    Partner,
    PiscineRegistration,
    StaffMember,
)


def _media_url(request, media):
    """Return an absolute URL for an image or file, or ``None`` when absent."""
    if not media:
        return None
    try:
        return request.build_absolute_uri(media.url)
    except ValueError:
        return None


def serialize_partner(request, partner):
    return {
        "id": partner.id,
        "name": partner.name,
        "logo": _media_url(request, partner.logo),
        "information": partner.information,
        "order": partner.order,
    }


def serialize_staff(request, member):
    return {
        "id": member.id,
        "name": member.name,
        "role": member.role,
        "photo": _media_url(request, member.photo),
        "bio": member.bio,
        "order": member.order,
    }


def serialize_news(request, item):
    return {
        "id": item.id,
        "title": item.title,
        "image": _media_url(request, item.image),
        "information": item.information,
        "published_at": item.published_at.isoformat() if item.published_at else None,
        "order": item.order,
    }


def serialize_impact(request, item):
    report_url = _media_url(request, item.report)
    return {
        "id": item.id,
        "title": item.title,
        "image": _media_url(request, item.image),
        "information": item.information,
        "report": report_url,
        "report_name": item.report.name if report_url and item.report else None,
        "order": item.order,
    }


def serialize_page_section(request, section):
    return {
        "id": section.id,
        "heading": section.heading,
        "subheading": section.subheading,
        "body": section.body,
        "image": _media_url(request, section.image),
        "cta_label": section.cta_label,
        "cta_url": section.cta_url,
        "order": section.order,
    }


def serialize_page(request, page):
    return {
        "id": page.id,
        "slug": page.slug,
        "title": page.title,
        "subtitle": page.subtitle,
        "hero_image": _media_url(request, page.hero_image),
        "meta_title": page.meta_title or page.title,
        "meta_description": page.meta_description,
        "url": page.get_absolute_url(),
        "updated_at": page.updated_at.isoformat() if page.updated_at else None,
        "order": page.order,
        "sections": [serialize_page_section(request, s) for s in page.sections.all()],
    }


def serialize_piscine(piscine):
    starts_at = piscine.starts_at
    return {
        # Auto-expires: false once the start moment has passed, even if the
        # admin toggle is still on.
        "is_active": piscine.is_live,
        "next_piscine_date": piscine.next_piscine_date.isoformat()
        if piscine.next_piscine_date
        else None,
        "starts_at": starts_at.isoformat() if starts_at else None,
        "label": piscine.message or "Next Piscine",
        "message": piscine.message,
        "updated_at": piscine.updated_at.isoformat() if piscine.updated_at else None,
    }


@require_GET
def partner_list(request):
    partners = Partner.objects.all()
    return JsonResponse({"results": [serialize_partner(request, p) for p in partners]})


@require_GET
def staff_list(request):
    staff = StaffMember.objects.all()
    return JsonResponse({"results": [serialize_staff(request, s) for s in staff]})


@require_GET
def news_list(request):
    news = NewsUpdate.objects.filter(is_published=True)
    return JsonResponse({"results": [serialize_news(request, n) for n in news]})


@require_GET
def impact_list(request):
    impact = ImpactUpdate.objects.filter(is_published=True)
    return JsonResponse({"results": [serialize_impact(request, i) for i in impact]})


@require_GET
def piscine_detail(request):
    return JsonResponse(serialize_piscine(PiscineRegistration.get_solo()))


@require_GET
def page_list(request):
    pages = Page.objects.filter(is_published=True).prefetch_related("sections")
    return JsonResponse({"results": [serialize_page(request, p) for p in pages]})


@require_GET
def page_detail(request, slug):
    page = get_object_or_404(
        Page.objects.prefetch_related("sections"),
        slug=slug,
        is_published=True,
    )
    return JsonResponse(serialize_page(request, page))


@require_GET
def content_index(request):
    """Everything the frontend needs, in a single request."""
    return JsonResponse(
        {
            "partners": [serialize_partner(request, p) for p in Partner.objects.all()],
            "staff": [serialize_staff(request, s) for s in StaffMember.objects.all()],
            "news": [
                serialize_news(request, n) for n in NewsUpdate.objects.filter(is_published=True)
            ],
            "impact": [
                serialize_impact(request, i) for i in ImpactUpdate.objects.filter(is_published=True)
            ],
            "piscine": serialize_piscine(PiscineRegistration.get_solo()),
            "pages": [
                serialize_page(request, p)
                for p in Page.objects.filter(is_published=True).prefetch_related("sections")
            ],
        }
    )
