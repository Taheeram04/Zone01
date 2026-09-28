# Generated for the restructured Zone01 content app.

import django.db.models.deletion
import django.utils.timezone
import filer.fields.image
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.FILER_IMAGE_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Partner",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("name", models.CharField(max_length=150)),
                ("information", models.TextField(blank=True)),
                (
                    "logo",
                    filer.fields.image.FilerImageField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="partner_logos",
                        to=settings.FILER_IMAGE_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "partner",
                "verbose_name_plural": "partners",
                "ordering": ["order", "id"],
            },
        ),
        migrations.CreateModel(
            name="StaffMember",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("name", models.CharField(max_length=150)),
                ("role", models.CharField(max_length=150)),
                ("bio", models.TextField(blank=True)),
                (
                    "photo",
                    filer.fields.image.FilerImageField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="staff_photos",
                        to=settings.FILER_IMAGE_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "staff member",
                "verbose_name_plural": "staff",
                "ordering": ["order", "id"],
            },
        ),
        migrations.CreateModel(
            name="NewsUpdate",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("title", models.CharField(max_length=200)),
                ("information", models.TextField(blank=True)),
                ("is_published", models.BooleanField(default=True)),
                ("published_at", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "image",
                    filer.fields.image.FilerImageField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="news_images",
                        to=settings.FILER_IMAGE_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "news update",
                "verbose_name_plural": "news",
                "ordering": ["-published_at", "order", "id"],
            },
        ),
        migrations.CreateModel(
            name="ImpactUpdate",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("title", models.CharField(max_length=200)),
                ("information", models.TextField(blank=True)),
                ("is_published", models.BooleanField(default=True)),
                (
                    "image",
                    filer.fields.image.FilerImageField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="impact_images",
                        to=settings.FILER_IMAGE_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "impact update",
                "verbose_name_plural": "impact",
                "ordering": ["order", "id"],
            },
        ),
        migrations.CreateModel(
            name="PiscineRegistration",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_active", models.BooleanField(default=False)),
                ("next_piscine_date", models.DateField(blank=True, null=True)),
                ("message", models.CharField(blank=True, max_length=255)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "next piscine registration",
                "verbose_name_plural": "next piscine registration",
            },
        ),
    ]
