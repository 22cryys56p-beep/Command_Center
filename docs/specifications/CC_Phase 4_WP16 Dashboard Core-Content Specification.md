---
type: implementation-specification
phase: 4
work_package: "WP16 — Project Dashboard: Core Content (Resolved-State Presentation)"
status: Accepted
date: 2026-10-10
approved_by: Kurt
decision_authority: Kurt
scope: This specification covers the Dashboard's presentation of a resolved ProjectRecord from existing record fields only, and the refinement of the Invalid presentation required to satisfy the Section E invalid-absence acceptance conditions. It explicitly does NOT cover the AI Progress Estimate (Track B), Attention (R582), navigation to Workspace sections (R587), the Dashboard-to-Workspace action (R589), staleness, or the Dashboard/Workspace boundary reconciliation. See Section 0.
governs: the resolved-state rendering branch of DashboardView, and the Invalid-condition wording of DashboardView
depends_on:
  - src/views/dashboard-view.ts (WP15)
  - src/integration/obsidian-project-record-provider.ts (WP14/WP15) — resolveProjectRecord(), unchanged
  - src/data/project-record.ts (WP11) — ProjectRecord, validateProjectRecord(), ValidationIssue (all unchanged)
  - "CC_Working_Notes/CC — Dashboard Core-Content Specification Scope 2026-10-09.md"
  - "docs/specifications/CC_Phase 4_WP15 Dashboard Implementation Specification.md"
  - "docs/architecture/ACP-014 — Purpose and Description Metadata Representation.md"
  - "docs/architecture/ACP-015 — AI Progress Estimate - Architectural Reconciliation.md"
  - "docs/architecture/ACP-016 — Dashboard ProjectRecord Resolution (Missing, Invalid, Duplicate).md"
  - Phase 3 Architecture Record, Section D (Project Dashboard) and Section E (AI Observation Boundary)
relates_to: Track B (AI Progress Estimate derivation, ACP-015); the Dashboard/Workspace boundary reconciliation (scope document §6)
---

# WP16 — Project Dashboard: Core Content (Resolved-State Presentation)

**Status: Accepted (2026-10-10).** Approved by Kurt after three rounds of independent review by GPT, recorded in the revision history below. Section 8 records the approved decisions; items marked **[D1]–[D5]** in the body refer to that list. The approved scope document remains the boundary of this specification.

**Revision history.** *v1 → v2:* Applied after GPT's review: D1's link alternative removed as inconsistent with §2.7 (a link would need an explicit exception); D2 now covers and tests both `null` and `[]`, and flags that `[]` extends beyond what the scope explicitly settles; D3 no longer implies a separate observation form is required; tests 5, 6, 13 and 14 strengthened; a visual-review acceptance step added for the prominence rule. One review point was not applied: the claim that §2.7 miscounts constraints. WP15 §3.6 lists exactly five numbered constraints, which are the consolidated result of the six-item P1–P6 decision group, so "five" is correct and the wording was clarified instead. *v2 → v3:* §2.2 now states that `blockers: null` is an intentional, meaningful state governed by §2.4 and [D2], and D2 states that `null` and `[]` remain distinct in the record with identical presentation. *v3 → accepted:* D1–D5 approved as presented. *Post-acceptance corrections (2026-10-10), no change to scope or D1–D5:* the `work_package` frontmatter value is now quoted so the frontmatter is valid YAML; the ACP-015 filename reference is corrected; Section 9 records the readiness ruling.

## 0. Scope — read this before anything else

WP15 delivered the Dashboard's unresolved states (Missing, Invalid, Duplicate). The resolved branch of `DashboardView` is a deliberately deferred placeholder reading "Dashboard content pending." This specification replaces that placeholder with the Dashboard's core content, **built exclusively from the existing `ProjectRecord`**, and refines the Invalid presentation so that Section E's invalid-absence acceptance conditions can be demonstrated.

The approved scope document is the boundary of this specification. Where this document and the scope document disagree, the scope document governs and this document is wrong.

**This specification does not:**

- decide the Dashboard/Workspace boundary, R316, R318/R151, R587 against Phase 3's navigation-hub rule, or R783;
- define or reserve a placeholder for the AI Progress Estimate (R802, Track B);
- define Attention (R582), or substitute `blockers`, staleness, or invalid-absence observations for it;
- define staleness or its threshold;
- add, rename, or derive any `ProjectRecord` field, or alter `ResolutionResult`, `getProjectRecords()`, `CurrentObject`, or any WP12/WP13/WP14 code.

## 1. Inputs (unchanged)

