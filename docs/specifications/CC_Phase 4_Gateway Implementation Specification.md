---
type: implementation-specification
phase: 4
work_package: Gateway
status: approved — final specification
date: 2026-09-12
approved_date: 2026-09-13
decision_authority: Kurt
governs: Gateway root-surface implementation only
depends_on:
  - docs/architecture/ACP-009_ProjectStatus_Enum_Reconciliation.md
  - docs/architecture/ACP-010_Retire_Category_Level_Sibling_Paging_After_Gateway.md
  - docs/architecture/ACP-011 — Gateway Destination-to-View Mapping and Category Screen Retirement Boundary.md
  - docs/architecture/ACP-012 — Rename Root Navigation Depth from Category to Gateway.md
---

# Command Center — Phase 4 Gateway Implementation Specification

## 1. Purpose and authority

This work package implements Command Center's Gateway root surface. It turns the accepted Gateway decisions into a bounded Obsidian-plugin increment; it does not add, reinterpret, or reopen architecture.

This specification is governed by ACP-009 (five-value `ProjectStatus`), ACP-010 (retired category-level sibling paging), ACP-011 (Gateway destination mapping and Category Screen retirement boundary), and ACP-012 (the object-less `gateway` root depth). If implementation appears to require behavior contrary to those decisions, it must stop and raise the conflict rather than add a status, depth, object kind, ordering, or data model.

## 2. Current baseline

The plugin currently has an Entry lifecycle screen; an object-less `gateway` root state; `Depth = "gateway" | "list" | "dashboard" | "workspace"`; category and project `CurrentObject` variants only; an existing status-filtered Project List transition (`selectCategory(status)`); a retained Category Screen; and a stub `ProjectRecordProvider`.

Gateway itself, a real provider, Dashboard, Workspace, pre-formal Ideas, and the New Project workflow are not implemented.

## 3. Required Gateway behavior

After the existing Entry action, Command Center presents Gateway at `{ object: null, depth: "gateway" }`. It presents exactly these destinations:

| Destination | Required result |
|---|---|
| Current | Existing Project List with `current` status. |
| Planning | Existing Project List with `planned` status. |
| Ideas | Existing Project List with `possible` status. |
| Ongoing | Existing Project List with `ongoing` status. |
| New Project | Transition to the distinct New Project workflow entry point required by ACP-011. |
| Archive | Existing Project List with `archived` status. |

For each status-backed destination, Gateway makes exactly one existing controller transition with the mapped `ProjectStatus`. It must not construct `NavigationState`, retrieve records, reproduce List filtering, or accept/emit `completed`.

Ideas is not a ProjectStatus. This increment provides the required route to `possible` ProjectRecords; it does not define or implement pre-formal-Idea storage, lifecycle, or rendering.

## 4. New Project prerequisite

ACP-011 requires New Project to transition to a distinct workflow entry point, while explicitly leaving its internal workflow outside Gateway scope. No such entry point exists in the current codebase.

Therefore, implementation may begin only after one of these conditions is met:

1. an approved New Project workflow entry point is supplied by a separately scoped work package; or
2. the approved Gateway implementation plan supplies a concrete, already-authorized integration target without defining the workflow internals.

Gateway must not substitute a disabled button, placeholder, modal, project-record creation, template selection, folder creation, or an invented workflow for that required destination. This is an implementation dependency, not a request to alter ACP-011.

## 5. Root-state and orientation constraints

- Gateway is the sole root state; no second root depth is permitted.
- `CurrentObject` remains limited to `category` and `project`; no `gateway` kind may be added.
- `Top` returns to the object-less Gateway root.
- `<<`, `>>`, and `Up` render visibly disabled at Gateway.
- At List depth, `{ kind: "category", category: ProjectStatus }` remains the scope identity and category-level `<<` / `>>` remain disabled.
- Project-level paging, Dashboard, and Workspace behavior are unchanged and outside this increment.

## 6. Component and integration boundary

Implementation should introduce one Gateway-specific view component, composed by `CommandCenterView` through the existing single render-coordination callback.

The Gateway component owns only rendering the six destinations and translating a destination click into the bounded transition described above. It does not own state, validation, record access, List rendering, direct navigation-resolver calls, Dashboard, Workspace, or New Project internals.

Expected production changes are limited to:

- one new Gateway view under `src/views/`;
- `src/navigation/command-center-view.ts` mounting and coordination changes;
- focused tests.

`orientation.ts`, `navigation-controller.ts`, `project-record.ts`, the provider boundary, and the existing Category Screen are out of scope unless an actual conflict requires escalation.

## 7. Category Screen boundary

This work package does not delete, rename, or alter `CategoryView` or `CATEGORY_ORDER`. They remain retained until a separate acceptance decision verifies ACP-011's retirement trigger: Gateway access to Current, Planning, Ongoing, and Archive through Project List, and Ideas access to `possible` ProjectRecords.

Gateway completion makes retirement eligible; it does not authorize retirement.

## 8. Verification requirements

Automated tests must establish that:

1. Gateway renders exactly the six accepted destinations.
2. Current, Planning, Ideas, Ongoing, and Archive invoke only their required status mappings.
3. Gateway is object-less at `gateway` depth and introduces neither another root depth nor `CurrentObject.kind: "gateway"`.
4. Category-level paging remains unavailable after all status-backed transitions.
5. Existing Category Screen behavior/tests remain intact.
6. New Project invokes only the approved integration target and has no project-record, template, filesystem, or unspecified workflow side effect.

## 9. Completion criteria

This work package is complete only when:

- implementation and tests meet Sections 3–8;
- build, strict type-check, and automated tests pass;
- the Gateway behavior is manually verified in Obsidian;
- an independent review confirms no ACP-009–012 boundary violation;
- human acceptance records this Gateway increment as complete.

Completion does not close WP12's remaining framework-verification work and does not itself authorize Category Screen retirement.

## 10. Handoff

The implementation prompt must include this specification and ACP-009 through ACP-012. It must state that the implementation is a Gateway increment only, with no source-of-truth, Dashboard, Workspace, pre-formal-Ideas, New-Project-workflow, or Category-retirement work.
