---
type: assessment
phase: 1
status: read-only — no files modified
date: 2026-07-22
---

# Command Center — Phase 1 Architectural Assessment

**Method:** Full read of every file in the vault (READMEs, Canvas, Dashboards, Templates, frontmatter, Kanban, `.obsidian` config, plugin manifests) plus git history across all 3 commits. No files were created, edited, renamed, or moved.

---

## 1. Overall Architecture

The vault is a **portfolio-of-projects pattern** with four structural layers:

```
Command Center (root)
├── Dashboard/            → portfolio-level status & review
├── Decisions/            → single cross-portfolio decision log
├── Active Projects/      → one folder per live project, each a full self-contained workspace
├── Future Projects/      → holding pen, currently empty
├── Completed Projects/   → holding pen, currently empty
├── Archive/              → superseded material, currently empty
├── Knowledge Base/       → cross-project reference, currently empty
├── Shared Resources/     → cross-project assets, currently empty
├── Templates/            → 10 note templates that define the shape of everything above
└── Portfolio Map.canvas  → visual graph view of the above
```

There is exactly **one active project** — Teacher Toolbox — and it is fully built out as a working instance of the intended per-project template:

```
Active Projects/Teacher Toolbox/
├── Dashboard.md              (project-level status, mirrors Executive Dashboard pattern)
├── Vision.md
├── Roadmap.md
├── Architecture.md
├── Operating Environment.md  (where the actual code repo would be *referenced*, never stored)
├── Kanban.md                 (Obsidian Kanban plugin board)
├── Development Log.md
├── Milestones/M1 - Foundation.md
├── AI Context/                (5 files: Handoff, Current State, Glossary, Coding Standards, Repo Structure)
├── Reference/                 (8 subfolders: Architecture, Decisions, Design Notes, Meeting Notes,
│                                Research, Technical Reference, User Reference, Work Items)
├── Resources/
└── Archive/
```

This is a **two-tier system**: a portfolio tier (Dashboard, Decisions, project-list folders) and a project tier (everything inside a project's own folder, which is a near-complete copy of the portfolio tier's pattern at smaller scale). The vault is explicitly designed to hold source code *nowhere* — every reference to "repository" is a pointer out to an external Git repo (see `Operating Environment.md`, and root `README.md`: *"Project repositories are referenced in each project's Operating Environment, never stored here"*).

Git history confirms this structure was produced essentially whole in a single initial commit (3 commits total, one author, ~1 day apart), with only cosmetic follow-up edits (Canvas node coordinates, moving the default Obsidian `Welcome.md` into `Archive/`). There has been no organic structural evolution yet — what exists is the generator's initial design, lightly touched, not yet stress-tested by real use.

---

## 2. Existing Navigation

The generator (per your note, ChatGPT) built two navigation paths that mostly agree with each other:

**A. Linked/textual path**, starting from root `README.md`:
```
README.md → Dashboard/Executive Dashboard.md
  → Active Projects/Teacher Toolbox/Dashboard.md (via table link)
    → Vision / Roadmap / Kanban / Architecture / Operating Environment / AI Context / Reference / Dev Log
  → Portfolio Map.canvas (visual alternative)
  → Templates/README.md
  → Decisions/Decision Log.md
  → Knowledge Base/README.md
```

**B. Visual/spatial path** via `Portfolio Map.canvas`: a hub-and-spoke graph. Center node = Command Center, radiating out to Teacher Toolbox (active), Future Projects, Completed Projects, Knowledge Base, Templates — and Teacher Toolbox itself radiates a second ring to its Milestone, Kanban, and AI Context handoff file.

Both paths converge on the same idea: **Executive Dashboard is the intended front door**, project dashboards are the intended second stop, and everything else (Reference, Archive, Knowledge Base) is meant to be reached *from* a dashboard, not browsed independently. Internal links are consistently double-bracket wikilinks and they are structurally sound — I did not find a broken link in anything I read (though I did not exhaustively fuzz every path).

