# Command Center — Session Start Guide

**Read this document before any implementation, review, or modification session.**

This document exists to establish repository identity, authority, architectural boundaries, and working rules before any collaborator — human or AI — begins work.

---

# 1. Repository Identity

This repository contains the **Command Center** project.

Command Center is a standalone project management, project observation, and AI collaboration system.

This repository owns:

* Command Center architecture
* Phase documentation
* Implementation specifications
* Source code
* Tests
* Obsidian plugin files
* Navigation and interface components
* Project record structures
* Supporting implementation infrastructure

---

# 2. Project Boundary: External Projects

Command Center may reference, observe, or use other projects as real-world test subjects, development references, or external project resources.

Those projects remain **separate and independent from Command Center**.

Command Center must not assume that any particular external project is uniquely privileged or architecturally part of Command Center.

An external project may be used to:

* validate Command Center behavior
* test project representation
* provide realistic project data
* demonstrate project-source relationships
* validate AI observation and collaboration concepts

This relationship does not mean:

* external project code belongs inside Command Center
* external project architecture is part of Command Center
* external project implementation decisions govern Command Center
* Command Center may restructure or control the external project's internal organization

The general relationship is:

```text
Command_Center
    |
    └── references / observes / validates against ──> External Project(s)

```

The specific external projects used for validation or reference may change over time.

The repository should therefore preserve the **architectural boundary**, not maintain a permanent list of external projects.

---

# 3. Repository Authority

The repository is the authoritative memory of the project.

A working session, AI context window, sandbox environment, or conversation history is temporary. Sandbox environments have been observed to reset entirely between sessions with no warning — this is expected, not an emergency, and nothing of value should ever depend on sandbox state surviving.

Do not trust previous session assumptions over the actual repository state.

Before beginning work:

1. Confirm the actual repository location.
2. Confirm the Git repository.
3. Run `git status`.
4. Confirm the current branch.
5. Confirm the latest commit.
6. Read this document.
7. Read the Master Implementation Index, then `docs/indexes/CC_Repository File Index.md` — the complete map of every authoritative file in the repository, so you don't have to rediscover or re-enumerate the repository's structure from scratch.
8. Check `CC_Working_Notes/` for any open architectural question relevant to the area you're about to touch. An open question recorded there is not resolved by inference, however reasonable the inference seems — it is resolved only by the process the note itself describes (typically a new ACP). This step exists because a genuinely open question has previously been silently re-derived, or nearly re-resolved by inference, more than once across different sessions and different AI collaborators.
9. Verify that the repository state matches the documented state.

Only then begin implementation work.

---

# 4. Git and Commit Rules

Git history is part of the project's recovery and continuity system.

Never:

* invent commit hashes
* report sandbox-local commits as repository commits
* assume files exist because a previous session claimed they existed
* modify files without knowing the current repository state
* reconstruct an existing document's content from memory when the live file can simply be read — a real incident occurred where doing this silently overwrote an accepted architectural decision with fabricated content before it was caught

If working in an environment without access to the actual repository:

* state that limitation explicitly
* do not claim repository verification
* do not provide authoritative commit information

A disconnected environment may verify code internally, but only the actual repository can establish project history.

A completion summary is not verification. Confirmed incidents exist of "no errors, all tests pass"-style reports later found false under direct, independent inspection of the actual pushed commit. Always verify the real artifact, not the report describing it.

---

# 5. AI Session Rules

AI collaborators must treat this repository as the source of truth.

Do not infer:

* repository structure from memory
* project relationships from conversation history
* implementation status from previous discussions
* architectural decisions from remembered conversations
* requirements from earlier versions of documents when a later authoritative document exists

Verify first.

If uncertain:

* ask before acting
* identify the uncertainty
* do not silently resolve ambiguity

Honest uncertainty is preferred over incorrect assumptions.

Before proposing new architecture, check whether an existing category, ACP, or governing document already resolves the question. This has been missed multiple times — always check first, propose second.

