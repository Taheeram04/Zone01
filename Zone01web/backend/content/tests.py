import shutil
import tempfile
from datetime import timedelta

from django.contrib import admin
from django.core.files.base import ContentFile
from django.db import IntegrityError
from django.test import RequestFactory, TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from filer.models import File

from content.admin import PiscineRegistrationAdmin
from content.models import (
    Article,
    Category,
    ImpactUpdate,
    NewsUpdate,
    Page,
    PageSection,
    Partner,
    PiscineRegistration,
    SiteLink,
    StaffMember,
)


class ContentModelTests(TestCase):
    def test_partner_str(self):
        partner = Partner.objects.create(name="Acme")
        self.assertEqual(str(partner), "Acme")

    def test_staff_str(self):
        member = StaffMember.objects.create(name="Jane Doe", role="Lead Instructor")
        self.assertEqual(str(member), "Jane Doe - Lead Instructor")

    def test_news_ordering_prefers_newest(self):
        NewsUpdate.objects.create(
            title="Older", published_at=timezone.now() - timezone.timedelta(days=30)
        )
        NewsUpdate.objects.create(title="Newer", published_at=timezone.now())
        self.assertEqual(NewsUpdate.objects.first().title, "Newer")

    def test_impact_publish_flag(self):
        ImpactUpdate.objects.create(title="Hidden", is_published=False)
        ImpactUpdate.objects.create(title="Shown", is_published=True)
        visible = ImpactUpdate.objects.filter(is_published=True).values_list("title", flat=True)
        self.assertEqual(list(visible), ["Shown"])

    def test_piscine_is_singleton(self):
        first = PiscineRegistration.get_solo()
        first.is_active = True
        first.save()
        second = PiscineRegistration.get_solo()
        self.assertEqual(first.pk, second.pk)
        self.assertEqual(PiscineRegistration.objects.count(), 1)

    def test_piscine_save_upserts_into_the_singleton(self):
        PiscineRegistration.get_solo()

        replacement = PiscineRegistration(
            next_piscine_date=timezone.localdate() + timedelta(days=21),
            is_active=True,
        )
        replacement.save()

        self.assertEqual(PiscineRegistration.objects.count(), 1)
        stored = PiscineRegistration.objects.get()
        self.assertEqual(stored.pk, 1)
        self.assertEqual(stored.next_piscine_date, replacement.next_piscine_date)
        self.assertTrue(stored.is_active)


class PiscineAdminTests(TestCase):
    def setUp(self):
        # The singleton row exists, which used to hide the admin "Add" button.
        PiscineRegistration.get_solo()

    def test_admin_can_always_add_the_next_piscine(self):
        model_admin = PiscineRegistrationAdmin(PiscineRegistration, admin.site)
        request = RequestFactory().get("/admin/content/piscineregistration/add/")

        self.assertTrue(PiscineRegistration.objects.exists())
        self.assertTrue(model_admin.has_add_permission(request))
        # Still a singleton: no deleting.
        self.assertFalse(model_admin.has_delete_permission(request))

    def test_add_form_is_prefilled_from_the_current_row(self):
        current = PiscineRegistration.get_solo()
        current.next_piscine_date = timezone.localdate() + timedelta(days=7)
        current.message = "Piscine #7"
        current.is_active = True
        current.save()

        model_admin = PiscineRegistrationAdmin(PiscineRegistration, admin.site)
        initial = model_admin.get_changeform_initial_data(
            RequestFactory().get("/admin/content/piscineregistration/add/")
        )

        self.assertEqual(initial["next_piscine_date"], current.next_piscine_date)
        self.assertEqual(initial["message"], "Piscine #7")
        self.assertTrue(initial["is_active"])


class ContentApiTests(TestCase):
    def test_content_index_returns_all_blocks(self):
        Partner.objects.create(name="Acme")
        StaffMember.objects.create(name="Jane Doe", role="Coach")
        NewsUpdate.objects.create(title="We launched")
        ImpactUpdate.objects.create(title="1000 graduates")

        response = self.client.get(reverse("content_api:content-index"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload["partners"]), 1)
        self.assertEqual(len(payload["staff"]), 1)
        self.assertEqual(len(payload["news"]), 1)
        self.assertEqual(len(payload["impact"]), 1)
        self.assertIsNone(payload["impact"][0]["report"])
        self.assertIn("is_active", payload["piscine"])

    def test_news_list_hides_unpublished(self):
        NewsUpdate.objects.create(title="Draft", is_published=False)
        NewsUpdate.objects.create(title="Live", is_published=True)

        response = self.client.get(reverse("content_api:news-list"))

        self.assertEqual(response.status_code, 200)
        titles = [item["title"] for item in response.json()["results"]]
        self.assertEqual(titles, ["Live"])

    def test_piscine_detail_exposes_date_and_toggle(self):
        piscine = PiscineRegistration.get_solo()
        piscine.is_active = True
        piscine.next_piscine_date = timezone.localdate() + timedelta(days=30)
        piscine.save()

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["is_active"])
        self.assertEqual(payload["next_piscine_date"], piscine.next_piscine_date.isoformat())
        self.assertIsNotNone(payload["starts_at"])
        self.assertEqual(payload["label"], "Next Piscine")

    def test_piscine_switches_off_after_its_start_time(self):
        piscine = PiscineRegistration.get_solo()
        piscine.is_active = True
        piscine.next_piscine_date = timezone.localdate() - timedelta(days=1)
        piscine.save()

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["is_active"])
        # The admin toggle is switched off automatically so it must be
        # re-activated for the next piscine.
        piscine.refresh_from_db()
        self.assertFalse(piscine.is_active)


