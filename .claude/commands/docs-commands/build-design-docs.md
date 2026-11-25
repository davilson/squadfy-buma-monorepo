# Design Context Generator

Você é um especialista em Design de Produto e Design Systems, responsável por gerar a documentação de design base do projeto — o DNA visual e de experiência que todo o time (Designer, Dev, PM e IA) deve respeitar.

Este documento é gerado **uma vez no início do projeto** e atualizado apenas via `/cortex:design-update`.

> **Governança:** após gerado, `docs/design-context/` é protegido. Nenhum fluxo de feature pode alterá-lo. Qualquer desvio identificado durante o desenvolvimento gera um aviso ao responsável.

---

## Objetivo

Gerar `docs/design-context/` com o contexto completo de design do projeto:
- Design System (DS) adotado
- Princípios de UX
- Componentes e padrões
- Guidelines de conteúdo
- Princípios de motion
- Padrões de feedback states
- Diretrizes de acessibilidade
- Referências Figma
- Benchmarking e diagnóstico de UI/UX
- Moodboard e referências visuais

---

## Fase 1 — Descoberta inicial

### 1.1 Identificar o projeto

Ler os arquivos disponíveis em `docs/`:
- `docs/technical-context/briefing/tech-stack.md` (se existir)
- `docs/business-context/` (se existir)
- `README.md`

Registrar internamente: nome do projeto, produto, personas conhecidas.

### 1.2 Perguntas obrigatórias ao designer

Fazer estas perguntas em sequência antes de gerar qualquer arquivo:

**Bloco 1 — Design System:**
1. O projeto usa um Design System existente? Se sim, qual? (ex: Material Design, Ant Design, DS proprietário da empresa)
2. Existe uma biblioteca de componentes já implementada no código? (Storybook, Figma Library, etc.)
3. Há link para o Figma principal do projeto? (Arquivo de componentes, tokens ou telas)

**Bloco 2 — Identidade visual:**
4. Existe uma paleta de cores definida? Se sim, quais são as cores primárias e secundárias?
5. Existe uma tipografia definida? (família, tamanhos, pesos)
6. Existe um moodboard ou referências visuais já aprovadas?

**Bloco 3 — Experiência e conteúdo:**
7. Quais são os princípios de UX do produto? (ex: simplicidade, poder, acessibilidade primeiro)
8. Existe um tom de voz definido para os textos da interface?
9. O produto tem requisitos de acessibilidade específicos? (WCAG nível A, AA, AAA?)
10. Existem guidelines de motion/animação já definidos?

**Bloco 4 — Diagnóstico:**
11. O produto já está em produção? Se sim, existe algum diagnóstico de problemas de UI/UX conhecidos?
12. Quais são os principais concorrentes ou referências de mercado para benchmarking?

**Bloco 5 — Ícones e ilustrações (opcional):**
13. O produto usa uma biblioteca de ícones específica? (ex: Lucide, Heroicons, Phosphor, biblioteca proprietária) Se sim, qual?
14. O produto usa ilustrações? Se sim, existe um estilo definido (flat, outline, isométrico, etc.)?

Se o designer não souber responder alguma pergunta, marcar como `[PENDENTE]` no documento gerado.

### 1.3 Verificar Figma via MCP

Se link do Figma foi fornecido:
- Tentar ler metadados via `mcp__claude_ai_Figma__get_metadata`
- Tentar extrair variáveis/tokens via `mcp__claude_ai_Figma__get_variable_defs`
- Registrar o que foi possível extrair automaticamente

Se Figma não disponível ou link não fornecido:
- Continuar com base nas respostas do designer
- Criar seções com `[DECLARAR MANUALMENTE]` onde tokens precisam ser preenchidos

---

## Fase 2 — Resumo e aprovação

Antes de gerar os arquivos, apresentar resumo do que foi coletado:

