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

# TLS is terminated by the hosting proxy (e.g. Fly.io), which forwards the
# original scheme in X-Forwarded-Proto.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

INSTALLED_APPS = [
    "djangocms_simple_admin_style",
    "corsheaders",
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
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
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

TIME_ZONE = "UTC"
USE_I18N = True
USE_THOUSAND_SEPARATOR = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

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

CORS_ALLOW_ALL_ORIGINS = API_CORS_ALLOW_ALL
CORS_ALLOWED_ORIGINS = API_CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = True
