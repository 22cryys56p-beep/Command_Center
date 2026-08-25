# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered:** Categories 43–49

---

## Category 49 — Project Lifecycle & State Transitions (the drift category)

### This entry corrects the original audit's classification

The original audit (per the "Steps 43–49" audit document) classified Category 49 as **REVISE — Needs correction**, treating the invented status taxonomy (`Active`, `Paused`, `Completed`, `Cancelled`, `Failed`, plus `Archived` as a second formal system) as a scope-discipline problem — i.e., that the taxonomy merely needed tightening because it overlapped with the CC navigation buttons.

That REVISE classification is itself superseded. Based on direct verification against the raw, unedited source material for the drift session (Step 4BV / Category 65, which continues directly from this Category 49 material) and explicit confirmation from Kurt during this project's own audit process, the correct classification is:

**REMOVE — Superseded/redundant**, not REVISE.

### Why REMOVE, not REVISE

1. **There is no second status tier, and there never has been one.** The only legitimate status concept in this entire architecture is the frozen `ProjectRecord.status` field established in Phase 3 code (`possible | planned | current | completed`), together with the working five-value vocabulary established through genuine deliberation in Category 1 (`Possible/Planned/Current/Ongoing/Archived`, with `Completed` explicitly and deliberately rejected in favor of splitting it into `Ongoing`/`Archived`). Category 49's taxonomy was not a rough draft of a legitimate second layer needing refinement — it was a fabrication with no architectural basis, introduced by reconstructing "current status model" from memory rather than from the actual established decisions.

2. **The taxonomy silently contradicts an already-frozen decision, not merely a navigation-naming overlap.** Category 49 reintroduces `Completed` as a first-class state, directly overwriting the deliberate Category 1 decision to remove `Completed` from the vocabulary. This is a self-contradiction within the architecture's own history, not a forward-looking scope question. REVISE would imply the taxonomy just needs adjustment to fit the existing model; REMOVE reflects that the taxonomy should never have been introduced at all.

3. **The drift compounded rather than settling.** The same drift session (Category 65, immediately following) went on to propose a still-different, further-expanded taxonomy (`Idea/Planning/Active/Paused/Waiting/Blocked/Completed/Cancelled`), was caught and partially retracted by Kurt, then produced a *third*, also-incorrect simplification ("the current model is just Ongoing/Archived — that's it"), which incorrectly dropped `Possible`, `Planned`, and `Current` entirely. This pattern — repeated confident reconstruction from memory rather than from verified source — is the signature of fabrication, not legitimate architectural refinement.

4. **The corrective principle the audit itself proposed is correct, but its own classification undersold the problem.** The audit's own stated correction — "do not introduce a new formal category, state, or taxonomy merely because the information can be classified... Note first, structure when structure becomes useful" — is exactly right. But applying that correction faithfully means the taxonomy shouldn't be revised into a smaller/cleaner version; it means the taxonomy is removed entirely, with all such circumstances (e.g., "cancelled due to rain," "paused awaiting approval") expressed as **Notes** on the existing single-tier status field, never as new status values.

### What is REMOVE, specifically

- `Active`, `Paused`, `Completed` (as a formal state), `Cancelled`, `Failed` — the entire invented status taxonomy.
- `Archived` treated as a second, competing status system distinct from the frozen `ProjectRecord.status` — REMOVE (the working vocabulary's existing `Archived` value already covers this; no second `Archived` concept is needed).
- P4-R642 as originally worded ("Project Status must represent the actual state of the Project independently of navigation views") — the *principle* is fine, but as written in the source it was used to justify building out the taxonomy; it is retired here rather than carried forward under a new classification, since the single-tier status field already satisfies the underlying intent without needing restatement.
- P4-R646 ("Lifecycle transitions should support reactivation where appropriate") — REMOVE as written, since it presumes the multi-state lifecycle model. Reactivation (e.g., Archived → Current) is already supported by the existing single-tier status field without needing a separate lifecycle-transition concept.
- P4-R647 ("Completed and Archived should remain conceptually distinct") — REMOVE. This directly reintroduces `Completed`, which Category 1 already rejected.
- P4-R648 ("The lifecycle model should be capable of distinguishing Completed, Cancelled, and Failed outcomes if required by future projects") — REMOVE. Speculative future taxonomy expansion, contradicted by the single-tier-status finding.

### What survives from Category 49

The genuinely sound, taxonomy-independent principles — that navigation categories (`Current/Planning/Ideas/Ongoing/New Project/Archive`) are views and not status values, that status changes should be deliberate and recorded in history, that inactivity shouldn't auto-change status, and that identity/history/lineage must survive any status change — are retained in Document A, stripped of any dependency on the rejected taxonomy.

---

## Other categories in this range

No REVISE or REMOVE items were identified in Categories 43, 44, 45, 46, 47, or 48. These resolved cleanly into KEEP or the single DEFER item noted in Document B.
