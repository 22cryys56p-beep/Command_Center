# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 8–14
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 8 — Project Workspace

- A selected project opens as a dedicated Project Workspace — KEEP-Foundation
- The workspace uses the same core Project Model for all project domains — KEEP-Foundation
- Domain-specific sections are optional rather than mandatory — KEEP-Foundation
- Project information, ecosystem information, and source/document references belong within the workspace — KEEP-Foundation
- Authoritative source/location references are broader than merely "Repository" — Remote Repository, Local Workspace, External Source, Folder Map — KEEP-Foundation
- These references identify where authoritative/project resources live; CC does not own them — KEEP-Foundation
- P4-R149 — Selecting a project from a status/category view opens a dedicated Project Workspace — KEEP-Phase4
- P4-R150 — The Project Workspace presents the project's identity and operational state in one primary view — KEEP-Phase4
- P4-R151 — Purpose, Description, Focus, Status, Milestone, Progress, Next Action, Flags, and Blockers should be accessible from the primary workspace — KEEP-Phase4
- P4-R152 — Technical/project-environment information should be available where relevant — KEEP-Phase4
- P4-R153 — Project ecosystem/related work should be accessible from the workspace — KEEP-Phase4
- P4-R154 — Project documents/files should be accessible from the workspace for read-only inspection — KEEP-Phase4
- P4-R155 — The workspace should adapt to domain-specific project information without changing the core Project Model — KEEP-Foundation
- P4-R156 — Closing a Project Workspace returns the user to the previous project-selection context — KEEP-Phase4

### Category 9 — Project Selection & Navigation

- P4-R157 — Status views are generated from Project Record status values, not physical folder locations — KEEP-Foundation
- P4-R158 — Multiple projects may simultaneously have the same status — KEEP-Foundation
- P4-R159 — Project selection should present projects as compact visual choices — KEEP-Phase4
- P4-R160 — Project choices should be arranged horizontally where practical — KEEP-Phase4
- P4-R161 — Selecting a project opens its Project Workspace — KEEP-Phase4
- P4-R162 — Leaving a Project Workspace returns the user to the relevant project-selection context — KEEP-Phase4
- P4-R163 — Status and category must remain independent navigation/filtering dimensions — KEEP-Foundation
- P4-R164 — Navigation must support the Project Re-entry Requirement — KEEP-Foundation

### Category 10 — Project Creation, Templates & Status Changes

