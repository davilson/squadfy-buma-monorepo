# CORTEX DESIGN — FASE 1: RESEARCH (v2.0)

> Fase 1 do processo de Product Design.
> Objetivo: entender profundamente o problema antes de qualquer solução visual.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/research.md`
> GATE-R: ao menos personas ou JTBD definidos antes de avançar para ARCHITECT.

---

## Contexto desta fase

Research é onde o Designer investiga o problema, o usuário e o mercado.
Sem research, o design é opinião — com research, é decisão informada.

Esta fase pode acontecer:
- **Antes da spec fechada** (exploração de problema — ideal para projetos novos)
- **Em paralelo com Strategy** (research de UX enquanto PM define requisitos)
- **Após GATE 2** (validação de premissas de UX de uma spec já fechada)

---

## Passo 1 — Contexto do research

Perguntar ao usuário:

```
1. Esta é uma feature nova, melhoria de algo existente ou investigação de problema aberto?
2. Qual é a hipótese ou problema que motivou este research?
3. Qual é o prazo disponível para esta fase?
4. Quais recursos estão disponíveis? (usuários para entrevistar, dados de analytics, gravações de sessão, etc.)
```

Registrar internamente: tipo de research, hipótese central, restrições de tempo e recursos.

### Checkpoint de Internalização — obrigatório antes de prosseguir

Verificar `docs/design-context/` e exibir explicitamente:

```
DESIGN CONTEXT ATIVO — RESEARCH

DS adotado: <nome extraído de design-context/design-system.md ou "não encontrado">
Princípios UX ativos: <listar os mais relevantes de ux-principles.md ou "não encontrado">
Personas existentes: <listar de design-context/ se houver, ou "a definir nesta fase">
Tom de voz: <regras de content-guidelines.md relevantes para este research, ou "não encontrado">

Arquivos carregados: <lista> | Ausentes: <lista ou "nenhum">
```

Se `docs/design-context/` não existir: exibir bloco com todos os campos como "não encontrado" e prosseguir.
Não pular este bloco — ele confirma o que está disponível como referência antes de iniciar.

---

## Passo 2 — Definir escopo e métodos

Com base no contexto, sugerir os métodos mais adequados e confirmar com o usuário quais serão executados:

### Métodos disponíveis

**Pesquisa com usuários:**
- [ ] Entrevistas em profundidade (qualitativo — entender motivações)
- [ ] Testes de usabilidade exploratórios (qualitativo — observar comportamento)
- [ ] Survey / questionário (quantitativo — validar hipóteses em escala)

**Pesquisa de dados:**
- [ ] Análise de analytics (quantitativo — onde os usuários chegam e saem)
- [ ] Análise de heatmaps (quantitativo — onde clicam e onde param)
- [ ] Gravações de sessão (qualitativo/quantitativo — o que fazem na prática)
- [ ] Análise de suporte/tickets (qualitativo — o que reclamam)

**Pesquisa de mercado:**
- [ ] Desk research / benchmarking competitivo
- [ ] Análise de avaliações de concorrentes (App Store, G2, Capterra)
- [ ] Pesquisa de tendências de mercado

Exibir seleção e confirmar:
```
Métodos selecionados para este research:
  • <método 1>
  • <método 2>
Confirmar? [S/N]
```

---

## Passo 3 — Estruturar e documentar os achados

Para cada método executado, documentar os achados no formato abaixo.

### 3.1 Entrevistas com usuários

Para cada entrevista realizada:

```
**Entrevistado:** <perfil/persona — nunca nome real>
**Duração:** <tempo>
**Contexto:** <o que esta pessoa faz / como usa o produto>

Principais achados:
  • <achado 1>
  • <achado 2>

Citações relevantes:
  • "<citação literal>"

Dores identificadas:
  • <dor 1>

Comportamentos observados:
  • <comportamento 1>
```

### 3.2 Análise de dados (analytics / heatmaps / gravações)

```
**Fonte:** <Google Analytics / Hotjar / FullStory / outro>
**Período analisado:** <data início> a <data fim>
**Volume:** <N sessões / usuários analisados>

Principais métricas:
  • <métrica e valor>

Padrões identificados:
  • <padrão 1>

Pontos de abandono:
  • <onde os usuários saem / param>

Insights:
  • <insight 1>
```

### 3.3 Benchmarking competitivo

```
**Concorrente / Referência:** <nome>
**URL:** <link>

O que fazem bem (UX/UI):
  • <ponto positivo>

