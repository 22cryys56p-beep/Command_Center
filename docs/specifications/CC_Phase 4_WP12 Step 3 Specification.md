---
type: implementation-specification
phase: 4
work_package: WP12
step: 3
status: approved — pending implementation
governs: Up / Top availability and destination logic only
date: 2026-07-24
---

# Phase 4 — WP12 Step 3: Up / Top Availability and Destination Logic — Specification

This document specifies Step 3 only. It does not modify Step 1 or Step 2, which remain implemented and committed (`a4224d6`, `e993ba7`). Where this specification references the frozen Phase 3 Architecture Record, citations are to the actual committed text at `docs/architecture/CC_Phase 3 Architecture Record.md`, not paraphrased from memory.

---

## Purpose

Implement `Up` and `Top` — the two remaining components of the persistent orientation element's five-component set (Section C) not yet built. Step 1 resolved sibling sets; Step 2 resolved paging targets from those siblings. Step 3 resolves the two fixed vertical actions.

---

## What `Up` Means

`Up` moves to the parent depth **within the current object** (Section C: *"`Up` — Parent depth within the current object"*). Per Section C's `Up` behavior note: *"Currently meaningful only at Workspace, where it returns to that same project's Dashboard — preserving object identity, no return to Project List or Category, no dependence on navigation history, no write to any Project Record field."*

## What `Top` Means

`Top` is a single, fixed, absolute destination: *"`Top` — Category Screen — absolute reset"* (Section C). It is explicitly *"distinct from Entry (which is a once-per-session lifecycle event, never a `Top` destination)"* and *"distinct from `Up` (Category is an absolute reset; `Up` is a same-object parent-depth step)"* (Section C, `Top` behavior note).

---

## Depth Representation

**Entry is excluded from `Depth`, confirmed by the frozen text, not assumed:**

- Section A: the orientation element is *"present from Category Screen onward"* — it does not exist at Entry.
- Section C: `Top` is *"distinct from Entry... never a `Top` destination."*

No component of the orientation element ever targets or represents Entry. `Depth` is therefore:

```
"category" | "list" | "dashboard" | "workspace"
```

---

## Object Relationship Each Operates On

- **`Up`** operates on depth within a single object — it asks "what is the parent depth of *this same* project?" It does not consult siblings and does not change which project is active.
- **`Top`** does not operate on the current object at all — it is depth-independent and object-independent by definition.

---

## Architectural Boundary: `CurrentObject` vs. `NavigationDestination`

**This separation is intentional and must not be merged into a single type merely for convenience.**

`CurrentObject` and `NavigationDestination` represent different layers:

**`CurrentObject`:**
- Represents the active project/category **entity**.
- Used for object-based operations such as sibling paging (Steps 1–2).
- Answers: *"what project/category object is active?"*

**`NavigationDestination`:**
- Represents the navigation **location/depth**.
- Used for depth-changing operations such as `Up` and `Top` (Step 3).
- Answers: *"what depth/screen destination should be displayed?"*

This mirrors a distinction already present in the frozen Section C table itself: `Up` is defined as *"parent depth within the current object"* and `Top` as *"Category Screen"* — both depth concepts, neither defined in terms of `CurrentObject`. Steps 1–2 never needed this distinction because paging is depth-invariant (a project pages to another project at the *same* depth); `Up` and `Top` are inherently depth-*changing*, which is precisely why they require a representation Steps 1–2 did not.

Confirmed independently by Section D: the Category Screen's own entry states *"Inputs received: none (entry point of the category tier)"* — Category Screen has no current object until a selection is made. `CurrentObject` intentionally does not represent this object-less state, because it represents active entities, not navigation destinations. `NavigationDestination` exists specifically to represent navigation locations, including the depth-only `{ depth: "category" }` case, where no object has yet been selected.

---

## How Destinations Are Resolved

**Proposed shape** (specification only — not yet implemented):

```
type Depth = "category" | "list" | "dashboard" | "workspace";

type NavigationDestination =
  | { depth: "category" }
  | { depth: "list"; object: Extract<CurrentObject, { kind: "category" }> }
  | { depth: "dashboard"; object: Extract<CurrentObject, { kind: "project" }> }
  | { depth: "workspace"; object: Extract<CurrentObject, { kind: "project" }> };

function resolveUp(
  currentObject: CurrentObject,
  depth: Depth
): NavigationDestination | null;

function resolveTop(): NavigationDestination;
```

> **Note on `{ depth: "category" }`:** this variant intentionally contains no object reference, because the Category Screen is the entry point of the category tier and has no current object until a category is selected (Section D: *"Inputs received: none"*). `{ depth: "category" }` is complete as written — the absence of an object field is not missing data, and no object field should ever be added to this variant. It represents a **navigation destination** (where the user is going), not an **active project/category entity** (what object is currently selected) — the exact distinction this document's Architectural Boundary section establishes between `NavigationDestination` and `CurrentObject`.

- **`resolveUp`** requires both `currentObject` and `depth` as input — depth was not needed by Steps 1–2's resolvers, since sibling paging never changes depth. `Up` is the first operation in this module that genuinely needs to know current depth, not just current object.
- **`resolveTop`** requires no input — the destination never varies. Always resolves to `{ depth: "category" }`, with no object, consistent with Category Screen's confirmed object-less state (Section D).

---

## Disabled States

- **`Up` is disabled** at every depth except Workspace, per Section C's table: Category Screen, Project List Screen, and Project Dashboard all yield disabled. `resolveUp` returns `null` in these cases.
- **`Top` is never disabled** once the orientation element exists at all. `resolveTop` always returns a value, never `null`.

---

## Boundary Cases

- A `CurrentObject` of kind `"category"` at any depth: `Up` disabled unconditionally — categories have no parent depth defined anywhere in Section C.
- A `CurrentObject` of kind `"project"` at Dashboard depth (not Workspace): `Up` disabled — Dashboard is not treated as having a shallower depth within the same object.
- Depth values outside the defined set: out of scope. This resolver assumes a valid `Depth` is always supplied; it does not validate depth values, consistent with Steps 1–2's precedent of trusting well-formed input and failing loudly only on genuinely inconsistent data, not on out-of-scope defensive coding.

---

## What Is Intentionally Excluded

Rendering, UI components, Obsidian integration, visual styling, screen implementation, center label generation. No actual navigation transition is performed — consistent with Steps 1–2, this remains a pure resolver returning destinations, never performing moves. No mutation of any input.

---

## Files (for implementation, once approved)

- `src/navigation/orientation.ts` (extended again)
- `tests/navigation/orientation.test.ts` (extended again)

No new files.

---

## ACP Issues

None. Section C, Section D, and ACP-007 together fully specify this behavior; the `CurrentObject`/`NavigationDestination` separation is a specification-level correction that brings the implementation into closer alignment with the frozen text's own wording, not a deviation from it.

---

Specification revised and approved. No source code modified. No Master Implementation Index changes made. Holding for approval before implementation.
