---
type: verification-protocol
phase: 4
work_package: WP12
step: 5
slice: 9B
title: Framework Verification Protocol
status: retired — superseded by accepted navigation changes; not executed
previous_status: ready for execution — one known unresolved gap, see Section 6
date: 2026-07-27
---

## Retirement and Formal Disposition — 2026-11-13

**Disposition by Kurt, 2026-11-13.**

**This protocol is retired. Do not execute it as written.**

The original procedure is preserved below as a historical record. Its
assumptions and closure purpose have been superseded by accepted architectural
decisions and subsequent implementation.

### Formal disposition

The original Baseline Freeze criterion required both Slice 9A and Slice 9B to
pass before the WP12 baseline could be frozen. Kurt explicitly waives that
original requirement.

Slice 9B was not executed. This waiver is not a Slice 9B pass, does not claim
that every historical check passed, and does not alter the separately recorded
result of Slice 9A.

WP12 is formally closed by this recorded disposition. This closure does not
declare that a separate Baseline Freeze event has occurred.

The conditions that originally caused WP12 verification to pause have been
resolved or superseded by subsequent accepted architectural decisions and
implementation. The remaining Workspace-related verification is classified
as future Workspace acceptance work, not as a WP12 closure blocker.

### Why the original procedure is obsolete

- **Navigation depth — ACP-012:** the root navigation depth formerly named
  `category` was renamed `gateway`. This concerns the navigation-depth value;
  `CurrentObject.kind: "category"` remains an unchanged domain-object kind.
- **Project statuses — ACP-009:** `completed` was retired. The accepted
  statuses are `possible`, `planned`, `current`, `ongoing`, and `archived`.
- **Category paging — ACP-010:** category-level sibling paging after the
  Gateway was retired.
- **Dashboard Up — ACP-017:** Up from a Project Dashboard returns to the
  Project List for the category from which the project was opened. This is
  its originating navigation context, not the project's current status.
- **Gateway labels:** the Gateway gate names reflect Kurt's decision of
  2026-11-12; they are not an ACP. Project names are resolved through the
  ProjectRecord provider, with the project ID used as fallback when a name
  cannot be resolved. This implementation is included in commit `018a8ac`.

### Current automated-test coverage

The following mapping reflects the canonical implementation and tests at
commit `018a8ac`. These are current coverage references, not a claim that
Slice 9B itself was executed.

| Original protocol case | Current disposition |
|---|---|
| Initial navigation state | Covered by current test for Gateway depth and no selected object: `navigation-controller.test.ts:36` |
| Category selection, cases 2.1–2.2 | Covered: `navigation-controller.test.ts:45, 54` |
| Category sibling paging and retired `completed` status, cases 2.3–2.8 | Superseded by ACP-009 and ACP-010; current no-category-sibling-paging behavior is covered at `navigation-controller.test.ts:131` |
| Project selection, case 3.2 | Covered: `navigation-controller.test.ts:68` |
| Paging when no sibling exists, cases 3.3–3.4 | Covered: `navigation-controller.test.ts:139, 152` |
| Dashboard Up, cases 3.5 and related ACP-017 behavior | Superseded by ACP-017; current behavior is covered at `navigation-controller.test.ts:177–237, 325–332` |
| Invalid project selection, cases 4.1 and 4.3 | Covered: `navigation-controller.test.ts:78, 83` |
| Top navigation reset, case 4.2 | Covered: `navigation-controller.test.ts:252, 260` |
| Up with no selected object, case 4.4 | Covered: `navigation-controller.test.ts:164` |
| Paging no-ops with no selected object, cases 4.5–4.6 | Covered: `navigation-controller.test.ts:108, 115, 122` |
| Orientation labels and resolved project names | Covered by current orientation-bar tests in `orientation-bar.test.ts` |
| Section 5.1 — no hidden automatic rendering | No automated test equivalent identified; structural inspection only |
| Section 5.2 — orientation bar renders before inspector | No automated test equivalent identified; source order is visible in `command-center-view.ts:196–201`. The inspector is hidden by default. |

