# ACP-010 — Retire Category-Level Sibling Paging After Gateway Introduction

**Status:** proposed — decision required
**Date:** 2026-09-02
**Decision authority:** Kurt
**Governs:** Category-level sibling paging in the navigation/orientation system
**Extends:** Phase 3 navigation model only as explicitly resolved by this ACP

## 1. Purpose

This ACP resolves the remaining Phase 3 / Phase 4 navigation question concerning category-level sibling paging.

The Phase 3 navigation model established object-based sibling paging: `<<` and `>>` navigate among siblings of the current object. At Category/List depth, the current object was a category; at Dashboard/Workspace depth, the current object was a project within the active category.

Phase 4 replaces the former Category Screen with the Gateway: a fixed six-destination grid rather than an ordered sequence of categories.

This ACP determines whether category-level sibling paging remains meaningful under the Phase 4 navigation model.

## 2. Decision

Category-level `<<` / `>>` sibling paging is **retired**.

There is no category-level sibling sequence at Gateway or Project List depth.

The six Gateway destinations are a fixed navigation grid and are not treated as siblings in an ordered paging sequence.

Project-level sibling paging remains valid and is retained at Dashboard and Workspace depth, where projects within the selected scope are genuine siblings of the same object type.

## 3. Gateway Navigation

The Gateway is a fixed six-destination grid:

* Current
* Planning
* Ideas
* Ongoing
* New Project
* Archive

These destinations are not an ordered sibling set.

In particular, `New Project` represents a workflow entry point rather than a project-status category, while `Ideas` represents a distinct pre-formal project/content scope.

The Gateway therefore must not acquire an artificial `<<` / `>>` sequence merely to preserve the former Category Screen behavior.

## 4. Project List Boundary

At Project List depth, category-level `<<` / `>>` paging is disabled.

Changing the active project scope is a Gateway-level navigation decision rather than category-to-category sibling paging.

No new category ordering is introduced to support the retired paging behavior.

## 5. Project-Level Paging Retained

At Project Dashboard and Project Workspace depth, `<<` / `>>` continue to resolve among projects within the active scope.

This remains consistent with the Phase 3 object-based sibling principle: the current object at these depths is a project, and other projects within the same selected scope are genuine siblings.

Project-level paging does not cross category/status boundaries.

## 6. Orientation Behavior by Depth

| Depth             | Current object    | `<<` / `>>` behavior   |
| ----------------- | ----------------- | ----------------------- |
| Entry             | none               | Not present             |
| Gateway            | none               | No sibling target        |
| Project List      | category identity | Disabled                |
| Project Dashboard | project            | Project sibling paging  |
| Project Workspace | project            | Project sibling paging  |

Where an orientation component has no valid navigation target, the Phase 3 Architecture Record's frozen rule remains in force: it must render **visibly disabled, never hidden and never silently inert**.

This ACP changes the existence of category-level sibling targets; it does not change that established presentation requirement.

## 7. Relationship to the Phase 3 Architecture

This ACP does not reopen or alter the Phase 3 object-based sibling-paging principle.

Instead, it resolves which objects constitute siblings at each navigation depth after the Phase 4 Gateway replaces the former Category Screen.

The Phase 3 Architecture Record remains the historical record of the Phase 3 navigation architecture and is not modified.

Under this ACP:

* category-level sibling paging is retired;
* project-level sibling paging is retained;
* the Gateway is a fixed navigation grid rather than a paging sequence.

This ACP is the current authority for the category-level paging question.

## 8. `orientation.ts` Implementation Consequence

The category-level **paging machinery** associated specifically with category sibling ordering is retired.

The following may be removed:

* `CATEGORY_ORDER`;
* `getCategorySiblings()`;
* the category-sibling ordering dependency used solely by those functions.

However, the category form of `CurrentObject` **must remain**.

`CurrentObject` with `kind: "category"` is not only a paging representation. It also represents category identity at Project List depth and is required by the existing `NavigationDestination` and `resolveLabel()` logic.

Therefore:

* the category `CurrentObject` representation remains;
* category identity remains available to List-depth navigation and labeling;
* `resolvePaging()` remains capable of receiving a category current object;
* when the current object is a category, `resolvePaging()` returns no sibling targets: `{ previous: null, next: null }`;
* the project-level sibling-resolution path remains unchanged.

The implementation consequence is therefore **removal of category paging, not removal of category identity**.

No new category ordering is introduced.

## 9. Scope Boundary

This ACP does not decide:

* Gateway visual design;
* Gateway button actions;
* Project List contents or layout;
* Dashboard or Workspace layout;
* project ordering within a selected scope;
* `Up` or `Top` behavior;
* project-status semantics;
* Entry-screen lifecycle;
* any other navigation behavior not explicitly addressed above.

The phrase "change the active project scope through the Gateway" describes the architectural boundary between scope selection and project-list navigation; it does not establish a new `Up`, `Back`, or return mechanism.

## 10. Rationale

The former category-paging model depended on categories forming an ordered navigation sequence.

The Phase 4 Gateway intentionally replaces that model with a fixed grid of six destinations. Those destinations are semantically heterogeneous and are not naturally represented as previous/next siblings.

Preserving category-level paging would therefore create an artificial sequence, duplicate the Gateway's scope-selection role, and allow Project List navigation to bypass the explicit Gateway boundary.

Project-level paging remains semantically coherent because projects within a selected scope are genuine siblings of the same object type.

## 11. Final Decision

Upon acceptance of this ACP:

1. Category-level sibling paging is retired.
2. Gateway destinations are not a `<<` / `>>` sequence.
3. Project List has no category-level sibling paging.
4. Project Dashboard and Project Workspace retain project-level sibling paging within the active scope.
5. Category identity remains part of the navigation model where required by Project List navigation and labeling.
6. `orientation.ts` removes category paging machinery while preserving category identity and returning disabled paging for category current objects.
7. The Phase 3 visibly-disabled rule remains in force for orientation controls with no valid target.
