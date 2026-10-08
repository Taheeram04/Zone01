# Zone01 — Developer Guide (Frontend + Backend)

A complete, step-by-step guide to setting up, running, testing and deploying the
Zone01 platform.

The project is **two applications**:

| Part | Tech | Location | Runs on |
| ---- | ---- | -------- | ------- |
| **Backend** | Django 5 + django CMS 5 + PostgreSQL | `Zone01web/backend/` | `:8000` |
| **Frontend** | React 19 + Vite 8 + Tailwind 4 | `frontend/` | `:5173` |

---

## Table of contents

1. [Architecture](#1-architecture)
2. [Repository layout](#2-repository-layout)
3. [Prerequisites](#3-prerequisites)
4. [Part A — Backend setup](#part-a--backend-setup)
5. [Part B — Frontend setup](#part-b--frontend-setup)
6. [Part C — Run both together](#part-c--run-both-together)
7. [Part D — Day-to-day development](#part-d--day-to-day-development)
8. [Part E — Testing, linting and CI](#part-e--testing-linting-and-ci)
9. [Part F — Deployment (Fly.io)](#part-f--deployment-flyio)
10. [Part G — Troubleshooting](#part-g--troubleshooting)
11. [Appendix A — Environment variables](#appendix-a--environment-variables)
12. [Appendix B — API reference](#appendix-b--api-reference)
13. [Appendix C — Admin reference](#appendix-c--admin-reference)

---

## 1. Architecture

The React frontend is a **separate single-page application (SPA)**. It renders
the public website and reads its content from a **read-only JSON API** exposed by
the Django backend. Editors change that content in the Django admin; the
frontend picks it up on its next request.

```
┌─────────────────────────────┐        GET /api/...        ┌──────────────────────────────┐
│  React SPA (Vite build)     │ ─────────────────────────▶ │  Django + django CMS         │
│  http://localhost:5173      │ ◀───────────────────────── │  http://localhost:8000       │
│  Client-side routing        │          JSON              │  /api/  read-only JSON API   │
└─────────────────────────────┘                            │  /admin/  content editing    │
                                                           │  /healthz  liveness          │
                                                           └───────────────┬──────────────┘
                                                                           │
                                                                   ┌───────▼────────┐
                                                                   │  PostgreSQL    │
                                                                   └────────────────┘
```

**Key idea:** the backend has two faces.

- **JSON API (`/api/`)** — consumed by the React frontend.
- **django CMS + admin (`/admin/`)** — consumed by editors through the browser.

> In development the React dev server **proxies** `/api` to the Django server
> (see `frontend/vite.config.js`), so the browser always talks same-origin and no
> CORS setup is needed locally.

---

## 2. Repository layout

```
Zone01/
├── README.md
├── docs/
│   └── DEVELOPMENT_GUIDE.md        # this file
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── main.jsx                 # React entry (BrowserRouter)
│   │   ├── App.jsx                  # Route table
│   │   ├── components/              # Page sections & UI
│   │   ├── pages/                   # Standalone pages (e.g. Register)
│   │   ├── assets/                  # Images
│   │   ├── constants.js             # Shared constants
│   │   ├── index.css / App.css
│   ├── index.html
│   ├── vite.config.js               # Dev proxy for /api
│   ├── .env.example
│   └── package.json
└── Zone01web/
    └── backend/                     # Django project
        ├── manage.py
        ├── config/                  # settings.py, urls.py, wsgi/asgi
        ├── core/                    # health check + admin frontend-status board
        ├── content/                 # site content models + JSON API
        ├── applicants/              # applicant intake & review
        ├── events/                  # events & registrations
        ├── templates/               # CMS page templates + admin overrides
        ├── static/
        ├── docker-compose.yml       # local PostgreSQL
        ├── Dockerfile               # production image (gunicorn)
        ├── Makefile                 # dev shortcuts
        ├── requirements.txt / -dev.txt
        ├── .env.example
        └── README.md
```

---

## 3. Prerequisites

Install these once:

| Tool | Version | Check | Used by |
| ---- | ------- | ----- | ------- |
| **Python** | 3.12+ | `python3 --version` | Backend |
| **PostgreSQL** | 14+ (16 recommended) | `psql --version` | Backend (via Docker optionally) |
| **Docker** | recent | `docker --version` | Local Postgres |
| **Node.js** | 22 LTS (20.19+ min) | `node --version` | Frontend |
| **npm** | 10+ | `npm --version` | Frontend |
| **Git** | any recent | `git --version` | Both |

> You do **not** need Docker if you already run PostgreSQL locally. The bundled
> `docker-compose.yml` just provides a throwaway database.

---

## Part A — Backend setup

All backend commands run from `Zone01web/backend/`.

### A.1 Create the virtual environment

```bash
cd Zone01web/backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
```

> The `Makefile` auto-creates the venv for you, so you can also skip this and run
> `make install` in the next step.

### A.2 Install dependencies

Using the Makefile (recommended — creates the venv and installs dev tools):

```bash
make install
```

Or manually:

```bash
pip install --upgrade pip
pip install -r requirements-dev.txt   # includes requirements.txt + ruff
```

### A.3 Configure the environment

```bash
cp .env.example .env
```

Open `.env` and set at least:

```bash
DJANGO_SECRET_KEY=change-me-in-production
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://postgres:postgres@localhost:5432/zone01
```

See [Appendix A](#appendix-a--environment-variables) for every variable.

### A.4 Start PostgreSQL

With Docker (recommended):

```bash
docker compose up -d postgres
```

Check it is healthy:

```bash
docker compose ps
```

If you use your own PostgreSQL instead, create a database named `zone01` and
make sure `DATABASE_URL` matches.

### A.5 Apply migrations

```bash
make migrate
# or: python manage.py migrate
```

This creates every table and seeds the default content (site links, etc.).

### A.6 Create an admin user

```bash
make superuser
# or: python manage.py createsuperuser
```

Choose a username, email and password — you will log in with these at `/admin/`.

### A.7 Run the development server

```bash
make run
# or: python manage.py runserver
```

The backend is now available at **http://localhost:8000/**.

### A.8 Verify the backend

| What | URL | Expected |
| ---- | --- | -------- |
| Health check | http://localhost:8000/healthz | `{"status": "ok", "database": "ok", ...}` |
| Admin login | http://localhost:8000/admin/ | Login page |
| Content API | http://localhost:8000/api/content/ | JSON with `partners`, `staff`, `news`, `impact`, `links`, `piscine` |
| Frontend status board | http://localhost:8000/admin/frontend-status/ | UP/DOWN per page (staff only) |

Quick smoke test:

```bash
curl http://localhost:8000/healthz
curl http://localhost:8000/api/content/
```

### A.9 Backend apps at a glance

| App | Responsibility |
| --- | -------------- |
| `core` | `/healthz`; admin "Frontend status" board (`FrontendPage` model, `frontend_status` view) |
| `content` | Public site content: partners, staff, news, impact, site links, next-piscine; the `/api/` endpoints |
| `applicants` | Applicant intake and review workflow (`Applicant` model) |
| `events` | Events and registrations (`Event`, `EventRegistration`) |

**Models you will edit most often** (`content/models.py`): `Partner`,
`StaffMember`, `NewsUpdate`, `ImpactUpdate`, `SiteLink`, `PiscineRegistration`,
and the `FrontendPage` monitor list (`core/models.py`).

### A.10 Useful backend commands

```bash
python manage.py shell            # interactive Python shell
python manage.py dbshell          # interactive psql
python manage.py showmigrations   # migration status
python manage.py makemigrations   # create migrations after model changes
python manage.py migrate          # apply migrations
python manage.py collectstatic    # gather static files
```

---

## Part B — Frontend setup

All frontend commands run from `frontend/`.

### B.1 Install Node.js and npm

Install Node 22 LTS (or ≥ 20.19) from https://nodejs.org/ or with a version
manager (`nvm`, `fnm`). Verify:

```bash
node --version
npm --version
```

### B.2 Install dependencies

```bash
cd frontend
npm install
```

### B.3 Configure the environment

```bash
cp .env.example .env
```

For local development you can leave `VITE_API_BASE_URL` **empty** — the Vite dev
server proxies `/api` to the backend automatically. See
[Part C](#part-c--run-both-together).

### B.4 Run the dev server

```bash
npm run dev
```

Open **http://localhost:5173/**.

### B.5 Build and preview production

```bash
npm run build     # outputs static files to frontend/dist/
npm run preview   # serves the built bundle locally (also proxies /api)
```

### B.6 Frontend scripts

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `npm run dev` | Vite dev server | Hot-reloading development |
| `npm run build` | Vite build | Production bundle → `dist/` |
| `npm run preview` | Vite preview | Serve the built bundle |
| `npm run lint` | ESLint | Lint `src/` |

### B.7 Project structure

- `src/main.jsx` — mounts React and wraps the app in `BrowserRouter`.
- `src/App.jsx` — the route table (see [B.8](#b8-routes)).
- `src/components/` — reusable sections and UI (`navbar.jsx`, `hero.jsx`,
  `footer.jsx`, `layout.jsx`, …).
- `src/pages/` — standalone pages (e.g. `Register.jsx`).
- `src/constants.js` — shared values such as `APPLICATION_URL`.
- `vite.config.js` — plugins (React, Tailwind) and the `/api` proxy.

### B.8 Routes

Defined in `src/App.jsx`:

| Path | Page |
| ---- | ---- |
| `/` | Home (Hero + Stats + Who can apply + Who is it for + Why our campus) |
| `/about` | About Us (hero, know us, our model, how to apply, careers) |
| `/community` | Community (partners + staff carousel) |
| `/register` | Standalone registration page |
| `/impact`, `/hire`, `*` | "Coming soon" placeholder |

**To add a new page:**

1. Create `src/components/MyPage.jsx` (or `src/pages/MyPage.jsx`).
2. Import it in `src/App.jsx`.
3. Add a `<Route path="/my-page" element={...} />`.

Client-side routing means the **web server must fall back to `index.html`** for
unknown paths (the production nginx config does this with
`try_files $uri $uri/ /index.html;`).

### B.9 Talking to the API

The frontend reads the backend with `fetch`. The base URL comes from the
`VITE_API_BASE_URL` build-time variable:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const res = await fetch(`${API_BASE}/api/piscine/`);
const data = await res.json();
```

- **Local dev:** `VITE_API_BASE_URL` is empty; `/api` is proxied to
  `http://127.0.0.1:8000` by `vite.config.js`.
- **Production:** either set `VITE_API_BASE_URL` to the backend origin, or serve
  the frontend from the same origin as the backend and leave it empty.

> `VITE_` variables are baked into the bundle at **build time**. Changing them
> requires a rebuild.

---

## Part C — Run both together

You need **three** things running: the database, the backend, and the frontend.

### Terminal 1 — Database

```bash
cd Zone01web/backend
docker compose up -d postgres
```

### Terminal 2 — Backend

```bash
cd Zone01web/backend
source .venv/bin/activate
make run                 # http://localhost:8000
```

### Terminal 3 — Frontend

```bash
cd frontend
npm run dev              # http://localhost:5173
```

Now open **http://localhost:5173/**. The SPA calls `/api/...`, Vite proxies it
to Django, and Django answers from PostgreSQL. Edit content at
**http://localhost:8000/admin/** and refresh the frontend to see it.

> **CORS note:** the defaults already allow `http://localhost:5173`. If you
> change the frontend port, add its origin to `API_CORS_ALLOWED_ORIGINS` in the
> backend `.env` and restart Django.

---

## Part D — Day-to-day development

### D.1 Change model fields (backend)

1. Edit the model, e.g. `content/models.py`.
2. Create a migration:
   ```bash
   cd Zone01web/backend
   make makemigrations
   ```
3. Apply it:
   ```bash
   make migrate
   ```
4. If the field is admin-editable, add it to the relevant `ModelAdmin` in
   `content/admin.py` (e.g. `list_display`, `fields`).
5. Expose it through the API if the frontend needs it — edit the matching
   `serialize_*()` in `content/api.py`.

### D.2 Add a new API endpoint

1. Add a `serialize_<thing>()` function and a `@require_GET` view in
   `content/api.py`.
2. Register the route in `content/urls.py`:
   ```python
   path("mything/", api.mything_list, name="mything-list"),
   ```
3. If it belongs in the combined payload, add it to `content_index()`.
4. Consume it in the frontend with `fetch(`${API_BASE}/api/mything/`)`.

### D.3 Manage site content (no code)

Everything editors need is in the Django admin at `/admin/`:

| Admin section | What it controls |
| ------------- | ---------------- |
| **Partners** | Partner logos and blurbs |
| **Staff** | Team members, roles, photos |
| **News** | News posts (publish toggle) |
| **Impact** | Impact stories + optional PDF report |
| **Site links** | Header navigation links |
| **Next piscine registration** | Singleton countdown banner |
| **Frontend pages** | Pages the "Frontend status" board links to and checks |
| **Applicants** | Applicant intake and review |
| **Events / Registrations** | Events and sign-ups |

See [Appendix C](#appendix-c--admin-reference) for field-level detail.

### D.4 Monitor the hosted frontend

Set `FRONTEND_URL` in the backend environment, then open
**Admin → Frontend status** (`/admin/frontend-status/`). The board checks the
frontend root plus every active **Frontend pages** row and reports UP/DOWN,
HTTP status and latency. Add or remove paths from the **Frontend pages** admin.

### D.5 Code style (backend)

The project uses **ruff** (line length 100, double quotes):

```bash
make lint     # check
make fmt       # auto-format
```

Ruff is configured in `Zone01web/backend/pyproject.toml`; migrations are excluded.

### D.6 Code style (frontend)

```bash
cd frontend
npm run lint
```

ESLint config lives in `frontend/eslint.config.js`.

### D.7 Back up and restore the database

The backend `Makefile` wraps `pg_dump`/`pg_restore` for local and staging use:

```bash
cd Zone01web/backend
make db-backup                                    # -> backups/zone01-<timestamp>.dump
make db-restore FILE=backups/zone01-2026-10-07-174432.dump
```

Both read `DATABASE_URL` from the environment, falling back to `.env`.
`db-restore` uses `--clean --if-exists`, so restore into the database you intend
to overwrite — or a throwaway one for a restore drill. Backups are written to
`backups/` (git-ignored). See `Zone01web/backend/README.md` for the hosted
(Fly.io) snapshot procedure.

---

## Part E — Testing, linting and CI

### E.1 Backend

```bash
cd Zone01web/backend
make test      # python manage.py test
make lint      # ruff check .
make check     # django check + migration drift check
```

Useful Make targets:

| Target | Does |
| ------ | ---- |
| `make install` | Create venv + install all deps |
| `make migrate` | Apply migrations |
| `make makemigrations` | Create migrations |
| `make run` | Run the dev server |
| `make test` | Run the test suite |
| `make lint` | `ruff check .` |
| `make fmt` | `ruff format .` |
| `make check` | `manage.py check` + `makemigrations --check` |
| `make superuser` | Create an admin user |
| `make static` | `collectstatic` |
| `make clean` | Remove caches/artifacts |

Tests require PostgreSQL. Run the suite the way CI does:

```bash
python manage.py collectstatic --noinput
python manage.py test
```

### E.2 Frontend

```bash
cd frontend
npm run lint
npm run build        # catches build-time errors
```

### E.3 CI

`.github/workflows/backend-ci.yml` runs, for changes under `Zone01web/backend/`
against a `postgres:16` service:

1. `ruff check .` and `ruff format --check .`
2. `python manage.py check`
3. `python manage.py makemigrations --check --dry-run`
4. `python manage.py collectstatic --noinput`
5. `python manage.py test`

Keep all five green before pushing.

---

## Part F — Deployment (Fly.io)

The backend and frontend deploy as **two Fly apps**, backed by a third app
running unmanaged Fly Postgres. Config files: `Zone01web/backend/fly.toml` and
`frontend/fly.toml`.

| Fly app | Runs | Config |
| ------- | ---- | ------ |
| `zone01-kisumu-api` | Django + gunicorn | `Zone01web/backend/fly.toml` |
| `zone01-kisumu-web` | React bundle via nginx | `frontend/fly.toml` |
| `zone01-kisumu-db` | Unmanaged Postgres | created with `fly postgres create` |

### F.1 One-time setup (summary)

```bash
# Backend app
cd Zone01web/backend
fly launch --no-deploy --copy-config

# Database
fly postgres create --name zone01-kisumu-db --region jnb \
  --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 1
fly postgres attach zone01-kisumu-db --app zone01-kisumu-api

# Media bucket + secrets
fly storage create --public
fly secrets set DJANGO_SECRET_KEY="$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')"

# Deploy backend (migrations run as the release command)
fly deploy
fly ssh console -C "python manage.py createsuperuser"

# Frontend
cd ../../frontend
fly launch --no-deploy --copy-config
fly deploy
```

### F.2 Deploying an update

```bash
# Backend
cd Zone01web/backend && fly deploy

# Frontend
cd frontend && fly deploy
```

### F.3 Post-deploy checklist

- Set the site domain in **Admin → Sites**.
- Set `FRONTEND_URL` on the backend to the public frontend URL, so the
  **Frontend status** board checks the right host.
- Confirm `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` and
  `API_CORS_ALLOWED_ORIGINS` match your domains.
- Hit `/healthz` — it should report `status: ok`.

The full, authoritative deployment walkthrough (media bucket, backups,
snapshots) lives in `Zone01web/backend/README.md`.

---

## Part G — Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| Frontend shows `TypeError: NetworkError` / failed `fetch` | Backend not running, or proxy target wrong | Start Django on `:8000`; check `vite.config.js` proxy |
| CORS error in the browser console | Frontend origin not allowed | Add it to `API_CORS_ALLOWED_ORIGINS`, restart Django |
| `password authentication failed for user "postgres"` | Bad `DATABASE_URL` | Fix credentials in `.env`; or `docker compose up -d postgres` |
| `ModuleNotFoundError` on a new dependency | Deps out of date | `make install` (backend) / `npm install` (frontend) |
| `Missing staticfiles manifest entry` when testing | Tests run with `DEBUG=false` and no `collectstatic` | `python manage.py collectstatic --noinput` then re-run tests |
| `Conflicting migrations detected; multiple leaf nodes` | Two feature branches added migrations | Create a merge migration (`makemigrations --merge`) |
| Migration drift in CI | Model changed without a migration | `make makemigrations` and commit the file |
| Deep links 404 in production (e.g. `/about`) | Web server lacks SPA fallback | Serve with the nginx config that does `try_files ... /index.html` |
| `VITE_` change has no effect | Vite vars are build-time only | Rebuild (`npm run build`) / redeploy |
| Only one row allowed in "Next piscine registration" | It is a singleton by design | Edit the existing row |

---

## Appendix A — Environment variables

### Backend (`Zone01web/backend/.env`)

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `DJANGO_SECRET_KEY` | dev placeholder | Django secret key (**set in production**) |
| `DJANGO_DEBUG` | `false` | Debug mode |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/zone01` | PostgreSQL URL |
| `DB_CONN_MAX_AGE` | `60` | Seconds to persist DB connections |
| `APP_VERSION` | `dev` | Reported by `/healthz` |
| `API_CORS_ALLOWED_ORIGINS` | localhost origins | Frontend origins allowed to call `/api/` |
| `API_CORS_ALLOW_ALL` | `false` | Allow every origin (dev only) |
| `FRONTEND_URL` | `http://localhost:5173` | Public frontend URL checked by the admin board |
| `FRONTEND_HEALTH_TIMEOUT` | `5` | Seconds before a frontend check times out |
| `CSRF_TRUSTED_ORIGINS` | _(empty)_ | Full origins trusted for admin forms (HTTPS) |
| `BUCKET_NAME` / `AWS_*` | _(empty)_ | S3/Tigris bucket for media (production) |

### Frontend (`frontend/.env`)

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `VITE_API_BASE_URL` | _(empty)_ | Backend origin; empty uses the dev proxy / same-origin build |

---

## Appendix B — API reference

Base path `/api/`. All endpoints are **read-only `GET`** and controlled by CORS.

| Endpoint | Returns |
| -------- | ------- |
| `/api/content/` | Everything in one request: `partners`, `staff`, `news`, `impact`, `links`, `piscine` |
| `/api/partners/` | Partner list |
| `/api/staff/` | Staff list |
| `/api/news/` | Published news |
| `/api/impact/` | Published impact stories (includes `report` download URL) |
| `/api/links/` | Active header site links |
| `/api/piscine/` | Next-piscine toggle, date and message |
| `/api/pages/` | Published CMS pages with their sections (where enabled) |
| `/api/pages/<slug>/` | A single page by slug |

Example:

```bash
curl http://localhost:8000/api/content/
```

Non-API operational endpoint:

| Endpoint | Returns |
| -------- | ------- |
| `/healthz` | Liveness/DB status + `APP_VERSION` |

---

## Appendix C — Admin reference

Log in at `/admin/` with a staff account.

| Section | Key fields |
| ------- | ---------- |
| **Partners** | name, logo, information, order |
| **Staff** | name, role, photo, bio, order |
| **News** | title, image, information, publish toggle, order |
| **Impact** | title, image, information, report PDF, publish toggle, order |
| **Site links** | label, url, order, is_active, open_in_new_tab, show_chevron |
| **Next piscine registration** | is_active, next_piscine_date, message (singleton) |
| **Frontend pages** | label, path, is_active, order (monitor list) |
| **Applicants** | name, email, county, education level, status, submitted_at |
| **Events** | title, format, start_at, status, registrations (inline) |

**Frontend status board:** `/admin/frontend-status/` — probes the frontend root
plus each active **Frontend pages** entry and shows UP/DOWN, HTTP code and
latency. Configure the target with `FRONTEND_URL`.

---

*End of guide.*
