/**
 * EntryView — Command Center's production landing screen.
 *
 * This view renders the first production experience the user sees when
 * Command Center opens: a single centered button that proceeds into the
 * Gateway root.
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
    // Larger landing button (UI pass 3). Values follow the Studio mockup's
    // Entry button. Size is a presentation choice; adjust here.
    button.style.padding = "4.5rem 3.8rem";
    button.style.fontSize = "clamp(1.8rem, 3.2vw, 2.4rem)";
    button.style.minWidth = "340px";
    button.style.maxWidth = "90%";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      this.onProceed();
    });
  }
}
