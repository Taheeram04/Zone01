# Zone01 CMS

Server-rendered website for Zone01 built on **Django** and **django CMS 5 (LTS)**,
with **PostgreSQL** as the database. Editors manage pages, menus, and content
from the CMS toolbar and the Django admin; no separate frontend build is needed.

## Requirements

- Python 3.12+
- PostgreSQL 14+
- Docker (optional, for the bundled Postgres)

## Quick start

```bash
cp .env.example .env          # adjust values as needed
docker compose up -d postgres # start PostgreSQL on :5432
make install                  # create .venv and install dependencies
make migrate                  # create the CMS schema
make superuser                # create your CMS admin login
make run                      # start the site on http://localhost:8000
```

Then:

- Site: http://localhost:8000/
- Admin: http://localhost:8000/admin/
- Health: http://localhost:8000/healthz

Log in at `/admin/`, create a page, and publish it. The CMS toolbar appears on
the frontend when you are logged in, so you can edit content in place.

## Configuration

Configuration is read from the environment and may be seeded from `.env`.

| Variable               | Default                                              | Description                             |
| ---------------------- | ---------------------------------------------------- | --------------------------------------- |
| `DJANGO_SECRET_KEY`    | dev placeholder                                      | Django secret key                       |
| `DJANGO_DEBUG`         | `false`                                              | Enable debug mode                       |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1`                                | Comma-separated allowed hosts           |
| `DATABASE_URL`         | `postgres://postgres:postgres@localhost:5432/zone01` | PostgreSQL connection URL               |
| `DB_CONN_MAX_AGE`      | `60`                                                 | Seconds to persist DB connections       |
| `APP_VERSION`          | `dev`                                                | Version reported by the health endpoint |

After the first deploy, set the site domain in **Admin → Sites** to match your
hostname (the default is `example.com`).

## How the CMS is wired

- **Templates** live in `templates/`. `base.html` extends django CMS's Bootstrap 5
  base and defines the `"Page Content"` placeholder. Templates are selectable per
  page via `CMS_TEMPLATES` in `config/settings.py`.
- **Pages** are created in the admin and can be arranged into a menu tree.
- **Plugins** (text, image, card, grid, accordion, etc.) are provided by
  `djangocms-text` and `djangocms-frontend` and are added to placeholders in the
  toolbar.
- **Media** uploads are managed by `django-filer` and served from `media/`.
- **Versioning** is provided by `djangocms-versioning`, so drafts and published
  versions are tracked separately.
- **Admin header** is customised in `templates/admin/base_site.html` (brand,
  logo, and quick links to Pages, Media, Users) and styled by
  `static/admin/css/zone01_admin.css`.

To add a placeholder, edit `templates/base.html` and use:

```django
{% load cms_tags %}
{% placeholder "Section Name" %}
```

## Project layout

```
backend/
├── manage.py
├── config/               # settings, URLs, WSGI/ASGI
├── core/                 # health endpoint
├── templates/            # CMS page templates (base.html, ...)
├── static/               # project static assets
├── requirements.txt
└── requirements-dev.txt
```

## Database

PostgreSQL is the database for every environment. Locally it is provided by the
bundled `docker-compose.yml`; CI starts a `postgres:16` service.

```bash
docker compose up -d postgres          # start PostgreSQL
make migrate                           # apply migrations
make check                             # system + migration drift checks
make makemigrations                    # create migrations after model changes
```

## Make targets

```bash
make help        # list targets
make install     # create venv and install dev dependencies
make migrate     # apply migrations
make run         # run the dev server
make test        # run the test suite
make lint        # ruff check
make fmt         # ruff format
make check       # Django system + migration drift checks
make superuser   # create a CMS admin user
make static      # collect static files
```

## CI

`.github/workflows/backend-ci.yml` runs ruff lint/format checks, Django system
and migration checks, and the test suite against a `postgres:16` service for
changes under `Zone01web/backend`.
