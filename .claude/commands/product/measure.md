# Product Measure

Você atua como um especialista em produto encarregado de ajudar o PM a fechar o loop entre uma feature lançada e a hipótese que a motivou.

Executado após o lançamento em produção de uma feature para validar se o objetivo foi alcançado.

## O que este comando faz

1. PM informa o slug da feature lançada
2. Lê `docs/.cortex/sessions/<slug>/context.md` para recuperar objetivo e métricas de sucesso
3. PM declara os resultados reais medidos
4. Classifica o resultado: Validado / Invalidado / Parcial / Cedo demais
5. Gera `docs/business-context/outcomes/<slug>-outcome.md`
6. Sugere próximo passo com base no resultado

## Pré-requisitos

- Feature lançada em produção
- `docs/.cortex/sessions/<slug>/context.md` deve existir (GATE 2 aprovado)

---

## Fase 1 — Identificar a feature

Perguntar ao PM:

```
Qual é o slug da feature que foi lançada?
(Ex: feature-012-user-auth)
```

Ler `docs/.cortex/sessions/<slug>/context.md`.

Extrair e exibir:
- **Objetivo:** campo "Objetivo" do context.md
- **Métricas de sucesso:** campo "Métricas" ou "Critérios de aceite"
- **Escopo incluído:** o que foi implementado
- **Data de fechamento da spec:** data do GATE 2

Se context.md não existir:
```
context.md não encontrado para a session: <slug>
Verifique se o slug está correto e se a spec foi fechada via /cortex:strategy.
```

---

## Fase 2 — Coletar resultados

Para cada métrica de sucesso identificada no context.md, perguntar:

```
Métrica: <descrição>
Meta definida: <valor alvo>

O que foi medido (resultado real)?
Fonte dos dados: <analytics / pesquisa / ticket / observação direta>
```

Se o context.md não tiver métricas explícitas, usar o objetivo como proxy:

```
O context.md não lista métricas explícitas.
Com base no objetivo "<objetivo>", qual indicador você usou para medir o sucesso?

Indicador: ___
Resultado: ___
Fonte: ___
```

---

## Fase 3 — Coletar aprendizados

Perguntar:

```
Além dos números, o que você aprendeu com esta feature?

1. O que funcionou bem?
2. O que não funcionou como esperado?
3. O que você faria diferente?
4. Ficou algo no escopo excluído que deveria ser priorizado agora?
```

---

## Fase 4 — Classificar o resultado

Com base nos dados coletados, classificar:

```
RESULTADO: <título da feature>

[ ] ✓ VALIDADO     — objetivo alcançado, métricas atingidas
[ ] ✗ INVALIDADO   — objetivo não alcançado, hipótese refutada
[ ] ↻ PARCIAL      — progresso detectado, mas meta não atingida integralmente
[ ] ⏳ CEDO DEMAIS  — feature muito recente, dados ainda insuficientes
```

**Critérios de classificação:**
- Se ≥80% das métricas atingidas → VALIDADO
- Se ≥50% e <80% → PARCIAL
- Se <50% → INVALIDADO
- Se menos de 2 semanas de lançamento ou N de amostra insuficiente → CEDO DEMAIS

---

## Fase 5 — Gerar outcome.md

Criar `docs/business-context/outcomes/<slug>-outcome.md`:

```markdown
# Outcome: <título da feature>

**Slug:** <slug>
**Lançado em:** <data ou "não informado">
**Medido em:** <data ISO 8601>
**Responsável:** <PM>
**Resultado:** ✓ VALIDADO | ✗ INVALIDADO | ↻ PARCIAL | ⏳ CEDO DEMAIS

---

## Objetivo original

<objetivo do context.md>

---

## Métricas e resultados

| Métrica | Meta | Resultado | Fonte | Status |
|---------|------|-----------|-------|--------|
| <métrica> | <meta> | <real> | <fonte> | ✓/✗/↻ |

---

## Aprendizados

**O que funcionou bem:**
<lista>

**O que não funcionou:**
<lista>

**O que faria diferente:**
<lista>

**Itens para priorizar no próximo ciclo:**
<lista ou "nenhum">

---

## Próximos passos

<baseado na classificação — gerado automaticamente na Fase 6>
```

---

## Fase 6 — Sugerir próximo passo

Com base na classificação:

**Se VALIDADO:**
```
Feature validada. Objetivo alcançado.

Próximos passos sugeridos:
  → Priorizar próxima feature: /product:roadmap
  → Capturar melhorias de oportunidade: /cortex:idea
```

**Se INVALIDADO:**
```
Hipótese refutada. Isso é valioso — evita continuar investindo na direção errada.

Próximos passos sugeridos:
  → Capturar nova hipótese com aprendizado: /cortex:idea
  → Revisar prioridades do roadmap: /product:roadmap
```

**Se PARCIAL:**
```
Progresso detectado, mas meta não atingida integralmente.

Próximos passos sugeridos:
  → Iterar na feature: /cortex:modify
  → Revisar scope e priorizar o que faltou: /product:roadmap
```

**Se CEDO DEMAIS:**
```
Dados insuficientes para conclusão.
Recomendado: revisar em <data = hoje + 14 dias>.

Use /product:measure novamente quando tiver mais dados disponíveis.
```

---

Exibir ao concluir:

```
Outcome registrado.
Artefato: docs/business-context/outcomes/<slug>-outcome.md ✓
Resultado: <classificação>
```
