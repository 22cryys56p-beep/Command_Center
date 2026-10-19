/**
 * ProjectListView — the screen that appears when the active category has
 * been selected and the navigation state is now at list depth.
 *
 * It renders a compact summary list of projects in the active category
 * and triggers NavigationController.selectProject(project_id) when the user
 * chooses one.
 */

import type { NavigationController } from "../navigation/navigation-controller";
import type { ProjectRecord } from "../data/project-record";

export class ProjectListView {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;
  private readonly getRecords: () => readonly ProjectRecord[];
  private onStateChange: (() => void) | null = null;

  constructor(
    container: HTMLElement,
    controller: NavigationController,
    getRecords: () => readonly ProjectRecord[]
  ) {
    this.container = container;
    this.controller = controller;
    this.getRecords = getRecords;
  }

  setOnStateChange(onStateChange: () => void): void {
    this.onStateChange = onStateChange;
  }

  render(): void {
    const state = this.controller.getState();

    if (state.depth !== "list") {
      this.container.empty();
      this.container.style.display = "none";
      return;
    }

    this.container.empty();
    this.container.addClass("command-center-project-list-view");
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.gap = "0.75rem";
    this.container.style.padding = "1rem";
    this.container.style.width = "100%";
    this.container.style.boxSizing = "border-box";

    if (state.object === null || state.object.kind !== "category") {
      this.renderEmptyState();
      return;
    }

    const category = state.object.category;
    const projects = this.getRecords().filter(
      (record) => record.status === category
    );

    if (projects.length === 0) {
      this.renderEmptyState();
      return;
    }

    for (const project of projects) {
      const button = this.container.createEl("button", {
        text: project.name,
        cls: "command-center-project-list-button",
      });
      button.type = "button";
      button.style.display = "flex";
      button.style.flexDirection = "column";
      button.style.alignItems = "flex-start";
      button.style.padding = "0.75rem 1rem";
      button.style.cursor = "pointer";
      // Theme-aware colors (Obsidian variables), so rows stay readable in any theme.
      button.style.border = "1px solid var(--background-modifier-border)";
      button.style.borderRadius = "6px";
      button.style.background = "var(--background-secondary)";
      button.style.color = "var(--text-normal)";
      button.style.fontSize = "1.05rem";
      button.style.fontWeight = "600";
      button.style.textAlign = "left";
      // Rows never shrink below their text, so a long name or focus is never clipped.
      button.style.flex = "0 0 auto";
      button.style.width = "100%";
      button.style.boxSizing = "border-box";
      button.style.height = "auto";
      button.style.whiteSpace = "normal";
      button.style.overflowWrap = "anywhere";

      const focus = button.createEl("span", {
        text: project.focus,
        cls: "command-center-project-list-focus",
      });
      focus.style.marginTop = "0.5rem";
      focus.style.fontSize = "0.9rem";
      focus.style.fontWeight = "400";
      focus.style.color = "var(--text-muted)";

      button.addEventListener("click", () => {
        this.controller.selectProject(project.project_id);
        this.onStateChange?.();
      });
    }
  }

  private renderEmptyState(): void {
    const message = this.container.createEl("div", {
      text: "No projects are available for this category yet.",
      cls: "command-center-project-list-empty-state",
    });

    message.style.padding = "1rem";
    message.style.fontSize = "1rem";
    message.style.color = "var(--text-muted)";
  }
}
