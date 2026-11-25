# CORTEX DESIGN — FASE 3: IDEATE (v2.0)

> Fase 3 do processo de Product Design.
> Objetivo: explorar múltiplas alternativas de solução antes de comprometer com uma direção.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/concepts.md`
> Esta fase é sobre divergência — gerar quantidade antes de qualidade.

---

## Contexto desta fase

Antes de prototipar a solução certa, é necessário explorar várias soluções possíveis.
Comprometer-se com a primeira ideia é o caminho mais rápido para o retrabalho.

IDEATE é o momento de:
- Desenhar alternativas sem julgamento prévio
- Explorar a lógica e os trade-offs de cada abordagem
- Documentar o raciocínio por trás das decisões
- Convergir para uma direção antes de partir para o DESIGN

---

## Passo 1 — Carregar contexto

Ler (se existirem):
- `docs/.cortex/sessions/<slug>/design/archive/research.md` — problema, personas, oportunidades
- `docs/.cortex/sessions/<slug>/design/archive/flows.md` — jornadas, taskflows, inventário de telas
- `docs/design-context/ux-principles.md` — princípios que devem guiar as alternativas
- `docs/design-context/design-system.md` — DS e componentes disponíveis

Registrar internamente: o problema a resolver, as oportunidades identificadas, restrições de UX.

Se flows.md não existir:
```
Aviso: flows.md não encontrado. IDEATE é mais rico quando precedido de ARCHITECT.
Continuar sem arquitetura mapeada? [S/N]
```

### Checkpoint de Internalização — obrigatório antes de prosseguir

Após carregar os arquivos acima, exibir explicitamente:

```
DESIGN CONTEXT ATIVO — IDEATE

DS adotado: <nome extraído de design-system.md ou "não encontrado">
Princípios UX ativos: <listar os mais relevantes de ux-principles.md para geração de alternativas>
Componentes disponíveis: <listar os principais de components.md — não inventar componentes fora do DS>
Restrições de DS que limitam as alternativas:
  • <restrição 1 — ex: "não há componente de drawer no DS — usar modal">
  • <restrição 2>

Carry-forward:
  [Research] Problema central: "<extraído de archive/research.md ou 'fase não realizada'>"
  [Research] Personas: <lista ou "não definidas">
  [Architect] Telas mapeadas: <lista de archive/flows.md ou "fase não realizada">
  [Architect] Restrições de fluxo: <extraído de flows.md ou "não mapeadas">

Arquivos carregados: <lista> | Ausentes: <lista ou "nenhum">
```

Não prosseguir sem exibir este bloco. Alternativas propostas que usem componentes fora do DS ou contradigam os princípios listados → declarar como exceção antes de incluir.

---

## Passo 2 — Definir o problema a ser resolvido

Antes de gerar alternativas, alinhar o problema central:

```
Com base no que foi levantado até aqui:

PROBLEMA CENTRAL:
"<usuário> precisa <fazer X> mas <obstáculo/dor atual>"

CRITÉRIOS DE SUCESSO desta solução:
  • <critério 1 — o que indica que resolvemos o problema>
  • <critério 2>

RESTRIÇÕES:
  • <restrição técnica ou de negócio que limita as alternativas>
  • <restrição de prazo, escopo, etc.>

Confirmar antes de gerar alternativas? [S/N]
```

---

## Passo 3 — Brainstorm de alternativas

Gerar **ao menos 3 alternativas** de solução. Para cada uma:

```
### Alternativa <N> — <nome curto da abordagem>

**Conceito:**
<descrição em 2-3 frases — o que é essa abordagem e como resolve o problema>

**Lógica / raciocínio:**
<por que faz sentido para o usuário — qual mental model está sendo aproveitado>

**Fluxo resumido:**
  1. <passo 1 do usuário>
  2. <passo 2>
  N. <resultado>

**Rascunho / sketch conceitual:**
<descrição textual do layout ou estrutura — onde ficam os elementos principais>
[ou link para sketch externo: Figma, FigJam, foto de papel, etc.]

**Componentes do DS que seriam usados:**
  • <componente>

**Pontos fortes:**
  • <vantagem 1>
  • <vantagem 2>

**Pontos fracos / riscos:**
  • <risco 1>
  • <risco 2>

**Nível de esforço estimado:** Baixo / Médio / Alto
```

---

## Passo 4 — Análise comparativa

Após gerar todas as alternativas, comparar:

```
## Comparativo de alternativas

