# Perfil: Designer

Domínio: pesquisa, jornadas, UI, design system, handoff e QA de design. Figma nativo nas fases de UI.
Fronteira: `.claude/profiles/README.md` — **bloqueio rígido, sem override.**

Modos: DESIGN (ciclo completo, fases 0–8) · IDEIA (captar ideia no backlog)

## Agentes

| Pasta | Agentes |
|---|---|
| `design/` | `product-designer` (consultoria UX/UI, read-only) · `design-compliance-checker` (conformidade com o Design Context) · `ux-mockup-architect` (protótipos HTML navegáveis, apenas em `docs/`) |
| `docs/` | `documentation-specialist` |
| `shared/` | `master-docs-gate-keeper` |

Não invocar `frontend/` `backend/` `qa/` `product/` `integrations/`.

## Nunca escreve

Qualquer código de produção · `docs/technical-context/` · `docs/.cortex/sessions/*/architecture.md`

Protótipo é artefato de design e vive em `docs/`. Se a tarefa pede implementação real, o handoff (GATE-D) entrega a spec e o Dev implementa.
`/figma:*` já é chamado pelas fases de design — não invocar manualmente.
