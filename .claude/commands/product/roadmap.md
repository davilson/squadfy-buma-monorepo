# Product Roadmap

Você atua como um especialista em produto encarregado de ajudar o PM a construir e manter uma visão de roadmap priorizado a partir do backlog e das sessions em andamento.

## O que este comando faz

1. Lê todas as ideias em `docs/business-context/backlog/`
2. Lê `docs/.cortex/sessions-manifest.json` para ver o que está em progresso e fechado
3. Monta uma visão estruturada: Doing / Backlog / Closed
4. Guia o PM a priorizar o backlog com matriz impacto × esforço
5. PM atribui horizonte temporal: Agora / Próximo / Futuro
6. Gera ou atualiza `docs/business-context/roadmap.md`

## Pré-requisitos

- `docs/business-context/` deve existir
- Ao menos 1 ideia em `docs/business-context/backlog/` OU 1 session no manifesto

---

## Fase 1 — Carregar estado atual

### 1.1 Ler backlog

Listar todos os arquivos em `docs/business-context/backlog/`.

Para cada arquivo, extrair:
- `**Tipo:**`
- `**Impacto estimado:**`
- `**Status:**`
- Título (H1 do arquivo)

Se o diretório estiver vazio ou não existir:
```
Backlog vazio. Capture ideias com /cortex:idea antes de usar este comando.
```

### 1.2 Ler sessions manifest

Ler `docs/.cortex/sessions-manifest.json`.

Extrair:
- Sessions com `status: "in_progress"` → coluna **Doing** (spec em aberto)
- Sessions com `status: "spec_closed"` → coluna **Doing** (spec fechada, pronta para implementar)
- Sessions com `status: "closed"` → coluna **Histórico** (últimas 5)

Se o manifesto não existir:
```
Manifesto não encontrado. Execute /cortex:boot para inicializar o framework.
```

### 1.3 Verificar roadmap existente

Se `docs/business-context/roadmap.md` existir: exibir conteúdo atual como ponto de partida.
Se não existir: criar do zero.

---

## Fase 2 — Exibir visão atual

Exibir ao PM:

```
═══════════════════════════════════════════════
ROADMAP — VISÃO ATUAL
═══════════════════════════════════════════════

▶ DOING (<N> sessions em progresso)
──────────────────────────────────────────────
  • <slug> — <descrição breve>
  • <slug> — <descrição breve>

📋 BACKLOG (<N> itens)
──────────────────────────────────────────────
  Impacto alto:
    • <título> [<tipo>]
  Impacto médio:
    • <título> [<tipo>]
  Impacto baixo:
    • <título> [<tipo>]

✓ HISTÓRICO (últimas 5 fechadas)
──────────────────────────────────────────────
  • <slug> — fechado em <data>
═══════════════════════════════════════════════
```

---

## Fase 3 — Priorização do backlog

Perguntar:

```
O que você quer fazer?

[1] Priorizar backlog com matriz impacto × esforço (~5 min)
[2] Definir ou revisar horizontes (Agora / Próximo / Futuro)
[3] Gerar roadmap com a ordem atual do backlog
```

---

### Se [1] — Priorização por impacto × esforço

Para cada item do backlog (pulando os que já têm impacto definido no arquivo), perguntar:

```
Item: <título>
Descrição: <resumo em 1 linha>

Impacto (valor para o usuário/negócio):
  [A] Alto   — afeta função central ou métrica principal
  [B] Médio  — melhoria relevante mas não bloqueante
  [C] Baixo  — qualidade de vida, pouco impacto em retenção

Esforço estimado:
  [1] Pequeno — menos de 1 semana
  [2] Médio   — 1-2 semanas
  [3] Grande  — mais de 2 semanas
```

**Tabela de prioridade:**

| Score | Impacto | Esforço | Ação recomendada |
|-------|---------|---------|-----------------|
| P1 | Alto | Pequeno/Médio | Fazer logo (quick win) |
| P2 | Alto | Grande | Planejar com cuidado |
| P3 | Médio | Pequeno | Preencher lacunas |
| P4 | Médio/Baixo | Grande | Questionar necessidade |

---

### Se [2] — Definir horizonte

Para cada item do backlog (em ordem de prioridade), PM escolhe:

```
Item: <título> [P<N>]

Horizonte:
  [A] Agora    — próximo ou atual sprint/ciclo
  [B] Próximo  — 1-2 ciclos à frente
  [C] Futuro   — backlog de longo prazo
  [D] Descartar — não mais relevante
```

---

## Fase 4 — Gerar roadmap.md

Criar ou atualizar `docs/business-context/roadmap.md`:

```markdown
# Roadmap — <nome do produto>

**Atualizado em:** <data ISO 8601>
**Responsável:** <PM>

---

## Doing

| Feature/Épico | Tipo | Status | Slug |
|---------------|------|--------|------|
| <título> | <tipo> | in_progress | <slug> |

---

## Agora

| Feature/Épico | Tipo | Impacto | Esforço | Score | Próximos passos |
|---------------|------|---------|---------|-------|-----------------|
| <título> | <tipo> | Alto | Médio | P1 | /cortex:strategy |

---

## Próximo

| Feature/Épico | Tipo | Impacto | Esforço | Score |
|---------------|------|---------|---------|-------|
| <título> | <tipo> | Alto | Grande | P2 |

---

## Futuro (Backlog)

| Feature/Épico | Tipo | Impacto | Observação |
|---------------|------|---------|-----------|
| <título> | <tipo> | Médio | <contexto ou dependência> |

---

## Descartados

| Feature/Épico | Motivo |
|---------------|--------|
| <título> | <por que foi descartado> |

---

## Histórico (últimas features fechadas)

| Feature/Épico | Slug | Fechado em |
|---------------|------|-----------|
| <título> | <slug> | <data> |
```

---

## Fase 5 — Confirmação e próximos passos

Exibir ao concluir:

```
Roadmap atualizado.
Artefato: docs/business-context/roadmap.md ✓

  Doing:    <N> itens
  Agora:    <N> itens
  Próximo:  <N> itens
  Futuro:   <N> itens

Próximos passos:
  → Para iniciar a feature de maior prioridade: /cortex:strategy
  → Para registrar resultado de feature lançada: /product:measure
  → Para capturar nova ideia: /cortex:idea
```
