# Zone01 CMS — Feature Documentation

Detailed reference for the Zone01 Django CMS backend: what each feature does,
the data model behind it, and — in particular — what every item in the **admin
sidebar** is for.

> Companion docs: [`README.md`](README.md) covers install, configuration and Make
> targets. This file goes one level deeper into feature purpose.

---

## 1. Purpose & scope

Zone01 CMS is the server-rendered website and back-office for the Zone01 Kisumu
campus. It has two jobs:

1. **Publish the public site** — pages, menus, media and editorial articles are
   authored in the admin and rendered by django CMS on the frontend.
2. **Run admissions and events** — applicants, cohorts and event registrations
   are captured and reviewed in the same admin, alongside the content.

It is deliberately server-rendered (no separate SPA build): editors log in at
`/admin/`, and the django CMS toolbar appears on the public pages so content can
be edited in place.

---

## 2. Technology stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Runtime          | Python 3.12                                                      |
| Framework        | Django 5.2                                                       |
| CMS              | django CMS 5 (`cms`) + `menus`                                   |
| Content add-ons  | `djangocms-text`, `djangocms-link`, `djangocms-alias`, `djangocms-versioning`, `djangocms-frontend` |
| Media            | `django-filer` + `easy-thumbnails`                              |
| Admin theme      | `djangocms-simple-admin-style` + project overrides              |
| Supporting libs  | `sekizai`, `treebeard`, `parler`                                |
| Config           | `django-environ` (`.env`)                                       |
| Database         | PostgreSQL 16 (`psycopg` 3) — SQLite also supported via `DATABASE_URL` |
| Serving          | `gunicorn` (WSGI), ASGI entrypoint provided                     |
| Tooling          | `ruff` (lint/format), GitHub Actions CI                         |

---

## 3. How the project is wired

### 3.1 URL routing — `config/urls.py`

| Path        | Purpose                                                              |
| ----------- | -------------------------------------------------------------------- |
| `/healthz`  | Liveness/readiness JSON endpoint (see §5.8). Not language-prefixed.  |
| `/jsi18n/`  | JavaScript translation catalog for admin/toolbar i18n.               |
| `/admin/`   | Django admin (the CMS back-office).                                  |
| `/filer/`   | django-filer media URLs.                                             |
| `/`         | django CMS catch-all — resolves published pages to templates.        |
| `/media/*`  | Served directly by Django only when `DEBUG=True`.                    |

The admin branding is set centrally in this module:
`site_header = "Zone01 CMS"`, `site_title = "Zone01 CMS"`,
`index_title = "Content dashboard"`.

### 3.2 Settings highlights — `config/settings.py`

- **Installed apps** — CMS core and add-ons, supporting libraries, then the
  project apps `core`, `applicants`, `events`, `content`.
- **CMS configuration**
  - `CMS_CONFIRM_VERSION4 = True` — enables the v4+ permission/versioning model.
  - `CMS_TEMPLATES = (("base.html", "Standard"),)` — the only page template.
  - `CMS_PERMISSION = True` — per-page permission checks are enforced.
  - `TEXT_INLINE_EDITING = True` — edit text plugins directly on the page.
  - `X_FRAME_OPTIONS = "SAMEORIGIN"` — required by the CMS editing iframe.
  - `DJANGOCMS_VERSIONING_ALLOW_DELETING_VERSIONS = True`.
  - `SITE_ID = 1` — default `django.contrib.sites` site.
  - `SILENCED_SYSTEM_CHECKS = ["treebeard.E001"]` — known django CMS warning.
- **Static/media** — `STATIC_ROOT=staticfiles/`, `STATICFILES_DIRS=[static/]`,
  `MEDIA_ROOT=media/`.
- **i18n** — `LANGUAGES = [("en", "English")]`, `USE_TZ = True`.

### 3.3 Project layout

```
backend/
├── config/                  # settings, URLs, WSGI/ASGI
├── core/                    # health endpoint
├── applicants/              # admissions intake schema
├── events/                  # events + registrations schema
├── content/                 # editorial articles + taxonomy (app label: site_content)
├── pages/                   # frontend-facing page sections + JSON API
├── templates/               # CMS page templates + admin overrides
│   ├── base.html            # frontend page template
│   └── admin/               # base_site.html, index.html, nav_sidebar.html
├── static/
│   ├── css/zone01.css       # frontend brand styles
│   └── admin/css/zone01_admin.css   # admin/sidebar theme
├── Makefile · requirements*.txt · pyproject.toml · Dockerfile · docker-compose.yml
```

