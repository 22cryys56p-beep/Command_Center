---
type: open-question
phase: 4
status: unresolved — no implementation inference permitted
date: 2026-09-17
relates_to: Project Dashboard (Category 43), Project Workspace (Category 22-28)
---

# Open Question — Purpose/Description Ownership and Source

## The question

Where do the `Purpose` and `Description` project concepts authoritatively live, and what is their read path?

## Evidence trail

- **P4-R308** (Category 22–28, `KEEP-Foundation`) — "Core descriptive fields include Purpose, Description, and Focus."
- **P4-R318** (Category 22–28, `KEEP-Phase4`) — "Purpose, Description, and Focus should be directly accessible from the primary workspace."
- **P4-R580** (Category 43, `KEEP-Phase4`) — "Dashboard must distinguish Purpose, Description, and Focus."
- **Phase 3 Architecture Record, Section B** — the canonical `ProjectRecord` ("closed after ACP-001, ACP-002, ACP-003") contains exactly: `project_id`, `name`, `status`, `focus`, `milestone`, `progress`, `next_action`, `blockers`, `last_updated`, `repo_reference`. No `purpose` or `description` field exists.
- **Phase 3 Architecture Record, Section B, "Metadata layer vs. document body"** — the document-body content Workspace owns is explicitly and specifically named: *"Vision, Roadmap detail, Architecture notes, AI Context, Reference material, Development logs, Milestones, Kanban/work tracking."* Neither `Purpose` nor `Description` appears in this named list.
- **Phase 3 Architecture Record, Dashboard (WP5) "Forbidden" list** — *"architecture documents, decision logs, research notes, development logs, AI Context, reference materials — all document-body content, reserved for Workspace."* Neither `Purpose` nor `Description` appears in this list either.
- The current `src/data/project-record.ts` implementation matches Phase 3 Section B exactly, confirming no drift between the frozen record and the live code.

## Why this is a genuine gap, not an implementation detail

Phase 4 (P4-R308/R318/R580) establishes Purpose and Description as real, required, authoritative project concepts. Phase 3's canonical `ProjectRecord` does not contain them. Phase 3's own named document-body taxonomy does not identify them as document-body content either. Both of Phase 3's relevant lists are specific and named, not general catch-alls — so their absence from both is not resolvable by inference from either list.

Therefore their authoritative ownership and source are currently unresolved.

## What is NOT permitted until this is resolved

- Do not add `purpose`/`description` fields to `ProjectRecord`.
- Do not assign them to Workspace document-body content by inference.
- Do not create a second persistence or read path for them.
- Do not silently resolve this in the course of implementing Dashboard or Workspace — surface it explicitly instead.

## When this becomes live

This becomes a real design question the moment Project Dashboard or Project Workspace implementation actually reaches the requirement to display Purpose and/or Description. At that point it likely needs a small ACP — not a redesign, just an explicit decision on where these two fields live and how they're read — resolved through the normal architecture-change process, not inferred by whoever happens to be implementing Dashboard at the time.
