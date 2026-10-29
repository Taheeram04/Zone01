"""Django settings for the Zone01 site, powered by django CMS.

Configuration is read from the environment and may be seeded from a local
``.env`` file (see ``.env.example``).
"""

from pathlib import Path

import environ
from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", default="insecure-development-key")
DEBUG = env("DJANGO_DEBUG")
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS")
APP_VERSION = env("APP_VERSION", default="dev")

# Full origins (scheme + host) trusted for CSRF, e.g. https://zone01-api.fly.dev.
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])

# Render sets this for every web service. Trusting it automatically lets the
# single-service Docker image serve the SPA, API and admin on one hostname
# without duplicating the domain in DJANGO_ALLOWED_HOSTS/CSRF_TRUSTED_ORIGINS.
RENDER_EXTERNAL_HOSTNAME = env("RENDER_EXTERNAL_HOSTNAME", default="")
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_EXTERNAL_HOSTNAME}")

# TLS is terminated by the hosting proxy (e.g. Fly.io), which forwards the
# original scheme in X-Forwarded-Proto.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# The frontend's nginx proxies /admin/ from the public domain and passes the
# original host in X-Forwarded-Host. It is still validated against ALLOWED_HOSTS.
USE_X_FORWARDED_HOST = True

# Cross-platform security headers. HSTS is only enabled outside DEBUG so local
# HTTP development is never pinned; Render/Fly terminate TLS in production.
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

INSTALLED_APPS = [
    "djangocms_simple_admin_style",
    "corsheaders",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # PostgreSQL lookups (search, trigram_similar, unaccent, ...) used by admin
    # search; see core.search and core.indexes.
    "django.contrib.postgres",
    # django CMS core
    "cms",
    "menus",
    # django CMS add-ons
    "djangocms_text",
    "djangocms_text.contrib.text_ckeditor4",
    "djangocms_link",
    "djangocms_alias",
    "djangocms_versioning",
    "djangocms_frontend",
    "djangocms_frontend.contrib.accordion",
    "djangocms_frontend.contrib.alert",
    "djangocms_frontend.contrib.badge",
    "djangocms_frontend.contrib.card",
    "djangocms_frontend.contrib.carousel",
    "djangocms_frontend.contrib.collapse",
    "djangocms_frontend.contrib.content",
    "djangocms_frontend.contrib.grid",
    "djangocms_frontend.contrib.icon",
    "djangocms_frontend.contrib.image",
    "djangocms_frontend.contrib.jumbotron",
    "djangocms_frontend.contrib.link",
    "djangocms_frontend.contrib.listgroup",
    "djangocms_frontend.contrib.media",
    "djangocms_frontend.contrib.navigation",
    "djangocms_frontend.contrib.tabs",
    "djangocms_frontend.contrib.utilities",
    # Supporting libraries
    "sekizai",
    "treebeard",
    "parler",
    "filer",
    "easy_thumbnails",
    # Local apps
    "core",
    "applicants",
    "events",
    "content",
    "services",
    "whatsapp_bot",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "core.middleware.ApiNoCacheMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "cms.middleware.user.CurrentUserMiddleware",
    "cms.middleware.page.CurrentPageMiddleware",
    "cms.middleware.toolbar.ToolbarMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "cms.middleware.language.LanguageCookieMiddleware",
    "cms.middleware.utils.ApphookReloadMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.template.context_processors.i18n",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "sekizai.context_processors.sekizai",
                "cms.context_processors.cms_settings",
            ],
        },
    },
]

THUMBNAIL_PROCESSORS = (
    "easy_thumbnails.processors.colorspace",
    "easy_thumbnails.processors.autocrop",
    "filer.thumbnail_processors.scale_and_crop_with_subject_location",
    "easy_thumbnails.processors.filters",
)

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        default="postgres://postgres:postgres@localhost:5432/zone01",
    ),
}
DATABASES["default"]["CONN_MAX_AGE"] = env.int("DB_CONN_MAX_AGE", default=60)

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en"
LANGUAGES = [
    ("en", _("English")),
]

TIME_ZONE = "Africa/Nairobi"
USE_I18N = True
USE_THOUSAND_SEPARATOR = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

