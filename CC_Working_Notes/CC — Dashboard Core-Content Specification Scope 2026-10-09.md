# Command Center — Dashboard Core-Content Specification: Scope and Source Requirements

**Date:** 2026-10-09
**Status:** Scope agreed as the basis of the next work package. This is not the specification and is not implementation-ready.
**Baseline:** `main` at `a3c3f34` (WP15 implemented and merged).

## 1. Purpose

Bound the next Dashboard work package: the **resolved-state presentation** of the Project Dashboard, built from the existing `ProjectRecord` only. WP15 delivered the unresolved states (Missing, Invalid, Duplicate); the resolved branch of `DashboardView` is currently a deferred placeholder ("Dashboard content pending.").

This document records which accepted requirements the specification covers, which it defers, and which questions it must not settle by implication. It decides no architecture.

## 2. Governing sources

- Phase 3 Architecture Record, Section D (Project Dashboard) and Section E (AI Observation Boundary)
- Phase 4 Matrix, Document A: Category 43 (The Project Dashboard, P4-R578–R588, R796, R802) and Category 63 (Project Dashboard vs. Project Workspace, R774–R784)
- ACP-003 (status tiers), ACP-014 (Purpose and Description), ACP-015 (AI Progress Estimate), ACP-016 (resolution)
- WP15 specification (including §3.4 on Section E and §3.6/§3.7 on presentation boundaries P1–P6)

## 3. Requirement dispositions

| Requirement | Disposition |
|---|---|
| R578, R579 | In scope: immediate operational overview; "See first. Read second." |
| R580 | In scope: Purpose, Description and Focus presented distinctly. ACP-014 left their presentation to the Dashboard specification. |
| R581 | In scope: Where Things Stand is the central section, retained at every status. |
| R583, R588 | In scope: Dashboard references records and remains read-only; never a second source of truth. |
| R584 | Split. In scope: adaptation by status, via the accepted Phase 3 status tiering, referenced rather than redefined. Deferred: adaptation to other project characteristics, since no `ProjectRecord` field encodes them. |
| R585 | In scope: empty or non-applicable data creates no clutter. |
| R586 | Split. In scope: the Kurt-controlled record-field side, to the extent existing `ProjectRecord` fields support it. Deferred: the AI-maintained side (Track B, and Section E staleness until a threshold is established). |
| R796 | Delivered for the unresolved states by WP15. See §5 on Section E. |
| R582 (Attention) | Deferred. `ProjectRecord` has no Attention concept or data. Nothing substitutes for it: not `blockers`, not staleness observations, not invalid-absence observations. Category 61's open threshold decisions (Document D) must be resolved separately. |
| R587 | Deferred. It conflicts on its face with Phase 3's rule that Dashboard must not become a navigation hub offering multiple Workspace-section entry points, and its destinations do not exist. |
| R589 | Deferred. The Dashboard-to-Workspace action waits for the Workspace work and the WP12 Slice 9B disposition; no code path currently enters Workspace depth. |
| R802 | Deferred to Track B. The specification must not reserve or display a placeholder for the AI Progress Estimate. R802 stays an outstanding requirement; it is not satisfied by omission. |

## 4. Binding rules

1. **Where Things Stand source.** It is derived exclusively from existing `ProjectRecord` data. It may present applicable information from `milestone`, `progress`, `next_action`, `blockers` and `last_updated`. It must not derive missing information, manufacture a summary, or introduce new persisted fields.
2. **Retention across statuses.** The section is retained for every status. For `possible`, `ongoing` and `archived`, none of those five fields exists; the section carries no manufactured content and does not fall back to `status` or `focus`. Its empty-state presentation is not defined by any accepted source and is left open for the specification.
3. **`blockers`.** It is ordinary record data. `blockers: null` is a deliberate state meaning "no blockers," distinct from the field being absent. Whether "no blockers" is displayed explicitly is a presentation decision for the specification.
4. **`progress`.** The user-maintained `progress` value remains in scope and must stay distinguishable from the AI Progress Estimate if both are ever presented (ACP-015).
5. **AI Progress Estimate.** Omitted, with no placeholder, until Track B is resolved. Track B's specification will determine presentation, including handling of insufficient data under ACP-015's honest-failure rule.

## 5. Section E: invalid-absence observation

Working interpretation: invalid absence is a sub-case of the Invalid resolution state, as ACP-016 §4 describes. WP15 §3.4 states that it makes the diagnostic data available and does not claim to satisfy Section E. The acceptance constraint therefore **remains open**. The following four items are **acceptance conditions**, not explanatory notes: the specification must satisfy each of them before the constraint is treated as closed.

- The Invalid presentation names the failed fields and the tier rule that required them. Today it shows field and reason code but not the rule.
- How absence is distinguished from other validation failures (invalid enum values, timestamps, types), since Section E covers only absence at `planned` and `current`.
- How `possible` records are treated, since Section E excludes them.
- That the wording remains descriptive, never a command or a claimed action, and traceable to a statable rule.

No separate visual state is introduced unless the accepted requirements require one.

**Staleness** is deferred by name. Phase 3 intentionally leaves the threshold value undefined, and the specification must not invent one.

## 6. Questions the specification must not settle by implication

- **R316** (selecting a project opens Workspace) against the Phase 3 and WP13 flow through Dashboard. R589 in Category 44 states that Workspace is accessible from Dashboard.
- **R318 and R151** ("primary workspace" access to Purpose, Description and Focus and related fields) against R580 on Dashboard. ACP-014 cites all three and allocates none.
- **R587** against the Phase 3 navigation-hub rule.
- **R783** (Dashboard and Workspace should not duplicate responsibilities) against the accepted R802/R323 overlap in ACP-015 §4.

These are to be reconciled before the Workspace specification, using the ACP process if a new architectural decision is required, and without amending accepted requirements merely to make documents agree.

This sequencing does not prevent the core Dashboard specification from progressing within the constraints of this document.

## 7. Open items for the specification to decide explicitly

- Placement of `repo_reference` (present at `current`; assigned to no section).
- Display of `blockers: null`.
- Placement of Focus relative to Where Things Stand.
- Which parts of resolved-state presentation are binding and which are left as implementation choices, following WP15's pattern (§3.6).
- Empty-state presentation at statuses without operational fields.

## 8. Out of scope

Implementation; Track B derivation; Workspace; Attention; navigation to Sources, Threads, Decisions, Tasks and History; staleness; New Project label wording; the Navigation Inspector; Teacher Toolbox's missing `purpose` and `description`.

## 9. Tracked documentation items

- **Document D, Steps 43–49:** P4-R797 and P4-R798 are still listed as OPEN although ACP-016 resolved them. This is a standing documentation task, tracked in the Master Implementation Index under Outstanding Items. It was deliberately left untouched during WP15 and this scope work.

## 10. Verification note

Cited text was read from `main` at `a3c3f34`: Category 43 and Category 63 (Document A), Phase 3 Sections D and E, ACP-014, ACP-015, ACP-016, WP15 §3.4, and the `ProjectRecord` schema and validator. R151 and R318 are cited through ACP-014. Document D (Steps 43–49) still lists P4-R797 and P4-R798 as OPEN; ACP-016 resolved them, and that Document D text has not been updated (a separate documentation question, left unchanged).