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

function build(records: readonly ProjectRecord[] = []) {
  const container = new FakeElement();
  const controller = new NavigationController((): readonly ProjectRecord[] => records);
  const resolveProjectName = (projectId: string): string | null =>
    records.find((record) => record.project_id === projectId)?.name ?? null;
  const bar = new OrientationBarComponent(
    container as unknown as HTMLElement,
    controller,
    () => {},
    resolveProjectName
  );
  bar.render();
  return { container, controller, bar };
}

function labelOf(container: FakeElement): string {
  return container.children.find(
    (child) => child.classList[0] === "command-center-orientation-label"
  )!.textContent;
}

describe("OrientationBarComponent layout", () => {
  it("lays the controls out in one row: <<, Up, label, Top, >>", () => {
    const { container } = build();
    expect(container.style.display).toBe("flex");
    expect(container.children.map((c) => c.classList[0])).toEqual([
      "command-center-orientation-previous",
      "command-center-orientation-up",
      "command-center-orientation-label",
      "command-center-orientation-top",
      "command-center-orientation-next",
    ]);
  });

  it("renders all four buttons at the larger size", () => {
    const buttons = build().container.children.filter((c) => c.tagName === "button");
    expect(buttons).toHaveLength(4);
    for (const b of buttons) {
      expect(b.style.padding).toBe("0.55rem 1.1rem");
      expect(b.style.fontSize).toBe("1.05rem");
      expect(b.style.minWidth).toBe("3.25rem");
    }
  });

  it("is a compact header strip with a theme-aware divider", () => {
    const { container } = build();
    expect(container.style.alignItems).toBe("center");
    expect(container.style.width).toBe("100%");
    expect(container.style.borderBottom).toContain("var(--background-modifier-border)");
  });

  it("lets the label take the free space, centered, and truncate instead of overflowing", () => {
    const label = build().container.children.find((c) => c.classList[0] === "command-center-orientation-label")!;
    expect(label.style.flex).toBe("1 1 auto");
    expect(label.style.minWidth).toBe("0");
    expect(label.style.textAlign).toBe("center");
    expect(label.style.overflow).toBe("hidden");
    expect(label.style.textOverflow).toBe("ellipsis");
    expect(label.style.whiteSpace).toBe("nowrap");
  });

  it("uses the resolved ProjectRecord name in a project label", () => {
    const record: ProjectRecord = {
      project_id: "proj-0042",
      name: "Teacher Toolbox",
      purpose: "Purpose",
      description: "Description",
      status: "current",
      focus: "Focus",
      milestone: "Milestone",
      progress: "underway",
      next_action: "Next action",
      blockers: null,
      last_updated: "2026-11-12",
    };
    const { container, controller, bar } = build([record]);
    controller.selectCategory("current");
    controller.selectProject("proj-0042");
    bar.render();
    expect(labelOf(container)).toBe("Command Center: Current: Teacher Toolbox");
  });

  it("retains the project_id when no authoritative project name resolves", () => {
    const { container, controller, bar } = build();
    controller.selectCategory("current");
    controller.selectProject("proj-missing");
    bar.render();
    expect(labelOf(container)).toBe("Command Center: Current: proj-missing");
  });

  it("retains the project_id when the resolver reports the record unresolved (e.g. duplicate)", () => {
    const container = new FakeElement();
    const controller = new NavigationController((): readonly ProjectRecord[] => []);
    const bar = new OrientationBarComponent(
      container as unknown as HTMLElement,
      controller,
      () => {},
      () => null
    );
    controller.selectCategory("current");
    controller.selectProject("proj-dup");
    bar.render();
    expect(labelOf(container)).toBe("Command Center: Current: proj-dup");
  });
});