Critically: **this two-tier link navigation is a different model than the one you specified** in "Known UI Direction" (Entry → Main Nav with `<< | >>` and Top → Current/Planned/Possible tabs → Project Selection → Project Dashboard). The vault currently has no equivalent of the `[Current] [Planned] [Possible]` tab switcher, no `<< | >>` paging affordance, and no distinct "Entry Screen" separate from the Executive Dashboard. It gets you to the same *destinations* but via a plain hyperlink/backlink browsing model, not a persistent chrome/navigation-bar model. That gap is expected at this stage — Obsidian's native affordances don't have tabs or a persistent nav bar without custom CSS/plugins — but it's worth being explicit that the current navigation is a **content hierarchy**, not yet a **UI shell**.

---

## 3. Functional Components

**Fully working / real:**
- Root `README.md`, `Portfolio Map.canvas` — accurate, functional, in sync with actual folder contents
- `Dashboard/Executive Dashboard.md`, `Current Focus.md`, `Portfolio Overview.md`, `Weekly Review.md` — all populated with real (if early-stage) content, not stubs
- `Active Projects/Teacher Toolbox/` — every file listed above exists and has real content appropriate to a project that is 5% into planning. This is the one part of the vault that has actually been *used*, not just scaffolded.
- `Decisions/Decision Log.md` — has one real entry (the decision to use Obsidian itself)
- `Templates/` — all 10 templates are complete and internally consistent (consistent frontmatter schema: `type`, `project`, `status`, dates)
- `.obsidian/` config — Kanban community plugin correctly installed and configured (`new-note-folder` points at the right place); core plugins sensibly enabled (Canvas, Templates, Daily Notes, Bases); `templates.json` correctly points at `Templates/`

**Scaffolding only (README stub, zero content, exists purely as a placeholder folder):**
- `Future Projects/` — README describes the intended process, no projects in it
- `Completed Projects/` — README only
- `Archive/` (root level) — README only, plus the leftover default Obsidian `Welcome.md` (see Weaknesses)
- `Knowledge Base/` and all 6 of its subfolders (AI, Programming, Education, Business, Research, Reference Material) — every single one is a bare README naming its own purpose, no actual notes
- `Shared Resources/` — README only
- `Active Projects/Teacher Toolbox/Reference/` and all 8 of its subfolders — every one is a bare README, zero actual reference material yet
- `Active Projects/Teacher Toolbox/Resources/` and `Archive/` — README only
- `AI Context/Coding Standards.md` and `Repository Structure.md` — explicitly stubbed, both literally say "to be populated after X is chosen"

**Placeholder in a different sense (intentionally blank fields awaiting decisions):**
- `Operating Environment.md` — table has "Add local path or URL", "Add branch" placeholders; this is correct behavior since the actual code repo genuinely hasn't been created yet, but it means the vault→code link is currently theoretical, unproven
- `Architecture.md` — explicitly says "Architecture is intentionally unchosen"
- `Vision.md` — has an empty non-goals checkbox list

**Net assessment:** roughly **60–70% of the vault's folder structure is empty scaffolding**. That's not a flaw at this stage — it's a portfolio system built for N projects, currently holding 1 — but it means the "complete" feeling of the vault when you browse the Canvas is somewhat aspirational; most branches lead to a one-line README and nothing else.

---

## 4. Hidden Assumptions

Things the generator baked in without your explicit sign-off, which may or may not fit how you actually want to work:

1. **One-active-project-at-a-time framing.** The Executive Dashboard's table and the "Current Focus" note both phrase things in singular ("Current portfolio focus: Teacher Toolbox"). If you routinely juggle several active projects, this schema will need to flex — it's not designed for a busy multi-project table, just a single spotlighted one.

2. **Obsidian-native primitives as the permanent interface.** The generator used wikilinks, folders, and the Kanban *plugin* as the actual UI. This is fine for now but is architecturally in tension with your stated long-term goal (native-app feel, implementation hidden). Kanban-plugin boards in particular are Obsidian-plugin-dependent — if the eventual custom UI layer replaces Obsidian's renderer, that plugin's rendering won't carry over for free.

