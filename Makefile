# ============================================================
#  LogiTrack Pro — Makefile
#  Uso: make <comando>
# ============================================================

.DEFAULT_GOAL := help

# ── Cores para o terminal (funciona no Git Bash / WSL) ──────
GREEN  := \033[0;32m
YELLOW := \033[1;33m
CYAN   := \033[0;36m
RESET  := \033[0m

# ============================================================
#  DOCKER
# ============================================================

## Sobe todos os containers (DB + Backend + Frontend) com build
up:
	@echo "$(CYAN)>> Subindo todos os containers...$(RESET)"
	docker-compose up --build -d
	@echo "$(GREEN)>> Aplicação disponível em:$(RESET)"
	@echo "   Frontend : http://localhost:3000"
	@echo "   Backend  : http://localhost:8080"
	@echo "   Login    : admin / admin123"

## Sobe apenas o banco de dados PostgreSQL
up-db:
	@echo "$(CYAN)>> Subindo apenas o banco de dados...$(RESET)"
	docker-compose up -d postgres
	@echo "$(GREEN)>> PostgreSQL disponível em localhost:5432$(RESET)"

## Para todos os containers (mantém os volumes/dados)
down:
	@echo "$(YELLOW)>> Parando todos os containers...$(RESET)"
	docker-compose down

## Para e remove todos os containers E os volumes (limpa o banco)
down-clean:
	@echo "$(YELLOW)>> Parando containers e removendo volumes...$(RESET)"
	docker-compose down -v

## Reconstrói as imagens sem cache
rebuild:
	@echo "$(CYAN)>> Reconstruindo imagens do zero...$(RESET)"
	docker-compose build --no-cache
	docker-compose up -d

## Mostra os logs de todos os serviços em tempo real
logs:
	docker-compose logs -f

## Mostra os logs apenas do backend
logs-backend:
	docker-compose logs -f backend

## Mostra os logs apenas do banco de dados
logs-db:
	docker-compose logs -f postgres

## Status dos containers
status:
	docker-compose ps

# ============================================================
#  DESENVOLVIMENTO LOCAL (sem Docker)
# ============================================================

## Instala dependências do Frontend
install-frontend:
	@echo "$(CYAN)>> Instalando dependências do Frontend...$(RESET)"
	cd FRONTEND && npm install

## Roda o Frontend em modo desenvolvimento (localhost:5173)
dev-frontend:
	@echo "$(CYAN)>> Iniciando Frontend em modo dev...$(RESET)"
	cd FRONTEND && npm run dev

## Roda o Backend localmente (requer PostgreSQL em localhost:5432)
dev-backend:
	@echo "$(CYAN)>> Iniciando Backend localmente...$(RESET)"
	cd BACKEND && mvnw.cmd spring-boot:run

# ============================================================
#  BANCO DE DADOS
# ============================================================

## Abre o psql no container do banco (requer container rodando)
db-shell:
	docker exec -it logitrack-db psql -U postgres -d logitrack

## Importa a carga inicial de dados SQL
db-seed:
	@echo "$(CYAN)>> Importando carga inicial de dados...$(RESET)"
	docker exec -i logitrack-db psql -U postgres -d logitrack < "Desafio LogAp TRE - Carga Inicial (1).sql"
	@echo "$(GREEN)>> Carga inicial importada com sucesso!$(RESET)"

# ============================================================
#  HELP
# ============================================================

## Mostra esta mensagem de ajuda
help:
	@echo ""
	@echo "$(CYAN)LogiTrack Pro — Comandos disponíveis:$(RESET)"
	@echo ""
	@grep -E '^##' Makefile | sed 's/## //' | awk 'BEGIN{FS="\n"} /^[a-z]/{cmd=$$0; next} {printf "  $(GREEN)make %-20s$(RESET) %s\n", cmd, $$0}'
	@grep -E '^[a-zA-Z_-]+:' Makefile | grep -v '.DEFAULT' | awk -F: '{print $$1}' | while read cmd; do \
		desc=$$(grep -A1 "^## " Makefile | grep -B1 "^$$cmd:" | grep "^## " | sed 's/## //'); \
		printf "  $(GREEN)make %-20s$(RESET) %s\n" "$$cmd" "$$desc"; \
	done
	@echo ""

.PHONY: up up-db down down-clean rebuild logs logs-backend logs-db status \
        install-frontend dev-frontend dev-backend db-shell db-seed help
