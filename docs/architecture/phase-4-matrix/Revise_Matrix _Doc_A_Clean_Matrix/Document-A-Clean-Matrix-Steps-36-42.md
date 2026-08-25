# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 36–42
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 36 — Attention, Flags & Blockers Escalation

- P4-R510 — CC must provide a prominent Attention area within Project operational state — KEEP-Foundation
- P4-R511 — Attention is a surfaced view, not a separate duplicate artifact type — KEEP-Foundation
- P4-R512 — Flags and Blockers must remain distinct classifications — KEEP-Foundation
- P4-R513 — Flags should be sufficiently prominent that unresolved potential problems are not silently deferred — KEEP-Foundation
- P4-R514 — AI may recommend escalation of a Flag to Blocker when evidence supports it — KEEP-Foundation
- P4-R515 — AI must not silently promote or demote Flags and Blockers — KEEP-Foundation
- P4-R516 — A Flag may be resolved without ever becoming a Blocker — KEEP-Foundation
- P4-R517 — A Blocker may be downgraded to a Flag when further investigation shows it does not actually prevent progress — KEEP-Foundation
- P4-R518 — Attention items should link to their underlying Flag, Blocker, Task, Deadline, or other source artifact — KEEP-Foundation
- P4-R519 — External Cutoffs may be surfaced through Attention when their timing makes them operationally significant — KEEP-Foundation

### Category 37 — Files, Sources & External Locations

- P4-R520 — CC must support multiple Source types for Project material — KEEP-Foundation
- P4-R521 — Sources may include local files/folders, repositories, cloud storage, external drives, web services, and external URLs — KEEP-Foundation
- P4-R522 — Project identity must be independent of physical file/folder location — KEEP-Foundation
- P4-R523 — Files may be associated with a Project without being physically moved into the Project's primary folder — KEEP-Foundation
- P4-R524 — Associating a file with a Project must be distinct from physically moving the file — KEEP-Foundation
- P4-R525 — CC Search should be capable of finding relevant Projects, Files, Repositories, storage locations, and associated AI Threads — KEEP-Foundation
- P4-R526 — Search should be capable of surfacing files discovered outside their registered Project locations — KEEP-Foundation
- P4-R527 — CC should identify potentially misplaced/unassociated project files without automatically relocating them — KEEP-Foundation
- P4-R528 — Storage Providers should be represented independently of any specific provider integration — KEEP-Foundation
- P4-R529 — CC should distinguish an unavailable storage location from a missing or deleted project resource — KEEP-Foundation
- P4-R530 — Repository records should support both external repository references and local repository locations — KEEP-Foundation

### Category 38 — What Belongs Inside CC vs. What Gets Referenced

- P4-R531 — CC must maintain its own Project Records and operational metadata — KEEP-Foundation
- P4-R532 — CC must distinguish its own project knowledge/records from the project's actual working files and resources — KEEP-Foundation
- P4-R533 — Project working files should remain in their actual storage locations unless the owner explicitly chooses to move them — KEEP-Foundation
- P4-R534 — CC should normally reference external project resources rather than ingesting or relocating them — KEEP-Foundation
- P4-R535 — CC-owned artifacts such as Decisions, Flags, Blockers, Tasks, Handovers, Reviews, Seeds, and Thread References should have their own durable records — KEEP-Foundation
- P4-R536 — Copies of external artifacts stored inside CC should preserve their provenance and relationship to the original — KEEP-Foundation
- P4-R537 — CC should not become a general-purpose file warehouse — KEEP-Foundation
- P4-R538 — CC's core data model must remain portable independently of the platform used to display/manage it — KEEP-Foundation
- P4-R539 — The Obsidian implementation must not make Obsidian the underlying architectural dependency — KEEP-Foundation

### Category 39 — AI Access, Authority & Permissions

