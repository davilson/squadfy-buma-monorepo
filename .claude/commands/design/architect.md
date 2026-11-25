# CORTEX DESIGN — FASE 2: ARCHITECT (v2.0)

> Fase 2 do processo de Product Design.
> Objetivo: estruturar jornadas, fluxos e arquitetura de informação antes de qualquer visual.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/flows.md`
> GATE-AI: jornadas e fluxos mapeados antes de avançar para DESIGN.

---

## Contexto desta fase

Arquitetura de informação e fluxos definem **como o usuário navega e realiza tarefas**.
Wireframes sem fluxo são decoração. Fluxo sem research são suposições.

Esta fase traduz os achados do Research (fase 1) em estrutura navegável.

---

## Passo 1 — Carregar contexto

Ler (se existirem):
- `docs/.cortex/sessions/<slug>/design/archive/research.md` — personas, JTBD, oportunidades
- `docs/.cortex/sessions/<slug>/context.md` — escopo da feature (se spec fechada)
- `docs/design-context/ux-principles.md` — princípios a respeitar

Se research.md não existir:
```
Aviso: research.md não encontrado para esta session.
A fase ARCHITECT é mais precisa quando precedida de Research.
Continuar sem research documentado? [S/N]
```

### Checkpoint de Internalização — obrigatório antes de prosseguir

Após carregar os arquivos acima, exibir explicitamente:

```
DESIGN CONTEXT ATIVO — ARCHITECT

DS adotado: <nome extraído de design-system.md ou "não encontrado">
Princípios UX ativos: <listar os mais relevantes de ux-principles.md para arquitetura de informação>
Padrões de navegação do DS: <extraído de components.md ou ux-principles.md, ou "não encontrado">

Carry-forward do Research:
  Problema central: "<extraído de archive/research.md ou 'fase não realizada'>"
  Personas ativas: <lista ou "não definidas">
  Oportunidades mapeadas: <lista resumida ou "não definidas">

Arquivos carregados: <lista> | Ausentes: <lista ou "nenhum">
```

Não prosseguir sem exibir este bloco. Qualquer jornada ou fluxo desta fase que contradiga os princípios declarados → sinalizar antes de continuar.

---

## Passo 2 — Mapear jornadas do usuário

Para cada persona relevante (do research ou do design-context), mapear a jornada completa:

```
### Jornada: <nome da jornada>
**Persona:** <nome da persona>
**Objetivo:** <o que quer alcançar>
**Ponto de entrada:** <de onde começa — notificação, menu, link direto, etc.>

| Etapa | Ação do usuário | Pensamento / Sentimento | Ponto de dor potencial |
|-------|----------------|------------------------|------------------------|
| 1 | <o que faz> | <o que pensa/sente> | <o que pode dar errado> |
| 2 | — | — | — |
| N | <chega ao objetivo> | <sentimento de conclusão> | — |

**Oportunidades identificadas nesta jornada:**
  • <oportunidade de melhoria de UX>
```

---

## Passo 3 — Definir taskflows

Para cada tarefa principal identificada nas jornadas, criar um taskflow (passo a passo detalhado):

```
### Taskflow: <nome da tarefa>
**Trigger:** <o que inicia este fluxo>
**Happy path:**
  1. Usuário <ação>
  2. Sistema <resposta>
  3. Usuário <próxima ação>
  N. Usuário conclui: <resultado>

**Fluxos alternativos:**
  - Se <condição>: <caminho alternativo>
  - Se <erro>: <o que acontece>

**Pontos de decisão:**
  - Em <etapa N>: usuário escolhe entre <opção A> e <opção B>
```

---

## Passo 4 — Arquitetura de informação

### Sitemap (apenas se a feature criar nova área de navegação)

```
<Área principal>
├── <Seção 1>
│   ├── <Sub-seção 1.1>
│   └── <Sub-seção 1.2>
└── <Seção 2>
    └── <Sub-seção 2.1>
```

Se a feature for uma melhoria de área existente, documentar apenas o delta:
```
Área afetada: <nome da área>
Mudanças na navegação:
  • <o que muda>
```

### Hierarquia de informação por tela

Para cada tela principal, definir a hierarquia do conteúdo:

```
### Tela: <nome>
**Propósito:** <o que o usuário faz aqui>

Hierarquia de conteúdo:
  1. (Primário) <elemento mais importante — onde o olho vai primeiro>
  2. (Secundário) <segundo mais importante>
  3. (Terciário) <informação de suporte>
  4. (Ações) <o que o usuário pode fazer>
```

---

## Passo 5 — Inventário de telas e componentes

Levantar o que precisará existir para cobrir todos os fluxos:

```
## Telas necessárias

| Tela | Tipo | Nova ou existente | Persona principal |
|------|------|-------------------|------------------|
| <nome> | Página / Modal / Drawer / Bottom sheet | Nova / Modificação | <persona> |

## Estados necessários por tela

| Tela | Normal | Loading | Empty | Error | Success |
|------|--------|---------|-------|-------|---------|
| <nome> | <descrição> | <sim/não> | <sim/não> | <sim/não> | <sim/não> |

## Componentes que serão utilizados (do Design System)

| Componente | Tela(s) onde aparece | Variante necessária |
|------------|---------------------|---------------------|
| <componente de docs/design-context/components.md> | <tela> | <variante> |

## Componentes novos (não existentes no DS)

| Componente | Justificativa | Aprovação necessária |
|------------|--------------|---------------------|
| <componente> | <por que o DS não atende> | Designer responsável |
```

> Se componentes novos forem identificados: acionar aviso de Design Governance.
> Componentes novos precisam ser adicionados ao DS via `/cortex:design-update` antes de serem usados.

---

## GATE-AI — Verificação antes de avançar

**Checklist:**
- [ ] Jornada mapeada para ao menos a persona principal
- [ ] Happy path do taskflow principal documentado
- [ ] Lista de telas necessárias definida
- [ ] Estados de cada tela identificados (normal, loading, error, empty)
- [ ] Componentes do DS mapeados por tela
- [ ] Componentes novos (fora do DS) sinalizados e justificados

**Se itens estiverem incompletos:**
```
GATE-AI — Arquitetura incompleta.
Itens pendentes:
  • <lista>
Recomendado completar antes de avançar para DESIGN.
Avançar mesmo assim? [S/N]
```

**Se todos os itens estiverem completos:**
```
GATE-AI APROVADO — Arquitetura documentada.
Artefato: docs/.cortex/sessions/<slug>/design/archive/flows.md ✓

Próximo passo recomendado: Fase 3 — DESIGN
  → Criar wireframes e UI de alta fidelidade com base nos fluxos definidos.
```

---

## Passo 6 — Gerar flows.md

Criar `docs/.cortex/sessions/<slug>/design/archive/flows.md`:

```markdown
# Arquitetura e Fluxos: <nome da feature>

**Status:** done
**Slug:** <slug>
**Fase:** 2 — Architect
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>

---

## Jornadas do usuário

<conteúdo do Passo 2>

---

## Taskflows

<conteúdo do Passo 3>

---

## Arquitetura de informação

<conteúdo do Passo 4>

---

## Inventário de telas e componentes

<conteúdo do Passo 5>
```

**Atualizar manifesto:** `design.architect.status = "done"`
