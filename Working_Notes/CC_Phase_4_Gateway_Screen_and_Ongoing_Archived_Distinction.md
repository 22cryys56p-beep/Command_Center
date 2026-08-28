---
type: architectural-addendum
status: draft — pending Kurt's review before merge into Document A / Category 50
date: 2026-08-27
source: Kurt, stated directly in conversation with Claude
---

# Gateway Screen and the Ongoing / Archived Distinction

## Why this document exists

The mechanics behind Command Center's six top-level navigation destinations (Category 50, P4-R650–P4-R657) were reconstructable from the audited matrix — but only by assembling inference across four separate categories (9, 12, 17, 50), and only after several rounds of reconciliation. Two pieces of information were not written down anywhere as explicit fact:

1. The concrete Gateway/opening-screen layout itself.
2. The functional distinction between **Ongoing** and **Archived** — the matrix establishes that both preserve project information non-destructively, but never states *why* a project belongs in one versus the other.

Kurt confirmed this gap directly and stated the following as authoritative design intent. This document captures that statement verbatim in structure, so it stops depending on reconstruction from scattered categories.

---

## The Gateway Screen

The entry point into Command Center presents six buttons/options:

```text
[Current]     [Planning]      [Ideas]
[Ongoing]     [New Project]   [Archive]
```

This layout is the concrete screen referenced abstractly by Category 50's grouping (P4-R651: Current/Planning/Ideas as top-level views; P4-R652: Ongoing/New Project/Archive as secondary navigation/workspaces).

### What each button does

- **Current** — The main folders of what you're actively working on (e.g., Command_Center itself).
- **Planning** — Projects that have advanced past the Ideas stage; foundations are actively being built.
- **Ideas** — Brainstorming and spitballing about projects that could be. Per P4-R237/238, these need not exist as formal `ProjectRecord`s.
- **Ongoing** — Completed projects that still have active, separate "tentacles" — marketing, login, monetization, and similar ongoing concerns that persist after the core project work is done.
- **New Project** — Creates a workflow window to start a new project, either from scratch or from prebuilt templates/folder structures. The result can be routed directly into either the Ideas arena or the Planning stage. This is a workflow action, not a status (consistent with its classification in Category 50 as a secondary workspace rather than a status view).
- **Archive** — Access to previous, genuinely finished projects. Early work here may be reused as seed or kernel material for a new project.

---

## The Ongoing vs. Archived distinction

This is the piece most at risk of being silently flattened without an explicit statement, since Category 12 describes both as non-destructive and retrievable without distinguishing their purpose.

> **Ongoing** — The core project is essentially complete, but dependent side-branches remain active and require occasional attention (e.g., marketing, login systems, monetization).
>
> **Archived** — The project is genuinely finished. Nothing about it remains active. It is retained specifically as potential seed/kernel material for future projects (consistent with P4-R193, P4-R195–198).

The practical test: **if any part of the project still needs occasional live attention, it belongs in Ongoing, not Archived.** Archived is reserved for projects with no remaining active concerns.

---

## Status

This document is a **draft capturing Kurt's direct statement**, not yet merged into the authoritative matrix. Pending Kurt's confirmation, the recommended integration is:

- Fold the Gateway Screen description into Category 50 as new KEEP-Phase4/KEEP-Foundation items (next available IDs: **P4-R796** onward).
- Add the Ongoing/Archived distinction as an explicit addition to Category 12, since it clarifies but does not contradict P4-R186–192.

No existing P4-R item is revised or removed by this document — it only makes explicit what was previously implicit or absent.

---

## Addendum — AI Progress Estimate: Dashboard placement and proactive display

### The gap

Two related points were never made explicit anywhere in the audited matrix:

1. **AI Progress Estimate is named for the Workspace, not the Dashboard.** P4-R323 (Category 24 — Project Workspace) explicitly lists "AI Progress Estimate" as a component of that screen's "Where Things Stand" section. Category 43 — The Project Dashboard — also has a "Where Things Stand" section (P4-R581), and P4-R586 says the Dashboard "should surface AI-maintained operational information," but nowhere does the matrix state that AI Progress Estimate specifically belongs there. Since the Dashboard is the actual opening screen a project is entered through (per Category 63's Dashboard/Workspace split — Dashboard for orientation/re-entry, Workspace for execution), this is the screen where Kurt expects to see it, and it was not explicitly specified.

2. **Proactive display was never stated outright.** Both P4-R323 ("should support") and P4-R586 ("should surface") are worded in a way that's compatible with either the estimate appearing automatically on load, or only being available if separately requested. Kurt's expectation, confirmed directly: it must appear on the project's opening screen without any additional action — no extra clicks, no asking for it.

### Resolution

> **The AI Progress Estimate is a required component of the Project Dashboard's "Where Things Stand" section (Category 43) and must be displayed automatically when the Dashboard is opened — not gated behind further navigation or an explicit request.** This is consistent with, and a direct application of, the Dashboard's existing "See first. Read second." principle (P4-R579).

The Workspace's own "Where Things Stand" (P4-R323) is unaffected — the Dashboard version described here is the summary-level instance encountered first; the Workspace version remains the deeper, execution-context instance.

### Status

Pending Kurt's confirmation, recommended integration: add as an explicit item under Category 43 (next available ID continuing from wherever the main Gateway addition lands, e.g. **P4-R797**), clarifying P4-R581/P4-R586 rather than revising them.
