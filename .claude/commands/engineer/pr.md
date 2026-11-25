# PR

Abrir o Pull Request da branch atual. Siga os passos em ordem.

## 1. Verificar que a branch está verde

```bash
npm run build && npm test
```

Se build ou testes falharem → pare, corrija, reexecute. Não abra PR com a branch vermelha.

## 2. Commitar

Mensagem clara e concisa resumindo as alterações.

**REGRA DE OURO:** commitar **apenas** os arquivos que você alterou. Nunca `git add .`.

## 3. Linear

Mover o card associado à tarefa para "In Review".

## 4. Abrir o PR

Descrição com o que mudou, por quê e como verificar.
Não mencionar Claude, IA ou geração automática no corpo do PR.

## 5. Aguardar o code review automatizado

Após abrir o PR, aguardar 3 minutos e verificar os comentários da ferramenta automatizada.
Se nenhum comentário aparecer, aguardar mais 3 minutos e verificar novamente.

## 6. Triar os comentários

Analisar cada comentário e classificar entre "requer correção" e "pode ser ignorado ou explicado".
Apresentar a triagem ao usuário e **pedir permissão** antes de alterar código.

## 7. Aplicar as correções aprovadas

1. Alterar o código
2. Commitar com mensagem clara
3. Push na mesma branch

## 8. Declarar handoffs pendentes no corpo do PR

Ler `pending_handoff` da session em `docs/.cortex/sessions-manifest.json`. Se houver entradas,
incluir esta seção no PR — é como o trabalho recusado por fronteira de perfil chega a quem pode fazê-lo:

```markdown
## Handoff pendente

Arquivos fora do perfil `<perfil que implementou>`, não incluídos neste PR:

| Arquivo | Perfil responsável |
| --- | --- |
| <path> | <perfil> |

Estes arquivos aparecem como `HANDOFF PARA VOCÊ` no boot do perfil responsável.
```

## 9. Declarar o MODO SOLO no corpo do PR

Ler `solo` da session. Se existir, incluir no PR — é o que torna a decisão auditável pelo Designer,
pelo PM e pelo Tech Lead:

```markdown
## Modo solo

Implementado sem insumo de outro perfil, por decisão do Dev.

| Dispensado | Significa |
| --- | --- |
| `design-spec` | sem design.md — UI implementada por julgamento do Dev sobre o Design System |
| `pm-approval` | GATE-D aprovado, PM não havia liberado a prioridade |
| `design-qa` | merge sem revisão de fidelidade do Designer |

Motivo: <razão declarada>
Declarado em: <ISO 8601>

Gates de engenharia inalterados: GATE 3, GATE VERDE e GATE 5 passaram normalmente.
```

## 10. Design QA pendente

Se `design.implementation == "ready-for-qa"` e o QA ainda não foi aprovado:

**Se `solo.skipped` contém `design-qa`** → não bloquear. O Dev dispensou o QA e isso está declarado na
seção anterior. Prosseguir para o merge.

**Caso contrário** → bloquear:
```
PR NÃO PODE SER FECHADO
Design QA pendente para <slug>.
Designer: /cortex:design → [7] QA

Para seguir sem o QA: declarar MODO SOLO no /cortex:execution (registra o motivo).
```

## 11. Fechar a session no manifesto

Após o PR ser **mergeado**, atualizar `docs/.cortex/sessions-manifest.json`:

```json
"<slug>": { "status": "closed" }
```

`closed` é escrito **somente aqui** — é o único ponto do framework que marca uma session como entregue.
Enquanto o PR estiver aberto, a session permanece `spec_closed`.

**Se `pending_handoff` não estiver vazio:** manter o array no manifesto após o `closed`. A session foi
entregue no escopo deste perfil, mas os arquivos pendentes continuam visíveis no boot do perfil
responsável até que alguém os implemente. Não limpar `pending_handoff` aqui.

Se o merge for manual pelo usuário, avisar que a session ficará `spec_closed` até o merge e que o
status deve ser atualizado depois (ou no próximo boot, informando o slug).

## 12. Reportar

```
Tarefa completada:
- Build e testes passando
- Mudanças commitadas e pushed
- Card do Linear <ID> movido para "In Review"
- PR aberto: <título>
- Comentários do review automatizado triados e correções aplicadas
- Session <slug>: spec_closed → closed após o merge
- Handoff pendente: <N arquivo(s) para o perfil <perfil> | nenhum>
- Modo solo: <dispensado: <lista> | não>

O PR está pronto para revisão final e merge manual.

<link do PR>
```
