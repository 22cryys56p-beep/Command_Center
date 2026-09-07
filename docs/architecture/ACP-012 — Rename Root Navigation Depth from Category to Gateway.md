# ACP-012

## Title
Rename Root Navigation Depth from Category to Gateway

## Status
Resolved — Accepted

## Date
2026-09-05

## Decision authority
Kurt

## Scope
WP13 / Phase 4

## Depends on

- ACP-009
- ACP-010
- ACP-011

## Authority
Phase 4 Matrix

## Purpose
Rename the existing root navigation depth:

`Depth: "category"`

to:

`Depth: "gateway"`

This is a semantic rename of the existing root navigation state.

No additional navigation depth is introduced.

Gateway inherits the former Category Screen's defining property:

- no current object
- deterministic return target
- fixed root destination

The resulting depth model becomes:

`"gateway" | "list" | "dashboard" | "workspace"`

The following remains unchanged:

`CurrentObject.kind: "category"`

## What remains unchanged

- ACP-009 ProjectStatus vocabulary
- ACP-010 category-level paging retirement
- ACP-011 Gateway mapping
- project-level sibling paging
- Dashboard behavior
- Workspace behavior
- deterministic disabled controls

## Implementation boundary
This ACP establishes only the semantic rename of the existing root navigation depth.

It does not:

- create a second root depth
- change `CurrentObject.kind`
- restore category sibling paging
- alter ProjectStatus values
- redefine Gateway destinations

## Historical provenance
Phase 3 Section D established the original no-current-object root shape.

ACP-011 established that Gateway inherits that same property.

ACP-012 renames the root depth to accurately represent the Gateway model established by Phase 4.

## Acceptance
The authoritative root navigation depth is:

`Depth: "gateway"`

No additional navigation depth exists.

Gateway becomes the root surface reached from Entry.
