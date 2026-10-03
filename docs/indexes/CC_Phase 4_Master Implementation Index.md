---
type: master-index
phase: 4
status: living document — updated as each new WP closes
date: 2026-09-16
read_this_first: true
---

# Phase 4 — Master Implementation Index

**This is the first document any collaborator — human or AI — should read before beginning or continuing any Phase 4 work package.** It is the table of contents for all implementation work: what exists, what governs it, what depends on what, and what is still open.

**Current governing documents, in order of authority:**

1. Phase 3 Architecture Record (frozen historical record)
2. Phase 4 WP specifications
3. This Master Implementation Index (includes the Phase 4 ACP registry)
4. Implementation Notes
5. Clean revised Phase 4 Matrix, including Step 65 incorporations
6. UI Architecture Specification (living document, actively reconciled against the Matrix)
7. Accepted ACP standalone records (`docs/architecture/ACP-*.md`)

These are maintained consistently with `SESSION_START.md` Section 7.

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
- **Dependencies:** WP10 (environment/stack decisions). Depended on by: every future WP that reads or writes a Project Record (WP12 orientation element, WP13 Gateway and Project List implementation, and later Dashboard, Workspace, and AI observation work).
- **Status:** Closed. Verified — 26/26 tests passing, `tsc --noEmit --strict` clean, both confirmed by actual execution, not asserted.
- **Integrated commit (human repository integration):** 48b6413
- **Documentation status:** `docs/architecture/` contains the Phase 1 Assessment, Phase 3 Architecture Record, Phase 2 UI Architecture Specification (v1.0), and Phase 4 ACP decision records. WP10's requirement that documentation live alongside implementation is satisfied.

### WP12 — Persistent Orientation Element

- **Purpose:** implement the persistent orientation element defined by Phase 3 Section C — sibling-resolution and object-based paging logic, `Up`/`Top` availability and destination logic, center label content resolution, and the Obsidian-runtime rendering, interaction, and coordination layer (Step 5, delivered as Slices 1–8B).
- **Governing Phase 3 sections:** Section C (Final Navigation Model) in full; also implements ACP-004 (object-based paging, not screen-based) and ACP-007 (the `Up` component and Workspace→Dashboard behavior).
- **Files created:**
  - `src/navigation/orientation.ts` — current-object/project sibling paging, paging/up/top resolution, label resolution, and the `CurrentObject`/`NavigationDestination`/`Depth` types (Steps 1–4)
  - `src/navigation/navigation-controller.ts` — `NavigationController`, `NavigationState`, `NavigationAvailability`, `ProjectRecordProvider` (Slices 2–4)
  - `src/navigation/orientation-bar.ts` — `OrientationBarComponent` (Slices 4–5, coordination updated at Slice 7)
  - `src/navigation/navigation-inspector.ts` — `NavigationInspector`, a passive diagnostic view (Slice 6)
  - `src/navigation/command-center-view.ts` — `CommandCenterView`, `COMMAND_CENTER_VIEW_TYPE` (Slice 7)
  - `src/main.ts` — plugin scaffold, view registration, command/activation (Slices 1, 8A, 8B)
  - Corresponding test files: `tests/navigation/orientation.test.ts`, `tests/navigation/navigation-controller.test.ts`
  - Full per-step/per-slice breakdown, including individual commit hashes: `docs/implementation/CC_Phase 4_WP12 Implementation Notes.md`