- P4-R540 — CC must define distinct AI authority levels such as Read, Propose, Update, and Govern — KEEP-Foundation
- P4-R541 — AI must be able to read relevant CC information when authorized — KEEP-Foundation
- P4-R542 — AI should be able to propose changes, Tasks, Flags, or Decisions without those proposals becoming authoritative automatically — KEEP-Foundation
- P4-R543 — AI may directly update designated operational records when authorized — KEEP-Foundation
- P4-R544 — Authoritative Project Status and governance decisions must remain owner-controlled unless explicitly delegated — KEEP-Foundation
- P4-R545 — AI/Agent permissions must be configurable by project and role rather than universally hard-coded — KEEP-Foundation
- P4-R546 — Agent permissions must support narrower scopes than general AI access — KEEP-Foundation
- P4-R547 — AI and Agent actions must be attributable to the specific actor where practical — KEEP-Foundation
- P4-R548 — AI recommendations must not be represented as Kurt's decisions — KEEP-Foundation
- P4-R549 — AI/Agent permission changes and consequential actions should be represented in Project History — KEEP-Foundation

### Category 40 — Automation & Triggers

- P4-R551 — CC should support event-driven Automation and Triggers — KEEP-Foundation
- P4-R552 — Automations should be able to respond to meaningful project events — KEEP-Foundation
- P4-R553 — Automation must not grant authority beyond the configured AI/Agent permissions — KEEP-Foundation
- P4-R554 — Automations should support conditions in addition to triggers — KEEP-Foundation
- P4-R555 — Automations should be visible and inspectable by the user — KEEP-Foundation
- P4-R556 — Informational automations should be able to surface conditions without automatically changing governance state — KEEP-Foundation
- P4-R557 — Automated actions should identify their triggering event and executing AI/Agent — KEEP-Foundation
- P4-R558 — Automated actions should be recorded in Project History where consequential — KEEP-Foundation
- P4-R559 — Automation should fail honestly when its required permission, source, or dependency is unavailable — KEEP-Foundation

### Category 41 — Notifications & Signals

- P4-R560 — CC should distinguish Notifications from the persistent Attention state — KEEP-Foundation
- P4-R561 — Not every project event should generate a Notification — KEEP-Foundation
- P4-R562 — Signals may be surfaced in Attention without generating a Notification — KEEP-Foundation
- Notifications should have some concept of significance/severity (general principle; exact vocabulary open — see Document C) — KEEP-Foundation
- P4-R564 — Notifications should link directly to their underlying Project or artifact — KEEP-Foundation
- P4-R565 — Notification rules should be configurable — KEEP-Foundation
- P4-R566 — AI may recommend notification-policy changes but must not silently alter them — KEEP-Foundation
- P4-R567 — Notifications should support different persistence/acknowledgement behaviors — KEEP-Foundation
- P4-R568 — The top-level CC should be capable of surfacing significant notifications across Projects — KEEP-Foundation

### Category 42 — Search & Discovery

- P4-R569 — CC should provide global Search & Discovery across Project and CC-owned artifacts — KEEP-Foundation
- P4-R570 — Search should include Files, Projects, Repositories, Threads, Decisions, Tasks, Flags, Handovers, Sources, and related artifact types — KEEP-Foundation
- P4-R571 — Search should be capable of finding project-related resources outside registered Project locations — KEEP-Foundation
- P4-R572 — Search results should provide sufficient context to identify the result's Project, Location, Repository/Source, and relevant relationships where available — KEEP-Foundation
- P4-R573 — Search should support relationship/lineage-based discovery, not only literal text or filename matching — KEEP-Foundation
- P4-R575 — Search must distinguish "resource unavailable" from "no result found" — KEEP-Foundation
- P4-R576 — Search should respect access permissions and provider availability rather than implying access it does not possess (with the CC-indexed vs. live-provider-search distinction — see Document C) — KEEP-Foundation
- P4-R577 — Search should remain useful with a simple default experience; advanced filtering should be optional — KEEP-Foundation

---

## Cross-Category Architectural Foundations (Steps 36–42)

- Surface vs. Artifact — Attention and Notifications are surfaces/mechanisms pointing to underlying records; they should not duplicate those records
- Discovery vs. Ownership — finding something does not mean CC owns it, associates it with a Project, or should move it
- Observation vs. Governance — AI and automation can observe, identify, recommend, and surface conditions without automatically changing authoritative Project state
- Authority follows the Actor — every AI/Agent/automation action operates within explicitly defined authority
- Honest Failure — unavailable resources, integrations, and permissions must not be represented as empty results or silently ignored
- Search is a Discovery Layer — Search should eventually connect the entire CC ecosystem through artifact relationships, sources, locations, and lineage (Text → Artifact → Project → Relationship → Source → Location → Lineage)
