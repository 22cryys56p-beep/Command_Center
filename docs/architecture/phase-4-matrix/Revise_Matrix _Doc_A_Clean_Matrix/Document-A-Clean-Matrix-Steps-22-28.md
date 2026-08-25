# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 22–28
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 22 — Project Relationships / The "Tentacles"

- P4-R295 — CC must support relationships between projects and related project information — KEEP-Foundation
- P4-R296 — A project may have multiple related items/workstreams/tentacles — KEEP-Foundation
- P4-R297 — Related items should not be forced into a single generic relationship type — KEEP-Foundation
- P4-R299 — A related item may eventually become an independent Project Record while retaining its relationship to the originating project — KEEP-Foundation
- P4-R300 — Project relationships must support cross-connections rather than requiring a strict folder hierarchy — KEEP-Foundation
- P4-R301 — Project Workspaces should provide access to relevant relationships without overwhelming the primary workspace — KEEP-Foundation
- P4-R303 — Project relationships must remain domain-agnostic — KEEP-Foundation

### Category 23 — Project Data Model

- P4-R304 — Every formal project must have a stable Project Record/identity — KEEP-Foundation
- P4-R305 — Project Identity must include a stable Project ID — KEEP-Foundation
- P4-R306 — Project Name may change without changing Project ID — KEEP-Foundation
- P4-R307 — Core identity includes Project Owner, Status, and Category — KEEP-Foundation
- P4-R308 — Core descriptive fields include Purpose, Description, and Focus — KEEP-Foundation
- P4-R309 — Operational context includes Where Left Off, Next Action, and AI-estimated Progress where applicable — KEEP-Foundation
- P4-R310 — Flags and Blockers are distinct project information — KEEP-Foundation
- P4-R311 — Tools, technical stack, AI roles, repositories, local workspaces, and external links are optional contextual attributes — KEEP-Foundation
- P4-R312 — Notes, Decisions, History, Documents, Relationships, and Seeds must be connectable to the Project Record — KEEP-Foundation
- P4-R313 — The Project Record must remain domain-agnostic — KEEP-Foundation
- P4-R314 — Project-specific fields must be optional/extensible rather than imposed on every project — KEEP-Foundation
- P4-R315 — The Project Record should function as the central identity/index rather than a monolithic container — KEEP-Foundation

### Category 24 — Project Workspace

- P4-R320 — Project Context fields must remain domain-agnostic and optional — KEEP-Foundation
- P4-R327 — Project Workspace should prioritize visual hierarchy and "See first. Read second." — KEEP-Foundation
- P4-R316 — Selecting a project must open a dedicated Project Workspace for that project — KEEP-Phase4
- P4-R317 — Project Workspace must clearly identify the selected project — KEEP-Phase4
- P4-R318 — Purpose, Description, and Focus should be directly accessible from the primary workspace — KEEP-Phase4
- P4-R319 — Project Context should expose applicable tools, technology/coding, target platform, and related environment information — KEEP-Phase4
- P4-R321 (revised) — Active Flags and Blockers must be prominently visible within the "Where Things Stand" section, as part of that section, not a subsection — KEEP-Phase4
- P4-R322 — Workspace should provide a concise "Where Things Stand" operational section, covering the entire current-state picture with no artificial subdivision — KEEP-Phase4
- P4-R323 — Where Things Stand should support Where Left Off, Next Action, and AI Progress Estimate — KEEP-Phase4
- P4-R324 — Project Workspace must provide access to deeper project knowledge without displaying everything simultaneously — KEEP-Phase4
- P4-R325 — Project Workspace should provide access to Files, Search, Decisions, Notes, History, Relationships, and Seeds where applicable — KEEP-Phase4
- P4-R326 — Closing a Project Workspace should return the user to the view from which the project was opened — KEEP-Phase4

### Category 25 — Project Files & Read-Only Access

- P4-R329 — CC must identify supported source-code files by their actual file type rather than macOS application association — KEEP-Foundation
- P4-R335 — Read-only file viewing must not modify the underlying source file — KEEP-Foundation
- P4-R336 — Associated project files may exist outside the project's primary filesystem location — KEEP-Foundation
- P4-R337 — CC should preserve the actual filesystem/repository location of associated files — KEEP-Foundation
- P4-R340 — Edit Using should hand off the actual underlying file, not create an editable copy inside CC — KEEP-Foundation
- P4-R342 — CC must not rely solely on macOS file associations when determining appropriate editing applications — KEEP-Foundation
- P4-R343 — Project context, including project type and technology/stack, should inform recommended editing applications — KEEP-Foundation
- P4-R344 — For ambiguous extensions such as .ts, CC should prioritize applications appropriate to the project's declared context — KEEP-Foundation
- P4-R345 — The user remains the final selector of which application is used to edit a file — KEEP-Foundation
- P4-R328 — Project Workspace must provide access to associated project files — KEEP-Phase4
- P4-R330 — CC must provide read-only viewing of supported text/code/document files — KEEP-Phase4
- P4-R331 — Users must be able to see actual file contents rather than only AI-generated summaries — KEEP-Phase4
- P4-R332 — Users must be able to highlight and copy content from read-only files — KEEP-Phase4
- P4-R333 — File viewer should provide in-file search where appropriate — KEEP-Phase4
- P4-R334 — File viewer should provide an Open Externally mechanism — KEEP-Phase4
- P4-R338 — File viewer should provide an Edit Using action for files that can be edited — KEEP-Phase4
- P4-R339 — Edit Using should present appropriate locally available applications capable of editing the selected file type — KEEP-Phase4

