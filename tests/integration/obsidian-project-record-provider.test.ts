import { describe, it, expect, vi } from "vitest";
import { ObsidianProjectRecordProvider } from "../../src/integration/obsidian-project-record-provider";
import type { ProjectRecord } from "../../src/data/project-record";

// --- Simple test doubles ----------------------------------------------------
// No mocking library, per this project's established test convention
// (tests/data/project-record.test.ts, tests/views/*.test.ts).

interface FakeFile {
  path: string;
}

function makeFakeVaultAndCache(files: Array<{ path: string; frontmatter?: Record<string, unknown> }>) {
  // Reads `files` live on every call — deliberately not snapshotted at
  // setup time, so tests can mutate `files` between provider calls to
  // simulate a changed vault state.
  const vault = {
    getMarkdownFiles: (): FakeFile[] => files.map((f) => ({ path: f.path })),
  };
  const metadataCache = {
    getFileCache: (file: FakeFile) => {
      const match = files.find((f) => f.path === file.path);
      return match && match.frontmatter !== undefined ? { frontmatter: match.frontmatter } : null;
    },
  };

  return { vault, metadataCache };
}

function buildProvider(files: Array<{ path: string; frontmatter?: Record<string, unknown> }>) {
  const { vault, metadataCache } = makeFakeVaultAndCache(files);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ObsidianProjectRecordProvider(vault as any, metadataCache as any);
}

const validFrontmatter = {
  project_id: "proj-0001",
  name: "Teacher Toolbox",
  purpose: "Give teachers back time currently lost to administrative work",
  description: "A modular educational productivity platform",
  status: "current" as const,
  focus: "Reduce administrative time for teachers",
  milestone: "M1 — Foundation",
  progress: "underway" as const,
  next_action: "Finish defining first educator workflow boundaries",
  blockers: null,
  last_updated: "2026-07-22T09:14:00Z",
  repo_reference: "github.com/example-user/teacher-toolbox",
};

describe("candidate discovery", () => {
  it("includes a file whose frontmatter has project_id", () => {
    const provider = buildProvider([{ path: "Active Projects/A.md", frontmatter: validFrontmatter }]);
    const records = provider.getProjectRecords();
    expect(records).toHaveLength(1);
    expect(records[0].project_id).toBe("proj-0001");
  });

  it("excludes a file with no frontmatter at all", () => {
    const provider = buildProvider([{ path: "README.md" }]);
    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("excludes a file whose frontmatter has no project_id (e.g. a template)", () => {
    const provider = buildProvider([
      { path: "Templates/New Project Template.md", frontmatter: { type: "project", status: "planning" } },
    ]);
    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("does not use folder location to determine candidacy", () => {
    const provider = buildProvider([
      { path: "Completed Projects/random-note.md", frontmatter: validFrontmatter },
    ]);
    expect(provider.getProjectRecords()).toHaveLength(1);
  });
});

describe("frontmatter mapping", () => {
  it("maps purpose and description through unchanged (ACP-014)", () => {
    const provider = buildProvider([{ path: "Active Projects/A.md", frontmatter: validFrontmatter }]);
    const record = provider.getProjectRecords()[0];
    expect(record.purpose).toBe(validFrontmatter.purpose);
    expect(record.description).toBe(validFrontmatter.description);
  });

  it("maps only the canonical fields, ignoring extras", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: { ...validFrontmatter, unrelated_field: "should be ignored" },
      },
    ]);
    const record = provider.getProjectRecords()[0] as ProjectRecord & { unrelated_field?: unknown };
    expect(record.unrelated_field).toBeUndefined();
  });

  it("does not invent a value for a missing optional field", () => {
    const minimalValid = {
      project_id: "proj-0001",
      name: "An Idea",
      purpose: "Explore whether this is worth pursuing",
      description: "A rough idea, not yet formalized",
      status: "possible" as const,
      focus: "Something worth exploring later",
    };
    const provider = buildProvider([{ path: "Active Projects/A.md", frontmatter: minimalValid }]);
    const record = provider.getProjectRecords()[0];
    expect(record.milestone).toBeUndefined();
  });

  it("preserves an explicit null for blockers rather than treating it as missing", () => {
    const provider = buildProvider([
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, blockers: null } },
    ]);
    const record = provider.getProjectRecords()[0];
    expect(record.blockers).toBeNull();
  });
});

