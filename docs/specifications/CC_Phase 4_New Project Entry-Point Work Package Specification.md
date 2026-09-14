---
type: implementation-specification
phase: 4
work_package: New Project Entry Point
status: approved — final specification
date: 2026-09-14
approved_date: 2026-09-14
decision_authority: Kurt
governs: New Project entry-point shell only (entry, view mounting, Cancel, honest-failure Submit, initial-status selection)
depends_on:
  - docs/architecture/ACP-009_ProjectStatus_Enum_Reconciliation.md
  - docs/architecture/ACP-011 — Gateway Destination-to-View Mapping and Category Screen Retirement Boundary.md
  - docs/architecture/ACP-013 — New Project Representation and Navigation Lifecycle.md
  - docs/specifications/CC_Phase 4_Gateway Implementation Specification.md
---

# Command Center — Phase 4 New Project Entry-Point Work Package

## 1. Purpose and authority

This work package turns ACP-013's accepted decision into a bounded implementation increment. It builds the New Project *shell* — how you enter it, what happens to the surrounding UI, how you leave it, and today's honest-failure Submit path. It does not design the project's intake fields, Type taxonomy, participants/resources, or any creation mechanics.

Binding authority, in order:

1. ACP-013 — New Project exists entirely outside `NavigationState`; no new `CurrentObject` kind or `Depth` value.
2. ACP-011 — New Project is a distinct workflow entry point; its internals remain out of scope.
3. ACP-009 — the five-value `ProjectStatus` vocabulary; `completed` remains invalid.
4. Gateway Implementation Specification — this work package is the "separately scoped work package" its Section 4 requires before Gateway's New Project destination is unblocked.

If implementation appears to require behavior contrary to these records, implementation must stop and raise the conflict. It must not silently add a `CurrentObject` kind, `Depth` value, status value, or navigation mechanism.

## 2. Current baseline

- `CurrentObject` has exactly two variants: `{ kind: "category" }`, `{ kind: "project" }`.
- `NavigationController`'s only transitions: `selectCategory`, `selectProject`, `pageNext`, `pagePrevious`, `goUp`, `goTop`.
- `OrientationBarComponent` renders solely from `NavigationController.getState()`/`getAvailability()`; it has no awareness of anything outside `NavigationState`.
- `CommandCenterView` currently mounts Entry once, then permanently mounts the orientation bar plus Category/List views for the rest of the session via one render-coordination callback. It has no existing mechanism to temporarily suppress those mounted views and show something else in their place.
- `ProjectRecordProvider` is a stub returning no records. No real provider, and no record-write capability, exists.
- Gateway itself is not yet implemented (separate work package).

## 3. Required behavior

### 3.1 Entry
Gateway's New Project destination invokes this work package's entry point directly — a plain function/callback call, not a `NavigationController` transition. `NavigationState` is not read, constructed, or modified by this call.

### 3.2 View mounting/suppression (new capability)
`CommandCenterView` must gain a coordination capability that does not currently exist: temporarily hide the mounted orientation bar and whichever screen (Category/List) is currently showing, mount a New Project container in their place, and reverse that cleanly on exit. The underlying `NavigationController` instance and its state are untouched throughout — this is a pure view-layer swap, not a controller-level transition. This is new, required scope; it must not be assumed to already exist or be trivial to add.

### 3.3 New Project shell (structure only, no fields designed here)
The shell is a container that can hold form content, a `+`/`−` affordance region, and two actions: Cancel and Submit. This work package defines the container and its behavior — it does not define what fields, sections, or intake content the container holds. That remains explicitly deferred (see Section 6).

### 3.4 Extension point for future `+` / `−` behavior
The shell must provide an explicit extension point for the eventual intake content to support expandable/collapsible sections or items. This work package does not define the units being added or removed, their contents, or their data model. The actual `+`/`−` behavior for specific intake elements remains part of the separately scoped New Project intake design.

