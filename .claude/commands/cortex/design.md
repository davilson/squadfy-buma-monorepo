# Cortex Design — Processo Completo de Product Design

Você está ativando o **Cortex Design Mode** — Processo completo do Product Designer.

## Fronteira de Perfil (obrigatório, antes de qualquer escrita)

`CORTEX_PROFILE` é herdado do Boot. Se não estiver resolvido nesta janela, ler
`.claude/settings.local.json` → `cortex.profile` e carregar `.claude/profiles/<profile>.md` +
`.claude/profiles/README.md` em silêncio — sem perguntar ao usuário.

Aplicar a matriz de escrita e de agentes de `.claude/profiles/README.md`. Fora dela: emitir o bloco
`FRONTEIRA DE PERFIL` e parar. **Não existe override por mensagem** — a troca de perfil é exclusivamente
por `/cortex:set-profile`.

Numa tarefa mista: entregar integralmente a parte dentro do perfil e listar o que ficou de fora e para
qual perfil.

---

## O que este modo faz

Guia o Designer por 9 fases do processo de design de produto:

```
[0] EXPLORE     — Exploração livre ou mapeamento de escopo antes do ciclo formal
[1] RESEARCH    — Descoberta, entrevistas, benchmarking, personas, JTBD
[2] ARCHITECT   — Jornadas, taskflows, arquitetura de informação
[3] IDEATE      — Brainstorm de alternativas, rascunhos, decisão de direção
[4] DESIGN      — Wireframes, UI de alta fidelidade, prototipação com DS
[5] VALIDATE    — Testes de usabilidade, revisão heurística, A/B, stakeholders
[6] HANDOFF     — Specs completas, edge cases, motion, estados, PM approval, Dev Brief (GATE-D)
[7] QA          — Revisão de fidelidade pós-implementação (antes do merge do PR)
[8] ITERATE     — Pós-lançamento: métricas, feedback real, melhorias
```

Cada fase gera um artefato em `docs/.cortex/sessions/<slug>/design/`.
A sequência é recomendada mas não obrigatória — pode entrar em qualquer fase.

## Pré-requisito

`docs/design-context/` deve existir.
Se não existir: execute `/docs-commands:build-design-docs` primeiro.

## Como usar

Informar o slug da session ao ativar (opcional para fases 1-4):
```
slug: <tipo>-<NNN>-<descricao>
```

## Artefatos gerados por fase

| Fase | Artefato | Track |
|------|----------|-------|
| 0 — Explore | `design-notes-<data>.md` ou `design-explore-<slug>.md` | Full |
| 1 — Research | `docs/.cortex/sessions/<slug>/design/archive/research.md` | Full |
| 2 — Architect | `docs/.cortex/sessions/<slug>/design/archive/flows.md` | Full |
| 3 — Ideate | `docs/.cortex/sessions/<slug>/design/archive/concepts.md` | Standard, Full |
| 4 — Design/UI | `docs/.cortex/sessions/<slug>/design/archive/design-spec.md` | Standard, Full |
| 5 — Validate | `docs/.cortex/sessions/<slug>/design/archive/validation.md` | Full |
| 6 — Handoff | `docs/.cortex/sessions/<slug>/design/design.md` — lean (Dev-facing) | **Express, Standard, Full** |
| 7 — QA | Seção QA preenchida em `design.md` | Express, Standard, Full |
| 8 — Iterate | `docs/.cortex/sessions/<slug>/design/archive/iteration.md` | Full |

> **Design Archive:** artefatos de processo ficam em `design/archive/` — não são carregados pelo Dev.
> **Lean design.md:** único artefato consumido pelo Dev — gerado em todos os tracks.
> **Track Express:** gera apenas `design.md`. Ideal para ajustes e demandas com direção clara.

## Gates

| Gate | Fase | Comportamento |
|------|------|--------------|
| GATE-R | Research → Architect | Avisa se research incompleto (não bloqueia) |
| GATE-AI | Architect → Ideate | Avisa se fluxos não mapeados (não bloqueia) |
| GATE-V | Validate → Handoff | Avisa se validação não executada (não bloqueia) |
| GATE-D | Handoff | Valida cobertura completa antes de liberar para Dev |

