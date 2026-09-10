---
type: master-index
phase: 4
status: living document — updated as each new WP closes
date: 2026-07-23
read_this_first: true
---

# Phase 4 — Master Implementation Index

**This is the first document any collaborator — human or AI — should read before beginning or continuing any Phase 4 work package.** It is the table of contents for all implementation work: what exists, what governs it, what depends on what, and what is still open.

**Governing documents, in order of authority:**
1. `docs/architecture/Phase 3 - Architecture Record.md` — the frozen architectural contract. No decision here is reopened during implementation except via a new ACP.
2. `Phase 4 - WP10 Implementation Foundation Specification.md` — the approved environment (Obsidian plugin, TypeScript, no framework, file-based storage) all implementation work builds within.
3. This index — tracks what has actually been built against those two documents.

**Rule inherited from Phase 3, unchanged in Phase 4:** any implementation-discovered conflict with a frozen decision is raised as a new ACP, never silently resolved. ACP numbering is continuous across Phase 3 and Phase 4 (Phase 3 closed at ACP-007; Phase 4 begins at ACP-008).

---

## Work Package Log

### WP10 — Implementation Foundation

- **Purpose:** define the implementation environment (target platform, technology stack, repository structure, data persistence strategy, development workflow) required to build the frozen Phase 3 architecture. Establishes environment, not application content.
- **Governing Phase 3 sections:** all of Phase 3 (this WP defines *how* the whole record gets built, not one section of it).
- **Files created:** `Phase 4 - WP10 Implementation Foundation Specification.md` (specification document only; no source files — this WP predates any code).
- **ACPs referenced:** ACP-008 (Metadata Cache timing vs. the "never cached" derivation rule) — raised and resolved within this WP.
- **Dependencies:** none upstream (first Phase 4 package). Everything else in Phase 4 depends on this WP's environment decisions.
- **Status:** Closed — approved and frozen.
- **Integrated commit (human repository integration):** ecf36b1

### WP11 — Project Record Data Layer

- **Purpose:** implement the `ProjectRecord` type and its tiered validation rules — the data layer every screen and the AI observation surface will eventually read from. First item in WP10's defined dependency order.
- **Governing Phase 3 sections:** Section B (Final Data Model) in full; also implements the ACP-003 extension (`last_updated` required from `planned` onward) and the ACP-002 stable-identity requirement (`project_id`).
- **Files created:**
  - `src/data/project-record.ts` — `ProjectRecord` type, `ProjectStatus`/`ProgressValue` enums, `validateProjectRecord()`, `hasNoBlockers()`
  - `tests/data/project-record.test.ts` — 26 tests, covering every tier boundary and field rule
  - Repository infrastructure (not tied to this WP specifically, but introduced alongside it): `package.json`, `package-lock.json`, `tsconfig.json`, `manifest.json`, `esbuild.config.mjs`, `.gitignore`, `README.md`