3. **Decision Log centralization.** The generator assumes *all* meaningful decisions — portfolio and project-level — funnel into one root `Decisions/Decision Log.md`, with each project's own `Reference/Decisions/` folder just linking back to it. That's a reasonable normalization choice, but it's an assumption: some project decisions (e.g., "we're using SQLite") may never feel worth promoting to a portfolio-level log, and the two-hop link-back pattern is a bit of friction if project decisions turn out to be frequent.

4. **Code never lives in the vault, ever.** Stated explicitly twice (root README, Teacher Toolbox AI Handoff: "Treat this vault as operational context, not the product source repository"). This is a strong, clean assumption, and it matches your "cockpit" framing — flagging it as an assumption rather than a flaw, since it's worth confirming it's still what you want before we build tooling on top of it (e.g., if you ever want live status pulled *from* a code repo, that's a boundary-crossing feature you'd be adding on top of a system explicitly designed not to touch repos).

5. **Template-driven expansion, not registry-driven.** New projects are assumed to be created by manually copying `Templates/New Project Template.md` and manually building out the same 20-ish-file skeleton Teacher Toolbox has. There's no single "project registry" file or frontmatter-based index that the Executive Dashboard's table is *generated from* — the table is hand-maintained prose. This will not scale gracefully once you have several active projects; the dashboard update becomes a manual synchronization chore.

6. **AI-agnostic framing assumes multiple AI collaborators.** The `AI Context/` folder (Handoff, Current State, Glossary, Coding Standards, Repository Structure) is designed for context handoff between AI sessions/tools — a real and useful pattern, but it assumes you'll be working with more than one AI assistant or frequently starting fresh sessions that need re-briefing. Worth confirming that's your actual workflow versus something copied in by convention.

7. **Visibility/exposure assumption baked into "portable, AI-agnostic" framing.** Root README calls this vault "AI-agnostic" and "portable" and the Decision Log's first entry cites those as the rationale for choosing Obsidian. That's a reasonable design goal, but it's worth noting given how we got access to this repo today: the generator didn't build in any guidance about repo visibility/privacy, and the vault ended up on a public GitHub repo. Not an architectural flaw, but adjacent enough to your "single command cockpit" intent that it's worth a conscious decision (not just a default) about whether this stays public going forward.

---

## 5. Strengths — what should absolutely be preserved

- **The two-tier pattern itself (portfolio dashboard → project dashboard) is sound** and directly compatible with your stated UI direction. It's the right backbone.
- **The AI Context folder concept** is genuinely good infrastructure for exactly the kind of iterative, multi-session AI-assisted development this vault is meant to support — Current Project State + Handoff + Glossary is a clean, minimal context-passing pattern worth keeping and extending to future projects.
- **Consistent frontmatter schema** across dashboards, milestones, and templates (`type`, `status`, `project`, dates) — this is exactly the kind of structured metadata a future custom UI layer would need to query/render programmatically. Don't lose this discipline.
- **The "code never lives here" boundary** is architecturally clean and keeps the vault lightweight — good decision, worth keeping explicit.
- **Templates are complete and mutually consistent** — no orphaned or contradictory template exists; all 10 share the same conventions.
- **The Canvas file is small, hand-tunable, and accurate** — a good visual index that isn't overbuilt.
- **Decision Log + per-project decision links pattern** — lightweight and works even with just one entry so far.

---

## 6. Weaknesses — friction and incomplete feel

