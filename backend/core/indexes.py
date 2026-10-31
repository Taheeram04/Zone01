"""Index types for the PostgreSQL-backed admin search.

Django ships :class:`~django.contrib.postgres.indexes.GinIndex`, but nothing that
combines GIN with the ``pg_trgm`` operator class. That combination is the index
that makes the admin's ``ILIKE '%term%'`` predicates resolve as index lookups
instead of sequential scans, so :class:`GinTrigramIndex` fills the gap and lets
models declare the index in ``Meta.indexes``.

Note that Django's ``search_fields`` ORs the search terms across every declared
field, which PostgreSQL can only satisfy from an index scan when *each* column
participates. Multi-column GIN indexes are therefore deliberately avoided here:
a query on one column of a multi-column GIN index cannot use it. Declare one
index per searched column instead, and keep ``search_fields`` and these indexes
in sync.

Because the index is declared in ``Meta.indexes``, the migration state matches
the model state and ``makemigrations --check`` stays clean.
"""

from django.contrib.postgres.indexes import GinIndex
from django.db.backends.ddl_references import Statement

#: Operator class that makes a GIN index usable for ``LIKE``/``ILIKE``.
TRIGRAM_OPCLASS = "gin_trgm_ops"


def _no_op_statement() -> Statement:
    """A harmless statement, for backends without ``pg_trgm``."""
    return Statement("SELECT 1")


class GinTrigramIndex(GinIndex):
    """A GIN index using the ``pg_trgm`` operator class.

    Renders as ``CREATE INDEX ... ON ... USING gin (col gin_trgm_ops)`` on
    PostgreSQL, and as a no-op elsewhere so that ``migrate`` and the test suite
    keep working against SQLite (where the admin search simply falls back to
    unindexed ``ILIKE`` scans).
    """

    def __init__(self, *expressions, fields=(), name=None, opclasses=(), **kwargs):
        if not opclasses:
            opclasses = [TRIGRAM_OPCLASS] * (len(expressions) or len(fields))
        super().__init__(
            *expressions,
            fields=fields,
            name=name,
            opclasses=opclasses,
            **kwargs,
        )

    def create_sql(self, model, schema_editor, **kwargs):
        if schema_editor.connection.vendor != "postgresql":
            return _no_op_statement()
        return super().create_sql(model, schema_editor, **kwargs)

    def remove_sql(self, model, schema_editor, **kwargs):
        if schema_editor.connection.vendor != "postgresql":
            return _no_op_statement()
        return super().remove_sql(model, schema_editor, **kwargs)
