/**
 * Orientation element — sibling-resolution logic.
 *
 * Implements: Phase 3 Architecture Record, Section C (object-based sibling
 * paging rule) — WP12 Step 1 only. This module contains pure functions with
 * no Obsidian runtime dependency, per WP10's isolation requirement and the
 * WP12 implementation sequence (steps 2–6 build on this file but are not
 * implemented here).
 *
 * Per Section C: `<<`/`>>` always navigate among the siblings of the
 * *current object*, not the current screen. The current object is either
 * a category (at Category/List depth) or a project within an active
 * category (at Dashboard/Workspace depth). This module resolves the
 * sibling set for both cases; it does not decide *when* to page (that is
 * Step 2) or render anything (Step 5).
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
 * for that direction, which the (not-yet-implemented) paging/disabled-state
 * logic in Step 3 will use to render a disabled control, per Section C's
 * disabled-state rule. This module does not itself decide disabled
 * rendering — it only reports "no sibling exists."
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
