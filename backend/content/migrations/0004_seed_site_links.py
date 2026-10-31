# Seed the header links that used to be hard-coded in the frontend navbar.

from django.db import migrations

INITIAL_LINKS = [
    {"label": "Home", "url": "/", "order": 0, "show_chevron": False},
    {"label": "About Us", "url": "/about", "order": 1, "show_chevron": True},
    {"label": "Community", "url": "/community", "order": 2, "show_chevron": True},
    {"label": "Our Impact", "url": "/impact", "order": 3, "show_chevron": True},
    {"label": "Hire Talent", "url": "/hire", "order": 4, "show_chevron": False},
]


def seed_links(apps, schema_editor):
    SiteLink = apps.get_model("site_content", "SiteLink")
    if SiteLink.objects.exists():
        return
    for link in INITIAL_LINKS:
        SiteLink.objects.create(is_active=True, open_in_new_tab=False, **link)


def unseed_links(apps, schema_editor):
    SiteLink = apps.get_model("site_content", "SiteLink")
    labels = [link["label"] for link in INITIAL_LINKS]
    SiteLink.objects.filter(label__in=labels).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("site_content", "0003_sitelink"),
    ]

    operations = [
        migrations.RunPython(seed_links, unseed_links),
    ]
