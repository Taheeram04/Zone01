"""Starter content for the Hire Talent page.

The four "what we offer" cards were hard-coded in the 01talentke_website
Services page, so they are seeded here to keep the page complete out of the box.
Editors can add, edit, reorder or delete every entry in the Django admin.
Technologies are intentionally not seeded: they are content managed in the
admin, exactly like the original ``services`` app.
"""

from django.db import migrations

SERVICES = [
    {
        "slug": "software-development-as-a-service",
        "name": "Software Development as a Service",
        "title": "Software Development as a Service",
        "category": "what_we_offer",
        "order": 1,
        "description": (
            "We build customised software solutions for global clients. Our "
            "milestone-based payment model ensures we only proceed to the next "
            "phase when you are happy with the solution. Join the growing "
            "number of satisfied global clients."
        ),
    },
    {
        "slug": "staff-augmentation",
        "name": "Staff Augmentation",
        "title": "Staff Augmentation",
        "category": "what_we_offer",
        "order": 2,
        "description": (
            "Need more talent? Easily scale up teams with pre-vetted local "
            "developers. Need specialised talent for a specific gap? Pick and "
            "choose from a diverse range of AI-ready talent proficient in Full "
            "Stack, Front End, Back End, DevOps, UI/UX and Business Analysis."
        ),
    },
    {
        "slug": "developers-on-demand",
        "name": "Developers on Demand",
        "title": "Developers on Demand",
        "category": "what_we_offer",
        "order": 3,
        "description": (
            "Full-time, part-time or project-based work — we provide immediate "
            "access to proficient developers for flexible hiring in fintech, "
            "AI, blockchain and cybersecurity."
        ),
    },
    {
        "slug": "project-management",
        "name": "Project Management",
        "title": "Project Management",
        "category": "what_we_offer",
        "order": 4,
        "description": (
            "Our Agile-certified project managers have led delivery of multiple "
            "projects and ensured quality control of complex tasks through "
            "end-to-end oversight and reporting. Dedicated teams ensure "
            "continuity with KPI-driven performance from start to finish."
        ),
    },
]


def seed_services(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.bulk_create(
        [
            Service(
                slug=item["slug"],
                name=item["name"],
                title=item["title"],
                category=item["category"],
                order=item["order"],
                description=item["description"],
            )
            for item in SERVICES
        ],
        ignore_conflicts=True,
    )


def remove_services(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug__in=[item["slug"] for item in SERVICES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_services, remove_services),
    ]