```
RESUMO DO DESIGN CONTEXT:

Design System: <DS identificado ou "a definir">
Figma: <link ou "não fornecido">
Tokens extraídos automaticamente: <sim/não>
Acessibilidade: <nível WCAG ou "a definir">
Benchmarking: <concorrentes listados ou "a definir">

Arquivos que serão gerados em docs/design-context/:
  ✓ index.md
  ✓ design-system.md
  ✓ components.md
  ✓ ux-principles.md
  ✓ content-guidelines.md
  ✓ motion-principles.md
  ✓ feedback-states.md
  ✓ accessibility.md
  ✓ figma-references.md
  ✓ benchmarking.md
  ✓ ux-audit.md
  ✓ moodboard.md
  ✓ handoff-rules.md
  ✓ icon-guidelines.md (se biblioteca de ícones informada)
  ✓ illustration-guidelines.md (se ilustrações informadas)
  ✓ custom-components.md (vazio — componentes exclusivos do projeto criados ao longo do tempo)
  ✓ CHANGELOG.md (vazio — registro de futuras alterações)

Aprovar para gerar? [S/N]
```

Não prosseguir sem aprovação explícita.

---

## Fase 3 — Geração dos arquivos

### `index.md`

```markdown
# Design Context — <Nome do Projeto>

**Gerado em:** <data ISO 8601>
**Responsável:** <designer>
**Atualizado via:** /cortex:design-update

> Fonte de verdade de design do projeto. Alterações requerem aprovação do Designer responsável.

---

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| [design-system.md](design-system.md) | DS adotado, tokens (cores, tipografia, espaçamento), links Figma |
| [components.md](components.md) | Catálogo de componentes aprovados para uso no projeto |
| [ux-principles.md](ux-principles.md) | Princípios de UX e anti-padrões do produto |
| [content-guidelines.md](content-guidelines.md) | Tom de voz, nomenclatura, microcopy |
| [motion-principles.md](motion-principles.md) | Animações, transições e durações padrão |
| [feedback-states.md](feedback-states.md) | Padrões globais de loading, error, empty, success |
| [accessibility.md](accessibility.md) | Diretrizes WCAG e checklist por feature |
| [figma-references.md](figma-references.md) | Links Figma por área do produto |
| [benchmarking.md](benchmarking.md) | Concorrentes analisados e referências de mercado |
| [ux-audit.md](ux-audit.md) | Diagnóstico heurístico do produto (produtos existentes) |
| [moodboard.md](moodboard.md) | Direção visual e referências aprovadas |
| [handoff-rules.md](handoff-rules.md) | Protocolo Designer ↔ Dev |
| [icon-guidelines.md](icon-guidelines.md) | Biblioteca de ícones e regras de uso *(se aplicável)* |
| [illustration-guidelines.md](illustration-guidelines.md) | Estilo de ilustrações e regras de uso *(se aplicável)* |
| [custom-components.md](custom-components.md) | Componentes criados exclusivamente para este projeto (não são do DS original) |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de alterações formais no Design Context |

---

## Quick Reference

> Resumo compacto carregado no boot do Design Mode (lazy loading).
> Os arquivos completos são lidos por cada fase conforme necessidade.

**DS adotado:** <nome do DS>
**Figma principal:** <link ou "não configurado">

**Princípios de UX (resumo):**
- <princípio 1 — uma linha>
- <princípio 2 — uma linha>
- <princípio 3 — uma linha>

**Sistema de ícones:** <biblioteca + estilo, ex: "Lucide — outline, 24px padrão"> — detalhes: [icon-guidelines.md](icon-guidelines.md)
**Ilustrações:** <estilo aprovado ou "não usa"> — detalhes: [illustration-guidelines.md](illustration-guidelines.md)
**Motion:** <filosofia em uma linha, ex: "motion serve à função — máx 400ms"> — detalhes: [motion-principles.md](motion-principles.md)
**Acessibilidade:** WCAG <nível> — checklist: [accessibility.md](accessibility.md)
**Feedback states:** <loading: Skeleton/Spinner — toast: Sonner/etc> — padrões: [feedback-states.md](feedback-states.md)

**Ativos protegidos globalmente (não alterar sem `/cortex:design-update`):**

| Ativo | Especificação resumida |
|-------|----------------------|
| Ícones | <biblioteca, estilo e regra principal> |
| Ilustrações | <estilo aprovado + contextos de uso> |
| Motion | <durações aprovadas + regra principal> |
| Paleta | <tokens principais — primary, neutral, feedback> |
| Botões | <variantes aprovadas e padrão de uso> |

---

## Governança

- Alterações neste diretório: apenas via `/cortex:design-update`
- Qualquer desvio detectado durante o desenvolvimento gera aviso automático do `design-compliance-checker`
- O projeto respeita este contexto — não o inverso
```

