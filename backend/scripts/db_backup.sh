#!/usr/bin/env bash
#
# Logical backup of the Zone01 database in PostgreSQL custom format.
#
# Usage:
#   scripts/db_backup.sh [output-file]
#
# The connection is taken from $DATABASE_URL, falling back to the backend
# .env file, then to the local development default. The dump is written to
# backups/ (git-ignored) unless a path is given.
set -euo pipefail

command -v pg_dump >/dev/null 2>&1 || {
  echo "pg_dump not found. Install the PostgreSQL client tools." >&2
  exit 1
}

backend_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Resolve DATABASE_URL: environment > .env > local default.
if [[ -z "${DATABASE_URL:-}" && -f "$backend_dir/.env" ]]; then
  DATABASE_URL="$(grep -E '^[[:space:]]*DATABASE_URL=' "$backend_dir/.env" | tail -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
DATABASE_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/zone01}"

out="${1:-$backend_dir/backups/zone01-$(date +%F-%H%M%S).dump}"
mkdir -p "$(dirname "$out")"

echo "Backing up $DATABASE_URL"
echo "  -> $out"
pg_dump "$DATABASE_URL" --format=custom --no-owner --file="$out"
echo "Backup complete ($(du -h "$out" | cut -f1))."
