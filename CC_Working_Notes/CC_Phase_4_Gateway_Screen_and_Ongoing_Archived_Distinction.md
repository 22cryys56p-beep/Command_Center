---
type: architectural-addendum
status: INCORPORATED — content below has been merged into the authoritative Phase 4 matrix (Documents A and D). This file is retained as historical working material only; it is no longer an active draft and should not be re-derived or re-proposed.
date: 2026-08-27
incorporated: 2026-08-29
source: Kurt, stated directly in conversation with Claude
---

# Gateway Screen and the Ongoing / Archived Distinction

## Incorporation record

Everything in this document has been merged into the authoritative matrix as part of the Step 65 completeness review. Final disposition:

| This document's content | Landed as | Category |
|---|---|---|
| Gateway six-destination layout | **P4-R800** | Category 50 |
| Ongoing vs. Archived functional distinction | **P4-R799** | Category 12 |
| Honest-failure principle (missing/invalid ProjectRecord) | **P4-R796** | Category 43 |
| Missing-record presentation (OPEN) | **P4-R797** | Category 43 (Document D) |
| Invalid-record presentation (OPEN) | **P4-R798** | Category 43 (Document D) |
| Dashboard AI Progress Estimate, proactive display | **P4-R802** | Category 43 |

Two related items from the same Step 65 review, not originally part of this document, are recorded here for completeness:

- **P4-R801** (Category 1) — Archived/Ongoing project reactivation without requiring a New Project; Project Owner determines resulting status. Closed Document D's Category 1 open item, in combination with the already-existing P4-R171 (Category 10).
- **Old Day-1 P4-R27** ("Dashboard editing/writing of ProjectRecords") — examined during Step 65H and found already resolved by existing architecture: Category 18 (P4-R251–256, CC-owned metadata vs. externally-owned artifacts) and Category 59 (P4-R741–746, authority levels and external-action distinguishability). **No new P4-R ID was assigned** — adding one would have duplicated architecture that already exists. This closes out the old Day-1 P4-R13/25/26/27 set in full; all four have now been either restored (13, 25, 26 → 796, 797, 798) or explicitly resolved without a new ID (27).

The wording below is preserved as-written for historical reference; it may differ slightly from the final matrix phrasing, which is authoritative.

---

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

**INCORPORATED.** The Gateway Screen description is now P4-R800 in Category 50; the Ongoing/Archived distinction is now P4-R799 in Category 12. See the Incorporation record at the top of this document.

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

**INCORPORATED.** Now P4-R802 in Category 43, placed alongside P4-R581 ("Where Things Stand"). Clarifies P4-R581/P4-R586 rather than revising them, as originally proposed.
