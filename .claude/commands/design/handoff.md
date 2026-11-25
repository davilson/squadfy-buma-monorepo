# CORTEX DESIGN — FASE 6: HANDOFF (v2.1)

> Fase 6 do processo de Product Design.
> Objetivo: gerar especificação completa e precisa para o Dev implementar com autonomia.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/design.md`
> Iterações geram `design-delta-vN.md` (não sobrescrevem o design.md original).
> GATE-D: cobertura completa — todos os estados e edge cases documentados.

---

## Contexto desta fase

O handoff é o contrato entre Designer e Dev.
Um handoff bem feito elimina idas e vindas durante a implementação.
Um handoff ruim gera retrabalho, atrasos e divergência entre design e produto final.

**Dois modos de operação:**
- **Nova página/feature:** gera `design.md` — fonte de verdade completa
- **Iteração sobre feature existente:** gera `design-delta-vN.md` — documenta apenas o que mudou, sem sobrescrever o original

---

## Passo 1 — Identificar modo de operação

Verificar se `docs/.cortex/sessions/<slug>/design/design.md` já existe:

**Se NÃO existir:** prosseguir com o fluxo padrão → gerar `design.md`

**Se JÁ existir:**
```
design.md encontrado para esta session.
Esta feature já teve um handoff anterior.

Modo de operação:
  [A] Iteração — documentar apenas o que mudou (gera design-delta-vN.md)
  [B] Redesign completo — substituir design.md integralmente

Recomendado: [A] para ajustes e evoluções incrementais.
[B] somente se o escopo mudou completamente.
```

Se [A] → declarar escopo antes de prosseguir:
```
ESCOPO DESTA ITERAÇÃO (obrigatório declarar antes de continuar):

O que está sendo alterado nesta iteração:
  • <seção/tela/componente 1>
  • <seção/tela/componente 2>

O que NÃO está sendo tocado (protegido):
  Tudo que não está na lista acima — incluindo ícones, ilustrações,
  motion e tokens já especificados no design.md original.

Qualquer remoção ou modificação fora do escopo declarado requer confirmação:
  "ALTERANDO FORA DO ESCOPO: [<seção/ativo>] — confirmar remoção? [S/N]"
  Se [N]: preservar o conteúdo existente sem alteração.

Confirmar escopo e prosseguir? [S/N]
```

Se [B] → prosseguir com o fluxo padrão, gerando um novo `design.md`.

---

## Passo 2 — Carregar contexto completo

Ler obrigatoriamente:
- `docs/.cortex/sessions/<slug>/design/archive/design-spec.md` — UI especificada
- `docs/.cortex/sessions/<slug>/design/archive/validation.md` — correções da validação (se existir)
- `docs/.cortex/sessions/<slug>/context.md` — regras de negócio (se existir)
- `docs/.cortex/sessions/<slug>/architecture.md` — estrutura técnica (se existir)
- `docs/design-context/components.md` — nomenclatura exata dos componentes do DS
- `docs/design-context/feedback-states.md` — padrões globais de estado
- `docs/design-context/handoff-rules.md` — protocolo de handoff do projeto
- `docs/design-context/accessibility.md` — checklist de acessibilidade

**Registrar internamente quais arquivos foram encontrados e quais estão ausentes.**

Para cada arquivo ausente, identificar quais seções do `design.md` serão afetadas:

| Arquivo ausente | Seções afetadas |
|----------------|-----------------|
| `archive/design-spec.md` | Todas as telas — base da especificação |
| `archive/validation.md` | Correções não aplicadas — spec pode ter problemas identificados |
| `context.md` | Cobertura de Requisitos — pode estar vazia ou inventada |
| `components.md` | Componentes — nomenclatura sem validação do DS |
| `accessibility.md` | Checklist de acessibilidade — gerado sem referência |
| `feedback-states.md` | Estados (loading, error, empty, success) — sem padrão do projeto |
| `content-guidelines.md` | Microcopy — gerado sem tom de voz e regras do projeto |

Nas seções afetadas por arquivos ausentes, marcar os campos com:
`[sem referência: <nome-do-arquivo>.md ausente — revisar antes do GATE-D]`

**Varredura de motion (executar após carregar design-spec.md):**

1. Escanear `archive/design-spec.md` por termos: `animation`, `transition`, `motion`, `easing`, `duration`, `@keyframes`, `animate`
2. Escanear arquivos de UI existentes no projeto (`.tsx`, `.jsx`, `.css`, `.scss`) referentes às telas em escopo — mesmos termos

Se encontrar motion em `design-spec.md`:
- Carregar `docs/design-context/motion-principles.md` antes de prosseguir
- Validar que durations, easings e comportamento de `prefers-reduced-motion` estão alinhados

Se encontrar motion **no código existente que não está na design-spec**:
```
MOTION EXISTENTE DETECTADO NO CÓDIGO — não coberto pela spec:

  Arquivo: <caminho>
  Trecho: <o que foi encontrado>