### Category 26 — Repository Integration / Project Sources

- P4-R347 (revised) — Project Record must support one or more Project Sources — KEEP-Foundation
- P4-R348 (revised) — A Project Source may be local, remote, cloud-based, or application-specific — KEEP-Foundation
- P4-R349 (revised) — Supported source providers may include GitHub, GitLab, Bitbucket, iCloud Drive, Google Drive, Dropbox, local filesystem, Obsidian, etc. — KEEP-Foundation
- P4-R350 (revised) — Source provider must not be hard-coded into the Project Record architecture — KEEP-Foundation
- P4-R351 (revised) — A Project Source should have a role (Repository, Vault, Primary Source, Workspace, Documents, Backup, Reference) separate from its provider — KEEP-Foundation
- P4-R352 (revised) — Remote source and local source locations must remain distinguishable — KEEP-Foundation
- P4-R353 (revised) — A project may have multiple Project Sources — KEEP-Foundation
- P4-R354 (revised) — A project may have no external Project Source — KEEP-Foundation
- P4-R355 (revised) — Source integration must remain optional and domain-agnostic — KEEP-Foundation

### Category 27 — AI Access & AI Participation

- P4-R357 — CC must support authorized AI participants — KEEP-Foundation
- P4-R358 — Authorized AI should be able to read permitted CC project information — KEEP-Foundation
- P4-R359 — Authorized AI should be able to maintain designated operational information — KEEP-Foundation
- P4-R360 — AI should be able to create/update session notes and project history — KEEP-Foundation
- P4-R361 — AI should be able to raise Flags — KEEP-Foundation
- P4-R362 — AI should not independently convert a Flag into a Blocker — KEEP-Foundation
- P4-R363 — Project Owner retains authority over major project governance decisions — KEEP-Foundation
- P4-R364 — Different AI participants may have different project-specific roles — KEEP-Foundation
- P4-R365 — AI permissions should distinguish at least read, write, and suggest capabilities — KEEP-Foundation
- P4-R366 — Meaningful AI-generated changes should preserve attribution/provenance — KEEP-Foundation
- P4-R367 — AI access architecture must not depend on Obsidian as the permanent platform — KEEP-Foundation
- P4-R368 — CC's AI interface should operate against the CC data model rather than directly coupling to a storage platform — KEEP-Foundation
- P4-R369 — CC architecture should support optional AI Agents in addition to direct AI participants — KEEP-Foundation
- P4-R370 — Agents must have an explicit defined role/purpose rather than unrestricted general authority — KEEP-Foundation
- P4-R371 — Agents should have defined scope, authorized sources, permissions, and current assignments — KEEP-Foundation
- P4-R372 — Agent permissions should be independently controllable from ordinary AI-participant permissions — KEEP-Foundation
- P4-R373 — Agents may perform delegated observation, monitoring, research, retrieval, and maintenance tasks within their authorized scope — KEEP-Foundation
- P4-R374 — Agents must not silently acquire authority over project governance — KEEP-Foundation
- P4-R375 — Agent-generated changes and observations should preserve attribution/provenance — KEEP-Foundation
- P4-R376 — CC must remain fully functional without any AI Agents — KEEP-Foundation
- P4-R377 — AI Participants and AI Agents must be optional project resources — KEEP-Foundation
- P4-R378 — A project may use no Agents, a small number of Agents, or many Agents — KEEP-Foundation
- P4-R379 — Agent usage must not be limited to software-development projects — KEEP-Foundation
- P4-R380 — Agent roles and purposes must be project-specific and domain-agnostic — KEEP-Foundation
- P4-R381 — AI/Agent information should be available as optional Project Context — KEEP-Foundation
- P4-R382 — CC must not impose a predefined operational model for how a project uses Agents — KEEP-Foundation

### Category 28 — AI Session Handoff & Re-entry

