# Command Center — Session Start Guide

**Read this document before any implementation, review, or modification session.**

This document exists to establish repository identity, authority, and working rules before any collaborator — human or AI — begins work.

---

# 1. Repository Identity

This repository contains the **Command Center** project.

Command Center is an Obsidian-based project management and AI observation system.

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

# 2. Project Boundary: TeacherToolbox

**TeacherToolbox is a separate and independent project.**

It is not part of the Command Center repository.

TeacherToolbox exists as an external project repository and is used by Command Center only as a real-world test subject to validate that Command Center can manage and observe an actual project.

Relationship:

```text
Command_Center
    |
    └── references/tests against ──> TeacherToolboxProject
```

This relationship does not mean:

- TeacherToolbox code belongs inside Command Center
- TeacherToolbox architecture is part of Command Center
- TeacherToolbox implementation decisions govern Command Center

The two projects are separate and must remain separate.

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

Verify first.

If uncertain:

- ask before acting
- identify the uncertainty
- do not silently resolve ambiguity

Honest uncertainty is preferred over incorrect assumptions.

---

# 6. Project Separation Summary

## Command Center

Purpose:

Build the management and observation system.

Repository:

`Command_Center`

Owns:

- architecture
- implementation
- tests
- documentation


## TeacherToolbox

Purpose:

Build educational tools and applications.

Repository:

`TeacherToolboxProject`

Owns:

- TeacherToolbox application code
- TeacherToolbox implementation decisions


Command Center may observe and test TeacherToolbox.

Command Center does not contain TeacherToolbox.

---

# 7. Current Development Phase

Current project phase:

**Phase 4 — Implementation**

Current governing documents:

1. Phase 3 Architecture Record
2. Phase 4 WP specifications
3. Phase 4 Master Implementation Index
4. Implementation Notes

Frozen architectural decisions are not changed during implementation.

If implementation reveals a conflict with a frozen decision:

- do not silently adjust the implementation
- raise an Architecture Change Proposal (ACP)

---

# Final Rule

Before changing anything:

**Verify the repository.  
Verify the files.  
Verify the governing documents.  
Then implement.** 

---

# Command Center Concept Overview

Command Center (CC) is a standalone project.

It is not a component of TeacherToolbox.

TeacherToolbox (TT) is a separate project used as a validation project to demonstrate that Command Center can successfully represent, organize, and observe a real project.

The purpose of connecting Command Center to TeacherToolbox is validation:

- Can Command Center load a real project?
- Can Command Center display meaningful project state?
- Can Command Center demonstrate that the architecture works with an actual project?

The relationship is:

Command Center = the management and observation system

TeacherToolbox = a project being managed and observed

They must remain architecturally separate.

The fact that Command Center references TeacherToolbox files for testing does not make TeacherToolbox part of the Command Center codebase or architecture.

---

# Command Center Visual Concept

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

# Implementation Perspective

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