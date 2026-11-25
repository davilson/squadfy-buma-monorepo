---
description: Analisa projeto existente e gera bootstrap para build-tech e build-business
---

# Cortex · From Code

> Varra o codebase existente com profundidade máxima e gera `docs/technical-context/briefing/codebase-analysis.md` — um documento estruturado e minucioso que serve de pré-contexto para `/docs-commands:build-tech-docs` e `/docs-commands:build-business-docs`.
>
> **Este comando não gera documentação final.** Ele alimenta os outros comandos para que as entrevistas sejam curtas e os docs gerados sejam específicos do projeto, não genéricos.
>
> **Princípio:** prefira ler demais a ler de menos. Quanto mais código lido, melhor o output.

---

## QUANDO USAR

- Projeto já existe com código, mas `docs/` está vazio ou ausente
- Antes de rodar `/docs-commands:build-tech-docs` ou `/docs-commands:build-business-docs` em um projeto existente
- Quando você quer que a documentação reflita o que está no código, não só o que você descreve

---

## FASE 1 — MAPEAMENTO INICIAL (silenciosa)

Execute silenciosamente. Não pergunte nada ao usuário nesta fase.

### 1.1 — Estrutura raiz

Liste todos os arquivos e pastas da raiz (profundidade 2). Identifique:

- **Nome do projeto**: leia de `package.json` (campo `name`), `pyproject.toml`, `Cargo.toml` (`[package] name`), `go.mod` (module path), `pom.xml` (`<artifactId>`), ou use o nome da pasta raiz como fallback
- **Versão**: leia do mesmo arquivo de manifesto acima
- **Descrição**: campo `description` do manifesto ou primeira linha do README
- **Tipo de repositório**: monorepo | aplicação única | biblioteca | CLI | plugin | outro
- **Plataformas detectadas**: web | mobile | desktop | API | CLI | biblioteca
- **Pastas principais**: liste todas as pastas encontradas na raiz e em 2 níveis

### 1.2 — Análise do README

Leia `README.md` (raiz) se existir. Extraia:

- Propósito do projeto em 2–3 frases
- Instruções de instalação e setup
- Comandos de desenvolvimento (`npm run dev`, `make`, `cargo run`, etc.)
- Links relevantes: documentação, demo, staging, produção
- Pré-requisitos: versões de runtime, ferramentas necessárias
- Badges: CI status, cobertura, versão publicada

Se não existir: registre como ausente e continue.

### 1.3 — Detectar monorepo

Verifique presença de:
- `apps/`, `packages/`, `libs/`, `services/`, `modules/`
- `pnpm-workspace.yaml`, `yarn.workspaces`, `nx.json`, `lerna.json`, `turbo.json`, `rush.json`
- `Cargo.toml` com `[workspace]`, `go.work`, `pyproject.toml` com `[tool.poetry.packages]`

Se monorepo: liste cada workspace/package individualmente. Para cada um, execute a análise das próximas seções independentemente.

---

## FASE 2 — STACK TECNOLÓGICA (profunda)

### 2.1 — Dependências (ler todos os arquivos de manifesto)

**Node.js / JavaScript / TypeScript:**
Leia `package.json` (e cada `apps/*/package.json`, `packages/*/package.json` se monorepo):
- `dependencies`, `devDependencies`, `peerDependencies`
- Scripts: `scripts` — anote todos os scripts definidos
- Engines: `engines.node`, `engines.npm`
- Workspaces
- Classifique cada dependência por camada: framework, UI, estado, banco, ORM, auth, testes, build, lint, tipos, utilitários

