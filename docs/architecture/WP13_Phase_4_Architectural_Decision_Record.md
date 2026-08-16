---
type: architectural-decision-record
work_package: WP13
phase: 4
status: approved
author: ChatGPT (drafted), Claude (audited), Kurt (approved)
date: 2026-08-17
governs: WP13 Phase 4 specification and implementation
supersedes: WP13 Phase 3 Section 5 (ProjectRecord data-access wording), Section 5 item 4 / Section 7 item 4 (onStateChange open decision)
---

# WP13 Phase 4 — Architectural Decision Record / ACP

**Work Package:** WP13
**Phase:** Phase 4 — Project Dashboard
**Status:** Approved — architectural decisions finalized
**Purpose:** Record the architectural decisions resolving the two implementation ambiguities identified during independent review of WP13 Phase 3.

---

## 1. Decision Authority

This document records architectural decisions made through the Command Center's established governance process.

The independent AI reviews conducted during resolution of these issues are **supporting architectural diligence, not the source of decision authority**.

The governing decision process remains:

**Human → ChatGPT architectural review/planning → approved specification → Copilot implementation → independent verification → human acceptance/baseline freeze**

The independent AI reviews provide supporting evidence that the decisions below are technically well-supported and consistent with the repository's existing architecture. They do not constitute a vote or architectural ratification mechanism.

---

# Decision 1 — ProjectRecord Data-Access Boundary

## 2. Problem

WP13 Phase 3 exposed an ambiguity concerning the boundary between `NavigationController` and `ProjectRecord` data access.

The Phase 3 specification stated that `ProjectRecord` data should flow through the existing `ProjectRecordProvider` already injected into `NavigationController`.

However, the current `NavigationController` does not expose a public record-access method. Its provider dependency is used internally by navigation-resolution logic; it is not a data-access API.

`ProjectListView` nevertheless requires access to `ProjectRecord` data in order to display the projects belonging to the active category.

The Phase 3 implementation therefore received the same `ProjectRecordProvider` reference directly from the composition root rather than obtaining records through `NavigationController`.

This exposed a genuine specification ambiguity but did not establish a production defect.

---

## 3. Architectural Evidence

The repository establishes the following:

* `ProjectRecordProvider` is a separate data-access contract.
* `NavigationController` owns navigation state and navigation behavior.
* `NavigationController` uses its provider internally for navigation-resolution operations, including paging and upward navigation.
* `NavigationController` does not expose the provider as a general-purpose record query API.
* `CommandCenterView` is the composition root responsible for constructing and wiring the relevant components.
* The same `ProjectRecordProvider` reference is supplied directly to multiple consumers that require ProjectRecord access.
* `ProjectListView` is a consumer of ProjectRecord content, not an owner of navigation state.
* The current provider remains a stub and returns an empty record set.
* No repository evidence establishes a need for a separate application-level ProjectRecord coordinator or query service at the present scale.

The critical distinction is:

> **Using ProjectRecord data as an internal dependency of navigation resolution does not make `NavigationController` the owner or gateway of ProjectRecord data.**

---

## 4. Options Considered

### Option A — NavigationController as ProjectRecord Gateway

Expose record-access methods from `NavigationController` so views obtain ProjectRecord data through the controller.

**Advantages**

* Would satisfy the literal Phase 3 specification wording.
* Creates a single apparent access path through the controller.

**Disadvantages**

* Makes `NavigationController` a data-access gateway in addition to its navigation/state responsibility.
* Requires pass-through or query methods that do not belong to navigation itself.
* Creates an accidental precedent for future methods such as `getProjectsByCategory()` or `getProjectById()`.
* Risks gradually turning the navigation controller into a domain-data facade.
* Adds indirection without solving a real problem in the current architecture.

**Decision:** Rejected.

---

### Option B — Shared ProjectRecordProvider Injection

Construct one `ProjectRecordProvider` at the composition root and inject the same provider reference into every component that requires ProjectRecord access.

`NavigationController` receives the provider for its internal navigation-resolution needs. Views receive the same provider when they require ProjectRecord content.

**Advantages**

* Preserves separation between navigation/state ownership and data ownership.
* Keeps `NavigationController` single-purpose.
* Preserves the existing provider contract and dependency-injection pattern.
* Requires no new architectural abstraction.
* Makes replacement of the current stub provider straightforward.
* Works cleanly with the project's Obsidian-agnostic design.
* Allows future consumers to use the same data contract without expanding `NavigationController`.

