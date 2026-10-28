"""Seed or refresh the FAQ knowledge base.

Reads :data:`content.faq_data.FAQ_SEED` and upserts categories and items by
``slug`` / ``question``. Safe to re-run: it updates wording in place instead of
creating duplicates, so it works both for first-time setup and for re-syncing
after editing ``faq_data.py``.

    python manage.py seed_faqs            # create / update
    python manage.py seed_faqs --prune    # also delete rows removed from the seed
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from content.faq_data import FAQ_SEED
from content.models import FaqCategory, FaqItem


class Command(BaseCommand):
    help = "Load the FAQ categories and items from content/faq_data.py (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--prune",
            action="store_true",
            help="Delete FAQ rows that are no longer present in the seed file.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        prune = options["prune"]
        categories_created = categories_updated = 0
        items_created = items_updated = 0
        kept_category_pks = []
        kept_item_pks = []

        for category_order, category_data in enumerate(FAQ_SEED):
            category, created = FaqCategory.objects.update_or_create(
                slug=category_data["slug"],
                defaults={
                    "title": category_data["title"],
                    "blurb": category_data.get("blurb", ""),
                    "order": category_order,
                    "is_active": True,
                },
            )
            categories_created += int(created)
            categories_updated += int(not created)
            kept_category_pks.append(category.pk)

            for item_order, item_data in enumerate(category_data["items"]):
                item, item_created = FaqItem.objects.update_or_create(
                    category=category,
                    question=item_data["question"],
                    defaults={
                        "answer": item_data["answer"],
                        "keywords": item_data.get("keywords", ""),
                        "order": item_order,
                        "is_active": True,
                    },
                )
                items_created += int(item_created)
                items_updated += int(not item_created)
                kept_item_pks.append(item.pk)

        if prune:
            FaqItem.objects.exclude(pk__in=kept_item_pks).delete()
            FaqCategory.objects.exclude(pk__in=kept_category_pks).delete()

        self.stdout.write(
            self.style.SUCCESS(
                "FAQ seed complete: "
                f"{categories_created} categories added, {categories_updated} updated; "
                f"{items_created} questions added, {items_updated} updated."
                + (" Pruned stale rows." if prune else "")
            )
        )
