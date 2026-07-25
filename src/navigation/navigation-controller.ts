/**
 * NavigationController — owns the orientation element's runtime state.
 *
 * WP12 Step 5, Slice 2: state container and read-only accessor only.
 * No action methods (pageNext, pagePrevious, goUp, goTop, selectCategory,
 * selectProject) are implemented in this slice — those are Slice 3.
 * No resolver (resolvePaging, resolveUp, resolveTop, resolveLabel) is
 * wired yet. No Obsidian API is touched. No UI component exists yet.
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
 */

import type { CurrentObject, Depth } from "./orientation";

/**
 * The orientation element's current navigation state: which object (if
 * any) is active, and at what depth. No object is a valid, expected
 * state — specifically the initial state, and the state after `Top`.
 */
export interface NavigationState {
  object: CurrentObject | null;
  depth: Depth;
}

export class NavigationController {
  private state: NavigationState;

  constructor() {
    this.state = {
      object: null,
      depth: "category",
    };
  }

  /**
   * Returns the current navigation state. Read-only from the caller's
   * perspective — this accessor does not expose a setter, and no other
   * method on this class is implemented yet in this slice. Callers must
   * not mutate the returned object; a future slice may harden this
   * further (e.g., returning a frozen copy) if that proves necessary.
   */
  getState(): NavigationState {
    return this.state;
  }
}
