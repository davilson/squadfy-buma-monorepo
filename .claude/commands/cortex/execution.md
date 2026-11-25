Você está ativando o **Cortex Execution Mode** — Janela 2: Execução Técnica.

## Verificar Boot

Se `/cortex:boot` já foi executado nesta janela com GATE 0 aprovado:
→ Usar CORTEX_CONTEXT já carregado (não recarregar docs/)

Se boot não foi executado (nova janela):
→ Executar boot primeiro (`/cortex:boot`) — após GATE 0 aprovado, continuar.

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

## Sub-modos

- **[1] IMPLEMENTAR TAREFA** → seguir o fluxo principal abaixo (PASSO 1 a 6)
- **[2] BUG** → usar a ferramenta `Skill` com nome `cortex:bug`
- **[3] TASK DE PLATAFORMA** → usar a ferramenta `Skill` com nome `cortex:platform-task`
  - Task vinda de Jira, Linear, Trello, Asana ou Monday.com
  - Sem sessão de trabalho iniciada (sem context.md + architecture.md)
  - Cria context.md + architecture.md a partir da task da plataforma
  - Encaminha para `/engineer:plan` após spec aprovada

Só iniciar implementação após todos os passos e confirmação de dependências.

## Durante a Execução

- Por arquivo: GATE 3 (fronteira de perfil + ADR mapping) antes de escrever qualquer código
- Por fase: GATE VERDE (build + test + typecheck) — bloqueante — e, se houve UI, `design-compliance-checker` uma vez
- Antes de `/pre-pr`: GATE 5

---

# CORTEX EXECUTION MASTER (v2.0.0)

> Modo genérico de execução. Ativo na Janela 2 — Execução Técnica.
> Regras do projeto são lidas de `docs/` — nunca assumidas de memória.
> Aplica GATE 3 (ADR mapping) antes de cada arquivo, GATE 4 (plan consistency) na ativação
> e GATE VERDE (build + test + typecheck) ao fim de cada fase.
> Este modo NÃO redefine arquitetura.

---

## Pré-condições Obrigatórias

**Nesta ordem:**
1. Boot executado com GATE 0 aprovado
2. `context.md` e `architecture.md` existem em `docs/.cortex/sessions/<slug>/`
3. GATE 2 foi aprovado pela Strategy Mode (spec fechada)

Se qualquer pré-condição falhar → bloqueio imediato com mensagem clara.

---

## Escopo de Responsabilidade

```
start → plan → work → pre-pr → pr
```

---

## Restrições Absolutas

**PROIBIDO:**
- Redefinir arquitetura já validada no `architecture.md`
- Alterar regras de negócio sem aprovação explícita
- Iniciar implementação sem `context.md` + `architecture.md`
- Assumir stack, ADRs ou regras de memória — sempre ler de `docs/`
- Assumir que env vars, arquivos externos ou serviços existem
- Editar qualquer arquivo em `docs/.cortex/sessions/<slug>/design/` ou `docs/design-context/` — somente o Designer via `/cortex:design` pode modificar esses arquivos

**Se houver inconsistência detectada durante implementação:**
```
INCONSISTÊNCIA DETECTADA
Arquivo: <arquivo>
Esperado (architecture.md): <o que diz a spec>
Encontrado: <o que o código exige>
Impacto: <o que quebra>

Opções:
  A) Ajustar spec no architecture.md
  B) Documentar contorno como trade-off
  C) Escalar para Strategy Mode
Aguardando instrução. NÃO prosseguir automaticamente.
```

---

## Sequência de Ativação

### PASSO 1 — Verificar CORTEX_CONTEXT + VALIDAR FINGERPRINT

1. Se Boot foi executado nesta janela: usar contexto existente.
2. Se não: executar boot completo (`/cortex:boot`) e aguardar GATE 0 antes de continuar.
3. **VALIDAR FINGERPRINT:**
   - Se Boot foi executado nesta mesma janela → fingerprint já validado pelo Boot.
     **SKIP**: não revalidar.
   - Se esta é uma nova janela de Execution (sem Boot prévio nela):
     - Ler `docs/.cortex/.cortex-fingerprint.json`
     - Para cada arquivo listado, obter mtime real via Bash (NUNCA assumir):
       ```bash
       stat -f%m <arquivo>   # macOS
       stat -c%Y <arquivo>   # Linux
       ```
     - Comparar com o `mtime` registrado no fingerprint
     - Se ALGUM arquivo mudou:
       ```
       DETECTADA MUDANÇA EM docs/
       Arquivo(s) modificado(s): <lista>
       Execute /cortex:boot para atualizar contexto.
       NÃO PROSSIGA — contexto pode estar desatualizado.
       ```