---

## 4. Frontend page rendering

### 4.1 Base template — `templates/base.html`

Extends `bootstrap5/base.html` (provided by `djangocms-frontend`), so the public
site ships with Bootstrap 5 out of the box.

| Block                | Behaviour                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `title`              | `{% page_attribute "page_title" %} | Zone01`                    |
| `brand`              | `Zone01`                                                         |
| `base_css`           | Adds `css/zone01.css` on top of Bootstrap.                       |
| `content`            | Branded header with the page title, a `"Page Content"` placeholder, and a footer. |

### 4.2 Placeholders

Pages carry content through **placeholders**. The standard template defines one:

```django
{% placeholder "Page Content" %}
```

Editors drop plugins (text, image, card, grid, accordion, tabs, etc.) into it
using the CMS toolbar. To add another region, add a `{% placeholder "…" %}` to
`base.html`.

### 4.3 Plugins (from `djangocms-frontend` / `djangocms-text`)

Accordion, alert, badge, card, carousel, collapse, content, grid, icon, image,
jumbotron, link, list-group, media, navigation, tabs, utilities, and rich text.
These are the building blocks available inside every placeholder.

---

## 5. Core CMS features

### 5.1 Page management (django CMS core)

Pages are created/edited in the admin, organised into a **tree** (parent/child),
and translated per language. A page has a title, slug, template, menu visibility,
publication dates and permissions. Publishing moves a page from draft to live.

### 5.2 Templates & placeholders

Template selection is limited to `"Standard"` (`base.html`). Placeholders define
the editable regions of a page. This is the extension point for new layouts.

### 5.3 Content versioning (`djangocms-versioning`)

Every edit creates a **version** rather than overwriting live content. Versions
flow through states (draft → published → archived) and can be compared and
rolled back. Page and alias content are both versioned.

### 5.4 Reusable content — Aliases (`djangocms-alias`)

An **alias** is a named, reusable content block (e.g. a promo banner or CTA) that
can be embedded on many pages. Editing the alias updates every page that uses it.

### 5.5 Media library (`django-filer`)

Central store for images and files. Folders organise assets; **thumbnail
options** define named crop/size presets; **folder permissions** restrict who can
use a folder. Images referenced by `Event.cover_image` and `Article.cover_image`
are filer objects, so deleting a media object never deletes the article.

### 5.6 Multi-site (`django.contrib.sites`)

The **Sites** entry maps a domain to the installation. Set it to the production
hostname before deploy (default is `example.com`). Combined with django CMS this
allows multiple campuses/domains on one database.

### 5.7 Internationalisation

`i18n_patterns` prefix public URLs by language (`LANGUAGES = en` only, with
`prefix_default_language=False`). The admin ships a JS catalog at `/jsi18n/`, and
the CMS toolbar/localised content follow the active language.

### 5.8 Health endpoint — `core/views.py`

`GET /healthz` (GET-only) checks the default DB connection and returns JSON:

```json
{ "status": "ok", "database": "ok", "time": "…", "version": "dev" }
```

`status` becomes `degraded` and the HTTP code `503` when the database is
unreachable. `version` comes from `APP_VERSION`.

### 5.9 Admin theming

The admin is restyled to Zone01 branding without forking Django templates:

- `templates/admin/base_site.html` — brand/logo, header shortcut nav, stylesheet.
- `templates/admin/index.html` — welcome panel + recent actions.
- `templates/admin/nav_sidebar.html` — sidebar head + app list (see §7).
- `static/admin/css/zone01_admin.css` — all visual overrides.

---

## 6. Domain data model

These are the project apps that extend the CMS beyond generic pages.

### 6.1 `applicants` — admissions intake

**`Applicant`** — a person applying to a Zone01 programme.

