---
type: implementation-specification
phase: 4
work_package: WP13
phase_of_wp: "Phase 2 — Category Screen"
status: v1.2 — Approved for Copilot implementation (Architecturally Approved)
author: Claude (Technical Lead)
date: 2026-08-04
governs: src/views/category-view.ts (not yet created)
---

# WP13 Phase 2 — Category Screen Specification

This document defines what Copilot is to build for the Category Screen. It does not contain production code. It is written against the actual current repository state (verified directly against `main`, commit `68741ec`) — not against assumption or prior-session memory.

---

## 1. Purpose

**Why the Category Screen exists:** it is the first screen that reveals the portfolio's shape — the moment a user chooses *which group* of projects to look at, before seeing any individual project. Per the frozen Phase 3 Architecture Record, Section A: Category Screen answers exactly one question, *"which group of projects am I looking at?"*

**Its role in the Command Center flow:** it is the second production screen, reached immediately after Entry (WP13 Phase 1, complete). It is also the screen `Top` always returns to, from any depth, for the rest of a session — making it the stable "home" of the navigable portion of the application, distinct from Entry, which is a once-per-session landing screen the user never returns to mid-session.

---

## 2. User Experience

**What the user sees:** the persistent Orientation Bar (already implemented, unchanged) at the top, and beneath it, a set of category choices matching `CATEGORY_ORDER` — currently `possible`, `planned`, `current`, `completed` (final user-facing labels not yet decided; see Section 7).

**What information is displayed:** only the category choices themselves. Per Phase 3 Section D (Category Screen responsibilities) and ACP-005, a per-category project count is an **optional enhancement, never a requirement** — if shown, it must be computed live from `ProjectRecord.status` values at render time, never cached. Given the current `ProjectRecordProvider` is still the WP12/Slice-7 stub (`() => []`), any count would currently and correctly read zero for every category — this is expected, not a bug, and should not be treated as a defect during implementation or review.

**What actions are available:** selecting one category. That's the only interactive surface this screen owns. No project-level detail, no cross-category summary, no dashboard content — all reserved for later screens.

---

## 3. Navigation Relationship

**How Entry transitions into Category:** already implemented in WP13 Phase 1 and unchanged by this spec. `CommandCenterView.proceedToCategoryDepth()` is called only after `EntryView`'s button is clicked, and only after `EntryView` has been fully torn down — `root.empty()` runs first, then `this.entryView = null`, then `NavigationController`, `OrientationBarComponent`, and `NavigationInspector` are constructed. **This is Option B, not Option A: `EntryView` and the Category-depth components are never mounted simultaneously; `EntryView` does not persist and "control visibility" of anything — it is removed before the others are constructed.** Category Screen's job is to become a **third component constructed and mounted inside `proceedToCategoryDepth()`** — the same method, in the same sequential construction block, alongside the existing `OrientationBarComponent` and `NavigationInspector` — never simultaneously with `EntryView`, which no longer exists by the time this method runs.

**How Category interacts with the existing navigation architecture:** a category selection calls `NavigationController.selectCategory(category: ProjectStatus)` — already implemented (`navigation-controller.ts`, line 141), unchanged by this spec. This sets `NavigationState` to `{ object: { kind: "category", category }, depth: "list" }`. The screen does not construct this state itself, does not call any resolver directly, and does not duplicate any paging/label logic — it only triggers the controller method and lets the existing `onStateChange` coordination (Slice 7, unchanged) handle re-rendering the Orientation Bar and `NavigationInspector`.

**How it prepares for the future Project List Screen:** once `selectCategory()` is called, `NavigationState.depth` becomes `"list"` — this is already the correct, existing signal for "show the Project List Screen next." This spec does not implement that screen; it only ensures Category Screen's one action produces the state List Screen (WP13 Phase 3) will read.

---

## 4. Existing Infrastructure (Reusable, Not to Be Reimplemented)

- **`NavigationController.selectCategory(category: ProjectStatus)`** — the sole state-transition method this screen calls.
- **`CATEGORY_ORDER`** (`orientation.ts`) — the authoritative, ordered list of valid categories. Category Screen must render its choices *from* this constant, not from a separately hardcoded list, to avoid a second source of truth.
- **`NavigationController.getAvailability()`** — not directly relevant to Category Screen's own rendering (its choices are always all equally selectable; there's no disabled state at this screen), but worth naming so Copilot doesn't assume it needs consulting here.
- **`OrientationBarComponent`'s existing `resolveLabel`-driven behavior** — already correctly updates to reflect the newly active category after `selectCategory()` is called; Category Screen does not need to touch the label itself.
- **Existing render-coordination pattern** (Slice 7): a single `onStateChange` callback, supplied by `CommandCenterView`, calling `render()` on every mounted component in order. Category Screen's own `render()` should be added to that same callback, not introduce a second coordination mechanism.

