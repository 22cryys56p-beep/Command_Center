# Command Center — Baseline-First Handoff Protocol

## Purpose

This document defines the required process for transferring Command Center work between AI sessions.

The purpose of a handoff is **not** to reproduce the accumulated knowledge of the Command Center project in a long conversational summary.

The repository already contains that knowledge.

The purpose of the handoff is to ensure that a receiving AI:

1. establishes the existing project baseline,
2. understands the current authoritative state,
3. then receives the specific work focus for the new session.

The fundamental rule is:

> **Learn the established baseline first. Then continue the work.**

A fresh AI session must not begin from the assumption that it already understands Command Center because it has received a handoff summary.

---

# 1. Mandatory Baseline

Before beginning architectural discussion, implementation, review, recommendation, or modification, the receiving AI must completely read the following three documents:

1. `SESSION_START.md`
2. `docs/indexes/CC_Repository File Index.md`
3. `docs/indexes/CC_Phase 4_Master Implementation Index.md`

These three documents constitute the **mandatory baseline reading set**.

They serve different purposes:

### `SESSION_START.md`

Establishes:

* repository identity
* authority rules
* architectural boundaries
* operating rules
* documentation synchronization requirements
* current development phase
* established architectural principles
* ACP registry
* project boundaries
* AI collaboration rules
* current-state constraints

### `CC_Repository File Index.md`

Establishes:

* the complete repository file map
* where authoritative information lives
* which documents are architectural
* which documents are specifications
* which documents are implementation records
* which Working Notes exist
* where the source and test implementation lives

This prevents the receiving AI from having to rediscover or reconstruct the repository structure.

### `CC_Phase 4_Master Implementation Index.md`

Establishes:

* current work-package state
* dependency relationships
* completed and pending work
* ACP registry
* outstanding items
* implementation history at the work-package level
* current Phase 4 position

This prevents the receiving AI from having to reconstruct implementation state from previous conversations.

---

# 2. "Read Completely" Means Exactly That

The baseline documents are not merely reference documents to consult if needed.

They must be **read completely before continuing**.

The purpose is not that every sentence will be relevant to the immediate task.

The purpose is that the receiving AI begins the session already knowing what has been established.

This distinction is fundamental:

> **Complete reading establishes knowledge.
> Targeted reading establishes task-specific detail.**

After the baseline has been established, the receiving AI may read the specific specifications, ACPs, implementation notes, Matrix sections, source files, tests, or Working Notes relevant to the current task.

It must not use the existence of targeted task-specific reading as an excuse to skip the baseline.

---

# 3. The Handoff Does Not Reproduce the Baseline

A handoff prompt should **not** reproduce the project's architecture, history, ACPs, implementation status, or repository structure in lengthy prose when those facts already exist authoritatively in the repository.

Instead, the handoff should identify the baseline explicitly and then state the current work.

The normal structure is therefore:

```text
ESTABLISH BASELINE
    ↓
Read SESSION_START.md completely
    ↓
Read Repository File Index completely
    ↓
Read Phase 4 Master Implementation Index completely
    ↓
ESTABLISH CURRENT TASK
    ↓
Read the task-specific authoritative documents/files
    ↓
Verify the live repository state
    ↓
Continue the work
```

The handoff is therefore a **pointer to established knowledge plus a statement of current focus**, not a replacement for that knowledge.

---

# 4. Repository Discovery After the Baseline

Once the baseline has been established, the receiving AI must use the Repository File Index to locate additional material.

It must not assume that the handoff's task-specific list is necessarily exhaustive.

If the task touches an architectural area, the receiving AI must inspect the relevant authoritative architecture, specification, ACP, implementation notes, Matrix material, source, and tests identified by the repository documentation.

The handoff identifies the immediate focus.

The repository determines the complete evidence required to work safely on that focus.

---

# 5. Verification Still Comes Before Action

The baseline establishes knowledge, but it does not eliminate verification.

Before modifying anything, the receiving AI must still:

* verify the live repository state
* verify the relevant files
* verify the governing documents
* verify current implementation status
* check for applicable ACPs
* check for relevant open architectural questions
* inspect actual source and tests where implementation is involved

The repository remains authoritative over:

* previous conversation claims
* previous AI summaries
* handoff descriptions
* remembered implementation state

A handoff is a navigation mechanism, not an authority source.

---

# 6. Current Task Comes After Baseline

Only after the mandatory baseline has been established should the handoff's current focus be acted upon.

The current-task portion should answer:

* What are we doing now?
* Why are we doing it?
* What specific decision, implementation, review, or verification is currently required?
* What additional files are immediately relevant?
* What, if anything, has already been done in the current task?

It should **not** repeat the entire project history.

---

# 7. No Architectural Rediscovery

Once the baseline has been read, the receiving AI must not unnecessarily reopen already-established questions.

Before proposing architecture:

1. Check whether the question is already resolved by the baseline.
2. Check the relevant ACP registry.
3. Check the relevant authoritative architecture/specification.
4. Check the Matrix where applicable.
5. Check relevant Working Notes for genuinely open questions.

If the question is already resolved, use the established decision.

If there is an actual conflict, identify it.

If the question is genuinely open, follow the established decision-making process rather than silently inventing a resolution.

The purpose of the baseline is specifically to prevent repeated re-argument of settled decisions.

---

# 8. Working Notes Are Context, Not Authority

`CC_Working_Notes/` must remain available as historical context and evidence.

The receiving AI should check relevant Working Notes where appropriate.

However:

> Working Notes do not automatically override authoritative architecture, specifications, ACPs, the Master Implementation Index, or live code.

If a Working Note conflicts with authoritative material, the conflict must be investigated rather than silently resolved.

---

# 9. Handoff Requirements Going Forward

Every Command Center handoff must explicitly include the mandatory baseline requirement.

At minimum, every handoff must state:

> **Before doing anything else, completely read `SESSION_START.md`, `docs/indexes/CC_Repository File Index.md`, and `docs/indexes/CC_Phase 4_Master Implementation Index.md`. These documents establish the Command Center baseline. Do not begin architectural discussion, implementation, review, or recommendation until that baseline has been established. Afterward, read the additional authoritative files relevant to the current task and verify the live repository state.**

The handoff may then provide the current task.

This requirement applies to:

* ChatGPT
* Claude
* Codex
* other AI collaborators
* future Command Center threads
* future human/AI handovers

No AI is exempt because it believes it already knows the project.

---

# 10. Why This Protocol Exists

This protocol exists because previous handoffs repeatedly attempted to solve continuity by transferring increasingly large amounts of summarized context.

That approach created a recurring failure mode:

```text
New thread
    ↓
Long handoff summary
    ↓
Partial understanding
    ↓
Old decisions appear "new"
    ↓
AI proposes/re-argues them
    ↓
Human corrects AI
    ↓
Time is spent rediscovering established knowledge
```

The baseline-first model changes that:

```text
New thread
    ↓
Read authoritative baseline
    ↓
Established knowledge is already present
    ↓
Read current-task material
    ↓
Verify live repository
    ↓
Continue work
```

The objective is therefore not to make handoffs longer.

It is to make fresh threads **informed instead of ignorant**.

---

# 11. The Core Principle

The Command Center handoff system follows this principle:

> **A handoff transfers the work focus.
> The repository transfers the knowledge.**

The repository is the project's persistent memory.

The handoff is the transition between sessions.

A receiving AI should therefore not be asked to *trust* the previous AI's summary of what Command Center is.

It should be instructed to **learn what Command Center is from the authoritative repository first**.

Only then should it be told:

> **This is what we're doing next.**
