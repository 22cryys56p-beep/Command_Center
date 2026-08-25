# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 15–21
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 15 — Dashboard / Home Screen & Visual Hierarchy

- Dashboard is the primary operational overview — KEEP-Foundation
- "See first. Read second." is a governing visual principle — KEEP-Foundation
- Dashboard should surface important information without attempting to display everything — KEEP-Foundation
- P4-R225 — Dashboard should remain domain-agnostic — KEEP-Foundation
- P4-R224 — Dashboard navigation should remain shallow and understandable — KEEP-Foundation
- P4-R219 — CC must provide a Dashboard serving as the primary operational overview — KEEP-Phase4
- P4-R220 — Dashboard should prioritize current/relevant information over exhaustive project detail — KEEP-Phase4
- Dashboard provides the primary Home Screen presenting six functions: Current, Planning, Ideas, Ongoing, New Project, Archive — KEEP-Phase4
- P4-R221 (revised) — Dashboard provides access to the Current/status views; it does not display the projects contained within them — KEEP-Phase4
- P4-R222 — Dashboard should prominently surface unresolved Flags and Blockers requiring attention — KEEP-Phase4
- P4-R223 — Dashboard should provide access to global Search — KEEP-Phase4

### Category 16 — Home Screen Functions

- P4-R235 — Home Screen buttons are navigation/function controls, not physical project folders — KEEP-Foundation
- Changing a project's status does not require physically moving its files — KEEP-Foundation
- Current, Planning, Ideas, and Ongoing are distinct project/category views — KEEP-Foundation
- New Project is a project-creation mechanism — KEEP-Foundation
- Archive is a gateway to past projects and their preserved information — KEEP-Foundation
- P4-R228 — Home Screen must provide six primary functions/views: Current, Planning, Ideas, Ongoing, New Project, Archive — KEEP-Phase4
- P4-R229 — Current opens a project selector rather than displaying projects directly on the Home Screen — KEEP-Phase4
- P4-R230 — Planning opens its project-selection view — KEEP-Phase4
- P4-R231 — Ideas provides a space for undeveloped/future project concepts and associated notes — KEEP-Phase4
- P4-R232 — Ongoing opens its project-selection view — KEEP-Phase4
- P4-R233 — New Project initiates creation of a new Project Record — KEEP-Phase4
- P4-R234 — Archive opens the archived-project view — KEEP-Phase4

### Category 17 — Ideas & Planning

- P4-R237 — Ideas must be able to exist without being formal Project Records — KEEP-Foundation
- P4-R238 — Ideas may contain incomplete, informal, or exploratory information — KEEP-Foundation
- P4-R239 — Ideas should support notes, references, links, and related concepts — KEEP-Foundation
- P4-R240 — Planning represents a sufficiently defined project that is being prepared but is not necessarily currently active — KEEP-Foundation
- P4-R241 — Planning projects should be capable of using the normal Project Record structure — KEEP-Foundation
- P4-R245 — Not every Idea must become a Project — KEEP-Foundation
- P4-R246 — A Project may return to an Idea state when appropriate, without losing its accumulated information — KEEP-Foundation
- A New Project Canvas can exist inside Ideas, providing a structured place to brainstorm without prematurely committing to a formal project — KEEP-Foundation
- The canvas can eventually be promoted to Planning or another appropriate project state — KEEP-Foundation
- Ideas must be accessible as a distinct workspace — KEEP-Phase4
- Planning must provide access to projects being prepared for active work — KEEP-Phase4
- An Ideas workspace should be able to contain initialized Project canvases based on the New Project template, allowing informal development before formal promotion — KEEP-Phase4

### Category 18 — Project Workspace Editing & Permissions

- CC information and external project artifacts are distinct — KEEP-Foundation
- P4-R247 — Project Owner must be able to edit Project Workspace information managed by CC — KEEP-Foundation
- P4-R249 — Authorized AI may create/update designated operational project information — KEEP-Foundation
- P4-R250 — AI-generated progress remains explicitly an estimate — KEEP-Foundation
- P4-R251 — AI may recommend changes to Project Owner-controlled information without silently applying them — KEEP-Foundation
- P4-R252 — Project Owner retains authority over project Status and major project governance — KEEP-Foundation
- P4-R253 — CC must not directly edit source code through its core Project Workspace — KEEP-Foundation
- P4-R256 — CC-managed information and externally managed project artifacts should be distinguishable in the UI — KEEP-Foundation
- P4-R257 — The editing/access model must remain applicable to non-software projects — KEEP-Foundation
- CC does not become the editor for source code or arbitrary project artifacts; the same boundary applies to non-code projects — KEEP-Foundation
- P4-R248 — Project Owner may override AI-generated operational information — KEEP-Phase4
- AI-generated estimates should be identifiable — KEEP-Phase4
- CC can inspect/search/reference external project files — KEEP-Phase4
- P4-R254 — CC must not directly manipulate authoritative external project files through its core read-only file-access function — KEEP-Phase4
- P4-R255 — CC should provide an external handoff/open mechanism where appropriate — KEEP-Phase4

### Category 19 — Flags, Blockers & Attention Management

