# CORTEX DESIGN — FASE 7: QA DE DESIGN (v1.0)

> Fase 7 do processo de Product Design.
> Objetivo: verificar fidelidade da implementação ao design especificado antes do merge do PR.
> Entrega: seção QA preenchida em `docs/.cortex/sessions/<slug>/design/design.md`
> Pré-requisito: Dev sinalizou implementação pronta no Linear (GATE 5 aprovado).

---

## Contexto desta fase

O QA de Design fecha o ciclo entre spec e produto implementado.
O Designer revisa o que foi construído **sem precisar acessar código ou puxar branches**.
A revisão acontece via **preview URL** (Vercel, Netlify, staging) ou **screenshots/gravação** compartilhados pelo Dev no Linear.

O PR permanece aberto até QA aprovado. Somente após aprovação pode ser merged.

---

## Passo 1 — Verificar pré-condição

Confirmar com o Designer:

```
A implementação da feature <slug> está pronta para revisão?

Link do preview compartilhado pelo Dev no Linear: <URL>
Branch em revisão: <nome da branch>
```

Se não houver preview disponível:
```
QA de Design requer um ambiente de visualização.
O Dev deve compartilhar no Linear (comentário na task):
  • Preview URL (Vercel/Netlify/staging) — preferencial
  • Screenshots de todas as telas e estados
  • Gravação de tela dos fluxos principais

Aguardar sinalização do Dev antes de iniciar esta fase.
```

---

## Passo 2 — Carregar referência de design

Ler obrigatoriamente:
- `docs/.cortex/sessions/<slug>/design/design.md` — spec completa (v1)
- `docs/.cortex/sessions/<slug>/design/design-delta-vN.md` — se for iteração (usar o mais recente)
- `docs/design-context/components.md` — nomenclatura de componentes
- `docs/design-context/feedback-states.md` — padrões de estado
- `docs/design-context/motion-principles.md` — animações globais

**Para cada tela com Link Figma registrado no `design.md`**, chamar `get_screenshot` do frame correspondente:
- Usar como referência visual lado a lado com o preview do Dev
- Registrar internamente: screenshot de referência por tela

Se o link Figma não estiver disponível para uma tela: usar a descrição da spec como referência e sinalizar na revisão.

Registrar internamente: lista de telas/fluxos a revisar, estados esperados por tela, motion specs por tela, screenshots de referência Figma.

---

## Passo 3 — QA por tela

Para cada tela/fluxo especificado no `design.md` (ou `design-delta`), revisar contra o preview:

```
### QA — <Nome da Tela>

**Referência Figma:** <link do design.md>
**Preview:** <link ou "conforme URL compartilhada">

| Critério | Status | Observação |
|----------|--------|------------|
| Layout e hierarquia visual | ✓ / ✗ | <detalhe se ✗> |
| Componentes corretos (nome, variante, props) | ✓ / ✗ | |
| Tokens aplicados (sem hardcode de cores/tamanhos) | ✓ / ✗ | |
| Estado: Normal | ✓ / ✗ | |
| Estado: Loading | ✓ / ✗ | |
| Estado: Empty | ✓ / ✗ | |
| Estado: Error | ✓ / ✗ | |
| Estado: Success | ✓ / ✗ | |
| Edge cases cobertos | ✓ / ✗ | |
| Responsividade — Desktop (≥1024px) | ✓ / ✗ | |
| Responsividade — Tablet (768px–1023px) | ✓ / ✗ | |
| Responsividade — Mobile (<768px) | ✓ / ✗ | |
| Microcopy — CTAs exatos (sem paráfrase) | ✓ / ✗ | |
| Microcopy — labels de campo exatos | ✓ / ✗ | |
| Microcopy — mensagens de erro exatas | ✓ / ✗ | |
| Microcopy — textos de estado (empty, success) exatos | ✓ / ✗ | |
| Acessibilidade (contraste, foco visível, ARIA) | ✓ / ✗ | |
| Ícones — biblioteca correta, tamanho e estilo (icon-guidelines.md) | ✓ / N/A / ✗ | |
| Ilustrações — presentes onde especificado, estilo correto (illustration-guidelines.md) | ✓ / N/A / ✗ | |
| Motion / transições (durações e easings conforme motion-principles.md) | ✓ / N/A / ✗ | |

**Ativos Protegidos — verificação obrigatória (conforme design.md § Ativos Protegidos):**

| Ativo | Spec | Implementado | Status |
|-------|------|-------------|--------|
| Ícones | <conforme spec> | <o que foi implementado> | ✓ / ✗ |
| Ilustrações | <conforme spec> | <o que foi implementado> | ✓ / ✗ |
| Motion | <conforme spec> | <o que foi implementado> | ✓ / ✗ |
| Tokens de cor | <conforme spec> | <o que foi implementado> | ✓ / ✗ |

Qualquer ✗ em Ativo Protegido é classificado automaticamente como **Crítico**.

**Resultado desta tela:** ✓ Aprovada / ✗ Reprovada — <N> pendências
```

