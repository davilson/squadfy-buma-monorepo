---
name: figma-generate-library
description: "Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create variables/tokens, build component libraries, set up theming (light/dark modes), document foundations, or reconcile gaps between code and Figma. This skill teaches WHAT to build and in WHAT ORDER — it complements the figma-use skill which teaches HOW to call the Plugin API. Both skills should be loaded together."
disable-model-invocation: false
---

# Design System Builder — Figma MCP Skill

Build professional-grade design systems in Figma that match code. This skill orchestrates multi-phase workflows across 20–100+ `use_figma` calls, enforcing quality patterns from real-world design systems (Material 3, Polaris, Figma UI3, Simple DS).

**Prerequisites**: The `figma-use` skill MUST also be loaded for every `use_figma` call.

**Always pass `skillNames: "figma-generate-library"` when calling `use_figma` as part of this skill.**

---

## 1. The One Rule That Matters Most

**This is NEVER a one-shot task.** Building a design system requires 20–100+ `use_figma` calls across multiple phases, with mandatory user checkpoints between them. Break every operation to the smallest useful unit, validate, get feedback, proceed.

---

## 2. Mandatory Workflow

Every design system build follows this phase order. Skipping or reordering phases causes structural failures that are expensive to undo.

```
Phase 0: DISCOVERY (always first — no use_figma writes yet)
  0a. Analyze codebase → extract tokens, components, naming conventions
  0b. Inspect Figma file → pages, variables, components, styles, existing conventions
  0c. Search subscribed libraries → use search_design_system for reusable assets
  0d. Lock v1 scope → agree on exact token set + component list before any creation
  0e. Map code → Figma → resolve conflicts (code and Figma disagree = ask user)
  ✋ USER CHECKPOINT: present full plan, await explicit approval

Phase 1: FOUNDATIONS (tokens first — always before components)
  1a. Create variable collections and modes
  1b. Create primitive variables (raw values, 1 mode)
  1c. Create semantic variables (aliased to primitives, mode-aware)
  1d. Set scopes on ALL variables
  1e. Set code syntax on ALL variables
  1f. Create effect styles (shadows) and text styles (typography)
  ✋ USER CHECKPOINT: show variable summary, await approval

Phase 2: FILE STRUCTURE (before components)
  2a. Create page skeleton: Cover → Getting Started → Foundations → --- → Components → --- → Utilities
  2b. Create foundations documentation pages (color swatches, type specimens, spacing bars)
  ✋ USER CHECKPOINT: show page list + screenshot, await approval

Phase 3: COMPONENTS (one at a time — never batch)
  For EACH component (in dependency order: atoms before molecules):
    3a. Create dedicated page
    3b. Build base component with auto-layout + full variable bindings
    3c. Create all variant combinations (combineAsVariants + grid layout)
    3d. Add component properties (TEXT, BOOLEAN, INSTANCE_SWAP)
    3e. Link properties to child nodes
    3f. Add page documentation (title, description, usage notes)
    3g. Validate: get_metadata (structure) + get_screenshot (visual)
    ✋ USER CHECKPOINT per component: show screenshot, await approval before next component

Phase 4: INTEGRATION + QA (final pass)
  4a. Finalize all Code Connect mappings
  4b. Accessibility audit (contrast, min touch targets, focus visibility)
  4c. Naming audit (no duplicates, consistent casing)
  4d. Unresolved bindings audit (no hardcoded fills/strokes remaining)
  4e. Final review screenshots of every page
  ✋ USER CHECKPOINT: complete sign-off
```

---

## 3. Critical Rules

**Plugin API basics** (from figma-use skill — enforced here too):
- Use `return` to send data back. Do NOT wrap in IIFE or call closePlugin.
- Return ALL created/mutated node IDs in every return value
- Page context resets each call — always `await figma.setCurrentPageAsync(page)` at start
- `figma.notify()` throws — never use it
- Colors are 0–1 range, not 0–255
- Font MUST be loaded before any text write

