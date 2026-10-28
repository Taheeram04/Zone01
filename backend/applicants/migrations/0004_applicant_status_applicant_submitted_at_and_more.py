from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("applicants", "0003_remove_applicant_applicants__status_b4e2c4_idx_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="applicant",
            name="status",
            field=models.CharField(
                choices=[
                    ("submitted", "Submitted"),
                    ("reviewing", "Reviewing"),
                    ("accepted", "Accepted"),
                    ("rejected", "Rejected"),
                ],
                default="submitted",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="applicant",
            name="submitted_at",
            field=models.DateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="applicant",
            name="id",
            field=models.BigAutoField(
                auto_created=True,
                primary_key=True,
                serialize=False,
                verbose_name="ID",
            ),
        ),
    ]