**Python:**
Leia `pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `requirements-dev.txt`, `Pipfile`:
- Separe dependências de produção e dev
- Versões mínimas exigidas
- Extras e grupos

**Rust:** Leia `Cargo.toml` — features habilitadas, workspace members, build scripts
**Go:** Leia `go.mod`, `go.sum` — módulos diretos vs. indiretos
**Java/Kotlin:** Leia `pom.xml` ou `build.gradle` / `build.gradle.kts` — dependências, plugins, profiles
**Ruby:** Leia `Gemfile`, `Gemfile.lock`
**PHP:** Leia `composer.json`

Para **qualquer linguagem**: leia `.nvmrc`, `.node-version`, `.python-version`, `.ruby-version`, `.tool-versions` (asdf) para versões exatas de runtime.

### 2.2 — Variáveis de ambiente

Leia **todos** os arquivos de configuração de ambiente encontrados:
- `.env.example`, `.env.template`, `.env.sample`, `.env.local.example`
- `wrangler.toml` (Cloudflare)
- `app.config.js`, `config/` se existir

Para cada variável encontrada, registre:
- Nome da chave
- Valor de exemplo (se não for secret)
- Categoria inferida: database | auth | api_key | feature_flag | url | storage | email | payment | infra

**Não registre valores reais de secrets.**

### 2.3 — Configurações de build e toolchain

Leia os arquivos abaixo se existirem:
- `tsconfig.json` / `tsconfig.*.json` — `compilerOptions`, `paths`, `baseUrl`, `strict`
- `vite.config.ts`, `webpack.config.js`, `rollup.config.js`, `esbuild.config.js`
- `next.config.js`, `nuxt.config.ts`, `remix.config.js`, `astro.config.mjs`
- `tailwind.config.ts`, `postcss.config.js`
- `eslint.config.js`, `.eslintrc.*`, `.prettierrc`
- `jest.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `cypress.config.ts`
- `Makefile` — liste todos os targets com suas descrições
- `justfile` — liste recipes
- `nx.json`, `turbo.json` — pipelines de build

---

## FASE 3 — ARQUITETURA BACKEND

### 3.1 — Estrutura de pastas backend

Mapeie a estrutura de pastas do backend com profundidade máxima. Para cada pasta, infira o propósito:

```
Padrões a identificar:
  controllers/ routes/     → HTTP handlers
  services/                → lógica de negócio
  repositories/ dal/       → acesso a dados
  models/ entities/        → modelos de domínio
  middlewares/             → interceptadores de request
  schemas/ dtos/           → validação e contratos
  guards/ policies/        → autorização
  decorators/              → metaprogramação
  pipes/ filters/          → transformação e erros
  events/ listeners/       → arquitetura orientada a eventos
  jobs/ queues/ workers/   → processamento assíncrono
  cache/                   → estratégia de cache
  config/                  → configuração da aplicação
  shared/ common/ core/    → código compartilhado
  utils/ helpers/          → utilitários
  types/ interfaces/       → contratos TypeScript/Go/etc
  constants/               → valores constantes
  migrations/              → migrações de banco
  seeds/ fixtures/         → dados de seed
  tests/ __tests__/ spec/  → testes
```

### 3.2 — Padrão arquitetural

Leia 5–10 arquivos de cada pasta principal. Identifique:

**Padrão predominante:**
- MVC (Model-View-Controller)
- Clean Architecture / Hexagonal (entities → use cases → adapters → frameworks)
- Layered Architecture (presentation → business → data)
- CQRS (Commands separados de Queries)
- Event-Driven (eventos como cidadãos de primeira classe)
- Microservices (serviços independentes por domínio)
- Serverless (functions sem estado)
- Modular Monolith (módulos bem delimitados em um monolito)

**Evidências que confirmam o padrão:**
- Nomenclatura de classes e arquivos
- Como os módulos se importam entre si
- Onde fica a lógica de negócio
- Como o banco é acessado

### 3.3 — Convenções do projeto

Leia arquivos suficientes para identificar:

- **Nomenclatura de arquivos**: `kebab-case` | `camelCase` | `PascalCase` | `snake_case`
- **Sufixos**: `.service.ts`, `.controller.ts`, `.repository.ts`, `.handler.go`, `_service.py`, etc.
- **Prefixos**: `I` para interfaces, `Abstract` para classes base, etc.
- **Estrutura de módulo**: um arquivo por classe? barrels (`index.ts`)? co-location de testes?
- **Imports**: paths absolutos (`@/`) ou relativos (`../../`)? barrel exports?
- **Linting**: regras customizadas relevantes no ESLint/Pylint/etc.

---

## FASE 4 — ENTIDADES DE DOMÍNIO (exaustiva)

Leia **todos** os arquivos de modelos, schemas, entities, types e DTOs encontrados.

### 4.1 — Localizar entidades