Repetir para cada tela/fluxo da spec.

---

## Passo 4 — Consolidar resultado

```
## Resultado do QA de Design

**Data:** <data ISO 8601>
**Designer responsável:** <nome>
**Preview revisado:** <URL>
**Rodada:** <1ª / 2ª / ...>

### Telas aprovadas
- <Nome da Tela> ✓
- <Nome da Tela> ✓

### Telas com pendências
- <Nome da Tela> ✗ — <N> pendências

---

## Pendências identificadas

| # | Tela | Descrição do problema | Severidade | Como corrigir |
|---|------|-----------------------|------------|---------------|
| 1 | <tela> | <o que diverge do design.md> | Crítico | <instrução clara> |
| 2 | <tela> | <problema> | Relevante | <instrução> |
| 3 | <tela> | <problema> | Observação | <sugestão> |

**Legenda de severidade:**
- Crítico — diverge significativamente do design; bloqueia aprovação
- Relevante — deve ser corrigido antes do merge; não bloqueia se Dev concordar com prazo
- Observação — melhoria desejável; não bloqueia o merge

**Status geral:** Aprovado / Reprovado
**Pendências críticas:** <N>
**Pendências relevantes:** <N>
**Observações:** <N>
```

---

## Passo 5 — Comunicar resultado via Linear

### Se aprovado:

Postar comentário na task do Linear:

```
✅ QA de Design — Aprovado

Todas as telas revisadas conforme design.md.
Branch: <nome da branch>
Revisado por: <designer>

O PR pode ser merged.
```

Ações do Designer:
1. Atualizar `design.md` → seção QA → Status: `aprovado`
2. Postar comentário no Linear (texto acima)
3. Atualizar manifesto: `qa.status = "done"`

---

### Se reprovado:

Postar comentário na task do Linear:

```
⚠️ QA de Design — Reprovado (<N> pendências críticas, <N> relevantes)

Branch: <nome da branch>
Revisado por: <designer>

Pendências:
1. [Tela X] <descrição> — Crítico — <como corrigir>
2. [Tela Y] <descrição> — Relevante — <como corrigir>
3. [Tela Z] <descrição> — Observação — <sugestão>

O PR não deve ser merged até resolução das pendências críticas e relevantes.
Dev: corrigir e sinalizar nova rodada de QA nesta task.
```

Ações do Designer:
1. Postar comentário no Linear (texto acima)
2. Dev corrige na mesma branch
3. Dev posta no Linear quando pronto para nova rodada
4. Designer repete Fase 7 — nova rodada de QA

**O PR não deve ser merged até QA aprovado.**

---

## Passo 6 — Atualizar design.md

Preencher a seção QA no `docs/.cortex/sessions/<slug>/design/design.md`:

```markdown
## QA de Design

**Status:** aprovado | reprovado — <N> pendências abertas
**Aprovado em:** <data ISO 8601 | "pendente">
**Responsável:** <designer>
**Rodadas realizadas:** <N>

<conteúdo do Passo 4 — resultado consolidado>
```

**Atualizar manifesto:** `design.qa.status = "done"`

Exibir ao concluir:
```
QA DE DESIGN concluído.

Status: <Aprovado / Reprovado — N pendências>
design.md atualizado ✓
Linear notificado ✓

Próximos passos:
  Aprovado → Dev pode mergear o PR
  Reprovado → Dev corrige → Nova rodada de QA
  Após merge e lançamento → /cortex:design → [8] ITERATE
```
