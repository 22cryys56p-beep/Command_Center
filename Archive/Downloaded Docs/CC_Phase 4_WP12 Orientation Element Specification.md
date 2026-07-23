---
type: implementation-specification
phase: 4
work_package: WP12
status: draft — pending review and approval
governs: implementation of Phase 3 Section C only
date: 2026-07-23
---

# Phase 4 — WP12: Orientation Element Specification

This document specifies the implementation of the persistent orientation element. It does not modify Phase 3 Section C, or any other frozen decision. Where implementation planning surfaces a conflict, it is raised as an ACP below, not resolved silently.

---

## Purpose

Implement the single persistent UI element defined in Phase 3 Section C — present from the Category Screen onward, and nowhere else — that gives the user orientation (where am I), lateral movement (paging between siblings of the current object), and one fixed vertical action each way (`Up`, `Top`). This is the layer every future screen (Category, List, Dashboard, Workspace) will mount into and depend on for navigation; WP12 does not implement any of those screens itself.

---

## Governing Phase 3 Sections

- **Section C (Final Navigation Model)** — the direct and complete governing section: the five-component set (`<<`, center label, `>>`, `Up`, `Top`), the object-based sibling paging rule, `Up`'s parent-depth behavior, `Top`'s absolute-reset behavior, and the disabled-state rule.
- **Section A (Final Architecture Overview)** — screen hierarchy and the Entry/Top lifecycle distinction (Entry is a once-per-session event; `Top` never returns to Entry, only to Category).
- **Section D** — referenced only for how each screen is expected to consume the orientation element (center label content, which object is "current" at each depth); WP12 does not implement Section D's screens themselves.
- **ACP-004** (paging scope — object-based, not screen-based) and **ACP-007** (the `Up` component and its Workspace→Dashboard behavior) — both fully incorporated into Section C already; WP12 implements what those ACPs resolved, it does not reopen them.

---

## Relationship to ProjectRecord (WP11)

The orientation element is **read-only** with respect to `ProjectRecord` — this mirrors the same boundary WP5/WP6 already established for the Dashboard and Workspace screens, applied here to the shallower layer that will eventually host them.

Specifically, the orientation element needs:

- **To determine sibling sets for `<<`/`>>` paging.** At project-object depth (Dashboard/Workspace, once those screens exist), this means reading the ordered set of `project_id`s whose `status` matches the currently active category — a filtered read over `ProjectRecord.status`, using WP11's `ProjectStatus` type directly, no new type introduced.
- **To read `name`** for the center label when a project is the current object (e.g., `Command Center: Current: Teacher Toolbox`).

It does **not** need, and must not read, any other `ProjectRecord` field — `focus`, `milestone`, `progress`, `next_action`, `blockers`, `repo_reference`, `last_updated` are all out of scope for this layer, consistent with WP11's field being scoped for Dashboard/List, not for navigation chrome.

**No write path.** The orientation element never writes to a `ProjectRecord`, under any circumstance — paging, stepping `Up`, or pressing `Top` are all pure navigation-state changes, never data changes. This is a direct carry-forward of the same absolute already established for WP5 and WP6.

---

## User-Facing Responsibilities

Exactly four user-facing responsibilities, implemented through the five Section C components (`<<`, center label, `>>`, `Up`, `Top`). The center label is display-only and therefore does not represent a separate user action.

1. **Show where the user currently is** (center label), accurately and immediately on every depth change — no lag between a navigation action and the label reflecting it.
2. **Move laterally among siblings of the current object** (`<<`/`>>`) — category-to-category at Category/List depth, project-to-project within the active category at Dashboard/Workspace depth — without requiring a detour through an intermediate screen.
3. **Move up one level within the current object** (`Up`) — currently meaningful only at Workspace, returning to that same project's Dashboard, preserving object identity.
4. **Reset to Category Screen from anywhere** (`Top`) — the one absolute, history-independent escape hatch, available from any depth at which the orientation element is present at all.

The element has no responsibility beyond these four — it does not show project detail, it does not offer a project switcher, and it does not attempt to summarize portfolio state. Those exclusions were already decided in Section C's Persistent vs. Dynamic UI discussion and are restated here only as a boundary check, not a new decision.

---

## Data Dependencies

- **WP11's `ProjectStatus` type** — used to filter the sibling set when the current object is a project (Dashboard/Workspace depth).
- **WP11's `ProjectRecord.name`** — used for the center label when a project is the current object.
- **The fixed category enumeration** (`possible`, `planned`, `current`, `completed`, per ACP-001) — used when the current object is a category (Category/List depth). This is architectural, not data — it does not come from any individual `ProjectRecord`, and WP12 must not treat it as if it were user data subject to the same validation rules as WP11's fields.

No dependency on any screen-layer code (WP13+ Category/List/Dashboard/Workspace implementations) — this would invert the intended dependency direction (screens depend on the orientation element, not the reverse) and must not be introduced.

---

## Component Boundaries

Exactly five components, matching Section C precisely — no more, no fewer:

| Component | Responsibility | Notes |
|---|---|---|
| `<<` | previous sibling of current object | disabled (not hidden) when no sibling exists |
| Center label | current location, display-only | not an input; updates atomically with every depth change |
| `>>` | next sibling of current object | disabled (not hidden) when no sibling exists |
| `Up` | parent depth within current object | enabled only at Workspace depth (currently) |
| `Top` | Category Screen, absolute reset | always enabled once the element is present at all |

**Adding a sixth component requires a new ACP** — Section C already treats the persistent-element count as a deliberate minimum, not a starting point, and WP12 does not get to loosen that by implementation convenience.

**What is explicitly out of this WP's boundary:** the actual Category, List, Dashboard, and Workspace screen implementations. WP12 builds the orientation element as a standalone, screen-agnostic module that those later WPs will mount underneath — it does not build any of those screens itself, even minimally, even as a placeholder.

---

## Persistence Behavior

The orientation element carries **no persisted state of its own** across sessions. Per Section A's Entry/Top distinction: Entry is a once-per-session lifecycle event, meaning the orientation element does not exist prior to Entry and does not need to "remember" anything from a previous session once Entry occurs again.

Within a single session:
- **Current object and depth are held in memory only** — not written to any file, not stored in `ProjectRecord`, not cached to disk. This follows directly from WP1/WP10's "no duplicated authoritative state" principle: navigation position is not project data and must never be treated as if it were.
- **No scroll position, selection history, or "last viewed" state is retained** between visits to the same depth — this was already established as a determinism requirement at WP3/WP4 (Phase 3), and applies identically here: re-arriving at a given object/depth combination must produce the same orientation-element state every time, given the same current object.

---

## Testing Requirements

Following WP10's testing strategy (automated tests for deterministic logic, manual verification for anything requiring the Obsidian runtime):

**Automated (unit-testable, no Obsidian dependency required):**
- Sibling-resolution logic: given a set of `ProjectRecord`s and an active category, correctly computes the ordered sibling set of `project_id`s; given the fixed category enumeration, correctly computes category siblings.
- Object-based paging logic: `<<`/`>>` requests resolve against the *current object's* sibling set regardless of which screen is asking — this is the core of ACP-004 and deserves direct test coverage, not just visual confirmation.
- `Up` availability logic: enabled if and only if the current object is a project at Workspace depth; disabled at every other depth, per Section C's table.
- `Top` availability logic: enabled whenever the orientation element is present at all (i.e., from Category Screen onward).
- Disabled-state resolution: sibling set of size zero or one correctly yields a disabled (not hidden, not absent) `<<`/`>>` state.
- Center label content resolution: given a current object and depth, produces the correct label string (e.g., `Command Center: Projects`, `Command Center: Current`, `Command Center: Current: Teacher Toolbox`).

**Manual (requires Obsidian runtime, not automated at this stage):**
- Visual confirmation that a disabled component renders as visibly disabled, not hidden — Section C's rule is about user-visible behavior, which automated logic tests can confirm the *state* of but not the *rendering* of.
- Confirmation that the element persists visually across a depth change without disappearing/re-mounting in a way that would violate the Continuity Principle (Section C, Interaction Principles).

This split mirrors WP11's own precedent: pure logic gets automated tests; anything requiring the actual Obsidian rendering surface is verified manually, since standing up automated UI testing inside Obsidian's runtime was already judged (at WP10) to be disproportionately costly at this project's current scale.

---

## Dependencies

- **WP10** — environment and stack decisions (TypeScript, no framework, Obsidian API, esbuild). WP12 introduces no dependency beyond what WP10 already approved.
- **WP11** — `ProjectRecord` type and `ProjectStatus` enum, read-only.
- **Depended on by:** every future screen work package (Category, List, Dashboard, Workspace) — none of those can be implemented before WP12 exists, since Section D's screen definitions all assume the orientation element is already present and functioning.

---

## Implementation Sequence

1. Sibling-resolution logic (category siblings; project siblings within an active category) — pure functions, no Obsidian dependency, fully unit-testable first.
2. Object-based paging resolution (`<<`/`>>` against current object) — built directly on (1).
3. `Up` / `Top` availability and destination logic — independent of (1)/(2), can be built in parallel.
4. Center label content resolution — depends on (1) for project-name lookups (via WP11), otherwise independent.
5. Obsidian-runtime rendering of the five components as an actual persistent view element — the first point at which this WP touches the Obsidian API surface directly; everything before this step is pure, environment-independent logic.
6. Manual verification pass against Section C's disabled-state and Continuity requirements.

This sequence keeps the Obsidian-dependent work (step 5) as small and late as possible, consistent with WP10's stated preference for isolating platform-specific code from pure logic wherever the architecture allows it.

---

## ACP Issues Discovered While Planning WP12

None identified. Section C, together with ACP-004 and ACP-007, already fully specifies this component's behavior; no new architectural question was surfaced in producing this specification.

---

Specification complete. Holding here — no source files created. Awaiting review and approval before implementation begins.
