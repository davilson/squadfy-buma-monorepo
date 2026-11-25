# Framework Cortex — Guia Único

> Substitui `cortex-system-guide.md`, `cortex-usability-guide.md`, `context-window-strategy.md` e
> `token-cost-guide.md`, que se sobrepunham entre si e divergiam das definições reais.
>
> **Princípio deste guia:** ele explica *quando* usar cada coisa e *por quê*. O *como* — passos, gates,
> formatos de saída — vive nos arquivos de modo em `.claude/commands/cortex/`, que são a única fonte
> de verdade. Este guia nunca repete os passos de um modo.

---

## 1. O que é

Framework de desenvolvimento assistido por IA com três garantias:

1. **ADR-first** — nenhum código é escrito antes de mapear as decisões de arquitetura aplicáveis.
2. **Fail loud, never silent** — contexto ausente ou inconsistente bloqueia, nunca é adivinhado.
3. **Fronteira de perfil** — cada dev opera só no seu domínio. Ver `.claude/profiles/README.md`.

Tudo que o Cortex sabe sobre o projeto vem de `docs/`. Nada vem de memória.

---

## 2. Estrutura

```
.claude/
  commands/cortex/     modos — boot, strategy, execution, design, modify, bug, platform-task, idea
  commands/<ns>/       comandos auxiliares — product, design, engineer, docs-commands, integrations, ...
  profiles/            perfil ativo + README.md (fronteira, matriz de escrita e de agentes)
  guides/boot-*.md     o que cada perfil carrega no boot
  agents/<dominio>/    agentes por domínio — a pasta define o domínio
docs/
  technical-context/   briefing, critical-rules, adrs-summary, tech-stack
  business-context/    features, backlog
  design-context/      design system, ux-principles, componentes
  .cortex/             cache do boot + sessions/<slug>/
```

### Caminho legado

O Cortex v1.x funcionava com `commands/cortex/*.md` como wrappers finos que carregavam
`.claude/master/cortex-*.md`. No v2.0.0 esse conteúdo passou a viver inline nos comandos.

**O caminho legado continua existindo e funcionando** — `.claude/master/` e os comandos diretos
(`/engineer:start`, `/engineer:work`, `/product:task`, `/product:sync-linear`, …) seguem disponíveis
para quem já tem fluxo montado em cima deles.

O que muda é para onde aponta a força: **`/cortex:boot` é a entrada recomendada.** É por ele que
passam perfil, GATE 0, cache, manifesto e roteamento — nada disso existe no caminho direto. Os
comandos legados não recebem features novas e `.claude/master/` está congelado em `v1.8.1`.

---

Uma **session** é uma unidade de trabalho em `docs/.cortex/sessions/<slug>/`:
`context.md` (o quê e por quê) → `architecture.md` (como) → `design/design.md` (telas) → `plan.md` (fases).

**Status da session** — `in_progress` (spec em aberto) → `spec_closed` (GATE 2 aprovado, ou GATE-B em
bug, pronta para implementar) → `closed` (PR mergeado). `closed` é escrito **somente** por
`/engineer:pr`; o Execution lista as sessions que não estão `closed`. Semântica completa em
`commands/cortex/boot.md`, PASSO 3.4.

**Slug obrigatório:** `^(epic|feature|bug|refactor)-\d{3}-[a-z0-9]+(-[a-z0-9]+)*$`
Válido: `epic-004-landing-page` · Inválido: `epic4`, `EPIC-004`, `epic-004-página`

---

## 3. Gates

| Gate | Onde | Verifica |
|---|---|---|
| GATE 0 | Boot | `docs/` íntegro para o perfil ativo |
| GATE 2 | Strategy / Modify / Platform Task | spec fechada: `context.md` + `architecture.md` completos |
| GATE-M | Modify | mapa de impacto e não-regressão antes da delta spec |
| GATE-B | Bug | root cause identificado + plano de correção mínimo |
| GATE-D | Design → Handoff | cobertura de todas as telas, estados e edge cases |
| GATE 3 | Execution, **por arquivo** | fronteira de perfil, ADRs aplicáveis, fidelidade ao design |
| GATE 4 | Execution, na ativação | `plan.md` consistente com `architecture.md` e com o disco |
| GATE VERDE | Execution, **por fase** | `typecheck` + `build` + `test` passam — é o único gate que executa código |
| GATE 5 | Execution → Pre-PR | todas as fases concluídas com GATE VERDE, nada pulado sem registro |
| GATE-B2 | Bug, pós-fix | sintoma resolvido, regressão verificada, escopo respeitado, branch verde |

