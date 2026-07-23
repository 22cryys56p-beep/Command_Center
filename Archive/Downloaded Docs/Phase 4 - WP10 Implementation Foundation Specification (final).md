---
type: implementation-specification
phase: 4
work_package: WP10
status: closed — approved and frozen
governs: implementation environment only, not implementation content
date: 2026-07-22
---

# Phase 4 — WP10: Implementation Foundation Specification

This document defines the environment in which the frozen Phase 3 architecture will be built. No production code is written here. No Phase 3 decision is reopened. Where implementation reality creates friction with a frozen decision, it is raised as a new ACP below, not resolved silently.

---

## 1. Target Implementation Environment

### Recommendation: Obsidian plugin

### Alternatives Considered

**Native application (Electron, Tauri, or platform-native):**
Would require building a file parser, a Markdown/frontmatter reader, a folder-watcher, and a rendering engine from scratch — all problems Obsidian has already solved and that the existing vault already depends on. At $0 budget, this is a large amount of infrastructure to build and maintain solely to reach parity with what the current implementation layer already provides. Rejected as the *initial* target — not because it's unreachable long-term (V1.0 Boundary 4 explicitly keeps this door open), but because it fails the "smallest, clearest, most recoverable foundation" test right now.

**Web application (hosted):**
Introduces a server, a deployment pipeline, and a hosting cost — direct conflict with the $0 budget constraint and with "avoidance of unnecessary infrastructure." Also reintroduces a data-location question Phase 3 never asked: where would the Project Record actually live if not in the vault? Rejected.

**Web application (local-only, browser-based):**
Avoids hosting cost, but requires either re-implementing file-system access (browsers restrict this) or relying on browser storage — which is fragile, non-portable, and disconnected from the actual vault contents on disk. Rejected — recoverability suffers badly if the authoritative data lives somewhere the user can't directly inspect or back up with normal tools (Git, file copy).

**Obsidian plugin (recommended):**
The vault already *is* the Project Record's home — WP1's Metadata Layer is already realized today as Markdown frontmatter, in the same repository already under Git version control. A plugin reads and renders that existing data through Obsidian's own APIs rather than reimplementing file parsing, frontmatter reading, or a rendering surface. This directly satisfies every stated requirement:

- **$0 budget** — Obsidian itself is free; plugin development requires no paid tooling, hosting, or services.
- **Long-term maintainability** — Obsidian's plugin API is stable and widely documented; a large existing developer community means patterns and prior art exist for nearly every UI need Phase 3 describes.
- **Simplicity** — no server, no deployment pipeline, no database engine to operate; the plugin runs inside an application that already handles file I/O, sync, and rendering infrastructure.
- **Recoverability** — the Project Record remains plain text in Git the whole time; if the plugin is ever abandoned or broken, the underlying data is still fully readable and editable by hand, exactly as it is today.
- **AI-assisted development workflow** — Obsidian plugins are written in TypeScript, a language well-represented in AI training data and tooling, with a small, well-scoped API surface — favorable for AI-assisted implementation and review.
- **Avoidance of unnecessary infrastructure** — this is the strongest point in its favor: everything else on this list is infrastructure the plugin route simply doesn't need to build.

This choice is also consistent with V1.0 Section 4's own framing, established back in Phase 2: Obsidian is *today's* implementation layer, explicitly named as replaceable later without requiring the underlying vault content to change. Choosing the plugin route now doesn't foreclose the native-app future V1.0 describes — it defers that cost until there's a concrete reason to pay it.

---

## 2. Technology Stack

