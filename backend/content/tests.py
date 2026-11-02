import base64
import datetime
import shutil
import tempfile
from datetime import timedelta

from cms.utils.permissions import set_current_user
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from filer.models import File

from content.admin import PiscineDateAdmin
from content.forms import PiscineDateBulkAddForm
from content.models import (
    Article,
    Category,
    CommunityPost,
    CommunityStream,
    ImpactUpdate,
    NewsUpdate,
    Page,
    PageSection,
    Partner,
    PiscineDate,
    Project,
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

    def test_next_piscine_date_targets_soonest_upcoming(self):
        today = timezone.localdate()
        PiscineDate.objects.create(date=today - timedelta(days=3))  # already started
        later = PiscineDate.objects.create(date=today + timedelta(days=40))
        soonest = PiscineDate.objects.create(date=today + timedelta(days=10))

        next_date = PiscineDate.next_upcoming()

        self.assertEqual(next_date, soonest)
        self.assertEqual(next_date.starts_at, soonest.starts_at)
        self.assertNotEqual(next_date, later)

    def test_inactive_dates_are_skipped(self):
        today = timezone.localdate()
        PiscineDate.objects.create(date=today + timedelta(days=5), is_active=False)
        active = PiscineDate.objects.create(date=today + timedelta(days=25))

        self.assertEqual(PiscineDate.next_upcoming(), active)

    def test_no_upcoming_date_is_returned_when_all_have_passed(self):
        today = timezone.localdate()
        PiscineDate.objects.create(date=today - timedelta(days=1))

        self.assertIsNone(PiscineDate.next_upcoming())

    def test_message_is_stored_per_piscine(self):
        today = timezone.localdate()
        piscine = PiscineDate.objects.create(
            date=today + timedelta(days=10),
            label="Cohort 8",
            message="Applications are open",
        )

        self.assertEqual(piscine.message, "Applications are open")
        self.assertEqual(str(piscine), f"{piscine.date:%d %b %Y} - Cohort 8")


class PiscineAdminTests(TestCase):
    def test_piscine_dates_are_one_admin_section(self):
        self.assertTrue(admin.site.is_registered(PiscineDate))
        registered_models = {model.__name__ for model in admin.site._registry}
        self.assertNotIn("PiscineRegistration", registered_models)

    def test_admin_exposes_the_banner_message(self):
        model_admin = PiscineDateAdmin(PiscineDate, admin.site)

        self.assertIn("message", model_admin.list_display)
        self.assertIn("message", model_admin.list_editable)

    def test_piscine_date_admin_marks_upcoming(self):
        today = timezone.localdate()
        future = PiscineDate.objects.create(date=today + timedelta(days=10))
        past = PiscineDate.objects.create(date=today - timedelta(days=10))

        model_admin = PiscineDateAdmin(PiscineDate, admin.site)

        self.assertTrue(model_admin.upcoming(future))
        self.assertFalse(model_admin.upcoming(past))


class PiscineDateBulkAddFormTests(TestCase):
    def test_recurring_schedule_generates_a_year_of_dates(self):
        start = datetime.date(2027, 1, 11)
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_RECURRING,
                "start_date": start.isoformat(),
                "interval_weeks": "4",
                "count": "13",
                "label": "Cohort {n}",
                "message": "Applications are open",
                "is_active": "on",
                "skip_existing": "on",
            }
        )

        self.assertTrue(form.is_valid(), form.errors)
        created, skipped = form.save()

        self.assertEqual(created, 13)
        self.assertEqual(skipped, 0)
        dates = list(PiscineDate.objects.order_by("date"))
        self.assertEqual(dates[0].date, start)
        self.assertEqual(dates[-1].date, start + datetime.timedelta(weeks=48))
        self.assertEqual(dates[0].label, "Cohort 1")
        self.assertEqual(dates[-1].label, "Cohort 13")
        self.assertEqual({item.message for item in dates}, {"Applications are open"})
        self.assertTrue(all(item.is_active for item in dates))

    def test_recurring_schedule_can_stop_at_an_end_date(self):
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_RECURRING,
                "start_date": "2027-01-11",
                "interval_weeks": "4",
                "end_date": "2027-03-01",
                "is_active": "on",
            }
        )

        self.assertTrue(form.is_valid(), form.errors)
        form.save()

        self.assertEqual(
            list(PiscineDate.objects.values_list("date", flat=True)),
            [datetime.date(2027, 1, 11), datetime.date(2027, 2, 8)],
        )

    def test_pasted_list_accepts_labels_and_day_first_dates(self):
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_LIST,
                "dates": (
                    "# cohort schedule\n"
                    "2027-01-11 | Cohort 8\n"
                    "08/02/2027, Cohort 9\n"
                    "\n"
                    "01/03/2027; Cohort 10\n"
                ),
                "is_active": "on",
            }
        )

        self.assertTrue(form.is_valid(), form.errors)
        created, _ = form.save()

        self.assertEqual(created, 3)
        self.assertEqual(
            list(PiscineDate.objects.values_list("date", "label")),
            [
                (datetime.date(2027, 1, 11), "Cohort 8"),
                (datetime.date(2027, 2, 8), "Cohort 9"),
                (datetime.date(2027, 3, 1), "Cohort 10"),
            ],
        )

    def test_pasted_list_rejects_an_invalid_date(self):
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_LIST,
                "dates": "2027-01-11\nnot-a-date\n",
                "is_active": "on",
            }
        )

        self.assertFalse(form.is_valid())
        self.assertIn("dates", form.errors)

    def test_existing_dates_are_skipped_by_default(self):
        existing = PiscineDate.objects.create(date=datetime.date(2027, 1, 11))
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_LIST,
                "dates": "2027-01-11\n2027-02-08",
                "is_active": "on",
                "skip_existing": "on",
            }
        )

        self.assertTrue(form.is_valid(), form.errors)
        created, skipped = form.save()

        self.assertEqual((created, skipped), (1, 1))
        self.assertEqual(PiscineDate.objects.count(), 2)
        self.assertEqual(PiscineDate.objects.filter(date=existing.date).count(), 1)

    def test_existing_dates_can_be_created_again_when_skip_is_off(self):
        PiscineDate.objects.create(date=datetime.date(2027, 1, 11))
        form = PiscineDateBulkAddForm(
            {
                "mode": PiscineDateBulkAddForm.MODE_LIST,
                "dates": "2027-01-11",
                "is_active": "on",
            }
        )

        self.assertTrue(form.is_valid(), form.errors)
        created, skipped = form.save()

        self.assertEqual((created, skipped), (1, 0))
        self.assertEqual(PiscineDate.objects.count(), 2)