| Field                | Type / choices                       | Purpose                                   |
| -------------------- | ------------------------------------ | ----------------------------------------- |
| `first_name`,`last_name` | CharField(100)                   | Identity; `full_name` property combines them. |
| `email`              | EmailField, **unique**               | Primary contact; enforces one record each. |
| `phone`              | CharField(30)                        | Optional contact.                          |
| `date_of_birth`      | DateField(null)                      | Age/eligibility checks.                    |
| `gender`             | choices `Gender`                     | Optional diversity data.                   |
| `county`             | CharField(100)                       | Location; indexed for regional reporting.  |
| `education_level`    | choices `EducationLevel`             | Eligibility/background.                    |
| `current_occupation` | CharField(150)                       | Context for reviewers.                     |
| `motivation`         | TextField                            | Free-text statement.                       |
| `portfolio_url`,`github_url`,`linkedin_url` | URLField            | Evidence of work.                          |
| `referral_source`    | CharField(100)                       | Marketing attribution.                     |
| `status`             | choices `Status`, default `draft`    | Pipeline stage; indexed.                   |
| `reviewer_notes`     | TextField                            | Internal notes.                            |
| `consented_at`       | DateTime(null)                       | Consent timestamp.                         |
| `submitted_at`       | DateTime(null)                       | When the application was submitted.        |
| `created_at`,`updated_at` | auto                             | Audit timestamps.                          |

- `Status`: `draft, submitted, screening, interview, accepted, waitlisted, rejected, withdrawn`
- `EducationLevel`: `secondary, certificate, diploma, degree, postgraduate, self_taught, other`
- `Gender`: `female, male, other, undisclosed`
- Ordering: newest first. Indexes on `status` and `county`.

**Admin (`ApplicantAdmin`)** — list shows name, email, county, education, status,
submitted date; filters by status/education/gender/county; search by
name/email/phone; `date_hierarchy` on created date.

### 6.2 `events` — events & registrations

**`Event`** — a bootcamp, open day, workshop or hackathon.

| Field                | Type / choices                       | Purpose                                   |
| -------------------- | ------------------------------------ | ----------------------------------------- |
| `title`,`slug`       | Char / SlugField(unique)             | Name + URL identity.                       |
| `summary`,`description` | Char(300) / Text                  | Listing blurb + full body.                 |
| `format`             | choices `Format`, default `in_person`| In person / virtual / hybrid.             |
| `location_name`,`location_address` | Char                  | Physical venue.                            |
| `online_url`         | URLField                             | Join link for virtual events.              |
| `start_at`,`end_at`  | DateTime (end optional)              | Schedule.                                  |
| `capacity`           | PositiveInteger(null)                | Seat limit.                                |
| `cover_image`        | FilerImageField(SET_NULL)            | Hero image; keeps media independent.       |
| `status`             | choices `Status`, default `draft`    | Publication state.                         |
| `is_featured`        | Boolean                              | Highlight on listings.                     |
| `created_at`,`updated_at` | auto                            | Audit timestamps.                          |

- `Status`: `draft, published, cancelled, completed`
- `Format`: `in_person, virtual, hybrid`
- `is_past` property compares `start_at` to now.
- Ordering: soonest/latest start first; composite index `(status, start_at)`.

**`EventRegistration`** — a sign-up for an event.

| Field       | Type / choices                    | Purpose                                  |
| ----------- | --------------------------------- | ---------------------------------------- |
| `event`     | FK → Event, CASCADE               | The event being registered for.          |
| `applicant` | FK → `applicants.Applicant`, SET_NULL | Optional link to an admissions record. |
| `full_name`,`email`,`phone` | Char/Email            | Attendee contact.                        |
| `status`    | choices `Status`, default `registered` | Attendance lifecycle.                |
| `created_at`,`updated_at` | auto                  | Audit timestamps.                        |

- `Status`: `registered, waitlisted, attended, cancelled`
- **Unique constraint** on `(event, email)` — no duplicate sign-ups.

**Admin** — `EventAdmin` shows title/format/start/status/featured, filters,
search, auto-slug, and an inline editor for its registrations.
`EventRegistrationAdmin` shows attendee, event and status with filters/search.

### 6.3 `content` — editorial stream (app label `site_content`)

Page copy lives in django CMS; this app covers the **time-stamped editorial
stream** (news, stories, impact updates) and its taxonomy.

**`Category`** — taxonomy term.

| Field                  | Type                    | Purpose                     |
| ---------------------- | ----------------------- | --------------------------- |
| `name`,`slug`          | Char/SlugField, unique  | Label + URL identity.       |
| `description`          | TextField               | Optional description.       |