## Documentation Synchronization Protocol

Documentation synchronization is part of the work itself, not cleanup performed afterward.

For every meaningful Command Center update:

1. Identify all authoritative repository documents, registries, indexes, specifications, architecture records, status records, and other durable artifacts affected by the change.
2. Synchronize those affected artifacts in the same work cycle as the change itself.
3. Verify that the affected documentation remains internally consistent with the actual repository state.
4. Explicitly identify intentional non-changes when an apparently related authoritative artifact does not require modification.
5. Do not silently introduce new architecture while synchronizing documentation. If synchronization exposes a genuine architectural conflict or unresolved decision, stop and raise it for resolution rather than inventing a reconciliation.
6. Repository evidence takes precedence over memory or prior AI descriptions. Do not reconstruct authoritative documentation from memory when the repository artifact exists.
7. The completion test is:

> **If another AI opened this repository right now with no conversation history, would the authoritative documentation accurately describe the current architectural and implementation state?**

If the answer is no, the work is not complete.

### ACP-specific minimum

When an ACP is accepted, the following must be updated together in the same pass:

* the ACP record
* the Master Implementation Index ACP registry entry
* `SESSION_START.md` Section 16 ACP registry/current-status note

If other authoritative artifacts are affected by the ACP, those artifacts must be synchronized as well.

### Repository File Index maintenance

Adding, renaming, or removing any authoritative file (an ACP, a WP specification, an implementation note, a Matrix document, or a source file) requires updating `docs/indexes/CC_Repository File Index.md` in the same synchronization pass as the file's own change — not as a deferred follow-up. This index exists specifically so a fresh collaborator never has to rediscover the repository's structure from scratch; letting it drift out of date defeats its purpose.

### Approval state

When the Project Owner approves an architectural decision or document in conversation, treat that decision as approved immediately. The final material delivered after approval must already use accepted/current language — do not leave "proposed," "awaiting approval," "pending approval," "upon approval," or "decision pending" language for the Project Owner to remove manually later. If a document was originally drafted as a proposal and is subsequently approved, the repository-ready version must be converted completely to its accepted state in the same pass.

---

# 6. Project Status Authority

Project Status is a **single-tier model**.

The authoritative status field is:

```text
ProjectRecord.status

```

As of **ACP-009**, the implementation enum and the working navigational vocabulary have been unified. The authoritative values are:

```text
possible
planned
current
ongoing
archived

```

`completed` is **retired** and is not a valid value. It was removed, not deprecated — code should never emit or accept it. No automatic migration exists for any legacy `completed` value; if one is ever encountered, it requires the Project Owner's explicit manual reclassification (never an automatic or AI-inferred mapping).

The following are **not**, and have never been, formal Project Status values:

* Active
* Paused
* Cancelled
* Failed
* Completed (retired by ACP-009; formerly valid under the original Phase 3 four-value enum, no longer valid)

These must not be introduced as an alternative or second Project Status taxonomy.

A project circumstance that is not represented by the authoritative status field belongs in the appropriate Project information — such as Notes, Attention/Signals, Flags, Blockers, History, or other established records — rather than being converted into a new Status value.

The human project owner is the sole authority for assigning, changing, or approving a project's status.

AI collaborators may:

* observe project activity
* analyze project state
* identify possible status changes
* recommend a status transition
* raise Attention/Signals or Flags where appropriate

AI collaborators must not:

* independently change a project's status
* assume a project should advance because of activity level
* infer ownership decisions from file contents or repository activity
* invent new Project Status values
* automatically map a retired or legacy status value to a new one on the Project Owner's behalf

A Project Status change represents a change in Command Center's recorded understanding and presentation of the project.

It does not represent a filesystem operation.

Changing a project's status:

* updates the project's recorded state
* changes how Command Center presents and navigates that project
* affects project organization within the Command Center management layer

Changing a project's status does not:

