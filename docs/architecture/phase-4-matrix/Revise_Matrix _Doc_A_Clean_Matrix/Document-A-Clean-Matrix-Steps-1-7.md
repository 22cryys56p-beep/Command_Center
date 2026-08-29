# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered so far:** Categories 1–7
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 1 — Project Status

- Status vocabulary: Possible / Planned / Current / Ongoing / Archived — KEEP-Foundation
- Multiple projects may share the same status — KEEP-Foundation
- Current is not a singleton — KEEP-Foundation
- Selecting a Current project does not change its status — KEEP-Foundation
- Completed is not a project status — KEEP-Foundation
- Ongoing is preferred over Completed — KEEP-Foundation
- Archived represents intentionally retired/preserved projects — KEEP-Foundation
- Kurt is the sole authority for project status — KEEP-Foundation
- Status is metadata, not physical location — KEEP-Foundation
- Project identity remains stable when status changes — KEEP-Foundation
- P4-R801 — An Archived or Ongoing project may be reactivated into an active status without requiring creation of a New Project; the project retains its existing Project ID, history, and identity, and the Project Owner determines the resulting status — KEEP-Foundation

### Category 2 — Project Categorization

- P4-R92 — Project categorization must be independent of project status — KEEP-Foundation
- P4-R93 — A project may have multiple categories where appropriate — KEEP-Foundation
- P4-R94 — Kurt is the sole authority for assigning and changing project categories — KEEP-Foundation
- P4-R95 — CC/AI must not automatically impose or change project categories — KEEP-Foundation
- P4-R96 — Category changes must not require physical movement, renaming, or restructuring of the project workspace — KEEP-Foundation
- P4-R98 — Category-based views may present projects according to their assigned categories — KEEP-Phase4

### Category 3 — Project Identity & Purpose

- P4-R99 — Each project must have a stable identity independent of physical file/folder location — KEEP-Foundation
- P4-R100 — Project identity must include the canonical Project ID established in Phase 3 — KEEP-Foundation
- P4-R101 — A project must have a human-facing project name — KEEP-Foundation
- P4-R102 (revised) — A project must have a Purpose describing why it exists — KEEP-Foundation
- P4-R103 (revised) — A project must have a Description describing what it is/encompasses — KEEP-Foundation
- P4-R104 (revised) — A project must have a Focus describing what is currently receiving attention — KEEP-Foundation
- P4-R105 (revised) — Purpose, Description, and Focus must remain distinguishable concepts — KEEP-Foundation
- P4-R104 (original) — Where applicable, the workspace should record the project's intended current product/platform form — KEEP-Phase4
- P4-R105 (original) — Where applicable, the workspace should record the project's eventual product/platform direction — KEEP-Phase4
- P4-R107 (original) — Changes to product direction must not require changing the project's stable identity — KEEP-Foundation

*(Note: P4-R102–105 were reassigned mid-session to a different requirement set. Both original and revised content are preserved above; see Document C for the numbering-collision note.)*

### Category 4 — Operational State

- P4-R106 — Project operational state must include milestone where applicable — KEEP-Foundation
- P4-R107 — Project operational state must include progress where applicable — KEEP-Foundation
- P4-R108 — Project operational state must include next action where applicable — KEEP-Foundation
- P4-R109 — Project operational state must represent blockers where applicable — KEEP-Foundation
- P4-R110 — Operational state may change without changing project identity or status — KEEP-Foundation
- P4-R111 (final) — Flags and Blockers are separate concepts — KEEP-Foundation
- P4-R112 (final) — A Flag represents an issue, concern, question, or condition requiring attention but not currently preventing progress — KEEP-Foundation
- P4-R113 (final) — A Blocker represents an issue currently preventing or materially impeding progress — KEEP-Foundation
- P4-R114 — Active Flags must be sufficiently prominent in the Project Workspace that they are unlikely to be overlooked or indefinitely deferred — KEEP-Foundation
- P4-R115 — A Flag may be resolved without ever becoming a Blocker — KEEP-Foundation
- P4-R116 — A Flag may become a Blocker if circumstances change — KEEP-Foundation
- P4-R117 (final) — Kurt retains final authority over project-level status and operational decisions — KEEP-Foundation
- P4-R118 (final) — Any authorized project participant or AI may raise a Flag when an issue, concern, inconsistency, risk, or question warrants attention — KEEP-Foundation
- P4-R119 (final) — Raising a Flag does not itself determine whether the issue is a Blocker — KEEP-Foundation
- P4-R120 (final) — A Flag must remain visible until it is resolved, explicitly dismissed, reclassified, or otherwise intentionally dispositioned — KEEP-Foundation
- P4-R121 (final) — A Flag may be reclassified as a Blocker when investigation determines that it materially prevents or impedes progress — KEEP-Foundation

