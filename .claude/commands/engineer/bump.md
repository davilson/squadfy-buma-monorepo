---
description: Incrementa a versão do Framework Cortex em todos os arquivos de uma vez
---

# Cortex · Engineer Bump

Vamos preparar um release incrementando a versão do Framework Cortex.

---

## PASSO 1 — Ler versão atual

Leia o arquivo `VERSION` na raiz do projeto. Ele contém apenas o número atual, ex: `1.7.2`.

Se `VERSION` não existir: informe o erro e pare.

---

## PASSO 2 — Perguntar qual incremento

Seguindo semver `x.y.z`:

| Tipo | Quando usar | Exemplo |
|---|---|---|
| **patch** (z) | Correção de bug, ajuste pequeno, doc | `1.7.2` → `1.7.3` |
| **minor** (y) | Nova feature retrocompatível, novo comando/agente | `1.7.2` → `1.8.0` |
| **major** (x) | Breaking change, reescrita de master, mudança de protocolo | `1.7.2` → `2.0.0` |

Use `AskUserQuestion` para perguntar:

```javascript
AskUserQuestion({
  questions: [{
    header: "Cortex · Bump de Versão",
    question: "Qual o tipo de incremento?  Versão atual: {VERSAO_ATUAL}",
    multiSelect: false,
    options: [
      { label: "patch (z)", description: "Correção de bug ou ajuste pequeno — ex: {X}.{Y}.{Z+1}" },
      { label: "minor (y)", description: "Nova feature retrocompatível — ex: {X}.{Y+1}.0" },
      { label: "major (x)", description: "Breaking change ou reescrita — ex: {X+1}.0.0" }
    ]
  }]
})
```

Calcule a nova versão com base na seleção.

---

## PASSO 3 — Atualizar todos os arquivos

Com a nova versão calculada, atualize **todos** os arquivos abaixo.

Execute as substituições com as ferramentas de edição disponíveis (Edit/sed). **Nunca invente — só substitua onde a versão antiga constar.**

### 3.1 — Fonte de verdade

| Arquivo | O que substituir |
|---|---|
| `VERSION` | Conteúdo completo → `{NOVA_VERSAO}\n` |
| `package.json` | `"version": "{VERSAO_ATUAL}"` → `"version": "{NOVA_VERSAO}"` |

### 3.2 — Headers dos comandos cortex

Cada arquivo tem a versão no header do bloco do master inlined. Substitua apenas o número:

| Arquivo | Padrão atual |
|---|---|
| `.claude/commands/cortex/boot.md` | `# CORTEX BOOT — Framework Cortex v{VERSAO_ATUAL}` |
| `.claude/commands/cortex/strategy.md` | `# CORTEX STRATEGY MASTER (v{VERSAO_ATUAL})` |
| `.claude/commands/cortex/execution.md` | `# CORTEX EXECUTION MASTER (v{VERSAO_ATUAL})` |
| `.claude/commands/cortex/modify.md` | `# CORTEX MODIFY MASTER (v{VERSAO_ATUAL})` |
| `.claude/commands/cortex/bug.md` | `# CORTEX BUG MASTER (v{VERSAO_ATUAL})` |
| `.claude/commands/cortex/idea.md` | `# CORTEX IDEA — Framework Cortex v{VERSAO_ATUAL}` |
| `.claude/commands/cortex/design.md` | `# CORTEX DESIGN MASTER (v{VERSAO_ATUAL})` |
| `.claude/commands/cortex/platform-task.md` | `# CORTEX PLATFORM TASK MASTER (v{VERSAO_ATUAL})` |

### 3.3 — O que NÃO bumpar

| Não alterar | Por quê |
|---|---|
| `.claude/master/*.md` | **Caminho legado, congelado em `v1.8.1`** — última versão em que foram a implementação ativa. A partir do v2.0.0 o conteúdo vive inline em `commands/cortex/*.md`. Bumpar o master faria ele alegar uma versão que não implementa. |
| `schema_version` nos JSONs | versão do schema dos artefatos em `docs/.cortex/`, independente da versão do framework |

> **Não alterar** o campo `schema_version` dentro dos schemas JSON no `boot.md` e no `boot-generation.md` — é a versão do schema dos artefatos em `docs/.cortex/`, independente da versão do framework.

---

## PASSO 4 — Verificar consistência

Após todas as substituições, execute:

```bash
grep -rn "v{VERSAO_ATUAL}\|\"version\": \"{VERSAO_ATUAL}\"" \
  package.json \
  VERSION \
  .claude/commands/cortex/ \
  --include="*.md" --include="*.json" 2>/dev/null
```

Se retornar algum resultado: significa que algum arquivo não foi atualizado. Liste os pendentes e corrija antes de continuar.

---

## PASSO 5 — Confirmar resultado

Exiba o sumário de arquivos atualizados:

```
✅ Bump concluído: {VERSAO_ATUAL} → {NOVA_VERSAO}

Arquivos atualizados:
  VERSION
  package.json
  .claude/commands/cortex/boot.md
  .claude/commands/cortex/strategy.md
  .claude/commands/cortex/execution.md
  .claude/commands/cortex/modify.md
  .claude/commands/cortex/bug.md
  .claude/commands/cortex/idea.md
  .claude/commands/cortex/design.md
  .claude/commands/cortex/platform-task.md

📋 Próximo passo: adicionar entrada no CHANGELOG
  .claude/changelog/CHANGELOG.md → seção []{NOVA_VERSAO}] - {DATA}
```

**Pare aqui.** Não crie commit nem PR automaticamente. Aguarde o usuário.

---

## REGRAS

- **Fonte de verdade é `VERSION`** — sempre ler dali antes de qualquer operação
- **Nunca alterar** o campo `schema_version` nos schemas JSON de `commands/cortex/boot.md` e `guides/boot-generation.md`
- **Nunca bumpar** `.claude/master/*.md` — legado congelado em `v1.8.1`
- **Nunca inventar** a versão atual — sempre ler do arquivo
- **Verificar** com grep após substituições — não assumir que deu certo
- **Não fazer commit** — apenas bumpa os arquivos
