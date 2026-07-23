---
type: specification
phase: 2
status: draft — architecture only, no implementation
date: 2026-07-22
governs: all future Command Center implementation
---

# Command Center — UI Architecture Specification

This document is the architectural blueprint for Command Center's eventual interface. It describes **behavior, not code**. Every decision below is evaluated against the ten design principles established in Phase 1, and against the two operating rules clarified since: preparation must not increase present cognitive load (principles 7/8 resolution), and project status is metadata, never physical location.

No files are modified by this document. No implementation begins here.

---

## 1. Screen Hierarchy

Four screens, each answering exactly one question, each a strict narrowing of the one before it.

```
Entry Screen           "What is Command Center?"
      ↓
Category Screen        "Which group of projects am I looking at?"
      ↓
Project List Screen    "Which project am I going into?"
      ↓
Project Dashboard      "What's the state of this one project?"
      ↓
Project Workspace      "Let me actually work in it."
```

**Entry Screen** — the front door. Its only job is to say "you are in Command Center" and offer one action: enter. This screen exists mainly to satisfy the "native app" feel (an app has a title screen; a folder does not) and to give the interface a stable, calm starting point rather than dropping the user mid-context every time.

**Category Screen** — the three-way fork: Current / Planned / Possible. This is the single most important screen in the hierarchy, because it's the first point where the portfolio's *shape* becomes visible. Per the philosophy, this screen should answer "which group" without requiring the user to know or care what a "group" means structurally underneath.

**Project List Screen** — within a chosen category, a list of projects. At 1-2 projects (today) this screen may feel like unnecessary overhead. At 5-10 (your stated near-term scale) it becomes load-bearing. It should scale down gracefully to a single-item list without looking broken, since the same screen has to work at both scales without a redesign later (principle 6, longevity).

**Individual Project Dashboard** — the "at a glance" screen. This is the literal fulfillment of the requirement you stated directly: look at one screen, know the state of one project, in seconds. Status, progress, current focus, next action, blockers — nothing more.

**Project Workspace** — the "go deeper" layer. Everything that currently lives in Reference/, Resources/, AI Context/, Milestones/, Kanban — the actual working material. This is where Obsidian-native browsing (or its eventual replacement) takes over from the app-like shell.

**User's journey, stated plainly:** Open Command Center → pick a lens (Current/Planned/Possible) → pick a project → see its state instantly → optionally go deeper to actually work. Every step down the hierarchy is optional except reaching the Dashboard — the architecture should never force a user through the Workspace layer just to check status.

---

## 2. Navigation Model

Your proposed model is fundamentally sound. It correctly separates three distinct navigational needs — orientation (where am I), lateral movement (paging between peers), and vertical movement (going deeper/shallower) — which is exactly the kind of separation that keeps navigation legible as the portfolio scales. Refining it below, preserving its shape.

```
Entry Screen
      [Command Center: Projects]
        ↓ (single action: enter)

Persistent Header  (appears from here on, every screen)
[<<]   [Command Center: Projects]   [>>]        [Top]
        ↓

Category Selection
[Current]   [Planned]   [Possible]
        ↓

Project List  (new — see note below)
        ↓

Individual Project Dashboard
        ↓

Project Workspace
```

**One addition: an explicit Project List step.** Your original diagram goes Category → "Project Selection" → Dashboard as a single beat. That's fine at today's scale (one project per category), but at 5-10 Current projects, "Project Selection" needs to actually be a screen a user can scan — not an implicit transition. Making it explicit now costs nothing (it can render as a single card today) and avoids a structural change later when project count grows — this is preparation-without-surfacing-cost, consistent with the 7/8 resolution: the screen exists, but with one project in it, it imposes no real decision-making load.

**`[<<] [>>]` — refined meaning.** Read literally, "paging" only makes sense between sibling items at the *same* level — e.g., paging between projects within a category, or paging between categories. It should not be a generic back/forward browser-history button, which would violate principle 5 (deterministic behavior) by making its result depend on where you came from rather than what it does. Recommend: `<<`/`>>` page between siblings at the current level (project ↔ project, or category ↔ category), always with a fixed, predictable meaning at each screen.

**`[Top]` — refined meaning.** Rather than "go back one step" (which duplicates browser-style back navigation and invites ambiguity), `[Top]` should mean one specific thing everywhere it appears: **return to the Category Screen.** One button, one destination, always. This satisfies principle 5 directly — same action, same result, from anywhere in the hierarchy.

**Depth indicator.** The header's center label — `[Command Center: Projects]` — should update contextually as the user descends (e.g., becoming `Command Center: Current: Teacher Toolbox` at the Dashboard level), so the header itself communicates "where am I" without a separate breadcrumb element competing for space. This keeps the header doing one job well rather than adding a second navigational element.

---

## 3. Persistent vs. Dynamic UI

**Persistent (visible on every screen from Category Selection onward):**
- The Header itself (`<<`, center label, `>>`, `Top`)
- Nothing else. The header should be the *only* persistent chrome.