### 3.5 Cancel
Cancel discards whatever is in the shell and reverses the Section 3.2 view swap: the orientation bar and prior screen reappear exactly as they were. No `NavigationState` restoration logic is needed or permitted, since none occurred.

### 3.6 Submit — today's honest-failure path
Per ACP-013 §3.4/§3.7, there is no successful Submit path today. Submit must:
1. Perform whatever basic input validation the (not-yet-designed) fields require — out of scope for this work package to define, but the validation *hook* must exist.
2. Attempt to hand off to record creation.
3. Detect that no real `ProjectRecordProvider` exists and fail **visibly and honestly** — a clear, explicit message that project creation is not yet available, never a silent no-op, never a fabricated success, never a placeholder record.
4. Leave the shell open (not auto-Cancel) so the user doesn't lose entered content on a failed Submit.

### 3.7 Initial status selection
The shell must include a status selector offering exactly `possible`, `planned`, `current` — never `ongoing` or `archived`, and never `completed`. This selection is captured and held for the eventual successful path (Section 3.8) but has no effect today, since Submit cannot succeed yet.

### 3.8 Provider handoff boundary (not the provider's interface)
Submit must terminate at an explicit provider handoff boundary. The boundary must be designed so that a future real `ProjectRecordProvider` can be supplied without changing the New Project navigation lifecycle established by ACP-013. The provider's concrete interface, input schema, persistence mechanics, and resulting `ProjectRecord` construction are deferred to a separately scoped work package. Once that provider exists, the successful path is: create `ProjectRecord` → `NavigationController.selectCategory(chosenStatus)` → the matching status-filtered Project List. No Dashboard dependency.

## 4. Component and integration boundary

Expected production surface:
- One new New Project shell component under `src/views/`.
- `src/navigation/command-center-view.ts` — new suppression/restoration coordination logic (Section 3.2).
- **Integration contract only:** this work package exposes the approved entry point that Gateway will invoke. Gateway's own wiring to that entry point remains part of the Gateway work package, not this one.
- Narrowly necessary tests.

Out of scope unless a genuine conflict requires escalation: `orientation.ts`, `navigation-controller.ts`, `project-record.ts`'s actual schema, the real provider, Dashboard, Workspace, Category Screen.

## 5. Explicit exclusions

This work package does not implement:
- any intake field, Type taxonomy, participant/resource model, or template/seed/kernel selection (all remain deferred per ACP-013 §3.5 and the non-binding Intake/Data Model working note);
- the real `ProjectRecordProvider` or any record-write capability;
- Dashboard, Workspace, or any post-creation project experience;
- any change to `CurrentObject`, `Depth`, or `ProjectStatus`;
- Gateway itself (separate work package; this satisfies its §4 prerequisite but doesn't build it).

## 6. Verification requirements

Automated tests must demonstrate:
1. Entering New Project does not call any `NavigationController` method and does not alter its state.
2. The orientation bar is not rendered while the New Project shell is mounted.
3. Cancel restores the orientation bar and prior screen with `NavigationState` unchanged from before entry.
4. Submit, with no real provider present, never creates a `ProjectRecord`, never silently succeeds, and surfaces a visible failure message.
5. The status selector offers only `possible`, `planned`, `current`.
6. No new `CurrentObject.kind` or `Depth` value is introduced anywhere in the diff.

Manual Obsidian verification must confirm the visible Cancel/Submit behavior matches the above, and that repeated entry/exit (not just one cycle) works correctly — unlike Entry's one-time precedent.

## 7. Completion criteria

Complete when: implementation and tests meet Sections 3–6; build, strict type-check, and tests pass; independent review confirms no ACP-009/011/013 boundary violation; Kurt records acceptance. Completion satisfies Gateway Implementation Specification §4's prerequisite condition 1 but does not itself implement Gateway.

## 8. Handoff

The implementation prompt must include this specification, ACP-013, and ACP-011. It must state this is the New Project *shell* only — no intake fields, no real persistence, no Gateway implementation.
