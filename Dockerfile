# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1: build the React SPA
# ---------------------------------------------------------------------------
FROM node:22-alpine AS frontend

WORKDIR /build

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Django serves the bundle from /static/, and the API lives on the same origin
# (empty VITE_API_BASE_URL), so no CORS/proxy is needed in production.
ENV VITE_BASE=/static/
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: Django + gunicorn, with the SPA baked in
# ---------------------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY Zone01web/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Zone01web/backend/ .
COPY --from=frontend /build/dist ./frontend_dist

RUN adduser --disabled-password --gecos "" app \
    && chown -R app:app /app
USER app

# Build the static manifest (admin assets + the SPA bundle under /static/).
RUN DJANGO_SECRET_KEY=build-only python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
