VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
MANAGE := $(PYTHON) manage.py

.PHONY: help venv install migrate makemigrations run test lint fmt check superuser static clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

venv: ## Create the virtual environment
	python3 -m venv $(VENV)

install: venv ## Install dependencies
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements-dev.txt

migrate: ## Apply database migrations
	$(MANAGE) migrate

makemigrations: ## Create new migrations
	$(MANAGE) makemigrations

run: ## Run the development server
	$(MANAGE) runserver

test: ## Run the test suite
	$(MANAGE) test

lint: ## Run ruff lint
	$(VENV)/bin/ruff check .

fmt: ## Format code with ruff
	$(VENV)/bin/ruff format .

check: ## Run Django system checks and migration drift check
	$(MANAGE) check
	$(MANAGE) makemigrations --check --dry-run

superuser: ## Create an admin user for the CMS
	$(MANAGE) createsuperuser

static: ## Collect static files
	$(MANAGE) collectstatic --noinput

clean: ## Remove local caches
	rm -rf $(VENV) .ruff_cache staticfiles media
	find . -type d -name __pycache__ -exec rm -rf {} +
