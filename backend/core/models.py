"""Operational models for the admin dashboard.

Right now this holds the list of frontend pages the admin "Frontend status"
board links to and checks: editors add a label and a path, and the board
concatenates the path onto :setting:`FRONTEND_URL`.
"""

from django.db import models


class FrontendPage(models.Model):
    """A page of the hosted React frontend shown on the status board.

    ``path`` is joined onto :setting:`FRONTEND_URL` to build the URL that the
    admin links to and probes. A leading slash is optional; ``/about`` and
    ``about`` behave the same.
    """

    label = models.CharField(max_length=100)
    path = models.CharField(
        max_length=200,
        help_text="Path on the frontend, e.g. /about or /register.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to stop checking this page.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first on the status board.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "frontend page"
        verbose_name_plural = "frontend pages"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label} ({self.path})"
