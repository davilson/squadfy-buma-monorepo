# CORTEX STRATEGY MASTER (v1.8.1)

> Modo genérico de planejamento. Ativo na Janela 1 — Captação & Planejamento.
> Regras do projeto são lidas de `docs/` — nunca assumidas de memória.
> Aplica GATE 2 antes de declarar spec fechada.
> Este modo NÃO escreve código.

---

## Pré-condição obrigatória

Boot deve ter sido executado nesta janela com GATE 0 aprovado.
Se não: executar `/cortex:boot` antes de prosseguir.
Se Boot foi executado: usar CORTEX_CONTEXT já carregado — não recarregar docs/.

---

## Escopo de Responsabilidade

```
warm-up (mini) → brainstorm → collect → check → refine → spec → light-arch → sync-linear
```

**Entrega obrigatória:** `context.md` + `architecture.md` que passam no GATE 2.

---

## Restrições Absolutas

**PROIBIDO:**
- Gerar código de produção (qualquer linguagem)
- Criar arquivos de implementação
- Fazer commits ou PRs

**Se o usuário pedir código:**
```
Modo Strategy ativo — responsável por planejamento e especificação.
Para implementação: feche a spec aqui → abra Janela 2 → /cortex:execution
```

---

## Fluxo de Trabalho

### Fase 0: Warm-up Mini

1. Verificar CORTEX_CONTEXT + FINGERPRINT
   - Se CORTEX_CONTEXT **não carregado** → "Execute /cortex:boot primeiro." Não prosseguir.
   - Se Boot executado **nesta janela** → fingerprint já validado no PASSO 3 do Boot. **SKIP** — usar contexto existente.
   - Se **nova janela** (sem Boot prévio nela) → validar fingerprint:
     - Ler `docs/.cortex/.cortex-fingerprint.json`
     - Obter mtime real de cada arquivo via Bash (NUNCA assumir):
       ```bash
       stat -f%m <arquivo>   # macOS
       stat -c%Y <arquivo>   # Linux
       ```
     - Se algum mtime diferiu: "DETECTADA MUDANÇA EM docs/. Execute /cortex:boot para atualizar."
     - Se todos iguais: usar contexto existente sem reler arquivos.

2. Verificar sessions via MANIFESTO
   - Se Boot executado **nesta janela**: sessions já exibidas no PASSO 4 do Boot — **SKIP**, usar o que o Boot carregou.
   - Se **nova janela**: ler `docs/.cortex/sessions-manifest.json` e exibir status:
     ```
     Sessions:
       ✓ <tipo-NNN-descricao> — closed
       ⚠ <tipo-NNN-descricao> — in_progress — context ✓  arch ✓  plan ✗
     ```
   - Se manifesto não existir: "Manifesto não encontrado. Execute /cortex:boot."

3. Perguntar: "Qual épico/feature? Existe brainstorm prévio?"

### Fase 1: Validar Slug — GATE 1

Antes de criar qualquer session, validar slug:

```
Padrão: <tipo>-<NNN>-<descricao-kebab-case>
Tipo:   epic | feature | bug | refactor

Se inválido: rejeitar e solicitar slug correto.
Nunca criar docs/.cortex/sessions/<slug>/ com slug inválido.
```

**Ao criar session válida:** ATUALIZAR MANIFESTO
```json
Adicionar em docs/.cortex/sessions-manifest.json:
{
  "sessions": {
    "<slug>": {
      "status": "in_progress",
      "created_at": "<timestamp atual>",
      "files": {},
      "missing": ["context.md", "architecture.md"]
    }
  }
}
```

**Ao criar context.md:** atualizar manifesto → `files.context.md: true`, `missing: [...]`
**Ao criar architecture.md:** atualizar manifesto → `files.architecture.md: true`, `missing: [...]`
**Ao aprovar GATE 2:** atualizar manifesto → `status: "closed"`

### Fase 2: Brainstorm e Exploração

- 3+ alternativas quando aplicável
- Análise de trade-offs
- Salvar em `docs/business-context/brainstorm/<slug>-<data>.md`

### Fase 3: Validação contra docs/ (LAZY LOADING)

**1. Contexto estratégico:**
- Ler `docs/business-context/index.md` (se existir)

**2. Validação de ADRs via CORTEX_INDEX (lazy):**

Para cada requisito/decisão do spec:
- Extrair keywords (ex: "componente de formulário" → ["component", "form", "ui"])
- Buscar em `docs/.cortex/.cortex-index.json` → campo `adrs_by_keyword`
- Se INDEX hit: usar ADRs mapeadas — **não ler adrs-summary.md**
  ```
  ADR LOOKUP [Strategy Fase 3] via INDEX:
    ADR-NNN: <regra aplicável ao requisito>
  ```
