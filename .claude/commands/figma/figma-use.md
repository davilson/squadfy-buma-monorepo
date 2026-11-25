---
name: figma-use
description: "**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically."
disable-model-invocation: false
---

# use_figma — Figma Plugin API Skill

Use the `use_figma` tool to execute JavaScript in Figma files via the Plugin API.

**Always pass `skillNames: "figma-use"` when calling `use_figma`.** This is a logging parameter — it does not affect execution.

**If the task involves building or updating a full page, screen, or multi-section layout in Figma from code**, also load `figma-generate-design`. It provides the workflow for discovering design system components and assembling screens incrementally.

## 1. Critical Rules

1. **Use `return` to send data back.** The return value is JSON-serialized automatically. Do NOT call `figma.closePlugin()` or wrap code in an async IIFE.
2. **Write plain JavaScript with top-level `await` and `return`.** Code is automatically wrapped in an async context.
3. `figma.notify()` **throws "not implemented"** — never use it.
4. `getPluginData()` / `setPluginData()` are **not supported** — use `getSharedPluginData()` / `setSharedPluginData()` instead.
5. `console.log()` is NOT returned — use `return` for output.
6. **Work incrementally in small steps.** Break large operations into multiple `use_figma` calls.
7. Colors are **0–1 range** (not 0–255): `{r: 1, g: 0, b: 0}` = red.
8. Fills/strokes are **read-only arrays** — clone, modify, reassign.
9. Font **MUST** be loaded before any text operation: `await figma.loadFontAsync({family, style})`. Use `await figma.listAvailableFontsAsync()` to discover available fonts if a load fails.
10. **Pages load incrementally** — use `await figma.setCurrentPageAsync(page)` to switch pages. The sync setter `figma.currentPage = page` does **NOT** work and will throw.
11. `setBoundVariableForPaint` returns a **NEW** paint — must capture and reassign.
12. `createVariable` accepts collection **object or ID string** (object preferred).
13. **`layoutSizingHorizontal/Vertical = 'FILL'` MUST be set AFTER `parent.appendChild(child)`** — setting before append throws.
14. **Position new top-level nodes away from (0,0).** Scan `figma.currentPage.children` to find a clear position.
15. **On `use_figma` error, STOP. Do NOT immediately retry.** Failed scripts are atomic — if a script errors, no changes are made. Read the error, fix the script, then retry.
16. **MUST `return` ALL created/mutated node IDs.** Return them in a structured object: `return { createdNodeIds: [...], mutatedNodeIds: [...] }`.
17. **Always set `variable.scopes` explicitly when creating variables.** The default `ALL_SCOPES` pollutes every property picker. Use specific scopes like `["FRAME_FILL", "SHAPE_FILL"]` for backgrounds, `["TEXT_FILL"]` for text colors, `["GAP"]` for spacing.
18. **`await` every Promise.** Never leave a Promise unawaited.

## 2. Page Rules (Critical)

**Page context resets between `use_figma` calls** — `figma.currentPage` starts on the first page each time.

Use `await figma.setCurrentPageAsync(page)` to switch pages. The sync setter `figma.currentPage = page` does **NOT work** — it throws `"Setting figma.currentPage is not supported"`.

```js
// Switch to a specific page
const targetPage = figma.root.children.find((p) => p.name === "My Page");
await figma.setCurrentPageAsync(targetPage);

// Iterate over all pages
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  // page.children is now loaded
}
```

## 3. `return` Is Your Output Channel

The agent sees **ONLY** the value you `return`. Everything else is invisible.

- **Returning IDs (CRITICAL)**: Every script that creates or mutates canvas nodes **MUST** return all affected node IDs.
- `console.log()` output is **never** returned to the agent.
- Always return actionable data (IDs, counts, status).

## 4. Incremental Workflow (How to Avoid Bugs)

1. **Inspect first.** Run a read-only `use_figma` to discover what already exists.
2. **Do one thing per call.** Create variables in one call, create components in the next.
3. **Return IDs from every call.**
4. **Validate after each step.** Use `get_metadata` to verify structure. Use `get_screenshot` after major milestones.
5. **Fix before moving on.** Don't build on a broken foundation.

