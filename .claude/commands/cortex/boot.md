# CORTEX BOOT — Framework Cortex v2.0.0

Você é um orquestrador multiagente seguindo o **Framework Cortex**.
ADR-first: ler decisões de arquitetura ANTES de escrever código. **Fail Loud, Never Silent.**
Nunca assume stack, ADRs ou regras de memória — sempre lê de `docs/`. Se não consegue ler → informa o usuário.

Se Boot já foi executado nesta janela: Strategy/Execution não recarregam docs/ — usam CORTEX_CONTEXT existente.

---

## Sequência de Boot

### PASSO 0 — Resolver Perfil (silencioso)

```bash
cat .claude/settings.local.json 2>/dev/null | python3 -c "import sys,json;print(json.load(sys.stdin).get('cortex',{}).get('profile',''))" 2>/dev/null
```

**Valores válidos:** `frontend` | `backend` | `fullstack` | `designer` | `product` | `techlead`

**Se válido — caminho normal:** ler `.claude/profiles/<profile>.md` + `.claude/profiles/README.md`, registrar como **CORTEX_PROFILE**.
Não perguntar, não confirmar, não exibir menu. O perfil aparece apenas como um campo na saída do PASSO 5.

**Se ausente ou inválido — apenas na primeira vez:** AskUserQuestion `header: "Cortex — Perfil"`, uma pergunta, opções: Frontend Engineer (`frontend`) | Backend Engineer (`backend`) | Full-stack Engineer (`fullstack`) | Designer (`designer`) | Product Manager (`product`) | Tech Lead (`techlead`).
Gravar imediatamente em `.claude/settings.local.json` sob `cortex.profile` (merge JSON, preservar `permissions`) e seguir o caminho normal. Nunca perguntar de novo — a troca é exclusivamente por `/cortex:set-profile`.

---

### PASSO 1 — MEMORY.md (Fast Path)

Verificar `docs/.cortex/memory.md`. Se populado (campo `Nome:` preenchido): exibir resumo e prosseguir. Se ausente/vazio: silencioso.

---

### PASSO 2 — Carregar guide do perfil

Ler `.claude/guides/boot-<CORTEX_PROFILE>.md` conforme mapeamento:

| Perfil | Guide |
|--------|-------|
| `designer` | `.claude/guides/boot-designer.md` |
| `frontend` / `backend` / `fullstack` | `.claude/guides/boot-engineer.md` |
| `product` | `.claude/guides/boot-product.md` |
| `techlead` | `.claude/guides/boot-techlead.md` |

Executar do guide:
1. **GATE 0** — verificar integridade dos docs/ relevantes para o perfil
2. **PASSO 3.1** — lista de arquivos a carregar (usada no cache miss abaixo)
3. Registrar o formato de saída do **PASSO 5** definido no guide

Se o guide não for encontrado → usar boot-engineer.md como fallback e exibir aviso.

---

### PASSO 3 — Cache Check

Verificar `docs/.cortex/.cortex-fingerprint.json`. Para cada arquivo listado, obter mtime real via Bash:
```bash
stat -f%m <arquivo>   # macOS  |  stat -c%Y <arquivo>   # Linux
```
Comparar com inteiros exatos (sem tolerância).

**CACHE HIT** (nenhum mtime diferiu):
- Carregar `docs/.cortex/.cortex-context.json` → registrar como **CORTEX_CONTEXT**
- Pular PASSO 3.1, 3.2, 3.3 → ir para PASSO 3.4

**CACHE MISS ou PRIMEIRA EXECUÇÃO:**
- Executar PASSO 3.1, depois ler `.claude/guides/boot-generation.md` e executar PASSO 3.2 e 3.3 conforme especificado nele.

Se fingerprint existe mas `.cortex-context.json` está ausente → tratar como CACHE MISS.

---

### PASSO 3.1 — Carregar docs/ (somente em cache miss)

Ler os arquivos definidos na seção **PASSO 3.1** do guide do perfil (carregado no PASSO 2).
Cada perfil carrega apenas os arquivos relevantes — não ler além do que o guide especifica.

Registrar como **CORTEX_CONTEXT** desta janela. Strategy/Execution reusam sem reler.

---

### PASSO 3.4 — Session Manifest

> O `sessions-manifest.json` é um arquivo local (gitignored) — cada dev o gera a partir do disco.
> Nunca assumir que o manifesto reflete o estado real; sempre verificar contra disco.

Se `docs/.cortex/sessions-manifest.json` **não existe** → **rescan obrigatório** (arquivo foi apagado, máquina nova, ou primeiro boot do dev).

