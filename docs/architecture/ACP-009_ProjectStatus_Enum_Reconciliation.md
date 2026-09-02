---
type: architectural-decision-record
phase: 4
status: resolved — accepted and implemented
date: 2026-08-30
decision_authority: Kurt
governs: ProjectRecord.status and its alignment with the Phase 4 status vocabulary
extends: Phase 3 ProjectRecord.status enum only, as explicitly extended by this ACP
---

# ACP-009 — ProjectRecord.status: Reconcile Phase 3's Frozen Enum with the Phase 4 Matrix's Five-Value Vocabulary

## 1. Purpose

This ACP formally reconciles the `ProjectRecord.status` implementation with the five-value project-status vocabulary established by the Phase 4 Matrix.

The Phase 3 implementation froze `ProjectRecord.status` as:

`possible | planned | current | completed`

The Phase 4 Matrix established the working project-status vocabulary as:

`Possible | Planned | Current | Ongoing | Archived`

with **Completed explicitly not being a project status**.

This ACP extends the Phase 3 implementation decision so that the code-level `ProjectRecord.status` enum and the Phase 4 project-status vocabulary are aligned.

This ACP does not invalidate the Phase 3 architectural record. The Phase 3 record remains the historical record of the decision made at that time; this ACP is the later Phase 4 extension that resolves the previously open alignment question.

### 1.1 Documentation form

This ACP is intentionally recorded as a standalone permanent architectural decision record.

That is a deliberate documentation choice for this reconciliation because the decision crosses the Phase 3/Phase 4 boundary and formally records the resolution of an implementation-alignment question that was left open in Phase 3.

This does **not** establish a requirement that every future ACP must have its own standalone document. The Phase 4 ACP registry remains the authoritative index for ACP decisions.

## 2. Decision

`ProjectRecord.status` shall use exactly these five values:

```text
possible | planned | current | ongoing | archived
```

The `completed` value is retired.

The Phase 4 Matrix vocabulary and the code-level `ProjectRecord.status` enum are therefore aligned.

### Status meanings

| Status     | Meaning                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `possible` | Idea only                                                                                                 |
| `planned`  | Active architectural or structural work                                                                   |
| `current`  | Active implementation                                                                                     |
| `ongoing`  | Core work substantially complete; active dependent work ("tentacles") still requires occasional attention |
| `archived` | Genuinely finished; no remaining active concerns                                                          |

"Completed" is not a project status.

## 3. Migration

No automatic semantic migration is required.

Any existing record using `completed` would require manual reclassification by the Project Owner, with the resulting status determined according to the actual condition of the project.

A repository-wide search found **zero actual project records using `status: completed`**.

Therefore, no current data migration is required.

The retired `completed` value is removed from the implementation rather than retained as a compatibility alias.

## 4. Relationship to the Phase 3 Architecture Record

The Phase 3 Architecture Record remains historically accurate and is not rewritten.

Its record of the four-value enum reflects the decision that was frozen during Phase 3.

The unresolved question of whether `archived` should become an additional value is now resolved by this Phase 4 ACP.

Accordingly:

* Phase 3 remains the historical baseline.
* ACP-009 is the authoritative Phase 4 extension.
* The current implementation follows ACP-009.

No retroactive alteration of the Phase 3 architectural record is required.

## 5. Metadata and Validation Consequences

The addition of `ongoing` and `archived` does not create a new mandatory metadata tier.

The existing validation boundary remains:

```text
requiresPlannedTier = status === "planned" || status === "current"
```

Therefore:

### Planned / Current

The existing operational metadata rules remain in force.

`milestone`, `progress`, `next_action`, and `blockers` remain part of the Planned/Current validation tier.

In particular, `blockers` must be **present**, with a value of either `null` or an array. Missing/undefined `blockers` is not valid for Planned/Current records.

### Ongoing / Archived

The four operational fields are not required merely because the project is Ongoing or Archived.

`blockers` may genuinely be absent/undefined for Ongoing/Archived records.

The same applies to the other optional operational metadata.

This optionality is a validation rule only. It is **not** permission to clear, discard, or relocate metadata that already exists.

## 6. Preservation of Existing Project Information

