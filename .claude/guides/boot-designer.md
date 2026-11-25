# Boot Guide — Designer

> Carregado pelo boot.md após detectar perfil `designer`.
> Define GATE 0 e PASSO 3.1 específicos para este perfil.

---

## GATE 0 — Integridade de docs/

Verificar:
```
docs/design-context/          → OBRIGATÓRIO (diretório)
docs/design-context/index.md  → RECOMENDADO
```

Se `docs/design-context/` não existir:
```
BOOT BLOQUEADO — docs/design-context/ não encontrado.
Execute /docs-commands:build-design-docs para gerar o DNA de design do projeto.
Após concluir, reiniciar com /cortex:boot.
```

Se diretório existe mas `index.md` ausente:
```
GATE 0 ALERTA — docs/design-context/index.md não encontrado.
Boot prossegue com fallback, mas Quick Reference não estará disponível.
```

---

## PASSO 3.1 — Carregar contexto (somente em cache miss)

Ler `docs/design-context/index.md` — seção **Quick Reference**.
Registrar internamente: DS adotado, princípios de UX resumidos, componentes principais.

Se `index.md` não existir, fallback (ler apenas o que existir):
- `docs/design-context/design-system.md`
- `docs/design-context/ux-principles.md`
- `docs/design-context/components.md`

**NÃO ler:** `docs/technical-context/`, `critical-rules.md`, `adrs-summary.md`, `tech-stack.md`

Registrar como **CORTEX_CONTEXT** desta janela.

---

## PASSO 3.4 — Filtro de sessions

```
Aguardando design (GATE 2 aprovado — você pode começar):
  ▶ <slug> — spec_closed — nenhuma fase de design iniciada

Design em andamento:
  ⚠ <slug> — spec_closed — IDEATE ✓  UI ✓  HANDOFF —

Design entregue (GATE-D aprovado):
  ✓ <slug> — qaRequired: sim — implementação: ready-for-qa

Entregues:
  ✓ <slug> — closed
```

**O bloco "Aguardando design" é o handoff Strategy → Design.** São as sessions `spec_closed` sem
`design/manifest.json`: a spec fechou e ninguém começou o design ainda. Sempre exibir, mesmo vazio
(`nenhuma session aguardando design`) — é o principal sinal de entrada do Designer.

Sessions com `design.implementation: "ready-for-qa"` exigem `/cortex:design` → [7] QA antes do merge.

---

## PASSO 5 — Saída de ativação

```
CORTEX BOOT ativo. GATE 0 aprovado.
Projeto: <project_name> | Perfil: Designer
Design Context: ✓ | DS: <nome do DS extraído>
Sessions com design: <N>
```

memory.md — campos relevantes para Designer:
```markdown
## Projeto
- Nome: <project_name> | Perfil: Designer | DS: <nome do DS>

## Session Ativa
- Epic: <epic_active ou "nenhum"> | Track: <express|standard|full|"nenhum">
- Fases concluídas: <lista ou "nenhuma">

## Histórico Recente
<últimas 3 sessions com trabalho de design>
```