# ---------------------------------------------------------------------------
# React SPA served by Django
# ---------------------------------------------------------------------------
# `make frontend` builds the React app with Vite's base set to `/static/` and
# copies the bundle here, so its hashed assets are collected alongside the other
# static files and `index.html` is served for client-side routes by
# `core.views.spa` (see `config/urls.py`). This lets one Django service host the
# whole product: the SPA at `/`, the JSON API at `/api/` and the admin at
# `/admin/`.
FRONTEND_DIST = Path(env("FRONTEND_DIST", default=str(BASE_DIR / "frontend_dist")))
FRONTEND_INDEX = FRONTEND_DIST / "index.html"
if FRONTEND_DIST.is_dir():
    STATICFILES_DIRS.append(FRONTEND_DIST)

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Uploaded media (filer files, images and their thumbnails) goes to an
# S3-compatible bucket when BUCKET_NAME is set (Tigris on Fly.io sets it, along
# with AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_ENDPOINT_URL_S3).
# Without it, media is stored on the local filesystem under MEDIA_ROOT.
AWS_STORAGE_BUCKET_NAME = env("BUCKET_NAME", default="")
if AWS_STORAGE_BUCKET_NAME:
    MEDIA_STORAGE_BACKEND = "storages.backends.s3.S3Storage"
    AWS_S3_ENDPOINT_URL = env("AWS_ENDPOINT_URL_S3", default="https://fly.storage.tigris.dev")
    AWS_S3_REGION_NAME = env("AWS_REGION", default="auto")
    # Public bucket: serve plain, unsigned URLs from the bucket's own host.
    AWS_S3_CUSTOM_DOMAIN = env(
        "AWS_S3_CUSTOM_DOMAIN",
        default=f"{AWS_STORAGE_BUCKET_NAME}.fly.storage.tigris.dev",
    )
    AWS_QUERYSTRING_AUTH = env.bool("AWS_QUERYSTRING_AUTH", default=False)
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
else:
    MEDIA_STORAGE_BACKEND = "django.core.files.storage.FileSystemStorage"

STORAGES = {
    "default": {"BACKEND": MEDIA_STORAGE_BACKEND},
    # Thumbnails generated by easy_thumbnails/filer live next to the originals.
    "easy_thumbnails": {"BACKEND": MEDIA_STORAGE_BACKEND},
    # Static files are served by WhiteNoise from STATIC_ROOT.
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# django CMS configuration
# https://docs.django-cms.org/en/release-5.0.x/reference/configuration.html

CMS_CONFIRM_VERSION4 = True
SITE_ID = 1
CMS_TEMPLATES = (("base.html", _("Standard")),)
CMS_PERMISSION = True
X_FRAME_OPTIONS = "SAMEORIGIN"
TEXT_INLINE_EDITING = True
DJANGOCMS_VERSIONING_ALLOW_DELETING_VERSIONS = True

# Use the bundled CKEditor 4 build for rich-text fields. It exposes the full
# formatting toolbar (font family, font size, bold, italic, underline, colours,
# alignment, lists, links, tables, source view, ...), which the TipTap default
# does not provide for standalone HTMLFields such as CommunityPost.body.
TEXT_EDITOR = "djangocms_text.contrib.text_ckeditor4.ckeditor4"

# Toolbar used by the "body" editor on community posts/news in the admin.
COMMUNITY_POST_EDITOR = {
    "toolbar_HTMLField": [
        ["Undo", "Redo", "-", "Find", "Replace", "-", "SelectAll"],
        ["Format", "Styles", "Font", "FontSize"],
        ["Bold", "Italic", "Underline", "Strike", "-", "Subscript", "Superscript"],
        ["TextColor", "BGColor"],
        ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
        ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
        ["Blockquote", "HorizontalRule", "Table"],
        ["Link", "Unlink", "Anchor"],
        ["Image"],
        ["RemoveFormat"],
        ["Maximize", "ShowBlocks", "Source"],
    ],
    "font_names": (
        "Montserrat/Montserrat, sans-serif;"
        "IBM Plex Mono/'IBM Plex Mono', monospace;"
        "Arial/Arial, Helvetica, sans-serif;"
        "Georgia/Georgia, serif;"
        "Times New Roman/'Times New Roman', Times, serif;"
        "Courier New/'Courier New', Courier, monospace"
    ),
    "fontSize_sizes": (
        "12/12px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;32/32px;36/36px;48/48px"
    ),
    # Let editors upload from their computer instead of pasting a URL.
    "filebrowserUploadUrl": "/admin/community-upload/?type=file",
    "filebrowserImageUploadUrl": "/admin/community-upload/?type=image",
    "filebrowserUploadMethod": "xhr",
    "height": 420,
}

SILENCED_SYSTEM_CHECKS = ["treebeard.E001"]

INTERNAL_IPS = ["127.0.0.1"]

# ---------------------------------------------------------------------------
# Frontend / API integration
# ---------------------------------------------------------------------------
# The React frontend is served separately (Vite in development, a static host
# in production) and reads content from the JSON API under /api/.
#
# API_CORS_ALLOWED_ORIGINS accepts full origins, local or hosted, e.g.
#   http://localhost:5173,https://zone01-kisumu.org
# Set API_CORS_ALLOW_ALL=true only for quick local experiments.
API_CORS_ALLOW_ALL = env.bool("API_CORS_ALLOW_ALL", default=False)
API_CORS_ALLOWED_ORIGINS = env.list(
    "API_CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://www.zone01kisumu.ke",
        "https://zone01kisumu.ke",
    ],
)

