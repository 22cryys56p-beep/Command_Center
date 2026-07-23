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
- **Git commit:** [pending]

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
- **Git commit:** [pending]
- **Known gap, not yet resolved:** `docs/architecture/` exists as an empty directory in the repository. The Phase 1 Assessment, Phase 2 UI Architecture Specification (v1.0), and Phase 3 Architecture Record have not yet been placed inside the actual repo — they exist only as separate deliverables outside it. Until this is done, the repository does not yet satisfy WP10's own requirement that documentation live alongside implementation. Flagged here so it is not lost; not an ACP (no architectural conflict — it's a pending action, not a decision to make).

---

## Dependency Graph (as of this index's last update)

```
WP10 (environment)
  └── WP11 (data layer)
        └── [not yet started] orientation element
              └── [not yet started] Category / List / Dashboard / Workspace screens
                    └── [not yet started] AI observation surface
```

Per WP10's development sequence, the next package in order is the persistent orientation element (governing Phase 3 Section C), followed by the four screens in their existing dependency order (Category → List → Dashboard → Workspace), with the AI observation surface last.

---

## ACP Registry (Phase 4 portion — continues Phase 3's numbering)

| ACP | Raised in | Status | Resolution |
|---|---|---|---|
| ACP-008 | WP10 | Resolved — Accepted | Obsidian's Metadata Cache treated as platform-level read mechanism, not an application-level cache; Phase 3's "never cached" rule governs Command Center's own behavior only. |

*(ACP-001 through ACP-007 belong to Phase 3 and are recorded in full in the Phase 3 Architecture Record's own registry — not duplicated here to avoid two sources of truth for the same resolutions. This table only tracks ACPs raised during Phase 4 implementation work.)*

---

## Outstanding Items (not ACPs — pending actions)

- **`docs/architecture/` is empty in the actual repository.** Phase 1–3 documents need to be added before the repo fully satisfies WP10's "documentation alongside implementation" requirement. (Raised at WP11.)

---

## How to Use This Index

Before starting any new work package: read this index top to bottom, confirm the dependency graph shows your target WP's prerequisites as Closed, then read the specific Phase 3 section(s) your WP governs before writing anything. After closing a work package: add an entry here following the same format (Purpose / Governing Sections / Files Created / ACPs Referenced / Dependencies / Status), update the dependency graph, and add any new ACPs to the registry above.

This index does not restate Phase 3 or WP10's content — it points to where each decision lives and confirms what has actually been built against it. If this index and the underlying files ever disagree, the files are authoritative; that disagreement itself should be corrected here, not treated as a reason to trust this index over the actual repository state.
