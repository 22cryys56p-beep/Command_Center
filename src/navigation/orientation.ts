/**
 * Orientation element — sibling-resolution, object-based paging, and
 * Up/Top availability/destination logic.
 *
 * Implements: Phase 3 Architecture Record, Section C (object-based sibling
 * paging rule, Up/Top behavior) — WP12 Steps 1, 2, and 3. This module
 * contains pure functions with no Obsidian runtime dependency, per WP10's
 * isolation requirement and the WP12 implementation sequence (steps 4–6
 * build on this file but are not implemented here).
 *
 * Per Section C: `<<`/`>>` always navigate among the siblings of the
 * *current object*, not the current screen. The current object is either
 * a category (at Category/List depth) or a project within an active
 * category (at Dashboard/Workspace depth).
 *
 * Step 1 (below) resolves the raw sibling set for both cases: "what are
 * the siblings of this object?"
 *
 * Step 2 (below) answers a related but distinct question: "what are the
 * available navigation targets from this object?" — wrapping Step 1's
 * results as typed `CurrentObject` targets a future caller could act on.
 * Per the approved Step 2 scope, `resolvePaging()` does not perform a
 * transition, does not mutate any state, and does not touch rendering —
 * it is a pure resolver, the same as everything in Step 1.
 *
 * Step 3 (below) resolves the two fixed vertical actions, `Up` and `Top`.
 * Unlike Steps 1–2, these are depth-changing operations, which is why
 * Step 3 introduces `Depth` and `NavigationDestination` — concepts
 * `CurrentObject` cannot represent (see the WP12 Step 3 specification's
 * "Architectural Boundary" section for why these types are intentionally
 * kept separate).
 */

import type { ProjectRecord, ProjectStatus } from "../data/project-record";

/**
 * The fixed category enumeration, per ACP-001. This order is architectural
 * in the sense that it must be stable and deterministic (Section C requires
 * `<<`/`>>` to behave identically every time), but the specific sequence
 * chosen here — possible → planned → current → completed — is an
 * implementation detail, not a decision Phase 3 itself made. If this order
 * ever needs to change, that is a WP12-level implementation adjustment, not
 * a Phase 3 reopening, since Phase 3 only requires *a* fixed order to exist.
 */
export const CATEGORY_ORDER: readonly ProjectStatus[] = [
  "possible",
  "planned",
  "current",
  "completed",
];

export interface SiblingResolution<T> {
  previous: T | null;
  next: T | null;
}

/**
 * Resolves category siblings for `<<`/`>>` when the current object is a
 * category (Category Screen or Project List Screen, per Section C/D).
 * Wraps at neither end — reaching the first or last category yields `null`
 * for that direction. Step 2's `resolvePaging()` uses this result to
 * report a disabled state, per Section C's disabled-state rule; this
 * function itself only reports "no sibling exists," it does not decide
 * disabled rendering.
 */
export function getCategorySiblings(
  current: ProjectStatus
): SiblingResolution<ProjectStatus> {
  const index = CATEGORY_ORDER.indexOf(current);

  if (index === -1) {
    // Not a defined category. This should be unreachable if callers only
    // ever pass a valid ProjectStatus, but we do not silently coerce or
    // guess — an invalid input here indicates a bug upstream, not a
    // condition this function should paper over.
    throw new Error(
      `getCategorySiblings: "${current}" is not a recognized category.`
    );
  }

  return {
    previous: index > 0 ? CATEGORY_ORDER[index - 1] : null,
    next: index < CATEGORY_ORDER.length - 1 ? CATEGORY_ORDER[index + 1] : null,
  };
}

/**
 * Produces the ordered list of project_ids belonging to a given category,
 * from a full set of Project Records. Per Phase 3 Section D (WP4), the
 * specific ordering criterion is left as an implementation detail — the
 * only architectural requirement is that it be stable (same input, same
 * order, every time). This implementation orders by `project_id`
 * lexicographically, which is deterministic and requires no additional
 * field. Records with a `status` outside the requested category are
 * excluded, not reordered.
 */
