from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "core"

    def ready(self):
        # Makes the admin's `icontains` search index-accelerable on PostgreSQL;
        # see core.lookups for why the default rendering cannot use pg_trgm.
        from core.lookups import register

        register()