### PASSO 2 — Selecionar tarefa via MANIFESTO

Listar as sessions **não entregues** do manifesto reconstruído (PASSO 3.4 do Boot) — ou seja,
status `spec_closed` ou `in_progress`. Sessions `closed` (já mergeadas) **não** entram na lista.

```
Tarefas disponíveis para implementar:

  [1] feature-007-user-auth       spec_closed  ✓ ctx ✓ arch ✓ plan
  [2] epic-002-rag-knowledge-base spec_closed  ✓ ctx ✓ arch ✗ plan
  [3] feature-009-dashboard       in_progress  ✓ ctx ✗ arch — spec incompleta
  ...

  [N] Informar slug manualmente
```

Usar AskUserQuestion com as opções acima para o usuário selecionar.
Sessions `in_progress` com spec incompleta podem ser selecionadas, mas o PASSO 3 bloqueia até a spec fechar.

Se nenhuma session `spec_closed` ou `in_progress` existir:
```
Nenhuma tarefa em andamento encontrada.
Execute /cortex:strategy para criar uma nova spec.
```

Após seleção, exibir confirmação:
```
Tarefa selecionada: <slug>
  context.md [✓/✗] — architecture.md [✓/✗] — plan.md [✓/✗]
```

Se o usuário escolher "Informar slug manualmente": solicitar slug, validar padrão e verificar no manifesto.

### PASSO 3 — Verificar pré-requisitos (BLOQUEANTE)

```
docs/.cortex/sessions/<slug>/context.md         → OBRIGATÓRIO
docs/.cortex/sessions/<slug>/architecture.md    → OBRIGATÓRIO
```

**Se faltarem:**
```
BLOQUEADO: Spec não encontrada para slug "<slug>".
Execute /cortex:strategy para criar context.md + architecture.md.
```

### PASSO 4 — Carregar regras do projeto (via CORTEX_CONTEXT)

Usar `docs/.cortex/.cortex-context.json` (comprimido) se disponível:
- Ler `critical_rules_summary` para regras críticas
- Ler `adrs_summary` para lista de ADRs
- Se necessário detalhes completos: ler arquivos originais em `docs/technical-context/briefing/`

Se `docs/.cortex/.cortex-context.json` não existir:
```
BLOQUEADO: CORTEX_CONTEXT ausente em docs/.cortex/.
Execute /cortex:boot para gerar índices.
```

### PASSO 4B — Carregar Design Spec (se existir)

Ler o bloco `design` da session no `sessions-manifest.json` — `gateD`, `qaRequired`, `pmApproved`,
`implementation`. **Não abrir `design/manifest.json`**: os 4 campos espelhados são o contrato com o Dev.

**Se `files["design/design.md"]` é `true`:**

Ler apenas o lean `design.md` — NÃO carregar arquivos de `design/archive/` neste momento.

Registrar internamente:
- Seção `## Ativos Protegidos`
- Seção `## Telas desta feature` ou `## Referência Visual` — inventário de telas
- `figmaAvailable` — indica se Figma é a referência visual

Exibir:
```
Design spec carregada: docs/.cortex/sessions/<slug>/design/design.md ✓
Modo: <Com Figma — referência visual no link acima / Sem Figma — spec em archive/design-spec.md>
Ativos protegidos registrados: <N itens>
QA de Design: <obrigatório antes do merge / dispensado pelo Designer>
Liberação do PM: <✓ liberado em <data> / ⏳ pendente>
```

> Spec visual detalhada disponível em `design/archive/design-spec.md` — carregar sob demanda apenas
> se o Dev precisar de detalhe visual de uma tela específica durante o GATE 3.

**Se `design.pmApproved` é `false` (design pronto, PM ainda não liberou):**

Isto é um **aviso, não um bloqueio**. O PM prioriza *quando* a feature entra; o design já está correto
e implementável.