export function getOrderedProjectIdsForCategory(
  records: readonly ProjectRecord[],
  category: ProjectStatus
): string[] {
  return records
    .filter((record) => record.status === category)
    .map((record) => record.project_id)
    .sort();
}

/**
 * Resolves project siblings for `<<`/`>>` when the current object is a
 * project (Dashboard or Workspace depth, per Section C). Siblings are
 * scoped to the project's *active category* only — per Section C, paging
 * at this depth moves between projects within the same category, never
 * across categories. `currentProjectId` must belong to `category`'s
 * ordered set; if it does not (a data-consistency problem upstream, not
 * something this function should mask), both previous and next resolve to
 * `null` rather than guessing a position.
 */
export function getProjectSiblings(
  records: readonly ProjectRecord[],
  category: ProjectStatus,
  currentProjectId: string
): SiblingResolution<string> {
  const orderedIds = getOrderedProjectIdsForCategory(records, category);
  const index = orderedIds.indexOf(currentProjectId);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? orderedIds[index - 1] : null,
    next: index < orderedIds.length - 1 ? orderedIds[index + 1] : null,
  };
}

// ---------------------------------------------------------------------------
// Step 2 — Object-based paging resolution
// ---------------------------------------------------------------------------

/**
 * The current object the orientation element is positioned at. Mirrors
 * Section C's two cases exactly: a category (Category/List depth) or a
 * project within an active category (Dashboard/Workspace depth). This
 * type carries no screen or depth information — per ACP-004/Section C,
 * paging behavior depends only on the object, never on which screen is
 * asking.
 */
export type CurrentObject =
  | { kind: "category"; category: ProjectStatus }
  | { kind: "project"; project_id: string; category: ProjectStatus };

/**
 * A navigation target `resolvePaging` reports as available in a given
 * direction. Intentionally the same shape as `CurrentObject` — a paging
 * target is simply "the object you would be at if you paged this way."
 * This module does not perform that transition; a target is a value a
 * future caller (not implemented in this step) may choose to act on.
 */
export type PagingTarget = CurrentObject;

export interface PagingResolution {
  previous: PagingTarget | null;
  next: PagingTarget | null;
}

/**
 * Resolves the available `<<`/`>>` navigation targets for the current
 * object, per Phase 3 Section C's object-based paging rule.
 *
 * This function:
 * - does NOT perform a navigation transition — it only reports what the
 *   targets would be;
 * - does NOT mutate `currentObject`, `records`, or any other state —
 *   it is a pure function, same input always yields the same output;
 * - does NOT touch rendering, disabled-state styling, labels, or any
 *   Obsidian API — a `null` target is the sole signal a future rendering
 *   step (not implemented here) would use to represent a disabled
 *   control, per Section C's disabled-state rule.
 *
 * Dispatch is purely on `currentObject.kind`:
 * - `"category"` delegates to `getCategorySiblings` (Step 1) and wraps
 *   each result back into a `CurrentObject` of kind `"category"`.
 * - `"project"` delegates to `getProjectSiblings` (Step 1), scoped to
 *   `currentObject.category` — per Section C, project paging never
 *   crosses category boundaries — and wraps each result into a
 *   `CurrentObject` of kind `"project"`, carrying the same category
 *   forward (a project's siblings are always in its own category).
 */
export function resolvePaging(
  currentObject: CurrentObject,
  records: readonly ProjectRecord[]
): PagingResolution {
  if (currentObject.kind === "category") {
    const siblings = getCategorySiblings(currentObject.category);
    return {
      previous:
        siblings.previous !== null
          ? { kind: "category", category: siblings.previous }
          : null,
      next:
        siblings.next !== null
          ? { kind: "category", category: siblings.next }
          : null,
    };
  }

  // currentObject.kind === "project"
  const siblings = getProjectSiblings(
    records,
    currentObject.category,
    currentObject.project_id
  );
  return {
    previous:
      siblings.previous !== null
        ? {
            kind: "project",
            project_id: siblings.previous,
            category: currentObject.category,
          }
        : null,
    next:
      siblings.next !== null
        ? {
            kind: "project",
            project_id: siblings.next,
            category: currentObject.category,
          }
        : null,
  };
}

