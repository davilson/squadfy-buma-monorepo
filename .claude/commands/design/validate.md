# CORTEX DESIGN — FASE 5: VALIDATE (v2.0)

> Fase 4 do processo de Product Design.
> Objetivo: testar a solução com usuários ou heurísticas antes do handoff para Dev.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/validation.md`
> GATE-V: ao menos 1 método de validação executado e documentado.

---

## Contexto desta fase

Validação previne retrabalho caro depois do desenvolvimento.
É mais barato corrigir no Figma do que no código em produção.

Esta fase pode usar métodos com ou sem usuários reais — depende do tempo e recursos disponíveis.

---

## Passo 1 — Carregar contexto

Ler obrigatoriamente:
- `docs/.cortex/sessions/<slug>/design/archive/design-spec.md` — a solução a ser validada
- `docs/.cortex/sessions/<slug>/design/archive/research.md` — hipóteses originais (se existir)
- `docs/design-context/ux-principles.md` — princípios para a revisão heurística

Se design-spec.md não existir:
```
Aviso: design-spec.md não encontrado. A fase VALIDATE pressupõe que a UI foi especificada.
Continuar? [S/N]
```

### Checkpoint de Internalização — obrigatório antes de prosseguir

Após carregar os arquivos acima, exibir explicitamente:

```
DESIGN CONTEXT ATIVO — VALIDATE

Princípios UX ativos: <listar os mais relevantes de ux-principles.md para avaliação heurística>
Heurísticas de referência: <extraído de ux-principles.md ou "usar Nielsen 10 heurísticas como fallback">

Carry-forward:
  [Research] Hipóteses originais: <lista de archive/research.md ou "fase não realizada">
  [Architect] Fluxos a validar: <lista de telas de archive/flows.md ou "fase não realizada">
  [UI] Spec em validação: archive/design-spec.md — <confirmar que foi carregada>

Arquivos carregados: <lista> | Ausentes: <lista ou "nenhum">
```

Não prosseguir sem exibir este bloco.

---

## Passo 2 — Definir método de validação

Perguntar ao usuário:

```
Qual método de validação será utilizado?

[1] Teste de usabilidade moderado (com facilitador + usuário)
[2] Teste de usabilidade não-moderado (usuário realiza tarefas sozinho — ex: Maze, UserTesting)
[3] Revisão heurística (Designer/PO avalia contra as heurísticas de Nielsen)
[4] Revisão com stakeholders (apresentação para PM, TechLead, C-level)
[5] Teste A/B (comparação de variantes em produção — só após lançamento)
[6] Combinação de métodos
[7] Validação visual automatizada (screenshot + comparação com spec)
    → Tirar screenshot via get_screenshot do frame Figma
    → Comparar com design-spec.md (componentes, tokens, estados)
    → Listar divergências encontradas
    → Iterar via use_figma até visual bater com spec
    → Não requer usuário real — pode ser executada pelo próprio agente
[8] Teste de acessibilidade (WCAG + prefers-reduced-motion)
    → Verificar critérios WCAG AA no protótipo ou design-spec
    → Ferramenta sugerida: Colour Contrast Analyser, plugin Figma A11y
    → Ver seção 3.8 para protocolo completo

Qual o prazo disponível para esta validação?
```

---

## Passo 3 — Executar e documentar a validação

### 3.1 Teste de usabilidade (moderado ou não-moderado)

**Planejamento:**

```
**Método:** <moderado / não-moderado>
**Ferramenta:** <Maze / UserTesting / Lookback / presencial>
**Nível de fidelidade do protótipo:** <baixa / média / alta>
**Número de participantes:** <N> (mínimo recomendado: 5)
**Perfil dos participantes:** <persona alvo>

**Tarefas testadas:**
  1. "<instrução da tarefa 1>"
  2. "<instrução da tarefa 2>"

