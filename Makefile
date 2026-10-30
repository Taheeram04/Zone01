.PHONY: help install build migrate serve dev test lint docker-up docker-down clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install backend and frontend dependencies
	cd backend && $(MAKE) install
	cd frontend && npm install --no-audit --no-fund

build: ## Build the React SPA into Django's frontend_dist
	cd backend && $(MAKE) frontend

migrate: ## Apply database migrations
	cd backend && $(MAKE) migrate

serve: ## One server: rebuild the SPA if needed, then run Django on :8000
	@if [ ! -f backend/frontend_dist/index.html ] || \
		[ -n "$$(find frontend/src frontend/index.html frontend/package.json frontend/vite.config.js \
			-newer backend/frontend_dist/index.html -print -quit 2>/dev/null)" ]; then \
		$(MAKE) build; \
	fi
	cd backend && $(MAKE) migrate
	cd backend && $(MAKE) run

dev: ## Hot reload: Django :8000 + Vite :5173 in one command
	./scripts/dev.sh

test: ## Run the backend test suite
	cd backend && $(MAKE) test

lint: ## Lint the backend and frontend
	cd backend && $(MAKE) lint
	cd frontend && npm run lint

docker-up: ## Build and run the whole app + PostgreSQL in Docker
	docker compose up --build

docker-down: ## Stop the Docker stack
	docker compose down

clean: ## Remove local caches and build output
	cd backend && $(MAKE) clean
	rm -rf frontend/dist
