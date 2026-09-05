ACP-011 — Gateway Destination-to-View Mapping and Category Screen Retirement Boundary

Status: resolved — accepted
Date: 2026-09-05
Decision authority: Kurt
Scope: WP13 / Phase 4
Depends on: ACP-009, ACP-010
Authority: Phase 4 Matrix

1. Purpose

This ACP defines the implementation-alignment boundary between the authoritative Phase 4 Gateway model and the existing Project List navigation machinery.

It establishes:

- how the Gateway’s status-based destinations resolve to existing Project List views;
- the minimum behavioral resolution required for Ideas;
- the transition semantics of New Project;
- the condition under which the legacy Category Screen may be retired.

This ACP does not implement the Gateway, redesign the Project List, or define the internal data model of Ideas or New Project.

2. Architectural Context

The Phase 4 Matrix establishes six Gateway destinations:

- Current
- Planning
- Ideas
- Ongoing
- New Project
- Archive

The Matrix distinguishes two classes of destination:

1. Current, Planning, and Ideas function as top-level views.
2. Ongoing, New Project, and Archive function as secondary navigation/workspaces.

ACP-009 established the authoritative ProjectStatus vocabulary:

possible | planned | current | ongoing | archived

ACP-010 retired category-level sibling paging while preserving category identity and the existing project-level sibling-paging mechanism.

This ACP builds on those accepted decisions. It does not reopen them.

3. Status-Mapped Gateway Destinations

Four Gateway destinations have a direct correspondence with existing ProjectStatus values:

Gateway destination ProjectStatus Resulting object Resulting depth
Current current { kind: "category", category: "current" } list
Planning planned { kind: "category", category: "planned" } list
Ongoing ongoing { kind: "category", category: "ongoing" } list
Archive archived { kind: "category", category: "archived" } list

These destinations reuse the existing Project List mechanism.

The Gateway therefore becomes an additional entry path into the existing status-filtered Project List rather than requiring four new view implementations.

No new category object type is introduced.

No new navigation depth is introduced.

The existing category CurrentObject representation remains:

{ kind: "category", category: "<status>" }

4. Ideas

Ideas requires a distinct treatment.

Ideas is not itself a ProjectStatus.

The possible ProjectStatus represents one class of content that Ideas may contain. It does not redefine the Ideas destination as a status category.

Accordingly:

- Gateway → Ideas must expose possible-status ProjectRecords through the existing Project List mechanism.
- Ideas must also remain capable of containing pre-formal Idea content that is not a ProjectRecord.
- The existence of pre-formal Ideas must not require those Ideas to be converted into ProjectRecords merely to make the Ideas Gateway destination functional.

This ACP establishes the required behavior but does not define the storage structure, schema, metadata, lifecycle, or rendering model for pre-formal Ideas.

Those details remain separately scoped work.

5. New Project

New Project is a workflow entry point, not a ProjectStatus destination.

Gateway → New Project therefore transitions to the distinct New Project workflow entry point.

This ACP does not define the internal steps of that workflow, including:

- project creation mechanics;
- template or seed selection;
- kernel selection;
- metadata initialization;
- subsequent project-state transitions.

Those concerns remain outside the scope of ACP-011.

6. Category Screen Retirement Boundary

ACP-010 deferred retirement of the legacy Category Screen until the Gateway replacement provides equivalent access to the status-mapped views.

ACP-011 establishes the trigger condition:

The legacy Category Screen and its CATEGORY\_ORDER dependency become eligible for retirement once the Gateway provides equivalent access to all four status-mapped Project List views — Current, Planning, Ongoing, and Archive — and Ideas exposes possible-status ProjectRecords through the existing Project List mechanism as specified in Section 4.

Retirement is therefore a follow-on implementation stage, not part of ACP-011 implementation.

Until that condition is satisfied:

- CATEGORY\_ORDER remains available to the existing Category Screen;
- category identity remains part of the object model;
- the Category Screen remains functional;
- no premature deletion is required.

When the condition is satisfied, the Category Screen may be retired and its now-unneeded category-order dependency removed.

This boundary preserves the staged implementation approach established by ACP-010.

7. Navigation Consequences

ACP-011 establishes the following Gateway-to-view mapping:

Entry
↓
Gateway
├── Current → Project List (current)
├── Planning → Project List (planned)
├── Ideas → Project List (possible) + pre-formal Ideas
├── Ongoing → Project List (ongoing)
├── New Project → New Project workflow
└── Archive → Project List (archived)

The four status-mapped destinations do not create a new sibling sequence.

This remains consistent with ACP-010:

- Gateway destinations are a fixed navigation grid.
- Category-level << / >> paging remains retired.
- Project-level sibling paging remains valid at Dashboard and Workspace depth.
- No cross-category project paging is established.

8. Explicit Exclusions

ACP-011 does not establish or reopen:

- the ProjectStatus vocabulary;
- migration of existing status data;
- category-level sibling paging;
- project-level sibling paging;
- Gateway visual design or implementation;
- Dashboard behavior;
- Workspace behavior;
- the pre-formal Ideas data model;
- New Project workflow internals;
- Search behavior;
- AI infrastructure;
- Ongoing-specific workflow behavior beyond its status-mapped Project List destination;
- Archive-specific workflow behavior beyond its status-mapped Project List destination;
- a general verification or acceptance-criteria framework.

Those concerns remain separately scoped.

9. Relationship to Prior ACPs

ACP-009

ACP-011 uses the ProjectStatus vocabulary established by ACP-009 and does not modify it.

In particular, possible remains a ProjectStatus value while Ideas remains a broader destination capable of containing both possible-status ProjectRecords and pre-formal Idea content.

ACP-010

ACP-011 implements the navigation consequence of ACP-010 without reopening its decision.

Category-level sibling paging remains retired.

The Category Screen remains temporarily functional solely because the Gateway replacement has not yet been implemented.

Its eventual retirement is now tied to the explicit trigger defined in Section 6.

10. Decision

ACP-011 establishes that:

1. Current, Planning, Ongoing, and Archive resolve through the existing Project List mechanism using their corresponding ProjectStatus values.
2. Ideas exposes possible ProjectRecords through that mechanism while remaining capable of containing pre-formal Idea content that is not a ProjectRecord.
3. New Project resolves to a distinct workflow entry point without defining that workflow’s internals here.
4. The Category Screen becomes eligible for retirement once Gateway provides equivalent access to all four status-mapped Project List views and Ideas exposes possible-status ProjectRecords through the existing Project List mechanism as specified in Section 4.
5. No other architectural or implementation scope is introduced by this ACP.

This decision is accepted and is now frozen within the scope defined by this ACP.

11. Implementation Boundary

ACP-011 is an alignment decision, not a Gateway implementation specification.

Its purpose is to remove ambiguity before Gateway implementation begins while preserving the existing code where that code remains valid.

Implementation work may proceed only within the boundaries established above.

ACP-011 has been accepted by Kurt and is now the governing architectural decision for the Gateway destination-to-view mapping and Category Screen retirement boundary defined herein.