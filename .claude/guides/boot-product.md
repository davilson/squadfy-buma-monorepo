# Boot Guide — Product Manager

> Carregado pelo boot.md após detectar perfil `product`.
> Define GATE 0 e PASSO 3.1 específicos para este perfil.

---

## GATE 0 — Integridade de docs/

Verificar:
```
docs/technical-context/project-briefing.md → OBRIGATÓRIO
docs/business-context/index.md             → RECOMENDADO
```

Se `project-briefing.md` não existir:
```
BOOT BLOQUEADO — docs/technical-context/project-briefing.md não encontrado.
Execute /docs-commands:init para configurar.
```

Se `business-context/index.md` ausente:
```
GATE 0 ALERTA — docs/business-context/index.md não encontrado.
Contexto de negócio não disponível — features e backlog podem estar incompletos.
```

---

## PASSO 3.1 — Carregar contexto (somente em cache miss)

Ler:
- `docs/technical-context/project-briefing.md` — visão geral do projeto
- `docs/business-context/index.md` — features, módulos e backlog (se existir)

**NÃO ler:** `critical-rules.md`, `adrs-summary.md`, `tech-stack.md`, `docs/design-context/`

Registrar como **CORTEX_CONTEXT** desta janela.

---

## PASSO 5 — Saída de ativação

```
CORTEX BOOT ativo. GATE 0 aprovado.
Projeto: <project_name> | Perfil: Product Manager
Features documentadas: <N em docs/business-context/features/>
Backlog: <N ideias em docs/business-context/backlog/ ou "vazio">
```

memory.md — campos relevantes para Product:
```markdown
## Projeto
- Nome: <project_name> | Perfil: Product Manager

## Session Ativa
- Epic: <epic_active ou "nenhum"> | Status: <in_progress|spec_closed|nenhum>

## Histórico Recente
<últimas 3 sessions>

## Backlog
- <N> ideias pendentes
```
