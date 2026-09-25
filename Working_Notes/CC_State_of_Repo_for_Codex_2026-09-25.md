# Command Center — State of Repo Since Codex's Original Roadmap

**Prepared:** 2026-09-25
**Purpose:** Factual evidence for Codex's own audit and next-step judgment. Deliberately contains no recommendation on what to do next — that's Codex's call to make, not preempted here.
**Baseline:** Codex's original roadmap, `Working_Notes/Codex CC Roadmap 2026.09.13.txt`, written at commit `9109db4`.
**Current state:** `main` at `6cb038f` (2026-09-25 19:46 JST). `tsc --noEmit` clean. 147/147 tests passing. Verified directly against the live repo, not against any summary.

---

## 1. Actual build order vs. the roadmap's proposed order

Codex's roadmap proposed sequence 1 → 2 → 3 → 4 (Gateway spec → Gateway implementation → real ProjectRecord provider → Gateway acceptance/Category retirement). The actual commit history shows a different order:

| Order landed | Milestone | Commit | Date |
|---|---|---|---|
| 1st | Milestone 1 — Gateway implementation specification | `fc6cf67` | 2026-09-13 |
| 2nd | (not in original 8 milestones) New Project entry-point shell, ACP-013 track | `849fc7a` | 2026-09-15 13:39 |
| 3rd | Milestone 2 — Gateway implementation | `631ad97` | 2026-09-15 15:38 |
| 4th | Milestone 4 — Category Screen retirement | `12725f3` | 2026-09-15 19:27 |
| 5th | Milestone 3 — Real ProjectRecord provider (WP14) | `606f954` | 2026-09-17 21:33 |

Net: Milestones 2 and 4 landed before Milestone 3, not after it as the roadmap sequenced them. Gateway ran on the stub provider for about two days before WP14 replaced it. New Project's shell (part of the separately-developed ACP-013 track, not named in the original 8 milestones) landed same-day as Gateway, ahead of both Category retirement and the real provider.

No inconsistency was found between the pieces as a result of the reordering — Gateway, Category retirement, and the real provider are each independently verified live and consistent with one another (no stub-provider references remaining, no orphaned Category Screen code).

## 2. What has landed since the roadmap baseline (`9109db4` → `6cb038f`)

In chronological order:

- **Gateway Implementation Specification** approved and placed (`fc6cf67`)
- **ACP-013** ("New Project Representation and Navigation Lifecycle") drafted, discussed, revised, approved (`2a49091`, `3fc31c2`); New Project Intake/Data Model candidate design notes captured separately (`2893870`); New Project Entry-Point Work Package Specification (`a570349`); New Project entry-point shell implemented (`849fc7a`)
- **Gateway implementation** — six-destination root navigation (`631ad97`)
- **Category Screen** retired and its legacy code, references, and scaffolding removed across several follow-up commits (`12725f3`, `eea4bb0`, `efd91e0`, `a208643`, plus related documentation corrections)
- **WP14 — Obsidian ProjectRecordProvider**: specification (`de07844`), implementation (`606f954`) — replaces the stub provider with real Obsidian frontmatter/MetadataCache-backed discovery, duplicate-ID exclusion, and validation
- **Automatic dev build/sync workflow** (`scripts/dev.mjs`) added so `main.js` auto-syncs into the Obsidian plugin folder on build (`c2d2d13`)
- **Purpose/Description open question** raised, investigated, and resolved as **ACP-014** — `purpose`/`description` established as universal-tier `ProjectRecord` fields (`6118e53`, `19457a0`); a documentation-corruption incident during this work was caught and fully restored from git history rather than regenerated (`16ebbe7`, `f4f912a`)
- **SESSION_START.md** updated multiple times, including the addition of an explicit step (step 8) requiring `Working_Notes/` be checked for open questions before treating something as newly discovered
- Most recently: a stale "Implementation status: Not yet implemented" line in the Purpose/Description Working_Notes doc — left over from before ACP-014's implementation landed — was found and corrected (`6cb038f`)

## 3. Current status of Codex's original 8 milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Gateway implementation specification | Done |
| 2 | Gateway implementation | Done |
| 3 | Real ProjectRecord provider | Done (as WP14) |
| 4 | Gateway acceptance / Category Screen retirement | Done |
| 5 | Dashboard specification | Not started |
| 6 | Dashboard implementation | Not started |
| 7 | Workspace specification and implementation | Not started |
| 8 | Cross-cutting capability tracks (Project creation, Sources, Threads, Decisions, Tasks, History, Search, AI/provenance, archive/ongoing workflows) | Not started as a track, though New Project (ACP-013) — one slice of this milestone's "Project creation" item — was built early, outside the original sequence |

The roadmap document itself, `Working_Notes/Codex CC Roadmap 2026.09.13.txt`, has not been updated to reflect any of the above — it still reads as if written at the `9109db4` baseline.

## 4. Also relevant / not yet resolved

- **P4-R797 / P4-R798** — Dashboard's presentation for missing/invalid `ProjectRecord` data. Confirmed still `OPEN` in the Matrix. Named in the roadmap's Milestone 5 as something to resolve as part of the Dashboard specification.
- A separate, smaller open question surfaced during the Purpose/Description investigation: Phase 3's Dashboard "Forbidden" list categorically excludes document-body content, which forecloses one candidate resolution path for any future similar metadata-vs-document-body question. Not currently blocking anything; noted for completeness.
- **WP12 Slice 9B / Baseline Freeze** — long-standing, explicitly non-blocking, unresolved.

## 5. AI availability at time of writing

Codex: offline until 2026-09-29. Copilot: offline until 2026-10-01. This document is intended for Codex's next audit, whenever it resumes.
