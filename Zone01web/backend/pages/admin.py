from cms.extensions import PageContentExtensionAdmin
from django.contrib import admin

from pages.models import PageSections


@admin.register(PageSections)
class PageSectionsAdmin(PageContentExtensionAdmin):
    """Edit a page's sections.

    Reached from the CMS page toolbar; like other django CMS extensions it is
    intentionally hidden from the admin index.
    """

    fields = ("sections",)