The Dashboard receives the active `project_id` from `NavigationState` and obtains its result from the injected resolver, exactly as WP15 §1–§2 define. `DashboardView`'s constructor, the resolver contract, and `CommandCenterView`'s wiring do not change. Only the `resolved` and `invalid` rendering branches change.

## 2. Resolved presentation

### 2.1 Content model by status tier

Per Phase 3 Section D, ACP-003 (as implemented in `validateProjectRecord()`), and ACP-014, the resolved record contains:

| Fields | Present at | Role on the Dashboard |
|---|---|---|
| `name`, `status` | every status | Identity |
| `purpose`, `description`, `focus` | every status | The distinguished triad (§2.3) |
| `milestone`, `progress`, `next_action`, `blockers`, `last_updated` | `planned`, `current` | Where Things Stand (§2.4) |
| `repo_reference` | `current` | Reference (§2.5) **[D1]** |

`project_id` is the record's identity key and is not required to be displayed as content.

### 2.2 Applicability and absence (R585)

A field appears only when it is applicable to the record's status and carries a value. A resolved record always has every field required at its tier (the validator guarantees this), so an applicable field is never rendered as an empty placeholder, a dash, or "N/A." A field that does not apply at the record's status is not rendered at all.

**One exception, by definition rather than by waiver:** `blockers: null` is an intentional, meaningful state meaning "no blockers." It is not missing or empty data, so this section's absence rules do not govern it. It is governed by §2.4 rule 4 and **[D2]**, and its presentation as an explicit no-blockers statement is not an "empty placeholder" within the meaning of the sentence above. The treatment of `blockers: []` follows D2 in the same way.

### 2.3 Purpose, Description, and Focus (R580, ACP-014)

Purpose, Description, and Focus are rendered as three separately labeled, mutually distinguishable elements, at every status. They are never merged, never substituted for one another, and never rendered as one block. Their relative order, labeling, and visual treatment are implementation choices, subject only to the distinguishability requirement.

**[D4]** Focus belongs to this triad and is not part of Where Things Stand.

### 2.4 Where Things Stand (R581)

**Binding rules.**

1. **Source.** Where Things Stand is derived exclusively from existing `ProjectRecord` data. It may present applicable information from `milestone`, `progress`, `next_action`, `blockers`, and `last_updated`. It must not derive missing information, manufacture a summary, or introduce new persisted fields.
2. **Retention.** The section is retained at every status. For `possible`, `ongoing`, and `archived`, none of those five fields exists: the section carries no manufactured content and does not fall back to `status` or `focus`. No accepted source defines its empty-state presentation; that presentation is an implementation choice, constrained by rules 1 and 5. "Manufactured content" means project information not present in the record. Neutral explanatory interface copy is permitted, provided it says only that no operational information applies or exists at this status and asserts nothing about the project's actual state.
3. **`progress`.** The user-maintained value is presented as such and must remain distinguishable from the AI Progress Estimate. No element of the Dashboard is named, labeled, or worded so as to imply an AI estimate exists (ACP-015 §3.2).
4. **`blockers`.** `blockers` is ordinary record data, presented according to its own semantics. A `null` value is a deliberate state meaning "no blockers." A non-empty array is presented as the listed blockers. **[D2]** governs how the no-blockers state is shown.
5. **Fidelity.** Values are shown as stored. The Dashboard must not truncate, reinterpret, summarize, or annotate them, and must not derive any status from `last_updated` (no "stale," "recent," or age labeling; staleness is deferred).
6. **Prominence (R579, R581).** Where Things Stand is the central operational section and must not be visually subordinate to Purpose, Description, Focus, or Reference content at statuses where it has content. Exact ordering and layout are implementation choices.

### 2.5 Reference — `repo_reference` (current only) **[D1]**

`repo_reference` is displayed outside Where Things Stand, as a reference to the record's repository, at `current` only.

### 2.6 Read-only and fidelity (R583, R588)

The Dashboard is a view of the record. It writes nothing under any circumstance, including no implicit `last_updated` refresh. It reproduces record values by reference to the live record, never from stored or copied state. It displays no AI-maintained content of any kind in this work package.

### 2.7 Interaction

WP15 §3.6's five constraints (the consolidated result of the P1–P6 decision group) apply to the resolved state unchanged: presentation never causes a navigation-state change, content-driven navigation remains prohibited, `Top` remains unconditionally available through the orientation bar, and no resolution history is remembered. Additionally:

- Resolved content is non-interactive. It offers no navigation to Workspace sections, Sources, Threads, Decisions, Tasks, History, or any other section (R587 is deferred), and no Dashboard-to-Workspace action (R589 is deferred).
- `DashboardView` continues to call no `NavigationController` action method; it reads `getState()` only.

### 2.8 Removal of the placeholder

