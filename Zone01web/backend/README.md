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
| `API_CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173`   | Frontend origins allowed to call `/api/` |
| `API_CORS_ALLOW_ALL`   | `false`                                              | Allow every origin to call `/api/`      |
| `CSRF_TRUSTED_ORIGINS` | _(empty)_                                            | Full origins trusted for admin forms, e.g. `https://zone01-kisumu-api.fly.dev` |
| `BUCKET_NAME`          | _(empty)_                                            | S3/Tigris bucket for uploaded media; empty stores media in `media/` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | _(empty)_                     | Bucket credentials (set by `fly storage create`) |
| `AWS_ENDPOINT_URL_S3`  | `https://fly.storage.tigris.dev`                     | S3 endpoint for the bucket              |
| `AWS_S3_CUSTOM_DOMAIN` | `<BUCKET_NAME>.fly.storage.tigris.dev`               | Host used in public media URLs          |

After the first deploy, set the site domain in **Admin → Sites** to match your
hostname (the default is `example.com`).

## Deploying to Fly.io

The backend (`Zone01web/backend/fly.toml`) and the React frontend
(`frontend/fly.toml`) deploy as two Fly apps, backed by a third app running
**unmanaged Fly Postgres** (`fly postgres`, not Managed Postgres / `fly mpg`).
Static files are served by WhiteNoise; uploaded media (filer images,
thumbnails, impact PDFs) is stored in a public Tigris bucket. If you rename
either app, update the hostnames in both `fly.toml` files.

| Fly app             | What it runs                    | Config                       |
| ------------------- | ------------------------------- | ---------------------------- |
| `zone01-kisumu-api` | Django CMS + JSON API           | `Zone01web/backend/fly.toml` |
| `zone01-kisumu-web` | React bundle served by nginx    | `frontend/fly.toml`          |
| `zone01-kisumu-db`  | Unmanaged Postgres (one volume) | created by `fly postgres create` |

### Prerequisites

