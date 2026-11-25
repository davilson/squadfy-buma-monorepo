# CORTEX DESIGN — FASE 4: DESIGN / UI (v2.0)

> Fase 4 do processo de Product Design.
> Objetivo: especificar wireframes, UI de alta fidelidade e prototipação com o Design System.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/design-spec.md`
> Esta fase NÃO gera código. Gera especificação visual para uso na Fase 5 (Handoff).

---

## Contexto desta fase

Esta é a fase criativa central — onde o Designer traduz fluxos em telas reais.
Toda decisão visual deve ser fundamentada no Design System documentado em `docs/design-context/`.

---

## Passo 1 — Carregar contexto

Ler obrigatoriamente:
- `docs/.cortex/sessions/<slug>/design/archive/flows.md` — telas, fluxos, inventário de componentes
- `docs/.cortex/sessions/<slug>/design/archive/research.md` — personas e oportunidades (se existir)
- `docs/design-context/design-system.md` — tokens e DS adotado
- `docs/design-context/components.md` — componentes disponíveis
- `docs/design-context/ux-principles.md` — princípios de UX
- `docs/design-context/feedback-states.md` — padrões globais de estado
- `docs/design-context/content-guidelines.md` — tom de voz e microcopy
- `docs/design-context/accessibility.md` — checklist de acessibilidade

Registrar internamente: lista de telas do inventário, componentes disponíveis, princípios.

### Checkpoint de Internalização — obrigatório antes de prosseguir

Após carregar os arquivos acima, exibir explicitamente:

```
DESIGN CONTEXT ATIVO — UI

DS adotado: <nome e versão extraídos de design-system.md>
Componentes disponíveis: <listar todos de components.md — NUNCA inventar componente fora desta lista>
Tokens de cor: <paleta principal declarada no DS>
Tokens de tipografia: <escala declarada no DS>
Tokens de espaçamento: <escala declarada no DS>
Princípios UX ativos: <listar os mais relevantes de ux-principles.md>
Padrões de estado: <loading/error/empty/success de feedback-states.md>
Tom de voz: <regras principais de content-guidelines.md>

Carry-forward:
  [Research] Personas: <lista de archive/research.md ou "fase não realizada">
  [Architect] Telas a especificar: <lista de archive/flows.md — esta é a lista oficial de escopo>
  [Ideate] Direção escolhida: "<extraído de archive/concepts.md ou 'fase não realizada'>"
  [Ideate] Componentes-chave da direção: <lista ou "não definidos">

Arquivos carregados: <lista> | Ausentes: <lista ou "nenhum">
```

Não prosseguir sem exibir este bloco.
Qualquer componente ou token usado na spec que não esteja na lista declarada acima → sinalizar imediatamente como exceção com justificativa antes de incluir.

**MODO DE EXECUÇÃO — definir antes de prosseguir:**

```
[A] Spec em markdown apenas (design-spec.md)
[B] Spec em markdown + geração no canvas Figma

Se [A] selecionado e usuário fornecer link Figma de referência:
  → Chamar get_design_context (ou get_metadata) para extrair tokens, componentes e layout do frame
  → Usar como base para a spec — mais preciso que interpretação manual
  → Não requer plugin instalado — apenas leitura

Se [B] selecionado:
  PRÉ-REQUISITO: Figma MCP plugin instalado no Claude Code.
  Sem o plugin, use_figma e generate_figma_design não funcionarão → usar Modo A.

  GATE obrigatório: carregar skill figma:figma-use antes de qualquer escrita no canvas
  Qual ferramenta usar:
    • use_figma             → design novo a partir da spec (fluxo forward — usa DS real)
    • generate_figma_design → trazer UI de código existente para o Figma (sinc reversa)
  Informe o link do arquivo Figma (ou "NOVO" para criar):
```

Se flows.md não existir:
```
Aviso: flows.md não encontrado. A fase DESIGN é mais precisa quando precedida de ARCHITECT.
Continuar sem arquitetura documentada? [S/N]
```

---

## Passo 2 — Wireframes (baixa / média fidelidade)

Para projetos novos ou telas complexas, iniciar com wireframes textuais antes da UI de alta fidelidade.

Para cada tela do inventário:

```
### Wireframe: <nome da tela>

**Layout geral:**
<descrição do layout em palavras — divisão em regiões: header, sidebar, conteúdo principal, footer, etc.>