- **ACPs referenced:** none raised. No new decision was required — every validation rule traces directly to an existing Section B rule.
- **Dependencies:** WP10 (environment/stack decisions). Depended on by: every future WP that reads or writes a Project Record (WP12 orientation element's data-driven paging, WP13–16 screens, and the AI observation surface).
- **Status:** Closed. Verified — 26/26 tests passing, `tsc --noEmit --strict` clean, both confirmed by actual execution, not asserted.
- **Integrated commit (human repository integration):** 48b6413
- **Documentation status:** `docs/architecture/` now contains the Phase 1 Assessment, Phase 3 Architecture Record, and Phase 2 UI Architecture Specification (v1.0), along with Phase 4 ACP decision records (ACP-009 through ACP-012). WP10's requirement that documentation live alongside implementation is satisfied.

### WP12 — Persistent Orientation Element

- **Purpose:** implement the persistent orientation element defined by Phase 3 Section C — sibling-resolution and object-based paging logic, `Up`/`Top` availability and destination logic, center label content resolution, and the Obsidian-runtime rendering, interaction, and coordination layer (Step 5, delivered as Slices 1–8B).
- **Governing Phase 3 sections:** Section C (Final Navigation Model) in full; also implements ACP-004 (object-based paging, not screen-based) and ACP-007 (the `Up` component and Workspace→Dashboard behavior).
- **Files created:**
  - `src/navigation/orientation.ts` — `CATEGORY_ORDER`, `getCategorySiblings`, `getOrderedProjectIdsForCategory`, `getProjectSiblings`, `resolvePaging`, `resolveUp`, `resolveTop`, `resolveLabel`, and the `CurrentObject`/`NavigationDestination`/`Depth` types (Steps 1–4)
  - `src/navigation/navigation-controller.ts` — `NavigationController`, `NavigationState`, `NavigationAvailability`, `ProjectRecordProvider` (Slices 2–4)
  - `src/navigation/orientation-bar.ts` — `OrientationBarComponent` (Slices 4–5, coordination updated at Slice 7)
  - `src/navigation/navigation-inspector.ts` — `NavigationInspector`, a passive diagnostic view (Slice 6)
  - `src/navigation/command-center-view.ts` — `CommandCenterView`, `COMMAND_CENTER_VIEW_TYPE` (Slice 7)
  - `src/main.ts` — plugin scaffold, view registration, command/activation (Slices 1, 8A, 8B)
  - Corresponding test files: `tests/navigation/orientation.test.ts`, `tests/navigation/navigation-controller.test.ts`
  - Full per-step/per-slice breakdown, including individual commit hashes: `docs/implementation/CC_Phase 4_WP12 Implementation Notes.md`
- **ACPs referenced:** ACP-004 (withdrawn — corrected by the object-based paging rule), ACP-007 (accepted — added the `Up` component).
- **Dependencies:** WP10 (environment), WP11 (`ProjectRecord`/`ProjectStatus` types, read-only). Depended on by: Category and List screens (implemented), and Dashboard and Workspace screens (not yet started).
- **Status:** Code-complete through Slice 8B. **Not yet closed** — Slice 9A (user verification) is complete and passing. Slice 9B (framework verification) and the Baseline Freeze declaration have not yet been executed. Slice 9B carries one known, unresolved verification gap (`goUp()`'s enabled success path cannot be exercised by any means currently available — no controller action sets `depth` to `"workspace"`) requiring a disposition decision before the freeze can be honestly approved.
- **Integrated commits (human repository integration):** see `docs/implementation/CC_Phase 4_WP12 Implementation Notes.md` for the complete per-step/per-slice commit history (13 commits total, Step 1 through Slice 8B).

---

## Dependency Graph (as of this index's last update)

```
WP10 (environment)
  └── WP11 (data layer)
        └── WP12 (orientation element — code-complete, Slice 9A/9B and Baseline Freeze pending)
              └── Category / List screens (implemented) / Dashboard / Workspace screens (not yet started)
                    └── [not yet started] AI observation surface
```

WP12 is code-complete through Slice 8B but not yet closed — see its entry above. Per WP10's development sequence, the next package after WP12 formally closes is the four screens in their existing dependency order (Category → List → Dashboard → Workspace), with the AI observation surface last.

---

## ACP Registry (Phase 4 portion — continues Phase 3's numbering)

| ACP | Raised in | Status | Resolution |
|---|---|---|---|
| ACP-008 | WP10 | Resolved — Accepted | Obsidian's Metadata Cache treated as platform-level read mechanism, not an application-level cache; Phase 3's "never cached" rule governs Command Center's own behavior only. |
| ACP-009 | WP11 | Resolved — Accepted and Implemented | `ProjectRecord.status` is aligned with the Phase 4 five-value project-status vocabulary: `possible \| planned \| current \| ongoing \| archived`. The Phase 3 `completed` value is retired. No automatic migration is required; no existing `completed` project records were found. Phase 3's historical Architecture Record remains unchanged. Ongoing/Archived do not create a new mandatory metadata tier, and existing project information is preserved across status transitions. |
| ACP-010 | WP12 | Resolved — Accepted | Category-level sibling paging is retired after Gateway introduction. The six Gateway destinations form a fixed navigation grid, not an ordered sibling sequence. Project-level sibling paging remains valid at Dashboard and Workspace depth. |
| ACP-011 | WP13 | Resolved — Accepted | Establishes the Gateway destination-to-view mapping: Current, Planning, Ongoing, and Archive resolve through the existing Project List mechanism using their corresponding ProjectStatus values; Ideas exposes `possible`-status ProjectRecords through that mechanism while remaining capable of containing pre-formal Idea content that is not a ProjectRecord; New Project resolves to a distinct workflow entry point. Establishes the Category Screen retirement trigger: eligible once Gateway provides equivalent access to all four status-mapped views and Ideas exposes `possible`-status records per this ACP. |
| ACP-012 | WP13 | Resolved — Accepted | Renames the existing navigation root depth from `Depth: "category"` to `Depth: "gateway"`, reflecting Gateway's replacement of the former Category Screen as the root navigation surface. Pure semantic rename — no additional navigation depth introduced; `CurrentObject.kind: "category"` and all other frozen navigation/status decisions (ACP-009, ACP-010, ACP-011) remain unchanged. |

*(ACP-001 through ACP-007 belong to Phase 3 and are recorded in full in the Phase 3 Architecture Record's own registry — not duplicated here to avoid two sources of truth for the same resolutions. This table only tracks ACPs raised during Phase 4 implementation work. ACP-009's, ACP-010's, and ACP-011's full permanent decision records are maintained separately as `docs/architecture/ACP-009_ProjectStatus_Enum_Reconciliation.md`, `docs/architecture/ACP-010_Retire_Category_Level_Sibling_Paging_After_Gateway.md`, and `docs/architecture/ACP-011 — Gateway Destination-to-View Mapping and Category Screen Retirement Boundary.md` respectively.)*

---

## Outstanding Items (not ACPs — pending actions)

(None currently identified.)

---

## How to Use This Index

Before starting any new work package: read this index top to bottom, confirm the dependency graph shows your target WP's prerequisites as Closed, then read the specific Phase 3 section(s) your WP governs before writing anything. After closing a work package: add an entry here following the same format (Purpose / Governing Sections / Files Created / ACPs Referenced / Dependencies / Status), update the dependency graph, and add any new ACPs to the registry above.

This index does not restate Phase 3 or WP10's content — it points to where each decision lives and confirms what has actually been built against it. If this index and the underlying files ever disagree, the files are authoritative; that disagreement itself should be corrected here, not treated as a reason to trust this index over the actual repository state.
