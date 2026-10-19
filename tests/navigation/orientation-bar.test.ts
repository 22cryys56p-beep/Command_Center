import { describe, it, expect } from "vitest";
import { OrientationBarComponent } from "../../src/navigation/orientation-bar";
import { NavigationController } from "../../src/navigation/navigation-controller";
import type { ProjectRecord } from "../../src/data/project-record";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
  public disabled = false;
  public tagName: string;

  constructor(tagName = "div", text = "") {
    this.tagName = tagName;
    this.textContent = text;
  }

  empty(): void {
    this.children = [];
    this.textContent = "";
  }

  addClass(className: string): void {
    this.classList.push(className);
  }

  createEl(tagName: string, options?: { text?: string; cls?: string }): FakeElement {
    const element = new FakeElement(tagName, options?.text ?? "");
    if (options?.cls) element.addClass(options.cls);
    this.children.push(element);
    return element;
  }

  addEventListener(): void {}

  setText(text: string): void {
    this.textContent = text;
  }
}

function build() {
  const container = new FakeElement();
  const controller = new NavigationController((): readonly ProjectRecord[] => []);
  new OrientationBarComponent(container as unknown as HTMLElement, controller, () => {}).render();
  return container;
}

describe("OrientationBarComponent layout", () => {
  it("keeps the specified order in one row: <<, label, >>, Up, Top", () => {
    const container = build();
    expect(container.style.display).toBe("flex");
    expect(container.children.map((c) => c.classList[0])).toEqual([
      "command-center-orientation-previous",
      "command-center-orientation-label",
      "command-center-orientation-next",
      "command-center-orientation-up",
      "command-center-orientation-top",
    ]);
  });

  it("is a compact header strip with a theme-aware divider", () => {
    const container = build();
    expect(container.style.alignItems).toBe("center");
    expect(container.style.width).toBe("100%");
    expect(container.style.borderBottom).toContain("var(--background-modifier-border)");
  });

  it("lets the label take the free space, centered, and truncate instead of overflowing", () => {
    const label = build().children[1];
    expect(label.style.flex).toBe("1 1 auto");
    expect(label.style.minWidth).toBe("0");
    expect(label.style.textAlign).toBe("center");
    expect(label.style.overflow).toBe("hidden");
    expect(label.style.textOverflow).toBe("ellipsis");
    expect(label.style.whiteSpace).toBe("nowrap");
  });
});