| Critério | Alt. 1 | Alt. 2 | Alt. 3 |
|----------|--------|--------|--------|
| Resolve o problema central | <sim/parcial/não> | — | — |
| Alinhamento com UX principles | <alto/médio/baixo> | — | — |
| Complexidade para o usuário | <baixa/média/alta> | — | — |
| Esforço de implementação | <baixo/médio/alto> | — | — |
| Risco de regressão em features existentes | <baixo/médio/alto> | — | — |
| Uso de componentes do DS | <alto/médio/baixo> | — | — |

**Alternativa mais forte:** Alt. <N> — <justificativa em 1 frase>
**Segunda opção:** Alt. <N> — <quando seria preferível>
```

---

## Passo 5 — Decisão de direção

```
## Decisão

**Alternativa escolhida:** Alt. <N> — <nome>

**Por que esta:**
<justificativa — o que a diferencia das demais no contexto deste problema>

**O que será descartado das outras alternativas:**
<elementos das alternativas não escolhidas que não serão aproveitados>

**O que pode ser aproveitado das outras alternativas:**
<elementos das alternativas não escolhidas que podem enriquecer a solução escolhida>

**Próximo passo:**
Avançar para Fase 4 — DESIGN com a direção: <nome da alternativa escolhida>
```

---

## Passo 6 — Registrar link de materiais externos

Se o Designer trabalhou com sketches físicos, FigJam, Miro ou outro:

```
## Materiais de ideação

| Formato | Link / Referência | Descrição |
|---------|------------------|-----------|
| FigJam | <link> | <o que contém> |
| Sketch (foto) | <link ou "arquivo local"> | — |
| Miro | <link> | — |
| Outro | — | — |
```

---

## Passo 6B — Exploração de Motion (opcional)

> Executar quando alguma alternativa escolhida envolve transições de estado, animações de entrada/saída, feedback visual temporal ou microinterações.
> Referência: `docs/design-context/motion-principles.md` (se existir).
> Pular se a feature não tiver componente visual com movimento.

Perguntar ao Designer:

```
A solução escolhida envolve algum destes elementos?
  [ ] Transição entre telas ou estados (loading → success, empty → preenchido)
  [ ] Animação de entrada ou saída de componente (drawer, modal, toast)
  [ ] Feedback visual de ação do usuário (clique, submit, drag)
  [ ] Microinteração decorativa (hover state, toggle, progresso)

Se nenhum: pular este passo.
```

Se ao menos 1 item marcado, documentar para cada interação identificada:

```
**Interação:** <nome — ex: "abrir drawer de detalhes">

1. Esta interação precisa comunicar algo ao usuário?
   → <o que deve ser percebido: rapidez / confirmação / continuidade / ênfase>

2. Qual emoção queremos transmitir?
   → <calma / agilidade / leveza / peso / celebração>

3. Existe padrão equivalente em motion-principles.md?
   → [ ] Sim — referenciar: <nome do padrão>
   → [ ] Não — propor conceito: <descrição livre da intenção>
   → [ ] Não sei / não há motion-principles.md — registrar intenção para o Designer decidir em HANDOFF
```

**Saída:** seção `## Motion Conceitual` adicionada ao concepts.md (ver Passo 7).

---

## Passo 7 — Gerar concepts.md

Criar `docs/.cortex/sessions/<slug>/design/archive/concepts.md`:

```markdown
# Conceitos e Ideação: <nome da feature>

**Status:** done
**Slug:** <slug>
**Fase:** 3 — Ideate
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>

---

## Problema central

<conteúdo do Passo 2>

---

## Alternativas exploradas

<conteúdo do Passo 3 — todas as alternativas>

---

## Comparativo

<conteúdo do Passo 4>

---

## Decisão

<conteúdo do Passo 5>

---

## Materiais de ideação

<conteúdo do Passo 6 ou "N/A">

---

## Motion Conceitual

<conteúdo do Passo 6B — ou "N/A (sem componentes com movimento)">
```

**Atualizar manifesto:** `design.ideate.status = "done"`

Exibir ao concluir:
```
IDEATE concluído.
Artefato: docs/.cortex/sessions/<slug>/design/archive/concepts.md ✓
Direção escolhida: <nome da alternativa>

Próximo passo recomendado: Fase 4 — DESIGN
  → Prototipar a alternativa escolhida com fidelidade crescente.
```
