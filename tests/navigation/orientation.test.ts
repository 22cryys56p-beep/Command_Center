import { describe, it, expect } from "vitest";
import {
  CATEGORY_ORDER,
  getCategorySiblings,
  getOrderedProjectIdsForCategory,
  getProjectSiblings,
  resolvePaging,
  resolveUp,
  resolveTop,
  resolveLabel,
  type CurrentObject,
  type Depth,
  type NavigationDestination,
} from "../../src/navigation/orientation";
import type { ProjectRecord } from "../../src/data/project-record";

// --- Fixtures ---------------------------------------------------------------

function record(project_id: string, status: ProjectRecord["status"]): ProjectRecord {
  return {
    project_id,
    name: `Project ${project_id}`,
    status,
    focus: "test fixture",
  };
}

const mixedRecords: ProjectRecord[] = [
  record("proj-b", "current"),
  record("proj-a", "current"),
  record("proj-c", "planned"),
  record("proj-d", "possible"),
  record("proj-e", "current"),
];

// --- getCategorySiblings -----------------------------------------------------

describe("getCategorySiblings", () => {
  it("has no previous sibling at the first category (possible)", () => {
    const result = getCategorySiblings("possible");
    expect(result.previous).toBeNull();
    expect(result.next).toBe("planned");
  });

  it("has both siblings for a middle category (planned)", () => {
    const result = getCategorySiblings("planned");
    expect(result.previous).toBe("possible");
    expect(result.next).toBe("current");
  });

  it("has both siblings for a middle category (current)", () => {
    const result = getCategorySiblings("current");
    expect(result.previous).toBe("planned");
    expect(result.next).toBe("completed");
  });

  it("has no next sibling at the last category (completed)", () => {
    const result = getCategorySiblings("completed");
    expect(result.previous).toBe("current");
    expect(result.next).toBeNull();
  });

  it("does not wrap from the last category back to the first", () => {
    const result = getCategorySiblings("completed");
    expect(result.next).not.toBe(CATEGORY_ORDER[0]);
  });

  it("does not wrap from the first category back to the last", () => {
    const result = getCategorySiblings("possible");
    expect(result.previous).not.toBe(CATEGORY_ORDER[CATEGORY_ORDER.length - 1]);
  });

  it("throws on an unrecognized category rather than silently guessing", () => {
    expect(() =>
      getCategorySiblings("archived" as ProjectRecord["status"])
    ).toThrow();
  });

  it("is stable: repeated calls with the same input produce the same result", () => {
    const first = getCategorySiblings("current");
    const second = getCategorySiblings("current");
    expect(first).toEqual(second);
  });
});

// --- getOrderedProjectIdsForCategory -----------------------------------------

describe("getOrderedProjectIdsForCategory", () => {
  it("returns only project_ids matching the requested category", () => {
    const result = getOrderedProjectIdsForCategory(mixedRecords, "current");
    expect(result).toEqual(["proj-a", "proj-b", "proj-e"]);
  });

  it("excludes records from other categories entirely, not just reorders them", () => {
    const result = getOrderedProjectIdsForCategory(mixedRecords, "current");
    expect(result).not.toContain("proj-c");
    expect(result).not.toContain("proj-d");
  });

  it("returns an empty array for a category with zero matching projects", () => {
    const result = getOrderedProjectIdsForCategory(mixedRecords, "completed");
    expect(result).toEqual([]);
  });

  it("produces a stable order across repeated calls with the same input", () => {
    const first = getOrderedProjectIdsForCategory(mixedRecords, "current");
    const second = getOrderedProjectIdsForCategory(mixedRecords, "current");
    expect(first).toEqual(second);
  });

  it("handles a single-project category without special-casing", () => {
    const result = getOrderedProjectIdsForCategory(mixedRecords, "planned");
    expect(result).toEqual(["proj-c"]);
  });
});

// --- getProjectSiblings -------------------------------------------------------