- **Language:** TypeScript — required by the Obsidian plugin API, and directly supports WP1's requirement for a strongly-typed, validated Project Record (status enum, field types, tiered requirements all map cleanly onto TypeScript's type system).
- **Framework:** none beyond the Obsidian Plugin API itself for the initial build. Screens are rendered using Obsidian's own `ItemView` / `Component` primitives rather than introducing a UI framework (React, Svelte, Vue). This is a deliberate simplicity choice: Phase 3 defines five screens and one persistent element — a small, well-bounded UI surface that does not yet demonstrate a need for a framework's added complexity and dependency weight. If the UI surface grows in ways that genuinely strain plain TypeScript/DOM rendering, that would be a concrete, demonstrated reason to introduce one later — not a default to reach for now.
- **UI approach:** Obsidian's native view/rendering system, styled to satisfy V1.0's behavioral requirements (Continuity, Interaction Independence) without prescribing a specific visual treatment — consistent with Phase 2's repeated instruction that appearance is not architecture.
- **Data handling:** Obsidian's Metadata Cache API for reading frontmatter (the realized form of WP1's Project Record), and Obsidian's Vault/FileManager API for writes. No custom parser is built — Obsidian's own frontmatter handling is the single source of truth for reading/writing the metadata layer. Per ACP-008 (resolved), the Metadata Cache is treated as part of the implementation platform's own read mechanism, not as an application-level cache — Phase 3's "never cached" derivation rule governs Command Center's own behavior (no plugin-level storing of counts, summaries, or observations), not the platform's internal read plumbing underneath it.
- **Build tools:** esbuild, the standard, minimal build tool used by the Obsidian plugin ecosystem — chosen for its simplicity and near-universal adoption in this specific ecosystem, not for general popularity.
- **Testing approach:** automated unit tests for the data layer only (Project Record validation rules — required fields per tier, enum constraints, `last_updated` behavior) using a lightweight test runner (e.g., Vitest or Node's built-in test runner). UI-layer testing remains manual verification against the Phase 3 Architecture Record's screen-by-screen requirements (Section D of that document), since automated UI testing inside Obsidian's runtime is disproportionately costly to set up relative to the current project's scope.

---

## 3. Repository Structure

```
command-center/
├── docs/
│   └── architecture/
│       ├── Phase 1 - Architectural Assessment.md
│       ├── Phase 2 - UI Architecture Specification v1.0.md
│       └── Phase 3 - Architecture Record.md
├── src/
│   ├── main.ts                 (plugin entry point)
│   ├── data/
│   │   └── project-record.ts   (WP1: type definitions, validation rules)
│   ├── navigation/
│   │   └── orientation.ts      (WP2: persistent element, paging logic)
│   ├── views/
│   │   ├── category-view.ts    (WP3)
│   │   ├── project-list-view.ts (WP4)
│   │   ├── dashboard-view.ts   (WP5)
│   │   └── workspace-entry.ts  (WP6)
│   └── ai/
│       └── observations.ts     (WP9: bounded, read-only)
├── tests/
│   └── data/
│       └── project-record.test.ts
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
└── README.md
```

This structure directly mirrors the Phase 3 work package boundaries — one module per WP, not one module per arbitrary technical layer — so that a future collaborator (human or AI) can locate the code responsible for any given architectural decision by matching the WP number, rather than needing to infer it from generic folder names like `components/` or `utils/`. `docs/architecture/` preserves the governing specification documents inside the same repository as the code that implements them, satisfying the requirement that documentation live alongside implementation rather than in a separate, driftable location.

No folder is created without a WP to justify it — there is deliberately no `utils/`, `helpers/`, `shared/`, or similar catch-all, since none of those has a demonstrated purpose yet under Phase 3's scope.

---

## 4. Data Persistence Strategy

### Recommendation: file-based storage via existing Markdown frontmatter — no database, embedded or otherwise.

**Why this satisfies Phase 3's inherited requirements directly:**

- **Project Record remains the single source of truth** — the frontmatter block in each project's Markdown file *is* the Project Record. The plugin reads and writes through Obsidian's API, but does not maintain any separate copy of that data.
- **No duplicated authoritative state** — Category counts, Project List summaries, and Dashboard fields are all computed by querying the same underlying frontmatter at render time. No intermediate cache, index, or database table stores a second copy of status, name, or any other field.
- **Derived views remain derived** — this is enforced structurally, not just by convention: because there is no persistence layer other than the vault's own files, there is nowhere for a derived value (a count, a filtered list) to be accidentally stored as if it were authoritative. The absence of a database is itself the mechanism that guarantees this Phase 3 requirement.
- **AI observations remain computed, not stored as project truth** — for the same structural reason. WP9 observations (staleness, invalid absence) are computed in-memory from the current frontmatter state each time a Dashboard renders, and have no field, file, or table of their own to be written to even if that were attempted by mistake.

An embedded database (e.g., SQLite) was considered and rejected — it would introduce a second source of truth alongside the vault's own files, directly conflicting with "no duplicated authoritative state," and would add a dependency and recovery surface with no corresponding benefit at the current scale (a handful of active projects, per your stated 5–6 today).

---

## 5. Development Workflow

**Development sequence:** follow the Phase 3 work package order — WP1 (data layer and validation) first, since every other package depends on it; WP2 (orientation element) second, since every screen depends on it; then WP3 → WP4 → WP5 → WP6 in their existing dependency order; WP9 (AI observations) last, since it depends on WP5 being in place. This mirrors the same sequencing already used to *design* the architecture, applied now to building it.

**Testing strategy:** automated unit tests cover WP1's validation rules exhaustively (every required-field-per-tier rule, the `progress` enum constraint, `blockers` null-handling, `last_updated` write-triggering behavior) since these are pure, deterministic functions well-suited to automated testing. Screen-level behavior (WP2–WP6) is verified manually against the Phase 3 Architecture Record's Section D, screen by screen, since it depends on Obsidian's runtime rendering.

**Validation approach — architecture compliance checklist.** Before any WP is marked implemented, it is checked against the specific Phase 3 section that defines it:

| Implementation task | Checked against |
|---|---|
| Data layer | Phase 3 Record, Section B |
| Orientation element | Phase 3 Record, Section C |
| Category / List / Dashboard / Workspace | Phase 3 Record, Section D (per screen) |
| Observation surface | Phase 3 Record, Section E |

Any implementation detail not traceable to a specific section is either out of scope (per the Implementation Boundary already defined in Phase 3) or requires a new ACP before proceeding — never built silently.

**Preserving Phase 3's stated development values:**
- **Specifications before implementation** — `docs/architecture/` is populated before `src/` is written, and remains the reference every implementation task is checked against, not a historical record left behind once coding starts.
- **Honest failure over silent degradation** — invalid Project Records (per WP1's validation rules) must surface visibly (consistent with Dashboard's invalid-absence handling from WP5), never silently render as if valid.
- **Explicit dependencies** — the repository structure's one-module-per-WP mapping keeps each dependency traceable; `views/dashboard-view.ts` depending on `data/project-record.ts` is visible in the import graph, not hidden behind abstraction layers.
- **Additive extension over modification** — new work packages add new modules; they do not rewrite modules belonging to already-closed WPs, mirroring how Phase 3 itself only ever amended prior WPs through an explicit ACP, never silently.
- **Simplicity as a feature** — the "no framework, no database" decisions above are the direct expression of this value in the technology stack itself.

---

## Implementation Boundary (restated, per Phase 3's own closing section)

WP10 does not: write production code, create UI mockups, define Workspace's internal content structure, add features beyond Phase 3's scope, introduce new persistent UI components, or extend AI capability beyond WP9's observation boundary. This document defines the environment implementation will happen in — nothing has been implemented yet.

---

## ACP Registry — WP10

**ACP-008 — Metadata Cache timing and the "never cached, always live" derivation rule.**
Status: Resolved — Accepted
Resolution: Obsidian's Metadata Cache API is treated as part of the implementation platform's own read mechanism, not as an application-level cache. Phase 3's "never cached" derivation rule governs Command Center's own behavior — no plugin-level storing of counts, summaries, or observations as if authoritative — not the platform's internal read plumbing underneath it. No design change required anywhere in WP1–WP9; this is a scope clarification, not an architectural change. Applied inline to Section 2 (Technology Stack, Data handling) above.

---

WP10 is closed: approved and frozen. ACP-008 resolved and incorporated. Not beginning WP11 without further instruction.
