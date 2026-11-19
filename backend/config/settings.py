"""Django settings for the SK Balabag portal. Secrets come from environment variables (see .env.example)."""
import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DEBUG = os.environ.get("DEBUG", "True") == "True"
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-insecure-key")
if not DEBUG and SECRET_KEY == "dev-only-insecure-key":
    raise RuntimeError("Set a real SECRET_KEY when DEBUG is False.")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

USE_CLOUDINARY = bool(os.environ.get("CLOUDINARY_URL"))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    *(["cloudinary_storage"] if USE_CLOUDINARY else []),  # must come before staticfiles
    "django.contrib.staticfiles",
    *(["cloudinary"] if USE_CLOUDINARY else []),
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "core",
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
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

# SQLite for development; set DATABASE_URL=postgres://... for PostgreSQL.
DATABASES = {"default": dj_database_url.config(default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}", conn_max_age=600)}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": f"django.contrib.auth.password_validation.{n}"}
    for n in ("UserAttributeSimilarityValidator", "MinimumLengthValidator",
              "CommonPasswordValidator", "NumericPasswordValidator")
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Manila"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    # Images (photos, logos, banners): Cloudinary when configured, otherwise local disk.
    "default": {"BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"
                if USE_CLOUDINARY else "django.core.files.storage.FileSystemStorage"},
    # PDF reports: Django file storage (local/server disk). Used by Report.file.
    "reports": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"],
    # Everyone can read; only staff (admins) can create/edit/delete.
    "DEFAULT_PERMISSION_CLASSES": ["core.permissions.IsStaffOrReadOnly"],
    "DEFAULT_THROTTLE_RATES": {"login": "10/min"},
}

CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")

if not DEBUG:
    SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "True") == "True"
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
    CSRF_TRUSTED_ORIGINS = [o for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o]
