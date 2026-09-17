---
type: implementation-specification
phase: 4
work_package: WP14 — Obsidian ProjectRecordProvider
status: approved — final specification
date: 2026-09-16
decision_authority: Kurt
governs: the real Obsidian-backed ProjectRecordProvider, replacing the current stub
depends_on:
  - src/data/project-record.ts (WP11)
  - docs/architecture/ACP-008_Proposal_Status_Enum_Reconciliation.md
  - docs/architecture/ACP-009_ProjectStatus_Enum_Reconciliation.md
  - docs/architecture/WP13_Phase_4_Architectural_Decision_Record.md (Option B — composition-root injection)
  - docs/indexes/CC_Phase 4_Master Implementation Index.md
---

# WP14 — Obsidian ProjectRecordProvider

## Purpose

Implement the real Obsidian-backed `ProjectRecordProvider` defined by the existing Command Center architecture.

WP14 establishes the boundary between the host-independent ProjectRecord/data model and the Obsidian vault in which the current Command Center implementation runs.

The provider reads project records from the Obsidian vault and exposes them through the existing `ProjectRecordProvider` contract.

WP14 does not redefine ProjectRecord, navigation behavior, project status, or view responsibilities.

---

## 1. Architectural Boundary

The established architecture separates:

- `ProjectRecord` data and validation
- `ProjectRecordProvider` data access
- navigation state and behavior
- view rendering
- host-specific integration

WP14 implements the host-specific portion only.

```text
Obsidian Vault
      ↓
Obsidian ProjectRecordProvider
      ↓
ProjectRecord[]
      ↓
NavigationController / ProjectListView
```

The provider may depend on Obsidian APIs.

The ProjectRecord model, validator, NavigationController, and ProjectListView must remain independent of Obsidian.

The existing composition-root pattern remains in force: `CommandCenterView` wires the provider into the components that require ProjectRecord access.

---

## 2. Repository Location

The Obsidian implementation belongs under:

```text
src/integration/
```

with the provider implementation:

```text
src/integration/obsidian-project-record-provider.ts
```

This location reflects existing project terminology. `src/data/project-record.ts` already describes the future Obsidian Vault/FileManager responsibility as the project's integration layer.

`src/adapters/` is not an established Command Center convention and is therefore not introduced.

The term `Connector` is also not used for this boundary. Established Connector terminology refers to optional external systems and their connection lifecycle, which is a different architectural concept from the host in which Command Center currently runs.

---

## 3. Provider Dependencies

The provider receives only the Obsidian services required for project discovery and metadata access:

```text
Vault
MetadataCache
```

The intended construction shape is:

```text
new ObsidianProjectRecordProvider(vault, metadataCache)
```

The provider does not receive the entire Obsidian `App` unless a concrete implementation requirement later demonstrates that this is necessary.

This keeps the dependency boundary narrow and makes the provider straightforward to test with simple test doubles.

---

## 4. Candidate Discovery

A Markdown file is a ProjectRecord candidate if and only if its frontmatter contains the `project_id` key.

No folder name, filename, path, or other location-based convention determines candidate status.

Therefore:

```text
project_id present → candidate
project_id absent  → not a candidate
```

This rule applies regardless of where the Markdown file exists in the vault.

This prevents physical vault organization from becoming a hidden implementation of ProjectStatus.

---

## 5. Frontmatter Mapping

For every candidate, the provider maps the canonical ProjectRecord fields directly from frontmatter.

The provider does not:

- invent missing values
- supply defaults
- infer values from folders
- infer values from filenames
- silently repair malformed values
- create alternative ProjectRecord fields

Extra frontmatter that is not part of the canonical ProjectRecord is ignored by the provider.

Missing or malformed canonical fields are handled by validation.

---

## 6. Validation

Every discovered candidate is passed through the existing canonical ProjectRecord validator.

The provider does not duplicate or redefine ProjectRecord validation rules.

The validator remains the single source of truth for ProjectRecord validity.

The provider therefore performs:

```text
discover
  ↓
construct candidate
  ↓
validate
  ↓
valid → include
invalid → diagnose and exclude
```

---

## 7. Invalid Candidates

An invalid candidate must not prevent valid projects from being returned.

If one candidate fails validation:

1. identify the candidate/file,
2. record a diagnostic containing the validation failure,
3. exclude that candidate,
4. continue processing the remaining candidates.

A vault containing:

```text
valid project
invalid project
valid project
```

must still produce the two valid ProjectRecords.

The provider must not silently repair invalid data.

For WP14, diagnostics remain an adapter/integration concern rather than becoming part of the host-independent ProjectRecord or navigation contracts.

The initial diagnostic mechanism is `console.warn()`.

No new UI error/Notice system is introduced by WP14.

---

## 8. Duplicate Project IDs

`project_id` is treated as the unique identity of a ProjectRecord.

If multiple candidate files contain the same `project_id`:

- the collision is diagnosed,
- every candidate involved in that duplicate ID is excluded,
- unrelated valid projects continue to load.

The provider must not arbitrarily select one file based on:

- filename,
- folder,
- Obsidian enumeration order,
- modification time,
- or any other incidental ordering.

