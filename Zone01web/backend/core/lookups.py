"""Lookups that let the admin search actually use the ``pg_trgm`` indexes.

Django renders ``icontains`` on PostgreSQL as
``UPPER(col::text) LIKE UPPER('%term%')`` — see
``DatabaseOperations.lookup_cast()``, which prefers ``UPPER()`` because it is
cheaper than ``ILIKE`` for a b-tree prefix scan. That form is opaque to
``pg_trgm``: its GIN indexes only accelerate ``LIKE``, ``ILIKE`` and regular
expressions applied to the column itself, so a wrapped column could never use
the indexes and every admin search fell back to a sequential scan.

``ILIKE`` matches the same strings here and is served directly by the indexes,
so the search predicates keep the same semantics while becoming index lookups.
Registered for :class:`~django.db.models.Field` in :func:`register`, which runs
from :meth:`core.apps.CoreConfig.ready`.
"""

from django.db.models import Field, lookups


class TrigramIContains(lookups.IContains):
    """``icontains`` rendered as PostgreSQL's ``ILIKE``.

    Anything unusual — another database, a comparison against a column rather
    than a value, a bilateral transform — falls back to Django's own
    implementation, which stays correct but unindexed.
    """

    def as_sql(self, compiler, connection):
        if (
            connection.vendor != "postgresql"
            or not self.rhs_is_direct_value()
            or self.bilateral_transforms
        ):
            return super().as_sql(compiler, connection)
        # Lookup.process_lhs() is called directly to bypass BuiltinLookup's
        # lookup_cast(), which is what wraps the column in UPPER() and makes it
        # invisible to the trigram index.
        lhs_sql, params = lookups.Lookup.process_lhs(self, compiler, connection)
        rhs_sql, rhs_params = self.process_rhs(compiler, connection)
        params.extend(rhs_params)
        # PatternLookup has already wrapped the parameter in %...%.
        return f"{lhs_sql} ILIKE {rhs_sql}", params


def register() -> None:
    """Replace ``icontains`` project-wide; called once from the app registry."""
    Field.register_lookup(TrigramIContains)