The text "Dashboard content pending." and the `renderDeferred()` method are removed. No replacement placeholder is introduced for the AI Progress Estimate or for any deferred item.

## 3. Invalid presentation — Section E acceptance conditions

The Invalid condition remains a sub-case of the resolution taxonomy (ACP-016 §4); no separate visual state is introduced. WP15 §3.4 stated that the Section E acceptance constraint remained open. This section defines the conditions under which the Invalid presentation delivers the invalid-absence observation. The conditions below are **acceptance conditions**.

**3.1 Absence is distinguished from malformation.** `missing` is presented as absence of a required field. `invalid_enum_value`, `invalid_type`, and `invalid_timestamp` are presented as a field that is present but not valid. The two kinds are never presented with the same wording.

**3.2 The rule is named.** For each `missing` issue, the presentation states the requirement that makes the field required, derived from a fixed field-to-tier map:

| Field | Required at |
|---|---|
| `name`, `purpose`, `description`, `status`, `focus` | every status |
| `milestone`, `progress`, `next_action`, `blockers`, `last_updated` | `planned` and `current` |
| `repo_reference` | `current` |

This requires no change to `ResolutionResult`. The validator reports tier-field issues only when the record's status is `planned` or `current`, and stops evaluation when the status is missing or invalid, so the tier cannot be guessed from the issue list alone and must not be.

**3.3 No guessed tier.** When the issues contain only universal-field problems (for example, `status` itself is missing or invalid), the presentation states no tier and does not imply one.

**3.4 `possible` records.** No special case is required. A `possible` record cannot produce a tier-field issue, so Section E's exclusion of `possible` ("no qualifying fields yet exist to observe") holds by construction. A universal-field issue on a `possible` record is still surfaced, because R796 requires honest failure for every record.

**3.5 Wording.** Wording is descriptive and deterministic: each issue's wording follows only from its field and reason. It is never worded as a command, never suggests an edit, a status change, or a next action, and never states that an action has been taken (Phase 3 Section E, "Forbidden").

**3.6 Closure.** When §3.1–§3.5 are implemented and the tests in Section 6 pass, ACP-016's dual acceptance constraint, as it applies to the invalid-absence observation, is treated as satisfied by this work package **[D3]**. Staleness remains deferred.

## 4. Deferred items (from the scope document)

| Item | Disposition |
|---|---|
| R582 Attention | Deferred. No Attention concept or data exists in `ProjectRecord`. Nothing substitutes for it. |
| R587 navigation | Deferred; conflicts on its face with Phase 3's navigation-hub rule; destinations do not exist. |
| R589 Dashboard-to-Workspace action | Deferred to the Workspace work and the WP12 Slice 9B disposition. |
| R802 AI Progress Estimate | Deferred to Track B. No placeholder. Remains an outstanding requirement. |
| R584, non-status characteristics | Deferred; no `ProjectRecord` field encodes them. Status-based adaptation is satisfied by §2.1–§2.2. |
| R586, AI-maintained side | Deferred with Track B. The Kurt-controlled record-field side is covered by §2. |
| Section E staleness | Deferred by name; Phase 3 leaves the threshold undefined. |
| Boundary questions | R316, R318/R151, R587 against the hub rule, R783: not settled here. |

## 5. Explicit non-goals

- No change to `ResolutionResult`, `resolveProjectRecord()`, `getProjectRecords()`, `ProjectRecord`, `validateProjectRecord()`, `CurrentObject`, `NavigationController`, `orientation.ts`, or `CommandCenterView`.
- No second candidate-discovery, duplicate-detection, or validation implementation.
- No new persisted field; no derived or inferred project information.
- No visual specification: layout, typography, color, iconography, component structure, exact UI copy, and control placement remain implementation choices, except where this document states a binding rule.
- No treatment of the Teacher Toolbox record's missing `purpose` and `description`, the New Project label wording, or the Navigation Inspector's visibility.

## 6. Acceptance tests required before this capability is considered implemented

View-level tests, in the style of `tests/views/dashboard-view.test.ts`. The existing test asserting the deferred placeholder is replaced.

**Resolved presentation**

