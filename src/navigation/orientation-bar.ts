/**
 * OrientationBarComponent — pure rendering of the persistent orientation
 * element's five components.
 *
 * WP12 Step 5, Slice 4: rendering only. No click handlers are wired
 * (that is Slice 5). This component renders a given NavigationController
 * snapshot to DOM and nothing more.
 *
 * Architectural boundary (frozen, per Slice 4 approval): this component
 * must NEVER call resolvePaging or resolveUp directly, and does not.
 * NavigationController remains the sole owner of all resolver calls.
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
 * This component uses Obsidian's DOM convenience methods (`createEl`,
 * `empty`, `addClass`), which only exist at runtime because Obsidian
 * patches HTMLElement's prototype when the app loads — they are NOT
 * plain DOM APIs, despite type-checking as if they were (Obsidian's
 * ambient type declarations make them appear available project-wide).
 * This means this component is NOT actually renderable or testable
 * outside Obsidian's runtime, unlike navigation-controller.ts and
 * orientation.ts, which remain genuinely host-agnostic. This is the
 * expected, first real point of Obsidian-runtime coupling in this
 * project (WP10 anticipated this at "Step 5" specifically) — flagged
 * explicitly here rather than left as an implicit assumption, since an
 * earlier draft of this comment incorrectly claimed host-independence.
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
   * Renders the bar's current state. Callers (Slice 7's
   * CommandCenterView) are responsible for invoking this after any
   * state change — this component does not subscribe to the
   * controller itself in this slice.
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

    const label = this.container.createEl("span", {
      cls: "command-center-orientation-label",
    });
    label.setText(this.resolveCurrentLabel());

    const nextButton = this.container.createEl("button", {
      text: ">>",
      cls: "command-center-orientation-next",
    });
    nextButton.disabled = !availability.canPageNext;

    const upButton = this.container.createEl("button", {
      text: "Up",
      cls: "command-center-orientation-up",
    });
    upButton.disabled = !availability.canGoUp;

    // Top is always enabled once the orientation element is present at
    // all, per Section C — never conditionally disabled.
    this.container.createEl("button", {
      text: "Top",
      cls: "command-center-orientation-top",
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
