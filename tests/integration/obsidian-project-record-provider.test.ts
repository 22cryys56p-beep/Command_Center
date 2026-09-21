import { describe, it, expect, vi } from "vitest";
import { ObsidianProjectRecordProvider } from "../../src/integration/obsidian-project-record-provider";
import type { ProjectRecord } from "../../src/data/project-record";

// --- Simple test doubles ----------------------------------------------------

interface FakeFile {
  path: string;
}

function makeFakeVaultAndCache(
  files: Array<{
    path: string;
    frontmatter?: Record<string, unknown>;
  }>
) {
  const vault = {
    getMarkdownFiles: (): FakeFile[] =>
      files.map((file) => ({ path: file.path })),
  };

  const metadataCache = {
    getFileCache: (file: FakeFile) => {
      const match = files.find((entry) => entry.path === file.path);

      if (!match || match.frontmatter === undefined) {
        return null;
      }

      return {
        frontmatter: match.frontmatter,
      };
    },
  };

  return { vault, metadataCache };
}

function buildProvider(
  files: Array<{
    path: string;
    frontmatter?: Record<string, unknown>;
  }>
) {
  const { vault, metadataCache } = makeFakeVaultAndCache(files);

  return new ObsidianProjectRecordProvider(
    vault as any,
    metadataCache as any
  );
}

const validFrontmatter = {
  project_id: "proj-0001",
  name: "Teacher Toolbox",
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
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: validFrontmatter,
      },
    ]);

    const records = provider.getProjectRecords();

    expect(records).toHaveLength(1);
    expect(records[0].project_id).toBe("proj-0001");
  });

  it("excludes a file with no frontmatter at all", () => {
    const provider = buildProvider([
      {
        path: "README.md",
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("excludes a file whose frontmatter has no project_id", () => {
    const provider = buildProvider([
      {
        path: "Templates/New Project Template.md",
        frontmatter: {
          type: "project",
          status: "planning",
        },
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("does not use folder location to determine candidacy", () => {
    const provider = buildProvider([
      {
        path: "Completed Projects/random-note.md",
        frontmatter: validFrontmatter,
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(1);
  });
});

describe("frontmatter mapping", () => {
  it("maps only the canonical fields, ignoring extras", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          unrelated_field: "should be ignored",
        },
      },
    ]);

    const record = provider.getProjectRecords()[0] as ProjectRecord & {
      unrelated_field?: unknown;
    };

    expect(record.unrelated_field).toBeUndefined();
  });

  it("does not invent a value for a missing optional field", () => {
    const minimalValid = {
      project_id: "proj-0001",
      name: "An Idea",
      status: "possible" as const,
      focus: "Something worth exploring later",
    };

    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: minimalValid,
      },
    ]);

    const record = provider.getProjectRecords()[0];

    expect(record.milestone).toBeUndefined();
  });

  it("preserves an explicit null for blockers", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          blockers: null,
        },
      },
    ]);

    const record = provider.getProjectRecords()[0];

    expect(record.blockers).toBeNull();
  });
});

describe("validation delegation", () => {
  it("excludes a candidate missing required fields", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const provider = buildProvider([
      {
        path: "Active Projects/broken.md",
        frontmatter: {
          project_id: "proj-0002",
        },
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("excludes a candidate with an invalid status value", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          status: "completed",
        },
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
  });

  it("continues loading valid candidates after an invalid one", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const provider = buildProvider([
      {
        path: "Active Projects/valid1.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-0001",
        },
      },
      {
        path: "Active Projects/invalid.md",
        frontmatter: {
          project_id: "proj-0002",
        },
      },
      {
        path: "Active Projects/valid2.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-0003",
        },
      },
    ]);

    const records = provider.getProjectRecords();

    expect(records.map((record) => record.project_id)).toEqual([
      "proj-0001",
      "proj-0003",
    ]);

    warnSpy.mockRestore();
  });
});

describe("duplicate project_id handling", () => {
  it("excludes all candidates sharing a duplicate project_id", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          name: "A",
        },
      },
      {
        path: "Active Projects/B.md",
        frontmatter: {
          ...validFrontmatter,
          name: "B",
        },
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("excludes a valid candidate whose project_id collides with an invalid candidate", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-shared",
        },
      },
      {
        path: "Active Projects/B.md",
        frontmatter: {
          project_id: "proj-shared",
        },
      },
    ]);

    expect(provider.getProjectRecords()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("does not silently pick a winner among duplicates", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          name: "A",
        },
      },
      {
        path: "Active Projects/B.md",
        frontmatter: {
          ...validFrontmatter,
          name: "B",
        },
      },
    ]);

    const records = provider.getProjectRecords();

    expect(records.find((record) => record.name === "A")).toBeUndefined();
    expect(records.find((record) => record.name === "B")).toBeUndefined();
  });

  it("continues loading unrelated valid projects when a duplicate exists elsewhere", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/dup1.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-dup",
        },
      },
      {
        path: "Active Projects/dup2.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-dup",
        },
      },
      {
        path: "Active Projects/unique.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-unique",
        },
      },
    ]);

    const records = provider.getProjectRecords();

    expect(records.map((record) => record.project_id)).toEqual([
      "proj-unique",
    ]);
  });
});

describe("deterministic ordering", () => {
  it("returns records sorted lexicographically by project_id", () => {
    const provider = buildProvider([
      {
        path: "Active Projects/C.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-c",
        },
      },
      {
        path: "Active Projects/A.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-a",
        },
      },
      {
        path: "Active Projects/B.md",
        frontmatter: {
          ...validFrontmatter,
          project_id: "proj-b",
        },
      },
    ]);

    const records = provider.getProjectRecords();

    expect(records.map((record) => record.project_id)).toEqual([
      "proj-a",
      "proj-b",
      "proj-c",
    ]);
  });
});

describe("read-only behavior and freshness", () => {
  it("performs no mutation of the vault/file objects it discovers", () => {
    const { vault, metadataCache } = makeFakeVaultAndCache([
      {
        path: "Active Projects/A.md",
        frontmatter: validFrontmatter,
      },
    ]);

    const modifyingMethods = ["create", "modify", "delete", "rename"];

    for (const method of modifyingMethods) {
      expect((vault as any)[method]).toBeUndefined();
    }

    const provider = new ObsidianProjectRecordProvider(
      vault as any,
      metadataCache as any
    );

    provider.getProjectRecords();
  });

  it("reflects a changed vault state on a later call", () => {
    const files: Array<{
      path: string;
      frontmatter?: Record<string, unknown>;
    }> = [
      {
        path: "Active Projects/A.md",
        frontmatter: validFrontmatter,
      },
    ];

    const { vault, metadataCache } = makeFakeVaultAndCache(files);

    const provider = new ObsidianProjectRecordProvider(
      vault as any,
      metadataCache as any
    );

    expect(provider.getProjectRecords()).toHaveLength(1);

    files.push({
      path: "Active Projects/B.md",
      frontmatter: {
        ...validFrontmatter,
        project_id: "proj-0099",
      },
    });

    expect(provider.getProjectRecords()).toHaveLength(2);
  });
});