**Região 1 — <nome>:**
  Conteúdo: <o que fica aqui>
  Hierarquia: <primeiro elemento / segundo / terceiro>

**Região 2 — <nome>:**
  Conteúdo: <o que fica aqui>

**Elementos de ação:**
  • <botão/link primário>: posição <onde fica> — ação <o que faz>
  • <botão/link secundário>: posição <onde fica> — ação <o que faz>

**Notas de wireframe:**
  <decisões de layout importantes — o que foi considerado e descartado>
```

---

## Passo 3 — UI de alta fidelidade

Para cada tela, especificar a UI usando os tokens e componentes do Design System.

**Antes de montar a tabela de componentes de cada tela**, ativar `design-compliance-checker`:
- Verificar se cada componente que será listado existe em `docs/design-context/components.md`
- Verificar se os tokens que serão aplicados existem no DS (não hardcoded)
- Se `docs/design-context/` não existir: registrar aviso e prosseguir

Se o checker identificar componente ou token fora do DS:
```
COMPLIANCE: "<componente/token>" não encontrado no Design System do projeto.
Opções:
  [1] Usar componente equivalente do DS — qual?
  [2] Justificar como componente novo (registrar em "Componentes novos desta tela")
  [3] Propor adição ao DS via /cortex:design-update em sessão separada
```

```
### UI: <nome da tela>
**Link Figma:** <link do frame específico ou [A SER CRIADO]>

**Layout:**
<descrição detalhada do layout final>

**Componentes utilizados (do DS):**
| Componente | Variante | Localização na tela | Comportamento |
|------------|----------|---------------------|---------------|
| <componente de components.md> | <variante> | <onde fica> | <o que faz> |

**Tokens aplicados:**
| Elemento | Token | Valor |
|----------|-------|-------|
| Background | color-neutral-* | — |
| Texto principal | text-body | — |
| CTA principal | color-primary | — |

**Responsividade:**
  Desktop: <comportamento>
  Tablet: <adaptações>
  Mobile: <adaptações>

**Acessibilidade (por tela):**
  - [ ] Contraste dos textos principais ≥ 4.5:1
  - [ ] Foco visível nos elementos interativos
  - [ ] Ordem de Tab lógica
  - [ ] ARIA roles necessários: <lista ou "nenhum adicional">
```

---

## Passo 3B — Execução no canvas Figma (somente se Modo B)

Para cada tela especificada no Passo 3:

1. Gerar frame usando `use_figma` — componentes e variáveis do DS (nunca valores hardcoded)
2. **Self-healing loop:**
   - Chamar `get_screenshot` do frame gerado
   - Comparar visualmente com a spec do Passo 3
   - Se houver divergência (componente errado, token errado, estado faltando): ajustar via `use_figma` e repetir
   - Registrar o link do frame em `design-spec.md` (campo **Link Figma**)
3. Repetir para cada tela até o visual bater com a spec

> **Quando usar `generate_figma_design`:** somente se já existe código implementado e o objetivo é sincronizar o Figma com a UI atual — não para criar design novo.

---

## Passo 4 — Especificar todos os estados

Para cada tela, detalhar os estados identificados no inventário (Fase 2):

```
### Estados: <nome da tela>

**Estado Normal:**
<descrição do estado padrão — já documentado na UI acima>

**Estado Loading:**
  Componente: <Spinner / Skeleton / Progress bar — conforme feedback-states.md>
  O que fica desabilitado durante loading: <lista>
  Timeout: <comportamento após X segundos sem resposta>

**Estado Empty (sem dados):**
  Ilustração: <sim/não — se sim, qual>
  Título: "<texto>"
  Subtítulo: "<texto de suporte>"
  CTA: "<texto do botão>" → <ação>

**Estado Error:**
  Tipo: <inline / Toast / Modal — conforme feedback-states.md>
  Mensagem: "<o que aconteceu. O que fazer.>"
  Ação disponível: <retry / contato com suporte / voltar>

**Estado Success:**
  Tipo: <Toast / mensagem inline / redirecionamento>
  Mensagem: "<texto de sucesso>"
  Duração: <auto-dismiss em X segundos / permanente>
```

---

## Passo 5 — Microcopy

Para cada tela, revisar os textos com base em `docs/design-context/content-guidelines.md`:

```
### Microcopy: <nome da tela>

**Labels de campos:**
  <campo>: "<label>"