**Disadvantage**

* The single-instance guarantee currently depends on correct composition-root wiring rather than being enforced by a dedicated service abstraction.

**Decision:** **Accepted.**

---

### Option C — Separate ProjectDataCoordinator / Data Gateway

Introduce a new application-layer service responsible for ProjectRecord queries and have both the controller and views consume that service.

**Advantages**

* Could become useful if ProjectRecord access develops multiple query shapes, caching, multiple data sources, invalidation, or substantial transformation requirements.
* Could provide a named home for genuinely complex data-access behavior if such complexity appears.

**Disadvantages**

* No current repository evidence justifies the additional abstraction.
* The current provider is a stub and the repository currently has a very small data-access surface.
* The coordinator would not eliminate the need for composition-root dependency wiring or guarantee single-instance sharing by itself.
* Adds architectural complexity in anticipation of requirements that do not yet exist.

**Decision:** Rejected for the current architecture. May be reconsidered only if concrete future requirements establish a need for it.

---

## 5. Decision

**ProjectRecord data access and navigation/state ownership are separate architectural concerns.**

The Command Center will use **Option B — shared `ProjectRecordProvider` injection**.

The composition root must construct the provider **exactly once** and supply that same provider reference to every component requiring ProjectRecord access.

`NavigationController` is **not** a ProjectRecord data gateway.

It must not acquire record-returning or record-querying methods merely to provide a data-access path for views.

The ambiguous wording in the WP13 Phase 3 specification is superseded by this explicit architectural decision.

---

## 6. Boundary Principle Established

> **NavigationController owns navigation state and navigation behavior. ProjectRecordProvider owns access to ProjectRecord data. The composition root owns dependency wiring between them.**

This preserves the following Project Bible principles:

* **Simplicity over complexity**
* **Single Source of Truth**
* **Deterministic behavior over probabilistic behavior**
* **Honest failure over silent degradation**
* **AI assists the human architect**
* **Frozen architectural decisions are not casually reopened**
* **Implementation follows architecture**

A separate ProjectRecord data coordinator is not to be introduced speculatively.

---

# Decision 2 — `onStateChange` Dependency Injection

## 7. Problem

WP13 Phase 3 exposed an inconsistency in the way state-change callbacks are supplied to view components.

`CategoryView` uses setter injection through `setOnStateChange()` and stores the callback as nullable state.

The Phase 3 implementation followed that pattern for `ProjectListView`.

However, the callback is not actually optional to the architecture. The view requires it in order to participate correctly in the established render-coordination mechanism.

The current implementation therefore makes a required architectural dependency appear optional at the type and invocation level.

The existing sequencing in `CommandCenterView.proceedToCategoryDepth()` currently makes the arrangement work, but its correctness depends on procedural sequencing rather than the dependency being structurally required.

---

## 8. Architectural Evidence

The existing render architecture establishes:

* `CommandCenterView` owns the render-coordination mechanism.
* State changes are propagated through the established `onStateChange` callback.
* The relevant views are constructed as part of the existing screen/container wiring.
* The callback is required for correct participation in that coordination.
* The current nullable/setter pattern therefore represents implementation flexibility that the architecture does not actually require.

The key distinction is:

> **The callback is not optional in the architecture. Only the current implementation makes it optional.**

The current sequencing prevents a failure today, but the architecture should not rely on an accidental ordering guarantee when constructor injection can make the requirement explicit.

---

## 9. Options Considered

### Option A — Constructor Injection Everywhere

Require `onStateChange` as a constructor dependency for views that require it.

**Advantages**

* Makes the dependency mandatory at construction time.
* Eliminates nullable callback state.
* Eliminates the separate setter.
* Eliminates optional callback invocation.
* Removes a class of sequencing-related failure.
* Makes the component's required dependencies visible in its constructor.
* Consistent with dependency-injection principles already used elsewhere in the project.
* Results in less code rather than more.

**Disadvantages**

* Requires corresponding construction-site changes.
* May require updating tests and existing component wiring.

**Decision:** **Accepted.**

---

### Option B — Retain Setter Injection

Continue using `setOnStateChange()` and nullable callback state.

**Advantages**

