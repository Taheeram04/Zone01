#!/usr/bin/env bash
#
# Restore a logical backup produced by scripts/db_backup.sh.
#
# Usage:
#   scripts/db_restore.sh <dump-file>
#
# The target connection is taken from $DATABASE_URL, falling back to the
# backend .env file, then to the local development default. Existing objects
# are dropped first (--clean --if-exists), so point DATABASE_URL at the
# database you intend to overwrite.
set -euo pipefail

command -v pg_restore >/dev/null 2>&1 || {
  echo "pg_restore not found. Install the PostgreSQL client tools." >&2
  exit 1
}

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <dump-file>" >&2
  exit 2
fi

dump="$1"
[[ -f "$dump" ]] || {
  echo "dump not found: $dump" >&2
  exit 1
}

backend_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Resolve DATABASE_URL: environment > .env > local default.
if [[ -z "${DATABASE_URL:-}" && -f "$backend_dir/.env" ]]; then
  DATABASE_URL="$(grep -E '^[[:space:]]*DATABASE_URL=' "$backend_dir/.env" | tail -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
DATABASE_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/zone01}"

echo "Restoring $dump"
echo "  -> $DATABASE_URL"
pg_restore --dbname="$DATABASE_URL" --clean --if-exists --no-owner "$dump"
echo "Restore complete."