* move project files
* rename folders
* reorganize repositories
* duplicate content
* alter the physical storage location of the project

The physical repository location of a project is independent from its Command Center status.

Command Center provides a management and observation layer above projects. It does not control or restructure the internal organization of the projects it observes.

**Metadata note:** The universal-tier `ProjectRecord` fields required for every status are `project_id`, `name`, `purpose`, `description`, `status`, and `focus`. `purpose` and `description` were formally established as universal-tier fields by **ACP-014**.

For `planned` and `current` statuses, the standard operational fields (`milestone`, `progress`, `next_action`, `blockers`) are required according to their existing tier rules. For `ongoing` and `archived` statuses, those standard operational fields are optional — they do not carry forward the Planned/Current tier's requirements. `blockers` specifically may be genuinely absent at these two statuses, unlike Planned/Current where it must be explicit (`null` or an array, never simply missing). Existing metadata must never be cleared or relocated merely because a project transitions into `ongoing` or `archived`.

---

# 7. Current Development Phase

Current project phase:

**Phase 4 — Implementation**

Current governing documents:

1. Phase 3 Architecture Record (frozen historical record)
2. Phase 4 WP specifications
3. Phase 4 Master Implementation Index (includes the Phase 4 ACP registry)
4. `docs/indexes/CC_Repository File Index.md` — the complete, living map of every authoritative file in the repository
5. Implementation Notes
6. Clean revised Phase 4 Matrix, including Step 65 incorporations
7. UI Architecture Specification (living document, actively reconciled against the Matrix)
8. Accepted ACP standalone records (`docs/architecture/ACP-*.md`)

**Current implementation status:** ACP-014 has been formally accepted and implemented. The universal `ProjectRecord` fields `purpose` and `description` are implemented across the canonical data model, validation, Obsidian provider mapping, and affected test fixtures. The implementation has been independently verified on the live `main` branch: TypeScript is clean, the build succeeds, and **147/147 tests pass**.

The ProjectRecord/provider/WP14/ACP-014 implementation arc is therefore closed. Further work proceeds from the current repository state and governing records; ACP-014 is not an open implementation item.

**ACP-015** has also been formally accepted (2026-09-30). It establishes "AI Progress Estimate" (required by P4-R323 for Workspace and P4-R802 for Dashboard) as a distinct, non-authoritative AI-output category — separate from Phase 3 Section E's two existing AI observation types (staleness, invalid absence of required fields) rather than an addition to them, and separate from the user-maintained `ProjectRecord.progress` field. A Project Dashboard (or Workspace) implementation specification may not be treated as implementation-ready until: (a) that specification makes AI Progress Estimate's exact derivation method and permitted inputs explicit and acceptance-testable — ACP-015 deliberately leaves this undefined, and (b) Phase 3 Section E's historical wording is reconciled or annotated to reflect ACP-015, since read alone it currently appears to exclude this now-accepted category. Neither of these is optional polish; both are named exit conditions of ACP-015 itself.

**ACP-016** has also been formally accepted (2026-10-01), resolving the long-OPEN P4-R797/P4-R798. It establishes that a requested `project_id` resolves to exactly one of three conditions — Missing, Invalid, or Duplicate identity — describing the underlying data condition rather than merely Dashboard's ability to produce a record, with the provider/data layer owning resolution and `CurrentObject` unchanged. A Project Dashboard implementation specification may not be treated as implementation-ready until it: (a) defines the actual provider interface/resolution mechanism and presentation treatment — ACP-016 deliberately leaves these undefined, and (b) satisfies the dual constraint of resolving P4-R797/P4-R798 while also unblocking Phase 3 Section E's existing invalid-absence observation capability, which ACP-016 found to be currently unimplementable under the provider's exclude-and-warn behavior. Both are named exit conditions of ACP-016 itself. (Note: WP15, below, subsequently established that ACP-016's requirements — "Track A" — and ACP-015's requirements — "Track B" — are independent; a Dashboard implementation specification does not need to resolve both at once, provided each track's own specification satisfies its own ACP.)

