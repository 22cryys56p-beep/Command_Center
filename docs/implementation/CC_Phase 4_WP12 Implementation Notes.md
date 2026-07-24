---
type: implementation-notes
phase: 4
work_package: WP12
status: Steps 1–2 recorded — pending real repository commit for Step 2
date: 2026-07-23
---

# WP12 Implementation Notes

This document records what was actually built, as distinct from `Phase 4 - WP12 Orientation Element Specification.md`, which records what was approved to be built. The specification is the contract; this document is the log of what happened against it.

---

## Step 1 — Sibling Resolution

**Files:**
- `src/navigation/orientation.ts`
- `tests/navigation/orientation.test.ts`

**Implementation decisions:**

- **Category ordering:** `possible → planned → current → completed`
  - Stable ordering requirement satisfied.
  - Implementation choice only, not architecture.
- **Project ordering:** lexicographic `project_id`
  - Deterministic ordering.
  - Implementation choice only, not architecture.
- **No sibling wrapping:**
  - Navigation ends at the first/last sibling; does not cycle.
  - Disabled state applies when no sibling exists.
  - Derived implementation behavior, not new architecture.

**Verification:**
- Tests: 46/46 passing (26 from WP11, unchanged; 20 new for Step 1) — confirmed by running the suite directly, not asserted.
- Type checking: `tsc --noEmit --strict` clean, project-wide — confirmed by direct execution.
- Commit: *(blank — no commit exists in the actual repository yet; a sandbox-local commit, `6d82e83`, was made for internal verification only and is not recorded here as a real repository commit, per the Session Start Checklist requirement)*

---

Holding here. Not proceeding to Step 2 until the real repository contains the verified Step 1 changes and an actual Git commit exists against it.

---

## Step 2 — Object-Based Paging Resolution

**Files (extended, not new):**
- `src/navigation/orientation.ts`
- `tests/navigation/orientation.test.ts`

**Implementation decisions:**

- **`CurrentObject` type shape:** a discriminated union (`{ kind: "category", ... } | { kind: "project", ... }`), matching Section C's two current-object cases exactly. No screen or depth field included — per ACP-004, paging depends only on the object, never on which screen is asking, so no such field is needed or added.
  - Status: implementation choice only, not architecture.
- **`PagingTarget` defined as the same type as `CurrentObject`:** a paging target is simply "the object you would be at if you paged this direction." No separate type was introduced, since none was needed.
  - Status: implementation choice only, not architecture.
- **`resolvePaging()` is a pure resolver, not a transition function:** it reports available targets and disabled state (via `null`) but does not change any state, does not touch rendering, and does not perform navigation. This mirrors the boundary already established for Step 1's sibling-resolution functions.
  - Status: derived implementation behavior, directly required by the approved Step 2 scope — not a new architectural rule.
- **Project paging targets always carry the current object's category forward:** since Section C scopes project paging to the active category only, a project's sibling is always in the same category as the current object — this is asserted directly in the wrapping logic rather than re-derived from the sibling record itself.
  - Status: implementation choice only, not architecture.

**Verification:**
- Tests: 60/60 passing (26 from WP11, unchanged; 20 from Step 1, unchanged; 14 new for Step 2 — covering category-object paging, project-object paging, category-scoping enforcement, disabled-state at both boundaries, and purity/non-mutation) — confirmed by running the suite directly.
- Type checking: `tsc --noEmit --strict` clean, project-wide — confirmed by direct execution.
- Commit: *(blank — pending real repository commit)*

---

Holding here. Not proceeding to Step 3 until the real repository contains the verified Step 2 changes and an actual Git commit exists against it. Master Implementation Index synchronization deferred until WP12 is complete, per instruction.
