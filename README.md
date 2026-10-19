# Zone01

- `frontend/` — React (Vite) website
- `Zone01web/backend/` — Django CMS backend and JSON API

The production shape is **one service**: Django serves the React SPA, the JSON
API, the admin and static assets. The root `Dockerfile` builds both; the root
`docker-compose.yml` runs the whole app plus PostgreSQL.

## Quick start

### Option 1 — Docker (includes PostgreSQL)

```bash
make docker-up
```

Open **http://localhost:8000**. Stop with `make docker-down`.

### Option 2 — One local Django server

Requires PostgreSQL running and `DATABASE_URL` set in
`Zone01web/backend/.env`.

```bash
make install     # first time only
make serve
```

Open **http://localhost:8000**.

### Option 3 — Hot reload while editing React

```bash
make install     # first time only
make dev
```

Open **http://localhost:5173**. Django also runs on `:8000`.

The admin is at **/admin/**. Run `make help` for all targets. See the
[development guide](docs/DEVELOPMENT_GUIDE.md) for setup, testing and
deployment details.