**Métricas de sucesso:**
  • Taxa de conclusão da tarefa ≥ <X>%
  • Tempo médio de conclusão ≤ <X> minutos
  • Erros críticos (task failure): 0
```

**Resultados:**

```
**Data da sessão:** <data>
**Participantes:** <N realizados>

**Resultados por tarefa:**

| Tarefa | Taxa de conclusão | Tempo médio | Erros encontrados |
|--------|------------------|-------------|-------------------|
| <tarefa 1> | <X>% | <Xmin> | <lista de erros> |

**Comportamentos observados:**
  • <o que os usuários fizeram que não esperávamos>

**Pontos de confusão:**
  • <onde os usuários travaram ou erraram>

**Citações relevantes:**
  • "<fala do usuário>"

**Problemas identificados:**

| Problema | Severidade (1-4) | Frequência | Tela afetada |
|----------|-----------------|-----------|--------------|
| <descrição> | <1=cosmético / 2=menor / 3=maior / 4=crítico> | <N/N participantes> | <tela> |
```

---

### 3.2 Revisão heurística

Ativar `design-compliance-checker` antes de iniciar a revisão:
- Verificar se todos os componentes da `design-spec.md` existem em `docs/design-context/components.md`
- Verificar se tokens usados estão no DS
- Verificar conformidade com `docs/design-context/ux-principles.md` e `docs/design-context/feedback-states.md`

Registrar os resultados do checker como itens na heurística **4. Consistência e padrões** antes de prosseguir.

Avaliar a design-spec contra as 10 Heurísticas de Nielsen:

```
| Heurística | Status | Problemas encontrados | Severidade |
|------------|--------|-----------------------|------------|
| 1. Visibilidade do status do sistema | OK/Atenção/Crítico | — | — |
| 2. Compatibilidade com o mundo real | — | — | — |
| 3. Controle e liberdade do usuário | — | — | — |
| 4. Consistência e padrões | — | — | — |
| 5. Prevenção de erros | — | — | — |
| 6. Reconhecimento em vez de memória | — | — | — |
| 7. Flexibilidade e eficiência | — | — | — |
| 8. Estética e design minimalista | — | — | — |
| 9. Ajuda ao reconhecer e recuperar erros | — | — | — |
| 10. Ajuda e documentação | — | — | — |
```

---

### 3.3 Revisão com stakeholders

```
**Participantes:** <PM, TechLead, outros>
**Data:** <data>
**Formato:** <apresentação / revisão assíncrona no Figma>

**Feedback recebido:**
  • <PM>: "<feedback>"
  • <TechLead>: "<feedback>
  • <outros>: "<feedback>"

**Itens aprovados:** <lista>
**Itens para revisão:** <lista>
**Bloqueadores:** <itens que impedem o avanço para handoff>
```

---

### 3.8 Teste de acessibilidade

> Executar quando a feature tem interface visual.
> Mais barato corrigir no design do que pós-implementação.
> Referências: `docs/design-context/accessibility.md` e `docs/design-context/motion-principles.md`.

**Ferramentas sugeridas:**
- Contraste de cores: Colour Contrast Analyser (app gratuito) ou plugin Figma "Contrast"
- Estrutura geral: plugin Figma "A11y Annotation Kit" ou "Able"
- Motion: verificação manual contra `prefers-reduced-motion`

**Protocolo — para cada tela ou componente do design-spec.md:**

```
**Tela / Componente:** <nome>

| Critério WCAG | Elemento testado | Meta | Resultado | Status |
|---------------|-----------------|------|-----------|--------|
| Contraste texto normal (AA) | <label, parágrafo> | ≥ 4.5:1 | <ratio medido> | ✓/✗ |
| Contraste texto grande (AA) | <título, heading> | ≥ 3:1 | <ratio medido> | ✓/✗ |
| Contraste componentes UI | <botão, input border> | ≥ 3:1 | <ratio medido> | ✓/✗ |
| Label em inputs | <campos do formulário> | Todos com label | <ok/ausente> | ✓/✗ |
| Foco visível | <elementos interativos> | Ring visível | <ok/ausente> | ✓/✗ |
| Ordem lógica de Tab | <sequência de foco> | Flui naturalmente | <ok/quebrada> | ✓/✗ |
| Alt text em imagens | <imagens informativas> | Todos com alt | <ok/ausente> | ✓/✗ |
| ARIA roles necessários | <modais, alerts, tooltips> | Declarados | <ok/ausente> | ✓/✗ |

