---
type: architecture-record
phase: 3
status: consolidated — governing baseline for implementation
supersedes: WP1-WP9 as standalone documents (content preserved, not altered)
date: 2026-07-22
---

# Command Center — Phase 3 Architecture Record

This document consolidates WP1–WP9 into a single authoritative record. No decision made during Phase 3 has been reinterpreted, reopened, or extended in producing this consolidation. Where wording differs from the original work package text, the difference is presentational only (combining, cross-referencing) — no meaning has changed.

---

## A. Final Architecture Overview

**Purpose of Command Center:** a single interface allowing the user to assess the state of any current, planned, or possible project at a glance, without engaging with the underlying folders, files, or navigation mechanics — governed by the V1.0 UI Architecture Specification's core philosophy: reduce friction, hide complexity, make the user think about projects rather than tools.

**Screen hierarchy** (five screens, each a strict narrowing of the one before, each answering exactly one question):

```
Entry Screen → Category Screen → Project List Screen → Project Dashboard → Project Workspace
```

Every step down is optional except reaching the Dashboard — the architecture must never force a user through Workspace just to check status.

**Navigation model:** a persistent orientation element (`<<` / center label / `>>` / `Up` / `Top`) present from Category Screen onward, governed by object-based sibling paging and two fixed vertical actions (`Up`, `Top`). Full detail in Section C.

**Data ownership boundaries:** WP1's Project Record is the single authoritative source for a project's status and glance-depth metadata. Every screen that displays project information reads from this record; no screen owns or independently stores a competing copy of that data. Document-body content (Vision, Roadmap, Architecture notes, AI Context, Reference material, Development logs, Milestones, Kanban) is owned by the Workspace layer, addressed by reference from the Project Record, never embedded in it.

**AI authority boundary:** classification (status) and content are always user-initiated changes. AI may surface observations derived from existing data; AI may never alter status, classification, or content directly. Full detail in Section E.

---

## B. Final Data Model

**The Canonical Project Record**, as closed after ACP-001, ACP-002, and ACP-003:

**Required for all projects (every status):**

| Field | Data type | Maintained by |
|---|---|---|
| `project_id` | Stable unique identifier | System |
| `name` | String | User |
| `status` | Enum: `possible` \| `planned` \| `current` \| `completed` | User |
| `focus` | String, short | User |

*(Status enum extended per ACP-001 to include `completed`; whether `archived` becomes a fifth value was flagged in ACP-001 but left undecided — not resolved anywhere in Phase 3.)*

**Required once `status = planned`** (carries forward into `current`; extended per ACP-003 to include `last_updated`):

| Field | Data type | Maintained by |
|---|---|---|
| `milestone` | String | User |
| `progress` | Enum (controlled vocabulary) | User |
| `next_action` | String | User |
| `blockers` | List of strings, nullable | User |
| `last_updated` | Timestamp (ISO 8601) | System |

**Required once `status = current`:**

| Field | Data type | Maintained by |
|---|---|---|
| `repo_reference` | String (URL or path) | User |

**Field ownership:** user-maintained fields describe what the project *is* — name, status, focus, milestone, progress, next_action, blockers, repo_reference. System-maintained fields are mechanical facts, not judgments — `project_id` (assigned once, immutable) and `last_updated` (a timestamp, never manually editable).

