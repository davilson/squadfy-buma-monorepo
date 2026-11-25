# Boot Guide — Engineer (frontend / backend / fullstack)

> Carregado pelo boot.md após detectar perfil `frontend`, `backend` ou `fullstack`.
> Define GATE 0 e PASSO 3.1 específicos para este perfil.

---

## GATE 0 — Integridade de docs/

Verificar:
```
docs/technical-context/project-briefing.md        → OBRIGATÓRIO
docs/technical-context/briefing/critical-rules.md → OBRIGATÓRIO
docs/technical-context/briefing/adrs-summary.md   → OBRIGATÓRIO
docs/technical-context/briefing/tech-stack.md     → OBRIGATÓRIO
docs/business-context/index.md                    → OPCIONAL
```

Se faltando obrigatório: `GATE 0 FALHOU — arquivo ausente: <caminho>. Execute /docs-commands:init.`
Se vazio: `GATE 0 ALERTA — arquivo vazio: <caminho>. Confirmar antes de prosseguir.`

---

## PASSO 3.1 — Carregar contexto (somente em cache miss)

Ler:
- `docs/technical-context/project-briefing.md`
- `docs/technical-context/briefing/critical-rules.md`
- `docs/technical-context/briefing/tech-stack.md`

**NÃO ler:** `docs/design-context/` — irrelevante para Engineer, carregado sob demanda pelo Execution (GATE 3 6b).

Registrar como **CORTEX_CONTEXT** desta janela.

---

## PASSO 5 — Saída de ativação

```
CORTEX BOOT ativo. GATE 0 aprovado.
Projeto: <project_name> | Stack: <tech_stack>
Regras críticas: <rules_count> | ADRs: <adr_count>
Fingerprint: <boot_timestamp> — <N> arquivos rastreados
```

memory.md — campos relevantes para Engineer:
```markdown
## Projeto
- Nome: <project_name> | Perfil: Engineer | Stack: <tech_stack>
- Regras críticas: <rules_count> | ADRs: <adr_count>

## Session Ativa
- Epic: <epic_active ou "nenhum"> | Status: <in_progress|spec_closed|nenhum>
- Arquivos: context.md ✓/✗  architecture.md ✓/✗  plan.md ✓/✗

## Histórico Recente
<últimas 3 sessions>
```