- P4-R167 — Templates provide starting structure but do not redefine the core Project Model — KEEP-Foundation
- P4-R168 — Creating a project creates/establishes its Project Record and associated workspace references — KEEP-Phase4
- P4-R169 — Changing project status must modify project metadata, not require physical file/folder movement — KEEP-Foundation
- P4-R170 — Multiple projects may share any status — KEEP-Foundation
- P4-R171 — Status transitions are not required to follow a predetermined sequence — KEEP-Foundation
- P4-R172 — Kurt is the final authority for assigning project status — KEEP-Foundation *(terminology to be generalized per Category 13's Project Owner correction — see Document C)*
- P4-R173 — "Ongoing" means the project remains alive/relevant but is not necessarily part of the current active working set — KEEP-Phase4
- P4-R174 — "Archived" means the project is no longer considered active/living; it does not necessarily imply successful completion — KEEP-Phase4
- P4-R175 — Status changes should be simple metadata operations from the user's perspective — KEEP-Phase4

### Category 11 — Project Notes, Decisions, History & Re-entry Context

- P4-R176 — CC must allow project-specific notes to be created and edited within CC — KEEP-Phase4
- P4-R177 — Notes may contain ideas, observations, questions, research, reminders, and other project context — KEEP-Phase4
- P4-R178 — Significant project decisions should be recordable within CC — KEEP-Phase4
- P4-R179 — Decision records should be capable of preserving the rationale behind important decisions — KEEP-Foundation
- P4-R180 — AI-raised concerns/Flags should be attributable to the AI that raised them when known — KEEP-Phase4
- P4-R181 — Kurt's disposition of a Flag should be recordable — KEEP-Phase4
- P4-R182 — Significant project-state and direction changes should be preservable as history — KEEP-Foundation
- P4-R183 — Current state, notes, decisions, and history should remain conceptually distinct — KEEP-Foundation
- P4-R184 — CC should not automatically record every minor user action as permanent history — KEEP-Foundation
- P4-R185 — Project information should satisfy the Project Re-entry Requirement after extended absence — KEEP-Foundation
- Authorized AI systems should be able to access structured CC project context — KEEP-Foundation
- AI-generated progress is explicitly an estimate rather than objective truth — KEEP-Foundation
- AI provenance should be preserved for meaningful contributions — KEEP-Foundation

### Category 12 — Ongoing / Archived Projects & Long-Term Retrieval

- P4-R186 — Changing a project to Ongoing or Archived must not destroy or relocate its project information — KEEP-Foundation
- P4-R187 — Archived projects must remain retrievable through CC — KEEP-Foundation
- P4-R188 — Archived project records should retain relevant history, notes, decisions, and associated references — KEEP-Phase4
- P4-R189 — Ongoing projects remain fully represented and may return to Current without restructuring their workspace — KEEP-Foundation
- P4-R190 — Search should be capable of finding relevant information in Ongoing and Archived projects — KEEP-Phase4
- P4-R191 — Authorized AI systems should be able to access relevant Ongoing/Archived project context when needed — KEEP-Phase4
- P4-R192 — Archiving a project is a status/view operation, not a destructive archival process — KEEP-Foundation
- P4-R799 — Ongoing projects are essentially complete but retain active side-branches requiring occasional attention; Archived projects are genuinely finished with no remaining active concerns — KEEP-Foundation
- CC has a distinct Foundational Seed containing the platform-independent Project Model, architecture, requirements, principles, and portability concepts — KEEP-Foundation
- Obsidian is the initial implementation platform, not the fundamental definition of CC — KEEP-Foundation
- Platform-specific implementation details must remain separable from the underlying model — KEEP-Foundation
- P4-R193 — Archived projects must remain available as potential sources of reusable project material — KEEP-Foundation
- P4-R195 — A Project Seed may contain reusable code, structure, documents, knowledge, patterns, or other project-specific assets — KEEP-Foundation
- P4-R196 — A new project created from a seed receives its own independent Project ID and identity — KEEP-Foundation
- P4-R197 — The originating archived project remains unchanged when its material is reused as a seed — KEEP-Foundation
- P4-R198 — Project Seeds and generic Project Templates are distinct concepts — KEEP-Foundation

### Category 13 — AI Access & Governance

- AI is a participant in CC, not its owner — KEEP-Foundation
- P4-R199 — Authorized AI systems should be able to read relevant CC project information — KEEP-Foundation
- P4-R200 — Authorized AI systems may maintain designated operational project information — KEEP-Phase4
- P4-R201 — AI may record session context such as where work stopped, what was accomplished, and what should happen next — KEEP-Phase4
- P4-R202 — AI may estimate project progress — KEEP-Phase4
- P4-R203 — AI-generated estimates should be identifiable as estimates rather than objective truth — KEEP-Foundation
- P4-R204 — AI may raise Flags based on its observations — KEEP-Phase4
- P4-R205 — AI must not automatically determine final project Status — KEEP-Foundation
- P4-R206 — AI must not silently redefine project identity or governing decisions — KEEP-Foundation
- P4-R207 — AI may recommend changes to human-controlled project information — KEEP-Phase4
- P4-R208 (revised) — The Project Owner remains the final authority over project governance and significant project decisions — KEEP-Foundation
- P4-R209 — Significant AI-generated project information should preserve AI provenance where practical — KEEP-Phase4
- P4-R210 — AI permissions should be scoped rather than universally unrestricted — KEEP-Foundation

### Category 14 — Command Center as Its Own Project

- P4-R211 — Command Center itself must be representable as a normal Project Record — KEEP-Foundation
- P4-R212 — CC's own project workspace should use the same core Project Model available to other projects — KEEP-Foundation
- P4-R213 — CC must not require a special project model merely because it manages itself — KEEP-Foundation
- P4-R214 — CC must maintain a distinct Foundational Seed representing its platform-independent architecture and design — KEEP-Foundation
- P4-R215 — Obsidian is the initial implementation platform, not the fundamental definition of CC — KEEP-Foundation
- P4-R216 — CC's underlying project information must remain sufficiently platform-independent to support future migration — KEEP-Foundation
- P4-R217 — Platform-specific implementation details should remain separable from the underlying Project Model — KEEP-Foundation

---

## Cross-Category Architectural Foundations (Steps 8–14)

- Project ≠ software project — the core Project Model remains domain-agnostic
- Status ≠ physical location — status is metadata and a view/filter
- Workspace ≠ dashboard — a Project Workspace represents one selected project
- CC ≠ authoritative external system — CC knows where resources are, doesn't replace them
- CC is not merely read-only — CC-owned project-management information can be edited
- AI ≠ owner — AI reads/maintains operational context; the Project Owner retains governance authority
- Current ≠ everything — Ongoing and Archived projects remain complete, searchable records
- Archived ≠ discarded — Archived projects can preserve history and provide reusable Project Seeds
- Template ≠ Seed — Template is generic structure; Seed is material derived from prior experience
- Obsidian ≠ Command Center — Obsidian is the initial implementation host, not the architecture itself
- CC must pass the self-hosting test — if CC needs a fundamentally different Project Model to manage itself, the architecture is wrong