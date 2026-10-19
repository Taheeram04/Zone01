# Zone01

- `frontend/` — React (Vite) website
- `Zone01web/backend/` — Django CMS backend and JSON API

The production shape is **one service**: Django serves the React SPA, the JSON
API, the admin and static assets. The root `Dockerfile` builds both; the root
`docker-compose.yml` runs the whole app plus PostgreSQL.

## Quick start

```bash
make install             # backend + frontend dependencies
make docker-up           # whole app on http://localhost:8000
```

Or without Docker (use an existing PostgreSQL and `Zone01web/backend/.env`):

```bash
make install
make serve               # builds the SPA and runs Django on :8000
```

For hot reload during frontend work:

```bash
make dev                 # Django :8000 + Vite :5173
```

Run `make help` for all targets. See the
[development guide](docs/DEVELOPMENT_GUIDE.md) for setup, testing and
deployment details.
