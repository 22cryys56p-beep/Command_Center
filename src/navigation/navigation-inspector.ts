/**
 * NavigationInspector — a passive, generic diagnostic view of
 * NavigationController's current state.
 *
 * WP12 Step 5, Slice 6.
 *
 * IMPORTANT — this is NOT a screen implementation, and must never
 * become one. The original WP12 specification states explicitly:
 * "it does not build any of those screens itself, even minimally,
 * even as a placeholder." A prior planning round proposed a
 * "ScreenHost with placeholder screens" for this slice, which was
 * re-evaluated against that exact sentence and found to conflict with
 * it — that name and concept were discarded entirely, not merely
 * renamed. What exists here instead is a single, depth-agnostic state
 * inspector: it displays NavigationController's raw state as plain
 * diagnostic text, identically regardless of depth. It has no
 * awareness of Category/List/Dashboard/Workspace as distinct concepts
 * — there is no branching logic here that produces different
 * structured content per depth, which is what would make this a
 * screen (even a placeholder one) rather than a diagnostic view.
 *
 * Passivity contract (frozen, per Slice 6 approval):
 * - MAY read NavigationController.getState().
 * - MAY read NavigationController.getAvailability().
 * - MAY render plain diagnostic text.
 * - MUST NOT subscribe to state changes.
 * - MUST NOT trigger renders elsewhere.
 * - MUST NOT communicate with OrientationBarComponent in any way —
 *   this file does not import orientation-bar.ts, and never should.
 * - MUST NOT contain logic that treats category/list/dashboard/
 *   workspace as separate screens (no per-depth branching that
 *   produces different structured output; only a uniform dump of
 *   whatever the current state actually is).
 *
 * Re-render coordination (who calls render() and when) remains
 * entirely deferred to Slice 7's CommandCenterView — this class does
 * not call its own render() from anywhere, unlike
 * OrientationBarComponent's interim self-owned re-rendering (Slice 5).
 * NavigationInspector is purely passive: something else must call
 * render() for anything to appear here at all.
 *
 * Like OrientationBarComponent, this uses Obsidian's DOM convenience
 * methods (createEl, empty), which only exist at runtime because
 * Obsidian patches HTMLElement's prototype when the app loads — not
 * plain DOM APIs, despite type-checking as if they were. Not testable
 * or renderable outside Obsidian's runtime, same limitation as
 * orientation-bar.ts since Slice 4.
 */

import type { NavigationController } from "./navigation-controller";

export class NavigationInspector {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;

  constructor(container: HTMLElement, controller: NavigationController) {
    this.container = container;
    this.controller = controller;
  }

  /**
   * Renders a plain-text dump of the controller's current state.
   * Uniform for every depth — this method contains no conditional
   * logic keyed on state.depth that would produce differently
   * structured output per depth; it always renders the same shape
   * (object, depth, availability), regardless of what those values
   * currently are. This uniformity is what keeps this a diagnostic
   * view rather than a screen.
   *
   * Not called automatically by anything in this class — a caller
   * (Slice 7's CommandCenterView) must invoke this explicitly.
   */
  render(): void {
    const state = this.controller.getState();
    const availability = this.controller.getAvailability();

    this.container.empty();
    this.container.addClass("command-center-navigation-inspector");

    const heading = this.container.createEl("div", {
      text: "Navigation state (diagnostic)",
      cls: "command-center-inspector-heading",
    });
    heading.setAttr("role", "presentation");

    this.container.createEl("pre", {
      text: JSON.stringify({ state, availability }, null, 2),
      cls: "command-center-inspector-dump",
    });
  }
}
