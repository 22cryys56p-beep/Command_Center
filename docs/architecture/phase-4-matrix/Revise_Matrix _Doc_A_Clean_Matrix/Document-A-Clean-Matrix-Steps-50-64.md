# CC Phase 4 Matrix — Document A: Clean Matrix (KEEP Only)

**Scope covered:** Categories 50–64
**Classification included:** KEEP — Phase 4, KEEP — Architectural foundation

---

### Category 50 — Overall CC Navigation Model

- P4-R650 — CC top-level navigation should remain simple and view-oriented — KEEP-Foundation
- P4-R651 — Current, Planning, and Ideas function as top-level views rather than containers exposing their Projects directly — KEEP-Foundation
- P4-R652 — Ongoing, New Project, and Archive function as secondary navigation/workspaces — KEEP-Foundation
- P4-R653 — Search operates as a cross-cutting discovery layer independent of navigation location — KEEP-Foundation
- P4-R654 — AI operates as a cross-cutting project capability rather than merely another storage/navigation destination — KEEP-Foundation
- P4-R655 — Project Dashboard is the primary project-level orientation surface — KEEP-Foundation
- P4-R656 — Project Workspace provides deeper operational access without overloading the Dashboard — KEEP-Foundation
- P4-R657 — Navigation, Search, Project data, Resources, and AI capabilities remain distinct architectural concerns — KEEP-Foundation

### Category 51 — Core Object Model

- P4-R658 — CC must define distinct core object types rather than representing all information as generic Project content — KEEP-Foundation
- P4-R659 — Core objects include Project, Source, File, Repository, Thread Reference, Decision, Task, Flag, Blocker, External Cutoff, Handover, Seed, Kernel, Template, AI Participant, Agent, History Event, and Notification (this specific inventory is not to be frozen as an implementation schema — the separation-of-concepts principle is architectural; the exact object list may still evolve) — KEEP-Foundation
- P4-R660 — Objects must support explicit relationships between one another — KEEP-Foundation
- P4-R661 — Physical file location and Project association remain separate concepts — KEEP-Foundation
- P4-R662 — A File may be associated with multiple Projects where appropriate — KEEP-Foundation
- P4-R663 — Thread References must be first-class CC records containing provider, thread identity, purpose, Project association, and relevant context — KEEP-Foundation
- P4-R664 — Decisions must preserve provenance, including who established the authoritative decision — KEEP-Foundation
- P4-R665 — Next Action should normally reference an existing Task rather than duplicate Task information — KEEP-Foundation
- P4-R666 — Attention should remain a view/surface over underlying objects rather than becoming a duplicate data object — KEEP-Foundation
- P4-R667 — Search should remain a query/discovery mechanism rather than a stored object type — KEEP-Foundation
- P4-R668 — Dashboard and Workspace remain views over the underlying CC data model — KEEP-Foundation
- P4-R669 — The core object/relationship model is independent of Obsidian-specific presentation — KEEP-Foundation

### Category 52 — The Portable Data Layer

- P4-R670 — CC must have a platform-independent underlying data model — KEEP-Foundation
- P4-R671 — The initial data representation should be compatible with Markdown and structured metadata — KEEP-Foundation
- P4-R672 — Obsidian must function as an interface/implementation layer, not as the underlying CC architecture — KEEP-Foundation
- P4-R673 — Core CC objects should have stable unique identifiers independent of names and physical locations — KEEP-Foundation
- P4-R674 — Relationships should reference stable object identities rather than fragile physical paths wherever practical — KEEP-Foundation
- P4-R675 — CC data should remain human-readable and independently inspectable outside the CC application — KEEP-Foundation
- P4-R676 — Git should be capable of versioning the CC data layer — KEEP-Foundation
- P4-R677 — CC should remain recoverable/readable if its primary interface application becomes unavailable — KEEP-Foundation
- P4-R678 — The data model should not require a proprietary database as its sole source of truth — KEEP-Foundation

### Category 53 — Synchronization, Conflicts & Multiple Interfaces

*(Overall: DEFER as an implementation concern, with the architectural boundary itself KEPT — see Document B for the deferred items)*

- P4-R679 — Multiple interfaces must operate against a common authoritative data layer rather than independent Project copies — KEEP-Foundation
- P4-R680 — Stable object IDs must survive movement between interfaces and storage locations — KEEP-Foundation
- P4-R681 — CC must not silently overwrite conflicting changes to authoritative records — KEEP-Foundation
- P4-R684 — AI may assist with conflict analysis but must not silently resolve governance-sensitive conflicts — KEEP-Foundation
- P4-R686 — CC should rely on existing version-control mechanisms such as Git for file-level merge/conflict handling where appropriate — KEEP-Foundation
- P4-R687 — CC should synchronize/reference external project resources without unnecessarily duplicating their contents into CC's own data layer — KEEP-Foundation

