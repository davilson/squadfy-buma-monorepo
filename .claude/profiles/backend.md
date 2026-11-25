# Perfil: Backend Engineer

Domínio: APIs, serviços, banco de dados, mensageria, infraestrutura, segurança, multi-tenancy.
Fronteira: `.claude/profiles/README.md` — **bloqueio rígido, sem override.**

Modos: STRATEGY (Epic | Modify | Ideia) · EXECUTION (Implementar Tarefa | Bug | Task de Plataforma)

## Agentes

| Pasta | Agentes |
|---|---|
| `backend/` | `backend-architect` (arquitetura de serviços) · `backend-python-specialist` (Python) · `database-architect` (schema, migrations, RLS) · `multi-tenant-isolation-specialist` (isolamento de tenant) · `docker-orchestrator` (containers) · `observability-engineer` (logs, métricas, alertas) · `surrealdb-integration-expert` (só em projetos SurrealDB) · `zenstack-implementation-lead` (só em projetos ZenStack) |
| `qa/` | `code-reviewer` · `test-planner` · `test-engineer` · `adr-compliance-checker` |
| `docs/` | `documentation-specialist` · `branch-documentation-writer` |
| `shared/` | `fullstack-debugger` · `master-docs-gate-keeper` |

Não invocar `frontend/` `design/` `product/` `integrations/`.

## Nunca escreve

Componentes, telas, estilos ou qualquer arquivo de UI · `docs/design-context/` · `docs/.cortex/sessions/*/design/`

Tarefa que inclui tela: implemente a camada de dados/API e devolva o contrato. A UI é do perfil `frontend`.
