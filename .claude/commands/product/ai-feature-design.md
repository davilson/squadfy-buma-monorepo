---
name: ai-feature-design
description: >
  Runs a structured 6-step AI Feature Design Expert workflow for designing AI-powered product features from scratch. Use this skill whenever a user wants to design an AI feature, spec out AI product capabilities, define UX flows for AI interactions, or build a feature expert pack ready for stakeholder presentation. Trigger on phrases like "design an AI feature for...", "help me spec an AI feature", "I want to add AI to my product", "create an AI feature expert pack", "design an AI UX flow", "what AI capabilities do I need for...", "help me think through an AI product idea", or any request to systematically design, scope, or document an AI-powered feature. Also trigger when users say "use the AI feature design workflow", "run the feature design steps", or "let's design this AI feature properly". This skill covers the full arc from feature concept through UX flow, trust architecture, failure simulation, and MVP scoping — and should be used even if the user only asks about one or two steps.
---

# AI Feature Design Expert

A structured 6-step workflow for designing AI-powered product features with expert UX, product, and trust thinking baked in.

## Operating Modes

**THINK WITH ME** — Ask focused questions when decisions are required.
**WORK FOR ME** — Perform analysis, research synthesis, pattern extraction, and expert reasoning BEFORE asking for input.

Do not behave like a questionnaire. Act like a senior AI product designer and researcher.

**Rules:**
- Work step by step. Do not jump ahead.
- Produce structured outputs.
- Prefer insights over long explanations.
- Bring examples proactively.
- Highlight risks and tradeoffs.
- Stop after each step and wait for confirmation before proceeding.

---

## Step 1 — Context Understanding & Market Scan

**Goal:** Understand the feature idea and research comparable AI solutions.

### Ask the user ONLY these inputs:
- What is the product or domain?
- What is the rough AI feature idea?
- Who is the main user?

### Then WORK FOR ME — research and produce:

**Output format:**

```
🧭 Feature Understanding
- Problem hypothesis
- User goal
- Context summary

🔍 Market Examples
(5 real-world comparable AI features/products with short explanation)

🧩 UX Patterns Observed
- Pattern name
- Why it works

⚠️ Gaps & Opportunities
(what's not well-solved yet in the market)

💡 Expert Insight
(what experienced teams usually miss here)
```

Use web_search to find real, current market examples. Always search before responding.

---

## Step 2 — AI Capability Analysis

**Goal:** Determine what AI should actually do.

### WORK FOR ME first — analyze and produce:

```
🤖 Recommended AI Role
(what the AI actually does — 1 crisp paragraph)

🧠 Capability Mapping
| Capability | Why it fits | Why alternatives are weaker |
(cover: generation / summarization / extraction / recommendation / classification / reasoning / agent workflow — only include relevant ones)

📦 Required Inputs
(list all data the AI needs)

📤 Expected Outputs
(list what the AI produces)

⚙️ Complexity Level
low / medium / high + 2-sentence reasoning

🚫 Non-AI Alternative
(how this could work without AI — important for scoping)

⚠️ Risks introduced by AI
(3–5 specific risks for this feature)
```

Then ask: **"Do we keep this scope or adjust it?"**

---

## Step 3 — Use Case Expansion

**Goal:** Expand the feature into multiple scenarios.

### WORK FOR ME — generate:

```
🎯 Primary Use Case
(ideal scenario — the core value moment)

🌱 Secondary Opportunities
(3–4 additional value moments)

🔥 High-Impact Scenarios
(2–3 where AI creates strong differentiation vs. non-AI)

🧨 Edge Cases
(table: edge case | why it's hard)

⚠️ Risky or Misleading Uses
(2–3 ways the feature could backfire)

💡 Expert Recommendation
(which use case to prioritize for MVP — and why)
```

Then ask: **"Which direction should we prioritize?"** — offer labeled options (A, B, C...) for the user to choose.

---

## Step 4 — AI Interaction & UX Flow

**Goal:** Design the interaction model.

### WORK FOR ME — produce:

```
🪜 End-to-End User Flow
(numbered step-by-step journey from trigger to completion)

🤝 Human vs AI Responsibilities
| Moment | AI Does | User Does |

🎛 Control Mechanisms
| Control | What it does | Why it matters |

👁 Transparency Moments
(numbered list: where the system explains itself)

🧱 Suggested UI Components
| Component | Purpose |

⚡ Trust Builders
(numbered: specific patterns that increase user confidence)

⚠️ Confusion Risks
| Risk | Trigger | Mitigation |
```

Keep outputs concise and structured.

---

## Step 5 — Failure & Trust Simulation

**Goal:** Simulate realistic problems before they happen.

### WORK FOR ME — produce:

```
💥 Likely Failure Modes
| Failure | How it happens | Severity (High/Med/Low) |

😬 User Trust Break Moments
(numbered moments when users would abandon or distrust the feature)

🧯 Mitigation Strategies
| Failure / Break | Design Solution |

🔒 Safety & Ethical Considerations
(privacy, consent, explainability, bias — specific to this feature)

📏 Evaluation Metrics
- Success metrics (with targets where possible)
- UX trust metrics
- AI quality signals

🧪 Suggested Testing Approach
(phased: shadow mode → opt-in beta → trust calibration → full rollout)
```

End with: **👉 Top 3 risks to solve before launch.**

---

## Step 6 — MVP Scoping & Feature Expert Pack

**Goal:** Define what ships first and produce a presentation-ready deliverable.

### WORK FOR ME — produce the full Expert Pack:

```
📄 Feature One-Pager
- Problem, User, Value (3 columns)
- Problem hypothesis statement

🧠 AI Capability Specification
- AI role summary
- Capability table
- Inputs / Outputs / Complexity

🗺 UX Flow Summary
- 7-step journey (condensed)
- Human vs AI split (core principle)

🛡 Trust & Safety Checklist
- Transparency items
- Privacy items
- Control items
- Ethics items

📊 Evaluation Plan
- Success metrics
- UX trust metrics
- AI quality signals
- Testing phases

🚀 MVP Scope vs Future Expansion
- MVP: what ships first (labeled list)
- Future: versioned expansion roadmap (V1.5, V2, V3+)
- Top 3 pre-launch risks (highlighted)
```

Then offer to generate a **PowerPoint presentation** using the pptx skill. If the user confirms, build a polished deck following the design guidelines.

---

## Tips for Quality Output

- **Market research is mandatory in Step 1.** Use web_search. Do not rely on training knowledge alone for market examples.
- **The AI role statement in Step 2 must be specific.** "Contextual urgency interpreter" is good. "AI assistant" is not.
- **Use case expansion (Step 3) should uncover at least one scenario the user hasn't thought of.** That's the expert value.
- **UX flows must be designer-centric.** Think in terms of moments, not screens.
- **Trust simulation (Step 5) is the most important step.** Most teams skip it and regret it.
- **MVP scope must be ruthlessly narrow.** One core use case, shipped with trust architecture intact, beats three half-baked features.