This preserves deterministic behavior and prevents ambiguous project identity from being silently resolved.

---

## 9. Deterministic Ordering

The provider returns valid ProjectRecords in lexicographic order by `project_id`.

Ordering must not depend on:

- Obsidian's Markdown file enumeration order,
- folder order,
- filename order,
- file modification time,
- discovery timing,
- or any other incidental filesystem/vault property.

This preserves deterministic project sibling behavior already expected by the navigation layer.

---

## 10. Provider Contract

The public provider result remains:

```text
readonly ProjectRecord[]
```

WP14 does not introduce a second ProjectRecord query abstraction or a new coordinator/service.

The existing `ProjectRecordProvider` contract remains the boundary between ProjectRecord consumers and the underlying data source.

---

## 11. Freshness

The provider must not maintain a Command Center-owned application cache.

Each provider read discovers and maps the current vault metadata state exposed by Obsidian's platform read mechanism; the provider must not return a previously stored provider result. Any in-memory objects produced during that read are implementation details and are not an additional authoritative data store.

This follows directly from ACP-008: Obsidian's Metadata Cache is the platform-level read mechanism, and Command Center does not introduce a second, competing cache on top of it. A stale CC-owned store that could drift from the vault's actual current state would violate that principle even if every other section of this specification were satisfied.

---

## 12. Write Boundary

WP14 is read-only.

The provider does not:

- create project files,
- modify project files,
- change ProjectStatus,
- archive projects,
- create projects,
- update frontmatter,
- navigate,
- render UI,
- manage Dashboard or Workspace state.

Project creation and project mutation remain separate concerns.

---

## 13. Composition

`CommandCenterView` remains the composition point for wiring the real provider.

The intended integration is:

```text
CommandCenterView
      ↓
ObsidianProjectRecordProvider
      ↓
NavigationController / ProjectListView
```

Existing consumers continue to use the established provider contract.

WP14 should not require changes to the ProjectRecord domain model or to the fundamental NavigationController/View contracts.

---

## 14. Expected Change Surface

Expected implementation files:

```text
src/integration/obsidian-project-record-provider.ts
tests/integration/obsidian-project-record-provider.test.ts
```

and the existing composition point:

```text
src/navigation/command-center-view.ts
```

The following should remain unchanged unless implementation evidence proves otherwise:

```text
src/data/project-record.ts
src/navigation/navigation-controller.ts
src/views/project-list-view.ts
src/main.ts
```

No new ProjectRecord service, repository abstraction, navigation abstraction, or UI error framework is introduced.

---

## 15. Test Boundary

WP14 tests the integration boundary rather than duplicating the ProjectRecord validator's own test suite.

Tests must cover at minimum:

- candidate discovery by `project_id` presence,
- frontmatter-to-ProjectRecord mapping,
- delegation to canonical validation,
- exclusion of invalid candidates,
- continued loading after an invalid candidate,
- diagnostic emission,
- duplicate `project_id` detection,
- exclusion of all duplicate candidates,
- continued loading of unrelated valid projects,
- deterministic `project_id` ordering,
- read-only behavior / absence of writes,
- absence of a Command Center-owned cache — repeated reads reflect the current vault state rather than a stored prior result.

Tests should use simple dependency doubles for `Vault` and `MetadataCache`.

No new testing library or testing abstraction is required.

---

## 16. Explicit Non-Goals

WP14 does not:

- redesign the ProjectRecord architecture,
- redesign ProjectStatus,
- redesign navigation,
- implement Project Dashboard,
- implement Project Workspace,
- implement the full New Project workflow,
- implement pre-formal Ideas,
- implement AI observation,
- introduce external Connectors,
- introduce a generic adapter framework,
- introduce a new ProjectRecord coordinator/service,
- solve cross-platform UI portability,
- change the existing UI architecture boundaries.

The purpose of WP14 is specifically to replace the existing ProjectRecord data stub with the real Obsidian-backed provider while preserving the established architecture.

---

## 17. Acceptance Criteria

WP14 is complete when:

1. The real Obsidian provider exists under `src/integration/`.
2. It implements the existing `ProjectRecordProvider` contract.
3. Candidate discovery uses only the presence of `project_id`.
4. ProjectRecord fields are mapped from canonical frontmatter without inference or repair.
5. The existing canonical validator remains the validation authority.
6. Invalid candidates are diagnosed and excluded without blocking valid candidates.
7. Duplicate ProjectRecord IDs are diagnosed and all conflicting candidates are excluded.
8. Valid results are returned deterministically sorted by `project_id`.
9. The provider maintains no Command Center-owned cache; each read reflects the current vault state.
10. The provider performs no project writes or navigation.
11. The composition root wires the provider without redefining the provider contract.
12. Integration tests verify the provider behavior and boundary, including the absence of a CC-owned cache.
13. Existing tests and TypeScript/build verification remain passing.

---

## 18. Architectural Authority

WP14 implements the already-established architecture.

Implementation details must not be used to redefine that architecture.

Where implementation encounters a genuine conflict with a frozen architectural decision, implementation stops and the conflict is surfaced for architectural resolution rather than silently redefining the boundary.