Ordering by name; plural label "categories".

**`Article`** — a news item, story or impact update.

| Field          | Type / choices                        | Purpose                             |
| -------------- | ------------------------------------- | ----------------------------------- |
| `title`,`slug` | Char / SlugField(unique)              | Headline + URL identity.            |
| `category`     | FK → Category, SET_NULL               | Grouping.                           |
| `author`       | FK → `AUTH_USER_MODEL`, SET_NULL      | Attribution.                        |
| `summary`,`body` | Char(300) / Text                    | Teaser + full body.                 |
| `cover_image`  | FilerImageField(SET_NULL)             | Hero image.                         |
| `status`       | choices `Status`, default `draft`     | Editorial state.                    |
| `published_at` | DateTime(null)                        | Publish time (drives ordering).     |
| `created_at`,`updated_at` | auto                        | Audit timestamps.                   |

- `Status`: `draft, in_review, published, archived`
- Ordering: newest published first; composite index `(status, published_at)`.

**Admin** — `CategoryAdmin` (name/slug, auto-slug) and `ArticleAdmin`
(title/category/author/status/published, filters, search, auto-slug,
`date_hierarchy` on published date).

### 6.4 `pages` — frontend-facing page sections

Sections are attached to **django CMS pages** through a
`PageContentExtension` (`pages.PageSections`), so editors manage them while
editing a page and djangocms-versioning versions them alongside the page. The
app is not rendered by Django templates; it only feeds the JSON API (see §13).

**`PageSections(PageContentExtension)`**

| Field             | Type                           | Purpose                                                        |
| ----------------- | ------------------------------ | -------------------------------------------------------------- |
| `extended_object` | OneToOne → `cms.PageContent`   | The page content this extension belongs to (set automatically). |
| `sections`        | JSONField (list), default `[]` | Ordered list of section objects.                                |

Each element of `sections` must be an object with **exactly three string
values**:

```json
{ "key": "hero", "label": "Hero", "content": "Welcome to Zone01 Kisumu" }
```

- `key` — frontend component key (e.g. `hero`, `cta`).
- `label` — human-readable name for editors.
- `content` — the string payload.

`validate_sections` enforces this shape (a list of objects, exactly those keys,
all values strings) whenever the extension is saved.

**Admin / toolbar** — `PageSectionsAdmin(PageContentExtensionAdmin)` edits the
JSON. Like every django CMS extension it is hidden from the admin index and is
opened from the **page toolbar** (edit mode → *Page sections*).

**Versioning** — `djangocms-versioning` copies the extension whenever a new page
version is created, so drafts and the published version keep their own sections.

---

## 7. Admin sidebar — detailed reference

This is the primary navigation of the CMS. It is rendered by the override
`templates/admin/nav_sidebar.html`, which replaces Django's default sidebar.

### 7.1 How it is built

```django
{% include 'admin/app_list.html' with app_list=available_apps show_changelinks=False %}
```

- `available_apps` is supplied by Django's admin context processor and is the
  list of apps/models the **current user is allowed to see**.
- `show_changelinks=False` hides the default "change list" link, so each row
  links directly to the model's changelist.
- The sidebar is therefore **permission-aware**: an app or model the user cannot
  access never appears.

### 7.2 Sidebar structure

| Region       | Content                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| Head         | Brand link (`site_header` = "Zone01 CMS"), subtitle "Content management", and a **search input** (`#nav-filter`, placeholder "Search models…"). |
| Body         | One group per app, using the app's `verbose_name` as the caption, then a row per model. |
| Toggle       | The chevron button (`#toggle-nav-sidebar`) collapses/expands the whole sidebar. |

### 7.3 Interactive behaviour

- **Collapse** — toggling stores the state in `localStorage`
  (`django.admin.navSidebarIsOpen`) so it is remembered between visits.