```
DESIGN PRONTO — LIBERAÇÃO DO PM PENDENTE
GATE-D aprovado em <data>. O PM ainda não moveu a feature para Done no Linear.
Risco de começar agora: a prioridade pode mudar e o trabalho ser descartado.

  [A] Aguardar liberação do PM
  [B] Seguir agora (MODO SOLO — registrado na session e no PR)
```

**Se `files["design/design.md"]` é `false` e a feature tem UI:**
```
SEM SPEC DE DESIGN
A feature inclui telas ou componentes visuais e não há design.md nesta session.

  [A] Aguardar Designer executar /cortex:design → [6] HANDOFF
  [B] Seguir agora (MODO SOLO — registrado na session e no PR)
```

Se a feature não tem UI: silencioso, prosseguir.

---

### PASSO 4C — MODO SOLO (opcional, declarado uma vez)

O Dev pode seguir sem o insumo de outro perfil. O framework registra a decisão e **não pergunta de novo**.

Ao escolher `[B]` em qualquer ponto, gravar no `sessions-manifest.json` desta session:
```json
"solo": {
  "declared_at": "<ISO 8601>",
  "profile": "<CORTEX_PROFILE>",
  "skipped": ["design-spec" | "pm-approval" | "design-qa"],
  "reason": "<uma linha, informada pelo Dev>"
}
```

Regras do modo solo:
- **Declarado uma vez por insumo.** Se `solo.skipped` já contém o item, não reexibir o aviso — nem no
  PASSO 4B, nem no GATE 3, nem no GATE 5. Perguntar a mesma coisa três vezes é atrito, não governança.
- **Não relaxa gate nenhum.** GATE 3 (fronteira de perfil + ADRs), GATE VERDE e GATE 5 seguem idênticos.
  Solo dispensa o *insumo de outro perfil*, nunca a verificação do próprio trabalho.
- **Não dispensa a fronteira de perfil.** `FRONTEIRA DE PERFIL` continua bloqueio absoluto: solo permite
  seguir sem a spec de design, não escrever fora do seu domínio.
- **Fica no PR.** O `/engineer:pr` declara o que foi dispensado e por quê. O Designer e o PM veem depois.
- Se o insumo chegar no meio do caminho (design.md aparece, PM libera), o Execution avisa uma vez e
  oferece incorporar. Não força.

Ao declarar solo, exibir:
```
MODO SOLO ativo — dispensado: <lista>
Motivo: <razão>
Gates inalterados. Registrado em sessions-manifest.json e no PR.
```

---

### PASSO 5 — GATE 4: Consistência Automática Plan + Architecture

**Verificação 1 — Timestamps (sempre):**

Obter timestamps reais via Bash:
```bash
stat -f%m docs/.cortex/sessions/<slug>/plan.md          # macOS
stat -f%m docs/.cortex/sessions/<slug>/architecture.md  # macOS
stat -c%Y docs/.cortex/sessions/<slug>/plan.md          # Linux
stat -c%Y docs/.cortex/sessions/<slug>/architecture.md  # Linux
```

Se `architecture.md` mais recente que `plan.md`:
```
GATE 4 ALERTA ⚠: Plan pode estar desatualizado.
  plan.md:         <epoch>
  architecture.md: <epoch> (mais recente)
Opção A: Recriar plan.md baseado na architecture.md atual
Opção B: Prosseguir ciente do risco
Aguardando instrução.
```

**Verificação 2 — Cobertura de arquivos (se plan.md existir):**

1. Ler seção `## Estrutura de Arquivos` de `architecture.md` — extrair caminhos
2. Ler `plan.md` — verificar quais caminhos aparecem nas fases

Para cada arquivo em `architecture.md` **não encontrado** em `plan.md`:
```
GATE 4 ALERTA ⚠: "<path>" em architecture.md não coberto por nenhuma fase do plan.md.
```

**Verificação 3 — Realidade do disco (fases marcadas como ✓):**

Para cada fase marcada como `✓ concluída` em `plan.md`:
- Extrair caminhos de arquivos listados na fase
- Verificar existência via Bash:
  ```bash
  test -f <path> && echo "exists" || echo "missing"
  ```

Para cada arquivo ausente no disco mas marcado como ✓ concluído:
```
GATE 4 ALERTA ⚠: fase "<nome>" marcada ✓ mas "<path>" não existe no disco.
Possível: fase marcada incorretamente ou arquivo deletado.
```

