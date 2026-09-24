/**
 * ObsidianProjectRecordProvider — the real, host-specific ProjectRecordProvider.
 *
 * Implements the approved WP14 specification
 * (docs/specifications/CC_Phase 4_WP14 Obsidian ProjectRecordProvider Specification.md),
 * governed by ACP-008 and the WP13 composition-root decision (Option B).
 *
 * SCOPE — see the specification for the full boundary. Summarized here:
 * - A Markdown file is a candidate iff its frontmatter contains the
 *   `project_id` key (§4). No folder/path/filename convention is used.
 * - Fields are mapped directly from frontmatter with no invention, no
 *   defaults, no repair (§5).
 * - A duplicate project_id is diagnosed and ALL candidates sharing that id
 *   are excluded, before validation — never a silently-chosen "winner"
 *   (§8). Checking duplicates first means a valid file never survives
 *   merely because its duplicate counterpart happened to fail validation
 *   for an unrelated reason.
 * - Every surviving candidate passes through the existing
 *   validateProjectRecord() (§6). This module never redefines validation.
 * - An invalid candidate is diagnosed and excluded; it never blocks other
 *   valid candidates (§7).
 * - Results are returned sorted lexicographically by project_id, never by
 *   incidental vault/filesystem order (§9).
 * - No Command Center-owned cache: every call re-reads the vault's current
 *   metadata state via Obsidian's own platform read mechanism (§11).
 * - Read-only. No project file is ever created, modified, or written (§12).
 */

import type { Vault, MetadataCache, TFile } from "obsidian";
import { validateProjectRecord, type ProjectRecord } from "../data/project-record";

const CANONICAL_FIELDS = [
  "project_id",
  "name",
  "purpose",
  "description",
  "status",
  "focus",
  "milestone",
  "progress",
  "next_action",
  "blockers",
  "last_updated",
  "repo_reference",
] as const;

interface Candidate {
  readonly file: TFile;
  readonly record: Partial<ProjectRecord>;
}

export class ObsidianProjectRecordProvider {
  constructor(
    private readonly vault: Vault,
    private readonly metadataCache: MetadataCache
  ) {}

  /**
   * The public provider boundary. Matches the existing
   * `ProjectRecordProvider` contract exactly: `() => readonly ProjectRecord[]`.
   * Bind this method (or wrap it in an arrow function) when supplying it
   * to NavigationController/ProjectListView.
   */
  getProjectRecords = (): readonly ProjectRecord[] => {
    const candidates = this.discoverCandidates();
    const deduplicated = this.excludeDuplicateIds(candidates);
    const valid = this.validateCandidates(deduplicated);
    return this.sortByProjectId(valid);
  };

  /** §4 — Candidate discovery: frontmatter contains the project_id key, nothing else. */
  private discoverCandidates(): Candidate[] {
    const candidates: Candidate[] = [];

    for (const file of this.vault.getMarkdownFiles()) {
      const cache = this.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!frontmatter || !Object.prototype.hasOwnProperty.call(frontmatter, "project_id")) {
        continue;
      }

      candidates.push({ file, record: this.mapFrontmatter(frontmatter) });
    }

    return candidates;
  }

  /**
   * §5 — Direct mapping only. No defaults, no inference, no repair.
   * Only the canonical fields are copied; anything else in frontmatter is
   * ignored. Whatever the frontmatter's raw value is (including malformed
   * shapes) is passed through unchanged — validateProjectRecord() decides
   * validity, this method never does.
   */
  private mapFrontmatter(frontmatter: Record<string, unknown>): Partial<ProjectRecord> {
    const record: Record<string, unknown> = {};
    for (const field of CANONICAL_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(frontmatter, field)) {
        record[field] = frontmatter[field];
      }
    }
    return record as Partial<ProjectRecord>;
  }

  /**
   * §8 — Diagnose duplicate project_ids among CANDIDATES (before validation)
   * and exclude every candidate involved, never picking a winner. This
   * runs before validation deliberately: two files claiming the same
   * project_id is itself the problem, regardless of whether one of them
   * happens to also be well-formed. Letting a valid file silently survive
   * because its duplicate counterpart failed validation for an unrelated
   * reason would make that survival depend on an indirect, non-obvious
   * coincidence — exactly the kind of arbitrary resolution this rule
   * exists to prevent.
   */
  private excludeDuplicateIds(candidates: Candidate[]): Candidate[] {
    const byId = new Map<string, Candidate[]>();

    for (const candidate of candidates) {
      const id = String(candidate.record.project_id);
      const existing = byId.get(id);
      if (existing) {
        existing.push(candidate);
      } else {
        byId.set(id, [candidate]);
      }
    }

    const result: Candidate[] = [];
    for (const [id, entries] of byId) {
      if (entries.length > 1) {
        console.warn(
          `Command Center: duplicate project_id "${id}" found in ${entries
            .map((e) => `"${e.file.path}"`)
            .join(", ")} — all excluded.`
        );
        continue;
      }
      result.push(entries[0]);
    }

    return result;
  }

  /** §6/§7 — Validate every surviving candidate; diagnose and exclude failures without blocking others. */
  private validateCandidates(candidates: Candidate[]): ProjectRecord[] {
    const valid: ProjectRecord[] = [];

    for (const candidate of candidates) {
      const result = validateProjectRecord(candidate.record);
      if (result.valid) {
        valid.push(candidate.record as ProjectRecord);
      } else {
        console.warn(
          `Command Center: invalid ProjectRecord in "${candidate.file.path}" — excluded.`,
          result.issues
        );
      }
    }

    return valid;
  }

  /** §9 — Deterministic ordering, independent of any vault/filesystem incidental order. */
  private sortByProjectId(records: ProjectRecord[]): readonly ProjectRecord[] {
    return [...records].sort((a, b) => a.project_id.localeCompare(b.project_id));
  }
}
