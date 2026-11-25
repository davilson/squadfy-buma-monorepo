# CORTEX DESIGN — FASE 0: EXPLORE (v1.0)

> Fase 0 do processo de Product Design — opcional e sem pré-requisitos.
> Objetivo: espaço livre para o Designer explorar uma tarefa antes de entrar no ciclo formal.
> Dois modos: Conversa Livre (sem artefato) ou Mapeamento (documento de escopo leve).
> Não gera gates nem bloqueia fases seguintes.

---

## Apresentação dos modos

Apresentar ao Designer:

```
FASE 0 — EXPLORE

Espaço de exploração antes do ciclo formal.
Sem gates. Sem artefatos obrigatórios.

Como você quer trabalhar?

  [A] CONVERSA LIVRE
      Pensa junto, levanta dúvidas, explora possibilidades.
      Sem documento gerado (a menos que você queira salvar pontos-chave ao final).

  [B] MAPEAMENTO
      Gera design-explore-<slug>.md com:
        • Resumo da feature
        • Telas possivelmente envolvidas
        • Fases recomendadas para este trabalho
        • Perguntas abertas
        • Dependências e próximos passos
      Serve de insumo para as fases formais.
```

---

## MODO A — Conversa Livre

Iniciar conversa aberta sem estrutura formal.

O Designer pode:
- Descrever a tarefa e pensar em voz alta
- Fazer perguntas sobre escopo
- Explorar alternativas de abordagem
- Levantar incertezas e dependências sem comprometer nada

Responder como parceiro de design — sem templates, sem gates, sem outputs obrigatórios.

Ao final, perguntar:

```
Quer que eu salve os pontos principais como notas?
Posso gerar um resumo em design-notes-<data>.md para referência futura.
```

**Se sim** → salvar em `docs/.cortex/sessions/<slug>/design/design-notes-<data>.md`:

```markdown
# Notas de Exploração — <data ISO 8601>

**Feature:** <descrição breve>
**Designer:** <nome>

---

## Pontos levantados
- <ponto>

## Perguntas abertas
- <pergunta>

## Próximos passos cogitados
- <passo>
```

**Exibir ao salvar:**
```
Notas salvas em docs/.cortex/sessions/<slug>/design/design-notes-<data>.md ✓

Pronto para o ciclo formal? /cortex:design → escolha a fase de entrada.
```

---

## MODO B — Mapeamento

Conduzir conversa estruturada para preencher o documento de escopo.

**Perguntas de levantamento:**

1. "Qual é a feature ou tarefa que você quer mapear?"
2. "Você tem contexto prévio? (Linear, Figma, conversas com PM/Dev)"
3. "Já tem alguma ideia de quais telas ou fluxos estarão envolvidos?"
4. "Há alguma restrição ou incerteza que você já identificou?"

**Se o usuário fornecer um link Figma** (figma.com/...) em qualquer resposta:
- Chamar `get_design_context` ou `get_metadata` com o fileKey e nodeId extraídos da URL
- Usar o conteúdo para enriquecer o mapeamento: telas existentes, componentes, fluxos já desenhados
- Capturar `get_screenshot` do frame principal como referência visual no documento

A partir das respostas, preencher e gerar:

---

### Estrutura do design-explore-<slug>.md

```markdown
# Design Explore — <slug>

**Data:** <ISO 8601>
**Designer:** <nome>
**Status:** exploração — não formal

---

## Resumo da feature

<1-2 parágrafos descrevendo o que será desenhado>

---

## Telas possivelmente envolvidas

| Tela | Tipo | Observação |
|------|------|------------|
| <nome> | nova / modificação | <contexto> |

---

## Fases recomendadas para este trabalho

| Fase | Recomendada? | Motivo |
|------|-------------|--------|
| [1] RESEARCH   | Sim / Não / Talvez | <motivo> |
| [2] ARCHITECT  | Sim / Não / Talvez | |
| [3] IDEATE     | Sim / Não / Talvez | |
| [4] DESIGN     | Sim | sempre |
| [5] VALIDATE   | Sim / Não / Talvez | |
| [6] HANDOFF    | Sim | sempre |
| [7] QA         | Sim / Não | depende da decisão no HANDOFF |
| [8] ITERATE    | Pós-lançamento | sempre |

---

## Perguntas abertas

| # | Pergunta | Para quem | Status |
|---|---------|----------|--------|
| 1 | <pergunta> | PM / Dev / Designer | aberta |

---

## Dependências identificadas

- <decisão de PM pendente / definição técnica / conteúdo necessário>

---

## Próximos passos sugeridos

1. <passo>
2. <passo>
```

---

**Exibir ao concluir o Modo B:**

```
EXPLORE concluído — Modo B

design-explore-<slug>.md salvo em docs/.cortex/sessions/<slug>/design/ ✓

Fases recomendadas: <lista>

Próximos passos:
  Para iniciar: /cortex:design → selecione a primeira fase recomendada
  Este documento pode ser referenciado em qualquer fase do ciclo formal.
```

---

## Transição para fases formais (ambos os modos)

Ao encerrar, exibir:

```
Pronto para entrar no ciclo formal?

  /cortex:design → [1] RESEARCH    — se precisar de descoberta
  /cortex:design → [2] ARCHITECT   — se o problema já está claro
  /cortex:design → [4] DESIGN      — se já tem direção definida
```