describe("validation delegation", () => {
  it("excludes a candidate missing a required field and diagnoses it", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const provider = buildProvider([
      { path: "Active Projects/broken.md", frontmatter: { project_id: "proj-0002" } }, // missing name/status/focus
    ]);
    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("excludes a candidate with an invalid status value", () => {
    const provider = buildProvider([
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, status: "completed" } },
    ]);
    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("continues loading valid candidates after an invalid one", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const provider = buildProvider([
      { path: "Active Projects/valid1.md", frontmatter: { ...validFrontmatter, project_id: "proj-0001" } },
      { path: "Active Projects/invalid.md", frontmatter: { project_id: "proj-0002" } },
      { path: "Active Projects/valid2.md", frontmatter: { ...validFrontmatter, project_id: "proj-0003" } },
    ]);
    const records = provider.getProjectRecords();
    expect(records.map((r) => r.project_id)).toEqual(["proj-0001", "proj-0003"]);
    warnSpy.mockRestore();
  });
});

describe("duplicate project_id handling", () => {
  it("excludes all candidates sharing a duplicate project_id", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const provider = buildProvider([
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, name: "A" } },
      { path: "Active Projects/B.md", frontmatter: { ...validFrontmatter, name: "B" } },
    ]);
    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("excludes a valid candidate whose project_id collides with an otherwise-invalid candidate", () => {
    // The edge case duplicate-checking-after-validation would miss: A is
    // fully valid; B shares A's project_id but is invalid for an unrelated
    // reason (missing required fields). Both must be excluded — A must not
    // silently survive just because B happened to be malformed.
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const provider = buildProvider([
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, project_id: "proj-shared" } },
      { path: "Active Projects/B.md", frontmatter: { project_id: "proj-shared" } }, // missing name/status/focus
    ]);
    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("does not silently pick a winner among duplicates", () => {
    const provider = buildProvider([
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, name: "A" } },
      { path: "Active Projects/B.md", frontmatter: { ...validFrontmatter, name: "B" } },
    ]);
    const records = provider.getProjectRecords();
    expect(records.find((r) => r.name === "A")).toBeUndefined();
    expect(records.find((r) => r.name === "B")).toBeUndefined();
  });

  it("continues loading unrelated valid projects when a duplicate exists elsewhere", () => {
    const provider = buildProvider([
      { path: "Active Projects/dup1.md", frontmatter: { ...validFrontmatter, project_id: "proj-dup" } },
      { path: "Active Projects/dup2.md", frontmatter: { ...validFrontmatter, project_id: "proj-dup" } },
      { path: "Active Projects/unique.md", frontmatter: { ...validFrontmatter, project_id: "proj-unique" } },
    ]);
    const records = provider.getProjectRecords();
    expect(records.map((r) => r.project_id)).toEqual(["proj-unique"]);
  });
});

describe("deterministic ordering", () => {
  it("returns records sorted lexicographically by project_id regardless of input order", () => {
    const provider = buildProvider([
      { path: "Active Projects/C.md", frontmatter: { ...validFrontmatter, project_id: "proj-c" } },
      { path: "Active Projects/A.md", frontmatter: { ...validFrontmatter, project_id: "proj-a" } },
      { path: "Active Projects/B.md", frontmatter: { ...validFrontmatter, project_id: "proj-b" } },
    ]);
    const records = provider.getProjectRecords();
    expect(records.map((r) => r.project_id)).toEqual(["proj-a", "proj-b", "proj-c"]);
  });
});

describe("read-only behavior and freshness", () => {
  it("performs no mutation of the vault/file objects it discovers", () => {
    const { vault, metadataCache } = makeFakeVaultAndCache([
      { path: "Active Projects/A.md", frontmatter: validFrontmatter },
    ]);
    const modifyingMethods = ["create", "modify", "delete", "rename"];
    for (const method of modifyingMethods) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((vault as any)[method]).toBeUndefined();
    }
    const provider = new ObsidianProjectRecordProvider(vault as any, metadataCache as any);
    provider.getProjectRecords();
  });

  it("reflects a changed vault state on a later call rather than returning a stored result", () => {
    const files: Array<{ path: string; frontmatter?: Record<string, unknown> }> = [
      { path: "Active Projects/A.md", frontmatter: validFrontmatter },
    ];
    const { vault, metadataCache } = makeFakeVaultAndCache(files);
    const provider = new ObsidianProjectRecordProvider(vault as any, metadataCache as any);

    expect(provider.getProjectRecords()).toHaveLength(1);

    // Mutate the SAME backing store the SAME provider instance reads from.
    // No new provider is constructed here — this is the point of the test.
    files.push({ path: "Active Projects/B.md", frontmatter: { ...validFrontmatter, project_id: "proj-0099" } });

    expect(provider.getProjectRecords()).toHaveLength(2);
  });
});
