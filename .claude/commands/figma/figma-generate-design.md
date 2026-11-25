---
name: figma-generate-design
description: "Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code'. This is the preferred workflow skill whenever the user wants to build or update a full page, screen, or view in Figma from code or a description. Discovers design system components, variables, and styles via search_design_system, imports them, and assembles screens incrementally section-by-section using design system tokens instead of hardcoded values."
disable-model-invocation: false
---

# Build / Update Screens from Design System

Use this skill to create or update full-page screens in Figma by **reusing the published design system** — components, variables, and styles — rather than drawing primitives with hardcoded values.

**MANDATORY**: You MUST also load `figma-use` before any `use_figma` call. That skill contains critical rules (color ranges, font loading, etc.) that apply to every script you write.

**Always pass `skillNames: "figma-generate-design"` when calling `use_figma` as part of this skill.**

## Skill Boundaries

- Use this skill when the deliverable is a **Figma screen** (new or updated) composed of design system component instances.
- If the user wants to generate **code from a Figma design**, switch to `figma-implement-design`.
- If the user wants to create **new reusable components or variants**, use `figma-use` directly.

## Prerequisites

- Figma MCP server must be connected
- The target Figma file must have a published design system with components (or access to a team library)
- User should provide either a Figma file URL / file key or context about which file to target

## Parallel Workflow with generate_figma_design (Web Apps Only)

When building a screen from a **web app** that can be rendered in a browser:

1. **In parallel:**
   - Start building the screen using this skill's workflow (use_figma + design system components)
   - Run `generate_figma_design` to capture a pixel-perfect screenshot of the running web app
2. **Once both complete:** Update the use_figma output to match the pixel-perfect layout from `generate_figma_design`.
3. **Once confirmed looking good:** Delete the `generate_figma_design` output — it was only used as a visual reference.

This only applies to web apps. For non-web apps or when updating existing screens, use the standard workflow below.

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Understand the Screen

1. If building from code, read the relevant source files to understand the page structure, sections, and which components are used.
2. Identify the major sections of the screen (e.g., Header, Hero, Content Panels, Footer).
3. For each section, list the UI components involved.

### Step 2: Discover Design System — Components, Variables, and Styles

#### 2a: Discover components

**Preferred: inspect existing screens first.** If the target file already contains screens using the same design system, inspect existing instances directly with `use_figma`.

Only fall back to `search_design_system` when the file has no existing screens. When using it, search broadly — try multiple terms and synonyms. Use `includeComponents: true`.

**Include component properties** — you need to know which TEXT properties each component exposes for text overrides.

#### 2b: Discover variables (colors, spacing, radii)

**WARNING: Two different variable discovery methods — do not confuse them.**

- `use_figma` with `figma.variables.getLocalVariableCollectionsAsync()` — returns **only local variables**. If this returns empty, it does NOT mean no variables exist.
- `search_design_system` with `includeVariables: true` — searches across **all linked libraries**. This is the correct tool for discovering design system variables.

Never conclude "no variables exist" based solely on `getLocalVariableCollectionsAsync()` returning empty.

**Query strategy:** Run multiple short queries in parallel: "gray", "background", "space", "radius", etc.

For library variables (remote = true), import them by key with `figma.variables.importVariableByKeyAsync(key)`.

#### 2c: Discover styles (text styles, effect styles)

Search for styles using `search_design_system` with `includeStyles: true` and terms like "heading", "body", "shadow".

Import library styles with `figma.importStyleByKeyAsync(key)`, then apply with `node.textStyleId = style.id`.

### Step 3: Create the Page Wrapper Frame First

**Do NOT build sections as top-level page children and reparent them later** — moving nodes across `use_figma` calls silently fails and produces orphaned frames.

Create the wrapper first in its own `use_figma` call, positioned away from existing content. Return its ID.

```js
let maxX = 0;
for (const child of figma.currentPage.children) {
  maxX = Math.max(maxX, child.x + child.width);
}
const wrapper = figma.createFrame();
wrapper.name = "Homepage";
wrapper.layoutMode = "VERTICAL";
wrapper.resize(1440, 100);
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "HUG";
wrapper.x = maxX + 200;
wrapper.y = 0;
return { success: true, wrapperId: wrapper.id };
```

### Step 4: Build Each Section Inside the Wrapper

Build one section at a time, each in its own `use_figma` call. At the start of each script, fetch the wrapper by ID.

**Key rules:**
- Import design system components by key: `figma.importComponentSetByKeyAsync(key)`
- Import variables by key: `figma.variables.importVariableByKeyAsync(key)`
- Bind colors with `setBoundVariableForPaint`, spacing with `setBoundVariable`
- Apply text styles with `node.textStyleId`, effect styles with `node.effectStyleId`
- Append section to wrapper, THEN set `layoutSizingHorizontal = "FILL"` (AFTER appending)
- **MUST return all created node IDs**: `return { success: true, createdNodeIds: [...] }`

**Override instance text** using `setProperties()` with component property keys — more reliable than direct `node.characters` manipulation.

**What to build manually vs. import from design system:**

| Build manually | Import from design system |
|----------------|--------------------------|
| Page wrapper frame | Components: buttons, cards, inputs, nav |
| Section container frames | Variables: colors, spacing, radii |
| Layout grids | Text styles, effect styles |

**Never hardcode hex colors or pixel spacing** when a design system variable exists.

After each section, validate with `get_screenshot` before moving on.

### Step 5: Validate the Full Screen

After composing all sections, call `get_screenshot` on the full page frame. Screenshot individual sections too — a full-page screenshot hides text truncation, wrong colors, and placeholder text.

Look for:
- Cropped/clipped text (line heights cutting off content)
- Overlapping content
- Placeholder text still showing ("Title", "Heading", "Button")
- Wrong component variants

### Step 6: Updating an Existing Screen

When updating rather than creating from scratch:
1. Use `get_metadata` to inspect the existing screen structure.
2. Identify which sections need updating.
3. For each section that needs changes: locate existing nodes by ID, swap or update as needed.
4. Validate with `get_screenshot` after each modification.

## Error Recovery

Follow the error recovery process from `figma-use`:
1. **STOP** on error — do not retry immediately.
2. **Read the error message carefully.**
3. If unclear, call `get_metadata` or `get_screenshot` to inspect current file state.
4. **Fix the script** based on the error message.
5. **Retry** — safe because failed scripts are atomic.

## Best Practices

- **Always search before building.** The design system likely has the component, variable, or style you need.
- **Prefer design system tokens over hardcoded values.**
- **Prefer component instances over manual builds.**
- **Work section by section.** Never build more than one major section per `use_figma` call.
- **Return node IDs from every call.**
- **Validate visually after each section.**
