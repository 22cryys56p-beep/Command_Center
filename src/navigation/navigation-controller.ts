/**
 * NavigationController — owns the orientation element's runtime state.
 *
 * WP12 Step 5, Slice 4: adds getAvailability(), a read-only capability
 * snapshot method for UI rendering. NavigationController remains the
 * sole owner of all resolver calls, including this read-only one —
 * OrientationBarComponent (this slice) must never call resolvePaging
 * or resolveUp directly; it reads getAvailability() instead.
 *
 * Slice 2 established the state container and read-only accessor.
 * Slice 3 added the action methods and their resolver wiring.
 * resolveLabel (Step 4) is NOT wired here — label resolution belongs
 * to OrientationBarComponent, which reads state from this controller
 * directly and calls resolveLabel itself (resolveLabel is a pure
 * formatter with no state dependency, not a "navigation resolver" in
 * the sole-caller sense that applies to resolvePaging/resolveUp/
 * resolveTop).
 *
 * No Obsidian API is touched. No UI component exists yet. No
 * connection to a real Metadata Cache — ProjectRecordProvider remains
 * a minimal injected function type, satisfied by a real Obsidian-backed
 * implementation no earlier than Slice 7/8.
 *
 * Ownership and lifetime (frozen, per WP12 Step 5 architecture):
 * NavigationController is owned by CommandCenterView, created in
 * onOpen(), and destroyed in onClose(). No plugin-level singleton.
 * One active Command Center instance only. This class itself does not
 * enforce that lifetime — enforcement is CommandCenterView's
 * responsibility (Slice 7) — but its design assumes a single instance
 * with no retained state across sessions.
 *
 * Frozen initial state contract, per Phase 3 Architecture Record
 * Section D (Category Screen: "Inputs received: none") and the WP12
 * specification's confirmation that Category Screen has no current
 * object until a selection is made: on construction, there is no
 * object and depth is "category". This mirrors NavigationDestination's
 * `{ depth: "category" }` shape from Step 3/4 — no object field, by
 * design, not missing data.
 *
 * Approved state-transition contracts (Slice 3):
 * - selectCategory/selectProject are NOT produced by any Step 1–3
 *   resolver — no resolver models "an object was just chosen from a
 *   shallower screen." The controller constructs these transitions
 *   directly.
 * - selectProject derives its category from the controller's CURRENT
 *   state (state.object must already be a category object, i.e. List
 *   depth) — no ProjectRecord lookup is performed to determine
 *   category. Calling selectProject when state.object is not a
 *   category is a caller-contract violation and throws, matching the
 *   "honest failure over silent degradation" precedent from WP11/Step 1.
 * - pageNext/pagePrevious no-op (state unchanged) when state.object is
 *   null — this is an expected, reachable state during normal use
 *   (initial state, or immediately after goTop), not a caller error.
 * - goUp throws when state.object is null — Up is only ever
 *   legitimately enabled with a project object at workspace depth;
 *   a null object at that depth would indicate an inconsistent state,
 *   not a normal disabled case, so it is NOT treated the same as the
 *   pageNext/pagePrevious no-op case.
 *
 * Approved availability contract (Slice 4):
 * - getAvailability() is a pure, read-only capability snapshot:
 *   { canPagePrevious, canPageNext, canGoUp }. It computes these by
 *   calling resolvePaging/resolveUp internally (the same resolvers
 *   the action methods already use) and checking for a null result,
 *   without mutating state. No canGoTop is included — per Section C,
 *   Top is always enabled once the orientation element is present at
 *   all, so there is nothing for an availability check to report.
 * - When state.object is null, all three flags are false — mirroring
 *   pageNext/pagePrevious's no-op behavior and goUp's throw behavior:
 *   nothing is available to page or move up from when there is no
 *   current object. (getAvailability() itself never throws, even
 *   though goUp() would in this state — an availability check
 *   reporting "not available" is not the same operation as attempting
 *   the action itself.)
 */

import type { CurrentObject, Depth } from "./orientation";
import type { ProjectRecord, ProjectStatus } from "../data/project-record";
import { resolvePaging, resolveUp, resolveTop } from "./orientation";

/**
 * The orientation element's current navigation state: which object (if
 * any) is active, and at what depth. No object is a valid, expected
 * state — specifically the initial state, and the state after `Top`.
 */
export interface NavigationState {
  object: CurrentObject | null;
  depth: Depth;
}

/**
 * Minimal injected dependency for obtaining the current set of Project
 * Records. Kept as a plain function type, not an Obsidian-specific
 * interface, so NavigationController never imports or depends on
 * Obsidian's Metadata Cache API directly — this is what keeps the
 * controller host-agnostic and unit-testable without Obsidian, the
 * same pattern established throughout Steps 1–4.
 */
export type ProjectRecordProvider = () => readonly ProjectRecord[];

/**
 * A read-only capability snapshot for UI rendering — reports whether
 * each conditionally-disabled orientation component is currently
 * available, without exposing (or requiring the caller to know) the
 * underlying resolver mechanics. No canGoTop field: per Section C,
 * Top is always enabled once the element is present, so there is
 * nothing to report for it.
 */
export interface NavigationAvailability {
  canPagePrevious: boolean;
  canPageNext: boolean;
  canGoUp: boolean;
}

export class NavigationController {
  private state: NavigationState;
  private readonly getRecords: ProjectRecordProvider;

