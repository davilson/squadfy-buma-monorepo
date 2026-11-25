# CORTEX DESIGN — FASE 8: ITERATE (v2.0)

> Fase 8 do processo de Product Design.
> Objetivo: analisar a feature após lançamento e identificar melhorias incrementais.
> Entrega obrigatória: `docs/.cortex/sessions/<slug>/design/archive/iteration.md`
> Pré-requisito: feature lançada em produção.

---

## Contexto desta fase

O lançamento não é o fim — é o começo do aprendizado com dados reais.
Esta fase fecha o ciclo de design e alimenta o próximo.

---

## Passo 1 — Verificar pré-condição

Confirmar com o usuário:

```
A feature <slug> já foi lançada em produção?
Há quanto tempo está em produção? <data de lançamento>
Há dados disponíveis? (analytics, heatmaps, feedback de usuários)
```

Se não lançada ainda:
```
A fase ITERATE só pode ser executada após o lançamento em produção.
Quando a feature for ao ar, retorne aqui com /cortex:design → [6] ITERATE.
```

---

## Passo 2 — Coletar dados pós-lançamento

### 2.1 Métricas quantitativas

```
**Fonte:** <Google Analytics / Mixpanel / Amplitude / outro>
**Período analisado:** <data início> a <data fim>

**Métricas de adoção:**
| Métrica | Valor | Meta original | Status |
|---------|-------|--------------|--------|
| Usuários únicos que usaram a feature | | | OK/Abaixo/Acima |
| Taxa de conclusão do fluxo principal | | | — |
| Tempo médio para completar a tarefa | | | — |
| Taxa de erro (erros por sessão) | | | — |
| Taxa de abandono por etapa | | | — |

**Funil de conversão:**
| Etapa | Usuários | Drop-off |
|-------|----------|----------|
| Entrada na feature | <N> | — |
| <Etapa 2> | <N> | <X>% |
| Conclusão | <N> | <X>% |
```

### 2.2 Dados qualitativos

```
**Heatmaps:**
  Ferramenta: <Hotjar / Microsoft Clarity / outro>
  Período: <datas>
  Achados:
    • <o que os usuários clicam / onde param>
    • <elementos ignorados>
    • <padrões inesperados>

**Gravações de sessão:**
  N sessões analisadas: <N>
  Achados:
    • <comportamentos observados>
    • <pontos de confusão recorrentes>

**Feedback direto de usuários:**
  Fonte: <tickets de suporte / NPS / avaliações / pesquisa>
  Achados:
    • Elogios: <o que está funcionando bem>
    • Reclamações: <o que está frustrando>
    • Solicitações: <o que pedem que não existe>
```

---

## Passo 3 — Comparar com hipóteses originais

Resgatar hipóteses e objetivos do research (fase 1) e comparar com a realidade:

```
## Hipóteses vs. Realidade

| Hipótese original (Research) | O que aconteceu na prática | Status |
|-----------------------------|---------------------------|--------|
| <hipótese 1> | <o que os dados mostram> | Confirmada / Refutada / Parcial |
| <hipótese 2> | — | — |

## Objetivos de UX vs. Realidade

| Objetivo | Meta | Resultado | Status |
|----------|------|-----------|--------|
| <objetivo 1> | <meta> | <resultado> | Atingido / Não atingido |
```

---

## Passo 4 — Identificar melhorias

Com base nos dados coletados, classificar oportunidades:

```
## Melhorias identificadas

### P0 — Críticas (bloqueia usuários ou causa abandono significativo)
| Problema | Evidência | Impacto estimado | Solução proposta |
|---------|-----------|-----------------|-----------------|
| <problema> | <dado que confirma> | <X% dos usuários afetados> | <proposta> |

### P1 — Relevantes (afetam experiência mas não impedem uso)
| Problema | Evidência | Solução proposta |
|---------|-----------|-----------------|
| <problema> | <dado> | <proposta> |

### P2 — Oportunidades (melhorias incrementais de UX)
| Oportunidade | Potencial impacto | Próximo ciclo |
|-------------|------------------|--------------|
| <oportunidade> | <o que melhora> | <sim/não> |
```

---

## Passo 5 — Decisão de próximo ciclo

```
## Decisão

Com base nos dados desta análise:

[ ] Feature está performando bem — monitorar e intervir apenas se métricas piorarem
[ ] Melhorias P0 e/ou P1 identificadas — priorizar no próximo sprint/ciclo
[ ] Problemas estruturais — necessário redesign significativo (abrir nova session Strategy)
[ ] Oportunidades de expansão identificadas — registrar como ideia no backlog

**Próximas ações recomendadas:**
  1. <ação 1>
  2. <ação 2>

**Issues a criar no Linear (se aplicável):**
  • <título da issue> — <prioridade>
```

---

## Passo 6 — Gerar iteration.md

Criar `docs/.cortex/sessions/<slug>/design/archive/iteration.md`:

```markdown
# Iteração Pós-Lançamento: <nome da feature>

**Status:** done
**Slug:** <slug>
**Fase:** 6 — Iterate
**Feature lançada em:** <data de lançamento>
**Análise realizada em:** <data ISO 8601>
**Responsável:** <designer>

---

## Dados coletados

<conteúdo do Passo 2>

---

## Hipóteses vs. Realidade

<conteúdo do Passo 3>

---

## Melhorias identificadas

<conteúdo do Passo 4>

---

## Decisão e próximas ações

<conteúdo do Passo 5>
```

**Atualizar manifesto:** `design.iterate.status = "done"`

Exibir ao concluir:
```
ITERATE concluído.
Artefato: docs/.cortex/sessions/<slug>/design/archive/iteration.md ✓

Ciclo de design da feature <slug> encerrado.

Melhorias P0/P1 identificadas? Abrir nova session ou issues no Linear.
Novas ideias identificadas? /cortex:idea para registrar no backlog.
```