class PiscineDateBulkAdminTests(TestCase):
    def setUp(self):
        # django CMS keeps the request user in a thread-local. A previous
        # test's user is rolled back with the database, so clear it before
        # creating this test's superuser (the cms permission signal would
        # otherwise point PageUser.created_by at the stale row).
        set_current_user(None)
        self.addCleanup(set_current_user, None)
        self.user = get_user_model().objects.create_superuser(
            username="editor",
            email="editor@example.com",
            password="secret",
        )
        self.client.force_login(self.user)
        self.url = reverse("admin:site_content_piscinedate_bulk_add")

    def test_bulk_add_page_is_linked_from_the_date_list(self):
        response = self.client.get(reverse("admin:site_content_piscinedate_changelist"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.url)
        self.assertContains(response, "Add multiple dates")

    def test_bulk_add_page_renders_the_form(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Repeat a schedule")
        self.assertContains(response, "Paste a list of dates")
        self.assertContains(response, "Banner message")

    def test_bulk_add_creates_a_recurring_schedule(self):
        response = self.client.post(
            self.url,
            {
                "mode": PiscineDateBulkAddForm.MODE_RECURRING,
                "start_date": "2027-01-11",
                "interval_weeks": "4",
                "count": "3",
                "message": "Applications are open",
                "is_active": "on",
                "skip_existing": "on",
            },
        )

        self.assertRedirects(
            response,
            reverse("admin:site_content_piscinedate_changelist"),
        )
        self.assertEqual(
            list(PiscineDate.objects.values_list("date", flat=True)),
            [
                datetime.date(2027, 1, 11),
                datetime.date(2027, 2, 8),
                datetime.date(2027, 3, 8),
            ],
        )
        self.assertEqual(
            set(PiscineDate.objects.values_list("message", flat=True)),
            {"Applications are open"},
        )

    def test_bulk_actions_can_hide_and_show_piscines(self):
        first = PiscineDate.objects.create(date=datetime.date(2027, 1, 11))
        second = PiscineDate.objects.create(date=datetime.date(2027, 2, 8))
        changelist = reverse("admin:site_content_piscinedate_changelist")
        payload = {
            "_selected_action": [first.pk, second.pk],
            "select_across": "0",
            "index": "0",
        }

        hide = self.client.post(
            changelist,
            {**payload, "action": "deactivate_piscines"},
        )
        self.assertEqual(hide.status_code, 302)
        self.assertFalse(PiscineDate.objects.filter(is_active=True).exists())

        show = self.client.post(
            changelist,
            {**payload, "action": "activate_piscines"},
        )
        self.assertEqual(show.status_code, 302)
        self.assertEqual(PiscineDate.objects.filter(is_active=True).count(), 2)

    def test_bulk_add_creates_a_pasted_list(self):
        response = self.client.post(
            self.url,
            {
                "mode": PiscineDateBulkAddForm.MODE_LIST,
                "dates": "2027-01-11 | Cohort 8\n2027-02-08 | Cohort 9",
                "is_active": "on",
            },
        )

        self.assertRedirects(
            response,
            reverse("admin:site_content_piscinedate_changelist"),
        )
        self.assertEqual(PiscineDate.objects.count(), 2)
        self.assertEqual(
            PiscineDate.objects.get(date=datetime.date(2027, 2, 8)).label,
            "Cohort 9",
        )


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

    def test_news_list_exposes_featured_flag(self):
        NewsUpdate.objects.create(title="Featured", is_published=True, is_featured=True)
        NewsUpdate.objects.create(title="Normal", is_published=True)

        response = self.client.get(reverse("content_api:news-list"))

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(results[0]["title"], "Featured")
        self.assertTrue(results[0]["is_featured"])
        self.assertFalse(results[1]["is_featured"])

    def test_api_responses_are_not_cached(self):
        for url_name in ("news-list", "community-list", "piscine-detail"):
            response = self.client.get(reverse(f"content_api:{url_name}"))
            self.assertIn("no-store", response["Cache-Control"])

    def test_piscine_update_does_not_touch_news(self):
        NewsUpdate.objects.create(title="Keep this news", is_published=True)
        piscine = PiscineDate.objects.create(
            date=timezone.localdate() + timedelta(days=30),
            message="First message",
        )

        piscine.message = "Updated piscine message"
        piscine.save()

        response = self.client.get(reverse("content_api:news-list"))

        self.assertEqual(response.status_code, 200)
        titles = [item["title"] for item in response.json()["results"]]
        self.assertIn("Keep this news", titles)

    def test_piscine_detail_exposes_date_and_active_state(self):
        upcoming = PiscineDate.objects.create(date=timezone.localdate() + timedelta(days=30))

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["is_active"])
        self.assertEqual(payload["next_piscine_date"], upcoming.date.isoformat())
        self.assertIsNotNone(payload["starts_at"])
        self.assertEqual(payload["label"], "Next Piscine")

    def test_piscine_uses_the_next_dates_message(self):
        PiscineDate.objects.create(
            date=timezone.localdate() + timedelta(days=30),
            label="Cohort 8",
            message="Applications are open",
        )

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["label"], "Applications are open")
        self.assertEqual(payload["message"], "Applications are open")

    def test_piscine_detail_exposes_the_date_list(self):
        today = timezone.localdate()
        PiscineDate.objects.create(date=today + timedelta(days=30))
        PiscineDate.objects.create(
            date=today + timedelta(days=90),
            label="Cohort 2",
            message="Second intake",
        )

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        dates = response.json()["dates"]
        self.assertEqual(
            [item["date"] for item in dates],
            [(today + timedelta(days=30)).isoformat(), (today + timedelta(days=90)).isoformat()],
        )
        self.assertEqual(dates[1]["label"], "Cohort 2")
        self.assertEqual(dates[1]["message"], "Second intake")
        self.assertIsNone(dates[0]["label"])
        self.assertIsNone(dates[0]["message"])

    def test_piscine_advances_to_the_next_date_after_one_passes(self):
        today = timezone.localdate()
        PiscineDate.objects.create(date=today - timedelta(days=1))
        upcoming = PiscineDate.objects.create(date=today + timedelta(days=20))

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        # Still live: the banner rolls on to the following date rather than
        # switching itself off.
        self.assertTrue(payload["is_active"])
        self.assertEqual(payload["next_piscine_date"], upcoming.date.isoformat())

    def test_piscine_is_off_when_no_upcoming_dates_remain(self):
        PiscineDate.objects.create(date=timezone.localdate() - timedelta(days=1))

        response = self.client.get(reverse("content_api:piscine-detail"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertFalse(payload["is_active"])
        self.assertIsNone(payload["next_piscine_date"])
        self.assertEqual(payload["dates"], [])


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


class CommunityPostModelTests(TestCase):
    def test_str_includes_kind_and_title(self):
        post = CommunityPost.objects.create(
            kind=CommunityPost.Kind.PODCAST,
            title="Episode 1",
            slug="episode-1",
        )
        self.assertEqual(str(post), "Podcast: Episode 1")

    def test_ordering_pins_featured_then_newest(self):
        old = CommunityPost.objects.create(
            title="Old",
            slug="old",
            published_at=timezone.now() - timezone.timedelta(days=10),
        )
        new = CommunityPost.objects.create(title="New", slug="new", published_at=timezone.now())
        pinned = CommunityPost.objects.create(
            title="Pinned",
            slug="pinned",
            published_at=timezone.now() - timezone.timedelta(days=30),
            is_featured=True,
        )

        self.assertEqual(list(CommunityPost.objects.all()), [pinned, new, old])

    def test_slug_is_unique(self):
        CommunityPost.objects.create(title="Hello", slug="hello")

        with self.assertRaises(IntegrityError):
            CommunityPost.objects.create(title="Hello again", slug="hello")

    def test_body_html_is_sanitized(self):
        post = CommunityPost.objects.create(
            title="Rich news",
            slug="rich-news",
            body="<p><strong>Hello</strong><script>alert(1)</script></p>",
        )
        post.refresh_from_db()

        self.assertIn("<strong>Hello</strong>", post.body)
        self.assertNotIn("<script", post.body)


class CommunityApiTests(TestCase):
    def test_community_list_groups_and_hides_unpublished(self):
        CommunityPost.objects.create(
            kind=CommunityPost.Kind.NEWS, title="Live news", slug="live-news"
        )
        CommunityPost.objects.create(
            kind=CommunityPost.Kind.NEWS,
            title="Draft news",
            slug="draft-news",
            is_published=False,
        )
        CommunityPost.objects.create(
            kind=CommunityPost.Kind.EVENT,
            title="Open day",
            slug="open-day",
            event_date=timezone.now(),
            platform=CommunityPost.Platform.INSTAGRAM,
        )

        response = self.client.get(reverse("content_api:community-list"))

        self.assertEqual(response.status_code, 200)
        grouped = response.json()["results"]
        # Every group is present, even when empty.
        self.assertEqual(set(grouped), {"news", "event", "blog", "podcast"})
        self.assertEqual([item["title"] for item in grouped["news"]], ["Live news"])
        self.assertEqual(grouped["blog"], [])
        event = grouped["event"][0]
        self.assertEqual(event["platform"], "instagram")
        self.assertIsNotNone(event["event_date"])

    def test_content_index_includes_community(self):
        CommunityPost.objects.create(kind=CommunityPost.Kind.BLOG, title="A post", slug="a-post")

        response = self.client.get(reverse("content_api:content-index"))

        self.assertEqual(response.status_code, 200)
        community = response.json()["community"]
        self.assertEqual(community["blog"][0]["title"], "A post")

    def test_featured_news_is_first_in_group(self):
        CommunityPost.objects.create(
            kind=CommunityPost.Kind.NEWS,
            title="Newest news",
            slug="newest-news",
            published_at=timezone.now(),
        )
        CommunityPost.objects.create(
            kind=CommunityPost.Kind.NEWS,
            title="Featured older news",
            slug="featured-older-news",
            published_at=timezone.now() - timezone.timedelta(days=10),
            is_featured=True,
        )

        response = self.client.get(reverse("content_api:community-list"))

        self.assertEqual(response.status_code, 200)
        news = response.json()["results"]["news"]
        self.assertEqual(news[0]["title"], "Featured older news")

    def test_community_list_returns_stream_switches(self):
        response = self.client.get(reverse("content_api:community-list"))

        self.assertEqual(response.status_code, 200)
        streams = response.json()["streams"]
        self.assertEqual(
            {stream["kind"] for stream in streams},
            {"news", "event", "blog", "podcast"},
        )
        self.assertTrue(all(stream["is_active"] for stream in streams))

        CommunityStream.objects.filter(kind="event").update(is_active=False)

        response = self.client.get(reverse("content_api:community-list"))
        streams = response.json()["streams"]
        event = next(stream for stream in streams if stream["kind"] == "event")
        self.assertFalse(event["is_active"])


class CommunityUploadTests(TestCase):
    """The rich-text editor uploads images/documents straight from the browser."""

    PNG = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII="
    )

    def setUp(self):
        self.media_dir = tempfile.mkdtemp()
        override = override_settings(MEDIA_ROOT=self.media_dir)
        override.enable()
        self.addCleanup(override.disable)
        self.addCleanup(shutil.rmtree, self.media_dir, ignore_errors=True)

    def test_staff_can_upload_an_image(self):
        user = get_user_model().objects.create_user(
            username="uploader",
            password="x",
            is_staff=True,
        )
        self.client.force_login(user)

        response = self.client.post(
            "/admin/community-upload/?type=image",
            {"upload": SimpleUploadedFile("news.png", self.PNG, content_type="image/png")},
            HTTP_HOST="localhost",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["uploaded"], 1)
        self.assertEqual(payload["fileName"], "news.png")
        self.assertTrue(payload["url"].startswith("/media/community/"))

        stored_name = payload["url"].removeprefix("/media/")
        self.assertTrue(default_storage.exists(stored_name))

    def test_non_staff_cannot_upload(self):
        response = self.client.post(
            "/admin/community-upload/?type=image",
            {"upload": SimpleUploadedFile("news.png", self.PNG, content_type="image/png")},
            HTTP_HOST="localhost",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["uploaded"], 0)

    def test_disallowed_extension_is_rejected(self):
        user = get_user_model().objects.create_user(
            username="uploader",
            password="x",
            is_staff=True,
        )
        self.client.force_login(user)

        response = self.client.post(
            "/admin/community-upload/?type=image",
            {
                "upload": SimpleUploadedFile(
                    "payload.html",
                    b"<script>alert(1)</script>",
                    content_type="text/html",
                )
            },
            HTTP_HOST="localhost",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["uploaded"], 0)


class AdminEditLinkTests(TestCase):
    """News and community posts can be reopened from their changelists."""

    def setUp(self):
        set_current_user(None)
        self.addCleanup(set_current_user, None)
        self.user = get_user_model().objects.create_superuser(
            username="post-editor",
            email="editor@example.com",
            password="secret",
        )
        self.client.force_login(self.user)

    def test_news_changelist_links_to_the_change_form(self):
        news = NewsUpdate.objects.create(title="Editable news", is_published=True)

        response = self.client.get(reverse("admin:site_content_newsupdate_changelist"))

        self.assertContains(
            response,
            reverse("admin:site_content_newsupdate_change", args=[news.pk]),
        )
        self.assertContains(
            response,
            reverse("admin:site_content_newsupdate_delete", args=[news.pk]),
        )

    def test_community_changelist_links_to_the_change_form(self):
        post = CommunityPost.objects.create(
            kind=CommunityPost.Kind.BLOG,
            title="Editable blog post",
            slug="editable-blog-post",
            is_published=True,
        )

        response = self.client.get(reverse("admin:site_content_communitypost_changelist"))

        self.assertContains(
            response,
            reverse("admin:site_content_communitypost_change", args=[post.pk]),
        )
        self.assertContains(
            response,
            reverse("admin:site_content_communitypost_delete", args=[post.pk]),
        )


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


class ProjectApiTests(TestCase):
    def test_project_list_returns_active_projects(self):
        Project.objects.create(
            name="AgriSense",
            slug="agrisense",
            founders="Amina Otieno, Brian Ochieng",
            cohort="Cohort 3 (2025)",
            description="Helps smallholder farmers spot crop disease early.",
            tech="Django, React, PostgreSQL",
            website_url="https://agrisense.example.com",
        )
        Project.objects.create(name="Hidden draft", slug="hidden", is_active=False)

        response = self.client.get(reverse("content_api:project-list"))

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 1)
        project = results[0]
        self.assertEqual(project["name"], "AgriSense")
        self.assertEqual(project["founders"], ["Amina Otieno", "Brian Ochieng"])
        self.assertEqual(project["cohort"], "Cohort 3 (2025)")
        self.assertEqual(project["tech"], ["Django", "React", "PostgreSQL"])
        self.assertEqual(project["website_url"], "https://agrisense.example.com")
        self.assertEqual(project["gallery"], [])
        self.assertIsNone(project["image"])

    def test_content_index_includes_projects(self):
        Project.objects.create(name="WaterWatch", slug="waterwatch")

        response = self.client.get(reverse("content_api:content-index"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [project["name"] for project in response.json()["projects"]],
            ["WaterWatch"],
        )


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