**WP15** — the Dashboard implementation specification for ACP-016's "Track A" (ProjectRecord resolution and presentation) — has been accepted (2026-10-02), after four drafting rounds each independently reviewed against the live repository and ACP-016's text. It proposes `resolveProjectRecord()`, a new method on the WP14 provider required to reuse the existing `discoverCandidates()`/`excludeDuplicateIds()` pipeline rather than re-implementing discovery or duplicate detection, and required to preserve the existing duplicate-before-validity ordering. `getProjectRecords()`'s contract is unaffected. WP15's specification is accepted; its implementation has not yet begun. Visual layout, component structure, and navigation/interaction behavior remain deliberately unspecified, per ACP-016 itself. WP15 explicitly does not cover ACP-015's "Track B" (AI Progress Estimate) — that remains separately unresolved and does not block WP15's implementation.

Frozen architectural decisions are not changed during implementation.

If implementation reveals a conflict with a frozen decision:

* do not silently adjust the implementation
* raise an Architecture Change Proposal (ACP)

---

# 8. Architectural Boundary — Command Center as an Orchestration Layer

Command Center is an orchestration, management, navigation, and observation layer.

CC must not become:

* the IDE
* the document editor
* the repository
* the cloud-storage system
* the AI provider
* the AI Agent itself

CC connects those things.

Specialized external applications remain responsible for their own specialized work.

The general interaction model is:

```text
CC → inspect / navigate / provide context
   → hand off to appropriate external system
   → external system performs specialized work
   → CC records or observes relevant project context

```

CC should manage relationships and context rather than unnecessarily replacing specialized tools.

---

# 9. Project Sources

The architectural model is:

```text
Project → Project Sources

```

not:

```text
Project → GitHub

```

and not:

```text
Project → Obsidian

```

A Project Source may represent:

* local filesystem material
* GitHub
* GitLab
* Bitbucket
* cloud storage
* application-specific storage
* Obsidian
* repositories
* documents
* workspaces
* backups
* reference sources
* future providers

The architecture must remain provider-independent.

A source has both:

* a **provider**
* a **role**

Provider and role are separate concepts.

Source integration is optional and domain-agnostic.

No external source is inherently required for a Project to exist.

---

# 10. Project Re-entry and Persistent Context

Persistent Project State is the primary mechanism for project re-entry.

Re-entry should provide enough operational context to answer:

> **Where was I, how was I doing this, and what do I do next?**

Re-entry context should be selective and operational rather than requiring the entire history of an AI conversation.

Project context is distinct from:

* Chat Threads
* Handover records
* external source content
* shared working context

These supporting artifacts provide provenance and additional context, but Project State remains primary.

---

# 11. AI Participants and Agents

AI is a participant in the Command Center architecture, not the owner of a Project.

AI Participants may have defined:

* read permissions
* write permissions
* suggestion permissions
* maintenance responsibilities
* project-specific roles
* attribution/provenance

Different AI Participants may have different roles on different Projects.

AI may contribute to designated operational information, maintain designated records, create session history or notes, and raise Flags.

AI may not independently convert Flags into Blockers or otherwise assume governance authority reserved for the Project Owner.

### AI Agents

AI Agents are optional first-class Project resources.

The architecture must support:

```text
0 Agents → few Agents → many Agents

```

Agents are distinct from ordinary AI Participants:

> **AI Participant — "Work with me."**

> **AI Agent — "Go do this job for me."**

Agents may have project-specific:

* scope
* role
* permissions
* assignment
* responsibilities

Agents are not limited to software projects.

Detailed Agent machinery and automation remain future capabilities unless explicitly brought into scope by an authoritative Phase specification.

---

# 12. Chat Threads and Handover

A Chat Thread is distinct from the identity of the AI provider.

The architecture must preserve:

> **which exact conversation**

not merely:

> **which AI**

The persistent relationship is:

```text
Project
   |
   └── Chat Thread
          |
          └── AI Participant / Agent

```

Multiple Chat Threads may exist for a Project.

Chat Threads should be identifiable and navigable.

A Handover is a traceable context-transition artifact.

The architectural relationship is:

```text
Source Thread
    ↓
Handover Prompt
    ↓
Receiving Thread
    ↓
Handover Assessment

```

A Handover may preserve:

* source thread
* receiving thread
* actual handover prompt
* reason
* scope
* supporting references
* source/target relationships
* receiving-AI assessment
* prompt version
* referenced Decisions, Files, Threads, or other Project artifacts

Handover is not disposable summary text.

It is provenance.

---

# 13. Shared Working Context

Shared Working Context is separate from Project Context.

It represents reusable information about how Command Center should work with its human project owner.

For example:

> **How to Work With Kurt**

This context may be reused across:

* Projects
* AI providers
* Chat Threads
* AI Participants
* Agents

It should not be unnecessarily duplicated into every Project.

Project-specific information belongs in Project Context.

Reusable working preferences and interaction context belong in Shared Working Context.

---

# 14. Phase 4 Matrix Authority

The Phase 4 matrix is an architectural and implementation planning artifact.

The revised matrix must distinguish:

* KEEP — Phase 4
* KEEP — Architectural Foundation
* DEFER
* REVISE
* REMOVE
* OPEN

A requirement classified as **DEFER** or **REMOVE** must not be silently reintroduced during Phase 4 implementation.

A requirement classified as **REVISE** must be implemented according to its revised authoritative wording, not the obsolete original wording.

An **OPEN** item remains undecided until an explicit architectural or project decision resolves it.

The clean revised matrix is the authoritative Phase 4 requirements reference for the portions that have been completed and accepted.

**Current matrix status:** Categories **1–64** are audited and stable. **Step 65 has been resolved** — treated as a completeness review of the existing matrix rather than a new "Category 65." It confirmed no missing overarching architectural domain, and its concrete findings were incorporated directly into their proper existing categories as **P4-R796 through P4-R802** (Categories 1, 12, 43, and 50), rather than forming a standalone section. Two previously open items (Category 1's status-transition question, Category 64's State-vs-Visibility distinction) were resolved and closed as part of this incorporation.

Step 65 was **not** the final step of the matrix, and no assumption should be made that the matrix is now complete — it is simply resolved through its current scope, with no defined "Step 66" currently pending. Do not treat any specific step number as an assumed endpoint.

Since Step 65, further architectural work has proceeded through the **ACP (Architecture Change Proposal) process** rather than continued matrix numbering — see Section 16.

Therefore:

* Categories 1–64, with Step 65's P4-R796–802 incorporated, form the current stable matrix foundation
* unresolved (OPEN) material must not be treated as authoritative Phase 4 requirements
* architectural questions arising after the matrix's current scope are resolved via ACP, not by extending the matrix further

The separate Clean Matrix documents covering Categories 1–64 may be consolidated into a single clean matrix artifact when appropriate, but consolidation does not change their authority or status.

**Note on Category 35 (Reviews, Checkpoints & Project Progress) and Category 18 (Project Workspace Editing & Permissions):** these categories, both `KEEP-Foundation`, contain AI-related safeguards (P4-R249–250, P4-R496–499) that bear directly on AI-generated progress/completion output. They were not connected to P4-R323/P4-R802's "AI Progress Estimate" requirement until that connection was traced during the ACP-015 reconciliation. Before treating any AI-observation or AI-estimate question as newly discovered, check both of these categories in addition to Section E.

---

# 15. Phase 4 Architectural Principles Established by Audit

The Steps 1–64 audit, Step 65, and the subsequent ACP process have established the following architectural principles:

* **Command Center is an orchestration layer** — CC connects projects, sources, applications, AI Participants, Agents, Threads, and other resources rather than replacing them.
* **Project Sources are provider-independent** — a Project has Sources; GitHub, Obsidian, local filesystems, cloud systems, and other providers are implementations of that broader concept.
* **Provider and Source Role are separate concepts** — CC should know both who/what provides a source and what role that source plays for the Project.
* **Project context is operational** — Project Type, technology/stack, tools, Sources, AI Participants, Agents, and related information may eventually influence how CC presents and connects Project artifacts.
* **AI is a participant, not the owner** — AI may read, contribute, suggest, maintain designated information, and raise Flags within defined authority; Project governance remains human-controlled.
* **Agents are first-class but optional** — the architecture must accommodate Projects using zero, few, or many Agents.
* **Chat Threads are distinct from AI identity** — CC must preserve the identity of the exact conversation, not merely the provider or AI involved.
* **Handover is a traceable artifact** — Source Thread → Handover Prompt → Receiving Thread → Assessment should remain identifiable.
* **Shared Working Context is separate from Project Context** — reusable "How to Work With Kurt" information should not be duplicated into every Project.
* **Persistent Project State is primary for re-entry** — Threads, Handovers, and other supporting artifacts provide provenance and additional context but do not replace Project State.
* **The Project Status model remains single-tier** — a proposed second status taxonomy silently contradicted the frozen status model and was removed, not merely revised, during the original audit. The authoritative `ProjectRecord.status` field remains the sole formal Project Status field, now at five values per ACP-009.
* **Status is not navigation** — top-level organizational/navigation categories and Project Status are separate concepts and must not be conflated. This extends to the navigation type system itself: `Depth` (a navigation-tree position, now including `"gateway"` per ACP-012) and `CurrentObject.kind` (an object identity, including `"category"` for status-scoped Project List views) are unrelated concepts that happen to have shared a literal string historically — they must never be conflated even where their names once overlapped.
* **CC must not silently reconstruct frozen architecture from memory** — when an authoritative implementation or architecture record exists, it takes precedence over remembered discussions or earlier drafts. A real incident occurred where reconstructing a live document from memory instead of reading it silently fabricated content overwriting an accepted decision; it was caught only through independent verification before anything was committed.
* **The human owner remains the final authority on governance decisions** — AI may analyze and recommend but must not silently establish authoritative Project governance.
* **Command Center must not silently manufacture project truth** — this applies to both representation and authority. When required project data is missing or invalid, CC must fail honestly rather than substitute fabricated, stale, or misleading content; AI-generated estimates and recommendations must remain visibly distinguishable from authoritative data and must never be silently converted into it.
* **Before adding new architecture, check whether an existing category or ACP already covers it** — this has been missed multiple times, each time only caught through direct verification against the existing matrix or registry, never through inspection alone. Checking first is cheaper than discovering the duplication later.
* **Accepted requirements across different Matrix categories or tiers are not automatically reconciled with each other** — P4-R323/P4-R802 (AI Progress Estimate) sat formally accepted for a real stretch alongside Category 35/18's AI-estimate safeguards and Phase 3 Section E's narrower observation boundary, with no one connecting the three until ACP-015. A requirement being accepted somewhere does not mean it has been checked against every other accepted requirement that touches the same concept — that check is a distinct step, not implied by acceptance.

* **Navigation state changes must never be content-driven** — a render outcome, including a `ProjectRecord` resolution result (resolved, missing, invalid, or duplicate), must never itself cause a `NavigationState` transition. Navigation-state changes originate only from explicit user-initiated navigation actions. This is a deliberate architectural constraint, established by the Project Owner specifically to prevent a render → navigation-state-change → render feedback loop — it is not merely an absence of a content-driven navigation feature, and the correct response to "no such mechanism currently exists" is "don't add one," not "we could add one." The current implementation honors this: every `NavigationController` state-mutating method (`selectCategory`, `selectProject`, `pageNext`, `pagePrevious`, `goUp`, `goTop`) is invoked only from explicit UI interaction, never from a content/resolution outcome; rendering reads navigation state but never writes it.

