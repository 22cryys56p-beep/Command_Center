import { describe, it, expect } from "vitest";
import {
  NavigationController,
  type ProjectRecordProvider,
} from "../../src/navigation/navigation-controller";
import type { ProjectRecord } from "../../src/data/project-record";

// --- Fixtures (mirrors the style used in orientation.test.ts) --------------

function record(project_id: string, status: ProjectRecord["status"]): ProjectRecord {
  return {
    project_id,
    name: `Project ${project_id}`,
    purpose: "test fixture",
    description: "test fixture",
    status,
    focus: "test fixture",
  };
}

const mixedRecords: ProjectRecord[] = [
  record("proj-b", "current"),
  record("proj-a", "current"),
  record("proj-c", "planned"),
  record("proj-e", "current"),
];

function makeController(records: readonly ProjectRecord[] = mixedRecords): NavigationController {
  const provider: ProjectRecordProvider = () => records;
  return new NavigationController(provider);
}

// --- Initial state -----------------------------------------------------------

describe("NavigationController — initial state", () => {
  it("starts with no object and depth 'gateway'", () => {
    const controller = makeController();
    expect(controller.getState()).toEqual({ object: null, depth: "gateway" });
  });
});

// --- selectCategory ------------------------------------------------------------

describe("NavigationController — selectCategory", () => {
  it("produces a category object at list depth", () => {
    const controller = makeController();
    controller.selectCategory("current");
    expect(controller.getState()).toEqual({
      object: { kind: "category", category: "current" },
      depth: "list",
    });
  });

  it("can be called again to switch categories, overwriting prior state", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectCategory("planned");
    expect(controller.getState()).toEqual({
      object: { kind: "category", category: "planned" },
      depth: "list",
    });
  });
});

// --- selectProject ------------------------------------------------------------

describe("NavigationController — selectProject", () => {
  it("produces a project object at dashboard depth, deriving category from current state", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    expect(controller.getState()).toEqual({
      object: { kind: "project", project_id: "proj-a", category: "current" },
      depth: "dashboard",
    });
  });

  it("throws when called with no current object (null)", () => {
    const controller = makeController();
    expect(() => controller.selectProject("proj-a")).toThrow();
  });

  it("throws when called while the current object is already a project", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    // state.object is now a project — calling selectProject again should throw.
    expect(() => controller.selectProject("proj-b")).toThrow();
  });

  it("does not perform any ProjectRecord lookup to determine category (uses current state only)", () => {
    // proj-z does not exist in mixedRecords at all — if selectProject
    // performed a lookup, this would fail or behave unexpectedly. It
    // must succeed purely from current state, per the approved contract.
    const controller = makeController();
    controller.selectCategory("planned");
    expect(() => controller.selectProject("proj-z")).not.toThrow();
    expect(controller.getState()).toEqual({
      object: { kind: "project", project_id: "proj-z", category: "planned" },
      depth: "dashboard",
    });
  });
});

// --- pageNext / pagePrevious ---------------------------------------------------

describe("NavigationController — pageNext/pagePrevious", () => {
  it("no-ops when state.object is null (initial state)", () => {
    const controller = makeController();
    const before = controller.getState();
    controller.pageNext();
    expect(controller.getState()).toEqual(before);
  });

  it("no-ops pagePrevious when state.object is null", () => {
    const controller = makeController();
    const before = controller.getState();
    controller.pagePrevious();
    expect(controller.getState()).toEqual(before);
  });

  it("no-ops when state.object is null after goTop", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.goTop();
    const before = controller.getState();
    controller.pageNext();
    expect(controller.getState()).toEqual(before);
  });

  it("does not page to a category sibling", () => {
    const controller = makeController();
    controller.selectCategory("planned");
    const before = controller.getState();
    controller.pageNext();
    expect(controller.getState()).toEqual(before);
  });

  it("pages to the previous project sibling within the active category", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-b");
    controller.pagePrevious();
    expect(controller.getState().object).toEqual({
      kind: "project",
      project_id: "proj-a",
      category: "current",
    });
    expect(controller.getState().depth).toBe("dashboard"); // depth unchanged
  });

  it("no-ops (state unchanged) when there is no next sibling", () => {
    const controller = makeController();
    controller.selectCategory("current"); // last category, no next
    const before = controller.getState();
    controller.pageNext();
    expect(controller.getState()).toEqual(before);
  });
});

// --- goUp -----------------------------------------------------------------------

