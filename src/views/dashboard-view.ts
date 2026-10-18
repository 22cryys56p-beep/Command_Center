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
 * RESOLVED PRESENTATION (WP16 §2): the resolved record is shown from existing
 * ProjectRecord fields only, gated by status tier, values as stored. Hierarchy comes
 * from order and size, not from containers or per-field headings: name and status,
 * Focus, a compact Where Things Stand group, quiet Purpose and Description lines, and
 * a quiet Repository line (current only). There is no panel, border, or background;
 * the only color is the theme's muted text. Still deferred, by design: Attention
 * (R582), navigation to other sections (R587), the Dashboard-to-Workspace action
 * (R589), the AI Progress Estimate (R802), and staleness.
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
import type { ProjectRecord, ValidationIssue } from "../data/project-record";

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

/** Theme-aware muted text color (Obsidian variable); the only color this view uses. */
const MUTED = "var(--text-muted)";

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
        this.renderResolved(result.record);
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

  private renderResolved(record: ProjectRecord): void {
    const root = this.container.createEl("div", { cls: "command-center-dashboard-resolved" });
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "0.9rem";

    const identity = root.createEl("div", { cls: "command-center-dashboard-identity" });
    identity.style.display = "flex";
    identity.style.flexWrap = "wrap";
    identity.style.alignItems = "baseline";
    identity.style.gap = "0.25rem 0.75rem";
    const name = identity.createEl("h2", { cls: "command-center-dashboard-name", text: record.name });
    name.style.margin = "0";
    name.style.fontSize = "1.5rem";
    name.style.fontWeight = "600";
    name.style.whiteSpace = "pre-wrap";
    name.style.overflowWrap = "anywhere";
    const status = identity.createEl("span", { cls: "command-center-dashboard-status", text: record.status });
    status.style.fontSize = "0.85rem";
    status.style.color = MUTED;

    this.renderLabeled(root, "command-center-dashboard-focus", "Focus", record.focus, "1rem", false);
    this.renderWhereThingsStand(root, record);
    this.renderLabeled(root, "command-center-dashboard-purpose", "Purpose", record.purpose, "0.9rem", false);
    this.renderLabeled(root, "command-center-dashboard-description", "Description", record.description, "0.9rem", false);
    if (record.status === "current" && typeof record.repo_reference === "string") {
      this.renderLabeled(root, "command-center-dashboard-reference", "Repository", record.repo_reference, "0.8rem", true);
    }
  }

  /** A small muted label above a value, shown as stored (line breaks preserved). */
  private renderLabeled(
    parent: HTMLElement,
    cls: string,
    label: string,
    value: string,
    valueSize: string,
    muted: boolean
  ): HTMLElement {
    const block = parent.createEl("div", { cls });
    const labelEl = block.createEl("div", { cls: `${cls}-label`, text: label });
    labelEl.style.fontSize = "0.75rem";
    labelEl.style.color = MUTED;
    const valueEl = block.createEl("div", { cls: `${cls}-value`, text: value });
    valueEl.style.fontSize = valueSize;
    valueEl.style.whiteSpace = "pre-wrap";
    valueEl.style.overflowWrap = "anywhere";
    if (muted) valueEl.style.color = MUTED;
    return block;
  }

  /**
   * WP16 §2.4. Present at every status. Operational fields appear only at
   * planned and current; elsewhere a neutral line says none apply.
   */
  private renderWhereThingsStand(parent: HTMLElement, record: ProjectRecord): void {
    const section = parent.createEl("div", { cls: "command-center-dashboard-where-things-stand" });
    const heading = section.createEl("div", { cls: "command-center-dashboard-where-things-stand-label", text: "Where Things Stand" });
    heading.style.fontSize = "0.75rem";
    heading.style.color = MUTED;

    if (record.status !== "planned" && record.status !== "current") {
      const empty = section.createEl("div", {
        cls: "command-center-dashboard-where-things-stand-empty",
        text: "No operational information applies at this status.",
      });
      empty.style.fontSize = "0.9rem";
      empty.style.color = MUTED;
      return;
    }

    const items = section.createEl("div", { cls: "command-center-dashboard-items" });
    items.style.display = "flex";
    items.style.flexWrap = "wrap";
    items.style.gap = "0.5rem 1.75rem";
    items.style.marginTop = "0.25rem";

    const addItem = (cls: string, label: string, value: string | undefined): void => {
      if (value === undefined) return;
      this.renderLabeled(items, cls, label, value, "1rem", false);
    };
    addItem("command-center-dashboard-item-milestone", "Milestone", record.milestone);
    addItem("command-center-dashboard-item-progress", "Progress (recorded)", record.progress);
    addItem("command-center-dashboard-item-next-action", "Next action", record.next_action);
    this.renderBlockers(items, record.blockers);
    addItem("command-center-dashboard-item-last-updated", "Last updated", record.last_updated);
  }

  /** D2: null and [] both present the same no-blockers statement; otherwise every blocker is listed. */
  private renderBlockers(parent: HTMLElement, blockers: ProjectRecord["blockers"]): void {
    if (blockers === undefined) return;
    const cls = "command-center-dashboard-item-blockers";
    const block = parent.createEl("div", { cls });
    const labelEl = block.createEl("div", { cls: `${cls}-label`, text: "Blockers" });
    labelEl.style.fontSize = "0.75rem";
    labelEl.style.color = MUTED;
    if (blockers === null || blockers.length === 0) {
      const none = block.createEl("div", { cls: `${cls}-value`, text: "No blockers." });
      none.style.fontSize = "1rem";
      return;
    }
    const list = block.createEl("ul", { cls: `${cls}-list` });
    list.style.margin = "0";
    list.style.paddingLeft = "1.1rem";
    for (const blocker of blockers) {
      const li = list.createEl("li", { text: blocker });
      li.style.whiteSpace = "pre-wrap";
      li.style.overflowWrap = "anywhere";
    }
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
