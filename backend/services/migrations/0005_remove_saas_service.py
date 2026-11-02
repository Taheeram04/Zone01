"""Remove the duplicate "(SAAs)" software development offering.

The catalogue keeps the original "Software Development as a Service" entry
only, and the remaining services are renumbered so the tabs stay in a clean
1-4 order.
"""

from django.db import migrations

SAAS_SLUG = "software-development-as-a-service-saas"

REMAINING_SERVICES = [
    ("software-development-as-a-service", 1),
    ("staff-augmentation", 2),
    ("developers-on-demand", 3),
    ("project-management", 4),
]

SAAS_SERVICE = {
    "slug": SAAS_SLUG,
    "name": "Software Development as a Service (SAAs)",
    "title": "Software Development as a Service (SAAs)",
    "category": "what_we_offer",
    "order": 2,
    "description": (
        "End-to-end software development delivered as a recurring service, "
        "from discovery and design to build, release and ongoing support."
    ),
}

RESTORED_ORDERS = [
    ("staff-augmentation", 3),
    ("developers-on-demand", 4),
    ("project-management", 5),
]


def remove_saas_service(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug=SAAS_SLUG).delete()
    for slug, order in REMAINING_SERVICES:
        Service.objects.filter(slug=slug).update(order=order)


def restore_saas_service(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.get_or_create(slug=SAAS_SLUG, defaults=SAAS_SERVICE)
    for slug, order in RESTORED_ORDERS:
        Service.objects.filter(slug=slug).update(order=order)


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0004_seed_saas_service"),
    ]

    operations = [
        migrations.RunPython(remove_saas_service, restore_saas_service),
    ]
