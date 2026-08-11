import { describe, it, expect, vi } from "vitest";
import { ProjectListView } from "../../src/views/project-list-view";
import type { NavigationController } from "../../src/navigation/navigation-controller";
import type { ProjectRecord } from "../../src/data/project-record";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
  public listeners: Record<string, Array<() => void>> = {};
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
    if (options?.cls) {
      element.addClass(options.cls);
    }
    this.children.push(element);
    return element;
  }

  addEventListener(type: string, handler: () => void): void {
    this.listeners[type] ??= [];
    this.listeners[type].push(handler);
  }

  dispatchEvent(type: string): void {
    for (const handler of this.listeners[type] ?? []) {
      handler();
    }
  }

  setText(text: string): void {
    this.textContent = text;
  }
}

describe("ProjectListView", () => {
  it("renders empty state when no projects exist for the active category", () => {
    const container = new FakeElement();
    const controller = {
      getState: vi.fn().mockReturnValue({
        object: { kind: "category", category: "current" },
        depth: "list",
      }),
      selectProject: vi.fn(),
    } as unknown as NavigationController;
    const records: ProjectRecord[] = [];
    const view = new ProjectListView(container as unknown as HTMLElement, controller, () => records);
    view.setOnStateChange(vi.fn());

    view.render();

    expect(container.children.length).toBe(1);
    expect(container.children[0].textContent).toContain("No projects are available");
  });

  it("renders project summaries and selects a project on click", () => {
    const container = new FakeElement();
    const controller = {
      getState: vi.fn().mockReturnValue({
        object: { kind: "category", category: "current" },
        depth: "list",
      }),
      selectProject: vi.fn(),
    } as unknown as NavigationController;
    const records: ProjectRecord[] = [
      {
        project_id: "proj-1",
        name: "Project One",
        status: "current",
        focus: "Focus one",
      },
    ];
    const onStateChange = vi.fn();
    const view = new ProjectListView(container as unknown as HTMLElement, controller, () => records);
    view.setOnStateChange(onStateChange);

    view.render();

    const buttons = container.children.filter((child) => child.tagName === "button");
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain("Project One");

    buttons[0].dispatchEvent("click");
    expect(controller.selectProject).toHaveBeenCalledWith("proj-1");
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it("does not render when depth is not list", () => {
    const container = new FakeElement();
    const controller = {
      getState: vi.fn().mockReturnValue({
        object: null,
        depth: "category",
      }),
      selectProject: vi.fn(),
    } as unknown as NavigationController;
    const records: ProjectRecord[] = [];
    const view = new ProjectListView(container as unknown as HTMLElement, controller, () => records);
    view.setOnStateChange(vi.fn());

    view.render();

    expect(container.children.length).toBe(0);
    expect(container.style.display).toBe("none");
  });
});