Changing a project to `ongoing` or `archived` must not destroy or relocate project information.

Existing metadata may remain attached to the project record even when that metadata is no longer required by validation.

The distinction is:

* **Validation:** determines what metadata must be present for a given status.
* **Transition behavior:** determines what happens to existing project information when status changes.

An Ongoing or Archived transition therefore preserves existing information unless a separate, explicit architectural decision authorizes its removal.

How preserved historical metadata is presented in the Dashboard or Workspace is a separate presentation/design question and is not decided by this ACP.

## 7. Status Transitions and Identity

Status is metadata, not physical project location.

Changing status must preserve stable project identity.

In particular:

* Changing a project to Ongoing or Archived does not create a new project.
* The project retains its existing identity and history.
* Reactivation of an Ongoing or Archived project returns the existing project to an active status without requiring the New Project path.
* The Project Owner determines the resulting active status when reactivating a project.

These rules are consistent with the Phase 4 Matrix's status-transition and reactivation requirements.

## 8. Implementation Boundary

The implementation change is limited to the status-enum reconciliation and its direct consumers.

The affected implementation/test surface was exhaustively identified as six files:

1. `src/data/project-record.ts`
2. `src/data/project-record.test.ts`
3. `src/navigation/orientation.ts`
4. `src/navigation/orientation.test.ts`
5. `src/navigation/navigation-controller.ts`
6. `src/navigation/navigation-controller.test.ts`

The implementation changes:

* replace the four-value enum with the five-value enum;
* remove `completed`;
* add `ongoing` and `archived`;
* update the status validation list;
* update affected navigation/status consumers and tests;
* retain the existing Planned/Current tier gate;
* do not introduce automatic migration logic.

### Documentation follow-up

The current `src/data/project-record.ts` header comment still contains wording that attributes the current five-value enum to ACP-001 / WP11.

That comment should be corrected to identify **ACP-009** as the authority for the current five-value status enum.

This is a documentation/comment correction only. It does not constitute a new architectural decision or implementation change.

## 9. Gateway and Navigation Boundary

ACP-009 does not redesign Gateway navigation.

The Phase 4 Gateway remains the fixed six-destination grid:

* Current
* Planning
* Ideas
* Ongoing
* New Project
* Archive

Ongoing and Archived are intentionally Gateway destinations, but they are not thereby added to the legacy category-sibling paging model.

The existing `orientation.ts` category paging order remains:

```text
possible | planned | current
```

The separate question of whether that legacy paging mechanism should be redesigned to incorporate Gateway destinations remains outside this ACP.

ACP-009 therefore does not reopen or resolve that navigation question.

## 10. ACP Numbering

This decision is **ACP-009**.

The existing **ACP-008** remains unchanged.

ACP-008 is the Phase 4 Metadata Cache decision:

> Obsidian Metadata Cache is treated as a platform-level read mechanism, not an application-level cache; the Phase 3 "never cached" rule governs Command Center's own behavior only.

ACP-009 follows ACP-008 in the continuous Phase 4 ACP sequence.

No renumbering of ACP-008 is permitted.

## 11. Architectural Consequences

The resulting architecture has one authoritative five-value project-status enum:

```text
possible
planned
current
ongoing
archived
```

This removes the implementation mismatch between the Phase 3 code enum and the Phase 4 project-status vocabulary.

The decision also establishes a clean distinction between:

* project **status**;
* project **location/navigation destination**;
* metadata **validation requirements**;
* metadata **preservation**;
* metadata **presentation**.

These concerns must not be conflated.

## 12. Final Record

**Decision:** Accepted by Kurt.

**Status:** Resolved and implemented.

**Authority:** ACP-009.

**Effect:** The current `ProjectRecord.status` implementation is formally aligned with the Phase 4 five-value project-status vocabulary.

**Retired value:** `completed`.

**Current values:**

```text
possible | planned | current | ongoing | archived
```

**Migration:** No automatic migration; no existing `completed` project records were found.

**Phase 3 record:** Preserved unchanged as historical architecture.

**ACP-008:** Preserved unchanged.

**Documentation follow-up:** Correct the stale `project-record.ts` header attribution from ACP-001 / WP11 to ACP-009.
