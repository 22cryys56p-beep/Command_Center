/**
 * OrientationBarComponent — rendering and click interaction for the
 * persistent orientation element's five components.
 *
 * WP12 Step 5, Slice 4 established pure rendering (no click handlers).
 * Slice 5 (this revision) adds click interaction wiring only — no new
 * rendering behavior, no ScreenHost, no CommandCenterView assembly.
 *
 * Architectural boundary (frozen, per Slice 4/5 approval): this
 * component must NEVER call resolvePaging or resolveUp directly, and
 * does not. NavigationController remains the sole owner of all
 * resolver calls, including via the action methods (pagePrevious,
 * pageNext, goUp, goTop) this slice now invokes from click handlers.
 * This component only ever reads NavigationController.getState() (for
 * object/depth) and NavigationController.getAvailability() (for
 * disabled-state rendering of `<<`, `>>`, and `Up`). `Top` is rendered
 * unconditionally enabled, per Section C.
 *
 * resolveLabel (Step 4) is called directly by this component — this is
 * not a boundary violation, since resolveLabel is a pure formatter with
 * no state dependency, not a "navigation resolver" in the sole-caller
 * sense that applies to resolvePaging/resolveUp/resolveTop.
 *
 * Click-handler contract (Slice 5, approved decisions):
 * - `<<`/`>>` call controller.pagePrevious()/pageNext() directly, then
 *   re-render. Both are safe no-ops in the controller when there is no
 *   current object or no sibling — no guard is added here.
 * - `Up` calls controller.goUp() directly, with NO defensive try/catch.
 *   getAvailability().canGoUp already determines whether the button is
 *   enabled; a disabled native button does not fire click events. If
 *   goUp() ever throws through normal interaction, that indicates a
 *   genuine contract violation that must be visible, not silently
 *   swallowed — this is a deliberate application of "honest failure
 *   over silent degradation," not an oversight.
 * - `Top` calls controller.goTop() directly. goTop() never throws.
 * - No callbacks, event buses, or subscription mechanisms are
 *   introduced. Each handler calls the controller method, then calls
 *   this.render() again directly — the minimal mechanism sufficient
 *   for this slice.
 *
 * Re-render ownership (Slice 5, INTERIM design — see note below):
 * OrientationBarComponent currently re-renders itself after each of
 * its own click-driven actions. This is temporary, not a permanent
 * architectural decision: it exists only because CommandCenterView
 * (Slice 7) does not exist yet to own re-render coordination centrally.
 * Once Slice 7 introduces CommandCenterView, this self-owned
 * re-rendering should be explicitly revisited — not assumed to remain
 * the permanent design merely because it was never revisited.
 *
 * This component uses Obsidian's DOM convenience methods (`createEl`,
 * `empty`, `addClass`), which only exist at runtime because Obsidian
 * patches HTMLElement's prototype when the app loads — they are NOT
 * plain DOM APIs, despite type-checking as if they were (Obsidian's
 * ambient type declarations make them appear available project-wide).
 * This means this component is NOT actually renderable or testable
 * outside Obsidian's runtime, unlike navigation-controller.ts and
 * orientation.ts, which remain genuinely host-agnostic. This was first
 * flagged at Slice 4 and remains true, now also covering this slice's
 * click-handler code, which inherits the same untestability.
 */

import type { NavigationController } from "./navigation-controller";
import { resolveLabel } from "./orientation";

/**
 * Renders the orientation bar's current state into the given container.
 * Pure rendering — no event listeners are attached in this slice.
 *
 * Per the approved Step 4 caller contract (resolveLabel), projectName
 * is supplied only when the current object is a project; resolveLabel
 * itself throws if it's required but omitted, so this function must
 * resolve it correctly before calling resolveLabel, not defer that
 * responsibility.
 */
export class OrientationBarComponent {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;

  constructor(container: HTMLElement, controller: NavigationController) {
    this.container = container;
    this.controller = controller;
  }

  /**
   * Renders the bar's current state and attaches click handlers to the
   * four interactive controls. Each render() call empties the
   * container first (existing Slice 4 behavior), so handlers attached
   * in a previous render are discarded along with their elements —
   * there is no stale-listener accumulation across repeated calls.
   *
   * Callers (Slice 7's CommandCenterView) are ultimately responsible
   * for the overall re-render lifecycle once it exists; in this slice,
   * this component temporarily re-renders itself after each of its own
   * click-driven actions (see the class-level comment on interim
   * re-render ownership).
   */
  render(): void {
    const state = this.controller.getState();
    const availability = this.controller.getAvailability();

    this.container.empty();
    this.container.addClass("command-center-orientation-bar");

    const previousButton = this.container.createEl("button", {
      text: "<<",
      cls: "command-center-orientation-previous",
    });
    previousButton.disabled = !availability.canPagePrevious;
    previousButton.addEventListener("click", () => {
      this.controller.pagePrevious();
      this.render();
    });

    const label = this.container.createEl("span", {
      cls: "command-center-orientation-label",
    });
    label.setText(this.resolveCurrentLabel());

    const nextButton = this.container.createEl("button", {
      text: ">>",
      cls: "command-center-orientation-next",
    });
    nextButton.disabled = !availability.canPageNext;
    nextButton.addEventListener("click", () => {
      this.controller.pageNext();
      this.render();
    });

    const upButton = this.container.createEl("button", {
      text: "Up",
      cls: "command-center-orientation-up",
    });
    upButton.disabled = !availability.canGoUp;
    upButton.addEventListener("click", () => {
      // No defensive try/catch, per the approved Slice 5 decision:
      // getAvailability().canGoUp already determines whether this
      // button is enabled, and a disabled native button does not fire
      // click events. If goUp() throws here, that is a genuine
      // contract violation that must surface, not be silently
      // swallowed — "honest failure over silent degradation."
      this.controller.goUp();
      this.render();
    });

    // Top is always enabled once the orientation element is present at
    // all, per Section C — never conditionally disabled.
    const topButton = this.container.createEl("button", {
      text: "Top",
      cls: "command-center-orientation-top",
    });
    topButton.addEventListener("click", () => {
      this.controller.goTop();
      this.render();
    });
  }

  /**
   * Resolves the current label string via resolveLabel, supplying the
   * project name only when the current object is a project. This
   * component holds no ProjectRecord lookup logic of its own — per the
   * approved Step 4 contract, resolveLabel performs no lookups, and the
   * caller (here) is responsible for supplying a name only from data it
   * already has via the current object itself. In this slice, no
   * external project-name source is wired yet beyond the object's own
   * project_id — a placeholder derivation is used here and is expected
   * to be revisited once a real name source is available (e.g., Slice
   * 7/8's ProjectRecord provider wiring).
   */
  private resolveCurrentLabel(): string {
    const state = this.controller.getState();

    if (state.object === null) {
      return resolveLabel({ depth: "category" });
    }

    if (state.object.kind === "category") {
      return resolveLabel({ depth: "list", object: state.object });
    }

    // state.object.kind === "project" — dashboard or workspace depth.
    // No ProjectRecord name source is wired in this slice; using
    // project_id as a placeholder projectName rather than leaving this
    // unresolved. This is flagged, not silently treated as final.
    const destinationDepth = state.depth === "workspace" ? "workspace" : "dashboard";
    return resolveLabel(
      { depth: destinationDepth, object: state.object },
      state.object.project_id
    );
  }
}
