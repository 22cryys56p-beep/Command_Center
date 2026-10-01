---
type: evidence-and-decision-scope
phase: 4
status: open — not an ACP, not a proposed solution
date: 2026-09-30
relates_to: Project Dashboard (Category 43, Document D — P4-R797, P4-R798)
---

# Dashboard ProjectRecord Resolution Gap — Evidence and Decision Scope

**This document does not decide anything.** It exists to preserve the evidence trail and precisely name the open architectural questions before anyone designs a solution — the same evidence-first discipline used during the ACP-015 investigation. It does not propose `getProjectRecordById()`, a change to `CurrentObject`, a change to the provider contract, or any other mechanism. Whether this becomes an ACP is itself left open (see Section 8).

## 1. The two open items, verbatim and in full

Their complete text, from `docs/architecture/phase-4-matrix/Revise_Matrix _Doc_D_Open_Items/Document-D-Open-Items-Steps-43-49.md`:

> P4-R797 — The Dashboard's exact presentation of a missing ProjectRecord remains OPEN

> P4-R798 — The Dashboard's exact presentation of an invalid ProjectRecord remains OPEN

No richer or earlier-stage version of either item exists. Document D is the terminal classification for OPEN items, a sibling of Documents A (Clean/Keep), B (Deferred), and C (Removed) — not a summary of something fuller documented elsewhere. This is the entire content.

Both items are framed narrower than what the evidence below actually found: both say Dashboard's *presentation*, which assumes Dashboard already has the missing/invalid information and only needs to decide how to show it.

## 2. Evidence chain: navigation → CurrentObject → Dashboard → provider

Traced directly against live source, not summary:

- **`NavigationController.enterProject()`** (`src/navigation/navigation-controller.ts`) sets `CurrentObject` to `{ kind: "project", project_id, category }` with no check that this `project_id` currently resolves to a valid record. It accepts whatever the caller (Project List) supplies.
- **`CurrentObject`** (`src/navigation/orientation.ts`) for a project carries only `project_id: string` and `category: ProjectStatus` — never the `ProjectRecord` itself, never a validity flag.
- **Phase 3 Section D** (Dashboard's own frozen responsibility definition) confirms this independently: *"Inputs received: the active `project_id` (from Project List selection, or from `<<`/`>>` paging at this depth)."* Bare ID only — consistent with the code.
- **`ObsidianProjectRecordProvider`** (`src/integration/obsidian-project-record-provider.ts`) exposes exactly one public method: `getProjectRecords()`, returning valid records only. No `getProjectRecordById()` or any single-record lookup exists.
- **Invalid and duplicate records** are diagnosed and excluded by the provider with a `console.warn()` only — file path and validation issues never reach any return value a caller could use.

## 3. The confirmed stale-reference scenario

Not hypothetical: WP14's provider is explicitly non-caching — its own header comment states every call re-reads the vault's current metadata state. A project can be valid at the moment it's selected from Project List, then become invalid or be deleted before Dashboard actually mounts and re-queries. Nothing in the current chain preserves any signal that this occurred; `CurrentObject` still just holds the original `project_id`.

## 4. The provider's exclusion/warning behavior is intentional and test-verified

Every test in `tests/integration/obsidian-project-record-provider.test.ts` — covering missing required fields, invalid status values, and duplicate `project_id` collisions — confirms "exclude and warn only, nothing exposed to the caller" as the deliberately built and verified design. This is not an oversight or a bug; it is the architecture as built.

## 5. No existing rule governs this

Checked directly, not inferred:

- **Phase 3 Section C** (Final Navigation Model, frozen) — no rule anywhere about a stale or missing `CurrentObject` reference, for any object type.
- **Phase 3 Section D** (Dashboard responsibilities, frozen) — describes only the happy path; says nothing about what happens if the `project_id` doesn't resolve.
- **WP14's specification** — contains no scope language deferring or excluding single-record lookup. This was not deliberately scoped out; it simply was not addressed.

## 6. P4-R529 — relevant precedent, not authority

**P4-R529** (Category 37, "Files, Sources & External Locations," `KEEP-Foundation`, accepted): *"CC should distinguish an unavailable storage location from a missing or deleted project resource."*

This establishes that CC's accepted architecture already values distinguishing "temporarily unavailable" from "actually gone" — but in a different domain (external file/repository Sources, not the `ProjectRecord` note itself). It is evidence that this kind of distinction fits CC's existing design philosophy. It is **not** a rule that already governs the Dashboard/provider case, and treating it as if it settled the question would itself be a new architectural decision, not a discovery.

## 7. The precise questions that now require a decision

None of these are answered by existing accepted architecture:

1. What does "missing" mean operationally — a `project_id` that never existed, a record deleted after selection, or both, treated the same or differently?
2. What does "invalid" mean operationally — any `validateProjectRecord()` failure, or a narrower subset?
3. Which layer is responsible for detecting the condition — navigation, the provider, or Dashboard itself?
4. What information, if any, should travel through `CurrentObject` beyond the bare `project_id`?
5. Should the provider's contract change to expose single-record lookup and/or structured invalid/missing information, or should this be solved another way entirely?
6. Should `CurrentObject` change at all, or should Dashboard perform its own resolution against `getProjectRecords()`'s existing output?
7. Should "missing" and "invalid" be presented identically to the user, or differently — and if differently, on what basis?
8. What should the user actually see in each case?
9. Does the stale-reference scenario (Section 3) require different handling than a `project_id` that was never valid in the first place?
10. Does this touch Section E's AI Observation Boundary (its "invalid absence" observation type) at all, or is this purely a data-layer/UI question with no AI-generated content involved?

## 8. What this brief explicitly does not decide

- It does not decide that a single-record lookup method is the right answer, or any other specific mechanism.
- It does not decide that `CurrentObject`'s shape should change.
- It does not decide that the provider's exclusion/warning behavior is wrong — that behavior remains correct and verified for its current, tested purpose (`getProjectRecords()` for list-building).
- It does not decide whether "missing" and "invalid" should be unified or kept distinct.
- It does not decide whether this requires an ACP, a work-package specification, or some other resolution path. That determination itself requires the questions in Section 7 to be answered first.

## 9. Status

Open. This is confirmed as a legitimate architectural question — not resolvable by inference from P4-R797/R798, P4-R529, or any other existing accepted document — but not yet scoped into a decision-ready form the way ACP-015 eventually was. The next step, if and when taken, is to work through Section 7's questions before any design work begins.