# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 29–35
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 29 — Decisions & Architectural Memory

- P4-R433 — CC must maintain durable Project Decision Records independent of individual AI conversations — KEEP-Foundation
- P4-R434 — Decisions are the authoritative record of established project choices — KEEP-Foundation
- P4-R435 — Supporting AI threads, handovers, notes, and documents may be linked as Decision evidence/context — KEEP-Foundation
- P4-R436 — Decision Records should have stable identifiers — KEEP-Foundation
- P4-R437 — Decisions should support lifecycle states such as Proposed, Under Review, Established, Superseded, and Rejected — KEEP-Foundation
- P4-R438 — AI may recommend or analyze Decisions but must not silently establish or supersede owner-controlled Decisions — KEEP-Foundation
- P4-R439 — Superseded Decisions must remain historically preserved — KEEP-Foundation
- P4-R440 — Architectural Decisions should be identifiable separately from ordinary project decisions — KEEP-Foundation
- P4-R441 — New AI sessions should be able to retrieve established Decisions without reconstructing them from historical chat threads — KEEP-Foundation

### Category 30 — Project History / Audit Trail

- P4-R442 — CC must maintain a meaningful Project History / Audit Trail — KEEP-Foundation
- P4-R443 — History should record meaningful project events rather than every low-level interaction — KEEP-Foundation
- P4-R444 — Meaningful events should preserve timestamp, actor/source, and relevant project/artifact relationships where available — KEEP-Foundation
- P4-R445 — History must distinguish human actions, AI actions, Agent actions, and CC/system actions where applicable — KEEP-Foundation
- P4-R446 — Historical events should be append-only or otherwise preserve their original state — KEEP-Foundation
- P4-R447 — Corrections should be recorded as subsequent events rather than silently rewriting history — KEEP-Foundation
- P4-R449 — History should provide navigable links to related Decisions, Flags, Blockers, Threads, Handovers, Files, and Sources where applicable — KEEP-Foundation

### Category 31 — Project Relationships & "Tentacles"

- P4-R450 — CC must support explicit relationships between Projects — KEEP-Foundation
- P4-R451 — Project relationships must be based on stable Project IDs rather than physical folder locations — KEEP-Foundation
- P4-R452 — Relationships should have a defined semantic type where useful — KEEP-Foundation
- P4-R453 — A project-related issue or "tentacle" does not automatically become a separate Project — KEEP-Foundation
- P4-R454 — A Project may spawn or generate new Projects when a related effort becomes sufficiently substantial — KEEP-Foundation
- P4-R455 — Projects may share dependencies, services, resources, or supporting projects — KEEP-Foundation
- P4-R456 — Project relationships may cross Project Status categories — KEEP-Foundation
- P4-R457 — Archived Projects may remain sources for future Projects — KEEP-Foundation
- P4-R458 — New Projects may preserve lineage to their originating Project or Seed — KEEP-Foundation
- P4-R459 — Project relationships must remain independent of physical file/folder movement — KEEP-Foundation