### Category 54 — Backup, Recovery & Disaster Recovery

- P4-R688 — CC must have an independent backup/recovery strategy for its own data layer — KEEP-Foundation
- P4-R689 — Git version control should contribute to CC recovery but must not be treated as the sole backup mechanism — KEEP-Foundation
- P4-R690 — CC and individual Project resources should retain distinct backup/recovery responsibilities — KEEP-Foundation
- P4-R691 — Recovery must preserve stable CC object identities — KEEP-Foundation
- P4-R692 — Recovery must preserve relationships between CC objects — KEEP-Foundation
- P4-R693 — CC must detect and clearly report missing or inaccessible resources after recovery — KEEP-Foundation
- P4-R694 — CC must distinguish missing resources from temporarily unavailable external providers — KEEP-Foundation
- P4-R695 — CC recovery must remain independent of the original presentation platform — KEEP-Foundation
- P4-R696 — A recovered CC data layer should be usable by a replacement interface without requiring reconstruction of the original Obsidian implementation — KEEP-Foundation

### Category 55 — Security, Privacy & Trust Boundaries

- P4-R697 — AI visibility/access and AI modification authority must be modeled as separate concepts — KEEP-Foundation
- P4-R699 — Sensitive resources must not automatically become visible to every AI or Agent associated with a Project — KEEP-Foundation
- P4-R700 — Credentials, passwords, API keys, OAuth tokens, and similar secrets must not be stored as ordinary CC Project data — KEEP-Foundation
- P4-R701 — AI provider access must be treated as a separate trust boundary — KEEP-Foundation
- P4-R702 — Thread References may exist without CC possessing the underlying provider conversation — KEEP-Foundation
- P4-R703 — Agents should default to narrower access scopes than general Project-level AI participants — KEEP-Foundation
- P4-R704 — CC must respect access controls imposed by external resource providers — KEEP-Foundation
- P4-R706 — CC must not claim security, privacy, or access guarantees that are actually controlled by an external system — KEEP-Foundation

### Category 56 — External Integrations & Connectors

- P4-R707 — CC should use a Connector abstraction for external systems — KEEP-Foundation
- P4-R708 — Connectors should reference/interact with external resources rather than automatically copying entire external systems into CC — KEEP-Foundation
- P4-R709 — Connectors should expose their supported capabilities explicitly — KEEP-Foundation
- P4-R710 — Connector availability should distinguish connected, disconnected, partially available, and unavailable states where useful — KEEP-Foundation
- P4-R711 — Loss of connector availability must not destroy CC-owned resource references or metadata — KEEP-Foundation
- P4-R712 — Connector credentials/configuration should be separated from individual Project records — KEEP-Foundation
- P4-R713 — AI roles should be separable from the particular AI provider implementing that role — KEEP-Foundation
- P4-R714 — Local disk, cloud storage, repositories, and AI providers should all be representable through the connector model without forcing an identical capability set — KEEP-Foundation
- P4-R716 — Connector architecture must remain replaceable so provider/platform changes do not require restructuring the Project data model — KEEP-Foundation

### Category 57 — Platform Independence & the Eventual Standalone Command Center

- P4-R717 — Command Center architecture must remain independent of Obsidian-specific implementation details — KEEP-Foundation
- P4-R718 — Obsidian is the initial implementation/host, not the definition of Command Center itself — KEEP-Foundation
- P4-R719 — A platform-independent CC Core/Kernel should contain the fundamental object, relationship, identity, provenance, and governance model — KEEP-Foundation
- P4-R720 — Obsidian-specific presentation and storage mechanisms should remain at the implementation boundary — KEEP-Foundation
- P4-R721 — CC should not require immediate development of a standalone application merely to preserve portability — KEEP-Foundation
- P4-R722 — Migration to another interface should ultimately be achievable through portable data export/import or direct consumption of the portable data layer — KEEP-Foundation
- P4-R724 — Interfaces should be replaceable without changing the underlying Project/object model — KEEP-Foundation
- P4-R725 — Portability should include storage, repository, AI-provider, and filesystem changes in addition to UI/platform changes — KEEP-Foundation
- P4-R726 — The current Command Center implementation should be treated as a potential reusable Seed/Kernel for a future standalone Command Center application — KEEP-Foundation

### Category 58 — Versioning & Evolution of the CC Core