**Saída consolidada do GATE 4:**
- Se nenhuma inconsistência → `GATE 4 ✓ — Plan consistente.`
- Se alertas → listar todos; aguardar instrução para Opção A ou B antes de continuar

### PASSO 6 — Exibir status e confirmar dependências

Verificar `docs/.cortex/sessions/<slug>/linear.json` para identificar subtask da disciplina:

```bash
cat docs/.cortex/sessions/<slug>/linear.json 2>/dev/null
```

Se existir, identificar subtask relevante para o Dev (backend ou frontend conforme disciplina).

```
Épico: <nome do context.md>
Objetivo: <uma linha>
Regras críticas do projeto: <contagem> regras carregadas
ADRs mapeadas: <contagem>
Linear: <subtask URL da disciplina — ex: subtasks.backend.url ou subtasks.frontend.url>
        (Atualizar status para "In Progress" ao iniciar)

DEPENDÊNCIAS NECESSÁRIAS:
[Ler seção "Dependências Externas" de architecture.md e listar:]
  [ ] <VAR/arquivo/serviço> — confirmado?
  [ ] ...

Confirmar dependências antes de prosseguir com implementação.
```

---

## Abordagem ADR-First — GATE 3 Incremental (obrigatório por arquivo)

**Antes de implementar qualquer arquivo, executar:**

### GATE 3 — ADR Mapping Incremental para <arquivo>

0. **Fronteira de perfil (bloqueante).** Classificar o arquivo por domínio (frontend / backend / infra / design / produto) pelo caminho e extensão e conferir contra a matriz de escrita de `.claude/profiles/README.md`.
   Fora do perfil → emitir `FRONTEIRA DE PERFIL`, remover o arquivo do escopo desta execução e seguir para o próximo. Não escrever. Não pedir override. Registrar em **dois** lugares:
   - `plan.md`: `⏸ fora do perfil (<perfil responsável>)`
   - `sessions-manifest.json`, em `pending_handoff` desta session: `{"profile": "<perfil responsável>", "files": [...]}` — agrupar por perfil, sem duplicar path

   O `pending_handoff` é o que faz o boot do outro perfil exibir `HANDOFF PARA VOCÊ`. Sem ele o arquivo fica órfão.

1. **Extrair keywords** do nome do arquivo:
   - Ex: `auth-component.tsx` → keywords: ["auth", "component"]
   - Ex: `page.tsx` → keywords: ["page"]
   - Ex: `viewModel.ts` → keywords: ["viewmodel", "state"]

2. **Lookup em CORTEX_INDEX** (`docs/.cortex/.cortex-index.json` - preenchido dinamicamente pelo Boot):
   - Para cada keyword, buscar em `adrs_by_keyword`
   - Unificar resultados sem duplicatas

3. **Se keywords encontradas no index:**
   ```
   GATE 3 [<arquivo>] via INDEX:
     ADR-NNN: <regra específica aplicável>
     ADR-NNN: <regra específica aplicável>
   OK — prosseguindo.
   ```

4. **Se keywords NÃO encontradas no index:**
   ```
   GATE 3 [<arquivo>] — sem match no INDEX. Lendo adrs-summary.md...
     ADR-NNN: <regra específica aplicável>
     ADR-NNN: <regra específica aplicável>
   OK — prosseguindo.
   ```

5. **Se arquivo de ADRs não pôde ser lido → PARAR. Não inventar regras.**

6. **Se o arquivo for de UI** (extensões: `.tsx`, `.jsx`, `.vue`, `.css`, `.scss`, `.styles.*`, ou path contém `/components/`, `/pages/`, `/screens/`, `/views/`):

   **6a. Fidelidade à spec da feature (`design.md`):**

   Se `docs/.cortex/sessions/<slug>/design/design.md` existir:
   - Componente genérico (Button, Input, Modal, hooks): checar apenas tokens e ativos protegidos globais
   - Tela/componente específico da spec: identificar o item no `design.md` e verificar estados (Normal/Loading/Empty/Error/Success), microcopy exato, motion e ativos protegidos antes de escrever código
   - Se divergência detectada → declarar `DIVERGÊNCIA DE DESIGN [GATE 3]` com spec × implementação prevista e aguardar: [A] Seguir spec [B] Documentar e prosseguir (registrado no PR) [C] Consultar Designer
   - PROIBIDO sem confirmação: substituir ícones/ilustrações especificados, usar cores hardcoded, alterar microcopy

   Se `design.md` não existir: registrar aviso e prosseguir.

   **6b. Conformidade com Design System global (`docs/design-context/`):**

   Checagem barata, sem subagente: usar o DNA de design já carregado (DS adotado, tokens, ativos
   protegidos globais) para evitar cor hardcoded, componente fora do DS e estado de feedback ausente.

   **NÃO invocar `design-compliance-checker` aqui.** A varredura completa do Design System roda
   **uma vez por fase**, sobre o diff da fase — ver `GATE VERDE` abaixo. Invocar por arquivo
   multiplica o custo pelo número de arquivos de UI sem ganho de cobertura.

   Se `docs/design-context/` não existir: pular e registrar aviso.

