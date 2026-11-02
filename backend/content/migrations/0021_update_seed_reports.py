from django.db import migrations

REPORTS = [
    ("Q3 2026 Report", 2026, "2026-10-01", 1),
    ("Q2 2026 Report", 2026, "2026-07-01", 2),
    ("Q1 2026 Report", 2026, "2026-04-01", 3),
    ("2025 Annual Report", 2025, "2026-01-31", 4),
    ("Q3 2025 Report", 2025, "2025-10-01", 5),
    ("Q2 2025 Report", 2025, "2025-07-01", 6),
    ("Q1 2025 Report", 2025, "2025-04-07", 7),
]

OLD_TITLES = [
    "Q4 2026 Report",
    "Q3 2026 Report",
    "Q2 2026 Report",
    "Q1 2026 Report",
    "2025 Annual Report",
    "2024 Annual Report",
]


def seed_reports(apps, schema_editor):
    Report = apps.get_model("site_content", "Report")
    for title, year, published_at, order in REPORTS:
        Report.objects.update_or_create(
            title=title,
            defaults={
                "year": year,
                "published_at": published_at,
                "order": order,
                "is_published": True,
            },
        )
    Report.objects.filter(title__in=OLD_TITLES).exclude(
        title__in=[title for title, _, _, _ in REPORTS]
    ).delete()


def unseed_reports(apps, schema_editor):
    Report = apps.get_model("site_content", "Report")
    Report.objects.filter(title__in=[title for title, _, _, _ in REPORTS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("site_content", "0020_report_cover_report_year"),
    ]

    operations = [
        migrations.RunPython(seed_reports, unseed_reports),
    ]