**Validation rules:**
- `project_id` — immutable after creation, never user-facing as editable.
- `name` — non-empty; not required to be unique (identity is `project_id`'s job, per ACP-002).
- `status` — one of the defined enum values; writeable only through explicit user action, never a side effect.
- `focus` — non-empty at every tier.
- `milestone`, `next_action` — non-empty once required by tier; "required-and-empty" is invalid, not a valid empty state.
- `progress` — constrained to a fixed, small ordered set, not free text.
- `blockers` — nullable; null is a distinct, valid, intentional state ("no blockers"), not "not yet filled in."
- `repo_reference` — required once `current`; format not constrained beyond "resolves to a location."
- `last_updated` — system-set on any write to a user-maintained field, from `planned` onward; never manually editable.

**`last_updated` behavior (final, per ACP-003):** required at `planned` and `current`; not required at `possible` (a `possible` record carries no actionable metadata to go stale). Represents a metadata freshness signal, not a development-activity timestamp. Refreshed automatically on any write to a user-maintained field at either qualifying tier. Stale-state visual distinction (defined at Dashboard, Section D) applies equally to `planned` and `current`.

**Metadata layer vs. document body:**
- **Metadata layer** (queryable without opening full content — everything Category, List, and Dashboard need): all fields listed above.
- **Document body** (Workspace-layer only): Vision, Roadmap detail, Architecture notes, AI Context, Reference material, Development logs, Milestones, Kanban/work tracking. Addressed by reference, never embedded in the Project Record.

---

## C. Final Navigation Model

**Persistent orientation element — final component set** (after ACP-004 withdrawal and ACP-007 application):

| Component | Function |
|---|---|
| `<<` | Previous sibling of the current object |
| Center label | Current location, updates on every depth change |
| `>>` | Next sibling of the current object |
| `Up` | Parent depth within the current object |
| `Top` | Category Screen — absolute reset |

**Object-based sibling paging rule (final, per ACP-004):** `<<`/`>>` always navigate among the siblings of the **current object**, not the current screen.

- At Category Screen and Project List Screen, the current object is the active category; `<<`/`>>` navigate between category siblings.
- At Project Dashboard and Project Workspace, the current object is the active project; `<<`/`>>` navigate between project siblings within the active category, directly — without returning to Project List between projects.

**`Up` behavior (final, per ACP-007):** returns to the parent depth within the current object. Currently meaningful only at Workspace, where it returns to that same project's Dashboard — preserving object identity, no return to Project List or Category, no dependence on navigation history, no write to any Project Record field.

| Location | `Up` |
|---|---|
| Category Screen | Disabled |
| Project List Screen | Disabled |
| Project Dashboard | Disabled |
| Project Workspace | Enabled → same project's Dashboard |

**`Top` behavior (final):** single fixed destination — Category Screen — from any depth. Distinct from Entry (which is a once-per-session lifecycle event, never a `Top` destination). Distinct from `Up` (Category is an absolute reset; `Up` is a same-object parent-depth step).

**Disabled-state rules (final):** any orientation component with no valid target (e.g., `<<`/`>>` when the current object has no siblings; `Up` where no parent view exists) must render visibly disabled, never hidden and never silently inert.

---

## D. Screen Responsibilities

### Category Screen (WP3)

- **Single question:** "Which group of projects am I looking at?"
- **May display:** the fixed set of category choices (Current / Planned / Possible / Completed, per ACP-001); optionally, a live-aggregated count per category (per ACP-005, optional enhancement, never required, never cached).
- **Forbidden:** project names, focus lines, or any individual-project detail.
- **Inputs received:** none (entry point of the category tier).
- **Outputs passed forward:** the selected category.
- **Read/write:** reads `status` (aggregated) from WP1; writes nothing.

### Project List Screen (WP4)

- **Single question:** "Which project am I going into?"
- **May display:** per project — `name` and `focus` only.
- **Forbidden:** `milestone`, `progress`, `next_action`, `blockers`, `repo_reference`, `last_updated`, or any document-body content.
- **Inputs received:** the selected category (from Category Screen).
- **Outputs passed forward:** the selected `project_id`.
- **Read/write:** reads `name`/`focus` from the filtered set of WP1 records matching the active category; writes nothing.

### Project Dashboard (WP5)

- **Single question:** "What is the state of this one project?"
- **May display:** the complete metadata-layer field set for the active project, tiered by status — `name`/`status`/`focus` always; `milestone`/`progress`/`next_action`/`blockers`/`last_updated` once `planned` or `current`; `repo_reference` once `current`. AI observations may also appear here (see Section E), visually distinct from record fields.
- **Forbidden:** architecture documents, decision logs, research notes, development logs, AI Context, reference materials — all document-body content, reserved for Workspace.
- **Inputs received:** the active `project_id` (from Project List selection, or from `<<`/`>>` paging at this depth).
- **Outputs passed forward:** the active `project_id` (to Workspace, via `Up`... note: Dashboard → Workspace is a downward transition, not `Up`; `Up` is Workspace → Dashboard only. Dashboard's downward transition to Workspace is the single, uniform action defined in WP6).
- **Read/write:** reads the full metadata layer for one record; writes nothing, under any circumstance, including no implicit `last_updated` refresh from being viewed.

### Project Workspace Entry Point (WP6)

- **Single question:** "Where do I actually work on this project?"
- **May display / access:** Vision, Roadmap detail, Architecture notes, AI Context, Reference material, Development logs, Milestones, Kanban or equivalent work tracking.
- **Forbidden:** duplicating any of the above content into Category, Project List, or Dashboard; the Dashboard must not become a navigation hub offering multiple Workspace-section entry points.
- **Inputs received:** the active `project_id` only, from Dashboard.
- **Outputs passed forward:** none upstream; provides two exits — `Up` (same project's Dashboard) and `Top` (Category).
- **Read/write:** reads `project_id` only from WP1; entry itself never writes to any WP1 field, under any circumstance (no status change, no metadata change, no `last_updated` refresh as a side effect of navigation).

---

## E. AI Observation Boundary (WP9)

**Allowed:** statements about a Project Record's condition, derived entirely from data already present in WP1 — staleness (record exceeds the staleness threshold, applicable at `planned` and `current` per ACP-003), and invalid absence (a `planned`/`current` record missing a field WP1 requires at its tier). Every observation must be traceable to a specific, statable rule — never freeform or generative.

**Forbidden:** any suggested status change, recommended next action, proposed field edit, or output implying the AI has assessed what the project should do next. This category has no home anywhere in the architecture — not restricted, simply out of scope entirely. Observations must never be worded as a command or as an action already taken.

**Where observations appear:** Project Dashboard only. Never at Category or Project List depth (both are scoped to selection, not per-project commentary). Never for `possible`-status projects (no qualifying fields yet exist to observe).

**Why observations cannot modify authoritative data:** classification and content changes are, per V1.0 Section 5 and WP1, always user-initiated. An observation is computed fresh at render time from the record, the same way Category's counts are live-aggregated (per ACP-005's validation rule) — it is never stored on the record and carries no write path back to it. Dismissing an observation's display is not the same as resolving the condition it describes; the underlying record is unaffected either way.

---

## F. Deferred Scalability Notes (WP8)

**Scales without redesign:** 5–10 active projects — Category Screen's four-way selector and Project List's flat rendering assume nothing about project count; no field, rule, or validation across WP1–WP7 references quantity.

**Intentionally deferred, not built now:**
- Secondary organization (grouping/sorting/filtering) on Project List, anticipated for dozens of Planned projects. WP4's ordering rules were already written to leave this open — no architectural change required later, only a rendering enhancement over existing WP1 data.
- A search-first interaction model for the Completed category, anticipated at hundreds of projects, diverging from the browse-first List pattern used elsewhere.

**Completed-category future divergence:** one soft seam noted, not resolved — WP3's Category Screen behavior currently describes transitioning to "Project List Screen" as if that's the universal next step for every category. Accurate for Current/Planned/Possible; Completed's eventual search-first model would introduce a second possible destination out of Category Screen. Not a defect in WP3 as written (correctly scoped for what existed when authored) — flagged for whenever Completed's actual design work begins.

**No current implementation requirements** follow from WP8. It is a verification that today's architecture does not block the scale behaviors V1.0 Section 7 anticipates — not an instruction to build any of them now.

---

## G. ACP Registry (Final)

**ACP-001 — Category expansion**
Status: Resolved — Accepted
Resolution: Status enum extended to include `completed` alongside Possible/Planned/Current. Whether `archived` becomes a fifth value was raised but left undecided.

**ACP-002 — Project status vocabulary / stable identity**
Status: Resolved — Accepted
Resolution: `project_id` formalized as a system-assigned, immutable, stable identifier, independent of `name` and independent of `status`. Status changes never affect `project_id`.

**ACP-003 — `last_updated` scope**
Status: Resolved — Accepted (Option B)
Resolution: `last_updated` extended to all projects with `status = planned` or `current`. Not required at `possible`. Represents a metadata freshness signal, not a development-activity timestamp. Stale-state visualization applies at both `planned` and `current`. Threshold remains a deterministic implementation detail.

**ACP-004 — Paging scope ambiguity**
Status: Withdrawn
Resolution: Replaced by the object-based sibling paging rule — `<<`/`>>` always operate on the siblings of the current object (category or project), not the current screen. This corrected an error in the original WP2 draft, which had incorrectly disabled paging at Dashboard/Workspace depth.

**ACP-005 — Category counts**
Status: Resolved — Downgraded
Resolution: Category counts are an optional enhancement, never an architectural requirement. If implemented, must be derived live from WP1 `status` values at time of display, never cached.

**ACP-006 — Project List return path**
Status: Resolved — No change required
Resolution: No additional navigation path back to Project List was added. Reaching Project List occurs only through Category selection, never navigation history, consistent with the architecture's reconstruct-from-authoritative-data model rather than a history-dependent back mechanism.

**ACP-007 — Workspace upward navigation**
Status: Resolved — Accepted
Resolution: Added `Up` as a fifth persistent orientation component, enabled only at Workspace depth, returning to the same project's Dashboard. Preserves object identity, writes nothing to WP1, does not depend on navigation history. `Top` remains the only absolute-reset action.

---

## Implementation Boundary

**What Phase 3 defines:** the complete data model (WP1), the persistent navigation mechanism and its object-based paging/vertical-movement rules (WP2), the responsibilities, information boundaries, and read/write permissions of all four screens (WP3–WP6), confirmation that Interaction Independence and Continuity are satisfied across the model (WP7), confirmation that the architecture does not block anticipated future scale (WP8), and the bounded channel through which AI may surface — never alter — project state observations (WP9).

**What Phase 3 intentionally does not define:** any visual design, layout, spacing, or styling; any specific implementation technology (Obsidian plugin, native application, web application, or otherwise); the specific staleness threshold value; the specific ordering criterion for Project List (only that it must be stable); the internal structure of Workspace-layer content; whether `archived` becomes a fifth status value; the Completed category's eventual search-first interaction design; any code of any kind.

**What must not be invented during implementation:** any new persistent UI component beyond the five defined in Section C; any new screen beyond the five defined in Section A; any write path from Dashboard, Category, Project List, or the AI Observation Surface into the Project Record; any AI-authored status, classification, or content change; any navigation-history-dependent behavior; any display of document-body content at Category, Project List, or Dashboard depth. Any implementation work that appears to require one of these must be raised as a new ACP, not built silently.

---

This record is the consolidated, authoritative reference for Phase 3. Phase 4 has not begun.