---

# CORTEX DESIGN MASTER (v2.0.0)

> Design Mode — Processo completo do Product Designer.
> 9 fases cobrindo todo o ciclo: Explore → Research → Architect → Ideate → Design → Validate → Handoff → QA → Iterate.
> Cada fase gera artefatos em `docs/.cortex/sessions/<slug>/design/`.
> `docs/design-context/` é a fonte de verdade de design do projeto — lida em todas as fases.
> Este modo NÃO escreve código de produção.

---

## Pré-condições

### Para uso do canvas Figma (qualquer fase):

Se o projeto está sendo desenhado no Figma e o Designer pretende usar `use_figma` para criar ou editar no canvas:

```
PRÉ-REQUISITO: Figma MCP plugin instalado no Claude Code.

Sem o plugin, os passos que usam use_figma ou generate_figma_design não funcionarão.

Como instalar:
  1. Abrir Claude Code
  2. Ir em Settings → Integrations → Figma
  3. Conectar e instalar o Figma plugin
  4. Reiniciar a sessão

Documentação: https://help.figma.com/hc/en-us/articles/32132150549527

Se o plugin não estiver instalado: usar Modo A (spec em markdown apenas) na fase DESIGN.
```

---

### Para fase EXPLORE (fase 0):
Nenhum pré-requisito. Pode ser executada antes mesmo de `docs/design-context/` existir.
Se `docs/design-context/` não existir: prosseguir normalmente, sem carregar Design Context.

### Para todas as demais fases:
`docs/design-context/` deve existir. Se não existir:
```
Design Context não encontrado.
Execute /docs-commands:build-design-docs para gerar o DNA de design do projeto antes de iniciar.
```

### Para fase HANDOFF (fase 6), QA (fase 7) e ITERATE (fase 8):
Session com `context.md` + `architecture.md` (GATE 2 aprovado) recomendada.
Se não existir, avisar mas não bloquear:
```
Aviso: Spec da session não encontrada (context.md / architecture.md ausentes).
A fase HANDOFF é mais precisa quando executada após GATE 2.
Continuar mesmo assim? [S/N]
```

### Para fase QA (fase 7):
Pré-requisito: `design.md` deve existir (GATE-D aprovado) e `qaRequired: true` no manifesto.
O QA é **decisão do Designer**, tomada ao concluir a fase HANDOFF.
Se `qaRequired: false`: fase QA não é aplicável a esta session — não exibir no menu.

### Para fase ITERATE (fase 8):
Pré-requisito: feature lançada em produção.

### Para fases 1 a 5:
Session slug recomendado mas não obrigatório.
Se não informado, usar slug exploratório: `design-exploratorio-<data>`.

---

## Inicialização

### Passo 1 — Carregar Design Context

Ler `docs/design-context/index.md` — seção **Quick Reference** com o DNA compacto do projeto.
Registrar internamente: DS adotado, princípios de UX resumidos, ativos protegidos globais.

Cada fase carrega os arquivos específicos que precisa (lazy loading — não ler os arquivos completos agora).

Se `index.md` não existir ou não tiver seção Quick Reference, fallback:
- `docs/design-context/design-system.md`
- `docs/design-context/ux-principles.md`
- `docs/design-context/components.md`
- `docs/design-context/content-guidelines.md`
- `docs/design-context/accessibility.md`
- `docs/design-context/feedback-states.md`

Carregamento lazy por fase (além do fallback acima):
- Fases IDEATE [3], DESIGN [4] e HANDOFF [6]: carregar também `docs/design-context/motion-principles.md` se existir.

Se algum arquivo não encontrado: informar quais estão faltando, prosseguir com o que existe.

### Passo 2 — Identificar session

Perguntar ao usuário:
```
Slug da session (ou pressione Enter para exploratório):
```

Verificar existência de `docs/.cortex/sessions/<slug>/design/` e registrar fases já concluídas.

### Passo 2B — Selecionar Track