Install [flyctl](https://fly.io/docs/flyctl/install/) and sign in with
`fly auth login`. All three apps must be in the same Fly organization so the
API can reach the database over the private network.

### 1. Create the backend app

From `Zone01web/backend/`:

```bash
fly launch --no-deploy --copy-config        # creates zone01-kisumu-api from fly.toml
```

### 2. Create the Postgres cluster

```bash
fly postgres create \
  --name zone01-kisumu-db \
  --region jnb \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1
```

Answer **No** if asked to scale to zero; the API cannot start while the
database is asleep. Save the superuser password printed at the end — Fly does
not show it again. Use `--initial-cluster-size 3` for a highly available
cluster (primary plus two replicas).

### 3. Attach it to the backend

```bash
fly postgres attach zone01-kisumu-db --app zone01-kisumu-api
```

This creates a `zone01_kisumu_api` database and user on the cluster and sets
the `DATABASE_URL` secret on the API app, e.g.
`postgres://zone01_kisumu_api:<password>@zone01-kisumu-db.flycast:5432/zone01_kisumu_api?sslmode=disable`.
Traffic stays on Fly's private network, so no public IP is needed on the
database.

### 4. Media bucket and secrets

```bash
fly storage create --public                 # Tigris bucket; sets BUCKET_NAME + AWS_* secrets
fly secrets set DJANGO_SECRET_KEY="$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')"
```

### 5. Deploy the backend

```bash
fly deploy                                  # migrations run as the release command
fly ssh console -C "python manage.py createsuperuser"
```

### 6. Deploy the frontend

From `frontend/`:

```bash
fly launch --no-deploy --copy-config
fly deploy                                  # bakes VITE_API_BASE_URL from fly.toml
```

Finally set the domain in **Admin → Sites**. Later deploys are just
`fly deploy` in each directory.

### Operating the database

Unmanaged Postgres is an ordinary Fly app: **you** are responsible for
backups, version upgrades, scaling and recovery. Useful commands:

```bash
fly postgres connect -a zone01-kisumu-db               # psql shell as postgres
fly status -a zone01-kisumu-db                         # machine and role (primary/replica)
fly volumes list -a zone01-kisumu-db                   # data volume(s)
fly volumes snapshots list <volume-id>                 # daily snapshots (kept 5 days by default)
fly machine restart -a zone01-kisumu-db                # restart the cluster
```

Take your own logical backups as well, since volume snapshots are short-lived
and tied to the volume:

```bash
fly proxy 15432:5432 -a zone01-kisumu-db               # in one terminal
pg_dump "postgres://postgres:<superuser-password>@localhost:15432/zone01_kisumu_api" \
  -Fc -f zone01-$(date +%F).dump                       # in another
```

Restore with `pg_restore -d <url> --clean --no-owner zone01-YYYY-MM-DD.dump`
through the same proxy. To recover from a volume snapshot, create a new
cluster with `fly postgres create --snapshot-id <snapshot-id>` and re-run
`fly postgres attach` against it (detach the old one first with
`fly postgres detach zone01-kisumu-db --app zone01-kisumu-api`).

To grow the disk, run `fly volumes extend <volume-id> --size <GB>`; to give
the database more memory, `fly machine update <machine-id> --vm-memory 1024
-a zone01-kisumu-db`.

## Managing site content

Everything below is edited in the Django admin at `/admin/`. Add or delete
rows directly; the changes appear on the website and the JSON API immediately.

| Admin section              | Fields                                                   |
| -------------------------- | -------------------------------------------------------- |
| **Partners**               | name, logo, information, order                           |
| **Staff**                  | name, role, photo, bio, order                            |
| **News**                   | title (name), image, information, publish toggle, order  |
| **Impact**                 | title (name), image, information, report PDF, publish toggle, order |
| **Next piscine registration** | on/off toggle, next piscine date, optional message    |

Each **Impact** row may attach an optional PDF report. Upload one with the file
picker, select **Clear** to remove it, or pick a different file to replace it.
The API exposes the download link as `report` (with `report_name`) so the
frontend can offer a "Download report" action on that impact story.

The **Next piscine registration** row is a singleton: toggle `is_active` on to
show the alert under the *Apply now* button on the frontend, and off to hide it.
Set `next_piscine_date` to the date the next piscine starts.

## Content API

The React frontend reads this read-only JSON API. All endpoints are `GET` and
CORS is controlled by `API_CORS_ALLOWED_ORIGINS`.

| Endpoint           | Returns                                              |
| ------------------ | ---------------------------------------------------- |
| `/api/content/`    | everything in one request (partners, staff, news, impact, piscine) |
| `/api/partners/`   | partner list                                         |
| `/api/staff/`      | staff list                                           |
| `/api/news/`       | published news list                                  |
| `/api/impact/`     | published impact list (includes `report` download URL)|
| `/api/piscine/`    | next-piscine toggle, date and message                |

Example:

```bash
curl http://localhost:8000/api/content/
```


## How the CMS is wired

- **Templates** live in `templates/`. `base.html` extends django CMS's Bootstrap 5
  base and defines the `"Page Content"` placeholder. Templates are selectable per
  page via `CMS_TEMPLATES` in `config/settings.py`. See
  [`templates/README.md`](templates/README.md) for a full guide to the CMS page
  template.
- **Pages** are created in the admin and can be arranged into a menu tree.
- **Plugins** (text, image, card, grid, accordion, etc.) are provided by
  `djangocms-text` and `djangocms-frontend` and are added to placeholders in the
  toolbar.
- **Media** uploads are managed by `django-filer` and served from `media/`.
- **Versioning** is provided by `djangocms-versioning`, so drafts and published
  versions are tracked separately.
- **Admin theming** uses `djangocms-simple-admin-style` on top of Django's
  built-in admin. The former custom `templates/admin/` overrides and
  `static/admin/css/zone01_admin.css` theme were removed, so the admin now
  renders with the default simple-admin style and the branding set in
  `config/urls.py`.

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
├── templates/            # CMS page templates (base.html) + README.md guide
├── static/               # static assets (img/); no project CSS
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
