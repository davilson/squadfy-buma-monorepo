# Cortex Design Update — Atualização do Design Context

Você está ativando o **Cortex Design Update** — único comando autorizado a alterar `docs/design-context/`.

## O que este modo faz

Permite ao Designer responsável propor e registrar alterações formais no Design Context do projeto.

> **Governança:** `docs/design-context/` é a fonte de verdade de design do projeto.
> Alterações aqui afetam **todas as features futuras** e devem ser intencionais.
> Este comando nunca deve ser executado durante o fluxo de uma feature.

## Quando usar

- O Design System foi atualizado (nova versão, novos tokens, novos componentes)
- Um princípio de UX foi revisado pelo time
- Content guidelines foram atualizadas
- Novos padrões de acessibilidade foram adotados
- Um componente foi deprecated e precisa ser substituído
- Benchmarking revelou que padrões do mercado mudaram

## Quando NÃO usar

- Durante o desenvolvimento de uma feature específica
- Para documentar exceções pontuais (use as notas de handoff no design.md da feature)
- Para corrigir algo urgente em produção (abra um BUG CRÍTICO e documente a divergência)

## Como usar

Informar ao ativar:
- Qual arquivo de `docs/design-context/` será alterado
- O que mudará

---

Carregar: `.claude/commands/design/update.md`
