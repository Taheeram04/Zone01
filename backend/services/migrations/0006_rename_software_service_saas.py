"""Append "(SAAs)" to the Software Development as a Service offering.

The catalogue keeps a single software development service; only its display
name changes so the Hire Talent tab reads "Software Development as a Service
(SAAs)".
"""

from django.db import migrations

SLUG = "software-development-as-a-service"
OLD_NAME = "Software Development as a Service"
NEW_NAME = "Software Development as a Service (SAAs)"


def rename_service(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug=SLUG).update(name=NEW_NAME, title=NEW_NAME)


def rename_service_back(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug=SLUG).update(name=OLD_NAME, title=OLD_NAME)


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0005_remove_saas_service"),
    ]

    operations = [
        migrations.RunPython(rename_service, rename_service_back),
    ]