O que fazem mal:
  • <ponto negativo>

O que podemos aprender:
  • <aprendizado>
```

---

### 3.4 Análise de conteúdo

> Executar quando a feature envolve textos, nomenclaturas, mensagens de estado ou comunicação com o usuário.
> Referência: `docs/design-context/content-guidelines.md` (se existir).

```
**Área analisada:** <tela, fluxo ou produto como um todo>

Conteúdo existente hoje:
  • <label / mensagem / nomenclatura observada>
  • <label / mensagem / nomenclatura observada>

Tom de voz atual vs. tom esperado (conforme content-guidelines.md):
  Atual:    <formal / informal / técnico / amigável / ...>
  Esperado: <o que o Design Context ou personas indicam>
  Alinhado? <sim / parcialmente / não>

Inconsistências ou problemas identificados:
  • <nomenclatura inconsistente entre telas>
  • <mensagem de erro genérica sem ação clara>
  • <label técnico que o usuário não entende>

Gaps de conteúdo (o que falta):
  • <estado vazio sem mensagem>
  • <ação sem confirmação textual>
  • <contexto de ajuda ausente>

Oportunidades de conteúdo:
  • <simplificar linguagem em X>
  • <adicionar microcopy de reassurance em Y>
```

---

## Passo 4 — Sintetizar personas e JTBD

### Personas (se ainda não definidas em docs/design-context/)

Para cada persona identificada:

```
**Persona:** <nome fictício>
**Perfil:** <cargo, contexto de uso>
**Objetivo principal:** <o que quer alcançar com o produto>
**Frustrações atuais:** <o que a impede de atingir o objetivo>
**Comportamento digital:** <como usa tecnologia — nível de familiaridade>
**Citação representativa:** "<fala que captura a essência desta persona>"
```

### Jobs-to-be-Done (JTBD)

Formato: "Quando [situação], quero [motivação], para [resultado esperado]."

```
  • Quando <situação>, quero <motivação>, para <resultado>.
  • Quando <situação>, quero <motivação>, para <resultado>.
```

---

## Passo 5 — Síntese e oportunidades

```
## Síntese do Research

**Hipótese inicial:** <o que acreditávamos>
**O que o research confirmou:** <o que é verdade>
**O que o research refutou:** <o que não é verdade>
**Surpresas:** <o que não esperávamos descobrir>

## Oportunidades de design identificadas

  1. <oportunidade 1 — problema a resolver>
  2. <oportunidade 2>
  3. <oportunidade 3>

## Como to-be (visão de futuro)

<descrição em 2-3 frases de como o usuário deveria experienciar o produto após a solução ser implementada>
```

---

## GATE-R — Verificação antes de avançar

**Checklist:**
- [ ] Ao menos 1 método de research executado e documentado
- [ ] Personas definidas OU JTBD definidos (ao menos um dos dois)
- [ ] Ao menos 1 oportunidade de design identificada
- [ ] Hipótese inicial validada ou refutada com base em dados

**Se itens estiverem incompletos:**
```
GATE-R — Research incompleto.
Itens pendentes:
  • <lista>
Recomendado completar antes de avançar para ARCHITECT.
Avançar mesmo assim? [S/N]
```

**Se todos os itens estiverem completos:**
```
GATE-R APROVADO — Research documentado.
Artefato: docs/.cortex/sessions/<slug>/design/archive/research.md ✓

Próximo passo recomendado: Fase 2 — ARCHITECT
  → Mapear jornadas e fluxos com base nos achados do research.
```

---

## Passo 6 — Gerar research.md

Criar `docs/.cortex/sessions/<slug>/design/archive/research.md`:

```markdown
# Research: <nome da feature ou problema>

**Status:** done
**Slug:** <slug>
**Fase:** 1 — Research
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>

---

## Contexto

**Hipótese / Problema:** <hipótese central>
**Tipo:** <feature nova / melhoria / investigação>

---

## Métodos utilizados

<lista dos métodos executados>

---

## Achados por método

<conteúdo estruturado por método — ver Passo 3>

---

## Análise de conteúdo

<conteúdo do Passo 3.4 — ou "N/A (sem análise de conteúdo)">

---

## Personas

<personas identificadas ou referência às personas de docs/design-context/>

---

## Jobs-to-be-Done

<JTBDs identificados>

---

## Síntese

<conteúdo do Passo 5>

---

## Oportunidades de design

1. <oportunidade 1>
2. <oportunidade 2>
```

**Atualizar manifesto:** `design.research.status = "done"`
