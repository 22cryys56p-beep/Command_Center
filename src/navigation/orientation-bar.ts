/**
 * OrientationBarComponent — rendering and click interaction for the
 * persistent orientation element's five components.
 *
 * WP12 Step 5, Slice 4 established pure rendering (no click handlers).
 * Slice 5 added click interaction wiring, with interim self-owned
 * re-rendering. Slice 7 (this revision) moves render ownership to
 * CommandCenterView — this component no longer calls this.render()
 * from its own click handlers; it calls an injected onStateChange
 * callback instead.
 *
 * Architectural boundary (frozen, per Slice 4/5/7 approval): this
 * component must NEVER call resolvePaging or resolveUp directly, and
 * does not. NavigationController remains the sole owner of all
 * resolver calls, including via the action methods (pagePrevious,
 * pageNext, goUp, goTop) this component invokes from click handlers.
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
 * Click-handler contract (Slice 5, amended Slice 7):
 * - `<<`/`>>` call controller.pagePrevious()/pageNext(), then
 *   onStateChange(). Both are safe no-ops in the controller when there
 *   is no current object or no sibling — no guard is added here.
 * - `Up` calls controller.goUp(), then onStateChange(), with NO
 *   defensive try/catch. getAvailability().canGoUp already determines
 *   whether the button is enabled; a disabled native button does not
 *   fire click events. If goUp() ever throws through normal
 *   interaction, that indicates a genuine contract violation that must
 *   be visible, not silently swallowed — this is a deliberate
 *   application of "honest failure over silent degradation," not an
 *   oversight. (If goUp() throws, onStateChange() is never reached —
 *   the exception propagates up through the click handler, which is
 *   the intended, visible failure.)
 * - `Top` calls controller.goTop(), then onStateChange(). goTop()
 *   never throws.
 * - No event buses, observer patterns, subscriptions, or global state
 *   are introduced. A single injected callback is the sole
 *   coordination mechanism, approved specifically because there is one
 *   coordinator (CommandCenterView) and two rendering consumers
 *   (this component and NavigationInspector) — the minimal mechanism
 *   sufficient for that shape, not general-purpose infrastructure.
 *
 * Re-render ownership (RESOLVED at Slice 7 — no longer interim):
 * OrientationBarComponent does NOT re-render itself after actions.
 * CommandCenterView owns re-render coordination centrally: it supplies
 * onStateChange, and its implementation calls this component's
 * render() (and NavigationInspector's render()) after every state
 * change. This was explicitly flagged as deferred at Slice 5 and is
 * now settled, not left open.
 *
 * This component uses Obsidian's DOM convenience methods (`createEl`,
 * `empty`, `addClass`), which only exist at runtime because Obsidian
 * patches HTMLElement's prototype when the app loads — they are NOT
 * plain DOM APIs, despite type-checking as if they were (Obsidian's
 * ambient type declarations make them appear available project-wide).
 * This means this component is NOT actually renderable or testable
 * outside Obsidian's runtime, unlike navigation-controller.ts and
 * orientation.ts, which remain genuinely host-agnostic. First flagged
 * at Slice 4, still true.
 */

import type { NavigationController } from "./navigation-controller";
import { resolveLabel } from "./orientation";

/**
 * Renders the orientation bar's current state into the given container,
 * and wires click interaction. Rendering and interaction are combined
 * in this single class (unchanged since Slice 5) — only re-render
 * ownership has moved (Slice 7); the render/interaction split itself
 * was never revisited or reconsidered.
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
  private readonly onStateChange: () => void;

  constructor(
    container: HTMLElement,
    controller: NavigationController,
    onStateChange: () => void
  ) {
    this.container = container;
    this.controller = controller;
    this.onStateChange = onStateChange;
  }

  /**
   * Renders the bar's current state and attaches click handlers to the
   * four interactive controls. Each render() call empties the
   * container first (existing Slice 4 behavior), so handlers attached
   * in a previous render are discarded along with their elements —
   * there is no stale-listener accumulation across repeated calls.
   *
   * CommandCenterView (Slice 7) is the sole caller of render() — both
   * for the initial mount and after every state change via
   * onStateChange. This component does not call its own render()
   * from anywhere, including its click handlers.
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
      this.onStateChange();
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
      this.onStateChange();
    });

    const upButton = this.container.createEl("button", {
      text: "Up",
      cls: "command-center-orientation-up",
    });
    upButton.disabled = !availability.canGoUp;
    upButton.addEventListener("click", () => {
      // No defensive try/catch, per the approved Slice 5 decision,
      // reaffirmed at Slice 7: getAvailability().canGoUp already
      // determines whether this button is enabled, and a disabled
      // native button does not fire click events. If goUp() throws
      // here, onStateChange() is never reached — the exception
      // propagates as a genuine, visible contract violation, not a
      // silently swallowed one.
      this.controller.goUp();
      this.onStateChange();
    });

    // Top is always enabled once the orientation element is present at
    // all, per Section C — never conditionally disabled.
    const topButton = this.container.createEl("button", {
      text: "Top",
      cls: "command-center-orientation-top",
    });
    topButton.addEventListener("click", () => {
      this.controller.goTop();
      this.onStateChange();
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
