---
name: edit-figma-design
description: Create or update Figma designs directly from a written product or UI description using the Figma MCP authoring tools. Use when the user wants a mockup, wireframe, screen, component, flow, or concept designed in Figma from text, or wants to iterate on an existing Figma file from textual feedback. Despite the name, this skill can start from a new blank file or edit an existing one. Do not use for capture-based workflows that turn a running page into Figma; use figma-generate-design for those, and use figma-implement-design for code implementation requests. Requires Figma MCP server connection.
---

# Edit Figma Design

## Overview

This skill creates or updates Figma designs directly from a natural-language description. It combines Figma library search with direct file authoring.

## When to use this skill

Use this skill when the user wants you to:

- design a new screen, flow, component, or mockup in Figma from a written description
- refine or extend an existing Figma file from text feedback
- create a first-pass wireframe or higher-fidelity design directly in Figma
- align a Figma design to an existing design system or product vocabulary

Do not use this skill when:

- the user wants production code from a design — use `figma-implement-design`
- the user wants to capture a running page or app into Figma — use `figma-generate-design`
- the user only wants to inspect or pull existing Figma context

## Prerequisites

- Figma MCP server must be connected and accessible.
  - Verify that `search_design_system`, `create_new_file`, and `use_figma` are available.
- Gather the minimum information needed to proceed:
  - what should be designed
  - whether to use an existing Figma file or create a new one
  - whether the result should align to an existing design system or codebase
- Ask clarifying questions only when the user has not already given enough detail to start.

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Confirm this is a Figma-authoring request

If the user is actually asking for implementation, stop and consult `figma-implement-design`.

If the user wants a screenshot-to-Figma or webpage capture flow, stop and consult `figma-generate-design`.

### Step 2: Resolve the destination file first

Both `search_design_system` and `use_figma` need a `fileKey`, so determine the destination before searching or editing.

**If the user provided an existing Figma URL or file key:**
- Extract and use that `fileKey`.

**If the user wants a new file:**
1. Decide on a clear file name from the request.
2. Call the Figma MCP `whoami` tool to inspect the authenticated Figma user and available plans.
3. If there is exactly one plan, use its `key`.
4. If there are multiple plans, ask the user which team or organization to use.
5. Call `create_new_file(editorType="design", fileName=..., planKey=...)`.
6. Save the returned `fileKey` and URL. Share the URL once the first usable draft is ready.

### Step 3: Gather the right context, but only when it is needed

**Stay inside Figma MCP only** when the user wants an exploratory concept, wireframe, or mockup and does not ask for codebase alignment.

**Use codebase context selectively** when the user wants the design to match an existing product or design system:
- read project rules if they exist
- use semantic codebase search to find relevant components, product vocabulary, layout patterns, and design-token sources

### Step 4: Search the design system before authoring

Call `search_design_system` with the resolved `fileKey` before creating new components or styles.

Search for the most reusable assets first: components, variables/tokens, styles.

Prefer reusing and importing matches over recreating them from scratch.

### Step 5: Prepare `use_figma` safely

Before the first `use_figma` call, plan the edit sequence and follow the Plugin API constraints from `figma-use`.

Keep the authoring plan incremental:
1. create page and frame structure
2. establish layout and major sections
3. reuse or import design-system assets
4. apply variables, styles, and typography
5. add content and polish
6. make targeted revisions based on what the file now contains

### Step 6: Edit the design in small `use_figma` steps

Use multiple small `use_figma` calls instead of one giant script.

Good step boundaries:
- create a page and top-level frames
- lay out a header, sidebar, hero, or content region
- import or place one family of reusable components
- bind colors, text styles, or spacing variables
- update copy, states, or alignment for a specific section

After each step, inspect the result and only continue once the previous step succeeded.

### Step 7: Hand back the design and next options

When the first usable draft is ready:
- return the Figma URL if you have it
- summarize what you created or updated at a high level
- ask whether the user wants revisions in Figma

If the user asks to implement the approved design in code, stop using this skill and consult `figma-implement-design`.

## Common Issues

- **User hasn't said whether to use existing file or new one** — Ask one direct question that resolves the destination. Do not start `search_design_system` or `use_figma` until you have a `fileKey`.
- **Multiple Figma plans available** — Ask the user which team or organization to use. Do not guess.
- **`use_figma` fails or script is getting large** — Break the task into smaller `use_figma` calls. Prefer structure first, then styling, then targeted revisions.
