---
type: acp-proposal
status: PROPOSED — not yet adopted. Requires Kurt's decision, ideally after GPT and Claude cross-review, per the codebase's own governing instruction that adding `archived` requires a new ACP.
date: 2026-08-30
source: Drafted by Claude, following the UI Architecture Specification reconciliation and direct verification of the Phase 3 Architecture Record's ACP registry and `src/data/project-record.ts`.
---

# ACP-008 — ProjectRecord.status: Reconcile Phase 3's Frozen Enum with the Phase 4 Matrix's Five-Value Vocabulary

## Status

**Proposed.** Not resolved. Not implemented. This document exists to be reviewed and either accepted, revised, or rejected — the same process every prior ACP (001–007) went through, per the Phase 3 Architecture Record's own governance model.

## The problem, precisely stated

`ProjectRecord.status` is currently frozen, per ACP-001, as:

```ts
export type ProjectStatus = "possible" | "planned" | "current" | "completed";
```

The code's own governing comment states: *"`archived` was raised but left undecided in Phase 3 — not included here; adding it later requires a new ACP."* That instruction is the direct basis for this proposal.

Since ACP-001 closed, the Phase 4 Matrix — audited across Categories 1–64 and Step 65, independently verified by both Claude and GPT — has formally established a different, five-value working vocabulary in Category 1:

> Possible / Planned / Current / Ongoing / Archived

And explicitly rejects the value Phase 3 accepted:

> "Completed is not a project status." / "Ongoing is preferred over Completed."

**This is not a simple extension.** Adding `archived` alone (the narrow question ACP-001 left open) would not resolve the conflict, because the Matrix also requires removing `completed` and adding `ongoing` — two changes ACP-001 never contemplated. The actual scope is larger than the deferred question that originally prompted "a new ACP would be needed."

Worth noting for context, not as part of the decision itself: Phase 3's own WP3 Category Screen definition already used four fork options (`Current / Planned / Possible / Completed`), so the current code correctly implements Phase 3 as frozen — it is not lagging behind Phase 3. The conflict is specifically between Phase 3 and the later Phase 4 Matrix, which is why this requires a formal ACP rather than a bug fix.

## Proposed resolution

Update the enum to match the Matrix's frozen five-value vocabulary exactly:

```ts
export type ProjectStatus = "possible" | "planned" | "current" | "ongoing" | "archived";
```

This is the minimal-diff choice: it makes the code's authoritative status values identical to the vocabulary already established, audited, and incorporated (Category 1; P4-R799 for the Ongoing/Archived functional distinction) — no new terminology, no divergence between what the Matrix says and what the code enforces.

## What this does NOT resolve, and should not attempt to

**Migration policy for existing `completed` records is a separate, genuinely open decision — not a mechanical consequence of the enum change.**

`completed` doesn't map cleanly to either new value on its own. Per the established distinction (Category 12, P4-R799): Ongoing means the core work is done but active dependent concerns remain; Archived means genuinely finished with nothing remaining active. A record marked `completed` under the old model doesn't indicate which of those two is true — that requires a substantive judgment about each individual project, not a lookup table.

**This decision belongs to Kurt alone**, consistent with the repeatedly-established rule that the Project Owner is sole authority over Project Status (Category 1; P4-R117, P4-R252, P4-R501, P4-R737) — AI must not silently resolve it, even as a "reasonable default."

**Existing `completed` records must be explicitly reclassified by the Project Owner before or as part of the migration. No automatic semantic mapping from `completed` to `ongoing` or `archived` is authorized by this ACP.** A bulk default-then-correct approach was considered and rejected: even framed as "correctable later," it would mean the system asserts a status determination it doesn't actually have grounds for — the same failure this project has already committed to avoiding via the honest-failure principle (P4-R796, "must fail honestly rather than silently degrade or manufacture project information"). Presenting a bulk default as a normal migration path risks normalizing exactly that.

If there are currently zero or very few `completed` records in practice, manual reclassification is low-cost; if there are many, that's still the correct path — just one requiring more of Kurt's time, not a reason to substitute an automatic default.

## Downstream impact, for awareness (not decisions made here)

- `orientation.ts` currently encodes the Phase 3 four-value `CATEGORY_ORDER` and implements category-to-category sibling paging (`getCategorySiblings()`) using it directly. The enum change will require this code to be revisited, but **ACP-008 does not decide whether five-status category paging remains valid after the Gateway supersedes the Category Screen.** The Gateway is a fixed six-destination grid, not a sequence users page through — whether `<<`/`>>` sibling paging between statuses still makes sense at all in that model is a separate Gateway/navigation-implementation question, to be resolved as part of Gateway alignment, not folded into this ACP.
- Exhaustive repository search confirms the enum/`completed` value is referenced in exactly six files, no others: `src/data/project-record.ts`, `src/navigation/orientation.ts`, `src/navigation/navigation-controller.ts`, and their three corresponding test files (`tests/data/project-record.test.ts`, `tests/navigation/orientation.test.ts`, `tests/navigation/navigation-controller.test.ts`). All six need updating as part of this ACP's implementation.
- No implementation-facing surface beyond these six files depends on the enum — Gateway, Dashboard, and Workspace are all not-yet-started per the Codex roadmap audit, so this is confirmed via direct repository search, not inferred from that audit alone. **This is good timing**: resolving this now costs strictly less than resolving it after Gateway/Dashboard code is built against the old four-value model.

## Recommendation on sequencing

Resolve this ACP **before** Gateway implementation begins, not after — the Gateway's six destinations depend on the Phase 4 status vocabulary and its associated project/data distinctions (Current, Planning, Ongoing, and Archive map directly to statuses; Ideas may hold pre-formal, non-`ProjectRecord` content per Category 17; New Project is a creation workflow, not a status), so building it against a still-four-value enum would mean rebuilding part of it once this ACP eventually resolves anyway.

## What this proposal asks of Kurt

1. Accept, revise, or reject the five-value enum change itself (the part for which the proposed resolution is strongly supported by the frozen Phase 4 Matrix, but which remains this ACP's decision to make, not a foregone conclusion).
2. Accept, revise, or reject the manual-reclassification requirement for existing `completed` records — the genuine open decision this ACP does not resolve unilaterally, consistent with Kurt's sole authority over project status.

Pending review by GPT and confirmation by Kurt, consistent with how ACP-001 through 007 and every other architectural decision in this project have been resolved.
