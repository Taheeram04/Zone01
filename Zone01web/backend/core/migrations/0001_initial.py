import datetime
import zoneinfo

from django.db import migrations, models


def seed_piscine_countdown(apps, schema_editor):
    """Seed the homepage countdown with the next piscine date."""
    PiscineCountdown = apps.get_model("core", "PiscineCountdown")
    if not PiscineCountdown.objects.exists():
        PiscineCountdown.objects.create(
            label="Next Piscine",
            starts_at=datetime.datetime(
                2026,
                10,
                12,
                9,
                0,
                tzinfo=zoneinfo.ZoneInfo("Africa/Nairobi"),
            ),
            is_enabled=True,
        )


def unseed_piscine_countdown(apps, schema_editor):
    PiscineCountdown = apps.get_model("core", "PiscineCountdown")
    PiscineCountdown.objects.all().delete()


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PiscineCountdown",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("label", models.CharField(default="Next Piscine", max_length=100)),
                (
                    "starts_at",
                    models.DateTimeField(
                        blank=True,
                        help_text="Local date and time the next piscine begins.",
                        null=True,
                    ),
                ),
                (
                    "is_enabled",
                    models.BooleanField(
                        default=True,
                        help_text="Uncheck to hide the countdown from the homepage.",
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Piscine countdown",
                "verbose_name_plural": "Piscine countdown",
            },
        ),
        migrations.RunPython(seed_piscine_countdown, unseed_piscine_countdown),
    ]
