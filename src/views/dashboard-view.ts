/**
 * DashboardView — the screen that appears when the navigation state is at
 * dashboard depth with a project object.
 *
 * SCOPE (WP15 — docs/specifications/CC_Phase 4_WP15 Dashboard Implementation
 * Specification.md): this view implements ONLY the unresolved-state
 * presentation required by ACP-016 — Missing, Invalid, and Duplicate. It
 * resolves the requested project_id through an injected resolver and renders
 * exactly one of those conditions, never a normal Dashboard with empty or
 * default fields.
 *
 * DEFERRED — NOT IMPLEMENTED HERE: normal (resolved) Dashboard content per
 * Phase 3 Section D (including "Where Things Stand" and the AI Progress
 * Estimate, ACP-015). The `resolved` branch below is an explicitly deferred
 * placeholder, not a start on that work. Do not read it as Dashboard
 * implementation; the remaining Dashboard content belongs to later work.
 *
 * Constraints honored (WP15 §3.6, P1–P6):
 * - The three unresolved conditions carry their minimum information and are
 *   visibly distinguishable from one another (distinct heading and class).
 * - This view never calls NavigationController. Navigation away from an
 *   unresolved Dashboard happens through the persistent orientation bar
 *   (`Top`, `Up`); nothing here disables or replaces it.
 * - Presentation never causes a navigation-state change. This view therefore
 *   needs no onStateChange callback; CommandCenterView's existing render
 *   coordination re-renders it.
 * - No remembered resolution history: the resolver is called afresh on every
 *   render and no result is stored on this instance.
 */

import type { NavigationController } from "../navigation/navigation-controller";
import type { ResolutionResult } from "../integration/obsidian-project-record-provider";

export class DashboardView {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;
  private readonly resolve: (project_id: string) => ResolutionResult;

  constructor(
    container: HTMLElement,
    controller: NavigationController,
    resolve: (project_id: string) => ResolutionResult
  ) {
    this.container = container;
    this.controller = controller;
    this.resolve = resolve;
  }

  render(): void {
    const state = this.controller.getState();

    if (
      state.depth !== "dashboard" ||
      state.object === null ||
      state.object.kind !== "project"
    ) {
      this.container.empty();
      this.container.style.display = "none";
      return;
    }

    this.container.empty();
    this.container.addClass("command-center-dashboard-view");
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.gap = "0.75rem";
    this.container.style.padding = "1rem";
    this.container.style.width = "100%";
    this.container.style.height = "100%";

    const project_id = state.object.project_id;
    const result = this.resolve(project_id);

    switch (result.condition) {
      case "resolved":
        this.renderDeferred();
        return;
      case "missing":
        this.renderMissing(project_id);
        return;
      case "invalid":
        this.renderInvalid(project_id, result.candidatePath, result.issues);
        return;
      case "duplicate":
        this.renderDuplicate(project_id, result.paths);
        return;
      default: {
        const unreachable: never = result;
        throw new Error(
          `DashboardView: unhandled resolution condition ${JSON.stringify(unreachable)}`
        );
      }
    }
  }

  /** Placeholder only — normal Dashboard content is deferred (see file header). */
  private renderDeferred(): void {
    const block = this.container.createEl("div", {
      cls: "command-center-dashboard-deferred",
    });
    block.createEl("p", { text: "Dashboard content pending." });
  }

  private renderMissing(project_id: string): void {
    const block = this.container.createEl("div", {
      cls: "command-center-dashboard-missing",
    });
    block.createEl("h2", { text: "Project not found" });
    block.createEl("p", {
      text: `No project record was found for "${project_id}".`,
    });
  }

  private renderInvalid(
    project_id: string,
    candidatePath: string,
    issues: ReadonlyArray<{ field: string; reason: string }>
  ): void {
    const block = this.container.createEl("div", {
      cls: "command-center-dashboard-invalid",
    });
    block.createEl("h2", { text: "Project record is invalid" });
    block.createEl("p", {
      text: `A record for "${project_id}" was found but failed validation.`,
    });
    block.createEl("p", { text: `File: ${candidatePath}` });
    const list = block.createEl("ul");
    for (const issue of issues) {
      list.createEl("li", { text: `${issue.field}: ${issue.reason}` });
    }
  }

  private renderDuplicate(project_id: string, paths: readonly string[]): void {
    const block = this.container.createEl("div", {
      cls: "command-center-dashboard-duplicate",
    });
    block.createEl("h2", { text: "Duplicate project records" });
    block.createEl("p", {
      text: `More than one record claims the project_id "${project_id}". None was used.`,
    });
    const list = block.createEl("ul");
    for (const path of paths) {
      list.createEl("li", { text: path });
    }
  }
}