```
TRACK DE DESIGN — qual é a complexidade desta demanda?

  [1] EXPRESS  — Ajuste, mudança pequena ou documentação de algo já decidido
                 Direção 100% clara, Figma já existe (ou não é necessário)
                 Processo: direto ao HANDOFF

  [2] STANDARD — Nova tela, componente ou fluxo com direção conhecida
                 Sem necessidade de discovery ou validação formal
                 Processo: IDEATE → UI → HANDOFF

  [3] FULL     — Feature nova, direção incerta ou discovery necessário
                 Processo: todas as fases disponíveis (0 → 8)
```

Registrar internamente como **DESIGN_TRACK**: `express` | `standard` | `full`.

**Regra de track:** fases fora do track selecionado não geram avisos de "fase anterior ausente" — é comportamento esperado, não omissão.

Se track `express` → pular Passo 3 e ir direto para HANDOFF (fase 6).
Se track `standard` → Passo 3 exibe apenas fases do track.
Se track `full` → Passo 3 exibe todas as fases.

---

### Passo 3 — Apresentar menu

**Se DESIGN_TRACK = `express`:** não exibir menu — ir direto ao HANDOFF.

**Se DESIGN_TRACK = `standard`:**
```
DESIGN MODE ativo — Track: STANDARD
Design Context: ✓ carregado
Session: <slug>

Fases deste track:
  [3] IDEATE  — <✓ concluído / — pendente>
  [4] DESIGN  — <✓ concluído / — pendente>
  [6] HANDOFF — <✓ concluído / — pendente>

Selecione a fase:
  [3] IDEATE  — Explorar alternativas e decidir direção
  [4] DESIGN  — Wireframes e UI de alta fidelidade com o DS
  [6] HANDOFF — Gerar lean design.md para o Dev (GATE-D)

Sequência recomendada: IDEATE → DESIGN → HANDOFF.
```

**Se DESIGN_TRACK = `full`:**
```
DESIGN MODE ativo — Track: FULL
Design Context: ✓ carregado
Session: <slug>
Responsável: <perguntar se não conhecido>

Fases concluídas nesta session:
  [0] EXPLORE     — <✓ concluído / — pendente>
  [1] RESEARCH    — <✓ concluído / — pendente>
  [2] ARCHITECT   — <✓ concluído / — pendente>
  [3] IDEATE      — <✓ concluído / — pendente>
  [4] DESIGN      — <✓ concluído / — pendente>
  [5] VALIDATE    — <✓ concluído / — pendente>
  [6] HANDOFF     — <✓ concluído / — pendente>
  [7] QA          — <✓ concluído / — pendente>
  [8] ITERATE     — <✓ concluído / — pendente>

Selecione a fase:
  [0] EXPLORE     — Exploração livre ou mapeamento de escopo antes do ciclo formal
  [1] RESEARCH    — Descoberta, entrevistas, benchmarking, personas, JTBD
  [2] ARCHITECT   — Jornadas, taskflows, arquitetura de informação
  [3] IDEATE      — Brainstorm de alternativas, rascunhos, decisão de direção
  [4] DESIGN      — Wireframes, UI, prototipação com Design System
  [5] VALIDATE    — Testes de usabilidade, heurísticas, A/B, feedback
  [6] HANDOFF     — Specs, edge cases, estados, motion, suporte ao Dev (GATE-D)
  [7] QA          — Revisão de fidelidade pós-implementação (antes do merge)
  [8] ITERATE     — Pós-lançamento: métricas, melhorias, próximo ciclo

Fase 0 não tem pré-requisitos e pode ser usada a qualquer momento.
Sequência recomendada para projetos novos: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.
Fase 7 somente após Dev implementar. Fase 8 somente após lançamento em produção.
```

---

## Verificação de fases anteriores (aviso permissivo)

**Regra de track:** fases fora do track ativo **não geram aviso** — é comportamento esperado.
- Track `express`: nenhum aviso de fases anteriores ausentes
- Track `standard`: avisos apenas entre IDEATE → DESIGN → HANDOFF
- Track `full`: avisos entre todas as fases sequenciais

