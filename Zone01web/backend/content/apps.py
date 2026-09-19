from django.apps import AppConfig


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "content"
    label = "site_content"
    verbose_name = "Content"
