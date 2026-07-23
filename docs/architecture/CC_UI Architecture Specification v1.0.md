---
type: specification
version: 1.0
status: governing baseline — extend deliberately, do not replace wholesale
date: 2026-07-22
platform_scope: desktop and iPad (phone explicitly out of scope)
reviewed_by: Claude, GPT
---

# Command Center — UI Architecture Specification (v1.0)

This document describes how Command Center must **behave** — not how it will be coded. It is organized by topic, the way a future reader will actually approach it ("how does navigation work," "how is status handled"), not by abstract category. Within each topic, content is occasionally labeled by conceptual layer — **Architecture** (what the system must do, permanent), **Interaction Principles** (how users interact, independent of implementation, stable within the chosen platforms), and **Implementation Notes** (today's Obsidian-based realization, expected to change). A layer label appears only where a topic actually has content for it; layers are a classification aid, not a table of contents.

**Platform scope:** desktop and iPad. This is a deliberate, confirmed constraint — both are visually-driven, screen-based, direct-selection interfaces. The document does not need to accommodate voice-only, CLI-only, or phone-sized interaction models, and no longer hedges on that point.

No files are modified by this document. No implementation begins here.

**This specification defines required behavior, not required appearance. Any implementation that preserves the behaviors described herein is considered architecturally compliant, regardless of visual design or implementation technology.** This is the interpretive lens through which every section below should be read.

---

## 1. Screen Hierarchy

**Architecture**

Five screens, each answering exactly one question, each a strict narrowing of the one before it:

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

**Entry Screen** exists to establish "you are in Command Center" and offer one action: enter.

**Category Screen** is the three-way fork — Current / Planned / Possible — and the first point where the portfolio's shape becomes visible.

**Project List Screen** shows the projects within a chosen category. It must scale gracefully from a single item today to dozens later without ever needing structural redesign.

**Project Dashboard** is the literal fulfillment of the core requirement: look at one screen, know the state of one project, in seconds. Status, progress, current focus, next action, blockers — nothing more.

**Project Workspace** is the "go deeper" layer — everything that today lives in Reference/, Resources/, AI Context/, Milestones/, Kanban. Obsidian-native (or its eventual replacement's) browsing takes over from the app-like shell at this layer.

Every step down the hierarchy is optional except reaching the Dashboard — the architecture must never force a user through the Workspace layer just to check status.

**Interaction Principles**

Entry and returning-to-Category (see Section 2, "Top") are different concepts and must not be conflated. **Entry is a lifecycle event** — it exists once per session, the way opening an application does. **Returning to Category is an in-session navigation action**, available at any depth. A user should never need to "restart" Command Center just to see the category fork again; that action is Top, not Entry.

---

## 2. Navigation Model

**Architecture**

```
Entry Screen
      [Command Center: Projects]
        ↓ (single action: enter — once per session)

Persistent orientation element  (present from here on, every screen)
[<<]   [Command Center: Projects]   [>>]        [Top]
        ↓

Category Selection
[Current]   [Planned]   [Possible]
        ↓

Project List
        ↓

Individual Project Dashboard
        ↓

Project Workspace
```

**`<<` / `>>`** page between siblings at the current level only — project ↔ project within a category, or category ↔ category. They never function as generic browser-style back/forward; their meaning must stay fixed regardless of navigation history.

**`Top`** has exactly one meaning everywhere it appears: return to the Category Screen. It is not "go back one step" — that would make its result depend on how the user arrived, violating deterministic behavior. It is also distinct from Entry (see Section 1).

**The center label** updates contextually as the user descends (e.g., `Command Center: Projects` → `Command Center: Current: Teacher Toolbox`), so orientation is communicated by the one persistent element rather than a separate breadcrumb.

**Interaction Principles**

**Continuity Principle.** The interface must preserve the user's mental model across every transition. Navigation should feel like moving deeper into the same environment, never like jumping between unrelated pages. The user should never need to reconsider or reconstruct their position in the hierarchy after a screen change.

This principle describes an outcome, not a mechanism. It does not require morphing, animation, or any specific visual transition technique — those are legitimate ways to satisfy it, but so is a simple, consistent layout with a reliable orientation element. The architecture requires only that orientation survive the transition; it does not prescribe how.

**Interaction Independence.** Every interaction required by the architecture must be achievable using direct selection — mouse, trackpad, keyboard, touch, or Apple Pencil, as appropriate to the platform. Hover states, right-click menus, keyboard shortcuts, gestures, or other platform-specific conveniences may enhance the experience but must never be required to perform any core function. This holds equally across desktop and iPad, and protects against accidentally designing a required interaction (e.g., a hover-only affordance) that strands users on one of the two target platforms.

**Implementation Notes**

Today's realization of the persistent orientation element is a header positioned at the top of the screen, matching desktop-app convention. This is one valid instantiation, not an architectural requirement — a different implementation could position it elsewhere as long as it remains persistent and satisfies the Continuity Principle.

---

## 3. Persistent vs. Dynamic UI

**Architecture**

**Persistent** (visible from the Category Screen onward): the orientation element only (`<<`, center label, `>>`, `Top`). Nothing else is persistent. Every additional persistent element is something the user must mentally filter out on every screen, forever — a direct, ongoing cognitive cost that must be justified, not assumed.

**Dynamic** (appears only where relevant): category choices (Category Screen only), project summaries (Project List Screen only), dashboard fields (Dashboard only), workspace navigation (Workspace only, scoped to the currently open project).

**Explicitly excluded**, even though each might seem convenient: a global project switcher visible everywhere would bypass the Category → List → Dashboard funnel and the "which group" question it's designed to force. A global status bar showing everything, always, works against the funnel's purpose of letting the user choose scope before being shown detail. If a fast-lookup mechanism is ever added, it must be an explicit, deliberately-invoked feature — something like a search or command mechanism the user opens on purpose — never a default-visible element competing with the calm hierarchy for attention.

---

## 4. Relationship to the Implementation Layer

**Architecture**

The interface must separate **data** from **presentation** cleanly enough that either can change independently. Every UI element must be describable purely in terms of what data it displays and what action it triggers — never in terms of how it is rendered. The user should never need to know that a "project" is a folder, that status lives in a particular file format, or that selecting a project is, underneath, retrieving that project's data — a Markdown file today, potentially a database record or API response in a different implementation. The mechanism used to read and render that data should never become part of the experience itself.

**Implementation Notes**

Today, this separation maps as follows:

*Stays as the data layer (largely untouched):* the folder structure, Markdown files as content, Markdown frontmatter as the current metadata store, `Portfolio Map.canvas` as a legitimate, directly-readable data source, Git as version history underneath everything.

*Becomes presentation (replaced or wrapped, not exposed):* wikilink-based browsing as a primary navigation method, the Kanban plugin's specific rendering (the underlying data can stay; the plugin's visual board is Obsidian-dependent and swappable), manually maintained dashboard tables (becomes a generated view over the metadata layer rather than hand-typed prose).

The eventual UI should read the vault the way a client reads a data source — structured records to query and render — rather than the way a person browses a wiki.

---

## 5. Project Status Model

**Architecture**

| Status | Meaning | Trigger |
|---|---|---|
| **Possible** | Idea only | No active work yet |
| **Planned** | Active architectural/structural work | Defining what it is, how it'll be built |
| **Current** | Active implementation | Code is actually being written |

Status is metadata describing a project's state, never its physical storage location. The Category Screen is a filtered view over the status attribute, not a browse of separate folders. Changing a project's category is a single attribute change — not a file move, link update, or canvas edit — and that one change must propagate to every view that depends on it (Category Screen, Dashboard summaries, Canvas representation) simultaneously, so the user is never required to record the same decision more than once.

**Interaction Principles**

Classification is always a human decision. The system's role is to accurately reflect a status the user has already set — never to infer, suggest a change to, or automatically alter it.

**AI's role is bounded accordingly.** An AI collaborator may surface observations about a project's state — staleness, inconsistency, a missing field — but may never alter status, classification, or content directly. Every change to a project's authoritative state remains a user-initiated action, regardless of which tool or collaborator (human or AI) identified the need for it.

**Implementation Notes**

Today this attribute is stored as a Markdown frontmatter field; the architecture requires only a single authoritative value per project, in one place, regardless of storage format.

---

## 6. Metadata Strategy

**Architecture**

Information the interface must have access to, organized by when it becomes required — not by where it is stored:

*Always, at every status:* name, status, one-line current focus.

*Once Planned or Current:* current milestone, a progress signal (need not be numeric — "just started / underway / nearly done" satisfies the requirement), next action, blockers (shown only when present; their absence should read as calm, not as an empty field demanding attention).

*Once Current:* a reference to where the actual code lives (external — code itself never lives in this system), and a freshness signal (last updated).

*Explicitly excluded from Dashboard/List views, reserved for the Workspace layer:* full architecture documents, decision logs, meeting notes, research. Surfacing this material earlier than the Workspace layer would force a scan through content that only matters once the user has deliberately gone deeper, directly undermining the "at a glance" requirement.

**Interaction Principles**

**Empty and stale states must be designed for explicitly, not left as gaps.** A category with no projects yet (most likely Possible, before any ideas are seeded) must have a defined, intentional appearance — not a blank or broken-looking screen. A Dashboard whose freshness signal indicates the underlying data is old must be visually distinguishable from a current one; a confidently-presented but stale dashboard is a worse failure than an honestly-empty one, since it actively misleads rather than simply lacking information.

---

## 7. Scalability

**Architecture**

At **5-10 active projects** (the near-term target), the model above holds without modification — the Project List Screen shows a scannable list of project summaries, Category selection stays meaningful, no screen requires restructuring.

At **dozens of Planned projects**, a flat list becomes a cognitive load problem in its own right, independent of any folder complexity. The provision to make now, without building it now: the Project List Screen must be able to support secondary organization within a category — grouping, sorting, or lightweight filtering — as an evolution of the same screen, not a new one. Because status is already a queryable attribute (Section 5) and every project already carries consistent metadata (Section 6), this is a rendering change over existing data, not a new information architecture.

At **hundreds of Completed projects**, browsing stops being the right interaction model. The Completed category should architecturally diverge from Current/Planned/Possible's model at this scale — search or lookup becomes the primary interaction, browsing secondary. This is named now specifically so Completed is never forced into the same list pattern used elsewhere purely for consistency's sake; preserving good work means not forcing uniformity where the actual need has diverged.

The same underlying architecture must support a portfolio of 2 projects and a portfolio of 200, differing only in which optional layer (grouping, search) is currently active — never in the base screen hierarchy itself.

---

## 8. Boundaries for Future Evolution

**Architecture**

These four boundaries exist so that CSS, HTML, JavaScript, plugins, or any future presentation technology can be added later without restructuring Command Center itself:

**Boundary 1 — Data and presentation stay separable.** Every UI element must be describable purely in terms of what data it shows and what action it triggers, never how it's rendered, so a future renderer can be swapped in without touching underlying content.

**Boundary 2 — All status and content changes route through one mechanism.** Whatever eventually lets a user change a project's status — a dropdown, a command, a gesture — must update the single status attribute described in Section 5, never a bespoke, screen-specific update path. New interaction surfaces (mobile view, keyboard-driven palette, voice input) can then be added later without each needing its own logic for what a status change actually does.

**Boundary 3 — The screen hierarchy is the stable skeleton.** Presentation is expected to change extensively over years; the five-screen hierarchy in Section 1 is the part designed to last. Visual and interaction technology is the part designed to be replaced freely.

**Boundary 4 — Nothing in the interaction model assumes today's implementation.** Every behavior in this document is described generally enough to be built as an Obsidian plugin, a native desktop application, a web application, or any future platform reading the same underlying project data. Technology is a means; the vault's content should be portable to a different renderer without the content itself needing to change.

---

## Summary

Five screens, one persistent orientation element, deterministic navigation (`<<`/`>>`/`Top` each fixed to exactly one meaning), status fully decoupled from physical location, and a clean data/presentation split that already extends today's metadata pattern rather than replacing it. Continuity and Interaction Independence govern how transitions and inputs must feel, without prescribing how either is built. AI's role is bounded to surfacing observations, never deciding. Empty and stale states are treated as first-class design requirements, not gaps. The architecture is confirmed valid for desktop and iPad, and structurally holds from today's single project through the stated long-term scale of hundreds.

This is Version 1.0. It is the blueprint any future implementation — by any collaborator, on any timeline — is checked against.
