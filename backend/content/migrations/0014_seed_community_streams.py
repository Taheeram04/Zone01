"""Seed the four Community Hub stream switches.

The rows are created active so a newly published post appears immediately; an
editor can switch a row off without deleting its posts.
"""

from django.db import migrations

STREAMS = [
    ("news", "News", 1),
    ("event", "Events", 2),
    ("blog", "Blog", 3),
    ("podcast", "Podcast", 4),
]


def seed_streams(apps, schema_editor):
    CommunityStream = apps.get_model("site_content", "CommunityStream")
    for kind, label, order in STREAMS:
        CommunityStream.objects.get_or_create(
            kind=kind,
            defaults={"label": label, "order": order, "is_active": True},
        )


def remove_streams(apps, schema_editor):
    CommunityStream = apps.get_model("site_content", "CommunityStream")
    CommunityStream.objects.filter(kind__in=[kind for kind, _, _ in STREAMS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("site_content", "0013_communitystream"),
    ]

    operations = [
        migrations.RunPython(seed_streams, remove_streams),
    ]
