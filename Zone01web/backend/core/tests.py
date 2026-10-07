from functools import reduce
from operator import and_, or_
from unittest import skipIf, skipUnless

from django.contrib import admin
from django.contrib.auth.models import User
from django.db import connection
from django.db.models import Q
from django.test import RequestFactory, TestCase

from applicants.admin import ApplicantAdmin
from applicants.models import Applicant
from core.indexes import GinTrigramIndex
from core.search import RANK_ANNOTATION, TrigramSearchMixin

postgres_only = skipUnless(connection.vendor == "postgresql", "PostgreSQL only")
other_backend_only = skipIf(connection.vendor == "postgresql", "non-PostgreSQL only")


def resolve_search_field(model, search_field):
    """Return the (model, column) a ``search_fields`` entry actually reads."""
    parts = search_field.lstrip("^=@").split("__")
    for part in parts[:-1]:
        model = model._meta.get_field(part).related_model
    return model, parts[-1]


class HealthEndpointTests(TestCase):
    def test_health_reports_ok(self):
        response = self.client.get("/healthz")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["database"], "ok")
        self.assertIn("version", body)


class SearchIndexCoverageTests(TestCase):
    """Guards the invariant that keeps admin search index-accelerable.

    Django ORs the search term across every ``search_fields`` entry, so a single
    unindexed column makes PostgreSQL fall back to a sequential scan for the
    whole query.
    """

    def test_every_searched_column_has_a_trigram_index(self):
        missing = []
        for model, model_admin in admin.site._registry.items():
            if not isinstance(model_admin, TrigramSearchMixin):
                continue
            for search_field in model_admin.search_fields:
                target_model, column = resolve_search_field(model, search_field)
                indexed = any(
                    isinstance(index, GinTrigramIndex) and tuple(index.fields) == (column,)
                    for index in target_model._meta.indexes
                )
                if not indexed:
                    missing.append(f"{model.__name__}.{search_field}")
        self.assertEqual(missing, [])

    def test_the_local_admins_opt_into_ranking(self):
        ranked = [
            model_admin
            for model_admin in admin.site._registry.values()
            if isinstance(model_admin, TrigramSearchMixin)
        ]
        self.assertTrue(ranked)


class TrigramTermTests(TestCase):
    def setUp(self):
        self.model_admin = ApplicantAdmin(Applicant, admin.site)

    def test_short_words_are_not_scored(self):
        # pg_trgm needs three characters to form a trigram.
        self.assertEqual(self.model_admin.trigram_terms("am odiambo"), ["odiambo"])
        self.assertEqual(self.model_admin.trigram_terms("a an"), [])

    def test_terms_are_capped(self):
        self.assertEqual(
            self.model_admin.trigram_terms("one two three four five six"),
            ["one", "two", "three", "four"],
        )


@postgres_only
class IContainsLookupTests(TestCase):
    def test_icontains_renders_as_ilike(self):
        sql, params = Applicant.objects.filter(first_name__icontains="am").query.sql_with_params()

        self.assertIn("ILIKE", sql)
        self.assertNotIn("UPPER", sql)
        self.assertEqual(tuple(params), ("%am%",))


class TrigramRankingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_superuser("searcher", "searcher@example.com", "pw")
        self.model_admin = ApplicantAdmin(Applicant, admin.site)
        # Both rows contain the term, but only in the first one does it dominate
        # the searchable text, so the first should outrank the second.
        self.exact = Applicant.objects.create(
            first_name="Achieng",
            last_name="Odhiambo",
            email="achieng@example.com",
            county="Nairobi",
        )
        self.buried = Applicant.objects.create(
            first_name="Brian",
            last_name="Ochieng",
            email="brian@example.com",
            motivation="I heard about Odhiambo on the radio and would like to apply",
        )

    def changelist(self, params):
        request = RequestFactory().get("/admin/applicants/applicant/", params)
        request.user = self.user
        changelist = self.model_admin.get_changelist_instance(request)
        return changelist.get_queryset(request)

    @other_backend_only
    def test_ranking_is_skipped_without_postgres(self):
        queryset = self.changelist({"q": "odhiambo"})

        self.assertNotIn(RANK_ANNOTATION, queryset.query.annotations)
        self.assertNotIn(f"-{RANK_ANNOTATION}", queryset.query.order_by)

    @postgres_only
    def test_closest_match_comes_first(self):
        queryset = self.changelist({"q": "odhiambo"})

        self.assertEqual([a.pk for a in queryset], [self.exact.pk, self.buried.pk])
        self.assertIn(f"-{RANK_ANNOTATION}", queryset.query.order_by)

    def admin_search_query(self, words):
        """Mirror ModelAdmin.get_search_results(): per word, OR across fields."""
        per_word = [
            reduce(
                or_,
                (Q(**{f"{field}__icontains": word}) for field in self.model_admin.search_fields),
            )
            for word in words
        ]
        return reduce(and_, per_word)

    @postgres_only
    def test_match_set_is_unchanged_by_ranking(self):
        # Ranking reorders results; it must not add or drop any.
        ranked = self.changelist({"q": "odhiambo ochieng"})
        plain = Applicant.objects.filter(self.admin_search_query(["odhiambo", "ochieng"]))

        self.assertCountEqual(
            ranked.values_list("pk", flat=True), plain.values_list("pk", flat=True)
        )

    @postgres_only
    def test_explicit_column_sorting_wins(self):
        queryset = self.changelist({"q": "odhiambo", "o": "1"})

        self.assertNotIn(RANK_ANNOTATION, queryset.query.annotations)
        self.assertNotIn(f"-{RANK_ANNOTATION}", queryset.query.order_by)

    @postgres_only
    def test_short_search_terms_are_not_ranked(self):
        queryset = self.changelist({"q": "od"})

        self.assertNotIn(RANK_ANNOTATION, queryset.query.annotations)
