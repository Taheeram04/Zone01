"""Frontend-facing page sections attached to django CMS pages.

Sections hang off the (versioned) page content as a list of simple objects of
three strings each — ``key``, ``label`` and ``content``:

    [
        {"key": "hero", "label": "Hero", "content": "Welcome to Zone01"},
        {"key": "cta", "label": "Call to action", "content": "Apply now"}
    ]

The backend stays presentation-free: the React frontend fetches the JSON and
decides how each ``key`` is styled and rendered. Because this is a
``PageContentExtension``, djangocms-versioning copies the sections whenever a
new page version is created, so drafts and published versions stay in sync.
"""

from cms.extensions import PageContentExtension
from cms.extensions.extension_pool import extension_pool
from django.core.exceptions import ValidationError
from django.db import models

SECTION_KEYS = {"key", "label", "content"}


def validate_sections(value):
    """Validate the sections payload: a list of ``key``/``label``/``content``
    objects whose values are all strings."""
    if not isinstance(value, list):
        raise ValidationError("Sections must be a list.")
    for index, section in enumerate(value):
        if not isinstance(section, dict):
            raise ValidationError(f"Section {index} must be an object.")
        if set(section) != SECTION_KEYS:
            raise ValidationError(
                f"Section {index} must have exactly the keys key, label and content."
            )
        for field in ("key", "label", "content"):
            if not isinstance(section[field], str):
                raise ValidationError(f"Section {index}.{field} must be a string.")


@extension_pool.register
class PageSections(PageContentExtension):
    """The ordered sections of a django CMS page content."""

    sections = models.JSONField(
        default=list,
        blank=True,
        validators=[validate_sections],
        help_text='List of {"key": "...", "label": "...", "content": "..."} objects.',
    )

    class Meta:
        verbose_name = "page sections"
        verbose_name_plural = "page sections"

    def __str__(self):
        return f"Sections for {self.extended_object}"
