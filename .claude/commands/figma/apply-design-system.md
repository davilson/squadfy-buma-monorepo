---
name: apply-design-system
description: Review an existing design and connect it to design system components. Use when an existing Figma design uses detached layers, local wrappers, or one-off components instead of the published design system. Triggers on phrases like "connect design to design system", "replace custom components with library", "swap layers for design system components", "reconcile design with library", or after running audit-design-system.
---

# Connect A Design To A Design System

Use this skill for an existing Figma design that should reuse a published design system instead of detached layers, local wrappers, or one-off components.

This skill supports two entry modes:
- `review-then-apply`: the user wants a broad pass, but the exact offending sections are not yet identified
- `apply-known-scope`: the user already knows which sections or clusters should be brought onto the design system

Load these capabilities first:
- Figma MCP read access for tools such as `get_metadata`, `get_screenshot`, and `search_design_system`
- `figma-use` before any `use_figma` call

Do not use this skill as the default follow-up to a single `audit-design-system` finding. For one targeted issue, use the narrower finding-fix approach so the write scope stays narrow.

## Core Rule

Do not treat a section as "connected" just because it contains a few design-system buttons or icons.

This skill is for multi-section reconciliation. Classify each section into exactly one bucket:
- `already-connected`: the section itself is a library instance or a composition the user explicitly accepts as already canonical
- `exact-swap`: a published library component or variant can replace the section directly
- `compose-from-primitives`: no single library component exists, but the section can be rebuilt from published library primitives
- `blocked`: the library does not expose the needed components, imports fail, or the section is intentionally bespoke

## Required Workflow

### 1. Determine Scope First

Before gathering replacement candidates, decide whether the screen needs an initial audit.

If scope is not already identified:
1. Run `audit-design-system` or perform an equivalent internal audit pass.
2. Collapse the review output into section-sized work packages instead of treating every micro-finding as a separate rewrite task.
3. If the review produces only one narrow finding, use a targeted fix instead of continuing here.

If scope is already identified, continue directly.

### 2. Capture the Current State

Before writing:
1. Get the target frame metadata with `get_metadata`.
2. Get a screenshot with `get_screenshot`.

### 3. Back Up the Target Screen

Before destructive edits, duplicate the frame or page and place the backup to the right. Name it clearly (e.g. `Backup - Start`). Do this in its own `use_figma` call and return the created node ID.

### 4. Inventory the Existing Screen

Use `use_figma` to gather:
- top-level section instances
- each section's `mainComponent`
- whether that component is local, remote, or missing
- nested published components already used inside each local wrapper
- exposed text and variant properties when present

Prefer exact keys over names. Names are only hints.

### 5. Build a Component Map From the Design System

Prefer authoritative sources in this order:
1. Existing screens in the same library or workfile that already use the system
2. Known library pages inspected directly with `use_figma`
3. `search_design_system` as a fallback only

For each candidate, capture:
- component or component-set key
- exact variant name
- whether the section is a one-to-one swap or a composition
- text property keys or nested instance properties needed for overrides

### 6. Decide Section Strategy

- `exact-swap` if a library component matches the section's job and structure closely enough
- `compose-from-primitives` if the section is a container around library pieces
- `blocked` if the design system lacks the composite, or imports fail

Common patterns:
- Header summary blocks are often `compose-from-primitives`, not one component
- Alerts and metrics often have strong `exact-swap` candidates
- Bottom nav bars are frequently custom containers built from nav-item primitives

### 7. Update One Section At A Time

Never rewrite the entire screen in one script.

For each section:
1. Read the current node IDs.
2. Import or locate the library component.
3. Match the closest variant to the original section before swapping or rebuilding.
4. Detect whether the parent uses auto-layout.
5. Create or swap only that section.
6. Return all mutated node IDs.
7. Validate with `get_screenshot`.

Prefer `swapComponent()` when the existing node is already an instance of a compatible family.

Prefer rebuilding beside the original when:
- the old section is a local wrapper around mixed content
- you need to compare the result visually before replacing the original

For non-auto-layout parents:
- preserve `x` and `y` explicitly
- preserve width and height explicitly
- warn the user that absolute-positioned parents can cause drift after swaps

### 8. Handle Import Failures Explicitly

If `importComponentSetByKeyAsync()` fails:
1. Stop.
2. Check whether exact component keys already exist elsewhere in the target file.
3. Try importing the exact component key instead of the component-set key.
4. If imports still fail, mark the section `blocked` and report the blocker clearly.

### 9. Validate What Actually Changed

After each section:
- screenshot the changed section, not only the full frame
- confirm placeholder text is gone
- confirm the instance is really linked to a library component
- confirm spacing did not regress

At the end, validate the full screen screenshot as well.

## Deliverable Format

When closing the task, report:
- `Swapped`: sections replaced directly with library instances
- `Composed`: sections rebuilt from library primitives
- `Already connected`: sections that were already valid
- `Blocked`: sections that could not be connected, with the concrete reason