Procure em:
- `*.model.ts`, `*.entity.ts`, `*.schema.ts`, `*.type.ts`, `*.interface.ts`
- `models/`, `entities/`, `domain/`, `types/`, `interfaces/`
- Decoradores ORM: `@Entity()` (TypeORM), `@Schema()` (Mongoose), `model(` (Sequelize), `table(` (Objection)
- Python: `class * (BaseModel)` (Pydantic), `class * (Model)` (Django/SQLAlchemy), `@dataclass`
- Go: `type * struct` com tags `json:` ou `db:`
- Rust: `struct` com `#[derive(Serialize, Deserialize)]`
- Java/Kotlin: `@Entity`, `@Table`, classes com `@Column`
- Prisma: `model` no `schema.prisma`
- Drizzle: `pgTable(`, `mysqlTable(`, `sqliteTable(`

### 4.2 — Para cada entidade, registre

- Nome da entidade
- Todos os campos com seus tipos
- Campos obrigatórios vs. opcionais
- Valores default
- Validações declaradas (min, max, regex, enum values)
- Relacionamentos: `hasMany`, `belongsTo`, `ManyToMany`, foreign keys
- Índices e constraints
- Soft delete? (`deletedAt`, `isDeleted`)
- Timestamps automáticos? (`createdAt`, `updatedAt`)
- O que representa no negócio (inferir do nome e campos)

### 4.3 — Mapa de relacionamentos

Com base nas entidades encontradas, construa o mapa de relacionamentos:

```
User 1:N Orders
Order N:N Products (via OrderItems)
Product N:1 Category
User N:N Roles (via UserRoles)
```

---

## FASE 5 — APIs E ENDPOINTS (exaustiva)

### 5.1 — Localizar definições de rota

Procure por todos os padrões de definição de rota:

**Express/Fastify/Hono:**
```
router.get(  router.post(  router.put(  router.patch(  router.delete(
app.get(  app.post(  app.route(
```

**NestJS:**
```
@Controller(  @Get(  @Post(  @Put(  @Patch(  @Delete(  @All(
```

**FastAPI/Flask:**
```
@app.get(  @app.post(  @router.get(  @router.post(
```

**Django:**
```
urlpatterns  path(  re_path(  include(
```

**Rails:** `routes.rb` — `resources :`, `get '`, `post '`

**Go (gin/echo/chi/mux):**
```
r.GET(  r.POST(  router.Handle(  http.HandleFunc(
```

**tRPC:** `router(`, `procedure.`, `publicProcedure.`, `protectedProcedure.`

**GraphQL:** leia os schemas `.graphql` ou definições de resolvers

### 5.2 — Para cada endpoint, registre

- Método HTTP + path completo (incluindo prefixos do controller)
- Parâmetros de path (`:id`, `{id}`)
- Query params inferidos (dos DTOs ou da lógica)
- Body: DTO/schema utilizado
- Guards/middlewares aplicados (autenticação, roles, rate limiting)
- Descrição inferida do que faz

### 5.3 — Agrupar por domínio

Agrupe os endpoints por recurso/domínio:

```
Auth:      POST /auth/login, POST /auth/register, POST /auth/refresh
Users:     GET /users, GET /users/:id, PUT /users/:id, DELETE /users/:id
Products:  GET /products, POST /products, GET /products/:id
...
```

---

## FASE 6 — AUTENTICAÇÃO E AUTORIZAÇÃO

### 6.1 — Estratégia de autenticação

Procure por:
- JWT: `jsonwebtoken`, `jose`, `jwt.sign(`, `jwt.verify(`, `JwtStrategy`, `@UseGuards(JwtAuthGuard)`
- Sessions: `express-session`, `connect-redis`, `cookie-parser`
- OAuth/OIDC: `passport`, `next-auth`, `auth.js`, `@auth/`
- API Keys: headers customizados, `x-api-key`
- Basic Auth
- Magic Links / OTP
- Biometria (mobile)

Registre: **como o token é gerado, onde é armazenado (cookie/header/localStorage), como é validado**

### 6.2 — Autorização

Procure por:
- RBAC (Role-Based): `@Roles(`, `RolesGuard`, `UserRole` enum, tabela `roles`
- ABAC (Attribute-Based): policies, `ability`, `casl`
- Permissões granulares: tabela `permissions`, `scopes`
- Multi-tenancy: `tenantId` em entidades, `RLS`, tenant middleware

Registre: **como as permissões são estruturadas e verificadas**

---

## FASE 7 — BANCO DE DADOS E PERSISTÊNCIA

### 7.1 — Configuração do banco