# Hosted frontend shown on the admin "Frontend status" page. Set this to the
# public URL of the React app so editors can check it is up from the dashboard.
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")
FRONTEND_HEALTH_TIMEOUT = env.float("FRONTEND_HEALTH_TIMEOUT", default=5.0)

CORS_ALLOW_ALL_ORIGINS = API_CORS_ALLOW_ALL
CORS_ALLOWED_ORIGINS = API_CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------------
# WhatsApp FAQ assistant (Meta WhatsApp Cloud API)
# ---------------------------------------------------------------------------
# The webhook lives at /webhooks/whatsapp/ and answers incoming text messages
# from the FAQ knowledge base (see the `whatsapp_bot` app and the FAQ content in
# the `content` app). Configure these from the Meta app dashboard:
#
#   WHATSAPP_VERIFY_TOKEN      - any secret string; enter the same value in Meta.
#   WHATSAPP_ACCESS_TOKEN      - temporary/permanent token for the phone number.
#   WHATSAPP_PHONE_NUMBER_ID   - the "Phone number ID" of your WhatsApp sender.
#   WHATSAPP_APP_SECRET        - app secret, used to verify webhook signatures.
#
# Leave DRY_RUN on (the default) until credentials are set: replies are logged
# and stored but not actually sent, so you can test the flow safely.
WHATSAPP_VERIFY_TOKEN = env("WHATSAPP_VERIFY_TOKEN", default="")
WHATSAPP_ACCESS_TOKEN = env("WHATSAPP_ACCESS_TOKEN", default="")
WHATSAPP_PHONE_NUMBER_ID = env("WHATSAPP_PHONE_NUMBER_ID", default="")
WHATSAPP_APP_SECRET = env("WHATSAPP_APP_SECRET", default="")
WHATSAPP_API_VERSION = env("WHATSAPP_API_VERSION", default="v21.0")
WHATSAPP_DRY_RUN = env.bool("WHATSAPP_DRY_RUN", default=True)
WHATSAPP_TIMEOUT = env.float("WHATSAPP_TIMEOUT", default=10.0)
# Minimum match score (0..1) before an FAQ answer is sent instead of the fallback.
WHATSAPP_MATCH_THRESHOLD = env.float("WHATSAPP_MATCH_THRESHOLD", default=0.34)
WHATSAPP_FALLBACK_MESSAGE = env(
    "WHATSAPP_FALLBACK_MESSAGE",
    default=(
        "Sorry, I couldn't find an answer to that. Please try rephrasing, or "
        "contact the Zone01 Kisumu team directly and we'll help you."
    ),
)

# AI answers grounded in the same FAQ rows. Any OpenAI-compatible
# /chat/completions endpoint works; leave the key empty to keep using the
# deterministic keyword matcher only. See whatsapp_bot/ai.py.
WHATSAPP_AI_ENABLED = env.bool("WHATSAPP_AI_ENABLED", default=True)
WHATSAPP_AI_API_KEY = env("WHATSAPP_AI_API_KEY", default="")
WHATSAPP_AI_BASE_URL = env("WHATSAPP_AI_BASE_URL", default="https://api.openai.com/v1")
WHATSAPP_AI_MODEL = env("WHATSAPP_AI_MODEL", default="gpt-4o-mini")
WHATSAPP_AI_TIMEOUT = env.float("WHATSAPP_AI_TIMEOUT", default=20.0)
WHATSAPP_AI_MAX_TOKENS = env.int("WHATSAPP_AI_MAX_TOKENS", default=300)
WHATSAPP_AI_TEMPERATURE = env.float("WHATSAPP_AI_TEMPERATURE", default=0.2)
# Optional custom system prompt. Use {faqs} to place the FAQ block yourself;
# otherwise the FAQ knowledge base is appended automatically.
WHATSAPP_AI_SYSTEM_PROMPT = env("WHATSAPP_AI_SYSTEM_PROMPT", default="")