// ---------------------------------------------------------------------------
// Step 3 — Up / Top availability and destination logic
// ---------------------------------------------------------------------------

/**
 * The five screen depths the orientation element can be present at, minus
 * Entry. Per Phase 3 Section A, the orientation element is "present from
 * Category Screen onward" — it does not exist at Entry, and no component
 * (`<<`, `>>`, `Up`, `Top`) ever targets or represents it. Entry is
 * therefore intentionally excluded here, not omitted by oversight.
 */
export type Depth = "category" | "list" | "dashboard" | "workspace";

/**
 * A navigation destination — where the user is going — as distinct from
 * `CurrentObject`, which represents what entity is currently active.
 *
 * This separation is intentional and must not be merged into a single
 * type for convenience (see WP12 Step 3 specification, "Architectural
 * Boundary: CurrentObject vs. NavigationDestination"). `CurrentObject` is
 * used for object-based operations (Steps 1–2, sibling paging), which are
 * depth-invariant. `NavigationDestination` is used for depth-changing
 * operations (`Up`, `Top`), which `CurrentObject` alone cannot represent —
 * most concretely, Category Screen has no current object at all (Section
 * D: "Inputs received: none"), a state only `NavigationDestination`'s
 * `{ depth: "category" }` variant can express.
 *
 * `{ depth: "category" }` intentionally carries no object field. This is
 * not missing data — Category Screen has no active object until a
 * selection is made, and no object field should ever be added to this
 * variant.
 */
export type NavigationDestination =
  | { depth: "category" }
  | { depth: "list"; object: Extract<CurrentObject, { kind: "category" }> }
  | { depth: "dashboard"; object: Extract<CurrentObject, { kind: "project" }> }
  | { depth: "workspace"; object: Extract<CurrentObject, { kind: "project" }> };

/**
 * Resolves the `Up` destination for the current object at the given
 * depth, per Phase 3 Section C: "Parent depth within the current object."
 *
 * Per Section C's disabled-state table, `Up` is enabled only when the
 * current object is a project at Workspace depth, in which case the
 * destination is that same project's Dashboard — preserving object
 * identity, per ACP-007. At every other depth/object combination, `Up`
 * is disabled and this function returns `null`.
 *
 * This function does NOT perform a navigation transition, does NOT
 * mutate `currentObject`, and does NOT touch rendering or disabled-state
 * styling — a `null` return is the sole signal a future rendering step
 * (not implemented here) would use to represent a disabled control.
 */
export function resolveUp(
  currentObject: CurrentObject,
  depth: Depth
): NavigationDestination | null {
  if (currentObject.kind === "project" && depth === "workspace") {
    return {
      depth: "dashboard",
      object: currentObject,
    };
  }

  // Every other case is disabled per Section C's table:
  // - currentObject.kind === "category" at any depth (categories have no
  //   parent depth defined anywhere in Section C)
  // - currentObject.kind === "project" at "category", "list", or
  //   "dashboard" depth (Dashboard is not treated as having a shallower
  //   depth within the same object)
  return null;
}

/**
 * Resolves the `Top` destination, per Phase 3 Section C: "Category
 * Screen — absolute reset." Always returns the same value; `Top` is
 * never disabled once the orientation element exists at all, and its
 * destination never depends on the current object or depth.
 *
 * Distinct from Entry (a once-per-session lifecycle event, never a `Top`
 * destination, per Section C) and distinct from `Up` (Category is an
 * absolute reset; `Up` is a same-object parent-depth step).
 *
 * This function takes no parameters, because the destination never
 * varies, and performs no navigation transition — it only reports the
 * destination a future caller (not implemented here) may act on.
 */
export function resolveTop(): NavigationDestination {
  return { depth: "category" };
}