  constructor(getRecords: ProjectRecordProvider) {
    this.state = {
      object: null,
      depth: "category",
    };
    this.getRecords = getRecords;
  }

  /**
   * Returns the current navigation state. Read-only from the caller's
   * perspective — this accessor does not expose a setter; all state
   * changes happen through the action methods below.
   */
  getState(): NavigationState {
    return this.state;
  }

  /**
   * Constructs the transition produced by choosing a category from the
   * Category Screen. Not resolver-owned — no Step 1–3 function models
   * this transition; it is constructed directly.
   */
  selectCategory(category: ProjectStatus): void {
    this.state = {
      object: { kind: "category", category },
      depth: "list",
    };
  }

  /**
   * Constructs the transition produced by choosing a project from the
   * Project List Screen. Not resolver-owned, per the same reasoning as
   * selectCategory.
   *
   * Derives its category from the CONTROLLER'S CURRENT STATE — this
   * method must be called only when state.object is already a category
   * object (i.e. the controller is at List depth). No ProjectRecord
   * lookup is performed to determine category. Calling this method
   * when state.object is not a category object is a caller-contract
   * violation and throws.
   */
  selectProject(project_id: string): void {
    if (this.state.object === null || this.state.object.kind !== "category") {
      throw new Error(
        "NavigationController.selectProject: can only be called when the current object is a category (List depth). " +
          `Current object kind: ${this.state.object === null ? "null" : this.state.object.kind}.`
      );
    }

    this.state = {
      object: {
        kind: "project",
        project_id,
        category: this.state.object.category,
      },
      depth: "dashboard",
    };
  }

  /**
   * Pages to the next sibling of the current object, per resolvePaging
   * (Step 2). No-ops (state unchanged) when state.object is null — this
   * is an expected, reachable state during normal use, not a caller
   * error, matching WP3's original finding that `<<`/`>>` are only
   * meaningful after a category has been selected once.
   */
  pageNext(): void {
    if (this.state.object === null) {
      return;
    }

    const resolution = resolvePaging(this.state.object, this.getRecords());
    if (resolution.next !== null) {
      this.state = { object: resolution.next, depth: this.state.depth };
    }
  }

  /**
   * Pages to the previous sibling of the current object, per
   * resolvePaging (Step 2). No-ops when state.object is null, matching
   * pageNext's contract.
   */
  pagePrevious(): void {
    if (this.state.object === null) {
      return;
    }

    const resolution = resolvePaging(this.state.object, this.getRecords());
    if (resolution.previous !== null) {
      this.state = { object: resolution.previous, depth: this.state.depth };
    }
  }

  /**
   * Moves to the parent depth within the current object, per resolveUp
   * (Step 3). Throws when state.object is null — Up is only ever
   * legitimately enabled with a project object at workspace depth; a
   * null object at that point would indicate an inconsistent state,
   * not a normal disabled case, so this is NOT treated as a no-op the
   * way pageNext/pagePrevious are.
   *
   * When enabled (project object at workspace depth), resolveUp's
   * NavigationDestination result is applied directly. When disabled
   * (resolveUp returns null — every other object/depth combination),
   * this is a normal, expected no-op, not an error.
   */
  goUp(): void {
    if (this.state.object === null) {
      throw new Error(
        "NavigationController.goUp: called with no current object. This indicates an inconsistent state — Up is only ever legitimately enabled with a project object at workspace depth."
      );
    }

    const destination = resolveUp(this.state.object, this.state.depth);
    if (destination === null) {
      // Disabled per Section C's table — normal, expected no-op.
      return;
    }

    // resolveUp only ever produces a "dashboard" destination when
    // enabled (per Step 3's own implementation), but the return type
    // is the full NavigationDestination union, which includes the
    // object-less "category" variant. Narrow explicitly rather than
    // asserting, consistent with this module's "no silent coercion"
    // precedent (Step 1's getCategorySiblings comment).
    if (destination.depth === "category") {
      throw new Error(
        "NavigationController.goUp: resolveUp returned an unexpected \"category\" destination. This should be unreachable given goUp's null-object guard above."
      );
    }

    this.state = { object: destination.object, depth: destination.depth };
  }

  /**
   * Resets to the Category Screen, per resolveTop (Step 3). Always
   * succeeds; never throws; the destination never depends on prior
   * state.
   */
  goTop(): void {
    const destination = resolveTop();
    this.state = { object: null, depth: destination.depth };
  }

  /**
   * Returns a read-only capability snapshot for UI rendering. Computes
   * each flag by calling resolvePaging/resolveUp internally — the same
   * resolvers the action methods above use — and checking for a null
   * result, without mutating state. This is the only sanctioned way for
   * a caller (OrientationBarComponent, Slice 5) to determine disabled
   * states; it must never call resolvePaging or resolveUp directly.
   *
   * When state.object is null, all three flags are false. This mirrors
   * pageNext/pagePrevious's no-op behavior (nothing to page from), but
   * does NOT mirror goUp()'s throw behavior — reporting "not available"
   * is a different operation from attempting the action, and this
   * method never throws.
   */
  getAvailability(): NavigationAvailability {
    if (this.state.object === null) {
      return { canPagePrevious: false, canPageNext: false, canGoUp: false };
    }

    const paging = resolvePaging(this.state.object, this.getRecords());
    const upDestination = resolveUp(this.state.object, this.state.depth);

    return {
      canPagePrevious: paging.previous !== null,
      canPageNext: paging.next !== null,
      canGoUp: upDestination !== null,
    };
  }
}

