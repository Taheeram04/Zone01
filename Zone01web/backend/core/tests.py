"""Tests for the health endpoint and the admin frontend status board."""

from unittest.mock import patch
from urllib.error import URLError

from cms.utils.permissions import set_current_user
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from core.models import FrontendPage
from core.views import build_page_url


class FakeResponse:
    """Minimal stand-in for the context manager ``urlopen`` returns."""

    def __init__(self, status=200):
        self.status = status

    def read(self, *_args):
        return b""

    def __enter__(self):
        return self

    def __exit__(self, *_exc):
        return False


class HealthEndpointTests(TestCase):
    def test_health_reports_ok(self):
        response = self.client.get("/healthz")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["database"], "ok")
        self.assertIn("version", body)


class BuildPageUrlTests(TestCase):
    def test_joins_paths_without_doubling_slashes(self):
        self.assertEqual(build_page_url("https://x.test/", "/about"), "https://x.test/about")
        self.assertEqual(build_page_url("https://x.test", "about"), "https://x.test/about")
        self.assertEqual(build_page_url("https://x.test", "/"), "https://x.test/")


class FrontendStatusTests(TestCase):
    def setUp(self):
        # CurrentUserMiddleware stores the user in a thread local that outlives
        # the request, so clear any leftover before creating a new user (the
        # django CMS post_save signal would otherwise reference a rolled-back
        # creator row).
        set_current_user(None)
        # The seed migration ships default pages; start from a clean slate.
        FrontendPage.objects.all().delete()
        self.staff = get_user_model().objects.create_user(
            username="staff", password="pw", is_staff=True
        )
        FrontendPage.objects.create(label="About Us", path="/about", order=1)
        FrontendPage.objects.create(label="Hidden", path="/hidden", is_active=False, order=2)

    def tearDown(self):
        set_current_user(None)

    def test_requires_staff_login(self):
        response = self.client.get(reverse("frontend-status"))

        self.assertEqual(response.status_code, 302)

    @patch("core.views.urlopen")
    def test_lists_root_and_active_pages_only(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse(200)
        self.client.force_login(self.staff)

        response = self.client.get(reverse("frontend-status"))

        self.assertEqual(response.status_code, 200)
        labels = [page["label"] for page in response.context["pages"]]
        self.assertEqual(labels, ["Home", "About Us"])
        self.assertEqual(response.context["up_count"], 2)
        self.assertTrue(response.context["all_up"])

    @patch("core.views.urlopen")
    def test_reports_down_pages(self, mock_urlopen):
        mock_urlopen.side_effect = URLError("connection refused")
        self.client.force_login(self.staff)

        response = self.client.get(reverse("frontend-status"))

        self.assertEqual(response.context["up_count"], 0)
        self.assertFalse(response.context["all_up"])
        for page in response.context["pages"]:
            self.assertFalse(page["reachable"])
            self.assertIn("connection refused", page["error"])