Este motion não está no escopo do seu handoff.
O que fazer?

  [1] Preservar — adicionar aos Ativos Protegidos (Dev não pode alterar)
  [2] Substituir — documentar o novo comportamento na spec desta tela
  [3] Remover — declarar intencionalmente aqui
```

Aguardar decisão antes de prosseguir. Cada item deve ser resolvido explicitamente.

---

## Passo 3 — Especificação por tela/fluxo

Para cada tela/fluxo da design-spec, gerar a especificação de handoff.

**Se o Link Figma da tela estiver disponível**, chamar `get_design_context` (ou `get_metadata`) antes de escrever a spec:
- Extrair medidas exatas de espaçamento, tamanhos e layout
- Confirmar nomes e variantes dos componentes diretamente do frame
- Extrair tokens de cor, tipografia e espaçamento do DS real
- Capturar via `get_screenshot` para referência visual da spec

Isso garante que a especificação reflete o Figma real, não uma interpretação manual.
Se o link não estiver disponível: prosseguir com base na `design-spec.md` e sinalizar como `[Link Figma pendente]`.

```
### <Nome da Tela ou Fluxo>

**Usuário:** <qual persona acessa>
**Trigger:** <o que aciona esta tela ou fluxo>
**Link Figma:** <link direto para o frame>

---

**Layout:**
<descrição do layout final, regiões, hierarquia>

**Componentes (usar nomenclatura exata de docs/design-context/components.md):**
| Componente | Variante | Props/Configuração | Localização |
|------------|----------|-------------------|-------------|
| <Nome exato do componente> | <variante> | <props relevantes> | <onde fica> |

**Tokens aplicados:**
| Elemento | Token | Observação |
|----------|-------|------------|
| <elemento> | <token do DS> | — |

**Responsividade:**
  Desktop (≥1024px): <comportamento>
  Tablet (768px–1023px): <adaptações>
  Mobile (<768px): <adaptações>

---

**Estados:**

*Normal:*
<descrição do estado padrão>

*Loading:*
- Componente: <conforme feedback-states.md>
- O que fica desabilitado: <lista>
- Comportamento após timeout: <X segundos → mensagem de erro>

*Empty (sem dados):*
- Ilustração: <nome/referência ou "nenhuma">
- Título: "<texto exato>"
- Subtítulo: "<texto exato>"
- CTA: "<texto do botão>" → <ação ao clicar>

*Error:*
- Tipo: <inline / Toast / Modal — conforme feedback-states.md>
- Mensagem: "<texto exato da mensagem>"
- Ação: <retry / link / fechar>

*Success:*
- Tipo: <Toast / inline / redirecionamento>
- Mensagem: "<texto exato>"
- Duração: <X segundos / permanente>

---

**Interações:**
| Ação do usuário | Resultado esperado |
|----------------|-------------------|
| <clicar em X> | <o que acontece> |
| <hover em Y> | <comportamento> |
| <submeter form> | <o que o sistema faz> |

---

**Edge cases:**
| Situação | Comportamento esperado |
|----------|----------------------|
| Texto muito longo no campo X | <truncar com ellipsis / quebrar linha / limite de caracteres> |
| Sem permissão de acesso | <redirecionar / mostrar mensagem> |
| Carregamento muito lento (>Xs) | <mostrar skeleton / timeout message> |
| <outro edge case> | <comportamento> |

---

**Microcopy completo:**
| Elemento | Texto exato |
|----------|------------|
| Título da tela | "<texto>" |
| <campo> label | "<texto>" |
| <campo> placeholder | "<texto>" |
| <campo> helper text | "<texto>" |
| <campo> erro obrigatório | "<texto>" |
| Botão primário | "<texto>" |
| Botão secundário | "<texto>" |