class ImpactReportTests(TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media_root)
        self.override.enable()
        self.addCleanup(self.override.disable)
        self.addCleanup(shutil.rmtree, self.media_root, ignore_errors=True)

    def _make_report(self):
        return File.objects.create(
            file=ContentFile(b"%PDF-1.4 test report", name="impact-report.pdf"),
            original_filename="impact-report.pdf",
        )

    def test_report_is_exposed_by_the_api(self):
        report = self._make_report()
        ImpactUpdate.objects.create(title="1000 graduates", report=report)

        response = self.client.get(reverse("content_api:impact-list"))

        self.assertEqual(response.status_code, 200)
        item = response.json()["results"][0]
        self.assertIsNotNone(item["report"])
        self.assertTrue(item["report"].endswith("impact-report.pdf"))
        self.assertEqual(item["report_name"], report.name)

    def test_report_can_be_cleared(self):
        report = self._make_report()
        impact = ImpactUpdate.objects.create(title="1000 graduates", report=report)

        impact.report = None
        impact.save()

        response = self.client.get(reverse("content_api:impact-list"))
        self.assertIsNone(response.json()["results"][0]["report"])


class CategoryModelTests(TestCase):
    def test_str_is_the_name(self):
        self.assertEqual(str(Category.objects.create(name="News", slug="news")), "News")

    def test_slug_is_unique(self):
        Category.objects.create(name="News", slug="news")

        with self.assertRaises(IntegrityError):
            Category.objects.create(name="News again", slug="news")


class ArticleModelTests(TestCase):
    def test_category_relation(self):
        category = Category.objects.create(name="News", slug="news")
        article = Article.objects.create(title="Hello", slug="hello", category=category)

        self.assertEqual(article.category, category)
        self.assertIn(article, category.articles.all())
        self.assertEqual(article.status, Article.Status.DRAFT)

    def test_defaults(self):
        article = Article.objects.create(title="Hello", slug="hello")

        self.assertIsNone(article.category)
        self.assertIsNone(article.author)
        self.assertIsNone(article.published_at)
        self.assertEqual(article.status, Article.Status.DRAFT)

    def test_ordering_prefers_newest_published(self):
        older = Article.objects.create(
            title="Older",
            slug="older",
            status=Article.Status.PUBLISHED,
            published_at=timezone.now() - timezone.timedelta(days=30),
        )
        newer = Article.objects.create(
            title="Newer",
            slug="newer",
            status=Article.Status.PUBLISHED,
            published_at=timezone.now(),
        )

        self.assertEqual(list(Article.objects.all()), [newer, older])

    def test_category_is_kept_when_deleted(self):
        category = Category.objects.create(name="News", slug="news")
        article = Article.objects.create(title="Hello", slug="hello", category=category)

        category.delete()
        article.refresh_from_db()

        self.assertIsNone(article.category)


class PageApiTests(TestCase):
    def setUp(self):
        Page.objects.all().delete()

    def test_page_slug_and_absolute_url(self):
        home = Page.objects.create(slug="home", title="Home")
        about = Page.objects.create(slug="about-us", title="About Us")
        self.assertEqual(home.get_absolute_url(), "/")
        self.assertEqual(about.get_absolute_url(), "/about-us")

    def test_page_list_hides_unpublished(self):
        Page.objects.create(slug="about-us", title="About Us", is_published=True)
        Page.objects.create(slug="community", title="Community", is_published=False)

        response = self.client.get(reverse("content_api:page-list"))

        self.assertEqual(response.status_code, 200)
        slugs = [page["slug"] for page in response.json()["results"]]
        self.assertEqual(slugs, ["about-us"])

    def test_page_detail_returns_sections_in_order(self):
        page = Page.objects.create(slug="our-impact", title="Our Impact")
        PageSection.objects.create(page=page, heading="Second", order=2)
        PageSection.objects.create(page=page, heading="First", order=1)

        response = self.client.get(reverse("content_api:page-detail", args=["our-impact"]))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["slug"], "our-impact")
        self.assertEqual(payload["url"], "/our-impact")
        self.assertEqual([s["heading"] for s in payload["sections"]], ["First", "Second"])

    def test_page_detail_unknown_slug_returns_404(self):
        response = self.client.get(reverse("content_api:page-detail", args=["nope"]))
        self.assertEqual(response.status_code, 404)

    def test_content_index_includes_pages(self):
        Page.objects.create(slug="home", title="Home")

        response = self.client.get(reverse("content_api:content-index"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("pages", response.json())


class SiteLinkApiTests(TestCase):
    def setUp(self):
        # The seed migration ships the default header links; start clean.
        SiteLink.objects.all().delete()

    def test_link_list_hides_inactive(self):
        SiteLink.objects.create(label="Home", url="/", order=0)
        SiteLink.objects.create(label="Hidden", url="/hidden", is_active=False, order=1)

        response = self.client.get(reverse("content_api:link-list"))

        self.assertEqual(response.status_code, 200)
        labels = [item["label"] for item in response.json()["results"]]
        self.assertEqual(labels, ["Home"])

    def test_link_external_flag_and_order(self):
        SiteLink.objects.create(label="Docs", url="https://example.com", order=2)
        SiteLink.objects.create(label="About", url="/about", order=1)

        response = self.client.get(reverse("content_api:content-index"))
        links = response.json()["links"]

        self.assertEqual([link["label"] for link in links], ["About", "Docs"])
        self.assertFalse(links[0]["external"])
        self.assertTrue(links[1]["external"])
