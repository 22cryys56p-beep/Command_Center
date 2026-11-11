# ACP-017

## Title
Up Returns from a Project Dashboard to Its Project List

## Status
Resolved — Accepted

## Date
2026-11-11

## Decision authority
Kurt

## Scope
Phase 3 Section C (`Up` behavior and its disabled-state table); WP12.

## Depends on
- ACP-007 (the `Up` component and its original behavior)
- ACP-010, ACP-011, ACP-012 (the Gateway restructure and the `gateway` root depth)

## Authority
Kurt's ruling on the intended navigation model: Entry (the cabinet), Gateway (the drawers), Project List (the folders in a drawer), and an individual project (the contents of a folder).

## Purpose
Give the user a direct route from an individual project back to the Project List it was opened from. Before this ACP, `Up` was disabled at a project's Dashboard, so the only way back was `Top`, then reselecting the drawer.

## Decision
`Up` takes one step up the hierarchy:

| Current location | `Up` |
|---|---|
| Project Workspace (future) | Returns to that project's Dashboard (unchanged from ACP-007) |
| Project Dashboard | Returns to the Project List of the category the project was opened from (new) |
| Project List | Disabled |
| Gateway | Disabled |

`Top` is unchanged and always returns to the Gateway. `<<` and `>>` are unchanged and continue to move among a category's projects.

## Superseded wording
Phase 3 Section C's statements that `Up` is "currently meaningful only at Workspace" with "no return to Project List or Category", and the Project Dashboard row of its disabled-state table, are superseded for the Project Dashboard. ACP-007's resolution ("enabled only at Workspace depth") is extended, not withdrawn. The original wording remains in place as the historical record.

## Mechanism and state
The destination is the category the project was opened from. That category is navigation context carried by the project `CurrentObject` (`selectProject` sets it from the category being browsed). It is not a lookup of the project's current status at the moment `Up` is pressed. No navigation history is needed. No new `NavigationState` field, `CurrentObject` kind or `Depth` value is introduced, and the existing list destination of `NavigationDestination` is used.

## What remains unchanged
`Top`; sibling paging (ACP-004, ACP-010); the depth model (ACP-012); Workspace → Dashboard; `Up` disabled at the Project List and Gateway; New Project outside `NavigationState` (ACP-013).

## Implementation boundary
`resolveUp` implementation and its associated navigation-controller and orientation tests. No new action methods. This ACP does not introduce a Workspace-entry action.

## Open edge
If a project's status could change while it is open (no write path exists yet), `Up` still returns to the category the project was opened from, because that category is navigation context and not the project's current status.

## Historical provenance
ACP-007 defined `Up` before the Gateway restructure, when `Top` returned to the Category Screen. ACP-010 to ACP-012 reshaped root and category navigation and left `Up` and `Top` out of scope. Kurt observed that the result left no direct route from a project to its list.

## Acceptance
Accepted by Kurt on 2026-11-11.