---

**Acessibilidade (por tela):**
- [ ] Contraste textos normais ≥ 4.5:1
- [ ] Contraste textos grandes ≥ 3:1
- [ ] Todos os inputs têm label associado
- [ ] Foco visível em elementos interativos
- [ ] Ordem de Tab: <descrever se não for linear>
- [ ] ARIA roles adicionais necessários: <lista ou "nenhum">
- [ ] Alt text para imagens: <lista com texto exato ou "N/A">
- [ ] Modal/drawer: foco preso + retorno ao trigger ao fechar: <sim/N/A>

---

**Motion e microinterações:** *(omitir se não houver elementos animados nesta tela)*
| Elemento | Tipo de transição | Duração | Easing | Trigger | prefers-reduced-motion |
|----------|------------------|---------|--------|---------|----------------------|
| <ex: Modal open> | <fade + slide-up> | <200ms> | <ease-out> | <botão clicado> | <sem animação> |
| <ex: Hover no card> | <elevação de sombra> | <150ms> | <ease-in-out> | <hover> | <sem transição> |

*Consultar `docs/design-context/motion-principles.md` para durações e easings padrão do projeto.*

---

**Novos componentes desta tela:** *(omitir se todos os componentes são do DS documentado)*
| Componente | Descrição | Por que não está no DS | Figma | Escopo |
|------------|-----------|----------------------|-------|--------|
| <Nome> | <o que faz, anatomia> | <justificativa> | <link> | Exclusivo deste projeto |

*Ao encerrar o HANDOFF: registrar em `docs/design-context/custom-components.md`.*
*Para inclusão no DS da Squadfy: processo separado e manual — fora do escopo do Cortex.*

---

**Notas para o Dev:**
<observações importantes que não se encaixam nas categorias acima>
<decisões de design que podem parecer contraintuitivas — explicar o porquê>
```

---

## Passo 4 — Cobertura de requisitos

Mapear cada requisito da spec (context.md) ao design correspondente:

```
## Cobertura de Requisitos

| Requisito (context.md) | Tela / Fluxo de Design |
|------------------------|------------------------|
| <requisito 1> | <tela ou fluxo> |
| <requisito 2> | <tela ou fluxo> |
```

Se algum requisito não tiver design correspondente: sinalizar como pendente.

---

## Passo 5 — Assets e links

### Convenção de pastas da session para artefatos de design

```
docs/.cortex/sessions/<slug>/
  └── design/
      ├── design.md          — lean handoff (Dev-facing)
      ├── manifest.json
      ├── archive/           — artefatos de processo (não consumidos pelo Dev)
      │   ├── research.md
      │   ├── flows.md
      │   ├── concepts.md
      │   ├── design-spec.md
      │   ├── validation.md
      │   ├── <prototipo>.mp4/.gif   — vídeos e GIFs de fluxo para revisão
      │   └── <framer|protopie>.zip  — exports de ferramentas externas
      └── assets/            — arquivos que o Dev usa na implementação
          ├── <animation>.json       — Lottie / Rive
          ├── <icon>.svg
          └── <illustration>.svg
```

**Regra:** se o artefato vai para o código → `design/assets/`. Se é referência de processo → `design/archive/`. Links externos (Framer online, CodePen, Principle) vão apenas como URL na tabela abaixo — sem arquivo local.

---

```
## Assets e Links

| Recurso | Localização |
|---------|------------|
| Figma — visão geral | <link> |
| Figma — tela: <nome> | <link do frame> |
| Protótipo interativo | <link ou "N/A"> |
| Animações (Lottie/Rive) | `design/assets/<arquivo>.json` ou "N/A" |
| Protótipo em ferramenta externa | <link Framer/ProtoPie/Principle ou "N/A"> |
| Vídeo/GIF de fluxo | `design/archive/<arquivo>` ou "N/A" |
| Biblioteca de ícones | <link ou "conforme DS"> |
| Assets exportáveis (SVG, PNG) | `design/assets/` ou "gerados pelo Dev via código" |
```

---

## GATE-D — Verificação de cobertura completa

### Auditoria de Artefatos (executar antes de qualquer outra verificação)

Verificar a existência de cada arquivo e exibir o relatório:

```
AUDITORIA DE ARTEFATOS — pré-GATE-D

