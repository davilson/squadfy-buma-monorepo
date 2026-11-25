---
name: rad-spacing
description: Use for Figma layout work when creating new screens, refactoring spacing, standardizing hierarchy, or spacing nested components. Apply hierarchical spacing using the Gestalt principle of proximity so outer containers get proportionally more spacing than inner elements, using 8px/4px increments from the file's library variables.
---

# Rad Spacing

## When to use
- You're creating new screens or layouts and need intentional, consistent spacing that communicates visual hierarchy.
- You're refactoring spacing in an existing Figma design to improve readability and grouping.
- You're building components that will nest inside larger containers and need spacing that scales with depth.
- You're standardizing spacing across a file to align with the Gestalt principle of proximity — related items close together, separate groups further apart.

## Instructions
1. Identify the nesting depth of the design. Map out the hierarchy levels from outermost to innermost (e.g., page → section → card → card content → inline elements).
2. Check the Figma file's library for existing spacing variables:
   - Look for number variables in 4px or 8px increments (e.g., `spacing/4`, `spacing/8`, `spacing/16`, `spacing/24`).
   - If the library already has spacing variables, use them. Adapt to whatever naming convention is in place.
3. If no spacing variables exist, create semantic number variables using this default convention:
   - `spacing/xs` → 4px
   - `spacing/sm` → 8px
   - `spacing/md` → 12px
   - `spacing/lg` → 16px
   - `spacing/xl` → 24px
   - `spacing/2xl` → 32px
   - `spacing/3xl` → 48px
   - Adapt the naming if the library already has a pattern for other variable types.
4. Calculate spacing per hierarchy level using the ~40% rule:
   - Each parent level gets approximately 1.4× the spacing of its child level.
   - Snap the result to the nearest 8px increment. If the 0.6 ratio (child = parent × 0.6) lands closer to a 4px increment than an 8px increment, use the 4px value instead.
   - Work from the innermost elements outward, or from a known base value (commonly 8px for the tightest grouping).
5. Apply spacing using the `use_figma` MCP tool:
   - Use **padding** on auto-layout frames for container-level spacing (pages, sections, cards).
   - Use **gap** (itemSpacing) on auto-layout frames for spacing between sibling elements.
   - Bind spacing values to the library's number variables wherever possible.
6. Validate the visual hierarchy:
   - Outer groups should feel clearly separated from one another.
   - Inner items within a group should feel cohesive and related.
   - Check that the spacing progression is perceptible at each level — if two adjacent levels look the same, increase the ratio or adjust the snap.
7. Summarize what was applied:
   - List each hierarchy level, the spacing value used, and the variable it maps to (if any).
   - Flag any levels where the spacing progression feels visually weak or indistinguishable.
