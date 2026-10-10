# Command Center — Near-Term Roadmap

A living sequence of work.

Last updated: 2026/10/10

**Rule:** When a task is done, move to the next unresolved item. No calendar or artificial deadlines.

## 1. Documentation / Index Reconciliation

* Bring the Master Implementation Index and related documentation into alignment with the actual repository.
* Mark obsolete baseline language appropriately.
* Correct stale implementation comments.
* **Status: DONE**

## 2. Dashboard Architectural Decisions

* Resolve the remaining Dashboard questions.
* Resolve Missing / Invalid / Duplicate ProjectRecord handling.
* Resolve the provider/data-resolution contract.
* Resolve the AI Progress Estimate / ACP-015 question (the category and its safeguards; the derivation method is separate and remains open as "Track B").
* **Status: DONE**

Q1–Q10 closed the ProjectRecord resolution question (ACP-016). The Dashboard presentation and interaction boundary (P1–P6) was resolved afterward and folded into WP15 §3.6/§3.7.

## 3. Dashboard Implementation Specification

* Convert the accepted Dashboard decisions into a bounded implementation specification.
* **Status: DONE** — WP15 (ACP-016's "Track A": ProjectRecord resolution and unresolved-state presentation), accepted 2026-10-02.

## 4. Dashboard Implementation

* Build and test Dashboard against the existing Gateway → Project List → Dashboard path.
* Use the real ProjectRecord provider.
* Implement the accepted resolution and presentation behavior.
* **Status: DONE for WP15's scope** — implemented, verified, and merged to `main` (2026-10-08): `resolveProjectRecord()`, the unresolved-state Dashboard view (Missing, Invalid, Duplicate), and the six acceptance tests.
* **Not covered by this item and still open:** normal (resolved) Dashboard content per Phase 3 Section D, specified by WP16 (accepted 2026-10-10, implementation pending) and currently a deferred placeholder ("Dashboard content pending."), and the AI Progress Estimate's derivation (Track B). The Master Implementation Index's Outstanding Items section is the authoritative record of what remains.

## 5. Workspace Specification

* Define Workspace using the project context established by Dashboard.

## 6. Workspace Implementation

* Build and test Workspace.

## 7. New Project — Creation / Persistence

* Treat New Project creation and persistence as a separate work package.
* Do not silently expand the existing read-only provider to support it.

## 8. Future Capabilities

* Ideas
* Sources
* Threads
* Decisions
* Tasks
* History
* Search
* Broader AI features

---

## Working Rule

**What's done? → What's next?**

The roadmap advances by completing the current unresolved item, then moving to the next one. It does not establish calendar dates or artificial deadlines.