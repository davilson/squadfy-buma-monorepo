# Integração Linear

Gerencia a integração completa com Linear: configuração de credenciais, criação de tasks e sincronização de features com épicos e sub-issues.

> Credenciais salvas em `.claude/.env` (gitignored). Nunca commitadas.

---

## Subcomandos

```
/integrations:linear setup    — Configurar credenciais Linear
/integrations:linear scaffold — Criar issue principal + subtasks por disciplina para uma session
/integrations:linear sync     — Sincronizar features com o Linear
/integrations:linear task     — Criar issue no Linear a partir de descrição
/integrations:linear preview  — Ver diff sem fazer alterações
```

Sem argumento: detectar estado atual e sugerir próximo passo.

---

## Setup — Configurar Credenciais

Invocar agente `@integrations/linear-config-setup`.

| Campo | Onde obter | Armazenamento |
|-------|-----------|---------------|
| `LINEAR_API_KEY` | [linear.app/settings/api](https://linear.app/settings/api) | `.claude/.env` |
| `LINEAR_ORG_SLUG` | URL do Linear (`linear.app/<slug>/...`) | `.claude/.env` + `tech-stack.md` |
| `LINEAR_TEAM_ID` | Listado via API | `.claude/.env` + `tech-stack.md` |
| `LINEAR_PROJECT_ID` | Listado via API | `.claude/.env` + `tech-stack.md` |

Fluxo:
1. Verificar se `.claude/.env` já tem configuração Linear
2. Guiar obtenção da API Key
3. Validar via API antes de salvar
4. Listar times e projetos para seleção
5. Salvar em `.claude/.env`
6. Confirmar que sync está pronto

---

## Scaffold — Criar Estrutura de Rastreamento por Disciplina

Cria uma issue principal + subtasks por disciplina para uma session do Cortex.
Chamado automaticamente pelo Strategy Mode após GATE 2, mas pode ser executado manualmente.

**Uso:**
```
/integrations:linear scaffold --slug <slug>
```

**Pré-requisito:** credenciais configuradas via `setup`.

**Sequência:**

1. Ler `docs/.cortex/sessions/<slug>/context.md` — extrair título e objetivo da feature
2. Receber lista de disciplinas (passada pelo chamador ou inferida do context.md)
3. Criar **issue principal** no Linear:
   - Título: `[<slug>] <nome da feature>`
   - Descrição: objetivo + escopo do `context.md`
   - Label: `Feature`
4. Para cada disciplina na lista, criar **sub-issue** vinculada à principal:
   - Título: `[Design] <nome da feature>` / `[Backend] <nome>` / `[Frontend] <nome>` / `[QA] <nome>`
   - Status inicial: `Backlog`
   - Assignee: não definido (PM/Designer/Dev atribui ao iniciar)
5. Gravar `docs/.cortex/sessions/<slug>/linear.json`:

```json
{
  "slug": "<slug>",
  "created_at": "<ISO 8601>",
  "main_issue_id": "<ID>",
  "main_issue_url": "<URL>",
  "subtasks": {
    "design":   { "id": "<ID>", "url": "<URL>" },
    "backend":  { "id": "<ID>", "url": "<URL>" },
    "frontend": { "id": "<ID>", "url": "<URL>" },
    "qa":       { "id": "<ID>", "url": "<URL>" }
  }
}
```

6. Atualizar `docs/.cortex/sessions-manifest.json`: `files.linear: true`

**Regras de segurança:**
- Sempre exibir preview e pedir confirmação antes de criar issues
- Não criar duplicatas — verificar se `linear.json` já existe para o slug
- Se já existir: exibir aviso e perguntar se quer recriar ou usar o existente
- Rate limiting: 500ms entre chamadas API

**Saída esperada:**
```
Linear Scaffold — <slug>
  Issue principal: [ABC-042] feature-008-checkout — <URL>
  Subtasks criadas:
    [ABC-043] Design   — <URL>
    [ABC-044] Backend  — <URL>
    [ABC-045] Frontend — <URL>
    [ABC-046] QA       — <URL>

linear.json salvo em docs/.cortex/sessions/<slug>/linear.json ✓
```

---

## Sync — Sincronizar Features

Invocar agente `@integrations/linear-project-sync`.

Lê `docs/business-context/features/`, compara com issues no projeto Linear,
e cria/atualiza épicos e sub-issues.

**Pré-requisito:** credenciais configuradas via `setup`.

Modos disponíveis:
- **Completo** — todos os módulos
- **Por Módulo** — módulo específico
- **Por Escopo** — ex: MVP, Fase 2
- **Preview** — só relatório, sem alterações

Sempre exibe preview e pede confirmação antes de executar mutations.

**Regras de segurança:**
- Nunca executar mutations sem aprovação do usuário
- Não duplicar issues — verificar existência antes de criar
- Não fazer downgrade de status (In Progress → Backlog)
- Rate limiting: 500ms entre chamadas API
- API Key somente em `.claude/.env` — nunca em arquivos versionados

---

## Task — Criar Issue no Linear

Cria uma issue bem estruturada no Linear a partir de uma descrição.

Revisa `docs/` para contextualizar, então cria a issue com:
- Descrição funcional clara
- Arquitetura técnica e plano de execução
- Bibliotecas sugeridas
- Componentes afetados
- Critérios de aceitação
- Pontos de validação

Para tarefas complexas: cria issue pai + sub-issues automaticamente.

Labels disponíveis: `Bug`, `Feature`, `Improvement`, `Research`

Sempre apresenta o plano e pede confirmação antes de criar.

**Uso:**
```
/integrations:linear task Implementar autenticação OAuth com Google
```