Identifique:
- Tipo: PostgreSQL | MySQL | SQLite | MongoDB | DynamoDB | Supabase | PlanetScale | Neon | Turso | Redis | outro
- ORM/ODM: Prisma | TypeORM | Drizzle | Sequelize | Mongoose | SQLAlchemy | GORM | Ecto | ActiveRecord
- Migrations: pasta `migrations/`, comandos no `package.json`, sistema de versionamento
- Seeds: pasta `seeds/` ou `prisma/seed.ts`
- Conexão: pool size, timeouts, replicas configuradas

### 7.2 — Schema do banco

Se Prisma: leia `prisma/schema.prisma` completo — todos os models, enums, relations
Se TypeORM: leia as entities
Se Drizzle: leia os arquivos de schema
Se Django: leia os models
Se SQLAlchemy: leia as classes de modelo

Liste todas as tabelas/collections e seus campos.

### 7.3 — Estratégias de otimização detectadas

- Índices definidos além da PK
- Soft delete implementado
- Cache configurado (Redis, in-memory)
- Paginação: cursor-based ou offset-based
- Full-text search: pgvector, Elastic, Meilisearch

---

## FASE 8 — FRONTEND (se existir)

Procure por pastas: `frontend/`, `web/`, `client/`, `apps/web/`, `apps/frontend/`, `src/app/` (Next.js)

### 8.1 — Estrutura e framework

- Framework: Next.js | Remix | Nuxt | SvelteKit | Angular | Vue | React SPA | Astro | outro
- Versão do framework
- App Router vs Pages Router (Next.js)
- SSR | SSG | CSR | ISR — estratégia de renderização

### 8.2 — Organização de componentes

Mapeie a estrutura de pastas do frontend:
- `components/` — componentes genéricos vs. feature-specific
- `pages/` ou `app/` — estrutura de rotas
- `layouts/` — layouts reutilizáveis
- `hooks/` — custom hooks
- `stores/` ou `context/` — estado global
- `lib/` ou `utils/` — utilitários do cliente
- `api/` ou `services/` — camada de comunicação com backend
- `types/` — tipos do frontend

### 8.3 — Design system e estilo

- UI Library: shadcn/ui | MUI | Chakra | Mantine | Ant Design | Radix | DaisyUI | PrimeReact
- CSS: Tailwind | CSS Modules | Styled Components | Emotion | vanilla CSS | SASS
- Tema: variáveis CSS? modo dark? design tokens?
- Ícones: Lucide | Heroicons | Phosphor | FontAwesome | customizados

### 8.4 — Estado e data fetching

- Estado global: Zustand | Jotai | Redux Toolkit | Context API | Pinia | Signals | Recoil
- Data fetching: TanStack Query | SWR | Apollo | TRPC | fetch nativo | Axios
- Forms: React Hook Form | Formik | Zod | Valibot

### 8.5 — Roteamento

- Sistema: Next.js App Router | React Router | TanStack Router | Vue Router
- Rotas protegidas: como são implementadas
- Middleware de rota: next.config, `middleware.ts`

---

## FASE 9 — MOBILE (se existir)

Procure por: `mobile/`, `apps/mobile/`, `ios/`, `android/`, `app.json` (Expo), `*.xcodeproj`, `AndroidManifest.xml`

### 9.1 — Framework e plataforma

- Framework: React Native | Flutter | Expo | Capacitor | Swift (nativo) | Kotlin (nativo)
- Plataformas: iOS | Android | ambos
- Versão mínima de OS (se encontrada)
- Expo managed vs. bare workflow

### 9.2 — Navegação e estado

- Navegação: React Navigation | Expo Router | Go Router (Flutter)
- Estado: mesmos padrões do frontend ou específico mobile
- Armazenamento local: AsyncStorage | MMKV | SQLite | Hive

### 9.3 — Integrações nativas

Procure por permissões no `app.json`, `Info.plist`, `AndroidManifest.xml`:
- Câmera, localização, notificações push, biometria, NFC, Bluetooth, contatos, etc.

---

## FASE 10 — TESTES

### 10.1 — Estrutura de testes

Procure por: `tests/`, `__tests__/`, `spec/`, `*.test.ts`, `*.spec.ts`, `*_test.go`, `test_*.py`, `*.test.tsx`

Para cada tipo de teste encontrado:
- Framework utilizado
- Onde os testes estão (co-located? pasta separada?)
- Quantidade aproximada de arquivos de teste

### 10.2 — Tipos de teste presentes