Gate reprovado **para**. Não existe "prosseguir por padrão" — o modo espera instrução explícita.

---

## 4. Como iniciar

```
/cortex:boot
```

O boot resolve o perfil em silêncio, valida `docs/`, carrega o contexto (com cache) e roteia.
**Se sua mensagem já diz o que você quer fazer, ele roteia direto — sem menu.** Ex:

```
/cortex:boot vou implementar a feature-012-user-auth     → execution
/cortex:boot erro 500 no checkout, stack trace anexo     → bug
/cortex:boot PROJ-441 do Jira, sem spec                  → platform-task
/cortex:boot tive uma ideia: exportar relatório em CSV   → idea
```

Sem sinal claro, ele pergunta uma vez.

---

## 5. Escolha do modo

| Situação | Modo |
|---|---|
| Projeto novo, sem `docs/` | `/docs-commands:init` e depois `/cortex:boot` |
| Feature nova do zero | STRATEGY → EPIC |
| Feature já existe, quero estender | STRATEGY → MODIFY |
| Ideia solta, sem compromisso ainda | IDEIA |
| Spec fechada, vou implementar | EXECUTION → IMPLEMENTAR TAREFA |
| Bug com sintoma conhecido | EXECUTION → BUG |
| Task do Jira/Linear/Trello/Asana/Monday sem spec | EXECUTION → TASK DE PLATAFORMA |
| Spec fechada, vou desenhar as telas | DESIGN |

A diferença que mais confunde:

- **Execution** parte de uma spec pronta.
- **Modify** parte do código que já existe — lê antes de especificar, e gera só o delta.
- **Platform Task** parte de uma task externa sem spec — cria a spec e devolve para o plan.
- **Bug** parte de um sintoma — root cause obrigatório, fix mínimo, sem refatoração de carona.

---

## 5.1 Handoffs

Todo handoff do Cortex passa pelo `sessions-manifest.json`. Ninguém avisa ninguém por fora: quem
entrega escreve no manifesto, e o boot de quem recebe exibe.

| De → Para | Gate | O que é escrito | Onde o receptor vê |
|---|---|---|---|
| Strategy / Modify / Platform Task → Execution | GATE 2 | `status: spec_closed` | menu do Execution |
| Strategy → Design | GATE 2 | `status: spec_closed` sem `design/` | bloco **Aguardando design** no boot do Designer |
| Design → Execution | GATE-D | `files["design/design.md"]`, `design.gateD: true`, `design.qaRequired` | `🎨 design pronto` no boot do Dev |
| PM → Execution | aprovação no Linear | `design.pmApproved: true` | `🎨 design pronto` vs `— PM não liberou`. **Sinal, não bloqueio** |
| Execution → Design QA | GATE 5 | `design.implementation: ready-for-qa` | boot do Designer + `/engineer:pr` bloqueia o merge |
| Execution → outro perfil | GATE 3 passo 0 | `pending_handoff: [{profile, files}]` | bloco **HANDOFF PARA VOCÊ** no boot daquele perfil |
| Bug → PR | GATE-B2 | `status: spec_closed`, depois `closed` | — |
| Platform Task → Plan | GATE 2 | `status: spec_closed` | `/engineer:plan` |
| Execution → PR | GATE 5 | `status: closed` (só no `/engineer:pr`) | — |
| Idea → Strategy | nenhum | nota em `business-context/backlog/` | `Backlog: N ideia(s)` no boot |

Regras:
- Quem aprova o gate escreve o manifesto **no mesmo passo**. Gate aprovado sem escrita no manifesto é
  handoff perdido.
- `design/manifest.json` é o estado interno do Designer (9 fases). Só os 3 campos de `design` no
  `sessions-manifest.json` são contrato com o Dev — o resto o Dev não lê.
- `pending_handoff` sobrevive ao `closed`: a session foi entregue no escopo de um perfil, mas o que
  ficou de fora continua endereçado até alguém pegar.
