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
    this.container.style.height = "100%";

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
      button.style.border = "1px solid #ccc";
      button.style.borderRadius = "6px";
      button.style.background = "white";
      button.style.textAlign = "left";

      const focus = button.createEl("span", {
        text: project.focus,
        cls: "command-center-project-list-focus",
      });
      focus.style.marginTop = "0.5rem";
      focus.style.fontSize = "0.95rem";
      focus.style.color = "#555";

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
    message.style.color = "#555";
  }
}
