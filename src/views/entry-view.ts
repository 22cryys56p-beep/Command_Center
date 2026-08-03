/**
 * EntryView — Command Center's production landing screen.
 *
 * This view renders the first production experience the user sees when
 * Command Center opens: a single centered button that proceeds into the
 * existing Category-depth experience.
 */

export class EntryView {
  private readonly container: HTMLElement;
  private readonly onProceed: () => void;

  constructor(container: HTMLElement, onProceed: () => void) {
    this.container = container;
    this.onProceed = onProceed;
  }

  render(): void {
    this.container.empty();
    this.container.addClass("command-center-entry-view");
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.width = "100%";
    this.container.style.height = "100%";

    const button = this.container.createEl("button", {
      text: "Command Center",
      cls: "command-center-entry-button",
    });

    button.type = "button";
    button.style.padding = "0.75rem 1.25rem";
    button.style.fontSize = "1rem";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      this.onProceed();
    });
  }
}