---

### `design-system.md`

```markdown
# Design System — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>
**Responsável:** <designer responsável>

---

## DS Adotado

**Nome:** <nome do DS>
**Tipo:** [ ] Proprietário  [ ] Open source  [ ] Criado do zero neste projeto
**Versão:** <versão ou "N/A">
**Repositório/Link:** <link ou "N/A">

---

## Tokens Base

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| color-primary | [DECLARAR] | Ação principal, CTA |
| color-secondary | [DECLARAR] | Suporte |
| color-neutral-* | [DECLARAR] | Textos, bordas, fundos |
| color-feedback-success | [DECLARAR] | Estados de sucesso |
| color-feedback-error | [DECLARAR] | Estados de erro |
| color-feedback-warning | [DECLARAR] | Alertas |
| color-feedback-info | [DECLARAR] | Informações |

### Tipografia
| Token | Família | Tamanho | Peso | Uso |
|-------|---------|---------|------|-----|
| text-heading-1 | [DECLARAR] | [DECLARAR] | [DECLARAR] | Títulos principais |
| text-heading-2 | [DECLARAR] | [DECLARAR] | [DECLARAR] | Títulos de seção |
| text-body | [DECLARAR] | [DECLARAR] | [DECLARAR] | Corpo de texto |
| text-caption | [DECLARAR] | [DECLARAR] | [DECLARAR] | Legendas, labels |

### Espaçamento
**Base:** <valor base em px, ex: 8px>
**Escala:** <sequência, ex: 4, 8, 16, 24, 32, 48, 64>

### Border Radius
| Token | Valor | Uso |
|-------|-------|-----|
| radius-sm | [DECLARAR] | Botões, inputs |
| radius-md | [DECLARAR] | Cards, modais |
| radius-full | [DECLARAR] | Chips, avatares |

---

## Figma

**Arquivo principal:** <link>
**Biblioteca de componentes:** <link ou "integrada no arquivo principal">
**Tokens/Variables:** <link ou "N/A">
```

---

### `components.md`

```markdown
# Catálogo de Componentes — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

> Componentes documentados aqui são os aprovados para uso no projeto.
> Usar componentes fora desta lista requer aprovação via /cortex:design-update.

---

## Componentes Base (do DS)

| Componente | Status | Variantes | Figma | Storybook |
|------------|--------|-----------|-------|-----------|
| Button | [ativo] | primary, secondary, ghost, destructive | [link] | [link] |
| Input | [ativo] | default, disabled, error, success | [link] | [link] |
| Select | [ativo] | — | [link] | [link] |
| Modal | [ativo] | — | [link] | [link] |
| Toast/Snackbar | [ativo] | success, error, warning, info | [link] | [link] |

> Preencher com os componentes reais do projeto.

---

## Componentes Customizados do Projeto

| Componente | Descrição | Figma | Status |
|------------|-----------|-------|--------|
| [DECLARAR] | — | — | — |

---

## Regras de uso

- Nunca criar componente novo sem verificar se existe equivalente no DS
- Customizações de componentes do DS devem ser documentadas aqui
- Componentes deprecated devem ser marcados como `[deprecated]` com alternativa indicada
```

---

### `ux-principles.md`

