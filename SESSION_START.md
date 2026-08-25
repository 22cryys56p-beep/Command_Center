# Command Center — Session Start Guide

**Read this document before any implementation, review, or modification session.**

This document exists to establish repository identity, authority, architectural boundaries, and working rules before any collaborator — human or AI — begins work.

---

# 1. Repository Identity

This repository contains the **Command Center** project.

Command Center is a standalone project management, project observation, and AI collaboration system.

This repository owns:

- Command Center architecture
- Phase documentation
- Implementation specifications
- Source code
- Tests
- Obsidian plugin files
- Navigation and interface components
- Project record structures
- Supporting implementation infrastructure

---

# 2. Project Boundary: External Projects

Command Center may reference, observe, or use other projects as real-world test subjects, development references, or external project resources.

Those projects remain **separate and independent from Command Center**.

Command Center must not assume that any particular external project is uniquely privileged or architecturally part of Command Center.

An external project may be used to:

- validate Command Center behavior
- test project representation
- provide realistic project data
- demonstrate project-source relationships
- validate AI observation and collaboration concepts

This relationship does not mean:

- external project code belongs inside Command Center
- external project architecture is part of Command Center
- external project implementation decisions govern Command Center
- Command Center may restructure or control the external project's internal organization

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

A working session, AI context window, sandbox environment, or conversation history is temporary.

Do not trust previous session assumptions over the actual repository state.

Before beginning work:

1. Confirm the actual repository location.
2. Confirm the Git repository.
3. Run `git status`.
4. Confirm the current branch.
5. Confirm the latest commit.
6. Read this document.
7. Read the Master Implementation Index.
8. Verify that the repository state matches the documented state.

Only then begin implementation work.

---

# 4. Git and Commit Rules

Git history is part of the project's recovery and continuity system.

Never:

- invent commit hashes
- report sandbox-local commits as repository commits
- assume files exist because a previous session claimed they existed
- modify files without knowing the current repository state

If working in an environment without access to the actual repository:

- state that limitation explicitly
- do not claim repository verification
- do not provide authoritative commit information

A disconnected environment may verify code internally, but only the actual repository can establish project history.

---

# 5. AI Session Rules

AI collaborators must treat this repository as the source of truth.

Do not infer:

- repository structure from memory
- project relationships from conversation history
- implementation status from previous discussions
- architectural decisions from remembered conversations
- requirements from earlier versions of documents when a later authoritative document exists

Verify first.

If uncertain:

- ask before acting
- identify the uncertainty
- do not silently resolve ambiguity

Honest uncertainty is preferred over incorrect assumptions.

---

# 6. Project Status Authority

Project Status is a **single-tier model**.

The authoritative status field is:

```text
ProjectRecord.status
```

The frozen Phase 3 implementation defines its values as:

```text
possible
planned
current
completed
```

This is the sole authoritative Project Status field.

The working navigational vocabulary established in Category 1 is:

```text
Possible
Planned
Current
Ongoing
Archived
```

These concepts must not be reconstructed into a second lifecycle/status taxonomy.

In particular, the following are **not** formal Project Status values:

- Active
- Paused
- Cancelled
- Failed

`Completed`, `Active`, `Paused`, `Cancelled`, and `Failed` must not be introduced as an alternative or second Project Status taxonomy.

A project circumstance that is not represented by the authoritative status field belongs in the appropriate Project information — such as Notes, Attention/Signals, Flags, Blockers, History, or other established records — rather than being converted into a new Status value.

The human project owner is the sole authority for assigning, changing, or approving a project's status.

AI collaborators may:

- observe project activity
- analyze project state
- identify possible status changes
- recommend a status transition
- raise Attention/Signals or Flags where appropriate

AI collaborators must not:

- independently change a project's status
- assume a project should advance because of activity level
- infer ownership decisions from file contents or repository activity
- invent new Project Status values

A Project Status change represents a change in Command Center's recorded understanding and presentation of the project.

It does not represent a filesystem operation.

Changing a project's status:

- updates the project's recorded state
- changes how Command Center presents and navigates that project
- affects project organization within the Command Center management layer

Changing a project's status does not:

- move project files
- rename folders
- reorganize repositories
- duplicate content
- alter the physical storage location of the project

The physical repository location of a project is independent from its Command Center status.