*(Note: P4-R111–121 went through two rounds of revision within the same session. Only the final versions are listed above. See Document C for the superseded intermediate wording.)*

### Category 5 — Tools, Technical Stack, Platform & AI Team

- P4-R122 — Project workspace must identify the intended product/platform direction where applicable — KEEP-Phase4
- P4-R123 — Project workspace may distinguish current implementation form from eventual target form — KEEP-Phase4
- P4-R124 — Project workspace may preserve rationale for an intermediate implementation choice — KEEP-Phase4
- P4-R125 — Project workspace must identify the project's significant technical stack — KEEP-Phase4
- P4-R126 — Technical Stack must remain distinct from Tools & Environment — KEEP-Foundation
- P4-R127 — Project workspace must identify the tools/environment used to work on the project — KEEP-Phase4
- P4-R128 — Project workspace must identify participating AI systems and their project-specific roles — KEEP-Phase4
- P4-R129 — AI roles may differ between projects and may change over time — KEEP-Foundation
- P4-R130 — Project workspace must provide a reference to the authoritative repository where applicable — KEEP-Foundation
- P4-R131 — Command Center must not become the authoritative source for source code merely by displaying it — KEEP-Foundation

### Category 6 — Project Ecosystem / "Tentacles"

- P4-R132 — A project workspace must be able to represent work and resources extending beyond the project's primary artifact — KEEP-Foundation
- P4-R133 — Related work may include technical, business, operational, research, AI, administrative, or other domains — KEEP-Foundation
- P4-R134 — Related work must be linkable to the project without necessarily being classified as a subproject — KEEP-Foundation
- P4-R135 — CC should expose significant project relationships prominently enough to support project re-entry — KEEP-Phase4
- P4-R136 — External systems remain authoritative for their own data; CC records references/context rather than becoming their replacement — KEEP-Foundation
- P4-R137 — A project may have multiple related workstreams/tentacles — KEEP-Foundation
- Domain-agnostic Project Model — core project model must not assume software/computer projects — KEEP-Foundation
- Domain-specific information is optional/extensible — KEEP-Foundation
- Templates must not constrain the underlying Project Model — KEEP-Foundation

### Category 7 — Documents, Files, Source Code & Search

- P4-R139 — CC must provide read-only inspection of project documents/files — KEEP-Foundation
- P4-R140 — Text/code files must be viewable as text regardless of the host OS's default file association — KEEP-Phase4
- P4-R141 — Users must be able to select/highlight and copy displayed text/code — KEEP-Phase4
- P4-R142 (revised) — CC must not become the authoritative editor or modifier of externally owned project artifacts as part of its core information/control role; CC may maintain and modify information that belongs to CC itself — KEEP-Foundation
- P4-R143 — CC should provide a handoff/open-in-tool path for editing when appropriate — KEEP-Phase4
- P4-R144 — CC should provide a unified Search function with File and Project scopes — KEEP-Phase4
- P4-R145 — Search should operate across relevant text/document content, including source code — KEEP-Foundation
- P4-R146 — Search results should identify the source file and, where practical, the matching location — KEEP-Phase4
- P4-R147 — CC should not create unnecessary duplicate authoritative copies of project artifacts — KEEP-Foundation
- P4-R148 — File/document support must remain domain-agnostic — KEEP-Foundation

---

## Cross-Category Architectural Foundations (Steps 1–7)

- Kurt remains the final authority over project-level decisions
- Project identity is independent of physical location, status, category, and changing operational state
- Status and categorization are properties of the project, not physical folders
- The core Project Model must work for arbitrary project domains
- CC references and organizes authoritative external systems; it does not replace them
- CC may inspect externally owned artifacts but does not become their authoritative editor
- Information exposed by CC must support the Project Re-entry Requirement (Where was I, how was I doing this, what do I do next)
