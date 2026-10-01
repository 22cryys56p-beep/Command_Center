# CC Phase 4 Matrix — Document E: Uncharted Territory

**Scope covered:** Categories 1–64 (gap analysis, not a category-by-category audit)

---

## Purpose

Documents A–D classify what was raised across Categories 1–64. This document addresses the opposite question: what has not been raised at all.

This is a candidate list produced by reviewing the full set of Category titles and content against what a system of this kind (multi-project observation, AI collaboration, eventual standalone product) typically requires. It is not itself an audit finding and has not been through the same category-by-category verification as Documents A–D. Items here require Kurt's confirmation before being treated as authoritative.

This document also records one documentation gap discovered during gap analysis: an issue that was substantively resolved during the audit but never formally logged as its own decision.

---

## Part 1 — Documentation Gap (not a new topic)

### Category 16 Naming Collision

During review of the original audit, a naming collision was identified: **Current**, **Planning**, **Ongoing**, and **Archive** are used simultaneously as Home Screen navigation/function labels (Category 16, P4-R228–R234) and as concepts closely tied to Project Status values (Category 1).

This was substantively resolved — Category 16 KEEP-Foundation language states these are "distinct project/category views," and SESSION_START.md Section 15 establishes the general principle that "status is not navigation." However, the specific collision itself was never logged as its own OPEN item, decision, or explicit closure in Document D.

**Recommendation:** No new architectural work is required. A brief note should be added to Document D (or the Decision Log) formally closing this item, so a future session does not re-raise it as unresolved.

---

## Part 2 — Topics Requiring Matrix-Level Resolution

These are judged to need a decision within the Phase 4 matrix itself, because resolving them later would require reworking architecture that will already be frozen.

### E1 — Project State vs. Project Visibility

Already flagged in Document D (Category 64) as the most significant open item carried out of the Steps 1–64 audit. Restated here for completeness: this is the same question the unlogged Category 65 session attempted and failed to resolve. It must be decided deliberately, grounded in the single-tier status model, before the matrix can be considered stable enough to extend further.

### E2 — Multi-User / Team Collaboration Scope

No category across 1–64 addresses whether Command Center is architected for more than one human owner. SESSION_START.md Section 6 currently states "the human project owner" in the singular, and the entire status/authority model assumes one owner throughout.

This does not need to be resolved by building multi-user support — the answer may legitimately be "single-owner only, indefinitely." But that needs to be a stated architectural decision, not an unexamined assumption, because retrofitting a multi-owner permissions model onto a single-owner data model later would require rework rather than addition.

### E3 — Command Center's Own Extensibility Model

Category 57 (Platform Independence & the Eventual Standalone Command Center) already commits to CC eventually operating independently of Obsidian. If that commitment is real, a decision is needed on whether CC itself exposes internal extension points (analogous to how CC currently extends Obsidian), while the core object model is still being shaped.

This does not require full specification now — only a decision on whether extensibility is an architectural goal, so the object model isn't accidentally closed off from it.

---

## Part 3 — Topics That Can Be Addressed Generally Now, Deferred to a Later Phase

These build on constructs the matrix has already established (Flags, Attention/Signals, History, the Portable Data Layer) rather than requiring new architectural decisions. They can be scoped lightly if useful, but do not block matrix progress.

### E4 — Onboarding / First-Run Setup

Pure UX flow for setting up CC against a new vault or for a new user. Does not constrain data model or architecture.

### E5 — Performance at Scale

How CC behaves as a portfolio grows large — many projects, deep history, large vaults. Worth a light note only if a current Portable Data Layer (Category 52) choice would be difficult to change later; otherwise premature at current portfolio size.

### E6 — User-Facing Error / Failure UX

Distinct from Backup, Recovery & Disaster Recovery (Category 54), which concerns data loss. This concerns what a user sees when a Source is unreachable, a sync fails, or an AI operation errors mid-task. Builds on existing Flags/Attention constructs.

### E7 — Portfolio Metrics / Analytics

The repository already contains a `Portfolio Overview.md` file, but no category defines what metrics CC surfaces (time-in-status, stalled projects, velocity, etc.) beyond Attention/Signals escalation. A feature built atop the existing data model, not a data-model question itself.

### E8 — Accessibility / Cross-Device Use

Synchronization, Conflicts & Multiple Interfaces (Category 53) covers multiple interfaces at the data-sync level, but not accessibility or mobile-specific behavior. Implementation detail, not core architecture.

---

## Status

This document is a candidate list pending Kurt's review. None of E1–E8 should be treated as scheduled, scoped, or architecturally decided until Kurt confirms which belong in the matrix and which are deferred.

Like Documents A–D, this document covers only the Categories 1–64 boundary. It does not speculate about content beyond Step 65, which remains paused per SESSION_START.md Section 14.