**Benefício do lookup incremental:**
- ~80% dos casos encontram ADRs via INDEX (sem reler arquivo)
- Apenas quando necessário: relê `adrs-summary.md` completo
- Economia média: ~120 tokens por arquivo

**NOTA: CORTEX_INDEX e CORTEX_CONTEXT são preenchidos dinamicamente pelo Boot com dados DO PROJETO ATUAL (docs/).**

---

## Durante o Work

- Avançar fase a fase conforme `plan.md`
- Ao final de cada fase, nesta ordem:
  1. Listar arquivos criados/modificados
  2. **GATE VERDE** (bloqueante — ver abaixo)
  3. Se a fase tocou arquivos de UI: invocar `design-compliance-checker` **uma vez**, sobre o diff da fase
  4. Atualizar `plan.md` com progresso real e aprendizados
  5. **ATUALIZAR MANIFESTO**: se plan.md foi criado → `files.plan.md: true`, `missing: [...]`
  6. Seguir para a próxima fase **sem pedir confirmação** se o GATE VERDE passou e não houve
     decisão pendente. Pausar e aguardar o usuário **só** quando: GATE VERDE falhou, houve
     `INCONSISTÊNCIA DETECTADA`, `DIVERGÊNCIA DE DESIGN`, `FRONTEIRA DE PERFIL`, ou a fase é a última.
- Se fase não concluída: marcar como `⚠ parcial` em `plan.md`, não como `✓`

### GATE VERDE — verificação executável por fase (bloqueante)

Uma fase só é marcada `✓ concluída` se o projeto compila e os testes passam. Marcação em markdown
não é evidência de nada.

Detectar os comandos do projeto (nesta ordem de preferência):
1. `package.json` → scripts `build`, `test`, `typecheck`/`lint`
2. `Makefile` → alvos `build`, `test`
3. `pyproject.toml` / `pytest.ini` → `pytest`
4. Outra stack → ler `docs/technical-context/briefing/tech-stack.md`

Executar o que existir:
```bash
npm run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || true
npm run build
npm test
```

Saída:
```
GATE VERDE [FASE X]
  typecheck: ✓ / ✗ / n/a
  build:     ✓ / ✗ / n/a
  test:      ✓ / ✗ / n/a  (<N> passando, <N> falhando)
```

**Se algum item falhar:**
```
GATE VERDE FALHOU [FASE X]
Comando: <comando>
Saída: <erro relevante>

A fase NÃO é marcada como ✓. Corrigir antes de avançar.
```

**Se o projeto não tem build nem teste algum:**
```
GATE VERDE n/a — projeto sem build e sem suíte de testes detectados.
Registrado no plan.md. Sem verificação executável, a conclusão da fase é declaratória.
```
Registrar isso no `plan.md` — é um risco, não um "ok".

**Formato de reporte por fase:**
```
[FASE X — <nome> — ✓ concluída]
Arquivos: <lista>
ADRs aplicadas: <lista>
GATE VERDE: typecheck ✓ | build ✓ | test ✓ (<N> testes)
Design compliance: <✓ / n/a — fase sem UI / <N> desvios registrados>
Próxima fase: <nome>
Dependências confirmadas: <lista ou "nenhuma adicional">
```

---

## GATE 5 — Pre-PR

Antes de invocar `/pre-pr`:

