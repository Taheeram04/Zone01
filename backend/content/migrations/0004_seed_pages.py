from django.db import migrations

PAGES = [
    ("home", "Home", 0),
    ("about-us", "About Us", 1),
    ("community", "Community", 2),
    ("our-impact", "Our Impact", 3),
    ("hire-talent", "Hire Talent", 4),
    ("donate", "Donate", 5),
]


def seed_pages(apps, schema_editor):
    Page = apps.get_model("site_content", "Page")
    for slug, title, order in PAGES:
        Page.objects.get_or_create(
            slug=slug,
            defaults={"title": title, "order": order},
        )


def unseed_pages(apps, schema_editor):
    Page = apps.get_model("site_content", "Page")
    Page.objects.filter(slug__in=[slug for slug, _, _ in PAGES], sections__isnull=True).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("site_content", "0003_page_pagesection"),
    ]

    operations = [
        migrations.RunPython(seed_pages, unseed_pages),
    ]
