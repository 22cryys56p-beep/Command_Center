import { describe, it, expect } from "vitest";
import {
  CATEGORY_ORDER,
  getCategorySiblings,
  getOrderedProjectIdsForCategory,
  getProjectSiblings,
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