- **Unitários**: testam funções/classes isoladas. Evidência: mocks frequentes, testes de services
- **Integração**: testam módulos juntos. Evidência: banco real, containers
- **E2E**: testam fluxos completos. Evidência: Playwright, Cypress, Detox
- **Contract**: testam contratos de API. Evidência: Pact, schema validation
- **Visual**: capturam screenshots. Evidência: Storybook, Percy, Chromatic

### 10.3 — Cobertura e qualidade

- Configuração de coverage threshold (se definida)
- Presença de `coverage/` ou `.nyc_output` (indica que coverage já foi gerado)
- CI gate de cobertura (se encontrado no pipeline)

---

## FASE 11 — CI/CD E INFRAESTRUTURA

### 11.1 — Pipelines de CI/CD

Leia todos os arquivos de workflow encontrados:
- `.github/workflows/*.yml` — GitHub Actions
- `.gitlab-ci.yml` — GitLab CI
- `Jenkinsfile`
- `.circleci/config.yml`
- `bitbucket-pipelines.yml`
- `.travis.yml`

Para cada pipeline, extraia:
- Triggers (push, PR, schedule, manual)
- Jobs e suas etapas
- Ambientes (staging, production)
- Secrets usados (nomes, não valores)
- Deploy automatizado: sim | não | condicional

### 11.2 — Containerização

Leia se existirem:
- `Dockerfile` — base image, stages (multi-stage?), portas expostas, CMD/ENTRYPOINT
- `docker-compose.yml` / `docker-compose.dev.yml` — todos os serviços, volumes, networks, portas
- `.dockerignore`

### 11.3 — IaC e Cloud

Procure por:
- `terraform/` — providers, módulos usados, workspaces
- `pulumi/` — linguagem, stack
- `cdk/` — constructs usados
- `k8s/` ou `helm/` — namespaces, deployments, services, ingress, HPA
- `serverless.yml` ou `serverless/` — funções, eventos, layers
- `vercel.json` — rewrites, headers, regions
- `netlify.toml`
- `fly.toml` (Fly.io)
- `railway.toml`
- `render.yaml`
- `wrangler.toml` (Cloudflare Workers)

Registre: **qual cloud/plataforma de deploy é o alvo** e quais serviços são usados (Lambda, RDS, S3, etc.)

---

## FASE 12 — INTEGRAÇÕES EXTERNAS

Procure em todo o código por clients, SDKs e chamadas a serviços externos:

### 12.1 — Pagamentos
`stripe`, `braintree`, `paypal`, `mercadopago`, `pagarme`, `iugu`, `asaas`

### 12.2 — Email e comunicação
`sendgrid`, `resend`, `nodemailer`, `ses`, `mailgun`, `postmark`, `twilio`, `vonage`

### 12.3 — Storage
`aws-sdk` (S3), `@google-cloud/storage`, `cloudinary`, `uploadthing`, `minio`

### 12.4 — Analytics e monitoramento
`sentry`, `datadog`, `newrelic`, `posthog`, `amplitude`, `mixpanel`, `segment`, `opentelemetry`

### 12.5 — IA e ML
`openai`, `anthropic`, `langchain`, `huggingface`, `replicate`, `vercel/ai`

### 12.6 — Search
`elasticsearch`, `typesense`, `meilisearch`, `algolia`, `pg_trgm`, `pgvector`

### 12.7 — Queue e eventos
`bull`, `bullmq`, `rabbitmq`, `kafka`, `sqs`, `nats`, `redis` (pub/sub)

### 12.8 — Outros
Quaisquer outros clientes de API detectados (webhooks, third-party APIs, etc.)

---

## FASE 13 — REGRAS DE NEGÓCIO IMPLÍCITAS

Com base em tudo que foi lido, infira as regras de negócio sem perguntar ao usuário:

### 13.1 — Validações de domínio

Leia schemas/DTOs e extraia as regras:
- Campos obrigatórios vs. opcionais
- Formatos (email, CPF, CNPJ, CEP, telefone, UUID)
- Limites (min/max de caracteres, valores numéricos)
- Enums — liste todos os valores possíveis e o que representam

### 13.2 — Estados e transições

Procure por enums de status, state machines:
```
OrderStatus: PENDING → CONFIRMED → SHIPPED → DELIVERED | CANCELLED
UserStatus: INACTIVE → ACTIVE → SUSPENDED | DELETED
PaymentStatus: PENDING → PROCESSING → PAID | FAILED | REFUNDED
```

