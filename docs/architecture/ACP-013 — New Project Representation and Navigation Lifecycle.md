ACP-013 — New Project Representation and Navigation Lifecycle

Status: resolved — accepted
Date: 2026-09-14
Decision authority: Kurt
Scope: Gateway / WP13, Phase 4
Depends on: ACP-009, ACP-010, ACP-011, ACP-012
Authority: Phase 4 Matrix (Categories 10, 33, 47, 48, 49)

1. Purpose

This ACP does not implement Gateway and does not design the New Project creation workflow's internal content or fields. It resolves the gap ACP-011 left open: how the New Project destination is represented in — or outside — the existing navigation model, what the persistent orientation element does while it is active, and how a user exits it.

This decision satisfies Gateway Implementation Specification Section 4's prerequisite condition 1: "an approved New Project workflow entry point is supplied by a separately scoped work package." The New Project entry-point work package implementing the shell described in Section 3 below, once specified and implemented, removes the block on Gateway's New Project destination.

2. Origin of the Gap

ACP-011 Section 5 establishes that "Gateway → New Project transitions to the distinct New Project workflow entry point," and Section 8 explicitly excludes "New Project workflow internals" from its scope. Neither Section 5 nor any other part of ACP-011 specifies:

- whether that transition changes NavigationState;
- how the user exits New Project and returns to Gateway;
- what the persistent orientation element displays while New Project is active.

This is not an implementation detail omitted for brevity. It is a genuine unresolved question, confirmed against the current codebase:

- CurrentObject (orientation.ts) has exactly two variants, { kind: "category" } and { kind: "project" }. No third variant exists.
- NavigationController's only transitions are selectCategory, selectProject, pageNext, pagePrevious, goUp, goTop. None can reach a New Project destination.
- OrientationBarComponent derives its entire rendered state from NavigationController.getState() and getAvailability() alone — it has no independent awareness of what screen is actually mounted.
- The one existing precedent for a screen outside NavigationState — Entry, via CommandCenterView — is a one-time, one-directional gate with no return path, and is a materially different case from a destination a user is expected to enter and exit repeatedly. It is evidence of one possible mechanism, not a constraint on the set of mechanisms this ACP may choose from.

3. Decision

New Project is a temporary creation workflow that exists entirely outside NavigationState. It is not represented by any CurrentObject variant and does not introduce or reuse any Depth value.

3.1 Representation. Entering New Project does not alter NavigationController's state in any way. Gateway remains, throughout, in its existing state ({ object: null, depth: "gateway" }). New Project is view-level UI that CommandCenterView temporarily mounts over the normal screens, coordinated the same way Entry already is — outside NavigationState entirely — but unlike Entry, it must be enterable and exitable repeatedly rather than being a one-time lifecycle gate. This requires CommandCenterView to gain a coordination capability it does not currently have: temporarily suppressing the mounted orientation bar and screen containers and showing a New Project container in their place, then reversing that when the workflow ends. This capability does not yet exist in the codebase and is required scope for the New Project entry-point work package — it is not something this ACP presumes is trivial or already available.

3.2 Not applicable. No new CurrentObject.kind or Depth value is introduced. This question is resolved by 3.1: since NavigationState never changes, there is nothing to represent within it.

3.3 Orientation bar behavior. While New Project is active, the persistent orientation bar is hidden — not frozen on stale state, not left visible and inert. It reappears when New Project's workflow ends by Cancel, or after a successful Submit handoff once the persistence dependency in Section 3.7 is available.

3.4 Exit and return. Cancel discards the in-progress New Project workflow and reveals Gateway unchanged — no restoration logic is required, because NavigationState was never altered in the first place. Submit's handoff differs by implementation phase: today, with no real ProjectRecordProvider, Submit must validate the entered information and then fail honestly and visibly, per Section 3.7 — there is no successful path yet. Once a real provider exists, the successful path is: Submit → create ProjectRecord → NavigationController.selectCategory(chosenStatus) → the corresponding status-filtered Project List. That is the same mechanism Gateway's own status-backed destinations already use, and it requires no new navigation machinery and no dependency on Dashboard.

3.5 Boundary. This ACP settles only the New Project workflow's representation, orientation-bar behavior, and entry/exit/return semantics. It does not settle project creation mechanics, Type taxonomy, participant/resource modeling, template/seed/kernel selection, or ProjectRecord persistence mechanics. These remain deferred exactly as ACP-011 Section 5 already deferred them, and are explored non-bindingly in Working_Notes/CC_Phase 4_New Project Intake and Data Model — Candidate Design Notes.md, which carries no architectural authority until formalized separately.

3.6 Initial status assignment. On Submit, the creator explicitly selects the new project's initial status from possible | planned | current. ongoing and archived are not offered at creation, since neither applies to a project that does not yet exist. No default status is invented, inferred, or silently assigned by CC or by any AI collaborator. This is a direct application of P4-R172 ("Kurt is the final authority for assigning project status") and is consistent with P4-R801's treatment of the Project Owner determining resulting status on reactivation.

3.7 Persistence dependency, stated explicitly. Actually writing the new ProjectRecord on Submit depends on a real ProjectRecordProvider, which does not yet exist — the current provider is a stub returning no records, and Gateway Implementation Specification Section 7 explicitly excludes building a real provider from Gateway's own scope. Until a real provider exists, Submit must fail honestly and visibly rather than silently succeed, silently do nothing, or fabricate a record — consistent with the frozen principle that Command Center must not silently manufacture project truth (SESSION_START.md Section 15). The New Project entry-point work package must state this dependency openly rather than working around it.

4. Explicit Non-Goals

This ACP does not decide or define:

- project creation mechanics, Type taxonomy, participant/resource modeling, template or seed selection, kernel selection, or any metadata beyond initial status (remain deferred per ACP-011 Section 5, and per Section 3.5 above);
- the visual design of the New Project screen or any Gateway destination;
- Dashboard or Workspace behavior;
- the real ProjectRecordProvider (remains a separate, not-yet-scoped dependency per Section 3.7);
- any change to the four status-mapped Gateway destinations or to Ideas, both already settled by ACP-011;
- any change to ACP-009's status vocabulary or ACP-010's paging retirement.

5. Relationship to Prior ACPs

This ACP depends on and does not reopen ACP-009, ACP-010, ACP-011, or ACP-012. It resolves a gap those decisions left open; it does not alter anything they settled.

6. Status and Next Step

This ACP is resolved and accepted by Kurt as of 2026-09-14, including the substantive decision in Section 3.

The New Project entry-point work package may now be specified. It must implement: the view-level entry/exit mechanism described in 3.1 (including the new CommandCenterView coordination capability that mechanism requires); the orientation-bar suppression behavior in 3.3; the Cancel and honest-failure Submit behavior in 3.4 (with the eventual successful path built only once Section 3.7's dependency is resolved); the initial-status selection in 3.6; and must state the Section 3.7 persistence dependency openly rather than working around it. It must not implement project creation mechanics, Type taxonomy, or any of the content deferred in Section 3.5 and Section 4.

Once that work package is specified, implemented, and independently verified, Gateway Implementation Specification Section 4's prerequisite is satisfied and Gateway's New Project destination is no longer blocked.
