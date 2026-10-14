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
 * INVALID WORDING (WP16 §3): each issue line is a deterministic function of its
 * field and reason alone. Absence (`missing`, `empty`) is worded differently from
 * malformation (`invalid_*`). For absence, the requirement is named from a fixed
 * field-to-tier map (WP16 §3.2); a field outside that map gets no requirement
 * clause, and no tier is ever guessed. Wording is descriptive, never a command.
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
import type { ValidationIssue } from "../data/project-record";

/**
 * WP16 §3.2 — fixed field-to-tier map, used only to name the requirement behind
 * an absent field. A field not listed here gets no requirement clause.
 */
const REQUIRED_FOR: Readonly<Record<string, string>> = {
  name: "every project",
  purpose: "every project",
  description: "every project",
  status: "every project",
  focus: "every project",
  milestone: "planned and current projects",
  progress: "planned and current projects",
  next_action: "planned and current projects",
  blockers: "planned and current projects",
  last_updated: "planned and current projects",
  repo_reference: "current projects",
};

/**
 * WP16 §3.1/§3.5 — one deterministic, descriptive line per validation issue.
 * Depends only on the issue's field and reason. Absence is worded differently
 * from malformation. Exhaustive over ValidationIssue["reason"].
 */
function describeIssue(issue: ValidationIssue): string {
  const field = String(issue.field);
  const scope = REQUIRED_FOR[field];
  const requirement = scope ? `; it is required for ${scope}.` : ".";
  switch (issue.reason) {
    case "missing":
      return `${field} is missing${requirement}`;
    case "empty":
      return `${field} is present but empty${requirement}`;
    case "invalid_enum_value":
      return `${field} is present but is not an allowed value.`;
    case "invalid_type":
      return `${field} is present but has the wrong type.`;
    case "invalid_timestamp":
      return `${field} is present but is not a valid timestamp.`;
    default: {
      const unreachable: never = issue.reason;
      throw new Error(`DashboardView: unhandled validation reason ${JSON.stringify(unreachable)}`);
    }
  }
}

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
    issues: ReadonlyArray<ValidationIssue>
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
      list.createEl("li", { text: describeIssue(issue) });
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