### 13.3 — Lógica de negócio em serviços

Leia os services/use-cases e identifique:
- Condicionais que representam regras de negócio (`if user.plan === 'free' && count >= 5`)
- Cálculos (preços, comissões, descontos, impostos)
- Fluxos de aprovação
- Limites e quotas
- Permissões especiais por tipo de usuário

### 13.4 — Tipo de produto inferido

Com base em todas as entidades, endpoints e integrações, classifique:
- **SaaS** — tem `subscription`, `plan`, `billing`, multi-tenant
- **E-commerce** — tem `product`, `order`, `cart`, `checkout`, `payment`
- **Marketplace** — tem compradores e vendedores, `listing`, comissão
- **Ferramenta interna** — sem billing público, usuários limitados
- **API/SDK pública** — documentação de API, API keys para clientes
- **App mobile** — foco em mobile com backend de suporte
- **Plataforma de conteúdo** — posts, feeds, comentários, likes
- **Outro** — descreva

---

## FASE 14 — GERAR CODEBASE-ANALYSIS.MD

Crie a pasta `docs/technical-context/briefing/` se não existir e salve em `docs/technical-context/briefing/codebase-analysis.md`.

Use o template abaixo. Preencha tudo que foi encontrado. Use `não detectado` apenas quando realmente não encontrou nada — nunca deixe seção vazia sem investigar. **Nunca invente informações.**

