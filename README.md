# LogiTrack Pro

Sistema web de gestão de frotas desenvolvido como desafio técnico para o TRE. Permite o gerenciamento de viagens e exibe um painel de análise com 5 métricas extraídas via SQL.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Spring Boot 3.2 + Java 17 + Spring Security |
| Banco | PostgreSQL 15 |
| Autenticação | JWT (stateless) |
| Frontend | React 18 + Vite |
| DevOps | Docker + Docker Compose |

---

## Decisões Técnicas

- **Separação em camadas**: `Controller → Service → Repository → Entity` com pacotes bem definidos em `br.com.logitrack`
- **JWT sem estado (stateless)**: sem sessão no servidor; o token é validado a cada requisição pelo `JwtAuthenticationFilter`
- **DTO manual**: conversão Entity ↔ DTO feita em `Service`, sem dependência extra como MapStruct
- **DataSeeder**: dados iniciais carregados via `CommandLineRunner` (idempotente — só insere se o banco estiver vazio)
- **Tabela `usuarios` adicionada**: não existia no script original; necessária para a autenticação. Criada via `ddl-auto: update`
- **Queries do Dashboard**: usam JPQL para portabilidade e `nativeQuery` apenas onde necessário (função `EXTRACT` do PostgreSQL)

---

## Como rodar localmente

### Opção 1 — Docker Compose (recomendado)

> Pré-requisito: Docker instalado

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Login: `admin` / `admin123`

---

### Opção 2 — Manual

**Backend**

> Pré-requisito: Java 17, PostgreSQL rodando em `localhost:5432`

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
| GET | `/api/veiculos` | Lista veículos |
| GET | `/api/viagens` | Lista viagens |
| POST | `/api/viagens` | Criar viagem |
| PUT | `/api/viagens/{id}` | Editar viagem |
| DELETE | `/api/viagens/{id}` | Excluir viagem |
| GET | `/api/dashboard/metricas` | 5 métricas do dashboard |

> Todos os endpoints exceto `/api/auth/login` requerem header: `Authorization: Bearer <token>`

---

## Métricas do Dashboard

1. **Total KM percorrido** — soma da quilometragem de toda a frota
2. **Volume por Categoria** — contagem de viagens por tipo (LEVE vs PESADO)
3. **Cronograma de Manutenção** — próximas 5 manutenções não concluídas
4. **Ranking de Utilização** — veículo com maior km acumulada
5. **Projeção Financeira** — soma dos custos estimados de manutenção do mês atual

---

## Estrutura do Projeto

```
Desafio-LogAp-TRE/
├── BACKEND/                  # Spring Boot
│   └── src/main/java/br/com/logitrack/
│       ├── config/           # SecurityConfig, DataInitializer, DataSeeder
│       ├── controller/       # AuthController, VeiculoController, ViagemController, DashboardController
│       ├── dto/              # LoginRequest, JwtResponse, ViagemDTO, DashboardDTO
│       ├── entity/           # Veiculo, Viagem, Manutencao, Usuario
│       ├── repository/       # Interfaces JPA com queries SQL
│       ├── security/         # JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl
│       └── service/          # AuthService, VeiculoService, ViagemService, DashboardService
├── FRONTEND/                 # React + Vite
│   └── src/
│       ├── api/              # Chamadas HTTP centralizadas
│       ├── components/       # Sidebar, MetricCard, ViagemModal, ConfirmDialog
│       ├── context/          # AuthContext (JWT)
│       └── pages/            # LoginPage, DashboardPage, ViagensPage
├── docker-compose.yml
└── README.md
```
