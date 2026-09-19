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

## Update (2026-09-17) — the two candidate resolution paths are not equally viable

Further inspection found that Phase 3's Dashboard (WP5) "Forbidden" list is categorical, not illustrative: *"architecture documents, decision logs, research notes, development logs, AI Context, reference materials — **all document-body content, reserved for Workspace**."* Dashboard is explicitly forbidden from reading document-body content at all.

P4-R580 simultaneously requires Dashboard to **distinguish** Purpose and Description.

If Purpose/Description were classified as document-body content, these two requirements would directly conflict — Dashboard would be required to display them and forbidden from touching them at the same time. That is not a minor tension; it forecloses that path.

**Consequence:** the only resolution consistent with both requirements is that Purpose and Description belong in the **metadata layer** — i.e., some extension of or addition to `ProjectRecord` — not in Workspace document-body content. The "leave them in the document body" option, considered earlier as a plausible candidate, is not actually architecturally available.

This sharpens, but does not resolve, the open question: it narrows *where* the answer must live, without yet deciding *what* the answer is (a new tiered field? a separate but still-metadata-layer structure? something else within the metadata layer?).

## Process consequence — this needs its own decision, separate from Dashboard's other open items

`P4-R797` and `P4-R798` (missing/invalid record presentation) are Dashboard *presentation* choices — they don't touch `ProjectRecord`'s shape, and can be resolved inside a normal, bounded Dashboard implementation contract with no ACP required.

Purpose/Description ownership is a different category of decision. `ProjectRecord` is explicitly "closed after ACP-001, ACP-002, ACP-003" — the same status that required ACP-009 to retire `completed` and reshape the status enum. Extending or restructuring the metadata layer to accommodate Purpose/Description is therefore very likely its own small ACP, decided on its own terms, not folded into whatever Dashboard implementation contract eventually resolves `R797`/`R798`. The two should not be conflated merely because both currently block the same downstream Dashboard work.

## What is NOT permitted until this is resolved

- Do not add `purpose`/`description` fields to `ProjectRecord`.
- Do not assign them to Workspace document-body content by inference.
- Do not create a second persistence or read path for them.
- Do not silently resolve this in the course of implementing Dashboard or Workspace — surface it explicitly instead.

## When this becomes live

This becomes a real design question the moment Project Dashboard or Project Workspace implementation actually reaches the requirement to display Purpose and/or Description. At that point it likely needs a small ACP — not a redesign, just an explicit decision on where these two fields live and how they're read — resolved through the normal architecture-change process, not inferred by whoever happens to be implementing Dashboard at the time.