- **Majority of the vault is empty scaffolding** (Section 3). Right now, clicking into 6 of 6 Knowledge Base subfolders, or 8 of 8 Teacher Toolbox Reference subfolders, dead-ends at a one-line README every time. That's a lot of "doors to nowhere" for a single-project vault, and it will feel worse, not better, before it feels populated.
- **Leftover default Obsidian content**: `Archive/Welcome.md` is the stock "This is your new *vault*" onboarding note that ships with every new Obsidian vault — it was moved into Archive in commit 3 but never deleted. Small, but it's the one file in the vault that isn't intentional.
- **No generated/queryable project index.** The Executive Dashboard's project table is hand-written prose, not derived from frontmatter. The moment you have 3–5 active projects, keeping that table accurate becomes a manual chore that *will* drift out of sync — this is the single biggest scaling risk in the current design.
- **Navigation model mismatch** (detailed in Section 2): your intended `<< | >> / Top / Current-Planned-Possible tabs` UI has no current analog. This isn't a defect exactly — you haven't asked for it yet — but it does mean a meaningful UI layer (not just theming) will need to be built, not just styled on top of what exists.
- **Kanban plugin dependency.** The one piece of interactive tooling in the vault is entirely dependent on a third-party community plugin. If the long-term direction is a custom native-feeling interface, this plugin's board rendering is something that will need to be either replaced or wrapped, not simply reused.
- **The 8-subfolder Reference structure inside Teacher Toolbox may be over-scaffolded for a project that's still 5% into planning.** Architecture, Decisions, Design Notes, Meeting Notes, Research, Technical Reference, User Reference, Work Items — eight structural buckets before there's any real content to sort. This isn't wrong, but it's optimistic; it presumes a project cadence and volume of notes that hasn't been tested yet against how you actually work.
- **No repo-visibility guardrails.** As noted in Hidden Assumptions #7 — nothing in the vault's docs addresses whether this should be public or private, and it's currently public.

---

## 7. Opportunities — improving without discarding good work

*(Noted here only for the eventual planning conversation — not proposing to act on any of this yet, per your instructions.)*

- **Frontmatter-driven Executive Dashboard.** The existing frontmatter schema (`status`, `progress`, `milestone`) is already consistent enough to be queried rather than hand-written — Obsidian's Bases core plugin is already enabled in this vault's config, and Dataview-style queries are a natural fit here. This would directly fix the biggest scaling weakness without touching the folder structure at all.
- **Defer subfolder creation until content exists.** Rather than removing the 8-folder Reference scaffold (it does no harm sitting there), a lighter-touch option later would be to stop pre-creating full subfolder trees for *future* projects until a project's own dev log shows a real need for a given category — reduces empty-door feeling without discarding the pattern.
- **The Canvas is a genuinely good foundation for the eventual custom UI.** Since Canvas is portable JSON, a future custom renderer could read `Portfolio Map.canvas` directly as its data source for a "native app" project-map view rather than reimplementing project relationships from scratch.
- **AI Context pattern is ready to templatize now.** Since it already proved out well on Teacher Toolbox, it could be folded into `New Project Template.md`'s companion set once you're ready to formalize the next project — it's already de facto the standard, just not yet codified as one.
- **Small cleanup candidates** (only when you're ready to authorize changes): delete or repurpose `Archive/Welcome.md`; decide and document the repo-visibility policy in the root README's Git section.
- **Decide the "Current/Planned/Possible" naming mapping early.** Your target nav model's three tabs map fairly directly onto existing folders (`Active Projects` ≈ Current, `Future Projects` ≈ Planned/Possible) but "Planned" vs "Possible" as two separate tiers has no existing structural equivalent — `Future Projects/` is currently a single undifferentiated bucket. Worth resolving whether that's one folder with a status field, or two folders, before any UI work references it.

---

## Summary

The vault is a clean, coherent two-tier portfolio system with genuinely good bones — the AI Context pattern, frontmatter consistency, and the code-stays-external boundary are all worth building on directly. Its main honest limitation right now is that it's still mostly a **skeleton**: one real project living inside a structure sized for many, a hand-maintained dashboard that won't scale past a few projects without becoming a chore, and a navigation model (dashboards + wikilinks) that gets you to the right destinations but isn't yet the tabbed, chrome-driven UI you've described as the end goal. None of that requires tearing anything down — it's a foundation to extend, not replace.

Ready for your review before any implementation stage begins.