**Current assumptions already established in the repository, inherited as-is:**
- `ProjectRecordProvider` remains the stub (`() => []`) — Category Screen must not attempt real Metadata Cache integration; that remains explicitly out of scope for this phase, per WP12's Slice 7 boundary, unchanged.
- No styles.css exists yet — WP13 Phase 1 used inline styles; Copilot may continue that pattern or introduce a stylesheet, but this is an implementation detail, not something this spec mandates either way.

**Construction order within `proceedToCategoryDepth()` (explicit, to remove ambiguity):** `CategoryView` must be constructed after `OrientationBarComponent` and `NavigationInspector` are both constructed and have received their initial `render()` call — appended as a fourth step, not interleaved before or between the existing three. This matches the file's existing top-to-bottom construction pattern and requires no reordering of code that already works.

**Container strategy (explicit):** follow the existing one-`createDiv()`-per-component pattern exactly — `CategoryView` receives its own dedicated container (e.g., `categoryViewContainer`), created the same way `orientationBarContainer` and `inspectorContainer` already are. Do not share an existing container and do not append `CategoryView`'s content directly to `root`.

**Constructor shape (explicit):** `CategoryView` is neither purely passive (unlike `NavigationInspector`, it has one click action) nor does it independently trigger a two-component cascade (unlike `OrientationBarComponent`, whose `onStateChange` callback re-renders both the Bar and the Inspector). `CategoryView`'s constructor should take `(container, controller)` — the same two parameters as `NavigationInspector` — and its click handler should call `this.controller.selectCategory(category)` directly, then rely on the existing UI update coordination mechanism (the single `onStateChange` callback owned by `CommandCenterView`) being extended to call `categoryView.render()` alongside every other component it already re-renders. Do not give `CategoryView` its own separate `onStateChange`-style callback — there is exactly one coordination mechanism in this file, and it must remain exactly one after this phase, not two.

---

## 5. Architectural Boundaries

**What Category Screen owns:** its own rendering (the set of category buttons/choices) and translating a user's click into exactly one call to `selectCategory()`. Nothing else.

**What belongs to `NavigationController`:** the resulting state, its validity, and all paging/availability logic. Category Screen must never construct a `NavigationState` object itself, never call any `resolve*` function from `orientation.ts` directly, and never read or write `ProjectRecord` data directly — consistent with the sole-caller boundary already established and held throughout WP12 (`OrientationBarComponent` and `NavigationInspector` both already comply with this; Category Screen must match that precedent exactly, not introduce an exception).

**What must remain unchanged:** `orientation.ts`, `navigation-controller.ts`, `orientation-bar.ts`, `navigation-inspector.ts`, `main.ts`, and `entry-view.ts` (WP13 Phase 1). This phase adds exactly one new file and one small addition to `command-center-view.ts`'s existing `proceedToCategoryDepth()` method — the same minimal-footprint pattern WP13 Phase 1 already established and that Copilot's implementation already demonstrated it follows correctly.

---

## 6. Exclusions

**Does not belong on Category Screen:**
- Any project-specific content (names, status details, milestones) — that's List Screen and beyond.
- Any category *count*, unless explicitly approved as the optional enhancement described in Section 2 — and even then, computed live, never cached, per ACP-005.
- Any `<<`/`>>` paging logic of its own — paging among categories is already fully implemented in the Orientation Bar (Steps 1–2, unchanged); Category Screen does not duplicate it.

**Should wait for future Work Packages:**
- Project List Screen (WP13 Phase 3) — reads `NavigationState` once `depth === "list"`.
- Dashboard, Workspace screens — later phases entirely.
- Real `ProjectRecord`/Metadata Cache integration — a separate, not-yet-scheduled work package per WP12's own Slice 7 note.
- Final category display names (see Section 7) — not this phase's decision to make unilaterally.

---

## 7. Risks / Decisions Needed Before Implementation

1. **Final user-facing category labels are not yet decided.** Internal values (`possible`/`planned`/`current`/`completed`) are fixed by `ProjectStatus` and must not change — but what the *user sees* on each button (e.g., "Ideas," "Planned," "Current," "Completed," or other final wording) has been explicitly deferred in every prior WP13 discussion. **Recommend resolving this before Copilot implementation begins**, not leaving it as an implementation-time guess — per `AI_Team_Roles.md`, Copilot's mandate is to stop and ask rather than invent when a spec is unclear, and this is exactly that kind of gap.
2. **Whether to show per-category counts at all in this phase.** Section 2 covers the rule *if* shown; whether to actually include it now (recognizing it will read zero for everything until real data integration exists) is a product decision, not a technical one — flagging for explicit approval rather than defaulting either way.
3. **Whether Category Screen's rendering approach should introduce a stylesheet convention now**, given this is the second screen to need styling and WP13 Phase 1 used inline styles as a one-off choice. Not blocking, but worth a decision before a third inline-styled file makes the pattern harder to change later.

None of the above are architectural conflicts with frozen Phase 3 decisions — all three are implementation-detail or product-decision gaps appropriate for explicit resolution before implementation, not ACP-level concerns.

---

This specification has completed architectural review and is approved for implementation. No production code has been written. Copilot will implement this specification, and the implementation will be subject to technical review and verification before acceptance.