Artefatos de design desta session:
  [✓/✗] design-spec.md       — base da especificação visual
  [✓/✗] flows.md             — fluxos e inventário de telas (Fase ARCHITECT)
  [✓/✗] validation.md        — correções de usabilidade (Fase VALIDATE)
  [✓/✗] research.md          — personas e oportunidades (Fase RESEARCH)
  [✓/✗] context.md           — regras de negócio da session
  [✓/✗] architecture.md      — estrutura técnica da session

Design Context do projeto:
  [✓/✗] components.md        — nomenclatura do DS
  [✓/✗] design-system.md     — tokens e DS adotado
  [✓/✗] feedback-states.md   — padrões de estado
  [✓/✗] accessibility.md     — checklist de acessibilidade
  [✓/✗] content-guidelines.md — tom de voz e microcopy
  [✓/✗] motion-principles.md  — animações (se aplicável)
```

Se houver qualquer ✗:

```
⚠ ATENÇÃO: seções do design.md foram geradas sem referência a artefatos ausentes.
  Seções afetadas: <lista gerada a partir da tabela do Passo 2>
  Essas seções estão marcadas com [sem referência: <arquivo> ausente — revisar].

  Recomendado: revisar manualmente essas seções antes de aprovar o GATE-D.
  Continuar para o GATE-D mesmo assim? [S/N]
```

Se todos ✓: prosseguir diretamente para o checklist.

---

**Antes do checklist**, ativar `design-compliance-checker` para varredura completa da spec:
- Verificar todos os componentes do `design.md` contra `docs/design-context/components.md`
- Verificar todos os tokens contra o DS (nenhum valor hardcoded)
- Verificar conformidade com `ux-principles.md`, `feedback-states.md` e `content-guidelines.md`
- Se existir Figma: usar `get_screenshot` para comparar visual com a spec

Se o checker identificar divergências: listar antes de prosseguir — o GATE-D não pode ser aprovado com itens de compliance pendentes.

**Checklist:**

- [ ] Todas as telas do `context.md` (Escopo Incluído) têm design especificado?
- [ ] Todos os fluxos de usuário cobertos?
- [ ] Estados (normal, loading, error, empty, success) definidos para cada tela?
- [ ] Edge cases documentados para cada tela?
- [ ] Microcopy completo (textos exatos, não "lorem ipsum")?
- [ ] Componentes referenciados com nomenclatura exata do DS?
- [ ] Tokens do DS aplicados (não cores/tamanhos hardcoded)?
- [ ] Responsividade especificada para cada breakpoint relevante?
- [ ] Acessibilidade verificada por tela?
- [ ] Link Figma presente para cada tela?
- [ ] Notas de handoff para Dev preenchidas?
- [ ] Cobertura de requisitos mapeada?

**Se qualquer item falhar:**
```
GATE-D FALHOU — Handoff incompleto.
Itens pendentes:
  • <lista dos itens>
Completar antes de sinalizar para o Dev iniciar a implementação.
```

**Se todos os itens passarem:**
```
GATE-D APROVADO — Handoff completo.

Artefato: docs/.cortex/sessions/<slug>/design/design.md ✓
```

Perguntar ao Designer antes de prosseguir:

```
DECISÃO DE QA DE DESIGN

Esta feature requer QA de Design antes do merge?

[S] Sim — Dev aguarda aprovação do Designer antes de mergear (recomendado)
[N] Não — Dev pode mergear após GATE 5 sem revisão de fidelidade

Se [N]:
⚠ AVISO DE RISCO:
  Sem QA de Design, divergências entre spec e implementação
  (ícones incorretos, motion ausente, cores inconsistentes, elementos
  removidos) podem chegar a produção sem detecção.
  Confirmar dispensa do QA? [S/N]
```

Registrar no manifesto: `qaRequired: true|false`

**Esta decisão é obrigatória — o GATE-D não pode ser aprovado sem ela.**
Não há valor padrão. O Designer deve responder explicitamente antes de prosseguir.

Prosseguir para Passo 7 — Aprovação da PM.

---

## Passo 6 — Gerar lean design.md

### Detectar modo: Figma disponível ou não

Verificar se os links Figma das telas foram fornecidos (Passo 3 ou Passo 5):

- **Modo A — Com Figma:** pelo menos um link de frame Figma válido existe → `design.md` é enxuto. Figma é a referência visual. O documento passa apenas o que o Figma não comunica.
- **Modo B — Sem Figma:** nenhum link Figma disponível → `design.md` é um índice. Spec visual completa fica em `archive/design-spec.md`, carregada pelo Dev apenas se precisar de detalhe visual.

---

### Modo A — Com Figma

Criar `docs/.cortex/sessions/<slug>/design/design.md`:

```markdown
# Design Handoff: <nome da feature>