```markdown
# Princípios de UX — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Princípios fundamentais

<listar os princípios definidos pelo designer, ex:>

1. **Clareza antes de cleverness** — A interface nunca deve sacrificar clareza por estética.
2. **Progressão natural** — O usuário deve sempre saber onde está e o que fazer a seguir.
3. **[DECLARAR]**

---

## Anti-padrões proibidos neste produto

- [DECLARAR] — o que nunca fazer nesta interface

---

## Personas e contexto de uso

<referência às personas do docs/business-context/ se existirem>
```

---

### `content-guidelines.md`

```markdown
# Content Guidelines — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Tom de voz

**Personalidade:** <ex: direto, acolhedor, especialista>
**Tom:** <ex: formal, informal, técnico>

| Situação | Fazer | Não fazer |
|----------|-------|-----------|
| Erro | "Não foi possível salvar. Tente novamente." | "Erro 500" |
| Sucesso | "Salvo com sucesso!" | "OK" |
| Vazio | "Nenhum item ainda. Comece criando um." | "Não há dados" |

---

## Nomenclatura do produto

| Termo correto | Termos proibidos |
|---------------|-----------------|
| [DECLARAR] | [DECLARAR] |

---

## Microcopy

### Labels de ação
- Botão de confirmação: "Salvar" (não "OK", não "Confirmar")
- Botão de cancelamento: "Cancelar" (não "Fechar", não "Voltar")
- [DECLARAR]

### Mensagens de erro
- Formato: <o que aconteceu> + <o que fazer>
- Ex: "Senha incorreta. Verifique e tente novamente."

### Placeholders
- Devem ser exemplos reais, não instruções.
- Correto: "ex: joao@empresa.com"
- Errado: "Digite seu e-mail"
```

---

### `motion-principles.md`

```markdown
# Motion Principles — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Filosofia de motion

<ex: motion serve à função, nunca à decoração>

---

## Durações padrão

| Tipo de transição | Duração | Uso |
|-------------------|---------|-----|
| Micro-interação (hover, focus) | 100-150ms | Botões, links |
| Transição de estado | 200-300ms | Modais, toasts, loading |
| Transição de página | 300-400ms | Navegação entre telas |

---

## Easing padrão

| Tipo | Curva | Uso |
|------|-------|-----|
| Entrada | ease-out | Elementos entrando na tela |
| Saída | ease-in | Elementos saindo da tela |
| Transição | ease-in-out | Mudança de estado |

---

## Regras

- Nunca usar animações que bloqueiem a interação do usuário
- Respeitar `prefers-reduced-motion`
- [DECLARAR]
```

---

### `feedback-states.md`

```markdown
# Feedback States — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

> Padrões globais de como o produto comunica estados ao usuário.
> Toda feature deve aplicar estes padrões — não criar padrões paralelos.

---

## Estados globais

### Loading
- **Componente:** <Spinner / Skeleton / Progress bar>
- **Quando usar cada um:** <regra>
- **Timeout:** após <X>s sem resposta, exibir mensagem de erro

### Sucesso
- **Componente:** Toast/Snackbar success
- **Duração:** <X>s (auto-dismiss)
- **Posição:** <top-right / bottom-center>

### Erro
- **Componente:** Toast/Snackbar error + inline validation quando aplicável
- **Formato de mensagem:** <o que aconteceu> + <ação disponível>
- **Erro crítico (bloqueante):** Modal de erro com opção de retry

### Vazio (Empty state)
- **Estrutura:** Ilustração + Título + Subtítulo + CTA (quando aplicável)
- **Tom:** <encorajador / neutro>

### Estado offline
- **Comportamento:** <banner / bloqueio total / degradação graciosa>

---

## Validação de formulários

- **Quando validar:** <on blur / on submit / on change>
- **Posição do erro:** abaixo do campo, em vermelho (`color-feedback-error`)
- **Ícone de erro:** <sim/não>
```

---

### `accessibility.md`

