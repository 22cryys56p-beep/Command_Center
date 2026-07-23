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