This is a deliberately minimal answer, and it's deliberate for a reason: every additional persistent element is a thing the user sees and must mentally filter out on every screen, forever — a direct cost against principle 7. A single, consistent header satisfies the "always know where I am, always have a way out" need without becoming wallpaper.

**Dynamic (changes per screen, appears only where relevant):**
- Category tabs — only visible at the Category Screen
- Project list — only visible at the Project List Screen
- Dashboard content (status, milestone, progress, next action, blockers) — only at the Dashboard
- Workspace navigation (into Vision, Roadmap, Kanban, AI Context, etc.) — only inside a Project Workspace, and only for the project currently open

**Explicitly NOT persistent, even though it might seem convenient:**
- A global project switcher/search bar living everywhere — tempting, but it collapses the Category → List → Dashboard funnel into a shortcut that bypasses the "which group" question entirely. If ever added, it should be an explicit, separate power-user feature (e.g., a command palette invoked deliberately), not a default-visible element competing with the calm hierarchy for attention.
- A global status bar — nice-sounding, but "show me everything, always" is the opposite of the category funnel's purpose, which is to let the user choose scope before being shown detail.

---

## 4. Relationship to Obsidian

The clean split is between **data** and **presentation**, and the current vault is already closer to this split than it might appear:

**Stays as the implementation/data layer (Obsidian-native, largely untouched):**
- The folder structure itself (`Active Projects/`, category folders, per-project subfolders)
- Markdown files as the actual content and source of truth
- Frontmatter as the actual metadata store (already consistently structured — this is the single most reusable piece of the existing vault for a future UI)
- `Portfolio Map.canvas` as a legitimate data source (portable JSON; a future renderer could read it directly rather than reimplementing project relationships)
- Git as version history underneath everything

