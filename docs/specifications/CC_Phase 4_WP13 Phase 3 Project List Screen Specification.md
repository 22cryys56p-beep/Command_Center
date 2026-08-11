---
type: implementation-specification
phase: 4
work_package: WP13
phase_of_wp: "Phase 3 — Project List Screen"
status: draft — pending ChatGPT review and approval before Copilot implementation
author: Claude (Technical Lead)
date: 2026-08-07
governs: src/views/project-list-view.ts (not yet created)
baseline: WP13 Phase 2 verified complete, commit 99d4bcf
---

# WP13 Phase 3 — Project List Screen Specification

This document defines what Copilot is to build for the Project List Screen. It does not contain production code. It is written against the repository state already verified in this conversation (commit `99d4bcf`, WP13 Phase 2 complete) — no additional full audit was performed; only the specific existing contracts this phase depends on were re-checked directly.

---

## 1. Purpose

**Why the Project List Screen exists:** it is the screen that answers *"which project am I going into?"* — the second narrowing step in the portfolio, after the user has already chosen a category on the Category Screen (WP13 Phase 2, complete). Per the frozen Phase 3 Architecture Record, Section A, this is the third of five production screens (`Entry → Category → Project List → Dashboard → Workspace`).

**Its role in the Command Center flow:** it is reached the moment `NavigationState.depth` becomes `"list"` — which already happens today, automatically, as a direct consequence of `CategoryView` calling `NavigationController.selectCategory()` (Phase 2, unchanged). This phase does not create that transition; it creates the screen that should appear once that transition has already occurred.

---

## 2. User Experience

**What the user sees:** the persistent Orientation Bar (unchanged), and beneath it, a list of projects belonging to the currently active category.

**What information is displayed:** per Phase 3 Section D (Project List Screen responsibilities), each project is shown only as a **compact project summary** — `name` and `focus` from its `ProjectRecord`. No `milestone`, `progress`, `next_action`, `blockers`, `repo_reference`, or `last_updated` — those belong to the Dashboard (WP13 Phase 4), not this screen. This is a **hard content boundary**, not a style preference: showing Dashboard-tier fields here would front-load status detail into a screen whose job is selection, not review.

**What actions are available:** selecting one project. That is the only interactive surface this screen owns — identical in kind to how Category Screen owns exactly one action (selecting a category).

**Empty-category state:** given the current `ProjectRecordProvider` stub (`() => []`, unchanged since WP12 Slice 7), **every category will currently show zero projects.** This is expected, not a defect, and must be handled as a valid, calm state — not an error, not a loading indicator, not blank/broken-looking. Per Phase 3 Section 6 (Metadata Strategy, Interaction Principles): *"a category with no projects yet... must have a defined, intentional appearance."*

---

## 3. Navigation Relationship

**How Category transitions into Project List:** already fully implemented, unchanged by this spec. `CategoryView`'s existing click handler already calls `NavigationController.selectCategory(category)`, which sets `NavigationState` to `{ object: { kind: "category", category }, depth: "list" }`. This phase adds a screen that reads that state — it does not modify the transition that produces it.

**How Project List interacts with the existing navigation architecture:** a project selection calls `NavigationController.selectProject(project_id: string)` — already implemented (`navigation-controller.ts`), unchanged by this spec. **Critical existing contract, confirmed directly in the current code and binding on this implementation:** `selectProject()` requires `state.object` to already be `{ kind: "category" }` — i.e., it must only ever be called while genuinely at List depth — and it derives the resulting project's `category` field from that existing state, performing **no `ProjectRecord` lookup** to determine it. Calling `selectProject()` when `state.object` is not a category object is a caller-contract violation and throws by design (per WP12 Slice 3's "honest failure over silent degradation" precedent) — this screen must never call it from any other state.

**How it prepares for the future Project Dashboard:** once `selectProject()` succeeds, `NavigationState.depth` becomes `"dashboard"` and `object` becomes `{ kind: "project", project_id, category }` — already the correct, existing signal for "show the Dashboard next." This spec does not implement that screen.

---

## 4. Existing Infrastructure (Reusable, Not to Be Reimplemented)

- **`NavigationController.selectProject(project_id: string)`** — the sole state-transition method this screen calls.
- **`NavigationController.getState()`** — must be used to read the current category (`state.object.category`, valid only when `state.object.kind === "category"`) so the screen knows which category's projects to display. This screen does not receive the active category as a constructor parameter from a prior screen — it reads it live from the controller, the same way every other component in this project reads state rather than being handed it externally.
- **`CategoryView`'s existing pattern as the direct structural precedent** (WP13 Phase 2, just verified complete) — same category of component: one file in `src/views/`, one clear action, no direct resolver/state-construction/`ProjectRecord`-lookup logic of its own.
- **Existing render-coordination mechanism** (Slice 7, extended at Phase 2): the single `onStateChange` closure in `CommandCenterView`. This screen's `render()` must be added to that same callback, exactly as `CategoryView`'s was.