- `devNotified` no `design/manifest.json` é registro do post do Dev Brief no Linear. Não é canal de
  handoff nem gate — não espelhar.

### Caminho solo

Um handoff pendente não prende o Dev. Só a **fronteira de perfil** é bloqueio absoluto; todo insumo de
outro perfil é dispensável.

| Insumo | `solo.skipped` | Dispensável | Como |
|---|---|---|---|
| Liberação do PM (`pmApproved`) | `pm-approval` | sim | PASSO 4B do Execution → `[B]` |
| Spec de design (`design.md`) | `design-spec` | sim | PASSO 4B do Execution → `[B]` |
| QA de design (`qaRequired`) | `design-qa` | sim | `/engineer:pr` deixa de bloquear o merge |
| `context.md` + `architecture.md` | — | **não** | sem spec, usar `/cortex:platform-task` ou `/cortex:bug` |
| Fronteira de perfil | — | **não** | só `/cortex:set-profile` |

Ao escolher `[B]`, o Execution grava `solo: {declared_at, profile, skipped[], reason}` no manifesto e
**para de perguntar** — o mesmo aviso não reaparece no GATE 3 nem no GATE 5. O `/engineer:pr` declara
o que foi dispensado e por quê, e o boot mostra `⚡ solo: <skipped>` na session.

Solo dispensa insumo de terceiro, nunca verificação do próprio trabalho: GATE 3, GATE VERDE e GATE 5
rodam idênticos.

---

## 6. Janelas de contexto

Uma janela que planeja e implementa a mesma feature acumula contexto de planejamento
que já não serve para nada durante a implementação, e o modelo perde precisão no fim.
Por isso o trabalho é separado:

| Janela | Modo | Papel |
|---|---|---|
| 1 | Strategy / Modify / Platform Task / Idea | PO, Tech Lead |
| 2 | Execution | Dev |
| 3 | Design | Designer — em paralelo com a 2, após GATE 2 |

**Abrir nova janela quando:** o modo muda (planejar → implementar), ou o épico muda.
**Não abrir quando:** é outra fase do mesmo `plan.md`, outro arquivo da mesma fase, ou um bug pequeno
dentro do épico atual.

### Paralelismo Design × Dev

Depois do GATE 2 os dois correm juntos. O Dev não fica bloqueado:

| Dev faz sem `design.md` | Dev aguarda `design.md` |
|---|---|
| API e endpoints | componentes de UI |
| lógica de negócio | telas e layouts |
| migrations | fluxos de navegação |
| testes de domínio | formulários |

---

## 7. Custo de token

O boot lê `docs/` uma vez por janela e grava um cache em `docs/.cortex/`:
`.cortex-context.json` (resumos), `.cortex-index.json` (ADRs por keyword) e
`.cortex-fingerprint.json` (size + mtime + sha256 dos arquivos lidos).

| Situação | Custo |
|---|---|
| Boot, cache hit | baixo — lê o fingerprint e o context comprimido |
| Boot, cache miss | alto — relê `docs/`, regenera cache e fingerprint |
| Strategy / Execution após boot na mesma janela | ~0 de contexto — reusa CORTEX_CONTEXT |
| Strategy / Execution em janela nova | revalida fingerprint; se mudou, exige boot |
| GATE 3 por arquivo | baixo — lookup no index; só relê `adrs-summary.md` sem match |

**Regras de economia:**
- Nunca reler `docs/` se o boot já rodou nesta janela.
- Cada perfil lê só o que precisa (ver `guides/boot-*.md`): Designer não lê ADRs, Engineer não lê design-context.
- Carregar spec de design detalhada (`design/archive/`) só sob demanda, por tela.
- Fechar a janela ao terminar o modo. Contexto morto custa em toda mensagem seguinte.

---

## 8. Comandos

### Cortex
| Comando | Uso |
|---|---|
| `/cortex:boot` | ponto de entrada — perfil, contexto, roteamento |
| `/cortex:set-profile` | única forma de trocar de perfil |
| `/cortex:strategy` | épico novo: brainstorm → spec → GATE 2 |
| `/cortex:modify` | feature existente: lê código → delta spec |
| `/cortex:idea` | captação leve no backlog, sem session |
| `/cortex:platform-task` | task externa sem spec → cria a spec |
| `/cortex:execution` | implementação faseada com GATE 3/4/VERDE/5 |
| `/cortex:bug` | root cause → fix mínimo → verificação |
| `/cortex:design` | ciclo de design, fases 0–8 |

