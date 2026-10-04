---
type: implementation-specification
phase: 4
work_package: WP15 — Project Dashboard: ProjectRecord Resolution and Presentation
status: Accepted
date: 2026-10-02
approved_by: Kurt
decision_authority: Kurt
scope: This specification covers resolution of a requested project_id (Missing/Invalid/Duplicate, per ACP-016) and Dashboard's presentation of those conditions. It explicitly does NOT cover AI Progress Estimate (ACP-015) — that remains a separate, still-unresolved Dashboard dependency, identified but not specified here. See Section 0.
governs: the Project Dashboard view's resolution of a requested project_id, and its presentation of Missing/Invalid/Duplicate conditions
depends_on:
  - src/integration/obsidian-project-record-provider.ts (WP14)
  - src/data/project-record.ts (WP11) — specifically the already-exported ValidationIssue/ValidationResult types
  - src/navigation/orientation.ts, navigation-controller.ts (WP12)
  - "docs/architecture/ACP-016 — Dashboard ProjectRecord Resolution (Missing, Invalid, Duplicate).md"
  - Phase 3 Architecture Record, Section D (Project Dashboard, WP5) and Section E (AI Observation Boundary)
relates_to: docs/architecture/ACP-015 — AI Progress Estimate Architectural Reconciliation.md (Track B — separate Dashboard dependency, out of scope for this specification; see Section 0)
---

# WP15 — Project Dashboard: ProjectRecord Resolution and Presentation

**Status: Accepted.** This specification went through four drafting rounds, each independently reviewed by GPT against the live repository and the accepted ACP-016 text, before Kurt's approval. The revision history below is preserved as the record of how it reached this state, per the project's historical-preservation rule — it does not need to be re-derived or second-guessed in future sessions.

## 0. Scope — read this before anything else

Dashboard currently has **two separate, independently-tracked accepted-but-unimplemented dependencies**:

- **Track A — ProjectRecord resolution and presentation** (ACP-016): Missing / Invalid / Duplicate `project_id` resolution, and Dashboard's honest presentation of each. **This specification covers the implementation requirements for Track A** (visual layout and navigation/interaction behavior remain deliberately open per ACP-016 §3.7/§3.8 — see Sections 3.6/3.7 below).
- **Track B — AI Progress Estimate** (ACP-015): required Dashboard behavior, but its derivation method and inputs remain unresolved — likely requiring its own evidence-first decision process before it can be specified, the same way ACP-016 itself required Q1-Q10.

**This document is the implementation specification for Track A only.** It identifies Track B as a named, separate dependency (Section 3.2) but does not specify it, and Track B's unresolved status does not block Track A from being approved and implemented. Track A is sufficiently specified to be implementation-ready, pending this final review round. Track B requires separate work before it can be specified at all.

## Changes from v1 → v2

1. Corrected imprecise claim that this specification "does not touch... WP12/WP13/WP14 code already in place" (Section 2).
2. Corrected overstated claim that Section E's observation need is "satisfied by construction" (Section 3.4).
3. `ValidationIssue`/`ValidationResult` confirmed exported (Section 2) — no longer an open question.
4. Added an explicit, binding requirement that the new resolution capability reuse the provider's existing discovery/duplicate-exclusion logic rather than reimplementing it (Section 2).
5. Added the duplicate-before-validation ordering constraint explicitly, grounded in an existing test (Section 2).
6. Added an acceptance test list (Section 6).

## Changes from v2 → v3

7. Softened "already shaped for exactly this use" to a plainer factual statement, avoiding retrospective architectural interpretation (Section 2 and summary).
8. Clarified the code snippet is abbreviated and both `ProjectRecord`/`ValidationIssue` are exported (Section 2).
9. Separated the AI Progress Estimate (ACP-015) open item from the resolution-mechanism track (Section 3.2) — the latter can be approved and implemented independently; AI Progress Estimate's open status does not block WP15 as a whole.
10. Clarified acceptance test #6's intent is to confirm the *absence* of caching, not to validate a cache-invalidation mechanism (Section 6).

## Changes from v3 → v4