Ao selecionar qualquer fase dentro do track ativo, verificar se a fase anterior (do mesmo track) foi concluída.
Se não concluída, exibir aviso e aguardar confirmação — **não bloquear**:

```
Aviso: [Fase X — NOME] não foi concluída nesta session.
Recomendado completar antes de avançar para garantir consistência.
Continuar mesmo assim? [S/N]
```

---

## Roteamento por fase

Após seleção e confirmação, carregar o master correspondente:

- **[0] EXPLORE**    → `.claude/commands/design/explore.md`
- **[1] RESEARCH**   → `.claude/commands/design/research.md`
- **[2] ARCHITECT**  → `.claude/commands/design/architect.md`
- **[3] IDEATE**     → `.claude/commands/design/ideate.md`
- **[4] DESIGN**     → `.claude/commands/design/ui.md`
- **[5] VALIDATE**   → `.claude/commands/design/validate.md`
- **[6] HANDOFF**    → `.claude/commands/design/handoff.md`
- **[7] QA**         → `.claude/commands/design/qa.md`
- **[8] ITERATE**    → `.claude/commands/design/iterate.md`

---

## Manifesto de fases

Ao concluir cada fase, atualizar `docs/.cortex/sessions/<slug>/design/manifest.json`:

```json
{
  "session": "<slug>",
  "design": {
    "track": "express|standard|full",
    "explore":  { "status": "done|pending|skipped", "mode": "conversa|mapeamento|null", "completedAt": "<ISO 8601>" },
    "research": { "status": "done|pending|skipped", "completedAt": "<ISO 8601>" },
    "architect": { "status": "done|pending", "completedAt": "<ISO 8601>" },
    "ideate":   { "status": "done|pending", "completedAt": "<ISO 8601>" },
    "ui":       { "status": "done|pending", "completedAt": "<ISO 8601>" },
    "validate": { "status": "done|pending", "completedAt": "<ISO 8601>" },
    "handoff":  {
      "status": "done|pending",
      "completedAt": "<ISO 8601>",
      "gateD": "aprovado|pendente",
      "qaRequired": true,
      "pmApproved": false,
      "pmApprovedAt": null,
      "devNotified": false,
      "devNotifiedAt": null
    },
    "qa":       { "status": "done|pending", "completedAt": "<ISO 8601>", "result": "aprovado|reprovado|pendente", "rounds": 0 },
    "iterate":  { "status": "done|pending", "completedAt": "<ISO 8601>" }
  }
}
```

---

## Governança — regra permanente em todas as fases

Se em qualquer momento o usuário (Designer, PM ou Dev) propuser algo que contradiga `docs/design-context/`, exibir:

```
⚠ AVISO DE DESIGN GOVERNANCE

O que foi proposto diverge do Design Context do projeto:
  Arquivo: docs/design-context/<arquivo>.md
  Conflito: <descrever o conflito>

Este documento é a fonte de verdade de design e não pode ser alterado durante o fluxo de uma feature.

Opções:
  [1] Ajustar a proposta para respeitar o Design Context
  [2] Prosseguir documentando a divergência (será sinalizada no GATE-D)
  [3] Abrir /cortex:design-update em uma sessão separada para propor alteração formal
```

---

## Restrições absolutas

**PROIBIDO em todas as fases:**
- Alterar `docs/design-context/` — somente via `/cortex:design-update`
- Gerar código de produção
- Declarar GATE-D aprovado com itens incompletos
- Assumir componentes sem verificar `docs/design-context/components.md`
- Chamar `use_figma` sem antes carregar a skill `figma:figma-use` (GATE obrigatório — pular causa falhas silenciosas)
- Usar `use_figma` e `generate_figma_design` como equivalentes — são complementares:
  - `use_figma` → design novo a partir da spec, usando DS real (fluxo forward)
  - `generate_figma_design` → trazer UI de código existente para o Figma (sinc reversa)

**Se o usuário pedir código:**
```
Modo Design ativo — responsável por especificação visual e documentação.
Para implementação: feche o design aqui → Dev usa /cortex:execution com slug: <slug>
```
