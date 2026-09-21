ACP-014 — Purpose and Description Metadata Representation

Status: resolved — accepted
Date: 2026-09-18
Decision authority: Kurt
Scope: ProjectRecord data layer (WP11), Dashboard (future), Workspace (future)
Depends on: ACP-001, ACP-002, ACP-003, ACP-009
Authority: Phase 4 Matrix Categories 3, 8-14, 22-28, 43; Phase 3 Architecture Record Section B

1. Purpose

This ACP does not implement Dashboard, Workspace, or any UI. It resolves a question the Working_Notes open-question record (Purpose_Description_Ownership_Open_Question.md) identified but deliberately left open: where do the Purpose and Description project concepts live, and in what form.

2. Evidence

2.1 Phase 4 establishes Purpose and Description as required, distinguishable project concepts:

- P4-R102 (revised) — "A project must have a Purpose describing why it exists" — KEEP-Foundation
- P4-R103 (revised) — "A project must have a Description describing what it is/encompasses" — KEEP-Foundation
- P4-R105 (revised) — "Purpose, Description, and Focus must remain distinguishable concepts" — KEEP-Foundation
- P4-R308 — "Core descriptive fields include Purpose, Description, and Focus" — KEEP-Foundation
- P4-R318 — "Purpose, Description, and Focus should be directly accessible from the primary workspace" — KEEP-Phase4
- P4-R151 — "Purpose, Description, Focus, Status, Milestone, Progress, Next Action, Flags, and Blockers should be accessible from the primary workspace" — KEEP-Phase4
- P4-R580 — "Dashboard must distinguish Purpose, Description, and Focus" — KEEP-Phase4

Citation note: P4-R102-105 exist twice in the Matrix's source material (a documented numbering collision, noted in Document C: "IDs P4-R102–105 were assigned twice in the source material... the ID numbering will need to be corrected during formal specification"). This ACP cites that content by description and relies on the non-colliding P4-R308/R318/R151/R580 as its primary citations.

2.2 Phase 3's canonical ProjectRecord ("closed after ACP-001, ACP-002, ACP-003") does not contain purpose or description. The current implementation (src/data/project-record.ts) matches Section B exactly — confirmed, no drift.

2.3 Phase 3's document-body taxonomy and Dashboard's Forbidden list are both closed, specifically-named lists; neither contains Purpose or Description. P4-R580 would directly conflict with Dashboard's document-body prohibition if Purpose/Description were classified as document-body content — Dashboard would be simultaneously required to display them and forbidden from reading them. This forecloses a document-body resolution.

2.4 Category 3 ("Project Identity & Purpose") groups the real content behind P4-R102/103/105 directly alongside P4-R99 (stable identity independent of physical location), P4-R100 (canonical Project ID), and P4-R101 (human-facing project name) — already-universal ProjectRecord fields — using the same unconditional "must have" phrasing, not the conditional "where applicable" phrasing used for tiered fields elsewhere in the Matrix.

2.5 ACP-009 precedent: the canonical ProjectRecord's "closed" status has already been formally reopened once, via the ACP process specifically, to change `status`'s vocabulary. "Closed" means closed absent an explicit ACP, not immutable.

3. Decision

Purpose and Description are added to `ProjectRecord` as universal-tier fields:

```
purpose: string;
description: string;
```

Required at every status, validated by `validateProjectRecord()` alongside the existing universal fields (`project_id`, `name`, `status`, `focus`) — same validation pattern (non-empty string), same "always required, every status" section of the validator.

Rationale for rejecting the alternative considered (a separate adjacent metadata structure outside `ProjectRecord`): it would create a second frontmatter-to-type pipeline for two fields that are conceptually part of the same project-identity record Category 3 already groups them with, without a principled boundary for which future universal fields go where. No evidence supports that split; extending `ProjectRecord` directly reuses the existing, working WP14 provider pipeline with no new machinery.

Resulting universal tier:

```
project_id
name
purpose
description
focus
status
```

Existing tiered fields (milestone, progress, next_action, blockers, last_updated, repo_reference) are unaffected — this ACP does not alter their tier placement or validation.

4. Explicit non-goals

This ACP does not decide: Dashboard's presentation of Purpose/Description (separate, resolved inside the Dashboard implementation contract); P4-R797/R798 (missing/invalid record presentation — same); pre-formal Ideas; any Workspace implementation detail.

5. Status and next step

This ACP is resolved and accepted by Kurt as of 2026-09-18.

Next steps, in order:
1. Surgical update to Working_Notes/Purpose_Description_Ownership_Open_Question.md marking the ownership question resolved and pointing to this ACP.
2. Implementation: extend the ProjectRecord interface and validateProjectRecord() in src/data/project-record.ts, update WP14's provider mapping (CANONICAL_FIELDS) and tests accordingly, verified against a fresh clone with full type-check/build/test — as its own separately-reviewed implementation step, not bundled into this decision record.

Until step 2 is complete and verified, no code in the repository reflects this decision.
