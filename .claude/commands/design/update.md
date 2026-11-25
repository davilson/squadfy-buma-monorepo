# CORTEX DESIGN UPDATE MASTER (v2.0)

> Único fluxo autorizado a alterar `docs/design-context/`.
> Deve ser executado em sessão dedicada — nunca durante o desenvolvimento de uma feature.
> Toda alteração é registrada em `docs/design-context/CHANGELOG.md`.

---

## Regra fundamental

`docs/design-context/` é a fonte de verdade de design do projeto.
Alterações aqui afetam todas as features futuras.

Este fluxo existe para tornar mudanças **intencionais, rastreadas e revisadas** — não proibidas.

---

## Passo 1 — Identificar o que será alterado

Perguntar ao usuário:

```
1. Qual arquivo será alterado?
   [ ] design-system.md
   [ ] components.md
   [ ] ux-principles.md
   [ ] content-guidelines.md
   [ ] motion-principles.md
   [ ] feedback-states.md
   [ ] accessibility.md
   [ ] figma-references.md
   [ ] benchmarking.md
   [ ] ux-audit.md
   [ ] moodboard.md
   [ ] handoff-rules.md
   [ ] Outro: ___

2. O que mudará? (descrição da alteração)

3. Por que essa mudança é necessária? (justificativa — opcional)

4. Você é o Designer responsável pelo projeto ou tem aprovação dele?
```

Se a resposta à pergunta 4 for negativa:
```
Atenção: alterações em docs/design-context/ requerem aprovação do Designer responsável.
O Designer responsável foi consultado? [S/N]

Se não: encerre este fluxo e consulte o Designer antes de prosseguir.
Se sim: prosseguir com o Designer ciente da alteração.
```

---

## Passo 2 — Ler o arquivo atual

Ler o arquivo que será alterado em `docs/design-context/`.

Exibir para o usuário a seção que será afetada:
```
Conteúdo atual de <arquivo>:
<seção relevante>

Esta é a seção que será modificada. Confirmar? [S/N]
```

---

## Passo 3 — Propor a alteração

Baseado na descrição do usuário, propor a alteração específica:

```
ALTERAÇÃO PROPOSTA:

Arquivo: docs/design-context/<arquivo>.md

ANTES:
<conteúdo atual>

DEPOIS:
<conteúdo proposto>

Justificativa: <justificativa fornecida ou "não informada">

Aprovar e aplicar? [S/N]
```

Não aplicar sem aprovação explícita.

---

## Passo 4 — Aplicar a alteração

Após aprovação:
1. Editar o arquivo em `docs/design-context/`
2. Registrar no CHANGELOG

---

## Passo 5 — Registrar no CHANGELOG

Adicionar entrada em `docs/design-context/CHANGELOG.md`:

```markdown
## [<versão incremental>] — <data ISO 8601>

**Tipo:** Atualização
**Arquivo alterado:** `<arquivo>`
**Responsável:** <quem solicitou>
**Justificativa:** <justificativa fornecida ou "não informada">

**O que mudou:**
<descrição da alteração>

**Impacto em features futuras:**
<o que os Designers devem saber para próximas features>
```

---

## Passo 6 — Comunicar o impacto

Exibir ao concluir:

```
DESIGN CONTEXT ATUALIZADO.

Arquivo alterado: docs/design-context/<arquivo>.md ✓
Changelog: docs/design-context/CHANGELOG.md ✓

⚠ IMPORTANTE — Ações recomendadas:

1. Comunicar o time sobre a mudança (Designer, Dev, PM).
2. Verificar se features em desenvolvimento na fase DESIGN ou HANDOFF
   são afetadas por esta alteração.
3. Se features em produção usavam o padrão anterior:
   → Avaliar se é necessário abrir issues de debt para atualizar.

Features possivelmente afetadas: <listar sessions abertas com design.status ≠ done, se existirem>
```

---

## Restrição absoluta

Se identificado que este fluxo está sendo executado durante o desenvolvimento de uma feature
(usuário mencionou slug de feature ativa, contexto de sprint, ou "urgente para amanhã"):

```
Atenção: detectado contexto de feature em andamento.

Alterações em docs/design-context/ durante o desenvolvimento de uma feature
podem causar inconsistência entre o design da feature e o projeto.

Recomendado:
  [1] Concluir a feature atual e depois executar esta atualização
  [2] Documentar a exceção no design.md da feature e atualizar o Design Context depois
  [3] Prosseguir mesmo assim (ciente do risco de inconsistência)
```
