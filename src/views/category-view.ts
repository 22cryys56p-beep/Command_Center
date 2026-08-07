/**
 * CategoryView — the first screen in the Category-depth experience.
 *
 * Renders the current category choices from CATEGORY_ORDER and triggers
 * NavigationController.selectCategory(category) when a choice is selected.
 */

import type { NavigationController } from "../navigation/navigation-controller";
import { CATEGORY_ORDER } from "../navigation/orientation";

export class CategoryView {
  private readonly container: HTMLElement;
  private readonly controller: NavigationController;
  private onStateChange: (() => void) | null = null;

  constructor(container: HTMLElement, controller: NavigationController) {
    this.container = container;
    this.controller = controller;
  }

  setOnStateChange(onStateChange: () => void): void {
    this.onStateChange = onStateChange;
  }

  render(): void {
    this.container.empty();
    this.container.addClass("command-center-category-view");
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.gap = "0.75rem";
    this.container.style.padding = "1rem";
    this.container.style.width = "100%";
    this.container.style.height = "100%";

    for (const category of CATEGORY_ORDER) {
      const button = this.container.createEl("button", {
        text: category,
        cls: "command-center-category-button",
      });

      button.type = "button";
      button.style.padding = "0.75rem 1rem";
      button.style.cursor = "pointer";

      button.addEventListener("click", () => {
        this.controller.selectCategory(category);
        this.onStateChange?.();
      });
    }
  }
}
