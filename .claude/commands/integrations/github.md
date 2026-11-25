# Integração GitHub Issues

Gerencia a integração completa com GitHub Issues: configuração de credenciais e sincronização de features com issues e milestones.

> Credenciais salvas em `.claude/.env` (gitignored). Nunca commitadas.
> Funciona também via `gh auth login` ou MCP GitHub sem configuração extra.

---

## Subcomandos

```
/integrations:github setup    — Configurar credenciais GitHub
/integrations:github sync     — Sincronizar features com GitHub Issues
/integrations:github preview  — Ver diff sem fazer alterações
```

Sem argumento: detectar estado atual e sugerir próximo passo.

---

## Setup — Configurar Credenciais

Invocar agente `@integrations/github-issues-sync` no modo setup.

**Fontes de credencial (por prioridade):**
1. `.claude/.env` — configurado via setup
2. Variáveis de ambiente (`$GITHUB_TOKEN`)
3. `gh auth token` — se `gh` CLI estiver autenticado
4. MCP GitHub tools — fallback final (sem token necessário)

Campos configurados:
```
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=meu-usuario
GITHUB_REPO=meu-repositorio
```

---

## Sync — Sincronizar Features

Invocar agente `@integrations/github-issues-sync`.

Lê `docs/business-context/features/`, compara com issues no repositório,
e cria/atualiza issues e milestones.

**Pré-requisito:** credenciais configuradas ou `gh auth login`.

Modos disponíveis:
- **Completo** — todos os módulos
- **Por Módulo** — módulo específico
- **Por Escopo** — ex: MVP, Fase 2
- **Preview** — só relatório, sem alterações

Sempre exibe preview e pede confirmação antes de executar operações.

**Mapeamentos automáticos:**

| Doc Status | GitHub State | Label |
|-----------|-------------|-------|
| Backlog | open | `status:backlog` |
| Em Desenvolvimento | open | `status:in-progress` |
| Concluída | closed | — |

| Doc Prioridade | GitHub Label |
|---------------|-------------|
| Crítica | `priority:critical` |
| Alta | `priority:high` |
| Média | `priority:medium` |

Cada módulo nos docs gera um Milestone no GitHub com o mesmo nome.

**Regras de segurança:**
- Nunca executar sem aprovação do usuário
- Não duplicar — verificar marker `<!-- cortex-feature -->` antes de criar
- Não reabrir issues fechadas automaticamente
- Rate limiting: 200ms entre chamadas API
- Token somente em `.claude/.env` — nunca em arquivos versionados