---

# 16. Frozen Architecture and Change Control

Frozen architectural decisions remain frozen during implementation.

If a requirement, implementation detail, or newly discovered behavior appears to conflict with a frozen decision:

1. Stop.
2. Identify the conflict.
3. Do not silently reinterpret the architecture.
4. Raise an Architecture Change Proposal (ACP) if an actual architectural change is required.

A new implementation preference is not automatically an architectural change.

A new rendering, presentation, or implementation technique may be adopted when it remains consistent with the frozen architecture.

**ACP Registry summary** (full records in `docs/architecture/`, index in the Master Implementation Index; Phase 3's own ACP-001–007 remain in the Phase 3 Architecture Record's registry, unedited, per the historical-record rule below):

* **ACP-008** — Metadata Cache treated as a platform-level read mechanism, not an application-level cache.
* **ACP-009** — `ProjectRecord.status` reconciled to five values (`possible | planned | current | ongoing | archived`); `completed` retired; no automatic migration authorized.
* **ACP-010** — Category-level sibling paging retired (`getCategorySiblings()` and `CATEGORY_ORDER` both removed); project-level sibling paging retained.
* **ACP-011** — Gateway destination-to-view mapping; Category Screen retirement trigger defined (requires all four status-mapped views plus Ideas' `possible`-record exposure, not just the four views alone).
* **ACP-012** — Root navigation `Depth` literal renamed from `"category"` to `"gateway"` (pure semantic rename; `CurrentObject.kind: "category"` unaffected and unrelated).
* **ACP-013** — New Project established as a distinct workflow entry point existing entirely outside `NavigationState` (no new `CurrentObject` kind or `Depth` value); the orientation bar hides while it is active; entry, Cancel, and exit require no navigation-state changes.
* **ACP-014** — `purpose` and `description` established as universal-tier `ProjectRecord` fields, required at every status alongside `project_id`, `name`, `status`, and `focus`. The decision was formally accepted and subsequently implemented across the canonical data model, validation, provider mapping, and affected test fixtures. Implementation is independently verified and closed.
* **ACP-015** — "AI Progress Estimate" (required by P4-R323 for Workspace and P4-R802 for Dashboard) established as a distinct, non-authoritative AI-output category, separate from Phase 3 Section E's two existing AI observation types (staleness, invalid absence) and from the user-maintained `ProjectRecord.progress` field. Must be labeled as an estimate, must never become authoritative Project Status, must remain subordinate to observable indicators (per Category 35's P4-R496–499), and must fail honestly rather than fabricate a value when available information is insufficient. Reconciles P4-R323/P4-R802 with Section E and with Category 35/18's AI-estimate safeguards, none of which had previously been connected to one another. The exact derivation method and permitted inputs are deliberately left to the Dashboard/Workspace implementation specifications, which must make them explicit and acceptance-testable before implementation begins. Phase 3 Section E's original wording has not yet been amended or annotated to reflect this ACP — until it is, Section E read alone will appear to exclude this now-accepted category; ACP-015 governs regardless.
* **ACP-016** — Resolves P4-R797/P4-R798 (Dashboard presentation of a missing/invalid ProjectRecord), OPEN since before Step 65. Establishes a three-way resolution taxonomy for a requested `project_id`: Missing (no identifiable resource), Invalid (one resource, fails validity), Duplicate identity (more than one resource — a relational uniqueness failure, distinct from either Missing or Invalid). Assigns resolution ownership to the provider/data layer; `CurrentObject` is unchanged and carries no resolution state or history. Requires the data layer to expose per-`project_id` resolution condition plus diagnostic detail sufficient for Invalid and Duplicate (interface not chosen); requires Dashboard to present an honest, explicit unresolved state distinguishing all three conditions (visual layout and interaction behavior not chosen). Confirms no amendment to Phase 3 Section E, but identifies that Section E's existing invalid-absence observation capability is currently unimplementable under the provider's exclude-and-warn behavior — unblocking it is now an explicit acceptance constraint on the eventual Dashboard implementation specification, alongside P4-R797/P4-R798 themselves.