**Status:** awaiting-pm-approval
**Slug:** <slug>
**Responsável:** <designer>
**GATE-D:** aprovado em <data ISO 8601>

---

## Referência Visual (Figma)

| Tela / Fluxo | Link Figma |
|--------------|-----------|
| <nome da tela> | <link do frame> |
| Protótipo interativo | <link ou N/A> |

> Especificação visual completa no Figma (layout, componentes, tokens, responsividade).
> Este documento cobre apenas o que não está visível no Figma.

---

## Interações e Comportamentos

*Por tela — apenas interações não óbvias ou não visíveis no protótipo.*

| Tela | Ação do usuário | Resultado esperado |
|------|----------------|-------------------|
| <Tela> | <ação> | <resultado> |

---

## Regras de Negócio

*Regras que o Figma não comunica — validações, condicionais, permissões.*

- <regra 1>
- <regra 2>

---

## Microcopy

*Textos exatos que o Dev deve usar — não parafrasear.*

| Tela | Elemento | Texto exato |
|------|----------|------------|
| <Tela> | Título | "<texto>" |
| <Tela> | Botão primário | "<texto>" |
| <Tela> | Erro obrigatório | "<texto>" |
| <Tela> | Estado vazio — título | "<texto>" |
| <Tela> | Estado vazio — CTA | "<texto>" |
| <Tela> | Toast de sucesso | "<texto>" |
| <Tela> | Toast de erro | "<texto>" |

---

## Edge Cases e Comportamentos Ocultos

*Situações excepcionais não visíveis no Figma.*

| Tela | Situação | Comportamento esperado |
|------|----------|----------------------|
| <Tela> | <situação> | <comportamento> |

---

## Ativos Protegidos

> NÃO alterar sem aprovação explícita do Designer. Divergências no QA → classificadas como Crítico.

| Ativo | Especificação |
|-------|--------------|
| Ícones | <biblioteca + estilo + regras de tamanho e cor> |
| Ilustrações | <quais telas usam / qual ilustração> |
| Motion | <animações e transições por tela — se houver> |
| Microcopy | Usar textos exatos da seção Microcopy acima — não parafrasear |

---

## Novos Componentes do Projeto

*(Omitir se não houver)*

| Componente | Descrição | Figma | Registrado em custom-components.md |
|------------|-----------|-------|-----------------------------------|
| <Nome> | <spec resumida> | <link> | [ ] |

---

## Notas para o Dev

<observações que não se encaixam nas categorias acima — decisões não óbvias, workarounds>

---

## QA de Design

**Status:** aguardando implementação
**QA obrigatório:** <sim / dispensado pelo Designer>
**Rodadas:** 0
```

---

### Modo B — Sem Figma

Criar `docs/.cortex/sessions/<slug>/design/design.md` como índice:

```markdown
# Design Handoff: <nome da feature>

**Status:** awaiting-pm-approval
**Slug:** <slug>
**Responsável:** <designer>
**GATE-D:** aprovado em <data ISO 8601>

> **Sem link Figma.** Spec visual completa em [`design/archive/design-spec.md`](archive/design-spec.md).
> Leia este documento primeiro. Acesse o spec completo apenas se precisar de detalhe visual de uma tela específica.

---

## Telas desta feature

| Tela / Fluxo | Descrição resumida |
|--------------|-------------------|
| <Tela 1> | <1 linha — o que o usuário faz/vê> |
| <Tela 2> | <1 linha> |

---

## Interações e Comportamentos

| Tela | Ação do usuário | Resultado esperado |
|------|----------------|-------------------|
| <Tela> | <ação> | <resultado> |

---

## Regras de Negócio

- <regra 1>
- <regra 2>

---

## Microcopy

| Tela | Elemento | Texto exato |
|------|----------|------------|
| <Tela> | Título | "<texto>" |
| <Tela> | Botão primário | "<texto>" |
| <Tela> | Erro obrigatório | "<texto>" |
| <Tela> | Estado vazio — título | "<texto>" |
| <Tela> | Estado vazio — CTA | "<texto>" |
| <Tela> | Toast de sucesso | "<texto>" |
| <Tela> | Toast de erro | "<texto>" |