Se existe: verificar via Bash se os slugs em disco batem com o manifesto:
```bash
ls -d docs/.cortex/sessions/*/  2>/dev/null | xargs -I{} basename {}
```
Se idênticos → usar manifesto existente (SKIP rescan). Se diferente → rescan.

**Rescan:** scanear `docs/.cortex/sessions/`, verificar existência de `context.md`, `architecture.md`,
`plan.md` e `design/design.md` (no subdiretório, não na raiz da session). Gravar manifesto reconstruído em disco.

Formato do manifesto:
```json
{
  "schema_version": "1.6.0",
  "generated_at": "<ISO 8601>",
  "sessions": {
    "<slug>": {
      "status": "in_progress|spec_closed|closed",
      "created_at": "<ISO 8601>",
      "files": { "context.md": true, "architecture.md": true, "plan.md": true, "design/design.md": false },
      "missing": ["plan.md"],
      "design": { "gateD": true, "qaRequired": true, "pmApproved": false, "implementation": "ready-for-qa" },
      "pending_handoff": [{ "profile": "backend", "files": ["src/api/users.ts"] }],
      "solo": { "declared_at": "<ISO 8601>", "profile": "frontend", "skipped": ["pm-approval"], "reason": "<uma linha>" }
    }
  }
}
```
Campo `missing`: apenas em `in_progress` com arquivos ausentes. Omitido em `spec_closed` e `closed`.

**Semântica dos status (única fonte de verdade):**

| Status | Significa | Quem escreve | Aparece no menu do Execution |
|---|---|---|---|
| `in_progress` | session criada, spec ainda incompleta | Strategy / Modify / Bug / Platform Task ao criar | sim, marcada como incompleta |
| `spec_closed` | GATE 2 aprovado — pronta para implementar | Strategy / Modify / Platform Task no GATE 2 | sim |
| `closed` | entregue — PR mergeado | `/engineer:pr` após o merge | não |

No rescan, inferir status a partir do disco apenas quando o slug não existir no manifesto:
`context.md` + `architecture.md` presentes → `spec_closed`; caso contrário → `in_progress`.
Nunca inferir `closed` a partir do disco.

**Campo `design`** (omitido se a session não tem `design/`): espelha `sessions/<slug>/design/manifest.json`
— `gateD` (GATE-D aprovado), `qaRequired`, `pmApproved` (PM liberou o início) e `implementation`.
São os 4 campos que formam o contrato com o Dev; o resto do `design/manifest.json` é estado interno do
Designer. No rescan, ler esse manifesto quando o diretório existir.

`pmApproved: false` é **aviso, não bloqueio** — o design já está implementável; o PM só ainda não
priorizou. O Dev decide, e a decisão fica registrada em `solo`.

**Campo `solo`** (omitido quando ausente): o Dev declarou seguir sem o insumo de outro perfil.
`skipped` lista o que foi dispensado (`design-spec`, `pm-approval`, `design-qa`). Solo nunca relaxa
GATE 3, GATE VERDE, GATE 5 nem a fronteira de perfil — dispensa insumo, não verificação.

**Campo `pending_handoff`** (omitido quando vazio): arquivos que o Execution recusou por fronteira de
perfil, com o perfil responsável por cada grupo. Ver PASSO 4.

---

### PASSO 3.5 — Consistência (emite avisos, não bloqueia)

**A.** Se `epic_active` definido: verificar se slug existe no manifesto com status `in_progress` ou `spec_closed`.
**B.** Para cada slug em `epics_completed`: verificar se está no manifesto como `closed`.
**C.** Para cada session `spec_closed`: verificar se `context.md` + `architecture.md` existem — se faltarem, o status está errado.

Inconsistências → exibir `AUTO-CONSISTENCY [N alerta(s)]: ⚠ ...`. Se nenhuma → silencioso.

---

### PASSO 4 — Sessions, Handoffs e Backlog

Exibir sessions do manifesto com ícones ✓/⚠, filtradas conforme o guide do perfil.
Se manifesto não existe: "Pronto para o primeiro épico".

**Handoffs endereçados a este perfil (sempre exibir, antes do menu):**

Varrer `pending_handoff` de todas as sessions e mostrar as entradas cujo `profile` == `CORTEX_PROFILE`:
```
HANDOFF PARA VOCÊ [<N>]
  <slug> — <N> arquivo(s) recusado(s) por outro perfil:
    <path>
    <path>
  → EXECUTION → IMPLEMENTAR TAREFA nesta session cobre esses arquivos.
```
Se nenhum → silencioso.