The two Section 5 rendering checks above remain explicitly uncovered by
automated tests. Their omission is not represented as a pass.

### Future Workspace acceptance obligation

The original Section 6 Workspace-to-Dashboard Up scenario remains a future
acceptance obligation:

**Project List → Dashboard → Workspace → Up → same Dashboard**

This behavior is not verified by application execution. Only the
`resolveUp` unit-level behavior is currently covered. The end-to-end scenario
becomes executable when the Workspace-entry action is implemented.

Kurt accepts this as a known future Workspace acceptance obligation under the
original protocol's known-gap disposition. It is to be recorded in the Master
Implementation Index under Project Workspace. It is not an outstanding WP12
implementation task or a reason to keep WP12 open.

---

# WP12 Step 5 — Slice 9B: Framework Verification Protocol

Verifies `NavigationController`'s transition logic directly, bypassing the UI's current reach limitation. This does **not** test WP13+ screens — no such screens exist. Its purpose is narrower and prior to that: proving the framework those future screens will be built on is itself correct.

**Harness assumption:** a temporary developer harness (console access, debugger, or an exposed reference) can invoke `selectCategory()`, `selectProject()`, `pagePrevious()`, `pageNext()`, `goUp()`, `goTop()` directly on the active `NavigationController` instance, and can trigger `orientationBar.render()` / `navigationInspector.render()` afterward to observe the result (since these methods, when called outside the normal click-handler path, do not automatically trigger `onStateChange` — that coordination only exists inside `OrientationBarComponent`'s click handlers). This protocol assumes such a harness exists; it does not define how to build one, per the no-code constraint.

**Sequential protocol, not independent tests:** state carries over from step to step within each section. Execute in order within a section; do not skip or reorder.

---

## 1. Setup

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 1.1 | Open Command Center via the normal command (establishes a fresh `NavigationController` at initial state). | Initial state confirmed: `object: null, depth: "category"`. | Any other starting state. |
| 1.2 | Confirm harness access to the controller and both components' `render()` methods. | Harness can call all six controller methods and both render methods. | Harness cannot reach one or more of these. |

---

## 2. Category-Object Transitions

| # | Action | Expected Navigation State | Expected Availability | Expected Bar Label | Pass/Fail |
|---|---|---|---|---|---|
| 2.1 | `selectCategory("possible")` | `{object:{kind:"category",category:"possible"}, depth:"list"}` | `{canPagePrevious:false, canPageNext:true, canGoUp:false}` | `Command Center: possible` | |
| 2.2 | `selectCategory("current")` (switch, not page) | `{object:{kind:"category",category:"current"}, depth:"list"}` | `{canPagePrevious:true, canPageNext:true, canGoUp:false}` | `Command Center: current` | |
| 2.3 | `pageNext()` | `{object:{kind:"category",category:"completed"}, depth:"list"}` (depth unchanged) | `{canPagePrevious:true, canPageNext:false, canGoUp:false}` | `Command Center: completed` | |
| 2.4 | `pageNext()` again (already last) | Unchanged from 2.3 — no-op | Unchanged from 2.3 | Unchanged from 2.3 | |
| 2.5 | `pagePrevious()` | `{object:{category:"current"}, depth:"list"}` | `{canPagePrevious:true, canPageNext:true, canGoUp:false}` | `Command Center: current` | |
| 2.6 | `pagePrevious()` | `{object:{category:"planned"}, depth:"list"}` | `{canPagePrevious:true, canPageNext:true, canGoUp:false}` | `Command Center: planned` | |
| 2.7 | `pagePrevious()` | `{object:{category:"possible"}, depth:"list"}` | `{canPagePrevious:false, canPageNext:true, canGoUp:false}` | `Command Center: possible` | |
| 2.8 | `pagePrevious()` again (already first) | Unchanged from 2.7 — no-op | Unchanged from 2.7 | Unchanged from 2.7 | |

**After every row:** trigger both `render()` calls; confirm the Orientation Bar's rendered label and disabled states match the table, and confirm the Inspector's displayed content matches the stated Navigation State/Availability exactly (field-by-field, not approximately).

---

## 3. Project-Object Transitions

*(Annotation per ACP-017, accepted 2026-11-11: rows in this section that record `canGoUp: false`, or `goUp()` as a no-op, for a project at `dashboard` depth reflect the rule before ACP-017. Under ACP-017, `canGoUp` is true at `dashboard` depth and `goUp()` moves to the Project List of the category the project was opened from. The original rows are preserved as the historical record; expect the ACP-017 behavior if this protocol is executed today.)*

Continuing from 2.7's state (`object: {category:"possible"}, depth:"list"`) — first switch to a category with a stable ordering assumption for this test:

| # | Action | Expected Navigation State | Expected Availability | Expected Bar Label | Pass/Fail |
|---|---|---|---|---|---|
| 3.1 | `selectCategory("current")` | `{object:{category:"current"}, depth:"list"}` | `{canPagePrevious:true, canPageNext:true, canGoUp:false}` | `Command Center: current` | |
| 3.2 | `selectProject("test-project-1")` | `{object:{kind:"project", project_id:"test-project-1", category:"current"}, depth:"dashboard"}` | `{canPagePrevious:false, canPageNext:false, canGoUp:false}` | `Command Center: current: test-project-1` (project_id used as label text — see note below) | |
| 3.3 | `pageNext()` | Unchanged from 3.2 — no-op (stub `ProjectRecordProvider` returns no records, so no sibling exists) | Unchanged from 3.2 | Unchanged from 3.2 | |
| 3.4 | `pagePrevious()` | Unchanged from 3.2 — no-op, same reason | Unchanged from 3.2 | Unchanged from 3.2 | |
| 3.5 | `goUp()` | Unchanged from 3.2 — no-op (disabled: object is a project, but depth is `"dashboard"`, not `"workspace"`) | Unchanged from 3.2 | Unchanged from 3.2 | |

**Note on 3.2's label:** `OrientationBarComponent`'s current placeholder behavior uses `project_id` as a stand-in `projectName`, since no real `ProjectRecord` name source is wired yet (flagged since Slice 4). The label will read the raw ID, not a human-readable name — this is expected, not a defect, for this build.

---

## 4. Contract-Violation Verification

These steps deliberately trigger documented failure/no-op contracts. **A thrown error or no-op, as specified, is the pass condition** — do not mistake the expected throw for a bug.

| # | Action (continuing from 3.2's state) | Expected result | Pass/Fail |
|---|---|---|---|
| 4.1 | `selectProject("test-project-2")` while already at a project object | Throws — `selectProject` requires the current object to be a category. | |
| 4.2 | `goTop()` | Resets to `{object:null, depth:"category"}`, regardless of prior depth. Label: `Command Center: Projects`. Availability: all `false`. | |
| 4.3 | `selectProject("test-project-3")` immediately after 4.2 (object is `null`) | Throws — same contract as 4.1, different cause (no category selected at all, not "already a project"). | |
| 4.4 | `goUp()` immediately after 4.2 (object is `null`) | Throws — distinct from 3.5's no-op. `goUp()` throws specifically when `object` is `null` (treated as inconsistent state); it no-ops only when `object` exists but the position is legitimately disabled. | |
| 4.5 | `pageNext()` immediately after 4.2 (object is `null`) | No-op, does **not** throw — confirms this is deliberately different from 4.4's throw, per the approved Slice 3 contract split. | |
| 4.6 | `pagePrevious()` immediately after 4.2 (object is `null`) | Same as 4.5 — no-op, no throw. | |

**This section is the most important one in this protocol.** Rows 4.4–4.6 verify a subtle, deliberately-designed distinction: the same underlying condition (`object: null`) produces a *throw* for `goUp()` but a *silent no-op* for `pageNext`/`pagePrevious`. If any of these three rows doesn't match its expected behavior, that is a genuine framework defect, not a minor inconsistency.

---

## 5. Rendering Propagation Verification

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 5.1 | After any transition in Sections 2–4, confirm both `render()` calls were needed to see the update (i.e., the UI does not update from the controller call alone). | UI remains stale until both `render()` calls are triggered — confirms no hidden auto-render/observer exists anywhere in the framework. | UI updates without an explicit `render()` call — would indicate an undocumented observer mechanism exists, contradicting the frozen "no event bus/observer" design. |
| 5.2 | Confirm render order: Orientation Bar always updates before the Inspector. | Bar's new label/disabled-states are visibly settled before the Inspector's dump changes (may require slow/manual triggering to observe distinctly). | Any observed case of Inspector updating first, or the two visibly diverging. |

---

## 6. Known Unresolved Verification Gap

*(Annotation per ACP-017, accepted 2026-11-11: the Dashboard → Project List path of `Up` is now reachable through the controller and is covered by automated controller tests. The gap described below applies to the Workspace → Dashboard step only, which remains unreachable until a Workspace-entry action exists.)*

**`goUp()`'s *enabled* success path — a project object at `depth: "workspace"`, transitioning to `depth: "dashboard"` — cannot be verified by this protocol, even with full harness/console access.**

No `NavigationController` action method, in the current implementation (Slices 1–8B), ever sets `depth` to `"workspace"`. `selectCategory` → `"list"`; `selectProject` → `"dashboard"`; `pageNext`/`pagePrevious` leave depth unchanged; `goUp`/`goTop` only ever move toward shallower depths. There is no "enter Workspace" action anywhere in the framework yet — that arrives with a future work package. `depth` itself is a private field with no setter beyond the action methods' internal logic, so even direct harness manipulation would require modifying the class, which is out of scope for a verification protocol.

**This gap was first flagged during Slice 3's own test-writing** (the original `navigation-controller.test.ts` contains a documented, honest limitation on this exact point) and resurfaces here at the manual-verification level for the same underlying reason. It is not new information — but it is worth restating plainly rather than letting this protocol imply full coverage it cannot actually provide.

**Disposition:** this is not a defect in Slices 1–8B — `goUp`'s disabled-path behavior (Section 3, row 3.5, and Section 4) is fully verified, and the enabled path's *logic* is covered by `orientation.ts`'s own automated unit tests (Step 3, `resolveUp`). What remains unverified specifically is the *integration* of that enabled path through `NavigationController` end-to-end, because nothing in the current framework can reach the precondition. **Recommend:** either accept this as a known, documented gap to be closed naturally once a future work package adds a Workspace-entry action (at which point this exact scenario becomes trivially testable), or explicitly authorize a minimal, temporary test-only method on `NavigationController` for this protocol's purposes — a decision for you, not assumed here.

---

## 7. Failure Conditions

Any of the following is an automatic overall failure:

- Any table row in Sections 2–5 not matching its stated expected result.
- Any of rows 4.1–4.4 failing to throw when specified.
- Any of rows 4.5–4.6 throwing when a no-op was specified.
- Any UI update occurring without an explicit `render()` trigger (Section 5.1).
- Render order violated (Section 5.2).
- Any console error not accounted for by an intentional throw (Section 4).

**Expected, NOT a failure:** the Section 6 gap itself — it is a documented scope limit of this protocol, not a failure of any row within it.

---

## Completion Criteria

Slice 9B is complete if and only if:

1. Every row in Sections 2–5 shows Pass.
2. Section 4's throw/no-op distinctions (rows 4.1–4.6) all match exactly — this is the single most load-bearing verification in this document.
3. Zero occurrences of any Section 7 failure condition.
4. Section 6's gap is explicitly acknowledged and a disposition (accept-as-known-gap vs. authorize-temporary-test-method) has been recorded — not silently left unaddressed.

**The Baseline Freeze requires both Slice 9A and Slice 9B to pass**, with Slice 9B's Section 6 gap either accepted explicitly or resolved before the freeze is approved — whichever you decide, it must be a recorded decision, not an omission.