- P4-R727 — The CC Core/Data Model must have an explicit version identity — KEEP-Foundation
- P4-R728 — CC Core version must remain distinct from individual Project versions and application versions — KEEP-Foundation
- P4-R729 — Core evolution must support older records that lack subsequently introduced fields or structures — KEEP-Foundation
- P4-R730 — Structural data migrations must be explicit, deterministic, and inspectable — KEEP-Foundation
- P4-R731 — Significant migrations should preserve a record of what was changed and why — KEEP-Foundation
- P4-R732 — AI must not silently alter the CC Core/Data Model under the guise of cleanup or maintenance — KEEP-Foundation
- P4-R733 — Changes to the Core architecture should follow the established Architectural Change Process — KEEP-Foundation
- P4-R734 — Compatibility between Core versions and interfaces should be explicit rather than assumed — KEEP-Foundation
- P4-R735 — Core evolution must preserve the Project Bible principles of determinism, single source of truth, honest failure, and human architectural authority — KEEP-Foundation

### Category 59 — Human Authority, AI Advice & Agent Action

- P4-R736 — Human authority must remain distinct from AI recommendation and Agent action — KEEP-Foundation
- P4-R737 — Kurt (the Project Owner) remains the final authority for CC architecture and authoritative architectural decisions — KEEP-Foundation
- P4-R738 — AI-generated recommendations must remain distinguishable from accepted Decisions — KEEP-Foundation
- P4-R739 — Accepted AI recommendations become authoritative only through the appropriate human decision process — KEEP-Foundation
- P4-R740 — Agents may operate autonomously within explicitly defined scopes — KEEP-Foundation
- P4-R741 — Agent authority should distinguish Read, Propose, Update, Execute, and Governance capabilities — KEEP-Foundation
- P4-R742 — Routine authorized operational updates may occur without individual human approval when explicitly permitted — KEEP-Foundation
- P4-R743 — Governance-sensitive changes require stronger authority than routine operational updates — KEEP-Foundation
- P4-R744 — External side-effect actions must be distinguishable from internal CC metadata updates — KEEP-Foundation
- P4-R745 — Agent actions must be recorded in History with actor, action, reason/source, and relevant authorization context where possible — KEEP-Foundation
- P4-R746 — CC must preserve provenance linking AI recommendations, discussions, human decisions, and resulting actions — KEEP-Foundation

### Category 60 — Audit Trail & Provenance

- P4-R747 — CC History must preserve meaningful changes and actions, not merely timestamps — KEEP-Foundation
- P4-R748 — History events should identify what happened, actor/source, time, reason, and relevant relationships where available — KEEP-Foundation
- P4-R749 — Provenance must distinguish Human, AI, Agent, and External System sources — KEEP-Foundation
- P4-R750 — Decisions should be traceable to relevant discussions, Threads, Sources, and human approval where applicable — KEEP-Foundation
- P4-R751 — Handover artifacts must be represented as first-class provenance/context records — KEEP-Foundation
- P4-R752 — AI handovers and general "How to Work With Kurt" context should remain distinguishable from architectural Decisions — KEEP-Foundation
- P4-R753 — Provenance must survive data migrations and interface/platform changes — KEEP-Foundation
- P4-R754 — CC should distinguish observed Facts, AI/Agent Inferences, Recommendations, and authoritative Decisions — KEEP-Foundation
- P4-R755 — Provenance should make significant historical Decisions reconstructable rather than merely recording their final state — KEEP-Foundation

### Category 61 — Notifications, Signals & Attention

- P4-R756 — CC should distinguish raw Signals from surfaced Attention and stronger Notifications/Alerts — KEEP-Foundation
- P4-R757 — Attention should remain contextual to the Project and its current state — KEEP-Foundation
- P4-R758 — CC should favor signal-to-noise reduction rather than surfacing every detected event — KEEP-Foundation
- P4-R759 — Signals may originate from local filesystems, repositories, cloud resources, AI Threads, Agents, Tasks, deadlines, and external services — KEEP-Foundation
- P4-R760 — AI/Agents may interpret Signals and propose Attention items without automatically converting inference into fact or authoritative state — KEEP-Foundation
- P4-R761 — Hard External Cutoffs should be capable of generating escalating Attention based on proximity and Project state — KEEP-Foundation
- P4-R762 — Attention items should explain the underlying reason rather than merely presenting severity indicators — KEEP-Foundation
- P4-R763 — AI/Agent-generated Attention should preserve source and confidence/provenance where appropriate — KEEP-Foundation

### Category 62 — Project Re-entry & Context Recovery