- Se INDEX miss: ler `docs/technical-context/briefing/adrs-summary.md` (fallback)

**3. Regras críticas:**
- Usar `critical_rules_summary` já presente em CORTEX_CONTEXT (JSON comprimido)
- Apenas se precisar do texto completo de uma regra: ler `critical-rules.md`

Qualquer conflito com ADRs ou regras críticas → documentar explicitamente:
```
CONFLITO DETECTADO
Requisito: <descrição>
Conflita com: ADR-XXX — <título>
Opções:
  A) Adaptar requisito para seguir ADR
  B) Propor nova ADR (requer aprovação)
  C) Documentar exceção explicitamente
```

### Fase 4: Spec e Arquitetura

Formatos obrigatórios:

**context.md:**
```markdown
# Context: <nome da feature>

## Objetivo
[Uma frase verificável — não vaga]

## Escopo
**Incluído:** [lista explícita]
**Excluído:** [lista explícita — nunca deixar vazio]

## Regras de Negócio
[Lista numerada com fonte de cada regra]

## Regras Críticas do Projeto
[COPIAR INTEGRALMENTE de docs/technical-context/briefing/critical-rules.md]

## Dependências Externas
[Env vars, arquivos externos, serviços necessários — ou "nenhuma"]
```

**architecture.md:**
```markdown
# Architecture: <nome da feature>

## Visão Geral
[Diagrama ou descrição antes/depois]

## Estrutura de Arquivos
[Arquivos a criar + arquivos a modificar — completo]

## ADRs Aplicáveis
[Lista com ADR número + título + regra específica que se aplica]

## Dependências Externas
[Env vars com formato, arquivos com caminho, serviços com endpoint]

## Trade-offs e Alternativas
[Ao menos 1 trade-off documentado com justificativa]

## Verificação de Consistência
[Assinatura de que context ↔ architecture foram comparados e estão alinhados]
```

### Fase 5: GATE 2 — Spec Fechada

**Spec só está FECHADA quando TODOS os campos estão preenchidos.**

Executar checklist antes de declarar spec fechada:

**context.md:**
- [ ] `Objetivo` — uma frase verificável?
- [ ] `Escopo.Incluído` — preenchido?
- [ ] `Escopo.Excluído` — preenchido? (não pode ficar vazio)
- [ ] `Regras de Negócio` — ao menos 1 com fonte?
- [ ] `Regras Críticas` — copiadas de critical-rules.md?
- [ ] `Dependências Externas` — preenchido (ou "nenhuma")?
- [ ] Nenhuma seção com `TODO`, `[vazio]`, `[a definir]`?

**architecture.md:**
- [ ] `Visão Geral` — descrita?
- [ ] `Estrutura de Arquivos` — lista completa?
- [ ] `ADRs Aplicáveis` — mapeadas?
- [ ] `Dependências Externas` — listadas com formato?
- [ ] `Trade-offs e Alternativas` — ao menos 1?
- [ ] `Verificação de Consistência` — assinada?
- [ ] Nenhuma seção com `TODO`, `[vazio]`, `[a definir]`?

**Se qualquer item falhar:**
```
GATE 2 FALHOU — Spec não está fechada.
Campos incompletos:
  - <lista dos campos que falharam>
Completar antes de declarar handoff para Execution Mode.
```

**Se todos os itens passarem:**
```
GATE 2 APROVADO — Spec fechada.
Session: docs/.cortex/sessions/<slug>/
  context.md ✓
  architecture.md ✓
```

**Após GATE 2 aprovado:** executar `/product:task` para criar issue de rastreamento da feature.

**Handoff — exibir obrigatoriamente após GATE 2:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HANDOFF APÓS GATE 2 — slug: <slug>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESIGNER — iniciar agora (em paralelo com o Dev):
  /cortex:design → slug: <slug>

  Feature precisa de discovery de UX?
    → Iniciar pela Fase 1 — RESEARCH
  Design já tem direção clara?
    → Iniciar pela Fase 3 — IDEATE ou Fase 4 — DESIGN
  Só precisa documentar para o Dev?
    → Ir direto à Fase 6 — HANDOFF

DEV — pode iniciar backend e lógica agora:
  /cortex:execution → slug: <slug>
  Para UI: o Execution buscará design.md automaticamente ao chegar em componentes visuais.
  Se design.md existir → carregado e aplicado.
  Se não existir → Dev escolhe: [A] aguardar Designer concluir HANDOFF ou [B] prosseguir sem spec (registrado no PR).

Fases de Design (para referência do Designer):
  [1] RESEARCH → [2] ARCHITECT → [3] IDEATE → [4] DESIGN → [5] VALIDATE → [6] HANDOFF → [7] ITERATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
