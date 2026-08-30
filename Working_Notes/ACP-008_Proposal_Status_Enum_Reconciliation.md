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

Two honest options to put in front of Kurt, not a recommendation between them:
1. **Manual reclassification** — review each existing `completed` record individually and assign Ongoing or Archived deliberately.
2. **Default-then-correct** — bulk-map `completed` → one default value (most likely Archived, since "genuinely finished" is closer to the old meaning of Completed than "still has active tentacles" is), with the explicit expectation that any that actually belong in Ongoing get corrected afterward.

If there are currently zero or very few `completed` records in practice, this decision may be low-stakes; if there are many, it's worth deciding deliberately before the enum change ships.

## Downstream impact, for awareness (not decisions made here)

- `orientation.ts`'s fixed category enumeration (governed by ACP-001, "must be stable and deterministic") needs its ordering re-established for five values. WP12's own implementation notes record the frozen order as `possible → planned → current → completed`; this would need to become something like `possible → planned → current → ongoing → archived`, as its own explicit architectural decision, not an incidental side effect.
- Existing WP11/WP12 test suites reference the four-value enum and will need updating.
- No implementation currently depends on the enum beyond tests and the orientation/paging logic — Gateway, Dashboard, and Workspace are all not-yet-started per the Codex roadmap audit. **This is good timing**: resolving this now costs strictly less than resolving it after Gateway/Dashboard code is built against the old four-value model.

## Recommendation on sequencing

Resolve this ACP **before** Gateway implementation begins, not after — the Gateway's six destinations (P4-R800) are defined in terms of the Matrix's status vocabulary, so building it against a still-four-value enum would mean rebuilding part of it once this ACP eventually resolves anyway.

## What this proposal asks of Kurt

1. Accept, revise, or reject the five-value enum change itself (the part with a clear, well-evidenced correct answer).
2. Decide the migration policy for existing `completed` records (the part that is a genuine open decision, not a technical question).

Pending review by GPT and confirmation by Kurt, consistent with how ACP-001 through 007 and every other architectural decision in this project have been resolved.