---

## Edge Cases e Comportamentos Ocultos

| Tela | Situação | Comportamento esperado |
|------|----------|----------------------|
| <Tela> | <situação> | <comportamento> |

---

## Ativos Protegidos

| Ativo | Especificação |
|-------|--------------|
| Ícones | <biblioteca + estilo + regras de tamanho e cor> |
| Ilustrações | <quais telas usam / qual ilustração> |
| Motion | <animações e transições por tela — se houver> |
| Microcopy | Usar textos exatos da seção Microcopy acima — não parafrasear |

---

## Novos Componentes do Projeto

*(Omitir se não houver)*

| Componente | Descrição | Registrado em custom-components.md |
|------------|-----------|-----------------------------------|
| <Nome> | <spec resumida> | [ ] |

---

## Notas para o Dev

<observações que não se encaixam nas categorias acima>

---

## QA de Design

**Status:** aguardando implementação
**QA obrigatório:** <sim / dispensado pelo Designer>
**Rodadas:** 0
```

---

**Atualizar `design/manifest.json`:**
```json
"handoff": {
  "status": "done",
  "completedAt": "<ISO 8601>",
  "gateD": "aprovado",
  "figmaAvailable": true,
  "qaRequired": true,
  "pmApproved": false,
  "pmApprovedAt": null,
  "devNotified": false,
  "devNotifiedAt": null
}
```

**Espelhar no `sessions-manifest.json`** (obrigatório — é o único lugar que o boot do Dev lê):
```json
"<slug>": {
  "files": { "design/design.md": true },
  "design": { "gateD": true, "qaRequired": true, "implementation": null }
}
```
Sem esse espelho o Dev não vê `🎨 design pronto` no boot e o handoff depende de alguém avisar por fora.

---

## Passo 7 — Aprovação da PM via Linear

O design está pronto, mas a decisão de quando o Dev inicia é da PM.

### Verificar linear.json da session

Verificar existência de `docs/.cortex/sessions/<slug>/linear.json`:

**Se existir:** ler o arquivo e identificar a subtask de Design:
```bash
cat docs/.cortex/sessions/<slug>/linear.json
```
Registrar `subtasks.design.id` e `subtasks.design.url` como **DESIGN_SUBTASK**.

**Se não existir:**
```
⚠ linear.json não encontrado para esta session.
A estrutura Linear pode não ter sido criada pela PM via GATE 2.

Opções:
  [A] PM deve executar /integrations:linear scaffold --slug <slug> para criar a estrutura
  [B] Informar manualmente o ID/URL da subtask de Design no Linear
  [C] Prosseguir sem Linear (comentário registrado apenas no design.md)
```
Aguardar instrução antes de continuar.

---

**Ação do Designer:**

1. Atualizar a **subtask de Design** no Linear (não a issue principal):
   - Status: `In Review` (ou equivalente do projeto)
   - Comentar na subtask de Design:

```
🎨 Design pronto para aprovação — <feature>

Protótipo/Figma: <link ou "sem Figma — ver design.md">
Handoff (lean): docs/.cortex/sessions/<slug>/design/design.md
Spec completa: docs/.cortex/sessions/<slug>/design/archive/design-spec.md

PM: quando aprovado, mover para Done e notificar Dev para iniciar implementação.
```

2. Aguardar retorno da PM (aprovação acontece no Linear — sem necessidade de branch ou PR).

---

### Se PM solicitar ajustes:

Executar Fase 4 (DESIGN) ou Fase 5 (VALIDATE) para ajustes → retornar ao HANDOFF.
Se for iteração futura após lançamento: executar Fase 6 (HANDOFF) em Modo Iteração.

---

### Se PM aprovar:

Atualizar `design/manifest.json`: `handoff.pmApproved = true`, `handoff.pmApprovedAt = "<ISO 8601>"`
Espelhar no `sessions-manifest.json`: `design.pmApproved = true`.

> A liberação do PM é **sinal de prioridade, não gate de implementação**. O Dev vê `PM não liberou` no
> boot e decide: aguardar, ou seguir em MODO SOLO com a decisão registrada. O design já está correto
> quando o GATE-D passa — o que o PM controla é *quando*, não *se*.

**Gerar Dev Brief e postar no Linear:**

Postar como comentário na **issue principal** da feature (não na subtask de Design).
Se `linear.json` existir: usar `main_issue_url`. Caso contrário: usar o ID informado manualmente.

```
🚀 Dev Brief — <feature> (slug: <slug>)

