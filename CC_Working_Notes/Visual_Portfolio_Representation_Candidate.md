---
type: candidate-idea
status: draft — candidate for future consideration, not a Phase 4 architectural decision
date: 2026-08-30
source: Kurt, in conversation with Claude
---

# Visual/Spatial Portfolio Representation (Candidate)

## The idea

A secondary, visual/spatial representation of the project portfolio — a "map" view giving a different perspective on what's going on across projects, distinct from the Gateway's primary six-button navigation (P4-R800).

This is conceptually different from *navigation*. The Gateway is how you get around; this would be another lens onto the same underlying data — closer in spirit to Search, which the matrix already treats as "a cross-cutting discovery layer independent of navigation location" (P4-R653, Category 50) rather than a competing way to move through the app.

## Provenance

The original Codex-built `Portfolio Map.canvas` (created from the Version 1.1 project initialization prompt, before the Phase 4 Matrix existed) served exactly this dual purpose at the time — both primary navigation *and* a visual map, via clickable Canvas nodes. Kurt confirmed he has barely used it since (last opened weeks ago, for a demo, not for actual navigation) — Canvas-based navigation has been superseded in practice by what became the Gateway model, even though this was never formally stated anywhere in the repository.

## Status of the old artifact

`Portfolio Map.canvas` still exists in the repository root and was last modified 2026-07-29. It should **not** be treated as directly reusable:

- It was built under the original three-status model (Active / Future / Completed Projects), predating the frozen five-value status vocabulary (Category 1).
- It predates the Teacher Toolbox boundary correction (commit `9e72d7d`, "Separate Teacher Toolbox from Command Center boundary") — its representation of how a project sits inside the portfolio was built before CC/external-project separation existed as an architectural principle.

**Separate housekeeping item, not part of this candidate idea:** the fact that Canvas-based navigation has been superseded by the Gateway should be stated explicitly somewhere authoritative (SESSION_START.md or a Document C entry), so a future session — or Codex, reading the repository — doesn't mistake the still-present file for live navigation architecture.

## Relationship to existing candidate material

This sits in the same category as Document E's **E7 (Portfolio Metrics/Analytics)** — a feature built on top of the already-frozen Core Object Model (Category 51), not something requiring new Phase 4 architecture. If pursued, it would need the same guardrail every other CC view already has: reflects underlying data, does not become a second source of truth (the principle behind P4-R588 for the Dashboard, P4-R787 for the Project List).

## Disposition

**Candidate — deferred.** Not evaluated for architectural fit beyond the above. Worth raising with GPT as a legitimate future feature idea, not something requiring resolution now.
