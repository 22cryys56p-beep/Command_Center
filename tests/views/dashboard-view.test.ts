import { describe, it, expect, vi } from "vitest";
import { DashboardView } from "../../src/views/dashboard-view";
import type { NavigationController } from "../../src/navigation/navigation-controller";
import type { ResolutionResult } from "../../src/integration/obsidian-project-record-provider";
import type { ProjectRecord } from "../../src/data/project-record";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
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
}

function allText(el: FakeElement): string {
  return [el.textContent, ...el.children.map(allText)].join(" ");
}

function allClasses(el: FakeElement): string[] {
  return [...el.classList, ...el.children.flatMap(allClasses)];
}

function headingOf(el: FakeElement): string {
  const find = (node: FakeElement): string | null => {
    if (node.tagName === "h2") return node.textContent;
    for (const child of node.children) {
      const found = find(child);
      if (found !== null) return found;
    }
    return null;
  };
  return find(el) ?? "";
}

const dashboardState = {
  object: { kind: "project", project_id: "proj-0001", category: "current" },
  depth: "dashboard",
};

function buildController(state: unknown) {
  return {
    getState: vi.fn().mockReturnValue(state),
    selectCategory: vi.fn(),
    selectProject: vi.fn(),
    pageNext: vi.fn(),
    pagePrevious: vi.fn(),
    goUp: vi.fn(),
    goTop: vi.fn(),
  };
}

function renderWith(result: ResolutionResult, state: unknown = dashboardState) {
  const container = new FakeElement();
  const controller = buildController(state);
  const resolve = vi.fn().mockReturnValue(result);
  const view = new DashboardView(
    container as unknown as HTMLElement,
    controller as unknown as NavigationController,
    resolve
  );
  view.render();
  return { container, controller, resolve };
}

const missing: ResolutionResult = { condition: "missing" };
const invalid: ResolutionResult = {
  condition: "invalid",
  candidatePath: "Active Projects/broken.md",
  issues: [
    { field: "name", reason: "missing" },
    { field: "focus", reason: "empty" },
  ],
};
const duplicate: ResolutionResult = {
  condition: "duplicate",
  paths: ["Active Projects/A.md", "Active Projects/B.md"],
};

describe("DashboardView (WP15 unresolved-state presentation)", () => {
  it("missing — renders the requested project_id", () => {
    const { container } = renderWith(missing);
    expect(allText(container)).toContain("proj-0001");
  });

  it("invalid — renders the project_id, candidate path, and every issue", () => {
    const { container } = renderWith(invalid);
    const text = allText(container);
    expect(text).toContain("proj-0001");
    expect(text).toContain("Active Projects/broken.md");
    expect(text).toContain("name: missing");
    expect(text).toContain("focus: empty");
  });

  it("duplicate — renders the project_id and every colliding path", () => {
    const { container } = renderWith(duplicate);
    const text = allText(container);
    expect(text).toContain("proj-0001");
    expect(text).toContain("Active Projects/A.md");
    expect(text).toContain("Active Projects/B.md");
  });

  it("the three unresolved conditions are visibly distinguishable", () => {
    const m = renderWith(missing).container;
    const i = renderWith(invalid).container;
    const d = renderWith(duplicate).container;

    const headings = [headingOf(m), headingOf(i), headingOf(d)];
    expect(new Set(headings).size).toBe(3);
    expect(headings.every((h) => h.length > 0)).toBe(true);

    const classes = [allClasses(m), allClasses(i), allClasses(d)].map((c) => c.join(" "));
    expect(new Set(classes).size).toBe(3);
  });

  it("stays hidden and empty when not at dashboard depth with a project object", () => {
    const resolve = vi.fn();
    const states = [
      { object: null, depth: "gateway" },
      { object: { kind: "category", category: "current" }, depth: "list" },
      { object: dashboardState.object, depth: "workspace" },
    ];
    for (const state of states) {
      const container = new FakeElement();
      container.createEl("p", { text: "stale" });
      const view = new DashboardView(
        container as unknown as HTMLElement,
        buildController(state) as unknown as NavigationController,
        resolve
      );
      view.render();
      expect(container.children).toHaveLength(0);
      expect(container.style.display).toBe("none");
    }
    expect(resolve).not.toHaveBeenCalled();
  });

  it("rendering never mutates navigation state or calls any controller action", () => {
    for (const result of [missing, invalid, duplicate]) {
      const { controller } = renderWith(result);
      expect(controller.selectCategory).not.toHaveBeenCalled();
      expect(controller.selectProject).not.toHaveBeenCalled();
      expect(controller.pageNext).not.toHaveBeenCalled();
      expect(controller.pagePrevious).not.toHaveBeenCalled();
      expect(controller.goUp).not.toHaveBeenCalled();
      expect(controller.goTop).not.toHaveBeenCalled();
    }
  });

  it("resolves afresh on every render — no remembered result", () => {
    const container = new FakeElement();
    const controller = buildController(dashboardState);
    const resolve = vi
      .fn()
      .mockReturnValueOnce(missing)
      .mockReturnValueOnce(duplicate);
    const view = new DashboardView(
      container as unknown as HTMLElement,
      controller as unknown as NavigationController,
      resolve
    );

    view.render();
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(allClasses(container)).toContain("command-center-dashboard-missing");

    view.render();
    expect(resolve).toHaveBeenCalledTimes(2);
    expect(resolve).toHaveBeenLastCalledWith("proj-0001");
    expect(allClasses(container)).toContain("command-center-dashboard-duplicate");
    expect(allClasses(container)).not.toContain("command-center-dashboard-missing");
  });

  it("resolved — shows only the deferred placeholder, not Dashboard content", () => {
    const record: ProjectRecord = {
      project_id: "proj-0001",
      name: "Should Not Be Shown",
      purpose: "p",
      description: "d",
      status: "current",
      focus: "f",
    };
    const { container } = renderWith({ condition: "resolved", record });
    const text = allText(container);
    expect(text).toContain("Dashboard content pending.");
    expect(text).not.toContain("Should Not Be Shown");
  });
});