- P4-R765 — Project Re-entry must be treated as a first-class CC capability — KEEP-Foundation
- P4-R766 — Project Dashboard must provide sufficient context to answer Where was I, How was I doing this, What changed, and What do I do next — KEEP-Foundation
- P4-R767 — Re-entry information should be layered from immediate orientation to detailed historical records — KEEP-Foundation
- P4-R768 — CC should adapt the depth of re-entry information to the elapsed time since meaningful Project activity/last visit where practical — KEEP-Foundation
- P4-R769 — AI may synthesize re-entry briefings from authoritative CC records — KEEP-Foundation
- P4-R770 — Re-entry briefings should distinguish known recorded facts from AI interpretation — KEEP-Foundation
- P4-R771 — Re-entry should surface the most relevant Thread References rather than requiring the user to search manually through old conversations — KEEP-Foundation
- P4-R772 — Handover chains should be discoverable as part of AI context recovery — KEEP-Foundation
- P4-R773 — Re-entry must not require reconstructing Project context from raw chat history — KEEP-Foundation

### Category 63 — Project Dashboard vs. Project Workspace

- P4-R774 — Project Dashboard and Project Workspace must have distinct cognitive purposes — KEEP-Foundation
- P4-R775 — Dashboard is primarily an orientation/re-entry surface — KEEP-Foundation
- P4-R776 — Workspace is primarily an execution/work surface — KEEP-Foundation
- P4-R777 — Dashboard should provide stable, recognizable orientation regions — KEEP-Foundation
- P4-R778 — Workspace may vary significantly according to Project type and tools — KEEP-Foundation
- P4-R779 — Project-specific tools and dense operational resources belong primarily in Workspace rather than Dashboard — KEEP-Foundation
- P4-R780 — Temporary/scratch/spitballing material should have a legitimate place within the Project workflow without necessarily becoming formal Project data immediately — KEEP-Foundation
- P4-R781 — "Edit Using" belongs primarily in the Workspace/resource interaction layer — KEEP-Foundation
- P4-R782 — Application suggestions for files should consider file type, available Mac applications, and Project context rather than assuming a single application from an extension — KEEP-Foundation
- P4-R783 — Dashboard and Workspace should not duplicate each other's responsibilities — KEEP-Foundation
- P4-R784 — Navigation between Dashboard and Workspace should be lightweight and reversible — KEEP-Foundation

### Category 64 — The Project List

- P4-R785 — Project List should function primarily as a scanning/selection surface — KEEP-Foundation
- P4-R786 — Project cards should expose only high-value orientation information — KEEP-Foundation
- P4-R787 — Project List should not duplicate full Dashboard or Workspace content — KEEP-Foundation
- P4-R788 — Project Attention should be visible in compact form on Project List cards — KEEP-Foundation
- P4-R789 — Hard External Cutoffs should be visibly distinguishable from ordinary targets/goals — KEEP-Foundation
- P4-R790 — Project State should be glanceable from the Project List — KEEP-Foundation
- P4-R791 — Manual Project ordering should remain possible even if automatic sorting is eventually supported — KEEP-Foundation
- P4-R792 — Search and Project List must remain distinct functions — KEEP-Foundation
- P4-R793 — New Project should remain accessible from Project List while Ideas/New Project workflows remain valid alternate entry points — KEEP-Foundation
- P4-R794 — Paused/waiting Projects should remain discoverable rather than being treated as nonexistent — KEEP-Foundation
- P4-R795 — Project State and Project Visibility should remain separate concepts as a general principle (the *complete* model of this distinction is OPEN — see Document D) — KEEP-Foundation

*(Note: Category 64's "Project State" examples in the source material — Current, Planning, Idea, Paused, Completed, Archived — list several values that overlap with or reintroduce the rejected Category 49 taxonomy. Only the single-tier `ProjectRecord.status` field plus the Category 1 five-value vocabulary is authoritative; "Paused" and "Completed" as formal states remain rejected per the Category 49 correction in the prior chunk.)*

---

## Cross-Category Architectural Foundations (Steps 50–64)

- Navigation is not the data model — Dashboard/Workspace/Search are views, not objects
- Stable IDs are more fundamental than physical locations
- Obsidian is a replaceable interface, not the architecture — "the current host of Command Center, not the boundary of Command Center"
- Synchronization is future work, not a Phase 4 concern
- Recovery must preserve the CC knowledge model, not merely restore files
- Discovery, Access, and Authority are three separate, increasingly narrow boundaries
- Credentials do not belong in ordinary CC records
- External systems remain external; CC references rather than warehouses them via Connectors
- Human authority, AI recommendation, and Agent action are three fundamentally different things — "AI can assist the architect. AI does not become the architect."
- Provenance distinguishes Fact → Interpretation → Recommendation → Human Decision → Action → Result
- Project Re-entry is a first-class capability, not an incidental feature
- Dashboard = orient me; Workspace = let me work; Project List = which one?