*(Note: "Tentacles" is Kurt's informal term for offshoots/related efforts, not formal architectural terminology — per the audit.)*

### Category 32 — Seeds & Project Lineage

- P4-R460 — CC must support explicit Project Seeds — KEEP-Foundation
- P4-R461 — A Seed represents a reusable artifact, concept, technique, resource, or other project-derived asset — KEEP-Foundation
- P4-R462 — Seeds may originate from Ongoing, Archived, or other project states — KEEP-Foundation
- P4-R463 — Seeds must preserve their originating Project ID and lineage — KEEP-Foundation
- P4-R464 — A Seed may be reused by multiple Projects — KEEP-Foundation
- P4-R465 — Reusing a Seed must not destroy or alter the original Seed's lineage — KEEP-Foundation
- P4-R467 — A Seed may eventually be promoted into a reusable Project Template — KEEP-Foundation
- P4-R468 — Failed, abandoned, or superseded Projects may still produce valuable Seeds — KEEP-Foundation
- P4-R469 — Archived Projects must remain accessible as potential sources of Seeds — KEEP-Foundation

### Category 33 — Project Templates & the "New Project" Canvas

- P4-R470 — CC must support reusable Project Templates — KEEP-Foundation
- P4-R471 — Templates must provide a starting structure for new projects rather than merely being documentation — KEEP-Foundation
- P4-R472 — New Project creation should provide a working canvas suitable for incomplete/spitballing information — KEEP-Foundation
- P4-R473 — A New Project canvas may initially exist within Ideas without requiring full project definition — KEEP-Foundation
- P4-R474 — New Projects should be creatable from a Blank Project, Template, Seed, or potentially an Existing Project — KEEP-Foundation
- P4-R475 — Templates must be domain-agnostic at the architectural level — KEEP-Foundation
- P4-R476 — Different templates may expose different domain-relevant fields while using the common Project model — KEEP-Foundation
- P4-R477 — Templates must be user-extensible/customizable — KEEP-Foundation
- P4-R479 — Creating a project from a Seed must preserve Seed origin and Project lineage — KEEP-Foundation
- P4-R480 — Template/Seed reuse must not require physically moving the source project's files — KEEP-Foundation

### Category 34 — Tasks, Actions & Next Actions

- P4-R481 — CC must support Tasks/Actions associated with Projects — KEEP-Foundation
- P4-R482 — Tasks must be logically associated with Project IDs rather than physical folders — KEEP-Foundation
- P4-R483 — CC must distinguish the broader Task list from the project's immediate Next Action — KEEP-Foundation
- P4-R484 — Next Action should be prominent within project operational state — KEEP-Foundation
- P4-R485 — AI and Agents may propose Tasks and Next Actions — KEEP-Foundation
- P4-R486 — AI/Agents may update task state based on work they actually perform — KEEP-Foundation
- P4-R487 — Kurt remains the final arbiter of project priorities and what should happen next — KEEP-Foundation
- P4-R488 — Task completion must not automatically imply Project completion or Status change — KEEP-Foundation
- P4-R489 — Tasks may originate from Decisions, Flags, Blockers, meetings, AI discussions, or other project artifacts — KEEP-Foundation
- P4-R490 — Tasks may be linked to their originating artifact/source where useful — KEEP-Foundation
- P4-R491 — Tasks should remain lightweight; CC should not become unnecessarily dependent on a full task-management system — KEEP-Foundation

### Category 35 — Reviews, Checkpoints & Project Progress

- P4-R492 — CC should support periodic Project Reviews — KEEP-Foundation
- P4-R493 — Reviews should record observations separately from owner-controlled Project Status — KEEP-Foundation
- P4-R494 — CC should support explicit Project Checkpoints for meaningful milestones — KEEP-Foundation
- P4-R495 — Reviews and Checkpoints should remain historically preserved — KEEP-Foundation
- P4-R496 — CC must not treat AI-generated observations as authoritative Project Status — KEEP-Foundation
- P4-R497 — Observable project metrics should be distinguished from AI-estimated overall completion percentages — KEEP-Foundation
- P4-R498 — AI-generated completion percentages must be explicitly labeled as estimates if used — KEEP-Foundation
- P4-R499 — CC should favor observable indicators (Tasks, Flags, Blockers, Decisions, activity) over a single synthetic score — KEEP-Foundation
- P4-R500 — AI may identify patterns, risks, stale Flags, recurring Tasks, or other noteworthy conditions during Reviews — KEEP-Foundation
- P4-R501 — AI observations during Reviews must not silently alter Kurt-controlled Project Status — KEEP-Foundation
- P4-R502 (final) — CC must support External Cutoffs as distinct from internally chosen goals or target dates — KEEP-Foundation
- P4-R503 (final) — An External Cutoff represents a date imposed by an external event, requirement, commitment, or circumstance — KEEP-Foundation
- P4-R504 (final) — External Cutoffs must be prominently visible in the project's operational state — KEEP-Foundation
- P4-R505 (final) — CC should calculate objective time remaining until an External Cutoff — KEEP-Foundation
- P4-R506 (final) — AI should be able to identify potential schedule/context conflicts involving an External Cutoff — KEEP-Foundation
- P4-R507 (final) — AI must not automatically declare a project Blocked, Failed, or otherwise change its Status because of an approaching External Cutoff — KEEP-Foundation
- P4-R508 (final) — An External Cutoff should optionally record its source and consequence — KEEP-Foundation
- P4-R509 (final) — Internally chosen goals and target dates must remain distinguishable from External Cutoffs — KEEP-Foundation

*(Note: IDs P4-R502–509 were reused between the original "Deadlines" wording and the final "External Cutoffs" correction. Only the final version is listed above. See Document C.)*

---

## Cross-Category Architectural Foundations (Steps 29–35)

- Decision → what was deliberately decided (authoritative)
- History → what happened (chronological connective tissue)
- Relationship → how Projects connect (a network, not a tree)
- Seed → reusable value from a Project (Archived ≠ dead)
- Template → prepared starting structure (distinct from Seed)
- Task → work that exists; Next Action → what should happen next (distinct concepts)
- Review → observation, not a verdict; Checkpoint → meaningful milestone, not a status change
- External Cutoff → externally imposed time constraint, distinct from internally chosen goals
- Project Status remains Kurt's (the Project Owner's) authoritative determination throughout