### Suggested step order for complex tasks

```
Step 1: Inspect file — discover pages, components, variables, conventions
Step 2: Create tokens/variables (if needed) → validate with get_metadata
Step 3: Create individual components → validate with get_metadata + get_screenshot
Step 4: Compose layouts from component instances → validate with get_screenshot
Step 5: Final verification
```

## 5. Error Recovery & Self-Correction

**`use_figma` is atomic — failed scripts do not execute.** No partial nodes, no orphaned elements.

### When `use_figma` returns an error

1. **STOP.** Do not immediately fix the code and retry.
2. **Read the error message carefully.**
3. **If the error is unclear**, call `get_metadata` or `get_screenshot`.
4. **Fix the script** based on the error message.
5. **Retry** the corrected script.

### Common self-correction patterns

| Error message | Likely cause | How to fix |
|---|---|---|
| `"not implemented"` | Used `figma.notify()` | Remove it — use `return` for output |
| `"node must be an auto-layout frame..."` | Set `FILL`/`HUG` before appending to auto-layout parent | Move `appendChild` before `layoutSizingX = 'FILL'` |
| `"Setting figma.currentPage is not supported"` | Used sync page setter | Use `await figma.setCurrentPageAsync(page)` |
| Property value out of range | Color channel > 1 (used 0–255 instead of 0–1) | Divide by 255 |
| `"Cannot read properties of null"` | Node doesn't exist (wrong ID, wrong page) | Check page context, verify ID |

### When the script succeeds but the result looks wrong

1. Call `get_metadata` to check structural correctness.
2. Call `get_screenshot` to check visual correctness. Look closely for cropped/clipped text and overlapping elements.
3. Identify the discrepancy — structural or visual?
4. Write a targeted fix script that modifies only the broken parts.

## 6. Pre-Flight Checklist

Before submitting ANY `use_figma` call, verify:

- [ ] Code uses `return` to send data back (NOT `figma.closePlugin()`)
- [ ] Code is NOT wrapped in an async IIFE (auto-wrapped for you)
- [ ] `return` value includes structured data with actionable info (IDs, counts)
- [ ] NO usage of `figma.notify()` anywhere
- [ ] NO usage of `console.log()` as output
- [ ] All colors use 0–1 range (not 0–255)
- [ ] Fills/strokes are reassigned as new arrays (not mutated in place)
- [ ] Page switches use `await figma.setCurrentPageAsync(page)`
- [ ] `layoutSizingVertical/Horizontal = 'FILL'` is set AFTER `parent.appendChild(child)`
- [ ] `loadFontAsync()` called BEFORE any text property changes
- [ ] `lineHeight`/`letterSpacing` use `{unit, value}` format (not bare numbers)
- [ ] `resize()` is called BEFORE setting sizing modes (resize resets them to FIXED)
- [ ] New top-level nodes are positioned away from (0,0)
- [ ] ALL created/mutated node IDs are collected and included in the `return` value
- [ ] Every async call is `await`ed — no fire-and-forget Promises

## 7. Discover Conventions Before Creating

Always inspect the Figma file before creating anything. Different files use different naming conventions and component patterns.

### Quick inspection scripts

**List all pages and top-level nodes:**
```js
const pages = figma.root.children.map(p => `${p.name} id=${p.id} children=${p.children.length}`);
return pages.join('\n');
```

**List existing components across all pages:**
```js
const results = [];
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  page.findAll(n => {
    if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET')
      results.push(`[${page.name}] ${n.name} (${n.type}) id=${n.id}`);
    return false;
  });
}
return results.join('\n');
```

**List existing variable collections:**
```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const results = collections.map(c => ({
  name: c.name, id: c.id,
  varCount: c.variableIds.length,
  modes: c.modes.map(m => m.name)
}));
return results;
```

## 8. Editor Mode

`use_figma` works in **design mode** (editorType `"figma"`, the default).

Available in design mode: Rectangle, Frame, Component, Text, Ellipse, Star, Line, Vector, Polygon, BooleanOperation, Slice, Page, Section, TextPath.

**Blocked** in design mode: Sticky, Connector, ShapeWithText, CodeBlock, Slide, SlideRow, Webpage.