- [ ] Todas as fases do `plan.md` marcadas como `✓ concluída` **com GATE VERDE registrado**?
- [ ] `build`, `test` e `typecheck` passam no estado atual da branch (reexecutar agora)?
- [ ] `plan.md` tem aprendizados de cada fase registrados?
- [ ] Nenhum arquivo de `architecture.md` foi pulado — exceto os marcados `⏸ fora do perfil`?
- [ ] Arquivos `⏸ fora do perfil` gravados em `pending_handoff` e listados no PR com o perfil responsável?
- [ ] Se houve MODO SOLO: `solo` gravado no manifesto com motivo, e declarado no PR?

**Se a feature tem componentes de UI — verificação adicional de design:**

Checar se `docs/.cortex/sessions/<slug>/design/design.md` existe e GATE-D foi aprovado.

Se existir: verificar fidelidade à spec da feature (não re-executar `design-compliance-checker` global — já rodou uma vez por fase no GATE VERDE):
- Conferir divergências [B] registradas no PR: contar total
- Verificar se componentes implementados batem com os especificados no `design.md`
- Verificar se estados (loading, error, empty, success) foram implementados conforme spec
- Verificar se motion/interações foram implementados conforme especificado no `design.md`

**Threshold de re-avaliação de QA:** Se o total de divergências [B] registradas for ≥ 3:
```
ATENÇÃO: <N> divergências de design documentadas neste PR.
Independentemente do flag qaRequired, recomendado notificar o Designer antes do merge.
Prosseguir mesmo assim? [S/N]
```

Se threshold não atingido → verificar `qaRequired` no manifesto de design:

**Se `qaRequired: true`** (Designer exigiu QA neste handoff):

Se `solo.skipped` contém `design-qa`, pular este bloco: registrar no PR que o QA foi dispensado pelo Dev
em modo solo e seguir para o merge. A decisão é do Dev e fica auditável.


```
IMPLEMENTAÇÃO PRONTA PARA QA DE DESIGN

Ação do Dev — postar no Linear (comentário na task <slug>):

📋 Implementação pronta para QA de Design

Branch: <nome da branch>
Preview: <URL do preview — Vercel/Netlify/staging>
(Se não houver preview: compartilhar screenshots de todas as telas e estados)

Designer: executar /cortex:design → [7] QA para iniciar a revisão.
O PR permanece aberto até QA aprovado.
```

Atualizar `design/manifest.json`: `handoff.implementation = "ready-for-qa"`.
Espelhar no `sessions-manifest.json`: `design.implementation = "ready-for-qa"`.

**Se `qaRequired: false`** (Designer dispensou QA neste handoff):

```
QA de Design: dispensado pelo Designer para esta feature.
Spec verificada — PR pode prosseguir para merge após GATE 5.
```

Atualizar `design/manifest.json`: `handoff.implementation = "ready-for-merge"`.
Espelhar no `sessions-manifest.json`: `design.implementation = "ready-for-merge"`.

Se `design.md` não existir para feature com UI:

Se `solo.skipped` já contém `design-spec` → **não perguntar**. Registrar no PR e prosseguir.

Caso contrário:
```
Aviso: feature tem componentes de UI mas design.md não encontrado na session.
Recomendado: Designer executar /cortex:design → [6] HANDOFF antes de fechar o PR.
Opções:
  [A] Aguardar Designer executar /cortex:design → [6] HANDOFF
  [B] Seguir agora (MODO SOLO — registrado na session e no PR)
Aguardando instrução.
```

**Se qualquer item falhar:**
```
GATE 5 FALHOU
Fases pendentes: <lista>
Completar antes de executar /pre-pr.
```

---

## Checklist de Entrega (por arquivo)

```
[ ] Segue regras críticas de docs/technical-context/briefing/critical-rules.md?
[ ] Todas as ADRs mapeadas no GATE 3 foram respeitadas?
[ ] Estrutura de pastas conforme architecture.md?
[ ] Nenhuma dependência implícita não confirmada?
[ ] Arquivo dentro da matriz de escrita do perfil ativo (GATE 3 — 0)?
[ ] (se UI) Spec da feature respeitada: estados, edge cases, microcopy, motion e ativos protegidos conforme design.md (GATE 3 — 6a)
[ ] (se UI) Design System global respeitado: componentes do DS, tokens, UX principles, feedback states (GATE 3 — 6b + varredura por fase)
[ ] Fase fechada com GATE VERDE: typecheck, build e test passando
```
