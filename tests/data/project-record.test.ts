import { describe, it, expect } from "vitest";
import {
  validateProjectRecord,
  hasNoBlockers,
  type ProjectRecord,
} from "../../src/data/project-record";

// --- Fixtures -------------------------------------------------------------

const minimalPossible: ProjectRecord = {
  project_id: "proj-0012",
  name: "Grading Assistant",
  status: "possible",
  focus: "An idea for automating first-pass rubric scoring",
};

const validPlanned: ProjectRecord = {
  project_id: "proj-0007",
  name: "Teacher Toolbox",
  status: "planned",
  focus: "Practical tools that reduce administrative time for teachers",
  milestone: "M1 — Foundation",
  progress: "underway",
  next_action: "Finish defining first educator workflow boundaries",
  blockers: null,
  last_updated: "2026-07-22T09:14:00Z",
};

const validCurrent: ProjectRecord = {
  ...validPlanned,
  status: "current",
  repo_reference: "github.com/example-user/teacher-toolbox",
};

// --- Always-required fields ------------------------------------------------

describe("always-required fields", () => {
  it("accepts a minimal valid possible-status record", () => {
    const result = validateProjectRecord(minimalPossible);
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("flags a missing project_id", () => {
    const { project_id, ...rest } = minimalPossible;
    const result = validateProjectRecord(rest);
    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual({
      field: "project_id",
      reason: "missing",
    });
  });

  it("flags an empty (whitespace-only) name", () => {
    const result = validateProjectRecord({ ...minimalPossible, name: "   " });
    expect(result.issues).toContainEqual({ field: "name", reason: "missing" });
  });

  it("flags a missing status", () => {
    const { status, ...rest } = minimalPossible;
    const result = validateProjectRecord(rest);
    expect(result.issues).toContainEqual({ field: "status", reason: "missing" });
  });

  it("flags an invalid status enum value", () => {
    const result = validateProjectRecord({
      ...minimalPossible,
      status: "archived" as ProjectRecord["status"],
    });
    expect(result.issues).toContainEqual({
      field: "status",
      reason: "invalid_enum_value",
    });
  });

  it("accepts each of the four valid status values with appropriate tier fields", () => {
    expect(validateProjectRecord(minimalPossible).valid).toBe(true);
    expect(validateProjectRecord(validPlanned).valid).toBe(true);
    expect(validateProjectRecord(validCurrent).valid).toBe(true);
    expect(
      validateProjectRecord({ ...minimalPossible, status: "completed" }).valid
    ).toBe(true);
  });

  it("flags a missing focus", () => {
    const { focus, ...rest } = minimalPossible;
    const result = validateProjectRecord(rest);
    expect(result.issues).toContainEqual({ field: "focus", reason: "missing" });
  });

  it("does not evaluate tier-gated fields when status itself is invalid", () => {
    const result = validateProjectRecord({
      project_id: "x",
      name: "x",
      status: "not-a-real-status" as ProjectRecord["status"],
      focus: "x",
    });
    expect(result.issues).toEqual([
      { field: "status", reason: "invalid_enum_value" },
    ]);
  });
});

// --- Planned-tier fields (carried into current), per ACP-003 --------------

describe("planned-tier fields", () => {
  it("does not require planned-tier fields at possible status", () => {
    const result = validateProjectRecord(minimalPossible);
    expect(result.valid).toBe(true);
  });

  it("requires milestone, progress, next_action, blockers, last_updated at planned", () => {
    const bare = {
      project_id: "proj-0099",
      name: "Bare Project",
      status: "planned" as const,
      focus: "Just started",
    };
    const result = validateProjectRecord(bare);
    expect(result.valid).toBe(false);
    const fields = result.issues.map((i) => i.field).sort();
    expect(fields).toEqual(
      ["blockers", "last_updated", "milestone", "next_action", "progress"].sort()
    );
  });

  it("accepts a fully valid planned record", () => {
    expect(validateProjectRecord(validPlanned).valid).toBe(true);
  });

  it("rejects an invalid progress enum value", () => {
    const result = validateProjectRecord({
      ...validPlanned,
      progress: "almost there" as ProjectRecord["progress"],
    });
    expect(result.issues).toContainEqual({
      field: "progress",
      reason: "invalid_enum_value",
    });
  });

  it("treats blockers: null as valid (intentional absence)", () => {
    const result = validateProjectRecord({ ...validPlanned, blockers: null });
    expect(result.valid).toBe(true);
  });

  it("treats blockers: undefined at the planned tier as invalid (missing, not absent)", () => {
    const { blockers, ...rest } = validPlanned;
    const result = validateProjectRecord(rest);
    expect(result.issues).toContainEqual({ field: "blockers", reason: "missing" });
  });

  it("rejects a non-array, non-null blockers value", () => {
    const result = validateProjectRecord({
      ...validPlanned,
      blockers: "one blocker" as unknown as string[],
    });
    expect(result.issues).toContainEqual({
      field: "blockers",
      reason: "invalid_type",
    });
  });

  it("accepts a populated blockers array", () => {
    const result = validateProjectRecord({
      ...validPlanned,
      blockers: ["Waiting on stakeholder sign-off"],
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an invalid last_updated timestamp", () => {
    const result = validateProjectRecord({
      ...validPlanned,
      last_updated: "not-a-date",
    });
    expect(result.issues).toContainEqual({
      field: "last_updated",
      reason: "invalid_timestamp",
    });
  });

  it("requires last_updated at planned, per ACP-003 (not just current)", () => {
    const { last_updated, ...rest } = validPlanned;
    const result = validateProjectRecord(rest);
    expect(result.issues).toContainEqual({
      field: "last_updated",
      reason: "missing",
    });
  });
});

// --- Current-tier fields ----------------------------------------------------

describe("current-tier fields", () => {
  it("does not require repo_reference at planned status", () => {
    const result = validateProjectRecord(validPlanned);
    expect(result.valid).toBe(true);
  });

  it("requires repo_reference at current status", () => {
    const { repo_reference, ...rest } = validCurrent;
    const result = validateProjectRecord(rest);
    expect(result.issues).toContainEqual({
      field: "repo_reference",
      reason: "missing",
    });
  });

  it("accepts a fully valid current record", () => {
    expect(validateProjectRecord(validCurrent).valid).toBe(true);
  });

  it("still requires all planned-tier fields at current status", () => {
    const bareCurrent = {
      project_id: "proj-0055",
      name: "Bare Current",
      status: "current" as const,
      focus: "Implementation underway",
      repo_reference: "github.com/example/bare",
    };
    const result = validateProjectRecord(bareCurrent);
    const fields = result.issues.map((i) => i.field).sort();
    expect(fields).toEqual(
      ["blockers", "last_updated", "milestone", "next_action", "progress"].sort()
    );
  });
});

// --- hasNoBlockers helper ---------------------------------------------------

describe("hasNoBlockers", () => {
  it("returns true when blockers is explicitly null", () => {
    expect(hasNoBlockers({ ...validPlanned, blockers: null })).toBe(true);
  });

  it("returns false when blockers is undefined (not yet applicable)", () => {
    const { blockers, ...rest } = validPlanned;
    expect(hasNoBlockers(rest)).toBe(false);
  });

  it("returns false when blockers is a populated array", () => {
    expect(
      hasNoBlockers({ ...validPlanned, blockers: ["something"] })
    ).toBe(false);
  });

  it("returns false when blockers is an empty array (distinct from null)", () => {
    expect(hasNoBlockers({ ...validPlanned, blockers: [] })).toBe(false);
  });
});
