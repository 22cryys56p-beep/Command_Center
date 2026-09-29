# ACP-015 — AI Progress Estimate - Architectural Reconciliation

**Status:** Accepted
**Date:** 2026-09-30
**Decision Authority:** Kurt
**Decision:** Approved

## 1. Scope

This ACP resolves the previously unresolved architectural definition of **AI Progress Estimate** across:

* Phase 3 Architecture Record — Section E / AI Observation Boundary (WP9)
* Phase 4 Matrix — Category 24 / Project Workspace
* Phase 4 Matrix — Category 35 / Reviews, Checkpoints & Project Progress
* Phase 4 Matrix — Category 43 / Project Dashboard

This ACP establishes the architectural contract for AI Progress Estimate and formally reconciles the affected requirements and boundaries.

### Documents / requirements directly touched

* Phase 3 Architecture Record — Section E
* P4-R323
* P4-R802
* P4-R496–499

These requirements are reconciled by this ACP.

---

## 2. Evidence

### 2.1 Accepted AI Progress Estimate requirements

**P4-R323 — Project Workspace / Category 24**

The Project Workspace “Where Things Stand” should support:

* Where Left Off
* Next Action
* AI Progress Estimate

**P4-R802 — Project Dashboard / Category 43**

The Dashboard must automatically display **AI Progress Estimate** in “Where Things Stand” when the Dashboard opens.

The P4-R802 addendum, dated 2026-08-27 and incorporated during the Step 65 completeness review on 2026-08-29, establishes the **where** and **when** of this behavior.

It does not define what the estimate means, what inputs it uses, or how it is computed.

### 2.2 `ProjectRecord.progress` is not AI Progress Estimate

The Phase 3 Final Data Model defines `ProjectRecord.progress` as a **user-maintained** project field.

It therefore cannot be relabeled or treated as an AI-generated progress estimate.

AI Progress Estimate is a distinct architectural concept.

### 2.3 Phase 3 Section E / AI Observation Boundary

Phase 3 Section E is the governing Phase 3 implementation boundary for AI observations.

It permits two observation types:

* staleness
* invalid absence of required fields

These observations must be derived entirely from existing data and traceable to a specific statable rule; they are not freeform or generative.

However, Section E is **not the sole authoritative source for AI-related architecture**. The accepted Phase 4 Matrix also contains authoritative AI-related requirements and safeguards, including P4-R249, P4-R250, P4-R496–499, P4-R323, and P4-R802.

The architectural issue was therefore not that one authority existed and another did not. The issue was that these accepted authorities had **not yet been reconciled**.

Section E expressly limits the allowed AI observation types to staleness and invalid absence of required fields. **AI Progress Estimate is neither of those observation types.**

This ACP formally establishes AI Progress Estimate as a distinct, explicitly defined category of AI output rather than an additional WP9 observation type.

### 2.4 Category 35 — Reviews, Checkpoints & Project Progress

Phase 4 Matrix Category 35 contains additional accepted safeguards:

* **P4-R496:** CC must not treat AI-generated observations as authoritative Project Status.
* **P4-R497:** Observable project metrics should be distinguished from AI-estimated overall completion percentages.
* **P4-R498:** AI-generated completion percentages must be explicitly labeled as estimates if used.
* **P4-R499:** CC should favor observable indicators — Tasks, Flags, Blockers, Decisions, activity — over a single synthetic score.

These requirements establish the safeguards governing AI-generated completion estimates.

### 2.5 No documented precedence between KEEP-Foundation and KEEP-Phase4

Both Category 35 (`KEEP-Foundation`) and Categories 24/43 (`KEEP-Phase4`) are authoritative Matrix material.

The repository contains no documented rule establishing that one KEEP tier automatically overrides the other.

This ACP therefore does not establish such a precedence rule.

The requirements are reconciled directly according to their respective scopes.

### 2.6 Net evidence

| Source                   | Established fact                                                   | Resolution                                            |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------- |
| P4-R323                  | Workspace “Where Things Stand” should support AI Progress Estimate | Preserved                                             |
| P4-R802                  | Dashboard displays it automatically on open                        | Preserved                                             |
| ProjectRecord data model | `progress` is user-maintained                                      | Remains distinct from AI Progress Estimate            |
| Section E / WP9          | AI observations are limited to two defined types                   | AI Progress Estimate is a distinct AI output category |
| P4-R496–499              | AI estimates require safeguards and explicit labeling              | Applies to AI Progress Estimate                       |
| KEEP classifications     | Both Foundation and Phase 4 requirements are accepted              | No precedence rule required                           |

