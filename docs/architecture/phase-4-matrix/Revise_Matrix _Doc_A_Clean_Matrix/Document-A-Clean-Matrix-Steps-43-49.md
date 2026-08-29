# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 43–49  
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

**Important note on this chunk:** Category 49 contains the confirmed architectural drift point. Only the portion of Category 49 verified as sound (navigation ≠ status, as a general principle) is included below. The invented status taxonomy (Active/Paused/Completed/Cancelled/Failed) is classified REMOVE, not REVISE — see Document C for the full rationale, which supersedes the original audit's REVISE classification for this category.

---

### Category 43 — The Project Dashboard

- P4-R578 — Each Project must have a Dashboard providing an immediate operational overview — KEEP-Phase4
- P4-R579 — Dashboard design must prioritize "See first. Read second." — KEEP-Phase4
- P4-R580 — Dashboard must distinguish Purpose, Description, and Focus — KEEP-Phase4
- P4-R581 — "Where Things Stand" must be the central operational section — KEEP-Phase4
- P4-R802 — The Dashboard must automatically display the AI Progress Estimate within its Where Things Stand section when the Dashboard is opened — KEEP-Phase4
- P4-R582 — Attention must be part of the overall "Where Things Stand" area rather than a subordinate subsection — KEEP-Phase4
- P4-R583 — Dashboard information should reference underlying CC records rather than duplicate their content — KEEP-Phase4
- P4-R584 — Dashboard presentation should adapt to relevant project characteristics without changing the underlying common Project model — KEEP-Phase4
- P4-R585 — Empty/non-applicable information should not create unnecessary Dashboard clutter — KEEP-Phase4
- P4-R586 — Dashboard should surface both AI-maintained operational information and Kurt-controlled governance information — KEEP-Phase4
- P4-R796 — Missing or invalid ProjectRecord data must fail honestly rather than silently degrade or manufacture project information — KEEP-Phase4
- P4-R587 — Dashboard should provide direct navigation to relevant Sources, Threads, Decisions, Tasks, Flags, Blockers, Handovers, and History — KEEP-Phase4
- P4-R588 — Dashboard must remain a view of the underlying Project data rather than becoming a second source of truth — KEEP-Phase4

### Category 44 — Project Workspace / Drill-Down

- P4-R589 — Each Project should provide a detailed Workspace accessible from its Dashboard — KEEP-Phase4
- P4-R590 — Workspace should provide deeper access to project resources without overloading the Dashboard — KEEP-Phase4
- P4-R591 — Workspace views should be capable of exposing Files, Tasks, Decisions, AI/Threads, History, and Sources — KEEP-Phase4
- P4-R592 — Workspace should preserve Project context while navigating among related resources — KEEP-Phase4
- P4-R593 — Relationships between CC artifacts and external resources should be navigable from the Workspace — KEEP-Phase4
- P4-R594 — Thread References should provide enough metadata to identify their purpose and project relevance — KEEP-Phase4
- P4-R595 — CC should launch/hand off to specialized external applications rather than attempting to replace them — KEEP-Phase4
- P4-R596 — File editing should support an "Edit Using" mechanism appropriate to the actual file type and available Mac applications — KEEP-Phase4
- P4-R597 — Application choices should not be hard-coded around assumptions about file types — KEEP-Phase4

### Category 45 — History, Audit Trail & "What Happened?"

- P4-R598 — CC must maintain a Project History/Audit Trail of meaningful project events — KEEP-Foundation
- P4-R599 — History must distinguish events from ordinary Notes — KEEP-Foundation
- P4-R600 — Meaningful changes to Project state and CC artifacts should be recorded in History — KEEP-Foundation
- P4-R601 — History events should identify the actor responsible for the event where practical — KEEP-Foundation
- P4-R602 — Important changes should preserve before/after state where useful — KEEP-Foundation
- P4-R603 — Historical records should not be silently rewritten; corrections should preserve provenance — KEEP-Foundation
- P4-R604 — AI-generated events must clearly identify the AI/Agent responsible — KEEP-Foundation
- P4-R605 — AI actions must not be represented as actions taken by Kurt unless Kurt actually performed/authorized that action — KEEP-Foundation
- P4-R606 — History should be searchable and connected to related artifacts — KEEP-Foundation
- P4-R608 — History should record meaningful project events rather than low-value UI/activity telemetry — KEEP-Foundation

### Category 46 — Project Seeds, Lineage & Reuse

