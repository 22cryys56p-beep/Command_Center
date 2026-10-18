/**
 * GatewayView — Command Center's root navigation surface.
 *
 * Implements the approved Gateway Implementation Specification, governed
 * by ACP-011 (destination-to-view mapping), ACP-012 (the object-less
 * `gateway` root depth), and ACP-013 (New Project lives outside
 * NavigationState).
 *
 * SCOPE AND BOUNDARIES:
 * - Renders exactly six fixed destinations. These are navigation choices,
 *   not category sibling paging (retired by ACP-010).
 * - The five status-backed destinations each make exactly ONE existing
 *   controller call: selectCategory(status). This view constructs no
 *   NavigationState, performs no ProjectRecord lookup, and reproduces no
 *   Project List filtering.
 * - New Project is NOT a ProjectStatus. It invokes the already-approved
 *   CommandCenterView.enterNewProject() integration point directly, via
 *   the injected callback below, and touches no navigation state.
 * - Ideas is NOT a sixth ProjectStatus. It exposes `possible`-status
 *   ProjectRecords through the same Project List mechanism. The
 *   pre-formal Ideas data model is explicitly deferred and is not
 *   implemented, implied, or stubbed here.
 * - Introduces no CurrentObject kind and no additional Depth value.
 */

import type { NavigationController } from "../navigation/navigation-controller";
import type { ProjectStatus } from "../data/project-record";

/**
 * A Gateway destination is either a status-backed entry into the existing
 * Project List, or the New Project workflow entry point. These are the
 * only two kinds; nothing here introduces a navigation concept.
 */
type GatewayDestination =
  | { readonly label: string; readonly kind: "status"; readonly status: ProjectStatus }
  | { readonly label: string; readonly kind: "new-project" };

/** The six authoritative destinations fixed by ACP-011, in its stated order. */
export const GATEWAY_DESTINATIONS: readonly GatewayDestination[] = [
  { label: "Current", kind: "status", status: "current" },
  { label: "Planning", kind: "status", status: "planned" },
  { label: "Ideas", kind: "status", status: "possible" },
  { label: "Ongoing", kind: "status", status: "ongoing" },
  { label: "New Project", kind: "new-project" },
  { label: "Archive", kind: "status", status: "archived" },
];

export class GatewayView {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;
  private readonly onEnterNewProject: () => void;
  private onStateChange: (() => void) | null = null;

  constructor(
    container: HTMLElement,
    controller: NavigationController,
    onEnterNewProject: () => void
  ) {
    this.container = container;
    this.controller = controller;
    this.onEnterNewProject = onEnterNewProject;
  }

  setOnStateChange(onStateChange: () => void): void {
    this.onStateChange = onStateChange;
  }

  render(): void {
    const state = this.controller.getState();

    // Gateway is the root surface only. Mirrors ProjectListView's existing
    // depth-guard convention rather than introducing a new mechanism.
    if (state.depth !== "gateway") {
      this.container.empty();
      this.container.style.display = "none";
      return;
    }

    this.container.empty();
    this.container.addClass("command-center-gateway-view");
    // Layout: the six destinations sit in the middle of the screen as two rows
    // of three (Current, Planning, Ideas / Ongoing, New Project, Archive). The
    // container itself is the grid, so each button stays a direct child.
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = "repeat(3, minmax(0, 11rem))";
    this.container.style.gap = "1rem";
    this.container.style.justifyContent = "center";
    this.container.style.alignContent = "center";
    this.container.style.minHeight = "60vh";
    this.container.style.padding = "2rem 1rem";
    this.container.style.width = "100%";

    for (const destination of GATEWAY_DESTINATIONS) {
      const button = this.container.createEl("button", {
        text: destination.label,
        cls: "command-center-gateway-button",
      });

      button.type = "button";
      button.style.padding = "1.25rem 0.75rem";
      button.style.fontSize = "1.05rem";
      button.style.overflowWrap = "anywhere";
      button.style.cursor = "pointer";

      button.addEventListener("click", () => {
        if (destination.kind === "status") {
          this.controller.selectCategory(destination.status);
          this.onStateChange?.();
          return;
        }

        // New Project: a view-layer workflow entry point per ACP-013.
        // Deliberately no controller call and no onStateChange — the
        // navigation state must remain exactly as it was.
        this.onEnterNewProject();
      });
    }
  }
}
