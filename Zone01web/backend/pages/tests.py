from cms.api import create_page
from cms.models import PageContent
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.core.exceptions import ValidationError
from django.test import TestCase
from djangocms_versioning.models import Version

from pages.models import PageSections, validate_sections


class PageSectionsApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_superuser(
            username="tester", email="tester@example.com", password="pw"
        )
        Site.objects.update_or_create(id=1, defaults={"domain": "localhost", "name": "localhost"})

    def _make_page(self, slug, title, published=True, sections=None):
        page = create_page(title, "base.html", "en", slug=slug, created_by=self.user)
        content = PageContent.admin_manager.filter(page=page, language="en").order_by("-pk").first()
        if sections is not None:
            PageSections.objects.create(extended_object=content, sections=sections)
        if published:
            Version.objects.get_for_content(content).publish(self.user)
        return page

    def test_page_list_returns_published_pages(self):
        self._make_page("home", "Home")

        response = self.client.get("/api/v1/pages/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["pages"][0]["slug"], "home")

    def test_page_detail_returns_sections(self):
        self._make_page(
            "home",
            "Home",
            sections=[
                {"key": "hero", "label": "Hero", "content": "Welcome"},
                {"key": "cta", "label": "Call to action", "content": "Apply now"},
            ],
        )

        body = self.client.get("/api/v1/pages/home/").json()

        self.assertEqual(body["title"], "Home")
        self.assertEqual([s["key"] for s in body["sections"]], ["hero", "cta"])
        for section in body["sections"]:
            self.assertEqual(set(section), {"key", "label", "content"})
            self.assertTrue(all(isinstance(v, str) for v in section.values()))

    def test_unpublished_page_is_hidden(self):
        self._make_page("secret", "Secret", published=False)

        self.assertEqual(self.client.get("/api/v1/pages/secret/").status_code, 404)
        slugs = [p["slug"] for p in self.client.get("/api/v1/pages/").json()["pages"]]
        self.assertNotIn("secret", slugs)

    def test_only_get_is_allowed(self):
        self._make_page("home", "Home")

        self.assertEqual(self.client.post("/api/v1/pages/home/").status_code, 405)


class SectionValidationTests(TestCase):
    def test_valid_payload(self):
        validate_sections([{"key": "hero", "label": "Hero", "content": "Hi"}])

    def test_rejects_missing_key(self):
        with self.assertRaises(ValidationError):
            validate_sections([{"key": "hero", "label": "Hero"}])

    def test_rejects_non_string_content(self):
        with self.assertRaises(ValidationError):
            validate_sections([{"key": "hero", "label": "Hero", "content": {"a": 1}}])

    def test_rejects_non_list(self):
        with self.assertRaises(ValidationError):
            validate_sections({"key": "hero"})
