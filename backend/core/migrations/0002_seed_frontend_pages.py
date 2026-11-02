# Seed the frontend routes the admin status board should link to and check.
#
# The frontend root is always shown by the status view, so it is not seeded here.

from django.db import migrations

INITIAL_PAGES = [
    {"label": "About Us", "path": "/about", "order": 1},
    {"label": "Community", "path": "/community", "order": 2},
    {"label": "Our Impact", "path": "/impact", "order": 3},
    {"label": "Hire Talent", "path": "/hire", "order": 4},
    {"label": "Register", "path": "/register", "order": 5},
]


def seed_pages(apps, schema_editor):
    FrontendPage = apps.get_model("core", "FrontendPage")
    if FrontendPage.objects.exists():
        return
    for page in INITIAL_PAGES:
        FrontendPage.objects.create(is_active=True, **page)


def unseed_pages(apps, schema_editor):
    FrontendPage = apps.get_model("core", "FrontendPage")
    labels = [page["label"] for page in INITIAL_PAGES]
    FrontendPage.objects.filter(label__in=labels).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_pages, unseed_pages),
    ]