```markdown
# Acessibilidade — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Nível de conformidade alvo

**WCAG:** <2.1 AA> (padrão recomendado)

---

## Checklist obrigatório por feature

- [ ] Contraste de cores ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande
- [ ] Todos os elementos interativos acessíveis via teclado (Tab order lógico)
- [ ] Foco visível em todos os elementos interativos
- [ ] Imagens decorativas com `alt=""`; imagens informativas com `alt` descritivo
- [ ] Formulários com labels associados a inputs
- [ ] Mensagens de erro associadas ao campo via `aria-describedby`
- [ ] Modais com foco preso e retorno ao trigger ao fechar
- [ ] Respeitar `prefers-reduced-motion`

---

## Ferramentas de validação recomendadas

- axe DevTools (extensão de browser)
- Figma: Able plugin para contraste
- NVDA / VoiceOver para testes de screen reader

---

## Responsabilidades

- **Designer:** garantir contraste, foco visível e estrutura lógica no Figma
- **Dev:** implementar ARIA corretamente, garantir keyboard navigation
- **QA Design:** validar com axe + teste manual de teclado antes do PR
```

---

### `figma-references.md`

```markdown
# Referências Figma — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Arquivos principais

| Arquivo | Link | Descrição |
|---------|------|-----------|
| Design System / Biblioteca | [DECLARAR] | Componentes e tokens |
| Produto — Telas | [DECLARAR] | Telas do produto |
| Protótipos | [DECLARAR] | Fluxos interativos |

---

## Organização no Figma

<descrever como o Figma do projeto está organizado — páginas, seções, convenções de nomenclatura>

---

## Convenções de nomenclatura no Figma

- Frames: `[Área] / [Tela] / [Estado]`
- Componentes: `[Categoria] / [Nome] / [Variante]`
- [DECLARAR]
```

---

### `benchmarking.md`

```markdown
# Benchmarking — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Concorrentes diretos analisados

| Produto | Pontos fortes (UX/UI) | Pontos fracos | Aprendizado |
|---------|----------------------|---------------|-------------|
| [DECLARAR] | — | — | — |

---

## Referências de mercado (inspiração, não concorrentes)

| Produto | O que aproveitar |
|---------|-----------------|
| [DECLARAR] | — |

---

## Padrões de mercado identificados

<o que o mercado já estabeleceu como padrão para este tipo de produto — não reinventar>

---

## Diferenciação

<o que este produto faz diferente — onde pode inovar em UX/UI>
```

---

### `ux-audit.md`

```markdown
# Diagnóstico de UI/UX — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

> Aplicável apenas a produtos já em produção.
> Para produtos novos, preencher após o primeiro lançamento.

---

## Avaliação heurística

Baseado nas 10 Heurísticas de Nielsen:

| Heurística | Status | Problemas identificados | Severidade |
|------------|--------|------------------------|------------|
| Visibilidade do status do sistema | [OK/Atenção/Crítico] | — | — |
| Compatibilidade com o mundo real | — | — | — |
| Controle e liberdade do usuário | — | — | — |
| Consistência e padrões | — | — | — |
| Prevenção de erros | — | — | — |
| Reconhecimento em vez de lembrança | — | — | — |
| Flexibilidade e eficiência de uso | — | — | — |
| Estética e design minimalista | — | — | — |
| Ajuda ao usuário a reconhecer erros | — | — | — |
| Ajuda e documentação | — | — | — |

---

## Problemas críticos (P0)

<itens que precisam ser resolvidos com prioridade máxima>

## Problemas relevantes (P1)

<itens importantes mas não bloqueantes>

## Melhorias de oportunidade (P2)

<melhorias que podem ser feitas incrementalmente>
```

---

### `moodboard.md`

```markdown
# Moodboard e Referências Visuais — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Direção visual aprovada

**Estilo:** <ex: clean e minimalista / bold e expressivo / corporativo e confiável>
**Paleta de mood:** <descrever sensação visual — não apenas cores técnicas>

---

## Referências visuais

| Referência | Link | O que aproveitar |
|------------|------|-----------------|
| [DECLARAR] | — | — |

---

## Referências Figma/Pinterest/outros

<links para boards de referência>

---

## O que este produto NÃO é visualmente

<direções descartadas — importante para evitar regressões futuras>
```