1. At `possible`, `ongoing`, and `archived`, the rendered output contains `name`, `status`, `purpose`, `description`, and `focus`, and none of the tier fields.
2. At `planned`, the output contains `milestone`, `progress`, `next_action`, `blockers`, and `last_updated`, and does not contain `repo_reference`.
3. At `current`, the output contains all of the above plus `repo_reference` **[D1]**.
4. Purpose, Description, and Focus are separate, labeled, distinguishable elements at every status; no single element contains more than one of them.
5. Where Things Stand is present at every status. At statuses with no operational fields it contains no invented project information and does not repeat `status` or `focus`. Neutral explanatory copy that asserts nothing about the project's state is not a failure of this test.
6. `blockers: null` presents the defined no-blockers state **[D2]**; `blockers: []` presents the identical no-blockers state **[D2]**; a non-empty array presents every blocker in it.
7. `progress` is presented as the user-maintained value with a distinguishing label; no rendered text names or implies an AI Progress Estimate.
8. Values are shown as stored; no staleness, recency, or age text is rendered from `last_updated`.
9. The text "Dashboard content pending." is not rendered.
10. Rendering the resolved state calls no `NavigationController` action method, and each render resolves afresh.

**Invalid presentation**

11. `missing` and each of the three malformed reasons produce different wording for the same field.
12. A `missing` tier-field issue states its tier rule per the §3.2 map; a `missing` universal-field issue states that the field is required at every status.
13. When the only issues are on universal fields (including a missing or invalid `status`), no tier is stated. This includes a record whose `status` is `possible` and whose only failure is a universal field: the output states the every-status requirement and does not mention `planned`, `current`, or any tier-field rule.
14. Each issue's wording is a function of its field and reason alone; wording never varies with the project's name or data. Across every field and reason the Invalid presentation can render, the output (a) begins with no imperative action verb from a fixed deny-list defined in the test (for example add, set, fix, update, change, create, remove) and (b) contains no phrase claiming an action was taken (for example "has been added", "was updated", "fixed"). The deny-list is a guard, not a definition of acceptable wording; review of the wording against §3.5 remains part of acceptance.
15. Missing and Duplicate presentations are unchanged from WP15.

## 7. Implementation notes (non-binding)

- Acceptance of the implementation includes a visual review of the rendered resolved Dashboard against §2.4 rule 6 (prominence), since a unit test cannot verify it. No layout is specified beyond that rule.
- Expected touch set: `src/views/dashboard-view.ts` and `tests/views/dashboard-view.test.ts`. A change outside these two files indicates a violation of Section 5.
- On acceptance and implementation, per the Documentation Synchronization Protocol: update the Master Implementation Index (WP16 entry, Outstanding Items), the Repository File Index, the Near-Term Roadmap, and the scope document's status, in the same pass.

## 8. Approved decisions

Approved by Kurt, 2026-10-10.

- **[D1] `repo_reference`:** displayed at `current` only, outside Where Things Stand, as plain, non-interactive text, consistent with §2.7. A clickable link would require an explicit exception to §2.7 and is not adopted.
- **[D2] No-blockers state:** `blockers: null` is presented as an explicit no-blockers statement, not omitted, because `null` is a deliberate affirmative state that omission would conflate with unknown or absent. The scope document settles this meaning for `null`. `blockers: []` is presented identically; this extends beyond the scope document's explicit statement about `null` and is approved here. The two values remain distinct in the record and are never rewritten or normalized by the Dashboard; only their presentation is identical. The alternative of omitting the line was not adopted.
- **[D3] Section E closure:** the invalid-absence side of ACP-016's dual acceptance constraint is treated as satisfied when §3.1–§3.5 are implemented and the §6 tests, including 13 and 14, pass. No separate observation form is adopted, because no governing source requires one.
- **[D4] Focus:** grouped with Purpose and Description, outside Where Things Stand.
- **[D5] Designation:** this work package is designated WP16.

## 9. Status

**Accepted by Kurt, 2026-10-10.** D1–D5 approved as presented, after independent review. This document is now the authoritative specification for the Dashboard's resolved-state core content and the Invalid-presentation refinement. Scope and deferred items are those of the approved scope document. Per the Documentation Synchronization Protocol, this acceptance is accompanied in the same pass by updates to the Master Implementation Index, the Repository File Index, the Near-Term Roadmap, SESSION_START.md, and the scope document's status.

**Readiness.** SESSION_START.md names two conditions on a Dashboard implementation specification in its ACP-015 paragraph: (a) the AI Progress Estimate's derivation is defined, and (b) Phase 3 Section E's wording is annotated to reflect ACP-015.

- **(b) is cleared.** On 2026-10-10 an annotation was added directly beneath the Section E heading in the Phase 3 Architecture Record; Section E's original wording is unchanged.
- **(a) is ruled not to apply to this specification.** By Kurt's ruling of 2026-10-10 (recorded in SESSION_START.md), condition (a) applies to a work package that includes the AI Progress Estimate. WP16 explicitly excludes it (R802, deferred without a placeholder). Track B remains unresolved and separate; it is not waived.

This does not reopen D1–D5 or change this specification's scope. Implementation begins only when Kurt authorizes it.
