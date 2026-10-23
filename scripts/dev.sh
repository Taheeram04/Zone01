#!/usr/bin/env bash
# Run Django and Vite together for hot-reload development.
#
# The production/one-server path is `make serve` (or `docker compose up`),
# where Django serves the built SPA itself. This script is only for editing the
# React app with HMR.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backend="$root/Zone01web/backend"
frontend="$root/frontend"

if [[ ! -x "$backend/.venv/bin/python" ]]; then
  echo "Backend virtualenv not found. Run 'make install' first." >&2
  exit 1
fi

if [[ ! -d "$frontend/node_modules" ]]; then
  echo "Frontend dependencies not installed. Run 'make install' first." >&2
  exit 1
fi

# Keep the local database schema in sync before starting either server.
(cd "$backend" && .venv/bin/python manage.py migrate --noinput)

pids=()

cleanup() {
  trap - EXIT INT TERM
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(cd "$backend" && exec .venv/bin/python manage.py runserver 127.0.0.1:8000) &
pids+=("$!")

(cd "$frontend" && exec npm run dev -- --host 127.0.0.1) &
pids+=("$!")

# Exit (and clean up the other process) as soon as either server stops.
wait -n "${pids[@]}"