---

### `handoff-rules.md`

```markdown
# Regras de Handoff Designer ↔ Dev — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## O que o Dev pode esperar do Designer antes de implementar

- [ ] `design.md` gerado via `/cortex:design` fase HANDOFF
- [ ] Todos os estados documentados (normal, loading, error, empty, success)
- [ ] Edge cases anotados
- [ ] Link do Figma com frame específico da feature
- [ ] Componentes do DS identificados por nome
- [ ] Comportamentos de interação descritos em texto

---

## O que o Designer deve esperar do Dev durante a implementação

- [ ] Abrir issue/comentário no Figma se algo não estiver implementável como especificado
- [ ] Não criar componentes visuais sem consultar o Designer para itens não especificados
- [ ] Fazer QA de design antes de fechar o PR (comparar implementação com Figma)

---

## QA de Design

O Designer faz QA de design após o Dev sinalizar que a implementação está pronta:

Checklist de QA:
- [ ] Layout confere com o Figma (espaçamentos, tamanhos)
- [ ] Cores corretas (usar tokens, não hardcoded)
- [ ] Tipografia correta
- [ ] Estados todos implementados
- [ ] Responsividade (se aplicável)
- [ ] Acessibilidade básica (contraste, foco)

---

## Canal de comunicação

<onde Designer e Dev se comunicam sobre implementação — Slack, Linear, comentários no PR>
```

---

### `icon-guidelines.md` *(gerado apenas se biblioteca de ícones informada)*

```markdown
# Guidelines de Ícones — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Biblioteca de ícones

**Nome:** <ex: Lucide, Heroicons, Phosphor, biblioteca proprietária>
**Versão:** <versão ou "N/A">
**Link/Repositório:** <link ou "N/A">
**Figma Library:** <link ou "N/A">

---

## Regras de uso

**Tamanhos padrão:**
| Contexto | Tamanho |
|----------|---------|
| Inline com texto | 16px |
| Botões | 20px |
| Ícones standalone | 24px |
| Destaque / hero | 32px+ |

**Cor:**
- Ícones herdam a cor do contexto (currentColor)
- Nunca usar cor hardcoded — usar tokens do DS
- Ícones decorativos: `aria-hidden="true"`
- Ícones informativos: incluir `aria-label`

**Estilo:**
- Estilo aprovado: <outline / filled / duotone / outro>
- Não misturar estilos na mesma interface
- [DECLARAR outros critérios]

---

## Ícones customizados do projeto

| Ícone | Uso | Link Figma |
|-------|-----|------------|
| [DECLARAR] | — | — |

---

## Anti-padrões

- Não usar ícones sem texto de suporte em ações críticas
- Não criar ícones fora da biblioteca sem aprovação via /cortex:design-update
```

---

### `illustration-guidelines.md` *(gerado apenas se ilustrações informadas)*

```markdown
# Guidelines de Ilustrações — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>

---

## Estilo de ilustração

**Estilo:** <flat / outline / isométrico / 3D / outro>
**Paleta:** <usa tokens do DS / paleta própria>
**Biblioteca:** <nome ou "criadas internamente">
**Link Figma:** <link ou "N/A">

---

## Quando usar ilustrações

| Contexto | Usar? | Alternativa se não usar |
|----------|-------|------------------------|
| Empty states | Sim/Não | Ícone + texto |
| Error pages (404, 500) | Sim/Não | Texto apenas |
| Onboarding | Sim/Não | — |
| Telas de sucesso/celebração | Sim/Não | — |

---

## Regras de uso

- Ilustrações são decorativas: sempre `alt=""` ou `aria-hidden="true"`
- Não usar ilustrações para comunicar informação crítica (use texto)
- Escala mínima: <Xpx> (abaixo disso perdem legibilidade)
- [DECLARAR outras regras]

---

## Catálogo de ilustrações aprovadas

| Ilustração | Contexto de uso | Link Figma |
|------------|----------------|------------|
| [DECLARAR] | — | — |

---

## Anti-padrões

- Não usar ilustrações de estilos diferentes na mesma interface
- Não criar ilustrações novas sem alinhamento com o Designer responsável
```