**Design pronto para implementar** (perfis de engenharia e `techlead`): para cada session `spec_closed`
ou `in_progress` com `design.gateD: true`, exibir ao lado do slug:
- `🎨 design pronto` — se `design.pmApproved: true`
- `🎨 design pronto — PM não liberou` — se `false`. Sinal, não impedimento.

Sessions com `solo` exibem `⚡ solo: <skipped>` — para o Dev lembrar do que dispensou, e para o Tech Lead
ver de fora.

Se `ideas_backlog_count > 0`: `Backlog: <N> ideia(s) em docs/business-context/backlog/`.

---

### PASSO 5 — Confirmar Ativação + Escrever MEMORY.md

Usar o formato de saída e os campos de memory.md definidos na seção **PASSO 5** do guide do perfil.

Regras comuns a todos os perfis:
- Sobrescrever `docs/.cortex/memory.md` completo (nunca append)
- Sem dados sensíveis
- Stack ≤ 60 chars
- Se manifesto não existe → "Nenhuma session registrada" no Histórico
- Sempre incluir seção `## Cache` com timestamp e status do fingerprint

---

### PASSO 6 — Rotear (filtrado por CORTEX_PROFILE)

**Antes de perguntar qualquer coisa: se a mensagem do usuário já determina o modo, rotear direto — sem menu.**

| Sinal na mensagem | Modo |
|---|---|
| slug de session, "implementar", "continuar a task" | `cortex:execution` |
| "bug", "erro", "quebrou", "500", stack trace | `cortex:bug` |
| "feature nova", "epic", "planejar do zero" | `cortex:strategy` |
| "adicionar X em Y que já existe", "alterar" | `cortex:modify` |
| "tive uma ideia", "anotar", "registrar" | `cortex:idea` |
| link/ID de Jira, Linear, Trello, Asana, Monday | `cortex:platform-task` |
| "design", "telas", "fluxo", "handoff" | `cortex:design` |

Ambíguo ou nenhum sinal → menu abaixo.

**Modos por perfil:**

| CORTEX_PROFILE | Modos |
|---|---|
| `frontend` / `backend` / `fullstack` | EXECUTION, STRATEGY |
| `designer` | DESIGN, IDEIA |
| `product` | STRATEGY |
| `techlead` | EXECUTION, STRATEGY, DESIGN |

**Menu — engenharia (`frontend` / `backend` / `fullstack` / `techlead`):** uma única AskUserQuestion, `header: "Cortex"`, opções:
IMPLEMENTAR TAREFA ("Selecionar session com spec fechada e implementar") | BUG ("Root cause obrigatório, fix mínimo") | TASK DE PLATAFORMA ("Task do Jira/Linear/etc sem spec") | PLANEJAR ("Epic novo, modificar existente ou capturar ideia").
`techlead` recebe DESIGN em vez de TASK DE PLATAFORMA quando `docs/design-context/` existe.

**Menu — `designer`:** AskUserQuestion, opções: DESIGN ("Iniciar ou continuar ciclo de design") | IDEIA ("Capturar ideia rapidamente").

**Menu — `product`:** não perguntar categoria (só existe STRATEGY). Ir direto ao sub-menu de PLANEJAR.

**Sub-menu PLANEJAR** (segunda AskUserQuestion, só quando PLANEJAR foi escolhido): EPIC ("Feature nova do zero") | MODIFY ("Alterar feature já implementada") | IDEIA ("Capturar nova ideia").

**Roteamento:**

| Seleção | Skill |
|---|---|
| IMPLEMENTAR TAREFA | `cortex:execution` |
| BUG | `cortex:bug` |
| TASK DE PLATAFORMA | `cortex:platform-task` |
| PLANEJAR → EPIC | `cortex:strategy` |
| PLANEJAR → MODIFY | `cortex:modify` |
| PLANEJAR → IDEIA / IDEIA | `cortex:idea` |
| DESIGN | `cortex:design` |

**Propagação obrigatória:** ao invocar a skill, passar `CORTEX_PROFILE` e a fronteira de `.claude/profiles/README.md` adiante. O modo herda o perfil do boot — nenhum modo, comando ou agente opera sem perfil resolvido.

Não invocar skills fora do domínio do perfil. Se o usuário pedir uma explicitamente (ex. `product` pedindo `cortex:execution`), aplicar o bloco `FRONTEIRA DE PERFIL` de `.claude/profiles/README.md`.

---

## Padrão de Slug (obrigatório para sessions)

```
^(epic|feature|bug|refactor)-\d{3}-[a-z0-9]+(-[a-z0-9]+)*$

Exemplos válidos:   epic-004-landing-page | bug-001-fab-overlay | feature-012-user-auth
Exemplos inválidos: epic4 | EPIC-004 | epic-004-página | feature-001-x (1 segmento)
```
