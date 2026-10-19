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
* ``/api/community/`` - news/event/blog/podcast posts grouped by kind
* ``/api/links/``
* ``/api/piscine/``
* ``/api/pages/``            - published pages with their sections
* ``/api/pages/<slug>/``     - a single page by slug (e.g. about-us)
"""

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET

from content.models import (
    CommunityPost,
    FaqCategory,
    ImpactUpdate,
    NewsUpdate,
    Page,
    Partner,
    PiscineDate,
    SiteLink,
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


def serialize_community_post(request, post):
    return {
        "id": post.id,
        "kind": post.kind,
        "title": post.title,
        "slug": post.slug,
        "summary": post.summary,
        "body": post.body,
        "image": _media_url(request, post.cover_image),
        "video_url": post.video_url or None,
        "external_url": post.external_url or None,
        "platform": post.platform,
        "event_date": post.event_date.isoformat() if post.event_date else None,
        "published_at": post.published_at.isoformat() if post.published_at else None,
        "is_featured": post.is_featured,
        "order": post.order,
    }


def _grouped_community_posts(request):
    """Published community posts grouped by kind, newest first in each group.

    Every group is always present (even when empty) so the frontend can render
    a stable set of tabs/sections without a second lookup.
    """
    grouped = {kind: [] for kind, _ in CommunityPost.Kind.choices}
    posts = CommunityPost.objects.filter(is_published=True)
    for post in posts:
        grouped[post.kind].append(serialize_community_post(request, post))
    return grouped


def serialize_link(link):
    return {
        "id": link.id,
        "label": link.label,
        "url": link.url,
        "external": link.is_external,
        "open_in_new_tab": link.open_in_new_tab,
        "show_chevron": link.show_chevron,
        "order": link.order,
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


def serialize_faq_item(request, item):
    return {
        "id": item.id,
        "question": item.question,
        "answer": item.answer,
        "keywords": [k.strip() for k in item.keywords.split(",") if k.strip()],
        "order": item.order,
    }


def serialize_faq_category(request, category):
    # ``category.items`` is prefetched, so filtering here avoids extra queries.
    items = [item for item in category.items.all() if item.is_active]
    return {
        "id": category.id,
        "slug": category.slug,
        "title": category.title,
        "blurb": category.blurb,
        "order": category.order,
        "items": [serialize_faq_item(request, item) for item in items],
    }


def serialize_piscine_date(piscine_date):
    starts_at = piscine_date.starts_at
    return {
        "id": piscine_date.id,
        "date": piscine_date.date.isoformat(),
        "starts_at": starts_at.isoformat() if starts_at else None,
        "label": piscine_date.label or None,
        "message": piscine_date.message or None,
    }


def serialize_piscine():
    # The schedule is the notification: the soonest upcoming active row is the
    # piscine the banner counts down to. It rolls on automatically.
    upcoming = PiscineDate.upcoming()
    next_date = upcoming[0] if upcoming else None
    starts_at = next_date.starts_at if next_date else None
    latest = PiscineDate.objects.exclude(updated_at=None).order_by("-updated_at").first()
    updated_at = None
    if latest is not None:
        updated_at = latest.updated_at or latest.created_at
    return {
        # False when no active piscine is upcoming; unchecking the remaining
        # rows turns the banner off.
        "is_active": next_date is not None,
        "next_piscine_date": next_date.date.isoformat() if next_date else None,
        "starts_at": starts_at.isoformat() if starts_at else None,
        "label": (next_date.message or next_date.label or "Next Piscine")
        if next_date
        else "Next Piscine",
        "message": next_date.message if next_date else "",
        "dates": [serialize_piscine_date(d) for d in upcoming],
        "updated_at": updated_at.isoformat() if updated_at else None,
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
def community_list(request):
    return JsonResponse({"results": _grouped_community_posts(request)})


@require_GET
def link_list(request):
    links = SiteLink.objects.filter(is_active=True)
    return JsonResponse({"results": [serialize_link(link) for link in links]})


@require_GET
def piscine_detail(request):
    return JsonResponse(serialize_piscine())


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
def faq_list(request):
    categories = FaqCategory.objects.filter(is_active=True).prefetch_related("items")
    return JsonResponse({"results": [serialize_faq_category(request, c) for c in categories]})


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
            "community": _grouped_community_posts(request),
            "links": [serialize_link(link) for link in SiteLink.objects.filter(is_active=True)],
            "piscine": serialize_piscine(),
            "pages": [
                serialize_page(request, p)
                for p in Page.objects.filter(is_published=True).prefetch_related("sections")
            ],
            "faqs": [
                serialize_faq_category(request, c)
                for c in FaqCategory.objects.filter(is_active=True).prefetch_related("items")
            ],
        }
    )