---

### `CHANGELOG.md`

```markdown
# Design Context — Changelog

> Registro de todas as alterações intencionais no design context do projeto.
> Alterações fora deste registro não são autorizadas.
> Para alterar: use /cortex:design-update

---

## [Inicial] — <data ISO 8601>

**Tipo:** Criação inicial
**Responsável:** <designer>
**Motivo:** Geração inicial do design context do projeto via /docs-commands:build-design-docs

Arquivos criados:
- design-system.md
- components.md
- ux-principles.md
- content-guidelines.md
- motion-principles.md
- feedback-states.md
- accessibility.md
- figma-references.md
- benchmarking.md
- ux-audit.md
- moodboard.md
- handoff-rules.md
```

---

### `custom-components.md`

```markdown
# Componentes Customizados do Projeto — <Nome do Projeto>

**Status:** active
**Gerado em:** <data ISO 8601>
**Atualizado via:** /cortex:design → [6] HANDOFF (ao criar novos componentes)

> Este arquivo registra componentes criados exclusivamente para este projeto.
> Estes componentes NÃO fazem parte do DS original da Squadfy.
> Cada componente documentado aqui pode, futuramente, ser considerado para inclusão no DS — processo separado e manual.

---

## Como este arquivo é atualizado

Sempre que a Fase 6 (HANDOFF) de uma feature criar um componente não existente no DS,
o Designer deve registrá-lo aqui ao finalizar o handoff.

---

## Componentes

*(Vazio no início do projeto — populado ao longo das features)*

---

### [Modelo de entrada]

```
### <Nome do Componente>

**Feature de origem:** <slug da session>
**Criado em:** <data ISO 8601>
**Responsável:** <designer>
**Figma:** <link do frame>

**Descrição:**
<o que o componente faz e onde é usado>

**Anatomia:**
- <elemento 1>: <descrição>
- <elemento 2>: <descrição>

**Variantes:**
| Variante | Descrição |
|----------|-----------|
| <variante> | <quando usar> |

**Estados:**
- Default: <descrição>
- Hover: <descrição>
- Disabled: <descrição>
- <outros>: <descrição>

**Tokens aplicados:**
| Elemento | Token |
|----------|-------|
| <elemento> | <token> |

**Regras de uso:**
- <quando usar>
- <quando NÃO usar>

**Consideração para DS da Squadfy:** [ ] Sim — avaliar inclusão futura / [x] Exclusivo deste projeto
```
```

---

## Fase 4 — Confirmação final

Após gerar todos os arquivos, exibir:

```
DESIGN CONTEXT GERADO COM SUCESSO.

docs/design-context/
  ✓ design-system.md
  ✓ components.md
  ✓ ux-principles.md
  ✓ content-guidelines.md
  ✓ motion-principles.md
  ✓ feedback-states.md
  ✓ accessibility.md
  ✓ figma-references.md
  ✓ benchmarking.md
  ✓ ux-audit.md
  ✓ moodboard.md
  ✓ handoff-rules.md
  ✓ CHANGELOG.md

Campos marcados como [DECLARAR] ou [PENDENTE]: <N itens>
Recomendado completar esses campos antes de iniciar o design de features.

Próximo passo:
  → Para iniciar o processo de design de uma feature: /cortex:design
  → Para atualizar este contexto no futuro: /cortex:design-update
```

---

## Governança — lembrete ao gerar

Ao finalizar, exibir este aviso:

```
AVISO DE GOVERNANÇA:

docs/design-context/ é a fonte de verdade de design deste projeto.

Regras:
  1. Estes documentos NÃO podem ser alterados durante o fluxo de uma feature.
  2. Para alterar: /cortex:design-update (requer justificativa e aprovação do Designer responsável).
  3. Qualquer desvio identificado durante Design, Strategy ou Execution gerará um aviso automático.

O projeto deve respeitar estes documentos — não o inverso.
```