### Engenharia
`/engineer:warm-up` · `/engineer:start` · `/engineer:plan` (cria `plan.md` faseado) · `/engineer:work`
`/engineer:pre-pr` (GATE 5) · `/engineer:pr` · `/engineer:docs` · `/engineer:discover` · `/engineer:bump`

### Manutenção do framework
`npm run doctor` — valida o próprio Cortex: referências a agentes e comandos que não existem, arquivos
citados que foram removidos, uso indevido do status `closed` e divergência de versão. Roda em CI a cada PR.
Rodar sempre que renomear ou remover um agente/comando.

### Produto
`/product:brainstorm` `/product:collect` `/product:check` `/product:refine` `/product:spec`
`/product:light-arch` `/product:roadmap` `/product:measure` `/product:ai-feature-design` `/product:warm-up`
`/product:task` `/product:setup-linear` `/product:sync-linear` `/product:setup-github` `/product:sync-github`

### Documentação e integrações
`/docs-commands:init` (orquestra a criação de `docs/`) · `/docs-commands:discover` `/docs-commands:build-tech-docs`
`/docs-commands:build-business-docs` `/docs-commands:build-design-docs`
`/integrations:linear` `/integrations:github` — entrada unificada, opt-in
`/cortex:design-update` — único caminho para alterar `docs/design-context/`
`/design:*` — fases individuais do ciclo de design
`/report:*` `/docx:*` `/figma:*` `/meta:create-agent`

---

## 9. Diagnóstico

| Sintoma | Causa | Ação |
|---|---|---|
| `GATE 0 FALHOU` | arquivo obrigatório de `docs/` ausente | `/docs-commands:init` |
| `BLOQUEADO: CORTEX_CONTEXT ausente` | cache não gerado | `/cortex:boot` |
| `DETECTADA MUDANÇA EM docs/` | `docs/` editado após o boot | `/cortex:boot` |
| `BLOQUEADO: Spec não encontrada` | session sem `context.md`/`architecture.md` | `/cortex:strategy` ou `/cortex:platform-task` |
| `GATE 4 ALERTA` | `plan.md` mais antigo que `architecture.md`, ou fase ✓ sem arquivo no disco | recriar o plan ou corrigir a marcação |
| `GATE VERDE FALHOU` | build, typecheck ou teste quebrado na fase | corrigir antes de avançar — a fase não fecha |
| Perguntado várias vezes sobre a mesma spec de design | `solo` não foi gravado no manifesto na primeira vez | conferir `solo.skipped` da session |
| Dev travado esperando o PM | `pmApproved: false` tratado como bloqueio | é sinal — seguir em modo solo (`[B]` no PASSO 4B) |
| Handoff não chegou em ninguém | gate aprovado sem escrever no manifesto | conferir a tabela da seção 5.1 e gravar o campo que falta |
| Designer não vê a spec nova | session `spec_closed` mas o boot do Designer filtra só `in_progress` | conferir `guides/boot-designer.md` |
| Dev não sabe que o design ficou pronto | GATE-D não espelhou `design.*` no `sessions-manifest.json` | rodar `/cortex:boot` (o rescan relê `design/manifest.json`) |
| Session de bug nunca sai do menu | bug não passou por `/engineer:pr` | invocar `/engineer:pre-pr` → `/engineer:pr` |
| Session não aparece no Execution | status `closed` no manifesto (só `/engineer:pr` deve marcar) | corrigir para `spec_closed` e rodar `npm run doctor` |
| `FRONTEIRA DE PERFIL` | tarefa fora do domínio do perfil | encaminhar ao perfil correto, ou `/cortex:set-profile` |
| Boot pede o perfil toda hora | `cortex.profile` não persistiu | conferir `.claude/settings.local.json` |
| Bug cresceu além do escopo (>5 arquivos, muda arquitetura) | não era bug, é refactor | fechar a session e abrir `refactor-<NNN>-<descricao>` |
