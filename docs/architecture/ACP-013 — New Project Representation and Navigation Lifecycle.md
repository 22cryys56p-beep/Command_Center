ACP-013 — New Project Representation and Navigation Lifecycle

Status: accepted as decision framework — the substantive questions in Section 3 remain open and unresolved pending Kurt's decision
Date: 2026-09-14
Decision authority: Kurt
Scope: Gateway / WP13, Phase 4
Depends on: ACP-009, ACP-010, ACP-011, ACP-012
Authority: Phase 4 Matrix (Categories 33, 47, 48, 49)

1. Purpose

This ACP does not implement Gateway, does not design the New Project workflow, and does not reopen ACP-011. It exists to resolve a single gap that ACP-011 left open: how the New Project destination is represented in — or outside — the existing navigation model, and how a user returns from it.

Kurt has accepted this document as the governing framework for that decision. Acceptance of this document is not itself a resolution of the questions in Section 3 — those remain open until Kurt makes the substantive architectural decision they pose. No implementation of New Project's representation, entry, or exit behavior may proceed until that decision is made and recorded.

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

3. Decision Required

This ACP must settle:

1. Representation — How is the New Project workflow represented and coordinated within Command Center's navigation/rendering architecture — as part of NavigationState, as view-level state outside it, or by some other mechanism not yet identified?
2. If NavigationState changes — What is the new representation? A new CurrentObject.kind? A new or reused Depth value? Does it carry any payload, or is it object-less (as Gateway's own root state is)?
3. If NavigationState does not change — What does the persistent orientation bar display while New Project is active, and what coordinates that display?
4. Exit and return — What are the correct return semantics for leaving New Project and reaching Gateway again?
5. Boundary of this decision — Does this ACP confine itself to representation, orientation display, and exit/return, leaving all creation mechanics (template/seed/kernel selection, metadata initialization, ProjectRecord creation) deferred exactly as ACP-011 Section 5 already deferred them?

These five questions are not yet answered. This document defines them; it does not answer them.

4. Explicit Non-Goals

This ACP does not decide or define:

- project creation mechanics, template or seed selection, kernel selection, or metadata initialization (remain deferred per ACP-011 Section 5);
- the visual design of the New Project screen or any Gateway destination;
- Dashboard or Workspace behavior;
- any change to the four status-mapped Gateway destinations or to Ideas, both already settled by ACP-011;
- any change to ACP-009's status vocabulary or ACP-010's paging retirement.

5. Relationship to Prior ACPs

This ACP depends on and does not reopen ACP-009, ACP-010, ACP-011, or ACP-012. It identifies and establishes the decision framework for a gap those decisions left open; it does not alter anything they settled.

6. Status and Next Step

The framework and questions above are accepted by Kurt as of 2026-09-14. The substantive decision — the actual answers to Section 3's five questions — has not yet been made.

No implementation may proceed against New Project's representation, entry, or exit behavior until Kurt has answered Section 3 and that answer is recorded as an amendment or follow-on to this ACP. The minimal New Project entry-point work package, and any subsequent Gateway implementation touching the New Project destination, are both blocked on that decision.

ACP-013's framework has been accepted by Kurt. Its substantive architectural questions remain open and are the governing precondition for all downstream Gateway and New Project implementation work.
