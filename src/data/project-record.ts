/**
 * Project Record data layer.
 *
 * Implements: Phase 3 Architecture Record, Section B (Final Data Model).
 * Governing decisions: ACP-001 (status enum extension), ACP-002 (stable
 * identity via project_id), ACP-003 (last_updated scope extended to
 * `planned` and `current`).
 *
 * This module defines the record shape and its validation rules only.
 * It does not read or write files — that is the responsibility of a later
 * work package (the Obsidian Vault/FileManager integration layer), kept
 * separate here so the validation logic itself is testable without any
 * dependency on the Obsidian runtime.
 */

/** Final status enum per ACP-001. `archived` was raised but left undecided
 *  in Phase 3 — not included here; adding it later requires a new ACP. */
export type ProjectStatus = "possible" | "planned" | "current" | "completed";

/**
 * Controlled vocabulary for `progress`, per Phase 3 Section B: "a small
 * ordered set, not free text." Phase 3 left the exact values unspecified
 * beyond the illustrative example in WP5/WP1 discussion. Recording that
 * choice here as an implementation detail, not a reopening of Phase 3 —
 * if this vocabulary needs to change, that's a data-layer implementation
 * decision, not an architectural one, since Phase 3 only required that
 * *some* fixed, deterministic set be used.
 */
export type ProgressValue = "not_started" | "underway" | "nearly_done";

/**
 * The canonical Project Record, exactly as closed in Phase 3 Section B
 * (post ACP-003). Field presence is enforced by validateProjectRecord(),
 * not by the type system alone — see note on tiered requirements below.
 */
export interface ProjectRecord {
  // Required for all projects, every status. System-maintained field
  // (project_id) is still typed as required string; assignment is the
  // responsibility of a record-creation function, not this module.
  project_id: string;
  name: string;
  status: ProjectStatus;
  focus: string;

  // Required once status = "planned" (carried into "current"), per ACP-003.
  milestone?: string;
  progress?: ProgressValue;
  next_action?: string;
  // Nullable per Phase 3: null is a distinct, valid, intentional state
  // ("no blockers"), not "not yet filled in." Absent (undefined) is only
  // valid before the `planned` tier; present-and-null is valid at or after it.
  blockers?: string[] | null;
  // System-maintained. ISO 8601 timestamp. Required from `planned` onward
  // per ACP-003; never required at `possible`.
  last_updated?: string;

  // Required once status = "current".
  repo_reference?: string;
}

/**
 * A single validation failure. `field` identifies which Project Record
 * field is implicated; `reason` is a short, stable machine-checkable code
 * (not free text) so callers — including a future WP5 Dashboard renderer —
 * can distinguish failure kinds without parsing prose.
 */
export interface ValidationIssue {
  field: keyof ProjectRecord | "status";
  reason:
    | "missing"
    | "empty"
    | "invalid_enum_value"
    | "invalid_type"
    | "invalid_timestamp";
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const VALID_STATUSES: ProjectStatus[] = [
  "possible",
  "planned",
  "current",
  "completed",
];

const VALID_PROGRESS_VALUES: ProgressValue[] = [
  "not_started",
  "underway",
  "nearly_done",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

/**
 * Validates a Project Record against Phase 3 Section B's tiered
 * requirements. Does not mutate the input. Returns every issue found,
 * not just the first — a caller (e.g. a future Dashboard "invalid absence"
 * indicator, per WP5) needs the complete set to render distinct markers
 * per field, not just a single failure.
 */
export function validateProjectRecord(
  record: Partial<ProjectRecord>
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // --- Always required, every status ---

  if (!isNonEmptyString(record.project_id)) {
    issues.push({ field: "project_id", reason: "missing" });
  }

  if (!isNonEmptyString(record.name)) {
    issues.push({ field: "name", reason: "missing" });
  }

  if (record.status === undefined) {
    issues.push({ field: "status", reason: "missing" });
  } else if (!VALID_STATUSES.includes(record.status as ProjectStatus)) {
    issues.push({ field: "status", reason: "invalid_enum_value" });
  }

  if (!isNonEmptyString(record.focus)) {
    issues.push({ field: "focus", reason: "missing" });
  }

  // If status itself is missing or invalid, tier-gated checks below cannot
  // be meaningfully evaluated — stop here rather than guessing a tier.
  const status = record.status;
  if (status === undefined || !VALID_STATUSES.includes(status as ProjectStatus)) {
    return { valid: issues.length === 0, issues };
  }

  const requiresPlannedTier = status === "planned" || status === "current";
  const requiresCurrentTier = status === "current";

  // --- Required once `planned` (carried into `current`), per ACP-003 ---

  if (requiresPlannedTier) {
    if (!isNonEmptyString(record.milestone)) {
      issues.push({ field: "milestone", reason: "missing" });
    }

    if (record.progress === undefined) {
      issues.push({ field: "progress", reason: "missing" });
    } else if (!VALID_PROGRESS_VALUES.includes(record.progress as ProgressValue)) {
      issues.push({ field: "progress", reason: "invalid_enum_value" });
    }

    if (!isNonEmptyString(record.next_action)) {
      issues.push({ field: "next_action", reason: "missing" });
    }

    // blockers: undefined is invalid at this tier (must be present, even
    // if null). null is valid. A non-array, non-null value is invalid.
    if (record.blockers === undefined) {
      issues.push({ field: "blockers", reason: "missing" });
    } else if (
      record.blockers !== null &&
      !Array.isArray(record.blockers)
    ) {
      issues.push({ field: "blockers", reason: "invalid_type" });
    }

    // last_updated: required from `planned` onward per ACP-003.
    if (record.last_updated === undefined) {
      issues.push({ field: "last_updated", reason: "missing" });
    } else if (!isValidIsoTimestamp(record.last_updated)) {
      issues.push({ field: "last_updated", reason: "invalid_timestamp" });
    }
  }

  // --- Required once `current` ---

  if (requiresCurrentTier) {
    if (!isNonEmptyString(record.repo_reference)) {
      issues.push({ field: "repo_reference", reason: "missing" });
    }
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Returns true only if `blockers` is present and explicitly null — the
 * "valid, intentional absence" state per Phase 3 Section B. Distinguishes
 * this from `undefined` (not yet applicable at this tier) and from a
 * non-empty array (blockers exist). Exposed separately because WP5's
 * Dashboard rendering rule ("absence should read as calm, not as a
 * missing field") depends on telling these apart, not just on validity.
 */
export function hasNoBlockers(record: Partial<ProjectRecord>): boolean {
  return record.blockers === null;
}