- P4-R258 — Flags and Blockers must be separate concepts — KEEP-Foundation
- P4-R259 — A Flag represents a potential concern requiring attention but not necessarily preventing progress — KEEP-Foundation
- P4-R260 — A Blocker represents an issue currently preventing or materially stopping progress — KEEP-Foundation
- P4-R261 — Authorized AI may raise Flags based on its observations — KEEP-Foundation
- P4-R262 — AI should not automatically classify a Flag as a Blocker — KEEP-Foundation
- P4-R263 — Project Owner determines the disposition of significant Flags and Blockers — KEEP-Foundation
- P4-R264 — Flags may remain open without immediately becoming Blockers — KEEP-Foundation
- P4-R265 — A Flag should be capable of being converted into a Blocker when circumstances warrant — KEEP-Foundation
- P4-R266 — Significant Flag/Blocker history should be preserved — KEEP-Foundation
- P4-R268 — Resolved/dismissed Flags should not clutter the active workspace while remaining searchable/history-accessible — KEEP-Foundation
- P4-R267 — Active Blockers must be prominent within the relevant Project Workspace — KEEP-Phase4
- Active Flags must remain sufficiently visible to avoid disappearing into ordinary notes — KEEP-Phase4

### Category 20 — Search & Knowledge Retrieval

- Search is a fundamental CC capability, not merely a convenience feature — KEEP-Foundation
- P4-R270 (final) — Search must span four scopes: File, Project, Repository, and Disk — KEEP-Foundation
- Search crosses project status boundaries — KEEP-Foundation
- Archived information remains searchable — KEEP-Foundation
- Search preserves provenance — KEEP-Foundation
- AI should use the same underlying retrieval mechanisms where appropriate — KEEP-Foundation
- CC should be able to discover information that exists outside its internal project map — KEEP-Foundation
- A file's physical location is evidence, not proof of project membership — KEEP-Foundation
- CC should not assume reality always conforms to the project map — KEEP-Foundation
- CC may identify potentially orphaned/misplaced project files and may suggest a possible project association — KEEP-Foundation
- CC must not automatically move or relocate such files merely because it believes they belong to a project — KEEP-Foundation
- Unified Search entry point — KEEP-Phase4
- File / Project / Repository / Disk scope selection — KEEP-Phase4
- Search results identify relevant source/location where practical — KEEP-Phase4
- Users can inspect and copy relevant content — KEEP-Phase4
- Disk Search can discover files outside expected project locations, including generic locations such as Downloads — KEEP-Phase4
- Results distinguish expected project files from potential orphan/misplaced files — KEEP-Phase4
- Actual filesystem location is shown for discovered files — KEEP-Phase4
- P4-R281 — Disk Search should be capable of discovering project-related files regardless of how or where they were originally saved — KEEP-Phase4
- P4-R282 — Generic locations such as Downloads must be searchable for potentially project-related files — KEEP-Phase4
- P4-R283 — CC should not assume that a file outside its expected project location is necessarily unrelated to the project — KEEP-Phase4
- P4-R284 — Search results should distinguish expected project files from potentially misplaced/orphaned files — KEEP-Phase4
- P4-R285 — CC should identify the actual filesystem location of discovered files — KEEP-Phase4

*(Note: IDs P4-R270–278 were reassigned mid-session from the original File/Project search set to the later File/Project/Repository/Disk revision. Only the final, four-scope version is listed above. See Document C.)*

### Category 21 — Templates & Project Seeds

- P4-R286 — CC must distinguish generic Project Templates from Project Seeds derived from existing projects — KEEP-Foundation
- P4-R288 — Project Seeds should provide reusable material derived from actual prior projects — KEEP-Foundation
- P4-R290 — A new Project Canvas may initially exist within Ideas rather than immediately becoming a formal project — KEEP-Foundation
- Template = generic reusable structure/knowledge for a type of project — KEEP-Foundation
- Seed = proven reusable material derived from a specific project — KEEP-Foundation
- A Seed is not necessarily a complete project clone — KEEP-Foundation
- A project may produce multiple Seeds — KEEP-Foundation
- A Seed may be reused by multiple projects — KEEP-Foundation
- Seed provenance should be preserved — KEEP-Foundation
- Seed-created projects remain independent of their source project — KEEP-Foundation
- Project Canvas can serve as an exploratory intermediate state — KEEP-Foundation
- New Project can use Blank, Template, or Seed starting material — KEEP-Foundation
- New Project architecture must accommodate Blank Project, Template, and Project Seed — KEEP-Phase4
- Project Canvas can be placed in Ideas before formal project recognition — KEEP-Phase4
- P4-R287 — Templates should provide generic starting structures appropriate to project types — KEEP-Phase4

---

## Cross-Category Architectural Foundations (Steps 15–21)

- The Home Screen is a launcher, not a project display — it does not expose projects underneath its buttons
- Ideas are intentionally different from formal projects — an Idea can remain an Idea indefinitely
- New Project is a creation mechanism, analogous to "New Folder" — not a project category
- Archive is not deletion — archived information remains searchable and can provide reusable Seeds
- CC maintains the map (project information, relationships, notes, decisions, Flags, history, retrieval); external tools maintain the artifacts themselves
- Search connects CC's model to reality — CC must find information even when reality doesn't match the expected project structure
- Template, Seed, Project Canvas, and Project Record are four distinct, non-collapsible concepts
