from django.db import migrations

REPORTS = [
    ("Q4 2026 Report", "2026-10-01", 1),
    ("Q3 2026 Report", "2026-07-01", 2),
    ("Q2 2026 Report", "2026-04-01", 3),
    ("Q1 2026 Report", "2026-01-01", 4),
    ("2025 Annual Report", "2025-12-31", 5),
    ("2024 Annual Report", "2024-12-31", 6),
]


def seed_reports(apps, schema_editor):
    Report = apps.get_model("site_content", "Report")
    for title, published_at, order in REPORTS:
        Report.objects.get_or_create(
            title=title,
            defaults={
                "published_at": published_at,
                "order": order,
                "is_published": True,
            },
        )


def unseed_reports(apps, schema_editor):
    Report = apps.get_model("site_content", "Report")
    Report.objects.filter(title__in=[title for title, _, _ in REPORTS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("site_content", "0018_report"),
    ]

    operations = [
        migrations.RunPython(seed_reports, unseed_reports),
    ]