Command Center provides a management and observation layer above projects. It does not control or restructure the internal organization of the projects it observes.

---

# 7. Current Development Phase

Current project phase:

**Phase 4 — Implementation**

Current governing documents:

1. Phase 3 Architecture Record
2. Phase 4 WP specifications
3. Phase 4 Master Implementation Index
4. Implementation Notes
5. Clean revised Phase 4 Matrix, as applicable

Frozen architectural decisions are not changed during implementation.

If implementation reveals a conflict with a frozen decision:

- do not silently adjust the implementation
- raise an Architecture Change Proposal (ACP)

---

# 8. Architectural Boundary — Command Center as an Orchestration Layer

Command Center is an orchestration, management, navigation, and observation layer.

CC must not become:

- the IDE
- the document editor
- the repository
- the cloud-storage system
- the AI provider
- the AI Agent itself

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

- local filesystem material
- GitHub
- GitLab
- Bitbucket
- cloud storage
- application-specific storage
- Obsidian
- repositories
- documents
- workspaces
- backups
- reference sources
- future providers

The architecture must remain provider-independent.

A source has both:

- a **provider**
- a **role**

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

- Chat Threads
- Handover records
- external source content
- shared working context

These supporting artifacts provide provenance and additional context, but Project State remains primary.

---

# 11. AI Participants and Agents

AI is a participant in the Command Center architecture, not the owner of a Project.

AI Participants may have defined:

- read permissions
- write permissions
- suggestion permissions
- maintenance responsibilities
- project-specific roles
- attribution/provenance

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

- scope
- role
- permissions
- assignment
- responsibilities

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

- source thread
- receiving thread
- actual handover prompt
- reason
- scope
- supporting references
- source/target relationships
- receiving-AI assessment
- prompt version
- referenced Decisions, Files, Threads, or other Project artifacts

Handover is not disposable summary text.

It is provenance.

---

# 13. Shared Working Context

Shared Working Context is separate from Project Context.

It represents reusable information about how Command Center should work with its human project owner.

For example:

> **How to Work With Kurt**

This context may be reused across:

- Projects
- AI providers
- Chat Threads
- AI Participants
- Agents

It should not be unnecessarily duplicated into every Project.

Project-specific information belongs in Project Context.

Reusable working preferences and interaction context belong in Shared Working Context.

---

# 14. Phase 4 Matrix Authority

The Phase 4 matrix is an architectural and implementation planning artifact.

The revised matrix must distinguish:

- KEEP — Phase 4
- KEEP — Architectural Foundation
- DEFER
- REVISE
- REMOVE
- OPEN

A requirement classified as **DEFER** or **REMOVE** must not be silently reintroduced during Phase 4 implementation.

A requirement classified as **REVISE** must be implemented according to its revised authoritative wording, not the obsolete original wording.

An **OPEN** item remains undecided until an explicit architectural or project decision resolves it.

The clean revised matrix is the authoritative Phase 4 requirements reference for the portions that have been completed and accepted.

**Current matrix status:** Categories **1–64** have been audited and represented in the clean revised matrix. **Step 65 remains paused and unresolved.**

Therefore:

- the Phase 4 matrix is **not yet complete**
- Categories 1–64 are the current completed audit/revision boundary
- Step 65 and subsequent material must not be assumed to be finalized
- unresolved material must not be treated as authoritative Phase 4 requirements

The separate Clean Matrix documents covering Categories 1–64 may be consolidated into a single clean matrix artifact when appropriate, but consolidation does not change their authority or status.

---

# 15. Phase 4 Architectural Principles Established by Audit

The Steps 1–64 audit established the following architectural principles:

- **Command Center is an orchestration layer** — CC connects projects, sources, applications, AI Participants, Agents, Threads, and other resources rather than replacing them.

- **Project Sources are provider-independent** — a Project has Sources; GitHub, Obsidian, local filesystems, cloud systems, and other providers are implementations of that broader concept.

- **Provider and Source Role are separate concepts** — CC should know both who/what provides a source and what role that source plays for the Project.

- **Project context is operational** — Project Type, technology/stack, tools, Sources, AI Participants, Agents, and related information may eventually influence how CC presents and connects Project artifacts.

- **AI is a participant, not the owner** — AI may read, contribute, suggest, maintain designated information, and raise Flags within defined authority; Project governance remains human-controlled.