**Animações presentes?** <sim / não>
Se sim:
  → Existe fallback para prefers-reduced-motion? <sim / não / a definir em HANDOFF>
  → Duração das animações ≤ 400ms? <sim / não>
  → Animação é decorativa (pode omitir) ou funcional (deve ter alternativa)? <decorativa / funcional>

**Problemas críticos (bloqueiam GATE-V):**
  • <ex: contraste de 2.1:1 no texto de label — abaixo de 4.5:1>

**Problemas menores (P1 — corrigir antes do handoff):**
  • <ex: input de busca sem label visível>
```

**Classificação de severidade para acessibilidade:**
- **Crítico (P0):** contraste de texto abaixo de WCAG AA, input sem label, modal sem ARIA role — bloqueia GATE-V
- **Relevante (P1):** foco visível ausente em elemento interativo, animação sem prefers-reduced-motion — corrigir antes de HANDOFF
- **Oportunidade (P2):** melhorias de AAA ou refinamentos não bloqueantes — próximo ciclo

---

## Passo 4 — Síntese e plano de correções

```
## Síntese da validação

**Métodos utilizados:** <lista>
**Resultado geral:** <a solução funciona / precisa de ajustes / precisa de redesign>

## Problemas críticos (P0 — bloqueia handoff)
  1. <problema> → Correção: <o que mudar>

## Problemas relevantes (P1 — corrigir antes do handoff)
  1. <problema> → Correção: <o que mudar>

## Melhorias de oportunidade (P2 — próximo ciclo)
  1. <problema> → Proposta: <o que poderia melhorar>

## Decisão
  [ ] Aprovado para handoff (sem correções necessárias)
  [ ] Aprovado após correções de P0 e P1
  [ ] Requer redesign da tela/fluxo: <especificar>
```

---

## GATE-V — Verificação antes de avançar

**Checklist:**
- [ ] Ao menos 1 método de validação executado e documentado
- [ ] Problemas classificados por severidade
- [ ] Plano de correção definido para P0 e P1
- [ ] Decisão de avanço (aprovado / aprovado com correções / redesign) registrada
- [ ] Se houver redesign necessário: design-spec.md atualizado antes do handoff

**Se itens estiverem incompletos:**
```
GATE-V — Validação incompleta.
Itens pendentes:
  • <lista>
Recomendado completar antes de avançar para HANDOFF.
Avançar mesmo assim? [S/N]
```

**Se todos os itens estiverem completos:**
```
GATE-V APROVADO — Validação documentada.
Artefato: docs/.cortex/sessions/<slug>/design/archive/validation.md ✓

Próximo passo recomendado: Fase 5 — HANDOFF
  → Gerar especificação completa para o Dev implementar.
```

---

## Passo 5 — Gerar validation.md

Criar `docs/.cortex/sessions/<slug>/design/archive/validation.md`:

```markdown
# Validação: <nome da feature>

**Status:** done
**Slug:** <slug>
**Fase:** 4 — Validate
**Iniciado em:** <data ISO 8601>
**Fechado em:** <data ISO 8601>
**Responsável:** <designer>

---

## Método(s) utilizado(s)

<lista dos métodos>

---

## Resultados

<conteúdo do Passo 3 — por método>

---

## Síntese e plano de correções

<conteúdo do Passo 4>

---

## Decisão

<aprovado / aprovado com correções / redesign>
```

**Atualizar manifesto:** `design.validate.status = "done"`