```markdown
---
gerado_por: /docs-commands:from-code
gerado_em: {YYYY-MM-DD}
versao: 1.0.0
---

# Análise do Codebase — {nome do projeto}

> Documento gerado automaticamente por varredura profunda do código.
> Serve como pré-contexto para /docs-commands:build-tech-docs e /docs-commands:build-business-docs.
> NÃO é documentação final — é insumo para os comandos de documentação.

---

## Identificação

| Campo | Valor |
|---|---|
| Nome | {nome} |
| Versão | {versão ou "não encontrada"} |
| Tipo de repositório | {monorepo \| aplicação única \| biblioteca \| CLI} |
| Plataformas | {web \| mobile \| API \| CLI \| desktop} |
| Tipo de produto inferido | {SaaS \| E-commerce \| Marketplace \| Ferramenta interna \| API \| outro} |
| README presente | {sim \| não} |

**Descrição (do README ou manifesto):**
> {descrição do projeto}

---

## Stack Detectada

### Runtime e Linguagem
| Campo | Valor |
|---|---|
| Linguagem principal | {linguagem + versão} |
| Runtime | {Node.js vX.X \| Python X.X \| Go X.X \| etc} |
| Package manager | {npm \| pnpm \| yarn \| pip \| cargo \| etc} |

### Backend
| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | {framework} | {versão} |
| Banco de dados | {banco} | {versão se encontrada} |
| ORM / Query Builder | {ORM} | {versão} |
| Validação | {biblioteca} | {versão} |
| Autenticação | {estratégia + biblioteca} | {versão} |
| Cache | {Redis \| in-memory \| não detectado} | {versão} |
| Queue | {Bull \| BullMQ \| RabbitMQ \| não detectado} | {versão} |
| Testes | {framework(s)} | {versão} |

### Frontend (se existir)
| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | {Next.js \| React \| Vue \| etc} | {versão} |
| Renderização | {SSR \| SSG \| CSR \| ISR} | — |
| UI Library | {shadcn \| MUI \| Tailwind \| etc} | {versão} |
| Estado global | {Zustand \| Redux \| Context \| etc} | {versão} |
| Data fetching | {TanStack Query \| SWR \| etc} | {versão} |
| Forms | {React Hook Form \| Formik \| etc} | {versão} |
| Roteamento | {React Router \| App Router \| etc} | {versão} |

### Mobile (se existir)
| Campo | Valor |
|---|---|
| Framework | {React Native \| Flutter \| Expo \| nativo} |
| Plataformas | {iOS \| Android \| ambos} |
| Navegação | {React Navigation \| Expo Router \| etc} |
| Armazenamento local | {AsyncStorage \| MMKV \| SQLite} |

### Infra / Deploy
| Campo | Valor |
|---|---|
| Containerização | {Docker \| não detectado} |
| Orquestração | {Kubernetes \| Docker Compose \| não detectado} |
| CI/CD | {GitHub Actions \| GitLab CI \| etc} |
| IaC | {Terraform \| CDK \| não detectado} |
| Cloud / Plataforma | {AWS \| GCP \| Vercel \| Railway \| Fly.io \| etc} |
| Serviços cloud identificados | {S3 \| RDS \| Lambda \| etc} |

---

## Arquitetura

**Padrão identificado:** {MVC \| Clean Architecture \| Hexagonal \| CQRS \| Microservices \| Modular Monolith \| Serverless \| não identificado}

**Evidências que confirmam:**
- {evidência 1 — ex: "Services não importam diretamente o ORM, usam Repository"}
- {evidência 2}

**Estrutura de pastas:**
```
{árvore ASCII das pastas principais — pelo menos 3 níveis}
```

**Convenções detectadas:**
- Nomenclatura de arquivos: {padrão}
- Sufixos usados: {.service.ts, .controller.ts, etc}
- Co-location de testes: {sim \| não}
- Barrel exports (index.ts): {sim \| não}
- Path aliases: {`@/` → `src/` \| não detectado}

---

## Entidades de Domínio

### Mapa de Relacionamentos

```
{diagrama ASCII dos relacionamentos entre entidades}
```

### Detalhamento das Entidades

{para cada entidade encontrada}

#### {NomeDaEntidade}
> {o que representa no negócio}

| Campo | Tipo | Obrigatório | Default | Validações |
|---|---|---|---|---|
| {campo} | {tipo} | {sim/não} | {valor ou —} | {regras} |

**Relacionamentos:** {lista de relacionamentos com outras entidades}
**Soft delete:** {sim/não}
**Timestamps:** {sim/não}

---

## APIs e Endpoints

{agrupados por domínio/recurso}

### {Recurso}

| Método | Path | Auth | Body/Params | Descrição |
|---|---|---|---|---|
| GET | /resource | {JWT \| API Key \| público} | `?page=&limit=` | {descrição} |
| POST | /resource | {JWT} | `CreateResourceDto` | {descrição} |

---

## Autenticação e Autorização

**Estratégia:** {JWT \| Session \| OAuth \| API Key \| Magic Link \| etc}
**Biblioteca:** {passport \| jose \| next-auth \| etc}
**Armazenamento do token:** {cookie HTTP-only \| localStorage \| header Bearer}
**Refresh token:** {sim \| não}
**Expiração:** {tempo se encontrado}

**Autorização:**
- Modelo: {RBAC \| ABAC \| Permissões granulares}
- Roles encontrados: {lista de valores do enum de roles}
- Multi-tenancy: {sim — como? \| não}

---

## Banco de Dados

**SGBD:** {PostgreSQL \| MySQL \| SQLite \| MongoDB \| etc}
**ORM:** {Prisma \| TypeORM \| Drizzle \| etc}
**Migrations:** {sim — pasta: {caminho} \| não detectado}
**Seeds:** {sim — arquivo: {caminho} \| não detectado}

**Tabelas/Collections identificadas:**
{lista de todas as tabelas com descrição em 1 linha}

**Otimizações detectadas:**
- Índices extras: {sim \| não detectado}
- Cache de queries: {sim — Redis \| não detectado}
- Paginação: {cursor-based \| offset \| não detectado}
- Full-text search: {sim — {engine} \| não detectado}

---

## Integrações Externas

| Serviço | Categoria | Biblioteca/SDK | Finalidade inferida |
|---|---|---|---|
| {Stripe} | Pagamento | `stripe` | {processar cobranças} |
| {SendGrid} | Email | `@sendgrid/mail` | {emails transacionais} |

---

## Testes

| Tipo | Framework | Localização | Qtd. aprox. de arquivos |
|---|---|---|---|
| Unitários | {jest \| vitest \| pytest} | {co-located \| tests/} | {N} |
| Integração | {jest \| pytest} | {tests/integration/} | {N} |
| E2E | {playwright \| cypress} | {e2e/ \| tests/e2e/} | {N} |

**Coverage threshold configurado:** {X% \| não encontrado}

---

## CI/CD

{para cada pipeline encontrado}

**{nome do arquivo}:**
- Triggers: {push main, PR, schedule}
- Etapas: {lint → test → build → deploy}
- Ambientes: {staging, production}
- Deploy automático: {sim — quando? \| não}

---

## Variáveis de Ambiente

| Variável | Categoria | Descrição inferida |
|---|---|---|
| `DATABASE_URL` | database | URL de conexão com o banco |
| `JWT_SECRET` | auth | Chave para assinar tokens JWT |
| `STRIPE_SECRET_KEY` | payment | Chave secreta da API do Stripe |

---

## Funcionalidades Identificadas no Código

{lista de funcionalidades inferidas das entidades, rotas e serviços}

- **{Funcionalidade}** — evidência: {arquivos/entidades/rotas que a confirmam}

---

## Regras de Negócio Implícitas

{lista de regras inferidas de validações, condições, enums e lógica de services}

- **{Regra}** — fonte: {arquivo:linha ou schema:campo}

---

## Estados e Transições Detectados

{para cada enum de status/state encontrado}

**{NomeDoEnum}:**
```
{ESTADO_A} → {ESTADO_B} → {ESTADO_C}
              ↓
           {ESTADO_CANCELADO}