The Phase 3 Architecture Record itself is **never edited** to reflect later ACPs — it remains the accurate historical record of what Phase 3 froze at the time. Later ACPs are the mechanism by which that frozen model is formally extended or reconciled; they do not rewrite history.

---

# 17. Command Center Concept Overview

Command Center (CC) is a standalone project.

It provides a management, observation, navigation, and AI collaboration layer for projects.

External projects may be used as validation projects to demonstrate that Command Center can successfully represent, organize, and observe real projects.

The purpose of connecting Command Center to external projects is validation and operation:

* Can Command Center load a real project?
* Can Command Center display meaningful project state?
* Can Command Center demonstrate that the architecture works with an actual project?
* Can Command Center maintain useful project context across tools and AI collaborators?

External projects remain independent.

The fact that Command Center references external project files for testing or operation does not make those projects part of the Command Center codebase or architecture.

---

# 18. Command Center Visual Concept

> **Relationship to the Phase 3 Architecture Record — read this first.**
>
> The visual concept below describes the intended **presentation layer** and user experience metaphor. It does not override, replace, or modify anything in the frozen Phase 3 Architecture Record.
>
> Phase 3 defines the underlying application architecture: the object model, navigation relationships, and the persistent orientation element. Phase 3's originally-frozen entry point into that hierarchy — the Category Screen — has since been formally superseded as the root navigation surface by the **Gateway** (a fixed six-destination grid: Current, Planning, Ideas, Ongoing, New Project, Archive) per ACP-011 and ACP-012. The deeper hierarchy — Project List → Dashboard → Workspace — remains as Phase 3 defined it. ACP-011's Category Screen retirement trigger has since been satisfied and the legacy Category Screen implementation has been explicitly retired and removed from the repository. Gateway is the authoritative root navigation surface.
>
> This section defines how those same objects, states, and relationships may eventually be *rendered* — sticky notes, connectors, flow paths, a visual workspace — as a rendering and interaction model, not a competing data or navigation model. A future visual board still represents the same underlying objects Phase 3 (as extended by later ACPs) defines; it does not introduce a second architecture alongside it.
>
> This distinction exists in the document explicitly so that this section is never read as silently superseding Phase 3 or its ACP extensions in a future session. If a future implementation step appears to require an actual architectural change (not just a new rendering) to accommodate this vision, that still requires an ACP — this note does not pre-authorize one.

The intended user experience for Command Center is a visual project command board.

The primary metaphor is a physical planning board:

* a large workspace surface
* visual flow structures
* connected stages or areas
* sticky-note-style project elements
* movement through project states represented visually

The user experience should feel like:

* a project planning wall
* a visual flowchart
* a command center
* an intuitive workspace

It should not feel like:

* a database viewer
* a spreadsheet
* a folder browser
* a collection of disconnected documents

Projects, tasks, milestones, decisions, and status changes should be represented as visual elements on the board.

The visual system may include:

* sticky notes
* cards
* connectors
* flow paths
* status areas
* navigation elements

The visual representation is not decoration. It is the primary interface for understanding project state.

The underlying architecture, data model, repository structure, and AI observation layer exist to support this visual experience.

---

# 19. Implementation Perspective

Do not confuse the current implementation mechanism with the final user experience.

Current implementation foundation:

* Obsidian
* Markdown files
* TypeScript
* Git
* ProjectRecord data structures

User-facing goal:

* a visual project operating surface
* flow visualization
* intuitive project navigation
* AI-assisted understanding of project state

The technology is the foundation.

The visual command board is the product experience.

---

# Final Rule

Before changing anything:

**Verify the repository.
Verify the files.
Verify the governing documents.
Verify the authoritative architecture, the current matrix boundary, and the ACP registry.
Then implement.**