11. **Scope correction (the main finding of this round):** retitled the work package and added an explicit Section 0 stating this specification covers only Track A (ProjectRecord resolution/presentation, ACP-016) and not Track B (AI Progress Estimate, ACP-015). Previously the Purpose section and title implied WP15 covered both, which would have made the whole document read as blocked by Track B's unresolved status even though Track A is independently ready.
12. Rewrote Purpose to match Section 0's scope.
13. Tightened Section 3.2 to point back to Section 0 rather than re-argue the scope separation inline.
14. Stopped minimizing the `candidatePath`/`paths` addition as "just exposing existing information" — it's a genuine new provider capability; what makes it sound is pipeline reuse, not that it's a non-change.

## Final corrections, applied before approval

GPT's final pass against the actual accepted ACP-016 text (not a summary) found v4 substantially correct, with three surgical issues — all fixed, none requiring further architectural review:

15. Section 3.1 had re-introduced ACP-015 into Track A's own description ("No change... beyond what ACP-015 already requires") — contradicted Section 0's scope boundary. Removed.
16. Section 0's "covers Track A, fully" overstated what the document settles, given Sections 3.6/3.7 deliberately leave visual layout and interaction behavior open (per ACP-016 itself). Changed to "covers the implementation requirements for Track A."
17. ACP-015 moved from `depends_on` to `relates_to` in the frontmatter — it is relevant context, not a blocking dependency of this specification, and listing it under `depends_on` contradicted the Track A/B separation. `relates_to` follows the convention already established in `CC_Working_Notes/Dashboard ProjectRecord Resolution Gap — Evidence and Decision Scope.md`.

## Purpose

Implement Track A (per Section 0): the Project Dashboard's resolution of a requested `project_id` and its presentation of the resulting Missing / Invalid / Duplicate condition, governed by Phase 3 Section D and ACP-016. This is one of two separate dependencies standing between Dashboard and implementation readiness — Track B (ACP-015's AI Progress Estimate) is named here as a dependency but is out of this specification's scope; see Section 3.2.

This specification does not redefine `ProjectRecord`, navigation behavior, `CurrentObject`, or Section E. It implements the Dashboard resolution/presentation contract ACP-016 already establishes, and does not depend on Track B being resolved first.

---

## 1. Inputs (unchanged — per Phase 3 Section D and ACP-016 §3.4)

Dashboard receives exactly what `CurrentObject` already carries: `{ project_id: string, category: ProjectStatus }`. This specification does not add fields to `CurrentObject`. No navigation change is required or proposed.

---

## 2. Resolution mechanism (ACP-016 §3.5/§3.6 — proposed concrete shape)

ACP-016 deliberately left the provider interface undecided. This section proposes one, now verified against live source rather than assumed.

**Proposed addition to `ObsidianProjectRecordProvider`:**

```ts
// Snippet abbreviated for readability — a full implementation also imports
// ProjectRecord from the same module, already used elsewhere in this file.
import type { ProjectRecord, ValidationIssue } from "../data/project-record"; // both already exported — confirmed

type ResolutionResult =
  | { condition: "resolved"; record: ProjectRecord }
  | { condition: "missing" }
  | { condition: "invalid"; candidatePath: string; issues: ValidationIssue[] }
  | { condition: "duplicate"; paths: string[] };

resolveProjectRecord(project_id: string): ResolutionResult
```

**This adds a method to the WP14 provider class.** It does not alter `getProjectRecords()`'s existing contract, behavior, or any of its passing tests — those remain untouched. Precision matters here: this is a change *to* WP14's implementation file, not a change that bypasses or sits outside WP14's authority.

**Binding requirement, not an implementation suggestion:** `resolveProjectRecord()` **must** reuse the provider's existing `discoverCandidates()` and `excludeDuplicateIds()` private methods rather than independently re-scanning or re-implementing candidate discovery or duplicate detection. The provider already decomposes `getProjectRecords()` into exactly these reusable steps (plus `validateCandidates()` and `sortByProjectId()`, used for the list case only). A second, independent discovery/duplicate-detection path would create two interpretations of "what counts as a candidate" or "what counts as a duplicate," which this specification treats as a defect, not an acceptable variation.

**Binding ordering constraint, grounded in an existing test** (`"excludes a valid candidate whose project_id collides with an otherwise-invalid candidate"`): duplicate exclusion must be checked before — or independently of — validity. `resolveProjectRecord()` must not simply "find a valid record matching this ID"; if the requested ID has multiple candidates, the result is `duplicate` regardless of whether one of those candidates would otherwise have been valid. This mirrors `excludeDuplicateIds()` running before `validateCandidates()` in the existing pipeline exactly.

