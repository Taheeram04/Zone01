"""Add the Software Development as a Service (SAAs) offering.

Kept as a separate migration so the original seed stays historical and existing
databases receive the new service on the next ``migrate``.
"""

from django.db import migrations

SERVICE = {
    "slug": "software-development-as-a-service-saas",
    "name": "Software Development as a Service (SAAs)",
    "title": "Software Development as a Service (SAAs)",
    "category": "what_we_offer",
    "order": 2,
    "description": (
        "End-to-end software development delivered as a recurring service, "
        "from discovery and design to build, release and ongoing support."
    ),
}

# Keep the original offerings in the same visual order, after the new entry.
FOLLOWING_SERVICES = [
    ("staff-augmentation", 3),
    ("developers-on-demand", 4),
    ("project-management", 5),
]


def add_saas_service(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.get_or_create(
        slug=SERVICE["slug"],
        defaults={
            "name": SERVICE["name"],
            "title": SERVICE["title"],
            "category": SERVICE["category"],
            "order": SERVICE["order"],
            "description": SERVICE["description"],
        },
    )
    for slug, order in FOLLOWING_SERVICES:
        Service.objects.filter(slug=slug, order__lt=order).update(order=order)


def remove_saas_service(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug=SERVICE["slug"]).delete()
    for slug, order in FOLLOWING_SERVICES:
        Service.objects.filter(slug=slug).update(order=order - 1)


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0003_seed_skills"),
    ]

    operations = [
        migrations.RunPython(add_saas_service, remove_saas_service),
    ]