- P4-R609 — CC must distinguish Archived Projects from discarded/irrelevant material — KEEP-Foundation
- P4-R610 — Archived Projects may remain sources of reusable material for future Projects — KEEP-Foundation
- P4-R611 — CC must support the concept of a reusable Project Seed — KEEP-Foundation
- P4-R612 — Seeds must preserve their origin/provenance — KEEP-Foundation
- P4-R613 — CC should record relationships between Seeds and Projects that reuse them — KEEP-Foundation
- P4-R614 — Seed relationships should support reuse, fork, reference, and extraction concepts where useful — KEEP-Foundation
- P4-R615 — Seeds may originate from active, archived, failed, experimental, or otherwise non-completed Projects — KEEP-Foundation
- P4-R616 — Seeds should be independently discoverable rather than hidden solely inside their originating Project — KEEP-Foundation
- P4-R617 — Seeds may have versions/iterations while preserving lineage — KEEP-Foundation
- P4-R618 — CC's own portable architecture should be representable as a reusable Seed — KEEP-Foundation
- P4-R619 — AI handover processes/prompts may themselves become reusable Seeds — KEEP-Foundation

### Category 47 — Templates, Kernels & Seed vs. Template

- P4-R620 — CC must distinguish Templates from Seeds — KEEP-Foundation
- P4-R621 — A Template represents reusable structure for creating a new Project — KEEP-Foundation
- P4-R622 — A Seed represents reusable substantive material derived from an existing source Project or other source — KEEP-Foundation
- P4-R623 — A Kernel should represent a particularly fundamental reusable core and may be treated as a specialized Seed — KEEP-Foundation
- P4-R624 — Templates should not inherit project-specific Tasks, Flags, Blockers, Decisions, Threads, or History unless explicitly designed to do so — KEEP-Foundation
- P4-R625 — Kernels may intentionally contain reusable architectural/implementation decisions — KEEP-Foundation
- P4-R626 — A Project may be created from a Template, a Seed/Kernel, or both — KEEP-Foundation
- P4-R627 — Seeds should be deliberately designated rather than automatically generated from every archived Project — KEEP-Foundation
- P4-R628 — AI may identify potential reusable Seeds but should not automatically designate them as authoritative Seeds — KEEP-Foundation
- P4-R629 — Command Center should be capable of producing reusable Template, Seed, and Kernel artifacts from its own development — KEEP-Foundation

### Category 48 — Project Creation & the New Project Workflow

- P4-R630 — CC must provide a lightweight New Project creation workflow — KEEP-Phase4
- P4-R631 — A reusable New Project canvas/template may exist within Ideas — KEEP-Phase4
- P4-R632 — New Project creation should not require completion of a large setup form before work can begin — KEEP-Phase4
- P4-R633 — An Idea should be promotable to a Project without losing its existing context/history — KEEP-Phase4
- P4-R634 — Not every Idea must become a Project — KEEP-Phase4
- P4-R635 — Project creation should optionally support Blank, Template, Seed, Kernel, Template + Seed, and Existing Project/Fork starting points — KEEP-Phase4
- P4-R636 — Projects created from existing Projects must preserve their lineage/relationship — KEEP-Phase4
- P4-R637 — Forking a Project must not silently inherit historical operational state such as Tasks, Flags, Blockers, or History — KEEP-Phase4
- P4-R638 — AI may assist Project initialization but must not silently establish authoritative Project governance — KEEP-Phase4
- P4-R639 — A stable Project identity should be created early enough to associate emerging Sources, Threads, and other artifacts — KEEP-Phase4

### Category 49 — Project Lifecycle & State Transitions (PARTIAL — see Document C)

Only the validated, taxonomy-independent principles are retained here:

- P4-R640 — CC must distinguish Project Status from top-level navigation/organizational categories — KEEP-Foundation
- P4-R641 — New Project is an action/workspace, not a Project Status — KEEP-Foundation
- P4-R643 — Project lifecycle transitions should be deliberate and recorded in History — KEEP-Foundation
- P4-R644 — Inactivity should not automatically change Project Status — KEEP-Foundation
- P4-R645 — AI may identify apparent inactivity and surface it as Attention/Signal without automatically changing Status — KEEP-Foundation
- P4-R649 — Lifecycle transitions must preserve Project identity, History, and lineage — KEEP-Foundation

**Excluded from this chunk (see Document C for full rationale):** P4-R642 (as originally worded, since it presumes a lifecycle model beyond the frozen status field), P4-R646, P4-R647, and P4-R648 — all of which depend on or reintroduce the invented status taxonomy (Active/Paused/Completed/Cancelled/Failed/Archived-as-second-system). The authoritative status model remains the single, frozen `ProjectRecord.status` field (`possible/planned/current/completed` per Phase 3 code) together with the five-value working vocabulary established in Category 1 (`Possible/Planned/Current/Ongoing/Archived`). No second status tier exists or is needed; any project circumstance not captured by that single field belongs in a Note, not a new status value.