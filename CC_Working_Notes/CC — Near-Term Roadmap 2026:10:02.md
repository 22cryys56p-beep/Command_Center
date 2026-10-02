# Command Center — Near-Term Roadmap

A living sequence of work.

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
* Resolve the AI Progress Estimate / ACP-015 question.
* **Status: DONE**

Q1–Q10 have substantially closed the ProjectRecord resolution question. Dashboard presentation remains to be resolved.

## 3. Dashboard Implementation Specification

* Convert the accepted Dashboard decisions into a bounded implementation specification.
* **Next after the Dashboard architectural decisions are completely closed.**

## 4. Dashboard Implementation

* Build and test Dashboard against the existing Gateway → Project List → Dashboard path.
* Use the real ProjectRecord provider.
* Implement the accepted resolution and presentation behavior.

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