**Design system rules**:
1. **Variables BEFORE components** — components bind to variables. No token = no component.
2. **Inspect before creating** — run read-only `use_figma` to discover existing conventions. Match them.
3. **One page per component** *(default)*
4. **Bind visual properties to variables** *(default)* — fills, strokes, padding, radius, gap.
5. **Scopes on every variable** — NEVER leave as `ALL_SCOPES`. Background: `FRAME_FILL, SHAPE_FILL`. Text: `TEXT_FILL`. Border: `STROKE_COLOR`. Spacing: `GAP`. Radii: `CORNER_RADIUS`. Primitives: `[]` (hidden).
6. **Code syntax on every variable** — WEB syntax MUST use the `var()` wrapper: `var(--color-bg-primary)`. ANDROID/iOS do NOT use a wrapper.
7. **Alias semantics to primitives** — `{ type: 'VARIABLE_ALIAS', id: primitiveVar.id }`. Never duplicate raw values in semantic layer.
8. **Position variants after combineAsVariants** — they stack at (0,0). Manually grid-layout + resize.
9. **INSTANCE_SWAP for icons** — never create a variant per icon.
10. **Deterministic naming** — use consistent, unique node names.
11. **No destructive cleanup** — cleanup scripts identify nodes by name convention or returned IDs, not by guessing.
12. **Validate before proceeding** — `get_metadata` after every create, `get_screenshot` after each component.
13. **NEVER parallelize `use_figma` calls** — Figma state mutations must be strictly sequential.
14. **Never hallucinate Node IDs** — always read IDs from the state ledger returned by previous calls.

---

## 4. State Management (Required for Long Workflows)

> **`getPluginData()` / `setPluginData()` are NOT supported in `use_figma`.** Use `getSharedPluginData()` / `setSharedPluginData()` instead.

Tag every created scene node immediately after creation:
```javascript
node.setSharedPluginData('dsb', 'run_id', RUN_ID);
node.setSharedPluginData('dsb', 'phase', 'phase3');
node.setSharedPluginData('dsb', 'key', 'component/button');
```

**State persistence**: Write ledger to disk at `/tmp/dsb-state-{RUN_ID}.json`. Re-read this file at the start of every turn.

Maintain a state ledger tracking collections, variables, pages, components, pending validations, and completed steps.

**Idempotency check** before every create: query by name + state ledger ID. If exists, skip or update — never duplicate.

---

## 5. Token Architecture

| Complexity | Pattern |
|-----------|---------|
| < 50 tokens | Single collection, 2 modes (Light/Dark) |
| 50–200 tokens | **Standard**: Primitives (1 mode) + Color semantic (Light/Dark) + Spacing (1 mode) + Typography (1 mode) |
| 200+ tokens | **Advanced**: Multiple semantic collections, 4–8 modes (Light/Dark × Contrast × Brand) |

Standard pattern:
```
Collection: "Primitives"    modes: ["Value"]
  blue/500 = #3B82F6, gray/900 = #111827, ...

Collection: "Color"         modes: ["Light", "Dark"]
  color/bg/primary → Light: alias Primitives/white, Dark: alias Primitives/gray-900

Collection: "Spacing"       modes: ["Value"]
  spacing/xs = 4, spacing/sm = 8, spacing/md = 16, ...
```

---

## 6. User Checkpoints

Mandatory. Design decisions require human judgment.

| After | Required artifacts | Ask |
|-------|-------------------|-----|
| Discovery + scope lock | Token list, component list, gap analysis | "Here's my plan. Approve before I create anything?" |
| Foundations | Variable summary (N collections, M vars), style list | "All tokens created. Review before file structure?" |
| File structure | Page list + screenshot | "Pages set up. Review before components?" |
| Each component | get_screenshot of component page | "Here's [Component] with N variants. Correct?" |
| Final QA | Per-page screenshots + audit report | "Complete. Sign off?" |

**If user rejects**: fix before moving on. Never build on rejected work.

---

## 7. Naming Conventions

Match existing file conventions. If starting fresh:

**Variables** (slash-separated):
```
color/bg/primary     color/text/secondary    color/border/default
spacing/xs  spacing/sm  spacing/md  spacing/lg  spacing/xl
radius/none  radius/sm  radius/md  radius/lg  radius/full
```

**Component names**: `Button`, `Input`, `Card`, `Avatar`, `Badge`, `Checkbox`, `Toggle`

**Variant names**: `Property=Value, Property=Value` — e.g., `Size=Medium, Style=Primary, State=Default`

---

## 8. Per-Phase Anti-Patterns

**Phase 0:** Starting to create anything before scope is locked · Ignoring existing conventions · Skipping `search_design_system`

**Phase 1:** Using `ALL_SCOPES` on any variable · Duplicating raw values in semantic layer instead of aliasing · Not setting code syntax

**Phase 3:** Creating components before foundations exist · Hardcoding any fill/stroke/spacing/radius · Creating variant > 30 without splitting

**General:** Retrying a failed script without understanding the error · Using name-prefix matching for cleanup · Skipping user checkpoints · Parallelizing `use_figma` calls · Guessing/hallucinating node IDs
