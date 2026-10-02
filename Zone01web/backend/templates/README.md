# CMS page templates

Django CMS renders every page through one of the templates listed in
`CMS_TEMPLATES` (`config/settings.py`). This folder holds those page templates.
They are **not** admin dashboard mockups — they are the server-rendered
front end that django CMS fills with plugins.

## How templates are discovered

| Setting | Value | Purpose |
| ------- | ----- | ------- |
| `TEMPLATES[0].DIRS` | `[BASE_DIR / "templates"]` | Makes this folder the template search root. |
| `TEMPLATES[0].OPTIONS.APP_DIRS` | `True` | Also finds templates bundled inside installed apps. |
| `CMS_TEMPLATES` | `(("base.html", "Standard"),)` | Templates editors can choose when creating a page. |

Because `base.html` is the only entry in `CMS_TEMPLATES`, it is the default
(and currently only) page template available in the CMS.

## `base.html`

`templates/base.html` is the site-wide CMS page template.

```django
{% extends "bootstrap5/base.html" %}
{% load cms_tags %}
```

- It extends `bootstrap5/base.html`, provided by **djangocms-frontend**. That
  parent supplies the HTML document, Bootstrap assets, and the `sekizai`
  blocks (`base_css`, `base_js`, etc.).
- It requires the `cms_tags` template tag library for `{% page_attribute %}`
  and `{% placeholder %}`.

### Blocks it overrides

| Block | What it does |
| ----- | ------------ |
| `title` | `"<page title> | Zone01"` via `{% page_attribute "page_title" %}`. |
| `brand` | Renders `Zone01` as the site brand name. |
| `content` | The full page body: a header with the page title, a `main` element holding the editable placeholder, and a footer. |

### Placeholders

```django
<main class="container pb-5">
    {% placeholder "Page Content" %}
</main>
```

`{% placeholder "Page Content" %}` is the editable region. Editors drop text,
image, card, grid, accordion and other djangocms-frontend plugins into it from
the CMS toolbar. The placeholder name is used verbatim when plugins are
attached, so renaming it orphans existing content.

Other CMS tags used here:

- `{% page_attribute "page_title" %}` — prints a field from the current page.
- `{% now "Y" %}` — the current year in the footer copyright line.

## Adding a placeholder

1. Edit `base.html` (or a new template) and load the tag library:

   ```django
   {% load cms_tags %}
   {% placeholder "Section Name" %}
   ```

2. Reload the page in the CMS toolbar; the new region becomes editable.

## Adding another CMS page template

1. Create the file here, e.g. `templates/landing.html`, extending
   `bootstrap5/base.html` and defining at least one `{% placeholder %}`.
2. Register it in `CMS_TEMPLATES`:

   ```python
   CMS_TEMPLATES = (
       ("base.html", _("Standard")),
       ("landing.html", _("Landing page")),
   )
   ```

3. Restart the server (or rely on the dev auto-reloader) and select the
   template under **Page → Advanced settings** in the CMS admin.

## Styling

Earlier revisions shipped a project stylesheet (`static/css/zone01.css`) linked
from this template's `base_css` block. That file was removed, so the template
now inherits all styling from Bootstrap and djangocms-frontend. To add custom
CSS back, drop a file in `static/`, run `manage.py collectstatic`, and add a
`{% load static %}` + `<link>` inside the `base_css` block.