* Minimal immediate change.
* Matches the existing `CategoryView` implementation.

**Disadvantages**

* Preserves a dependency that appears optional when it is not.
* Continues to rely on construction/wiring order for safety.
* Preserves nullable state and optional invocation.
* Establishes a weaker precedent for future views.

**Decision:** Rejected.

---

### Option C — Lifecycle-Based Conditional Wiring

Treat the callback as legitimately optional because some views may theoretically be conditionally rendered or have different lifecycles.

**Decision:** Rejected based on current repository evidence.

The relevant components are constructed synchronously in the existing wiring path and are not currently subject to the lifecycle distinction required to justify this pattern.

This would document speculative future behavior rather than an architectural distinction actually present in the repository.

---

## 10. Decision

**Option A — constructor injection everywhere — is accepted.**

The Phase 4 implementation that applies this decision **must remove the setter-injection pattern for the affected view and make `onStateChange` a required constructor dependency.**

The implementation must remove:

* the nullable callback field where no longer required,
* the setter method,
* optional callback invocation caused solely by nullable state.

This is an implementation of the architectural decision, not deferred housekeeping.

---

## 11. Boundary Principle Established

> **Architecturally required dependencies must be represented as required dependencies in the component's construction contract.**

The implementation should not rely on procedural sequencing to make an optional dependency safe when constructor injection can establish that requirement structurally.

This is consistent with the Project Bible principle:

> **Honest failure over silent degradation.**

A component that cannot function correctly without a dependency should not represent that dependency as optional merely because the current wiring happens to provide it later.

---

# 12. Relationship to WP13 Phase 3

These decisions **do not reopen or invalidate WP13 Phase 3**.

WP13 Phase 3 has been independently reviewed, accepted, committed, pushed, and officially closed.

The **corrected WP13 Phase 3 specification** is the authoritative version. Earlier draft wording that described the specification as awaiting approval is obsolete and must not be treated as current project state.

The Phase 3 implementation of shared `ProjectRecordProvider` injection is accepted as satisfying the architectural intent established here.

The Phase 4 work formalizes the boundary so that future specifications and implementations do not repeat the ambiguity.

---

# 13. Independent Review Evidence

Six independent AI reviews were conducted for each of the two architectural issues, producing twelve individual reviews in total.

### Decision 1

Five of the six reviewers — **Claude, Qwen, Gemini, Grok, and GPT-5.6** — converged on Option B.

**DeepSeek** proposed a separate data coordinator as its alternative.

That alternative was examined and rejected because it introduced abstraction without current evidence requiring it and did not actually eliminate the composition-root responsibility for sharing the same provider reference.

Claude subsequently reviewed all six evaluations and maintained the Option B recommendation.

### Decision 2

All six independent reviewers converged on **Option A — constructor injection everywhere**.

Reviewers independently identified the same sequencing-dependent safety issue and rejected the lifecycle-based alternative because the relevant lifecycle distinction does not currently exist in the implementation.

The reviews also identified that constructor injection makes the dependency contract stronger while removing code rather than adding abstraction.

The independent-review exercise is supporting evidence only. It does not itself constitute architectural authority.

---

# 14. Implementation Constraints Resulting From These Decisions

Future implementation must:

1. Preserve `NavigationController` as a navigation/state component rather than turning it into a ProjectRecord data gateway.
2. Construct the `ProjectRecordProvider` once at the composition root.
3. Pass the same provider reference to every component requiring ProjectRecord access.
4. Not introduce a ProjectRecord coordinator/service without a new, concrete architectural requirement justifying it.
5. Represent required `onStateChange` dependencies through constructor injection.
6. Remove the setter/nullable/optional-callback pattern where this decision applies.
7. Preserve the existing render-coordination architecture.
8. Treat these decisions as governing implementation constraints rather than suggestions for stylistic cleanup.
9. Use the ACP process if a genuinely frozen architectural decision later needs reconsideration.

---

# 15. Status

**Architectural review:** Complete
**Decisions recorded:** Flag #1 and Flag #2
**Human architectural approval:** Approved
**Implementation:** Not yet begun under these decisions
**Independent verification:** To occur after the approved implementation is committed and pushed
**WP13 Phase 3:** Officially closed and accepted

The next artifact is the **WP13 Phase 4 implementation specification**, which must conform to these decisions.
