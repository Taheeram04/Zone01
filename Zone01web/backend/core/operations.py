"""Reusable migration operations for PostgreSQL-only features.

The search indexes rely on the ``pg_trgm`` extension, which only exists on
PostgreSQL. Wrapping the DDL keeps ``migrate`` and ``manage.py test`` working
when ``DATABASE_URL`` points at SQLite, instead of failing on unknown syntax.
"""

from django.db import migrations


class PostgresOnlySQL(migrations.RunSQL):
    """A :class:`~django.db.migrations.RunSQL` that no-ops off PostgreSQL.

    PostgreSQL gets the real statement; every other backend executes a harmless
    no-op, so the migration records the same state on all of them.
    """

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        if schema_editor.connection.vendor == "postgresql":
            super().database_forwards(app_label, schema_editor, from_state, to_state)

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        if schema_editor.connection.vendor == "postgresql":
            super().database_backwards(app_label, schema_editor, from_state, to_state)


def enable_trigram() -> PostgresOnlySQL:
    """Ensure ``pg_trgm`` is installed before the search indexes are created.

    ``IF NOT EXISTS`` keeps the operation idempotent, and the reverse is a no-op
    because dropping the extension would fail while any index still depends on it.

    Requires the database user to be allowed to create extensions; on managed
    providers this is normally the case for the owning role, otherwise run
    ``CREATE EXTENSION pg_trgm`` once as an administrator.
    """
    return PostgresOnlySQL(
        "CREATE EXTENSION IF NOT EXISTS pg_trgm",
        reverse_sql=migrations.RunSQL.noop,
    )
