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
    expect(text).toContain("name is missing; it is required for every project.");
    expect(text).toContain("focus is present but empty; it is required for every project.");
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

describe("DashboardView invalid wording (WP16 §3)", () => {
  type Reason = "missing" | "empty" | "invalid_enum_value" | "invalid_type" | "invalid_timestamp";
  const REASONS: Reason[] = ["missing", "empty", "invalid_enum_value", "invalid_type", "invalid_timestamp"];
  const FIELDS = [
    "project_id", "name", "purpose", "description", "status", "focus",
    "milestone", "progress", "next_action", "blockers", "last_updated", "repo_reference",
  ] as const;

  function invalidWith(issues: Array<{ field: (typeof FIELDS)[number]; reason: Reason }>, id = "proj-0001", category = "current"): string {
    const state = { object: { kind: "project", project_id: id, category }, depth: "dashboard" };
    const { container } = renderWith({ condition: "invalid", candidatePath: "Active Projects/x.md", issues }, state);
    return allText(container);
  }

  it("11 — absence and malformation are worded differently for the same field", () => {
    const missingText = invalidWith([{ field: "milestone", reason: "missing" }]);
    const emptyText = invalidWith([{ field: "milestone", reason: "empty" }]);
    const malformedText = invalidWith([{ field: "milestone", reason: "invalid_type" }]);
    expect(missingText).toContain("milestone is missing");
    expect(emptyText).toContain("milestone is present but empty");
    expect(malformedText).toContain("milestone is present but has the wrong type");
    expect(new Set([missingText, emptyText, malformedText]).size).toBe(3);
    // the three malformed reasons are all distinct from one another too
    const a = invalidWith([{ field: "status", reason: "invalid_enum_value" }]);
    const b = invalidWith([{ field: "status", reason: "invalid_type" }]);
    const c = invalidWith([{ field: "status", reason: "invalid_timestamp" }]);
    expect(new Set([a, b, c]).size).toBe(3);
  });

  it("12 — a missing field names its requirement from the field-to-tier map", () => {
    expect(invalidWith([{ field: "milestone", reason: "missing" }])).toContain("required for planned and current projects");
    const repo = invalidWith([{ field: "repo_reference", reason: "missing" }]);
    expect(repo).toContain("required for current projects");
    expect(repo).not.toContain("planned");
    expect(invalidWith([{ field: "name", reason: "missing" }])).toContain("required for every project");
  });

  it("13 — universal-field issues never state or guess a tier, whatever category the project was reached from", () => {
    // The view receives no record status. The navigation category is the only
    // status-like context it can see, so this test varies that category and
    // requires identical output for every one. This proves the wording is
    // independent of the navigation category; it does not construct or validate
    // an actual possible-status ProjectRecord.
    const CATEGORIES = ["possible", "planned", "current", "ongoing", "archived"];
    const cases = [
      [{ field: "status", reason: "missing" }],
      [{ field: "status", reason: "invalid_enum_value" }],
      [{ field: "purpose", reason: "missing" }], // the issue list a possible-status record would produce
    ] as Array<Array<{ field: (typeof FIELDS)[number]; reason: Reason }>>;
    for (const issues of cases) {
      const baseline = invalidWith(issues, "proj-0001", "current");
      expect(baseline).not.toContain("planned");
      expect(baseline).not.toContain("current projects");
      for (const category of CATEGORIES) {
        expect(invalidWith(issues, "proj-0001", category)).toBe(baseline);
      }
    }
    const possible = invalidWith([{ field: "purpose", reason: "missing" }], "proj-0001", "possible");
    expect(possible).toContain("required for every project");
    expect(possible).not.toContain("planned");
    expect(possible).not.toContain("current projects");
    expect(invalidWith([{ field: "status", reason: "missing" }])).toContain("required for every project");
  });

  it("14 — wording is a function of field and reason only, never a command, never an action claim", () => {
    const lines: string[] = [];
    for (const field of FIELDS) {
      for (const reason of REASONS) {
        const text = invalidWith([{ field, reason }]);
        const line = text.split("\n").join(" ");
        lines.push(line);
        // wording does not depend on the project id
        expect(invalidWith([{ field, reason }], "proj-9999").replace("proj-9999", "proj-0001")).toBe(text);
      }
    }
    const imperative = /(^|[.;]\s+)(add|set|fix|update|change|create|remove|enter|provide|correct|rename|choose)\b/i;
    const actionClaim = /(has been|was|were) (added|updated|fixed|set|changed|created|corrected)|\b(fixed|we |please)\b/i;
    for (const line of lines) {
      const issueLine = line.slice(line.indexOf("Active Projects/x.md") + "Active Projects/x.md".length);
      expect(imperative.test(issueLine)).toBe(false);
      expect(actionClaim.test(issueLine)).toBe(false);
    }
  });

  it("15 — a field outside the tier map gets no requirement clause and no guessed tier", () => {
    const text = invalidWith([{ field: "project_id", reason: "missing" }]);
    expect(text).toContain("project_id is missing.");
    expect(text).not.toContain("required for");
  });
});
