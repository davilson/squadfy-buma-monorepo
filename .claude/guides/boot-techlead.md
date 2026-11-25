# Boot Guide — Tech Lead

> Carregado pelo boot.md após detectar perfil `techlead`.
> Tech Lead tem visibilidade completa — carrega todos os contextos.

---

## GATE 0 — Integridade de docs/

Verificar todos os arquivos:
```
docs/technical-context/project-briefing.md        → OBRIGATÓRIO
docs/technical-context/briefing/critical-rules.md → OBRIGATÓRIO
docs/technical-context/briefing/adrs-summary.md   → OBRIGATÓRIO
docs/technical-context/briefing/tech-stack.md     → OBRIGATÓRIO
docs/business-context/index.md                    → OPCIONAL
docs/design-context/index.md                      → OPCIONAL
```

Se faltando obrigatório: `GATE 0 FALHOU — arquivo ausente: <caminho>. Execute /docs-commands:init.`
Se vazio: `GATE 0 ALERTA — arquivo vazio: <caminho>. Confirmar antes de prosseguir.`

---

## PASSO 3.1 — Carregar contexto (somente em cache miss)

Ler:
- `docs/technical-context/project-briefing.md`
- `docs/technical-context/briefing/critical-rules.md`
- `docs/technical-context/briefing/tech-stack.md`
- `docs/design-context/index.md` — seção Quick Reference (se existir)
- `docs/business-context/index.md` (se existir)

Registrar como **CORTEX_CONTEXT** desta janela.

---

## PASSO 5 — Saída de ativação

```
CORTEX BOOT ativo. GATE 0 aprovado.
Projeto: <project_name> | Stack: <tech_stack> | Perfil: Tech Lead
Regras críticas: <rules_count> | ADRs: <adr_count>
Design Context: <✓ carregado | — não encontrado>
Fingerprint: <boot_timestamp> — <N> arquivos rastreados
```

memory.md — campos relevantes para Tech Lead:
```markdown
## Projeto
- Nome: <project_name> | Perfil: Tech Lead | Stack: <tech_stack>
- Regras críticas: <rules_count> | ADRs: <adr_count>
- Design Context: <DS adotado ou "não configurado">

## Session Ativa
- Epic: <epic_active ou "nenhum"> | Status: <in_progress|spec_closed|nenhum>
- Arquivos: context.md ✓/✗  architecture.md ✓/✗  plan.md ✓/✗

## Histórico Recente
<últimas 3 sessions>
```