describe("getProjectSiblings", () => {
  it("has no previous sibling at the first project in the category", () => {
    const result = getProjectSiblings(mixedRecords, "current", "proj-a");
    expect(result.previous).toBeNull();
    expect(result.next).toBe("proj-b");
  });

  it("has both siblings for a middle project in the category", () => {
    const result = getProjectSiblings(mixedRecords, "current", "proj-b");
    expect(result.previous).toBe("proj-a");
    expect(result.next).toBe("proj-e");
  });

  it("has no next sibling at the last project in the category", () => {
    const result = getProjectSiblings(mixedRecords, "current", "proj-e");
    expect(result.previous).toBe("proj-b");
    expect(result.next).toBeNull();
  });

  it("scopes siblings to the active category only, never across categories", () => {
    // proj-c is the only "planned" project; it must never appear as a
    // sibling of a "current" project, even though it exists in the same
    // records array.
    const result = getProjectSiblings(mixedRecords, "current", "proj-e");
    expect(result.previous).not.toBe("proj-c");
    expect(result.next).not.toBe("proj-c");
  });

  it("degrades to both-null when the category has exactly one project (single-project case)", () => {
    const result = getProjectSiblings(mixedRecords, "planned", "proj-c");
    expect(result.previous).toBeNull();
    expect(result.next).toBeNull();
  });

  it("degrades to both-null when the category has zero projects", () => {
    const result = getProjectSiblings(mixedRecords, "completed", "anything");
    expect(result.previous).toBeNull();
    expect(result.next).toBeNull();
  });

  it("returns both-null rather than guessing when currentProjectId is not in the category", () => {
    // proj-d belongs to "possible", not "current" — asking for its
    // siblings within "current" is a data-consistency problem upstream,
    // not something this function should mask by guessing a position.
    const result = getProjectSiblings(mixedRecords, "current", "proj-d");
    expect(result.previous).toBeNull();
    expect(result.next).toBeNull();
  });
});

// --- resolvePaging (Step 2) ---------------------------------------------------

describe("resolvePaging — category current object", () => {
  it("delegates to getCategorySiblings and wraps results as CurrentObject", () => {
    const current: CurrentObject = { kind: "category", category: "planned" };
    const result = resolvePaging(current, mixedRecords);

    expect(result.previous).toEqual({ kind: "category", category: "possible" });
    expect(result.next).toEqual({ kind: "category", category: "current" });
  });

  it("reports a disabled (null) previous at the first category", () => {
    const current: CurrentObject = { kind: "category", category: "possible" };
    const result = resolvePaging(current, mixedRecords);

    expect(result.previous).toBeNull();
    expect(result.next).toEqual({ kind: "category", category: "planned" });
  });

  it("reports a disabled (null) next at the last category", () => {
    const current: CurrentObject = { kind: "category", category: "completed" };
    const result = resolvePaging(current, mixedRecords);

    expect(result.previous).toEqual({ kind: "category", category: "current" });
    expect(result.next).toBeNull();
  });

  it("does not consult records for category-object paging (category order is architectural, not data-derived)", () => {
    const current: CurrentObject = { kind: "category", category: "planned" };
    const withRecords = resolvePaging(current, mixedRecords);
    const withoutRecords = resolvePaging(current, []);
    expect(withRecords).toEqual(withoutRecords);
  });
});

describe("resolvePaging — project current object", () => {
  it("delegates to getProjectSiblings, scoped to the current object's category", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-b",
      category: "current",
    };
    const result = resolvePaging(current, mixedRecords);

    expect(result.previous).toEqual({
      kind: "project",
      project_id: "proj-a",
      category: "current",
    });
    expect(result.next).toEqual({
      kind: "project",
      project_id: "proj-e",
      category: "current",
    });
  });

  it("carries the same category forward on both paging targets", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const result = resolvePaging(current, mixedRecords);
    expect(result.next?.kind).toBe("project");
    if (result.next?.kind === "project") {
      expect(result.next.category).toBe("current");
    }
  });

  it("reports a disabled (null) previous at the first project in the category", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const result = resolvePaging(current, mixedRecords);
    expect(result.previous).toBeNull();
  });

  it("reports a disabled (null) next at the last project in the category", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-e",
      category: "current",
    };
    const result = resolvePaging(current, mixedRecords);
    expect(result.next).toBeNull();
  });

  it("degrades to both-null for a single-project category (today's actual Current state)", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-c",
      category: "planned",
    };
    const result = resolvePaging(current, mixedRecords);
    expect(result.previous).toBeNull();
    expect(result.next).toBeNull();
  });

  it("never returns a paging target from a different category than the current object", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-e",
      category: "current",
    };
    const result = resolvePaging(current, mixedRecords);
    // proj-c belongs to "planned" — must never surface as a "current" sibling.
    expect(result.previous?.kind === "project" && result.previous.project_id).not.toBe(
      "proj-c"
    );
    expect(result.next).toBeNull();
  });
});