- **ACPs referenced:** ACP-004 (withdrawn — corrected by the object-based paging rule), ACP-007 (accepted — added the `Up` component).
- **Dependencies:** WP10 (environment), WP11 (`ProjectRecord`/`ProjectStatus` types, read-only). Depended on by: WP13's Gateway-centered root navigation and Project List implementation.
- **Status:** Code-complete through Slice 8B. **Not yet closed** — Slice 9A (user verification) is complete and passing. Slice 9B (framework verification) and the Baseline Freeze declaration have not yet been executed. Slice 9B carries one known, unresolved verification gap (`goUp()`'s enabled success path cannot be exercised by any means currently available — no controller action sets `depth` to `"workspace"`) requiring a disposition decision before the freeze can be honestly approved.
- **Integrated commits (human repository integration):** see `docs/implementation/CC_Phase 4_WP12 Implementation Notes.md` for the complete per-step/per-slice commit history (13 commits total, Step 1 through Slice 8B).

### WP13 — Gateway Root Navigation and New Project Entry Point

- **Purpose:** establish Gateway as the authoritative Command Center root navigation surface, provide the six authoritative Gateway destinations, establish the New Project workflow entry point, and retire the former Category Screen once the ACP-011 retirement boundary was satisfied.
- **Governing architecture:** ACP-011, ACP-012, ACP-013, and the UI Architecture Specification's Entry → Gateway → Project List → Project Dashboard → Project Workspace hierarchy.
- **Files created / implemented:**
  - `src/views/gateway-view.ts` — Gateway root surface with the six authoritative destinations defined by ACP-011
  - `src/views/project-list-view.ts` — existing Project List mechanism used by the status-mapped Gateway destinations
  - `src/views/new-project-view.ts` — New Project workflow entry-point shell governed by ACP-013
  - `src/navigation/command-center-view.ts` — Gateway and Project List construction/mounting coordination
  - Category Screen implementation and test removed after the ACP-011 retirement trigger was satisfied
  - `docs/architecture/ACP-013 — New Project Representation and Navigation Lifecycle.md` — accepted New Project lifecycle decision record
- **ACPs referenced:** ACP-011, ACP-012, ACP-013.
- **Dependencies:** WP12 navigation foundation and WP11 Project Record/status model. Gateway uses the existing Project List mechanism rather than introducing a second status/navigation model.
- **Status:** Gateway root navigation and the New Project entry-point shell are implemented. Automated verification has passed. Full New Project workflow/content remains future work.
- **Integrated implementation commits:** Gateway `631ad97`; New Project entry point `849fc7a`; Category Screen retirement `12725f3`.

### WP14 — Obsidian ProjectRecordProvider

- **Purpose:** replace the stub `ProjectRecordProvider` with a real, read-only, Obsidian-backed implementation, and establish `purpose`/`description` as universal-tier `ProjectRecord` fields per ACP-014.
- **Governing architecture:** ACP-014, and Phase 3's `ProjectRecord` data model as extended by it.
- **Files created / implemented:**
  - `src/integration/obsidian-project-record-provider.ts` — real Obsidian frontmatter/MetadataCache-backed `ProjectRecordProvider`, with validation and duplicate-`project_id` exclusion
  - `src/data/project-record.ts` — `purpose`/`description` added as required universal-tier fields, validated by `validateProjectRecord()`
  - `docs/specifications/CC_Phase 4_WP14 Obsidian ProjectRecordProvider Specification.md` — governing specification
  - `docs/architecture/ACP-014 — Purpose and Description Metadata Representation.md` — accepted Purpose/Description metadata decision record
- **ACPs referenced:** ACP-014.
- **Dependencies:** WP11 `ProjectRecord` data model; WP13's Gateway and Project List, which consume this provider in place of the earlier stub. Depended on by: Project Dashboard, Project Workspace, and any future work reading live `ProjectRecord` data.
- **Status:** Implemented and verified on live `main`. `tsc --noEmit` clean; full test suite passing, including `project-record.test.ts` and `obsidian-project-record-provider.test.ts`.
- **Integrated implementation commits:** ACP-014 acceptance/implementation `19457a0`; provider implementation `606f954`.

### WP15 — Project Dashboard: ProjectRecord Resolution and Presentation

- **Purpose:** implement Dashboard's resolution of a requested `project_id` (Missing/Invalid/Duplicate, per ACP-016) and Dashboard's presentation of each condition. Scoped to this "Track A" only — AI Progress Estimate (ACP-015, "Track B") is a separate, still-unresolved Dashboard dependency, named but not specified by this work package.
- **Governing architecture:** ACP-016 (primary), Phase 3 Architecture Record Section D (Project Dashboard, WP5) and Section E (AI Observation Boundary, as an acceptance constraint, not altered).
- **Specification:** `docs/specifications/CC_Phase 4_WP15 Dashboard Implementation Specification.md` — accepted 2026-10-02, after four drafting rounds each independently reviewed against the live repository and ACP-016's text.
- **Proposed mechanism (per the specification, not yet implemented):** a new `resolveProjectRecord(project_id)` method on `ObsidianProjectRecordProvider`, required to reuse the existing `discoverCandidates()`/`excludeDuplicateIds()` private methods rather than re-implementing discovery or duplicate detection, and required to preserve the existing duplicate-before-validity ordering (an otherwise-valid candidate sharing an ID with an invalid one still resolves to `duplicate`, not `resolved`). `getProjectRecords()`'s existing contract and all its passing tests are unaffected.
- **ACPs referenced:** ACP-016 (implemented by this WP); ACP-015 (named as a related, non-blocking dependency — see the specification's `relates_to`).
- **Dependencies:** WP14's provider (extended, not replaced); WP11's already-exported `ValidationIssue`/`ValidationResult` types, confirmed suitable for this use without modification. Depended on by: the AI observation surface, if/when Section E's invalid-absence observation is implemented, since it will need the same diagnostic data this WP exposes.
- **Status:** Specification accepted. Implementation (the `resolveProjectRecord()` method, Dashboard's unresolved-state rendering, and the six acceptance tests the specification requires) has not yet begun.
- **Explicitly not yet decided:** visual layout, component structure, UI copy, and navigation/interaction behavior for the unresolved state (per ACP-016 §3.7/§3.8, deliberately left open); AI Progress Estimate's derivation (Track B, separate).

---

## Dependency Graph (current)

```text
WP10 — Implementation Foundation
  ↓
WP11 — Project Record Data Layer
  ↓
WP12 — Persistent Orientation Element
  ↓
WP13 — Gateway Root Navigation + New Project Entry Point
  ↓
WP14 — Obsidian ProjectRecordProvider
  ↓
Project List
  ↓
WP15 — Dashboard ProjectRecord Resolution and Presentation (spec accepted; implementation pending)
  ↓
Project Dashboard (remaining content, beyond WP15's scope)
  ↓
Project Workspace
  ↓
AI observation surface
```

WP12 remains code-complete through Slice 8B but not formally closed because Slice 9B and the Baseline Freeze disposition remain outstanding. That historical WP12 closure state does not block the already-implemented WP13 Gateway and New Project work.

WP13 establishes the Gateway/root-navigation layer and New Project entry point. WP14 replaces the stub provider consumed by that layer with a real, read-only Obsidian-backed provider. The full New Project workflow/content, Project Dashboard, Project Workspace, and AI observation surface remain downstream work.

**ACP-015**, accepted 2026-09-30, is an architecture-only decision (no work package, no code) and is not a node in this dependency graph. It governs a Dashboard/Workspace prerequisite: it is a named blocking dependency for any future Dashboard or Workspace work package that implements the "AI Progress Estimate" requirement, and it is tracked as such under Outstanding Items below rather than in this graph.

**ACP-016**, accepted 2026-10-01, is likewise an architecture-only decision (no work package, no code) and is not a node in this dependency graph. It governs a second, independent Dashboard prerequisite — the Missing/Invalid/Duplicate resolution taxonomy and its data-layer/presentation requirements — tracked under Outstanding Items below. ACP-015 and ACP-016 are both blocking dependencies for the same future Dashboard work package but resolve different questions; neither supersedes or depends on the other.

---

## ACP Registry (Phase 4 portion — continues Phase 3's numbering)

| ACP | Raised in | Status | Resolution |
|---|---|---|---|
| ACP-008 | WP10 | Resolved — Accepted | Obsidian's Metadata Cache treated as platform-level read mechanism, not an application-level cache; Phase 3's "never cached" rule governs Command Center's own behavior only. |
| ACP-009 | WP11 | Resolved — Accepted and Implemented | `ProjectRecord.status` is aligned with the Phase 4 five-value project-status vocabulary: `possible \| planned \| current \| ongoing \| archived`. The Phase 3 `completed` value is retired. No automatic migration is required; no existing `completed` project records were found. Phase 3's historical Architecture Record remains unchanged. Ongoing/Archived do not create a new mandatory metadata tier, and existing project information is preserved across status transitions. |
| ACP-010 | WP12 | Resolved — Accepted | Category-level sibling paging is retired after Gateway introduction. The six Gateway destinations form a fixed navigation grid, not an ordered sibling sequence. Project-level sibling paging remains valid at Dashboard and Workspace depth. |
| ACP-011 | WP13 | Resolved — Accepted | Establishes the Gateway destination-to-view mapping: Current, Planning, Ongoing, and Archive resolve through the existing Project List mechanism using their corresponding ProjectStatus values; Ideas exposes `possible`-status ProjectRecords through that mechanism while remaining capable of containing pre-formal Idea content that is not a ProjectRecord; New Project resolves to a distinct workflow entry point. Establishes the Category Screen retirement trigger: eligible once Gateway provides equivalent access to all four status-mapped views and Ideas exposes `possible`-status records per this ACP. |
| ACP-012 | WP13 | Resolved — Accepted | Renames the existing navigation root depth from `Depth: "category"` to `Depth: "gateway"`, reflecting Gateway's replacement of the former Category Screen as the root navigation surface. Pure semantic rename — no additional navigation depth introduced; `CurrentObject.kind: "category"` and all other frozen navigation/status decisions (ACP-009, ACP-010, ACP-011) remain unchanged. |
| ACP-013 | WP13 | Resolved — Accepted | Establishes the representation and navigation lifecycle of the New Project entry point. New Project is a distinct workflow entry rather than a ProjectStatus or `NavigationState` destination. The initial implementation provides the workflow entry-point shell; the complete New Project fields/content and submission behavior remain future work. |
| ACP-014 | WP14 | Resolved — Accepted and Implemented | Establishes `purpose` and `description` as universal-tier `ProjectRecord` fields, required at every status alongside `project_id`, `name`, `status`, and `focus`. Implementation (data model, validator, provider mapping, test fixtures) is complete and independently verified on live `main`. |
| ACP-015 | Dashboard/Workspace reconciliation (no WP; architecture-only) | Resolved — Accepted | Establishes "AI Progress Estimate" (required by P4-R323 for Workspace and P4-R802 for Dashboard) as a distinct, non-authoritative AI-output category — separate from Phase 3 Section E's two existing AI observation types (staleness, invalid absence) rather than an addition to them, and separate from the user-maintained `ProjectRecord.progress` field. Must be labeled as an estimate, must never become authoritative Project Status, must remain subordinate to observable indicators per Category 35's P4-R496–499, and must fail honestly rather than fabricate a value when available information is insufficient. Reconciles P4-R323/P4-R802 with Section E and with Category 35/18's previously unconnected AI-estimate safeguards. Deliberately leaves the exact derivation method and permitted inputs to the Dashboard/Workspace implementation specifications, which must define them explicitly and acceptance-testably before implementation begins. Phase 3 Section E's original wording has not yet been amended or annotated to reflect this ACP. |
| ACP-016 | Dashboard reconciliation (no WP; architecture-only) | Resolved — Accepted | Resolves P4-R797/P4-R798 (Dashboard presentation of a missing/invalid ProjectRecord), OPEN since before Step 65. Establishes a three-way resolution taxonomy for a requested `project_id` — Missing (no identifiable resource), Invalid (one resource, fails validity), Duplicate identity (more than one resource, a relational uniqueness failure distinct from either) — describing the underlying data condition, not merely Dashboard's ability to produce a record. Assigns resolution ownership to the provider/data layer; `CurrentObject` is unchanged and carries no resolution state; no historical/cause information is required by the resolution mechanism. Requires the data layer to expose per-`project_id` resolution condition plus sufficient diagnostic detail for Invalid and Duplicate (interface/mechanism not chosen). Requires Dashboard to present an honest, explicit unresolved state distinguishing all three conditions with condition-specific diagnostics (visual layout and interaction behavior not chosen). Confirms no amendment to Phase 3 Section E; identifies that Section E's existing invalid-absence observation capability is currently unimplementable under the provider's exclude-and-warn behavior, and makes unblocking it an explicit acceptance constraint on the eventual Dashboard implementation specification, alongside P4-R797/P4-R798 themselves. |

*(ACP-001 through ACP-007 belong to Phase 3 and are recorded in full in the Phase 3 Architecture Record's own registry — not duplicated here to avoid two sources of truth for the same resolutions. This table only tracks ACPs raised during Phase 4 implementation work. Full Phase 4 ACP decision records are maintained separately under `docs/architecture/ACP-*.md`.)*

---

## Outstanding Items (not ACPs — pending actions)

- **WP12 historical closure:** execute/dispose of Slice 9B and the Baseline Freeze declaration, including disposition of the known `goUp()` enabled-success-path verification gap. This is a historical WP12 closure item and does not block the implemented Gateway/New Project work.
- **New Project:** implement the complete workflow/content beyond the current ACP-013 entry-point shell.
- **Ideas:** define and implement the future pre-formal Ideas representation and its relationship to the existing `possible`-status Project List.
- **Project Dashboard:** WP15's specification (ACP-016's "Track A" — ProjectRecord resolution/presentation) is accepted; implementation has not yet begun. Remaining before Dashboard is fully implementation-ready: (a) WP15's own implementation and its six required acceptance tests; (b) visual layout, component structure, and navigation/interaction behavior, deliberately left open by ACP-016/WP15; (c) ACP-015's "Track B" — AI Progress Estimate's derivation method and inputs remain unresolved, likely requiring its own evidence-first decision process before it can be specified at all. Track A and Track B are independent; Track A does not wait on Track B.
- **Project Workspace:** implement the downstream workspace surface. Also subject to ACP-015's AI Progress Estimate definition requirement (P4-R323).
- **AI observation surface:** implement the downstream AI observation/collaboration surface.
- **Phase 3 Section E reconciliation:** Section E's original wording (staleness + invalid-absence as the only AI observation types) has not been amended or annotated to reflect ACP-015. Until it is, Section E read alone will appear to exclude the now-accepted "AI Progress Estimate" category. Per the historical-preservation rule below, this likely needs a current-state annotation pointing to ACP-015 rather than a rewrite of Section E's frozen historical text — but the annotation itself has not yet been done.

---

## How to Use This Index

Before starting any new work package: read this index top to bottom, confirm the dependency graph shows your target WP's prerequisites as Closed or otherwise explicitly available for the intended work, then read the specific Phase 3 section(s), Phase 4 specification(s), and accepted ACP record(s) your WP governs before writing anything.

After implementing a work package: update this index to reflect what actually exists, what the work package itself built, what it depends on, what now depends on it, and what remains open. Add any new ACPs to the registry above.

**Standing rule:** whenever a new ACP is accepted, update this index and `SESSION_START.md`'s ACP registry (Section 16) together, in the same pass as the ACP document itself — not as separate, later follow-ups. This index has twice fallen out of sync with an already-accepted, already-implemented decision (WP14/ACP-014, then again briefly with ACP-015) because the index update was treated as a deferred step rather than part of accepting the ACP.

**Historical preservation rule:** implementation history remains historical. Do not rewrite older Implementation Notes, the frozen Phase 3 Architecture Record, or other historical records merely to make them match the current architecture. Current-state reconciliation belongs in this index and in the appropriate current governing document. If a historical document contains a current implementation instruction that has become stale, correct that instruction only when its role requires it; do not rewrite historical facts.

This index does not restate Phase 3, WP specifications, ACP decision records, or the UI Architecture Specification — it points to where each decision lives and confirms what has actually been built against them. If this index and the underlying files ever disagree, the underlying authoritative files are authoritative; that disagreement itself should be corrected here, not treated as a reason to trust this index over the actual repository state.