```

---

## Decisões Técnicas Aparentes (futuras ADRs)

{lista de decisões que claramente foram tomadas — com evidência no código}

- **{Decisão}** — evidência: {arquivo ou padrão que confirma}

---

## Lacunas Identificadas

> O que não foi possível inferir do código e precisará ser respondido nas entrevistas.

- [ ] {lacuna 1 — ex: "Objetivo de negócio e público-alvo não identificáveis pelo código"}
- [ ] {lacuna 2 — ex: "Estratégia de precificação não encontrada no código"}
- [ ] {lacuna 3}

---

## Para uso por /docs-commands:build-tech-docs

**Perguntas que NÃO precisam ser feitas (já respondidas):**
- Stack tecnológica: {resumo}
- Padrão arquitetural: {resumo}
- Entidades de domínio: {N entidades mapeadas}
- Endpoints: {N endpoints em N recursos}
- Autenticação: {estratégia}
- Banco: {SGBD + ORM}

**Perguntas que AINDA devem ser feitas:**
- {questões que o código não responde}

---

## Para uso por /docs-commands:build-business-docs

**Inferências disponíveis:**
- Tipo de produto: {tipo}
- Funcionalidades identificadas: {lista resumida}
- Integrações de negócio: {pagamentos, email, etc.}
- Estados e fluxos de domínio: {enums de status encontrados}

**Informações que NÃO podem ser inferidas do código (obrigatório perguntar):**
- Visão, missão e objetivos estratégicos
- Público-alvo e personas reais
- Contexto competitivo e diferenciação
- Métricas de sucesso definidas pelo negócio
- Roadmap e prioridades
- Modelo de negócio e monetização
```

---

## FASE 15 — APRESENTAR RESULTADO

Após salvar o arquivo, exiba:

```
✅ Análise profunda do codebase concluída!

Arquivo gerado: docs/technical-context/briefing/codebase-analysis.md

📊 Resumo do que foi encontrado:
  Projeto:      {nome} v{versão}
  Tipo:         {tipo de produto}
  Stack:        {resumo em 1 linha}
  Arquitetura:  {padrão detectado}
  Entidades:    {N} entidades de domínio mapeadas
  Endpoints:    {N} endpoints em {N} recursos
  Integrações:  {lista resumida}
  Testes:       {tipos presentes}
  CI/CD:        {plataforma ou "não detectado"}

📋 Lacunas (precisarão ser respondidas nas entrevistas):
  {lista das lacunas identificadas}

🚀 Próximos passos recomendados:

  /docs-commands:build-business-docs  → documentação de negócio
                                        (entrevista focada no que o código não revela)

  /docs-commands:build-tech-docs      → documentação técnica
                                        (entrevista pré-preenchida com os dados acima)

  /docs-commands:init                 → menu completo de documentação
```

**Pare aqui.** Não execute nenhum outro comando automaticamente.

---

## REGRAS

| Regra | Descrição |
|---|---|
| **Leia tudo** | Prefira ler demais a ler de menos — quanto mais código lido, melhor o output |
| **Nunca invente** | Se não encontrou, registre "não detectado" — nunca assuma |
| **Não pergunte** | Toda a Fase 1–13 é 100% autônoma |
| **Não gere docs finais** | A saída é APENAS `codebase-analysis.md` |
| **Lacunas são valiosas** | Identificar o que falta é tão importante quanto o que foi encontrado |
| **Pare no final** | Não encadeie outros comandos automaticamente |
| **Profundidade > Velocidade** | Leia arquivos representativos de cada pasta, não apenas 1 ou 2 |