describe("resolvePaging — purity and non-mutation", () => {
  it("does not mutate the records array passed in", () => {
    const before = JSON.parse(JSON.stringify(mixedRecords));
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-b",
      category: "current",
    };
    resolvePaging(current, mixedRecords);
    expect(mixedRecords).toEqual(before);
  });

  it("does not mutate the currentObject passed in", () => {
    const current: CurrentObject = { kind: "category", category: "planned" };
    const before = JSON.parse(JSON.stringify(current));
    resolvePaging(current, mixedRecords);
    expect(current).toEqual(before);
  });

  it("is pure: repeated calls with identical input produce identical output", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const first = resolvePaging(current, mixedRecords);
    const second = resolvePaging(current, mixedRecords);
    expect(first).toEqual(second);
  });

  it("returns a plain data object with no transition-performing behavior (no functions on the result)", () => {
    const current: CurrentObject = { kind: "category", category: "planned" };
    const result = resolvePaging(current, mixedRecords);
    expect(typeof result.previous).not.toBe("function");
    expect(typeof result.next).not.toBe("function");
    // Confirms the result is inert data a caller could act on later —
    // resolvePaging itself performs no transition, per the approved scope.
  });
});

// --- resolveUp (Step 3) -------------------------------------------------------

describe("resolveUp — disabled cases", () => {
  it("is disabled at Category Screen depth (category current object)", () => {
    const current: CurrentObject = { kind: "category", category: "current" };
    expect(resolveUp(current, "category")).toBeNull();
  });

  it("is disabled at List depth (category current object)", () => {
    const current: CurrentObject = { kind: "category", category: "current" };
    expect(resolveUp(current, "list")).toBeNull();
  });

  it("is disabled at Dashboard depth (project current object)", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    expect(resolveUp(current, "dashboard")).toBeNull();
  });

  it("is disabled for a category current object even at workspace depth (Up is project-only)", () => {
    // A category object should never legitimately appear at "workspace"
    // depth, but resolveUp must still fail closed (disabled), not guess,
    // if it did.
    const current: CurrentObject = { kind: "category", category: "current" };
    expect(resolveUp(current, "workspace")).toBeNull();
  });
});

describe("resolveUp — enabled case", () => {
  it("is enabled only at Workspace depth for a project current object", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const result = resolveUp(current, "workspace");
    expect(result).not.toBeNull();
  });

  it("returns the same project at Dashboard depth, preserving object identity", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const result = resolveUp(current, "workspace");
    expect(result).toEqual({
      depth: "dashboard",
      object: {
        kind: "project",
        project_id: "proj-a",
        category: "current",
      },
    });
  });

  it("preserves the project's category unchanged in the Up destination", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-c",
      category: "planned",
    };
    const result = resolveUp(current, "workspace");
    expect(result?.depth).toBe("dashboard");
    if (result?.depth === "dashboard") {
      expect(result.object.category).toBe("planned");
      expect(result.object.project_id).toBe("proj-c");
    }
  });
});

describe("resolveUp — purity and non-mutation", () => {
  it("does not mutate the currentObject passed in", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const before = JSON.parse(JSON.stringify(current));
    resolveUp(current, "workspace");
    expect(current).toEqual(before);
  });

  it("is pure: repeated calls with identical input produce identical results", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-a",
      category: "current",
    };
    const first = resolveUp(current, "workspace");
    const second = resolveUp(current, "workspace");
    expect(first).toEqual(second);
  });
});

// --- resolveTop (Step 3) -------------------------------------------------------

describe("resolveTop", () => {
  it("always returns the Category Screen destination", () => {
    const result = resolveTop();
    expect(result).toEqual({ depth: "category" });
  });

  it("`{ depth: \"category\" }` contains no object field", () => {
    const result = resolveTop();
    expect("object" in result).toBe(false);
  });

  it("never returns Entry as a destination (Entry is not a valid Depth value)", () => {
    const result = resolveTop();
    // "entry" is not a member of the Depth union at all — this asserts
    // the actual returned depth is the one legitimate value, not merely
    // that it isn't the string "entry".
    expect(result.depth).toBe("category");
    const validDepths: Depth[] = ["category", "list", "dashboard", "workspace"];
    expect(validDepths).toContain(result.depth);
  });

  it("is pure: repeated calls produce identical results, regardless of any argument", () => {
    const first = resolveTop();
    const second = resolveTop();
    expect(first).toEqual(second);
  });

  it("takes no parameters and its result never varies", () => {
    // resolveTop is defined with zero parameters; this test documents
    // and locks in that the destination cannot be influenced by caller
    // context, consistent with Top's "absolute reset" behavior.
    expect(resolveTop.length).toBe(0);
  });
});