**`ValidationIssue`/`ValidationResult` are confirmed, not proposed.** Both are already exported from `project-record.ts`: `ValidationIssue { field: keyof ProjectRecord | "status"; reason: "missing" | "empty" | "invalid_enum_value" | "invalid_type" | "invalid_timestamp" }`; `ValidationResult { valid: boolean; issues: ValidationIssue[] }`. `validateProjectRecord()`'s own docstring states it returns every issue, not just the first, and explicitly identifies a future Dashboard "invalid absence" indicator (per WP5) as the reason for retaining the complete set — WP11's validator was documented with this consumer in mind, not newly invented here.

**`candidatePath` / `paths`:** this is a genuine new public capability of the provider, required by ACP-016 — it is not being minimized as a non-change. What keeps it architecturally sound is that it's built by reusing the existing `discoverCandidates()`/`excludeDuplicateIds()` pipeline (Section 2's binding requirement) rather than adding new vault-reading logic alongside it. Per Q7/Q8 (ACP-016), the *provider result* must contain enough diagnostic information for Dashboard to construct an actionable message — this specification does not thereby mandate that the raw path itself appears in the user-facing UI; that remains a presentation choice (Section 4).

---

## 3. Dashboard behavior

### 3.1 Resolved condition

Normal Dashboard rendering proceeds as already defined by Phase 3 Section D, using `result.record`. No additional resolved-state behavior is specified here.

### 3.2 AI Progress Estimate (ACP-015) — Track B, out of scope, named for completeness

Per ACP-015, "Where Things Stand" must automatically display an AI Progress Estimate on Dashboard open, labeled as an estimate, non-authoritative, subordinate to observable indicators, distinct from `ProjectRecord.progress`. Its derivation method and inputs remain undefined — ACP-015 deliberately left this open, and it likely requires its own evidence-first decision process, the same way ACP-016 itself required Q1-Q10.

Per Section 0, this is Track B: a separate, unresolved Dashboard dependency, not part of this specification. It is named here so Dashboard's full dependency set is visible in one place, not because this document specifies it. Resolving Track B does not require revisiting anything in this document, and this document's approval does not require Track B to be resolved first.

### 3.3 Missing condition