- **Agents are first-class but optional** — the architecture must accommodate Projects using zero, few, or many Agents.

- **Chat Threads are distinct from AI identity** — CC must preserve the identity of the exact conversation, not merely the provider or AI involved.

- **Handover is a traceable artifact** — Source Thread → Handover Prompt → Receiving Thread → Assessment should remain identifiable.

- **Shared Working Context is separate from Project Context** — reusable "How to Work With Kurt" information should not be duplicated into every Project.

- **Persistent Project State is primary for re-entry** — Threads, Handovers, and other supporting artifacts provide provenance and additional context but do not replace Project State.

- **The Project Status model remains single-tier** — Category 49's proposed second status taxonomy silently contradicted the frozen Category 1 / Phase 3 status model and was removed, not merely revised. The authoritative `ProjectRecord.status` field remains the sole formal Project Status field.

- **Status is not navigation** — top-level organizational/navigation categories and Project Status are separate concepts and must not be conflated.

- **CC must not silently reconstruct frozen architecture from memory** — when an authoritative implementation or architecture record exists, it takes precedence over remembered discussions or earlier drafts.

- **The human owner remains the final authority on governance decisions** — AI may analyze and recommend but must not silently establish authoritative Project governance.

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

---

# 17. Command Center Concept Overview

Command Center (CC) is a standalone project.

It provides a management, observation, navigation, and AI collaboration layer for projects.

External projects may be used as validation projects to demonstrate that Command Center can successfully represent, organize, and observe real projects.

The purpose of connecting Command Center to external projects is validation and operation:

- Can Command Center load a real project?
- Can Command Center display meaningful project state?
- Can Command Center demonstrate that the architecture works with an actual project?
- Can Command Center maintain useful project context across tools and AI collaborators?

External projects remain independent.

The fact that Command Center references external project files for testing or operation does not make those projects part of the Command Center codebase or architecture.

---

# 18. Command Center Visual Concept

> **Relationship to the Phase 3 Architecture Record — read this first.**
>
> The visual concept below describes the intended **presentation layer** and user experience metaphor. It does not override, replace, or modify anything in the frozen Phase 3 Architecture Record.
>
> Phase 3 defines the underlying application architecture: the object model, navigation relationships, the persistent orientation element, and the Category → List → Dashboard → Workspace depth hierarchy. That remains frozen and governs all implementation.
>
> This section defines how those same objects, states, and relationships may eventually be *rendered* — sticky notes, connectors, flow paths, a visual workspace — as a rendering and interaction model, not a competing data or navigation model. A future visual board still represents the same underlying objects Phase 3 defines; it does not introduce a second architecture alongside it.
>
> This distinction exists in the document explicitly so that this section is never read as silently superseding Phase 3 in a future session. If a future implementation step appears to require an actual architectural change (not just a new rendering) to accommodate this vision, that still requires an ACP — this note does not pre-authorize one.

The intended user experience for Command Center is a visual project command board.

The primary metaphor is a physical planning board:

- a large workspace surface
- visual flow structures
- connected stages or areas
- sticky-note-style project elements
- movement through project states represented visually

The user experience should feel like:

- a project planning wall
- a visual flowchart
- a command center
- an intuitive workspace

It should not feel like:

- a database viewer
- a spreadsheet
- a folder browser
- a collection of disconnected documents

Projects, tasks, milestones, decisions, and status changes should be represented as visual elements on the board.

The visual system may include:

- sticky notes
- cards
- connectors
- flow paths
- status areas
- navigation elements

The visual representation is not decoration. It is the primary interface for understanding project state.

The underlying architecture, data model, repository structure, and AI observation layer exist to support this visual experience.

---

# 19. Implementation Perspective

Do not confuse the current implementation mechanism with the final user experience.

Current implementation foundation:

- Obsidian
- Markdown files
- TypeScript
- Git
- ProjectRecord data structures

User-facing goal:

- a visual project operating surface
- flow visualization
- intuitive project navigation
- AI-assisted understanding of project state

The technology is the foundation.

The visual command board is the product experience.

---

# Final Rule

Before changing anything:

**Verify the repository.
Verify the files.
Verify the governing documents.
Verify the authoritative architecture and current matrix boundary.
Then implement.**