---

## 3. Architectural Decision

AI Progress Estimate is formally recognized as a **distinct AI-generated estimate**, separate from:

* user-maintained `ProjectRecord.progress`;
* authoritative Project Status;
* ordinary observable project metrics;
* WP9 staleness observations;
* WP9 invalid-absence observations;
* AI-generated recommendations or next-action instructions.

AI Progress Estimate must:

1. be explicitly labeled as an **estimate**;
2. remain non-authoritative;
3. never be treated as Project Status;
4. remain distinct from observable project metrics;
5. favor observable indicators as its supporting evidence rather than replacing them with a single synthetic score;
6. be presented with sufficient provenance to identify that it is AI-generated;
7. be derived from defined, observable project information rather than unsupported generative invention;
8. fail honestly when the available information is insufficient to produce a meaningful estimate.

The estimate does **not** become a recommendation, instruction, or authoritative assessment of what the project should do next.

The existing **Next Action** concept remains separate.

### 3.1 Relationship to WP9 / Section E

AI Progress Estimate is **not** added to the two existing WP9 observation types.

WP9 remains authoritative for:

* staleness observations;
* invalid-absence observations.

AI Progress Estimate is a separate AI-output category established by this ACP and governed by the safeguards and constraints defined here.

This resolves the previous conflict between Section E and the accepted Phase 4 requirements without weakening the existing WP9 observation boundary.

### 3.2 Relationship to `ProjectRecord.progress`

`ProjectRecord.progress` remains user-maintained.

AI Progress Estimate must not overwrite, reinterpret, or silently substitute for `ProjectRecord.progress`.

Where both are displayed, their provenance and meaning must remain distinguishable.

---

## 4. Dashboard and Workspace Contract

### Dashboard

P4-R802 remains authoritative.

When the Project Dashboard opens, **Where Things Stand** must automatically display AI Progress Estimate.

The estimate must be explicitly identifiable as AI-generated and as an estimate.

### Workspace

P4-R323 remains authoritative.

The Project Workspace “Where Things Stand” should support AI Progress Estimate alongside Where Left Off and Next Action.

The Workspace presentation must preserve the same distinction between:

* user-maintained project information;
* observable project indicators;
* AI-generated estimates;
* authoritative Project Status.

---

## 5. Failure / Insufficient-Data Behavior

AI Progress Estimate must not be fabricated when the available project information is insufficient, contradictory, or otherwise inadequate to support a meaningful estimate.

In such circumstances, CC must surface the absence or inability to produce the estimate honestly rather than presenting a false precision or invented value.

The exact user-facing wording and UI treatment are implementation/specification details and must be defined consistently with this architectural rule.

---

## 6. Explicit Non-Goals

This ACP does **not**:

* reopen Dashboard placement or timing already established by P4-R802;
* reopen the separate P4-R797/P4-R798 missing/invalid record presentation question;
* redefine `ProjectRecord.progress`;
* make AI Progress Estimate authoritative Project Status;
* turn AI Progress Estimate into a recommendation for what the project should do next;
* replace observable project indicators with a synthetic score;
* alter the existing WP9 definitions of staleness and invalid-absence observations.

Dashboard and Workspace implementation specifications may now proceed using this architectural contract.

---

## 7. Status / Next Action

**Status:** Accepted

**Decision:** Approved by Kurt on 2026-09-30.

This ACP is now an accepted architectural decision.

The affected architecture and implementation documentation should be updated to reflect:

1. AI Progress Estimate as a distinct AI-output category;
2. the continued authority of WP9 for staleness and invalid-absence observations;
3. the distinction between AI Progress Estimate and user-maintained `ProjectRecord.progress`;
4. the P4-R496–499 safeguards;
5. the P4-R323 Workspace requirement;
6. the P4-R802 Dashboard requirement;
7. the explicit failure behavior for insufficient or contradictory information.

The next bounded work may proceed to the **Dashboard specification**, using this accepted architectural contract rather than reopening the AI Progress Estimate question.