**Becomes presentation (replaced or wrapped by custom UI, not by Obsidian's native rendering):**
- Wikilink-based browsing as the primary navigation method — replaced by the Header/Category/List/Dashboard flow
- The Kanban **plugin's rendering** specifically — the underlying Markdown-backed board data can stay, but the plugin's visual board is Obsidian-dependent and should be treated as swappable, not load-bearing
- Manually maintained dashboard tables (Executive Dashboard's project list) — becomes a *generated view* over frontmatter rather than hand-typed prose

**The core principle for hiding Obsidian specifically:** the eventual UI should read the vault the way a database client reads a database — files and frontmatter as structured data to query and render — rather than the way a person browses a wiki. The user should never need to know that a "project" is a folder, that "status" is a frontmatter field, or that clicking a card is, underneath, opening a Markdown file. Obsidian's plugin API (or a fully custom renderer reading the same files) is the mechanism; it should never be the experience.

---

## 5. Project Status Model

Using the agreed definitions exactly as established:

| Status | Meaning | Trigger for this status |
|---|---|---|
| **Possible** | Idea only | No active work yet |
| **Planned** | Active architectural/structural work | Defining what it is, how it'll be built |
| **Current** | Active implementation | Code is actually being written |

**Status is metadata, not location — architectural consequence.** This is the single most important structural decision inherited from Phase 1's discussion, and it shapes the whole model above: the Category Screen (`Current`/`Planned`/`Possible`) is a **filtered view over a status field**, not three folders being browsed. A project's physical location on disk can remain wherever it already lives; the Category Screen simply asks "show me every project where `status: current`" and renders the result. Moving a project between categories becomes a single field change — not a file move, not a link update, not a canvas node edit.

**Why this matters for cognitive load specifically:** because status is authored by you alone (the hard boundary already established — never inferred by the system), the UI's only job is to (a) offer a simple, fast way to change that one field, and (b) guarantee that changing it once updates every view that depends on it — Category Screen, Executive Dashboard table, Canvas node color/grouping — simultaneously. This directly resolves the "tell the system the same thing five times" friction flagged earlier.

**Implication for existing structure:** the current `Active Projects/` / `Future Projects/` folder split doesn't need to be undone — those folders can continue to reflect a *rough* default grouping if that's ever convenient for raw-vault browsing without the UI running. But the UI layer's Category Screen should never treat folder membership as the authority. Frontmatter status is the single source of truth; folder location is, at most, a cosmetic convenience for anyone browsing the raw vault directly.

---

## 6. Metadata Strategy (Information Architecture, Not Storage)

The UI's Project Dashboard and Project List views need a consistent minimum set of facts about every project, regardless of category. Framed as information the interface needs to *know*, not where it needs to come from:

**Required for every project, at every status level:**
- **Name** — the project's identity, stable across its whole lifecycle
- **Status** — Current / Planned / Possible (Section 5)
- **One-line focus** — what this project currently is or is about, short enough to read at a glance

**Required once a project reaches Planned or Current:**
- **Current milestone** — the active named phase of work
- **Progress** — a simple, honest signal (not necessarily a percentage; could be as coarse as "just started / underway / nearly done")
- **Next action** — the single next concrete step, matching the existing Dashboard pattern already in use for Teacher Toolbox
- **Blockers** — present only when they exist; absence of blockers should read as calm, not as an empty field demanding attention

**Required only once a project reaches Current:**
- **Operating environment reference** — where the actual code lives (external, never the vault itself, per the existing and correct boundary)
- **Last updated** — a freshness signal, directly addressing the "stale dashboard is worse than no dashboard" failure mode surfaced during the Teacher Toolbox discussion. This becomes especially important as portfolio size grows: with 5-10 active projects, staleness is far more likely to go unnoticed than with one.

**Explicitly out of scope for the Dashboard/List views (lives only in the Workspace layer):**
- Full architecture documents, decision logs, meeting notes, research — anything from Reference/. These are workspace-depth content, not glance-depth content. Surfacing them earlier than the Workspace layer would directly violate the "at a glance" goal by forcing a scan through material that only matters once you've deliberately gone deeper.

This is deliberately the same shape of information the current Teacher Toolbox Dashboard.md already captures by hand — the information architecture isn't new, it's the existing pattern generalized to be queryable across many projects instead of manually written once.

---

## 7. Scalability

At **5-10 active projects**, the model above already holds without change — Project List Screen shows 5-10 scannable cards, Category tabs stay meaningful, no screen needs restructuring.

At **dozens of Planned projects**, a plain list starts to strain even though it's "just" a list — dozens of equally-weighted cards is itself a cognitive load problem (principle 7), even without any additional folder complexity. The architectural provision to make now (not build now): the Project List Screen should support **secondary organization within a category** — grouping, sorting, or lightweight filtering (by recency, by tag, by name) — as an evolution of the same screen, not a new one. Because status is already metadata (Section 5) and projects already carry consistent frontmatter (Section 6), this is a rendering change over existing data, not a new information architecture.

At **hundreds of Completed projects**, browsing stops being the right interaction model entirely — nobody scans hundreds of cards looking for one thing. Completed's screen should architecturally diverge from Current/Planned/Possible's model at this scale: search/lookup becomes the primary interaction, with browsing as secondary. This is worth naming now, architecturally, precisely so the Completed category is never forced to awkwardly retrofit the same card-list pattern used elsewhere just for consistency's sake — principle 9 (preserve good work) cuts both ways: don't force uniformity where the actual need has diverged.

**The throughline across all three scales:** cognitive load is managed by progressively revealing structure (grouping, search) only once flat lists stop being sufficient — never by pre-building that structure before it's earned its place, per the 7/8 resolution. A portfolio of 2 projects and a portfolio of 200 should be able to run on the same underlying architecture, differing only in which optional layer (grouping, search) is currently active.

---

## 8. Future UI Evolution — Architectural Boundaries

The goal here is not to design the eventual CSS/HTML/JS/plugin layer, but to make sure today's architecture doesn't have to be undone to make room for it later.

**Boundary 1 — Data and presentation must stay separable.** Every UI element described above (Header, Category tabs, Project cards, Dashboard fields) should be describable purely in terms of *what data it displays and what action it triggers*, never in terms of *how it's rendered*. This is already mostly true of the existing frontmatter-driven pattern; the discipline to preserve going forward is to keep new fields and structures equally clean, so a future renderer (custom CSS theme, a plugin, or a fully separate app shell) can be swapped in without touching the underlying vault content.

**Boundary 2 — Status changes and other user actions must route through one mechanism, not many.** Whatever eventually lets a user change a project's status (a dropdown, a command, a drag gesture) should update the single frontmatter field described in Section 5 — never a bespoke, screen-specific update path. This means new interaction surfaces can be added later (a mobile view, a keyboard-driven palette, a voice interface, whatever) without each one needing its own logic for "what does changing status actually do."

**Boundary 3 — The screen hierarchy (Section 1) should remain the stable skeleton.** CSS/JS/plugins are expected to change *how* each screen looks and feels, extensively, over years (principle 6). They should not be expected to change *how many screens there are or what each one is responsible for* — that hierarchy is the part designed to last; the visual layer is the part designed to be replaced freely.

**Boundary 4 — Nothing in the interaction model should assume Obsidian specifically.** Every behavior described in this document (paging, the Top button, category filtering, dashboard fields) is described in terms general enough to be implemented as an Obsidian plugin/CSS theme *or* as a fully separate native/web application reading the same underlying files. This is what actually delivers on principle 10 (technology is a means) at the architecture level — the vault's content should be portable to a different renderer entirely without requiring the content itself to change.

---

## Summary

This specification keeps the screen count small (5 screens), the persistent chrome minimal (one header), the navigation deterministic (`<<`/`>>`/`Top` each mean exactly one thing everywhere), and status entirely decoupled from physical file location. It extends today's frontmatter pattern rather than replacing it, treats the existing Portfolio Map canvas and Markdown content as reusable data rather than legacy to discard, and defers all structural additions (grouping, search) until the scale that actually demands them — consistent with the principles-7/8 resolution that preparation is fine, but only where it doesn't cost anything before it pays off.

Nothing here has been implemented. This document is offered as the blueprint against which any future implementation proposal — from any collaborator, on any timeline — can be checked for consistency.
