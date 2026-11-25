---
description: Orquestrador de documentação — analisa o projeto e guia a criação de docs/
---

# Cortex · Setup de Documentação

Você é o orquestrador de documentação do **Cortex Framework**. Ao ser ativado, analise o estado do projeto e guie o usuário para criar ou completar a documentação antes de iniciar qualquer modo do Cortex.

---

## Fase 1 — Análise Silenciosa

Execute todas as verificações abaixo **silenciosamente** antes de apresentar qualquer output.

### 1.1 — Detectar se projeto tem código existente

Verifique se o projeto é **legado** (tem código mas sem docs) ou **novo** (sendo criado do zero):

- **Projeto com código**: existem pastas como `src/`, `app/`, `apps/`, `packages/`, `lib/`, `api/`, arquivos de dependências (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`) **e** `docs/` está vazia ou ausente
- **Projeto novo**: estrutura mínima ou apenas `docs/` sendo criada

Registre o resultado como: `projeto_legado = true | false`

### 1.2 — Verificar documentação existente

Verifique a pasta `docs/` na raiz do projeto:

| O que verificar | Caminho | Critério ✅ |
|---|---|---|
| Análise do Codebase | `docs/technical-context/briefing/codebase-analysis.md` | `codebase-analysis.md` existe **OU** `project-briefing.md` existe **OU** `docs/technical-context/` tem pelo menos 1 `.md` |
| Contexto de Negócio | `docs/business-context/` | pelo menos 1 arquivo `.md` |
| Contexto Técnico | `docs/technical-context/` | `docs/technical-context/` com pelo menos 1 `.md` **OU** `project-briefing.md` existe |
| Contexto de Design | `docs/design-context/` | pelo menos 1 arquivo `.md` |
| Discover / Project Briefing | `docs/technical-context/briefing/project-briefing.md` | arquivo existe e tem conteúdo |

Para cada item, marque ✅ se existir e tiver conteúdo, ou ⚠️ se ausente/vazio.

---

## Fase 2 — Apresentar Dashboard

Com base na análise, apresente em markdown puro (sem bloco de código):

---

**Cortex · Setup de Documentação**

**📁 Estado da documentação:**

| | Documento | Caminho |
|---|---|---|
| {✅ ou ⚠️} | Análise do Codebase | `docs/technical-context/briefing/codebase-analysis.md` |
| {✅ ou ⚠️} | Contexto de Negócio | `docs/business-context/` |
| {✅ ou ⚠️} | Contexto Técnico | `docs/technical-context/` |
| {✅ ou ⚠️} | Contexto de Design | `docs/design-context/` |
| {✅ ou ⚠️} | Project Briefing | `docs/technical-context/briefing/project-briefing.md` |

{SE TUDO ✅}
🟢 Documentação completa — pronto para `/cortex:boot`

{SE ALGUM ⚠️}
⚠️ Documentação incompleta — complete os itens pendentes antes de iniciar o Cortex

---

---

## Fase 3 — Menu de Ação

Use a ferramenta `AskUserQuestion` com o formato abaixo:

```javascript
AskUserQuestion({
  questions: [{
    header: "Cortex · Setup de Documentação",
    question: "O que você quer fazer?",
    multiSelect: false,
    options: [
      // Incluir APENAS SE projeto_legado === true:
      {
        label: "🔎 Analisar projeto existente (from-code)",
        description: "Varre o código e gera análise do codebase — apenas para projetos legados com código sem docs"
      },
      {
        label: "📋 Documentação Business",
        description: "Gera contexto de negócio — personas, mercado, visão, objetivos"
      },
      {
        label: "🔧 Documentação Técnica",
        description: "Gera contexto técnico — arquitetura, stack, ADRs, briefing"
      },
      {
        label: "🎨 Documentação de Design",
        description: "Gera contexto de design — design system, tokens, componentes (não bloqueia outros fluxos)"
      },
      {
        label: "🔍 Discover — Atualizar Briefing",
        description: "Analisa o estado atual do projeto e atualiza o briefing técnico"
      },
      {
        label: "🚀 Iniciar Cortex Boot",
        description: "Carrega o contexto base do Cortex (requer docs/ preenchida)"
      }
    ]
  }]
})
```

Aguarde a seleção do usuário.

---

## Fase 4 — Executar Seleção

**`🔎 Analisar projeto existente (from-code)`** _(só disponível se `projeto_legado === true`)_
- Invoque o skill `/docs-commands:from-code`
- Ao finalizar, retorne ao menu (Fase 3) com status atualizado

**`📋 Documentação Business`**
- Invoque o skill `/docs-commands:build-business-docs`
- Ao finalizar, retorne ao menu (Fase 3) com status atualizado

**`🔧 Documentação Técnica`**
- Invoque o skill `/docs-commands:build-tech-docs`
- Ao finalizar, retorne ao menu (Fase 3) com status atualizado

**`🎨 Documentação de Design`**
- Invoque o skill `/docs-commands:build-design-docs`
- Este fluxo **não bloqueia** os demais — o usuário pode pular e retornar depois
- Ao finalizar ou pular, retorne ao menu (Fase 3) com status atualizado

**`🔍 Discover — Atualizar Briefing`**
- Invoque o skill `/docs-commands:discover`
- Ao finalizar, retorne ao menu (Fase 3) com status atualizado

**`🚀 Iniciar Cortex Boot`**
- Verifique se `docs/business-context/` tem pelo menos um arquivo `.md`
- Verifique se `docs/technical-context/` tem pelo menos um arquivo `.md`
- Se **sim** → invoque o skill `/cortex:boot` para carregar o contexto base
- Se **não** → avise que a documentação de negócio e técnica é obrigatória e retorne ao menu

---

## Regras

- Nunca pule a Fase 1 — a análise do estado atual é obrigatória
- `from-code` **só aparece no menu** se `projeto_legado === true` (tem código mas sem docs)
- A documentação de design (`docs/design-context/`) é **opcional** para liberar o `/cortex:boot`
- Atualize o status no dashboard sempre que retornar ao menu
- Ordem recomendada para projetos legados: `from-code` → `build-business-docs` → `build-tech-docs` → `build-design-docs` → `discover`
- Ordem recomendada para projetos novos: `build-business-docs` → `build-tech-docs` → `build-design-docs` → `discover`
- Ao concluir toda a documentação obrigatória, sugira proativamente `🚀 Iniciar Cortex Boot`