Dashboard renders an explicit unresolved state (never a normal Dashboard with empty/default fields — per ACP-016 §3.8 and SESSION_START Section 15's "fail honestly" principle). Minimum content: the requested `project_id`, and a statement that no corresponding resource was found.

### 3.4 Invalid condition

Explicit unresolved state. Minimum content: the requested `project_id` and the specific validation issue(s) from `result.issues` — not a generic "something is wrong" message.

**On Section E:** this specification ensures the diagnostic data Section E's invalid-absence observation would need is available from the same `resolveProjectRecord()` call Dashboard already makes. **It does not implement Section E's observation itself**, and does not claim to satisfy Section E merely by making the data available. Whether and how Section E's observation is actually wired to consume this data is a separate, unscoped dependency for whoever implements that capability — carried forward as a named follow-on, not resolved here.

### 3.5 Duplicate condition

Explicit unresolved state, distinct from Invalid's presentation (per ACP-016 §3.2/§3.7 — Duplicate is not Invalid). Minimum content: the requested `project_id` and sufficient information from `result.paths` to identify the collision as actionable. The exact presentation of that information (full paths, filenames only, a count with detail-on-demand) is a presentation choice, not fixed by this specification.

### 3.6 Visual/layout treatment

The presentation/interaction decision group (P1–P6, resolved after this specification's acceptance) establishes the complete architecturally-required boundary for unresolved-state presentation as:

1. Conveying the minimum information required for Missing, Invalid, and Duplicate (inherited from ACP-016 §3.8, restated in Sections 3.3–3.5 above).
2. Keeping those three conditions informationally distinguishable (inherited from ACP-016 §3.7).
3. Preserving the existing `Top` → Gateway escape as an available and functional outcome — `resolveTop()` is unconditional and independent of Dashboard resolution; the presentation must not disable, remove, or otherwise make this outcome unavailable.
4. Never causing a navigation-state change through presentation or resolution outcome. Content-driven navigation is prohibited: resolution outcomes must never trigger a `NavigationState` transition. This is a deliberate constraint, not an absence of a feature — its purpose is to prevent a render → navigation-state-change → render feedback loop. Navigation-state changes originate only from explicit user-initiated navigation actions (`selectCategory`, `selectProject`, `pageNext`, `pagePrevious`, `goUp`, `goTop`), never from a resolution result.
5. Requiring no remembered resolution history beyond the current resolution result — transient component/UI state is permitted (the only existing precedent, `new-project-view.ts`'s DOM element references, is lifecycle-scoped and reset on close), but such state must never become resolution history, caching, persistence, or cause/history tracking.

These five are the complete architectural constraints on presentation. **Exact component structure, layout, typography, color, iconography, wording, diagnostic-detail treatment, control placement, and visual treatment of the orientation area remain implementation/component-design decisions**, not architectural locks.

### 3.7 Navigation/interaction behavior

Resolved by constraint 4 above: presentation may never itself cause a navigation-state change. Any user-initiated navigation away from an unresolved Dashboard proceeds through the existing, unmodified `NavigationController` action methods — no new navigation mechanism is introduced or required. Which specific control(s) a user interacts with to invoke those existing methods (e.g., relying solely on the persistent orientation bar vs. also offering an inline affordance that calls the same underlying method) remains implementation choice, not decided here.

---

## 4. Diagnostic information vs. presentation (clarification added in v2)

ACP-016 requires the *resolution result* to carry sufficient diagnostic information for Invalid and Duplicate. It does not require every element of that information to be surfaced verbatim in the UI. Section 2's `ResolutionResult` shape satisfies the former; Sections 3.4/3.5/3.6 leave the latter — what subset Dashboard actually displays, and how — as implementation/presentation work, not fixed by this specification.

---

## 5. Explicit non-goals of this specification

- Does not define AI Progress Estimate's derivation (Section 3.2) — flagged as a required follow-on decision.
- Does not specify visual layout, component structure, typography, color/iconography, or UI copy — the P1–P6 decision group (Section 3.6) establishes the required information/behavioral boundary, not these implementation choices.
- Does not specify which specific control(s) a user interacts with for navigation — only that any such navigation uses the existing `NavigationController` methods, and that presentation may never itself trigger a navigation-state change (Section 3.7, P4).
- Does not implement Section E's observation rendering — only ensures the data it would need is available (Section 3.4).
- Does not alter `getProjectRecords()`'s contract, `CurrentObject`, or any WP12/WP13 code.
- Does not permit a second, independent candidate-discovery or duplicate-detection implementation (Section 2).

## 6. Acceptance tests required before this capability is considered implemented

At minimum, mirroring the existing provider test suite's style and rigor:

1. `resolved` — a single valid candidate for the requested `project_id` returns `{ condition: "resolved", record }`.
2. `missing` — no candidate exists for the requested `project_id`.
3. `invalid` — exactly one candidate exists but fails validation; result includes `candidatePath` and the complete `issues` array (not just the first issue).
4. `duplicate` — multiple candidates exist for the requested `project_id`; result includes all colliding `paths`.
5. **Duplicate takes precedence over validity** — one candidate would otherwise be valid, the other invalid, both share the requested `project_id`; result is `duplicate`, not `resolved` or `invalid`. (Mirrors the existing `getProjectRecords()` test of the same scenario.)
6. **Fresh-read behavior** — matching the existing provider's non-caching guarantee, a `resolveProjectRecord()` call reflects the vault's current state, not a prior call's result, after the backing store changes between calls. This should be tested through the same test-harness pattern the existing provider suite already uses for this guarantee, not a new persistence/invalidation abstraction. The architectural intent is **no caching at all** — this test must not be satisfied or reinterpreted by adding cache-invalidation logic; it exists to confirm the absence of caching, not to validate a cache.

## 7. Status

**Accepted by Kurt, 2026-10-02.** Scoped to Track A only (Section 0) — Track B (AI Progress Estimate, ACP-015) remains separately unresolved and does not block this specification. This document is now the authoritative implementation specification for Dashboard's ProjectRecord resolution and presentation; implementation work may proceed against it. Per the Documentation Synchronization Protocol, this acceptance is accompanied in the same pass by updates to the Master Implementation Index and SESSION_START.md.

**Updated 2026-10-04:** Sections 3.6/3.7 revised to incorporate the P1–P6 presentation/interaction decision group's conclusions, resolved after this specification's initial acceptance. No architectural decision from Q1–Q10, ACP-015, or ACP-016 was reopened in this update; this is a documentation-synchronization pass, not a new specification round. The corresponding SESSION_START.md §15 principle (content-driven navigation prohibition) was added in the same pass.