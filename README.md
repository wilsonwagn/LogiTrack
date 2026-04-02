# LogiTrack Pro

Sistema web de gestão de frotas com gerenciamento de veículos, viagens, manutenções e painel de análise em tempo real.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Spring Boot 3.2 + Java 17 + Spring Security |
| Banco | PostgreSQL 15 |
| Autenticação | JWT (stateless) |
| Frontend | React 18 + Vite |
| DevOps | Docker + Docker Compose |
| Deploy Backend | Railway |
| Deploy Frontend | Vercel |

---

## Decisões Técnicas

- **Separação em camadas**: `Controller → Service → Repository → Entity` com pacotes bem definidos em `br.com.logitrack`
- **JWT sem estado (stateless)**: sem sessão no servidor; o token é validado a cada requisição pelo `JwtAuthenticationFilter`
- **DTO manual**: conversão Entity ↔ DTO feita em `Service`, sem dependência extra como MapStruct
- **DataSeeder**: dados iniciais carregados via `CommandLineRunner` (idempotente — só insere se o banco estiver vazio)
- **Tabela `usuarios`**: necessária para autenticação; criada via `ddl-auto: update`
- **Queries do Dashboard**: usam JPQL para portabilidade e `nativeQuery` apenas onde necessário
- **Módulo de Manutenções**: agendamento via modal na página de veículos com status `PENDENTE` ou `CONCLUIDA`

---

## Como Rodar

### ✅ Opção 1 — Plataforma Online (recomendado)

Acesse diretamente sem instalar nada:

**🔗 https://logww.vercel.app/**

| Usuário | Senha |
|---|---|
| admin | admin123 |
| wilson | wilson123 |

---

### Opção 2 — Docker Compose (local)

> Pré-requisito: Docker instalado

```bash
# Recomendado — sobe banco, backend e frontend de uma vez:
make up

# Ou diretamente com Docker:
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Login: `admin` / `admin123` ou `wilson` / `wilson123`

> O `Makefile` na raiz do projeto contém atalhos úteis:
> - `make up` — sobe todos os containers
> - `make logs` — exibe logs em tempo real
> - `make db-seed` — recarrega dados iniciais
> - `make down` — derruba os containers

---

### Opção 3 — Manual (local)

**Backend**

> Pré-requisito: Java 17, PostgreSQL rodando em `localhost:5432`

> Login local: `admin` / `admin123` ou `wilson` / `wilson123`

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE logitrack;"

cd BACKEND
./mvnw spring-boot:run
# ou no Windows:
mvnw.cmd spring-boot:run
```

**Frontend**

> Pré-requisito: Node 18+

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend disponível em http://localhost:3000

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Autenticação (público) |
| GET | `/api/veiculos` | Lista veículos da frota |
| GET | `/api/viagens` | Lista viagens |
| POST | `/api/viagens` | Criar viagem |
| PUT | `/api/viagens/{id}` | Editar viagem |
| DELETE | `/api/viagens/{id}` | Excluir viagem |
| GET | `/api/dashboard/metricas` | Métricas do dashboard |
| POST | `/api/manutencoes` | Agendar manutenção |

> Todos os endpoints exceto `/api/auth/login` requerem header: `Authorization: Bearer <token>`

---

## Funcionalidades

### Dashboard
- Total de KM percorrido pela frota
- Volume de viagens por categoria (LEVE vs PESADO)
- Lista de manutenções — pendentes e concluídas
- Ranking de utilização por veículo
- Projeção financeira de custos de manutenção

### Veículos
- Listagem completa da frota
- **Agendamento de manutenção**: abre modal para informar tipo de serviço, data e custo estimado
- Manutenção criada com status `PENDENTE` e exibida no dashboard

### Manutenções
- Status: `PENDENTE` ou `CONCLUIDA`
- Exibidas no dashboard com badge colorido por status
- Agendadas pela página de veículos sem necessidade de acesso ao banco

### Viagens
- CRUD completo de viagens
- Filtro por veículo e período

---

## Estrutura do Projeto

```
LogiTrack/
├── BACKEND/                  # Spring Boot
│   └── src/main/java/br/com/logitrack/
│       ├── config/           # SecurityConfig, DataInitializer, DataSeeder
│       ├── controller/       # AuthController, VeiculoController, ViagemController,
│       │                     # DashboardController, ManutencaoController
│       ├── dto/              # LoginRequest, JwtResponse, ViagemDTO,
│       │                     # DashboardDTO, ManutencaoDTO
│       ├── entity/           # Veiculo, Viagem, Manutencao, Usuario
│       ├── repository/       # Interfaces JPA com queries JPQL/nativas
│       ├── security/         # JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl
│       └── service/          # AuthService, VeiculoService, ViagemService,
│                             # DashboardService, ManutencaoService
├── FRONTEND/                 # React + Vite
│   └── src/
│       ├── api/              # axios.js (interceptors JWT), index.js (chamadas HTTP)
│       ├── components/       # Sidebar, MetricCard, ViagemModal, ConfirmDialog
│       ├── context/          # AuthContext (gerenciamento de token JWT)
│       └── pages/            # LoginPage, DashboardPage, ViagensPage, VeiculosPage
├── docker-compose.yml        # Sobe banco + backend + frontend
├── Makefile                  # Atalhos: make up, make logs, make db-seed
└── README.md
```

---

## Deploy

| Serviço | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | https://logww.vercel.app |
| Backend | Railway | https://logitrack-production-ed68.up.railway.app |
| Banco | Railway (PostgreSQL) | interno via `postgres.railway.internal` |
