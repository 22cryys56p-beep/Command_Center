CC_Phase 4_New Project Intake and Data Model — Candidate Design Notes

Status: candidate / exploratory — not an ACP, not accepted, not blocking
Date: 2026-09-14
Origin: GPT/Kurt design conversation, independently reviewed by Claude
Relationship to ACP-013: NONE. This document does not answer, replace, or substitute for ACP-013 §3 (New Project representation, orientation display, and exit/return). ACP-013 remains the sole blocker on Gateway's New Project destination and on any New Project entry-point work package.
Relationship to ACP-011: consistent with and deferred by ACP-011 §8, which explicitly excludes "New Project workflow internals" from Gateway scope. This document is that deferred internal-workflow material, captured so it isn't lost — not a resolution of anything ACP-011 or ACP-013 left open.
Authority: none yet. This is candidate material for a future ProjectRecord schema/workflow decision, informed by already-frozen Phase 4 Matrix items identified below. It does not itself carry architectural authority until formalized through the ACP process.

1. Purpose

This document preserves a design conversation about what information Command Center should gather when a New Project is created, and how that creation workflow should behave. It exists so this thinking isn't lost, and so it can be picked up later as its own properly-scoped ACP (likely a ProjectRecord schema extension) — without being mistaken for, or blocking on, the separate and currently open ACP-013 navigation-representation question.

2. Relationship to already-frozen Matrix items

This design converges with, and does not contradict, several already-accepted Phase 4 Matrix items. Any future formal proposal built from this document should cite these directly rather than re-deriving them:

- P4-R287 — "Templates should provide generic starting structures appropriate to project types" (KEEP-Phase4). Corresponds to the Type → Starting Template model below.
- P4-R343 — "Project context, including project type and technology/stack, should inform recommended editing applications" (KEEP-Foundation). Establishes Type and Technology/Stack as already-distinct concepts.
- P4-R357 — "CC must support authorized AI participants" (KEEP-Foundation).
- P4-R364 — "Different AI participants may have different project-specific roles" (KEEP-Foundation).
- P4-R369 — "CC architecture should support optional AI Agents in addition to direct AI participants" (KEEP-Foundation).
- P4-R377 — "AI Participants and AI Agents must be optional project resources" (KEEP-Foundation). Corresponds to "zero AI participants should be valid" below.
- P4-R778 — "Workspace may vary significantly according to Project type and tools" (KEEP-Foundation).
- P4-R471–475, R620–641 (Categories 33, 47, 48, 49) — lightweight creation workflow, Blank/Template/Seed/Kernel starting points, New Project as action/workspace not status, Ideas-to-Project promotion. This document's Type/Starting-Template model is a candidate refinement within that already-established scope, not a replacement for it.

The current `ProjectRecord` interface (src/data/project-record.ts) has no `type`, `technology`, or `participants` field today. This document is candidate material toward eventually adding them — it is not itself a schema change.

3. Universal project identity (candidate)

Every project, regardless of domain, would establish:

1. Project Name / Title
2. What's the project for? (purpose / one-minute brief — descended from the existing Templates/New Project Template.md structure, minus its obsolete `status: planning` field)
3. Type — broad project category (see Section 4)
4. Participants / Resources + Role(s) — see Section 6; not limited to AI

Technology / Language(s) is explicitly NOT universal — it is type-specific information supplied by the relevant Starting Template (see Section 5), since many valid CC projects (construction, events, personal projects) have no associated technology at all.

4. Type (candidate, provisional list — not frozen)

Type answers "what broad kind of project is this," as classification, not structure. Provisional starting list, explicitly not final:

- Software / Technology
- Website / Web
- Education / Learning
- Creative / Media
- Business / Organizational
- Event
- Physical / Construction
- Personal
- Other

Real examples used to derive this list: iCanSpell/TeacherToolbox, AI Workbench, SunTzu series, kurtsenglish.com/kurt-engine-core, font generator for iCanSpell, kernel extraction project, tailoring Buzz for free-tier AIs, plus non-software examples (construction project, wedding plan, seminar, car restoration).

"Other" must be more than a residual bucket — see Section 5's extensibility note.

5. Type → Starting Template → Project → Adapt

- Type can suggest, but does not force, a Starting Template.
- A Starting Template is a starting structure, not a rigid form: fields can be added, removed, or modified per-project without altering the original template.
- A modified project does not silently alter its originating template.
- A user can save a customized project structure as a new reusable template.
- Choosing "Other" for Type should let the user define a new Starting Template for a kind of project CC doesn't yet have one for (example used: car restoration — vehicle, condition, restoration goal, parts, work areas, budget, suppliers, tasks, documentation).
- Starting Template selection is a second-stage choice after the universal identity fields, not one of the universal fields itself — a project may also decline any template and start from the basic structure alone.

This is distinct from the existing `Templates/` folder (Architecture Document, Bug, Daily Development Log, Decision, Feature, Meeting Notes, Milestone, Module, New Project, Research Note templates — confirmed present, 11 files as of 2026-09-14). Those are artifact templates, for things created inside a project. Starting Templates, as described here, are a different, currently-nonexistent layer: templates for the project's own initial shape. This distinction was not previously documented and should be made explicit in any future formal proposal.

6. Participants / Resources + Role(s)

Generalizes beyond AI: a project can have any number of participants (human or AI), each with one or more roles. Examples surfaced in discussion:

- Software project: GPT (architecture/planning/review), Claude (verification/specification), Copilot (implementation)
- Construction: contractor, electrician
- Wedding/event: planner, caterer, photographer
- Business: accountant, consultants

For AI/agent participants specifically, in current CC this is informational project metadata only — it does not imply CC can launch, route to, authenticate with, or monitor any AI. That capability, if it exists, belongs to a future integration/orchestration layer and is explicitly out of scope here. Zero participants of any kind is valid (a project may have none).

7. Explicit non-goals of this document

This document does not decide:

- the final Type taxonomy (Section 4's list is provisional and untested against further real examples);
- the Starting Template data structure or storage mechanism;
- any ProjectRecord schema change (that requires its own future ACP);
- anything about how New Project is entered, exited, or represented in NavigationState — that is ACP-013's exclusive scope, unresolved, and unaffected by this document;
- any AI integration/orchestration mechanism.

8. Status and next step

This document is candidate material only. It has no architectural authority. Before any of it becomes binding, it needs its own formal proposal (most likely a ProjectRecord schema-extension ACP), independently verified against the live Matrix and codebase at that time, and accepted by Kurt through the same process as every other ACP in this project.

In the meantime, ACP-013 §3 remains the actual blocker on Gateway's New Project destination and must be resolved on its own, independent of this document.