- P4-R383 — CC must support AI session handoff through persistent project state — KEEP-Foundation
- P4-R384 — AI session handoff must not require transferring an entire prior conversation — KEEP-Foundation
- P4-R385 — CC should maintain a concise operational state sufficient for project re-entry — KEEP-Foundation
- P4-R386 — AI sessions should be able to record meaningful work, decisions, Flags, and next actions — KEEP-Foundation
- P4-R387 — AI-generated session history should preserve attribution and chronology — KEEP-Foundation
- P4-R388 — A new AI should be able to retrieve a project-specific re-entry context — KEEP-Foundation
- P4-R389 — Re-entry context should prioritize current operational state and relevant recent history over indiscriminate historical data — KEEP-Foundation
- P4-R390 — AI handoff must work across different AI providers/models — KEEP-Foundation
- P4-R391 — AI handoff must preserve existing project Decisions, Flags, and Blockers rather than silently replacing them — KEEP-Foundation
- P4-R393 — CC must distinguish individual AI chat threads from the broader AI Participant/Agent identity — KEEP-Foundation
- P4-R394 — Multiple AI chat threads may be associated with a single project — KEEP-Foundation
- P4-R395 — A chat thread should retain its AI/provider identity and, where available, a stable thread reference or URL — KEEP-Foundation
- P4-R396 — Chat-thread metadata should identify its associated project and role/purpose — KEEP-Foundation
- P4-R397 — Chat-thread status must be independent of Project status — KEEP-Foundation
- P4-R398 — CC should preserve relationships between projects and their individual AI chat threads — KEEP-Foundation
- P4-R400 — A project may have many associated AI chat threads — KEEP-Foundation
- P4-R401 — CC should provide a navigable list of AI threads associated with a project — KEEP-Phase4
- P4-R402 — Each thread should retain its individual Thread Reference — KEEP-Foundation
- P4-R403 — Threads should have lightweight descriptive metadata to help identify their purpose — KEEP-Foundation
- P4-R405 — Project-level thread navigation should not depend on remembering which AI provider was used — KEEP-Foundation
- P4-R407 — CC must support explicit Handover records between AI chat threads — KEEP-Foundation
- P4-R408 — A Handover must identify its source AI/thread and receiving AI/thread where known — KEEP-Foundation
- P4-R409 — Handover records must retain references to their source and target threads — KEEP-Foundation
- P4-R410 — Handover information should preserve project state rather than relying solely on a free-form summary — KEEP-Foundation
- P4-R411 — Handover provenance should allow users/AI to trace important context back to the originating conversation where possible — KEEP-Foundation
- P4-R412 — Multiple handovers may form a chain across AI providers, models, and chat threads — KEEP-Foundation
- P4-R413 — CC should treat persistent Project State as the primary re-entry mechanism, with Threads and Handovers providing supporting context and provenance — KEEP-Foundation
- P4-R414 — Handover prompts must be preserved as project artifacts — KEEP-Foundation
- P4-R415 — A Handover record must be able to reference its actual source handover prompt — KEEP-Foundation
- P4-R416 — The original handover prompt must remain preserved after the handover is completed — KEEP-Foundation
- P4-R417 — Handover prompts should be versionable rather than silently overwritten — KEEP-Foundation
- P4-R421 — Handover records should identify the reason for the handover — KEEP-Foundation
- P4-R422 — Handover records should identify the intended scope of transferred context — KEEP-Foundation
- P4-R423 — Receiving AI should be able to record its assessment of the handover's completeness — KEEP-Foundation
- P4-R424 — Handover records should be able to reference supporting chat threads, Decisions, files, and other relevant sources — KEEP-Foundation
- P4-R426 — Handover results must not automatically alter Project Status or other owner-controlled governance — KEEP-Foundation
- P4-R427 — CC must distinguish Project Handover context from Shared User/Working context — KEEP-Foundation
- P4-R428 — A reusable "How to Work With Kurt" artifact should exist as shared AI context — KEEP-Foundation
- P4-R429 — Shared User/Working context should be reusable across projects, AI providers, chat threads, and Agents — KEEP-Foundation
- P4-R430 — Shared User/Working context should not be duplicated independently inside every project — KEEP-Foundation
- P4-R431 — Project-specific handovers should reference applicable Shared User/Working context where appropriate — KEEP-Foundation
- P4-R432 — Shared User/Working context should be portable independently of any particular AI provider, project, or platform — KEEP-Foundation

---

## Cross-Category Architectural Foundations (Steps 22–28)

- CC is an orchestration layer — it should not become the IDE, document editor, repository, cloud-storage system, AI provider, or Agent itself; it connects those things
- Project Sources are deliberately provider-independent — Project → Sources, not Project → GitHub or Project → Obsidian
- Project context is operational, not merely descriptive — Type, Stack, Tools, Sources, AI participants, and Agents influence how CC presents and connects artifacts
- AI is a participant, not the owner — it may read, contribute, suggest, and raise Flags within defined authority; governance remains human-controlled
- Agents are first-class but optional — the architecture accommodates zero Agents through many, without assuming software/AI-heavy projects
- Chat Threads are distinct from AI identity — the architecture remembers which exact conversation, not merely which AI
- Handover is a traceable artifact — Source Thread → Handover Prompt → Receiving Thread → Assessment, not disposable text
- Shared Working Context ("How to Work With Kurt") is separate from Project Context and should not be duplicated into every project