- **Quick filter** — typing in the search box filters model rows client-side
  (Django's `nav_sidebar.js`): matching rows show, others hide, and the field
  turns red (`no-results`) when nothing matches. The query is remembered in
  `sessionStorage`.
- **Active model** — the row for the model currently open gets the
  `current-model` class and is highlighted in Zone01 blue.
- **Add shortcut** — hovering a row reveals a round **+** button (only when the
  user has add permission) that jumps straight to the "add new" form.

### 7.4 Sidebar sections and item purpose

The sections appear in `INSTALLED_APPS` order. With a superuser, the sidebar
contains the following.

#### Applicants
| Item         | Purpose                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| **Applicants** (`applicants.Applicant`) | Admissions intake records — create, search and review applications by status, county, education and gender. |

#### Authentication and Authorization
| Item      | Purpose                                                                   |
| --------- | ------------------------------------------------------------------------- |
| **Groups** (`auth.Group`) | Named permission sets (e.g. "Editorial Reviewers") assigned to staff. |
| **Users** (`auth.User`)   | Staff accounts, passwords, and group/permission assignment.         |

#### Content
| Item            | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| **Articles** (`site_content.Article`) | Editorial news/story records with category, author, cover image and publish state. |
| **Categories** (`site_content.Category`) | Taxonomy terms used to group articles.                          |

#### django CMS
| Item                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| **Page contents** (`cms.PageContent`) | The versioned content objects behind each page; edited indirectly when you edit a page. |
| **Pages global permissions** (`cms.GlobalPagePermission`) | Site-wide rules controlling who may view/edit/publish pages. |
| **Users (page)** (`cms.PageUser`) | Page-scoped user accounts for granting permissions to non-staff users. |
| **User groups (page)** (`cms.PageUserGroup`) | Page-scoped groups used for per-page access.            |

> **Note — where are the Pages?** `cms.Page` intentionally sets
> `has_module_permission = False`, so it is **not** listed in the sidebar.
> Pages are reached from the **"Pages"** shortcut in the admin header
> (`admin:cms_page_changelist`) and from the **CMS toolbar** on the frontend,
> where the page tree and publishing controls live.

#### django CMS Alias
| Item                 | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| **Aliases** (`djangocms_alias.Alias`) | Reusable content blocks that can be embedded across many pages. |
| **Categories** (`djangocms_alias.Category`) | Groups aliases in the alias picker.                          |

#### django CMS Versioning
| Item                                    | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| **Alias content versions** (`djangocms_versioning.AliasContentVersion`) | Draft/published versions of alias content. |
| **Page content versions** (`djangocms_versioning.PageContentVersion`) | Draft/published versions of page content.  |

#### Events
| Item                          | Purpose                                                    |
| ----------------------------- | ---------------------------------------------------------- |
| **Event registrations** (`events.EventRegistration`) | RSVPs, with attendance status and optional link to an applicant. |
| **Events** (`events.Event`)   | Event records (schedule, venue/online link, capacity, cover image). |

#### Filer
| Item                            | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| **Folders** (`filer.Folder`)    | Media library structure; browse/upload images and files.      |
| **Thumbnail options** (`filer.ThumbnailOption`) | Named crop/size presets used by templates and plugins. |

> Files, images, folder permissions and clipboards are managed from within
> **Folders** rather than as separate sidebar entries.

#### Sites
| Item          | Purpose                                                                |
| ------------- | ---------------------------------------------------------------------- |
| **Sites** (`sites.Site`) | Maps a domain + display name to this installation; set to the production hostname before deploy. |

### 7.5 Adding a new sidebar entry

A model appears in the sidebar automatically once it is **registered in the
admin** and the user has permission. To add one:

```python
# <app>/admin.py
from django.contrib import admin
from .models import Thing

@admin.register(Thing)
class ThingAdmin(admin.ModelAdmin):
    list_display = ("name", "status")
```

Give the `AppConfig` a friendly `verbose_name` (as `applicants`, `events` and
`content` do) to control the section caption.

---

## 8. Admin header & dashboard

### 8.1 Header — `templates/admin/base_site.html`

- **Branding** — Zone01 logo + "CMS" label linking to the admin index.
- **Header shortcuts** (`nav-global`, only when authenticated): **Dashboard**,
  **Pages**, **+ New page** (accent), **Media**, **Users**, and **View site ↗**.
  This is the quick-access bar that complements the sidebar — and the only place
  "Pages" is surfaced (see §7.4).
- **User tools** — Django's default logout/account menu.
- **Theme toggle** — shown for anonymous users.

### 8.2 Dashboard — `templates/admin/index.html`

- **Welcome panel** — greets the user by short name and offers **+ New page**
  and **View site** actions.
- **Recent actions** — the Django admin log (`get_admin_log`) for the current
  user, colour-coded by action type (add/change/delete).

---

## 9. Permissions model

- `CMS_PERMISSION = True` enables django CMS per-page permissions on top of
  Django's model-level permissions.
- Django controls **who sees which sidebar entries** (via `available_apps`).
- `cms.GlobalPagePermission` applies site-wide rules; `PageUser`/`PageUserGroup`
  scope permissions to specific pages.
- Use `auth.Groups` (e.g. "Editorial Reviewers") to bundle permissions for staff.

---

## 10. Static assets & theming

| File                                | Scope        | Purpose                                                       |
| ----------------------------------- | ------------ | ------------------------------------------------------------- |
| `static/css/zone01.css`             | Frontend     | Overrides Bootstrap 5 primary colour to `#0063f9`, buttons/links. |
| `static/admin/css/zone01_admin.css` | Admin        | Header, header shortcut pills, sidebar, welcome panel, filters, recent-actions styling. |
| `static/img/zone01-logo.png`        | Admin header | Brand logo.                                                   |

Brand colour used throughout: **`#0063f9`** (hover `#0049b8`).

---

## 11. Testing & CI

- Model tests live in each app:
  - `applicants/tests.py` — default status, `full_name`, unique email.
  - `events/tests.py` — `__str__`, `is_past`, registration `__str__`.
  - `content/tests.py` — category relation and default draft status.
  - `core/tests.py` — `/healthz` returns `ok`.
- Run: `make test` (or `manage.py test`).
- `make check` runs Django system checks **and** a migration-drift check.
- CI (`.github/workflows/backend-ci.yml`) runs ruff lint/format, Django checks
  and the test suite against a `postgres:16` service for backend changes.

---

## 12. Quick command reference

```bash
make install     # create .venv + install dev dependencies
make migrate     # apply database migrations
make superuser   # create a CMS admin login
make run         # dev server on http://localhost:8000
make test        # run the test suite
make lint        # ruff check
make fmt         # ruff format
make check       # Django system + migration drift checks
make static      # collect static files
```

Key URLs: site `/`, admin `/admin/`, health `/healthz`, content API `/api/v1/`.

---

## 13. Content API — serving the React frontend

The React app does not consume Django templates. The `pages` app reads the
**published** django CMS page content and exposes its sections as JSON through
plain Django views — no DRF dependency.

### 13.1 Endpoints

| Method | Path                     | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| `GET`  | `/api/v1/pages/`         | Published pages (`slug`, `path`, `title`).   |
| `GET`  | `/api/v1/pages/<slug>/`  | One published page with its sections.        |

- Only `GET` is allowed (`405` otherwise).
- Pages without a published version return `404` and are omitted from the list.
- `<slug>` is the page URL segment (`cms.PageUrl.slug`).

### 13.2 Response shape

`GET /api/v1/pages/home/`:

```json
{
  "slug": "home",
  "path": "home",
  "title": "Home",
  "sections": [
    { "key": "hero", "label": "Hero", "content": "Welcome to Zone01 Kisumu" },
    { "key": "cta", "label": "Call to action", "content": "Apply now" }
  ]
}
```

Every section is an object of exactly three **strings** — `key`, `label`,
`content`. The frontend switches on `key` to choose a component and styles
`content` however it likes; the backend stays presentation-free. Sections keep
the order in which they were saved.

### 13.3 CORS

Browser calls from the React dev server are allowed through
`settings.API_CORS_ALLOWED_ORIGINS` (env `API_CORS_ALLOWED_ORIGINS`, default
`http://localhost:5173,http://127.0.0.1:5173`). Set `*` to allow any origin. The
view echoes the request `Origin` when it is in the allow-list.

### 13.4 Editing content

Log in to the CMS, open a page, enter **edit mode**, and choose **Page sections**
from the page toolbar. Paste the sections JSON (a list of `key` / `label` /
`content` objects) and save. Publishing the page makes the sections available to
the API.

---

## Related artifacts

- `Zone01web/frontend/admin-dashboard.html` — a static, standalone mock of the
  "Content Management Dashboard" (single HTML file, no build step). It is a
  design reference only; it is not served by this Django app.