O que foi projetado:
<resumo em 2-3 linhas do que a feature cobre>

Telas/fluxos incluídos:
• <Tela 1>
• <Tela 2>

Novos componentes (exclusivos do projeto):
• <Nome do componente> — ver design.md
(ou "Nenhum — usar apenas componentes do DS")

Atenção especial:
• <alertas, edge cases críticos, decisões não óbvias>

Referências:
• Figma: <link principal ou "sem Figma">
• design.md (lean): docs/.cortex/sessions/<slug>/design/design.md
• Spec completa: docs/.cortex/sessions/<slug>/design/archive/design-spec.md

Para implementar: /cortex:execution → slug: <slug>
Ler design.md antes de implementar qualquer componente visual.

QA de Design (Fase 7): <obrigatório antes do merge / dispensado pelo Designer>
```

Atualizar `design/manifest.json`: `handoff.devNotified = true`, `handoff.devNotifiedAt = "<ISO 8601>"`
Atualizar `design.md`: `Status: ready`

> `devNotified` é apenas o registro de que o Dev Brief foi postado no Linear. **Não é canal de handoff
> e não é gate** — o handoff real é o espelho de `design.*` no `sessions-manifest.json`, que o boot do
> Dev lê. Não espelhar este campo.

**Atualizar manifesto:** `design.handoff.status = "done"`

---

## MODO ITERAÇÃO — Delta Handoff

*Ativado quando design.md já existe e o usuário escolheu opção [A] no Passo 1.*

Este modo documenta **apenas o que mudou** na iteração, sem sobrescrever o `design.md` original.

### Identificar versão do delta

Verificar quantos `design-delta-vN.md` já existem na session:
- Primeiro delta: `design-delta-v2.md`
- Segundo delta: `design-delta-v3.md`
- E assim por diante.

### Gerar design-delta-vN.md

Criar `docs/.cortex/sessions/<slug>/design/archive/design-delta-vN.md`:

```markdown
# Design — Delta Handoff v<N>: <nome da feature>

**Status:** awaiting-pm-approval
**Slug:** <slug>
**Versão anterior:** design.md (v1) | design-delta-v<N-1>.md
**Iteração:** <breve descrição do que mudou — ex: "Ajustes pós-feedback do cliente na tela X">
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>
**GATE-D:** aprovado em <data>

---

> Este documento cobre apenas as alterações em relação à versão anterior.
> Para telas e fluxos não mencionados aqui: manter conforme design.md (v1) ou delta anterior.

---

## O que mudou

| Tela / Fluxo | Tipo de alteração | Resumo |
|-------------|------------------|--------|
| <Tela X> | Ajuste visual / Novo estado / Novo fluxo / Remoção | <o que mudou> |

---

## Especificação das alterações

### <Nome da Tela ou Fluxo alterado>

**O que mudou:**
<descrição clara e objetiva da alteração>

**O que NÃO mudou:**
Manter conforme [design.md v1 / design-delta-v<N-1>.md] — não alterar.

[spec completa aplicando os mesmos campos do Passo 3, apenas para o que foi alterado]

---

## Novos componentes desta iteração *(se aplicável)*

| Componente | Descrição | Figma | Registrar em custom-components.md |
|------------|-----------|-------|----------------------------------|
| <Nome> | <spec> | <link> | [ ] |

---

## Assets e Links

| Recurso | Link |
|---------|------|
| Figma — tela alterada: <nome> | <link do frame atualizado> |
| Protótipo atualizado | <link ou "N/A"> |

---

## QA de Design

**Status:** aguardando implementação
**Rodadas:** 0
```

### Após gerar design-delta-vN.md:

Repetir Passo 7 (Aprovação da PM) com o delta como referência.
O Dev Brief deve mencionar: "Iteração sobre design existente — ler design-delta-vN.md."
O QA de Design (Fase 7) deve usar o delta como referência para a revisão.

**Atualizar manifesto:** adicionar entrada de delta no histórico de handoffs.
