# Pre-PR

Execute cada fase em ordem. Não pule fases. Não abra o PR sem permissão explícita.

## FASE 0 — Pre-flight

```bash
git status && git log origin/main..HEAD --oneline
npm run build && npm test
```

Se build ou testes falharem → pare, corrija, reexecute.

## FASE 1 — Análise paralela

Invoque os três agentes **ao mesmo tempo**. Aguarde todos terminarem.

- `master-docs-gate-keeper` — alinhamento com master docs (somente leitura)
- `adr-compliance-checker` — conformidade com ADRs, modo ADVISORY, gerar score
- `code-reviewer` — qualidade, bugs, segurança; classificar cada issue como 🔴 Crítico / 🟡 Recomendado / 🟢 Observação

## FASE 2 — Remediação

1. Liste todos os 🔴 Críticos das três análises
2. Corrija todos antes de prosseguir
3. Reexecute: `npm run build && npm test`

Issues 🟡 devem ser endereçados; se ignorados, documente o motivo.

## FASE 3 — Testes

1. Invoque `test-planner`: analisar lacunas de cobertura da branch e **recomendar** os testes faltantes por prioridade (este agente planeja, não escreve).
2. Invoque `test-engineer` com o plano: **escrever** os testes de alta prioridade.
3. Execute `npm test`.

## FASE 4 — Documentação

Invoque `branch-documentation-writer`: atualizar README, docs/, CHANGELOG e referências de API afetadas pelas mudanças da branch.

## FASE 5 — Gate final

Confirme antes de reportar:

- [ ] Build e testes passando
- [ ] Zero 🔴 Críticos pendentes
- [ ] ADR compliance score reportado (violações críticas corrigidas)
- [ ] Documentação atualizada
- [ ] Sem segredos nos commits: `git diff origin/main...HEAD -- '*.env' '*secret*' '*.key'`

## FASE 6 — Relatório e permissão

Apresente resumo:

```
Branch: [nome] | Commits: [N]

| Verificação           | Status  | Destaques              |
|-----------------------|---------|------------------------|
| Master Docs           | ✅/⚠️/❌ | [1 linha]              |
| ADR Compliance        | ✅/⚠️/❌ | [score %]              |
| Code Review           | 🟢/🟡/🔴 | [resumo]               |
| Testes                | ✅/⚠️/❌ | [N adicionados]        |
| Documentação          | ✅/⚠️/❌ | [arquivos atualizados] |

Issues pendentes (não-críticos): [lista ou "nenhum"]
```

**Aguarde permissão explícita para abrir o PR. Não execute `/engineer:pr` automaticamente.**
