/**
 * Project Record data layer.
 *
 * Defines the canonical Project Record shape and deterministic validation
 * rules. This module has no Obsidian dependency.
 */

export type ProjectStatus =
  | "possible"
  | "planned"
  | "current"
  | "ongoing"
  | "archived";

export type ProgressValue =
  | "not_started"
  | "underway"
  | "nearly_done";

export interface ProjectRecord {
  project_id: string;
  name: string;
  status: ProjectStatus;
  focus: string;

  milestone?: string;
  progress?: ProgressValue;
  next_action?: string;
  blockers?: string[] | null;
  last_updated?: string;

  repo_reference?: string;
}

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
  "ongoing",
  "archived",
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
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

export function validateProjectRecord(
  record: Partial<ProjectRecord>
): ValidationResult {
  const issues: ValidationIssue[] = [];

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

  const status = record.status;

  if (
    status === undefined ||
    !VALID_STATUSES.includes(status as ProjectStatus)
  ) {
    return { valid: issues.length === 0, issues };
  }

  const requiresPlannedTier =
    status === "planned" || status === "current";

  const requiresCurrentTier = status === "current";

  if (requiresPlannedTier) {
    if (!isNonEmptyString(record.milestone)) {
      issues.push({ field: "milestone", reason: "missing" });
    }

    if (record.progress === undefined) {
      issues.push({ field: "progress", reason: "missing" });
    } else if (
      !VALID_PROGRESS_VALUES.includes(record.progress as ProgressValue)
    ) {
      issues.push({
        field: "progress",
        reason: "invalid_enum_value",
      });
    }

    if (!isNonEmptyString(record.next_action)) {
      issues.push({ field: "next_action", reason: "missing" });
    }

    if (record.blockers === undefined) {
      issues.push({ field: "blockers", reason: "missing" });
    } else if (
      record.blockers !== null &&
      !Array.isArray(record.blockers)
    ) {
      issues.push({
        field: "blockers",
        reason: "invalid_type",
      });
    }

    if (record.last_updated === undefined) {
      issues.push({ field: "last_updated", reason: "missing" });
    } else if (!isValidIsoTimestamp(record.last_updated)) {
      issues.push({
        field: "last_updated",
        reason: "invalid_timestamp",
      });
    }
  }

  if (requiresCurrentTier) {
    if (!isNonEmptyString(record.repo_reference)) {
      issues.push({
        field: "repo_reference",
        reason: "missing",
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function hasNoBlockers(
  record: Partial<ProjectRecord>
): boolean {
  return record.blockers === null;
}