describe("NavigationController — goUp", () => {
  it("throws when state.object is null", () => {
    const controller = makeController();
    expect(() => controller.goUp()).toThrow();
  });

  it("no-ops when disabled (category object)", () => {
    const controller = makeController();
    controller.selectCategory("current");
    const before = controller.getState();
    controller.goUp();
    expect(controller.getState()).toEqual(before);
  });

  it("moves from a project's dashboard to the Project List of its category (ACP-017)", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.goUp();
    expect(controller.getState()).toEqual({
      object: { kind: "category", category: "current" },
      depth: "list",
    });
  });

  it("returns to the list of whichever category the project was opened from", () => {
    const controller = makeController();
    controller.selectCategory("planned");
    controller.selectProject("proj-c");
    controller.goUp();
    expect(controller.getState()).toEqual({
      object: { kind: "category", category: "planned" },
      depth: "list",
    });
  });

  it("is disabled again at the Project List; Top is the way back to the Gateway", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.goUp();
    const atList = controller.getState();
    controller.goUp();
    expect(controller.getState()).toEqual(atList);
    controller.goTop();
    expect(controller.getState()).toEqual({ object: null, depth: "gateway" });
  });

  it("allows opening a project again from the list after going up", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.goUp();
    controller.selectProject("proj-b");
    expect(controller.getState()).toEqual({
      object: { kind: "project", project_id: "proj-b", category: "current" },
      depth: "dashboard",
    });
  });

  it("leaves sibling paging unchanged: after paging, Up still returns to the same list", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.pageNext();
    expect(controller.getState().object?.kind).toBe("project");
    expect(controller.getState().depth).toBe("dashboard");
    controller.goUp();
    expect(controller.getState()).toEqual({
      object: { kind: "category", category: "current" },
      depth: "list",
    });
  });

  it("selectProject reaches dashboard depth (workspace depth is not reachable through any controller action yet)", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    // No action produces "workspace" depth yet, so goUp's Workspace to
    // Dashboard step is not exercised through the controller; that rule
    // is covered by the resolveUp unit tests. This test only confirms
    // the depth reachable today.
    expect(controller.getState().depth).toBe("dashboard");
  });
});

// --- goTop -----------------------------------------------------------------------

describe("NavigationController — goTop", () => {
  it("resets to no object, depth 'gateway', from any prior state", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.goTop();
    expect(controller.getState()).toEqual({ object: null, depth: "gateway" });
  });

  it("never throws, regardless of current state", () => {
    const controller = makeController();
    expect(() => controller.goTop()).not.toThrow(); // from initial state
    controller.selectCategory("planned");
    expect(() => controller.goTop()).not.toThrow(); // from list depth
  });
});

// --- purity / non-mutation of injected records --------------------------------

describe("NavigationController — non-mutation of injected records", () => {
  it("does not mutate the records array returned by the provider", () => {
    const records = [...mixedRecords];
    const before = JSON.parse(JSON.stringify(records));
    const controller = makeController(records);
    controller.selectCategory("current");
    controller.pageNext();
    controller.pagePrevious();
    expect(records).toEqual(before);
  });
});

// --- getAvailability (Slice 4) ---------------------------------------------------

describe("NavigationController — getAvailability", () => {
  it("reports all false when state.object is null (initial state)", () => {
    const controller = makeController();
    expect(controller.getAvailability()).toEqual({
      canPagePrevious: false,
      canPageNext: false,
      canGoUp: false,
    });
  });

  it("never throws when state.object is null, unlike goUp()", () => {
    const controller = makeController();
    expect(() => controller.getAvailability()).not.toThrow();
  });

  it("reports both paging directions disabled for a category object", () => {
    const controller = makeController();
    controller.selectCategory("planned");
    const availability = controller.getAvailability();
    expect(availability.canPagePrevious).toBe(false);
    expect(availability.canPageNext).toBe(false);
  });

  it("reports canPageNext false for a category object", () => {
    const controller = makeController();
    controller.selectCategory("current");
    expect(controller.getAvailability().canPageNext).toBe(false);
  });

  it("reports canPagePrevious false for a category object", () => {
    const controller = makeController();
    controller.selectCategory("possible");
    expect(controller.getAvailability().canPagePrevious).toBe(false);
  });

  it("reports canGoUp false for a category object (Up is project-only)", () => {
    const controller = makeController();
    controller.selectCategory("current");
    expect(controller.getAvailability().canGoUp).toBe(false);
  });

  it("reports canGoUp true for a project object at dashboard depth (Up returns to the Project List)", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    expect(controller.getAvailability().canGoUp).toBe(true);
  });

  it("reports canGoUp false at the Project List after going up", () => {
    const controller = makeController();
    controller.selectCategory("current");
    controller.selectProject("proj-a");
    controller.goUp();
    expect(controller.getAvailability().canGoUp).toBe(false);
  });

  it("does not mutate state when called", () => {
    const controller = makeController();
    controller.selectCategory("current");
    const before = controller.getState();
    controller.getAvailability();
    expect(controller.getState()).toEqual(before);
  });

  it("is pure: repeated calls with unchanged state produce identical results", () => {
    const controller = makeController();
    controller.selectCategory("current");
    const first = controller.getAvailability();
    const second = controller.getAvailability();
    expect(first).toEqual(second);
  });

  it("reports canPagePrevious/canPageNext correctly for a middle project sibling", () => {
    const controller = makeController();
    controller.selectCategory("current"); // proj-a, proj-b, proj-e in current
    controller.selectProject("proj-b");
    const availability = controller.getAvailability();
    expect(availability.canPagePrevious).toBe(true);
    expect(availability.canPageNext).toBe(true);
  });
});