**Current assumptions inherited as-is:**
- `ProjectRecordProvider` remains the stub (`() => []`) — this screen will render correctly-empty for every category until real data integration exists (a separate, not-yet-scheduled work package). Do not attempt real Metadata Cache access in this phase.
- No stylesheet convention has been formally adopted; WP13 Phases 1 and 2 both used inline styles. This spec does not mandate either approach — an implementation detail, not a requirement — but see Section 7, item 3, which is the same open question carried forward from Phase 2's spec, still unresolved.

---

## 5. Architectural Boundaries

**What Project List Screen owns:** its own rendering (the list of project summaries for the currently active category, plus the empty-state presentation) and translating a user's click into exactly one call to `selectProject()`.

**What belongs to `NavigationController`:** the resulting state, its validity, and all paging/availability logic — unchanged, identical boundary to Category Screen's. This screen must never construct a `NavigationState` object itself, never call any `resolve*` function from `orientation.ts` directly, and must read `ProjectRecord` data **only** through the same `ProjectRecordProvider` already injected into `NavigationController` — it must not introduce a second, independent data-access path.

**What must remain unchanged:** `orientation.ts`, `navigation-controller.ts`, `orientation-bar.ts`, `navigation-inspector.ts`, `main.ts`, `entry-view.ts`, and `category-view.ts`. This phase adds exactly one new file (`project-list-view.ts`) and a small, additive change to `command-center-view.ts`'s `proceedToCategoryDepth()` method — following the exact same minimal-footprint pattern both prior phases established.

**Deferred, explicitly not resolved by this spec (see Section 7, item 4):** whether `ProjectListView`'s coordination wiring should use constructor injection (matching `OrientationBarComponent`) or the setter-injection pattern `CategoryView` actually used (`setOnStateChange()`). This inconsistency was flagged as deferred housekeeping during Phase 2's review and remains genuinely unresolved — this phase should not silently pick one without it being an explicit decision, since whichever pattern is used here will likely become the de facto precedent for Dashboard and Workspace after it.

---

## 6. Exclusions

**Does not belong on Project List Screen:**
- Any Dashboard-tier field (`milestone`, `progress`, `next_action`, `blockers`, `repo_reference`, `last_updated`) — hard boundary, restated from Section 2.
- Any category-selection UI of its own — that's Category Screen's job; this screen is reached only after a category is already active.
- Any `<<`/`>>` paging logic of its own for projects — per Phase 3 Section C, project-to-project paging is Dashboard/Workspace-depth behavior (paging among *project* siblings), already fully implemented in the Orientation Bar. Project List Screen does not duplicate or pre-empt it.

**Should wait for future Work Packages:**
- Project Dashboard (WP13 Phase 4) — reads `NavigationState` once `depth === "dashboard"`.
- Workspace Screen — later still.
- Real `ProjectRecord`/Metadata Cache integration — unscheduled, unchanged from every prior phase's note.
- Secondary organization (grouping/sorting/filtering of a long project list) — explicitly out of scope per Phase 3 Section 7 (Scalability), which defers this until it's actually needed at scale, not built preemptively.

---

## 7. Risks / Decisions Needed Before Implementation

1. **Empty-state presentation is unspecified beyond "must be intentional, not broken-looking."** Section 2 states the requirement; it does not prescribe exact wording or layout. Recommend leaving this as an implementation-level choice for Copilot, *unless* you want specific empty-state copy approved in advance — flagging so this isn't silently decided without visibility, not because it's architecturally significant.
2. **Whether project summaries need any visual distinction beyond plain text** (e.g., card-like styling vs. a plain list) is undecided and, per Phase 3 Section D, architecturally irrelevant — *"card"* is explicitly non-mandated terminology; only the two-field content requirement (`name`, `focus`) is binding. Not blocking, just noting the same latitude Phase 2 had for its button styling.
3. **Stylesheet convention** — same open item carried forward from Phase 2's specification, still unresolved after two phases now using inline styles independently. Worth a decision before a third file makes the pattern harder to unwind later, though still not blocking this phase specifically.
4. **Constructor-injection vs. setter-injection for the `onStateChange` callback** — see Section 5. This is the most consequential open decision in this document: Phase 2 already introduced one inconsistency; this phase is the fork point where it either gets corrected or becomes the established (if accidental) pattern for everything after it. **Recommend resolving this explicitly before Copilot implementation begins**, rather than letting a second phase compound an already-flagged deviation.

None of the above are conflicts with frozen Phase 3 architecture — all four are implementation-detail or process decisions appropriate for explicit resolution before implementation, consistent with how Phase 2's equivalent risks were handled.

---

This specification is ready for ChatGPT's architectural review. No production code has been written. Awaiting approval before this is handed to Copilot for implementation.
