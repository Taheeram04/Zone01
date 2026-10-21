# Generated for the Hire Talent service catalogue.

import uuid

import services.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Service",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "title",
                    models.CharField(default="Untitled", max_length=255),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "slug",
                    models.SlugField(
                        blank=True,
                        help_text=(
                            "URL-friendly identifier. Generated from the name "
                            "when left blank."
                        ),
                        max_length=255,
                        unique=True,
                    ),
                ),
                ("description", models.TextField()),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("what_we_offer", "What We Offer"),
                            ("technical_expertise", "Technical Expertise"),
                            ("language", "Language"),
                            ("framework", "Framework"),
                            ("specialization", "Specialization"),
                        ],
                        default="what_we_offer",
                        help_text="Category of the service",
                        max_length=50,
                    ),
                ),
                (
                    "image",
                    models.FileField(
                        blank=True,
                        help_text="Icon shown next to the service (SVG preferred).",
                        null=True,
                        upload_to="services/",
                        validators=[services.models.validate_icon],
                    ),
                ),
                (
                    "order",
                    models.PositiveIntegerField(
                        default=0,
                        help_text=(
                            "Lower numbers are shown first within a category."
                        ),
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "service",
                "verbose_name_plural": "services",
                "db_table": "services",
                "ordering": ["category", "order", "name"],
            },
        ),
    ]