// --- NavigationDestination shape sanity checks ---------------------------------

describe("NavigationDestination — type shape discipline", () => {
  it("a category destination never carries an object field, even structurally", () => {
    const destination: NavigationDestination = { depth: "category" };
    expect(Object.keys(destination)).toEqual(["depth"]);
  });

  it("a dashboard destination (from resolveUp) always carries a project object", () => {
    const current: CurrentObject = {
      kind: "project",
      project_id: "proj-e",
      category: "current",
    };
    const result = resolveUp(current, "workspace");
    expect(result?.depth).toBe("dashboard");
    if (result?.depth === "dashboard") {
      expect(result.object.kind).toBe("project");
    }
  });
});

// --- resolveLabel (Step 4) -----------------------------------------------------

describe("resolveLabel — category and list destinations", () => {
  it("returns the fixed category label for a category destination", () => {
    const destination: NavigationDestination = { depth: "category" };
    expect(resolveLabel(destination)).toBe("Command Center: Projects");
  });

  it("returns the category label including the active category for a list destination", () => {
    const destination: NavigationDestination = {
      depth: "list",
      object: { kind: "category", category: "current" },
    };
    expect(resolveLabel(destination)).toBe("Command Center: current");
  });

  it("ignores projectName if supplied for a category destination", () => {
    const destination: NavigationDestination = { depth: "category" };
    expect(resolveLabel(destination, "Should Be Ignored")).toBe(
      "Command Center: Projects"
    );
  });

  it("ignores projectName if supplied for a list destination", () => {
    const destination: NavigationDestination = {
      depth: "list",
      object: { kind: "category", category: "planned" },
    };
    expect(resolveLabel(destination, "Should Be Ignored")).toBe(
      "Command Center: planned"
    );
  });

  it("does not throw when projectName is omitted for category/list destinations", () => {
    const categoryDest: NavigationDestination = { depth: "category" };
    const listDest: NavigationDestination = {
      depth: "list",
      object: { kind: "category", category: "possible" },
    };
    expect(() => resolveLabel(categoryDest)).not.toThrow();
    expect(() => resolveLabel(listDest)).not.toThrow();
  });
});

describe("resolveLabel — dashboard and workspace destinations", () => {
  it("returns the fully-qualified label for a dashboard destination", () => {
    const destination: NavigationDestination = {
      depth: "dashboard",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    expect(resolveLabel(destination, "Teacher Toolbox")).toBe(
      "Command Center: current: Teacher Toolbox"
    );
  });

  it("returns the fully-qualified label for a workspace destination", () => {
    const destination: NavigationDestination = {
      depth: "workspace",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    expect(resolveLabel(destination, "Teacher Toolbox")).toBe(
      "Command Center: current: Teacher Toolbox"
    );
  });

  it("throws when projectName is omitted for a dashboard destination", () => {
    const destination: NavigationDestination = {
      depth: "dashboard",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    expect(() => resolveLabel(destination)).toThrow();
  });

  it("throws when projectName is omitted for a workspace destination", () => {
    const destination: NavigationDestination = {
      depth: "workspace",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    expect(() => resolveLabel(destination)).toThrow();
  });

  it("does not silently produce a fallback label when projectName is omitted", () => {
    const destination: NavigationDestination = {
      depth: "dashboard",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    // Confirms failure is loud (throws), not a degraded string such as
    // "Command Center: current" with the project segment silently dropped.
    let thrown = false;
    try {
      resolveLabel(destination);
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });
});

describe("resolveLabel — purity and stability", () => {
  it("produces identical output for identical input across repeated calls", () => {
    const destination: NavigationDestination = {
      depth: "workspace",
      object: { kind: "project", project_id: "proj-e", category: "planned" },
    };
    const first = resolveLabel(destination, "Grading Assistant");
    const second = resolveLabel(destination, "Grading Assistant");
    expect(first).toBe(second);
  });

  it("does not mutate the destination passed in", () => {
    const destination: NavigationDestination = {
      depth: "dashboard",
      object: { kind: "project", project_id: "proj-a", category: "current" },
    };
    const before = JSON.parse(JSON.stringify(destination));
    resolveLabel(destination, "Teacher Toolbox");
    expect(destination).toEqual(before);
  });
});
