"""Adds a "Page sections" entry to the django CMS page toolbar.

Editors open a page in edit mode and manage its sections from the page menu.
The extension is attached to the page's (draft) content, so publishing copies
it to the live version through djangocms-versioning.
"""

from cms.models import PageContent
from cms.toolbar_base import CMSToolbar
from cms.toolbar_pool import toolbar_pool
from cms.utils.page_permissions import user_can_change_page
from cms.utils.urlutils import admin_reverse
from django.urls import NoReverseMatch
from django.utils.translation import gettext_lazy as _

from pages.models import PageSections


def _current_content(page, language):
    return PageContent.admin_manager.filter(page=page, language=language).order_by("-pk").first()


@toolbar_pool.register
class PageSectionsToolbar(CMSToolbar):
    def populate(self):
        page = self.request.current_page
        if not page or not user_can_change_page(self.request.user, page=page):
            return

        content = _current_content(page, self.toolbar.request_language)
        if content is None:
            return

        extension = PageSections.objects.filter(extended_object=content).first()
        try:
            if extension:
                url = admin_reverse("pages_pagesections_change", args=(extension.pk,))
            else:
                url = admin_reverse("pages_pagesections_add") + f"?extended_object={content.pk}"
        except NoReverseMatch:
            return

        menu = self.toolbar.get_or_create_menu("page")
        menu.add_modal_item(
            _("Page sections"),
            url=url,
            disabled=not self.toolbar.edit_mode_active,
        )