**Placeholders:**
  <campo>: "<placeholder — deve ser exemplo, não instrução>"

**Botões:**
  Ação principal: "<texto>"
  Ação secundária: "<texto>"
  Ação destrutiva: "<texto>"

**Mensagens de validação:**
  <campo> obrigatório vazio: "<mensagem>"
  <campo> formato inválido: "<mensagem>"

**Tooltips/Helper text:**
  <elemento>: "<texto explicativo>"
```

---

## Passo 6 — Protótipo (se aplicável)

Se for necessário protótipo interativo para validação:

```
**Link do protótipo Figma:** <link ou [A SER CRIADO]>
**Fluxos cobertos no protótipo:**
  • <fluxo 1>
  • <fluxo 2>
**Nível de fidelidade:** <baixa / média / alta>
**Propósito:** <teste de usabilidade / aprovação de stakeholders / referência para Dev>
```

---

## GATE (verificação interna antes de Validate / Handoff)

Não há GATE formal nesta fase. O Designer decide quando a UI está pronta para avançar.

Autoavaliação recomendada antes de avançar:
- [ ] Todas as telas do inventário (Fase 2) têm UI especificada
- [ ] Todos os estados (normal, loading, empty, error, success) definidos para cada tela
- [ ] Microcopy revisado contra content-guidelines.md
- [ ] Nenhum componente fora do DS sem justificativa documentada
- [ ] Tokens do DS aplicados (não cores/tamanhos hardcoded)
- [ ] Link Figma adicionado (ou sinalizado como pendente)
- [ ] Acessibilidade verificada por tela

---

## Verificação de integridade (antes de gerar/atualizar design-spec.md)

Se `docs/.cortex/sessions/<slug>/design/archive/design-spec.md` **já existir**:

1. Ler o arquivo existente e listar suas seções (wireframes, UI, estados, microcopy por tela)
2. Identificar quais seções estão no escopo desta revisão
3. Identificar quais seções não foram tocadas nesta fase

Exibir antes de salvar:
```
DESIGN-SPEC EXISTENTE DETECTADA.

Escopo desta revisão (seções sendo atualizadas):
  • <lista>

Preservadas sem alteração (fora do escopo):
  • <lista>
```

Para cada seção existente que **não seria incluída** no novo arquivo:
```
ATENÇÃO: "<seção/tela X>" não está no escopo desta revisão e seria removida.
  [S] Preservar no arquivo sem alteração
  [N] Remover intencionalmente — justificativa obrigatória: <declarar>
```

Só gerar o arquivo após confirmação explícita de cada remoção.

---

## Passo 7 — Gerar design-spec.md

Criar `docs/.cortex/sessions/<slug>/design/archive/design-spec.md`:

```markdown
# Design Spec: <nome da feature>

**Status:** done
**Slug:** <slug>
**Fase:** 3 — Design / UI
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>
**Link Figma (visão geral):** <link ou "pendente">

---

## Wireframes

<conteúdo do Passo 2>

---

## UI de alta fidelidade

<conteúdo do Passo 3>

---

## Estados por tela

<conteúdo do Passo 4>

---

## Microcopy

<conteúdo do Passo 5>

---

## Protótipo

<conteúdo do Passo 6 ou "N/A">

---

## Notas de design

<decisões de design, alternativas consideradas, trade-offs>
```

**Atualizar manifesto:** `design.ui.status = "done"`

### Compliance Check — antes de declarar a fase concluída

Invocar agente `design-compliance-checker` para revisar o `archive/design-spec.md` gerado:
- Verificar todos os componentes usados contra `docs/design-context/components.md`
- Verificar todos os tokens contra `docs/design-context/design-system.md` — nenhum valor hardcoded
- Verificar conformidade com `docs/design-context/ux-principles.md`
- Verificar estados (loading, error, empty, success) contra `docs/design-context/feedback-states.md`
- Verificar microcopy contra `docs/design-context/content-guidelines.md`

Se o agente identificar divergências: listar e resolver antes de fechar a fase.
**A fase UI não pode ser declarada concluída com divergências de compliance pendentes.**

Próximo passo recomendado:
```
Design spec gerada: docs/.cortex/sessions/<slug>/design/archive/design-spec.md ✓

Próximo passo recomendado: Fase 4 — VALIDATE
  → Testar a solução com usuários antes do handoff para Dev.
  → Ou, se validação não for possível neste ciclo: Fase 5 — HANDOFF
```
