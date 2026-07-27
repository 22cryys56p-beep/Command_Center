
---
type: workflow-contract
authority: project-governance
scope: all-development-work
status: active
---

# AI Development Workflow Contract

## Purpose

This project is not only a source-code repository.

The goal is a complete working system inside the target environment.

The AI must never assume that the human operator understands every technical dependency, build step, deployment requirement, or environment constraint. The AI exists specifically to bridge those gaps.

---

## Core Rule: Build the Complete Workflow

When creating software, the AI must consider the entire lifecycle:

1. Source creation
2. Compilation/build process
3. Generated artifacts
4. Deployment location
5. Runtime environment
6. Testing procedure
7. Verification method

A source file alone is not considered a completed deliverable if additional files are required for the software to run.

---

## Workflow Scale Awareness

The AI must match the depth of workflow documentation to the scope of the task without compromising system integrity.

### Architectural and Feature-Level Changes

For new systems, features, integrations, dependencies, environments, or any change affecting build, deployment, or runtime behavior:

The complete 7-step workflow lifecycle must be explicitly documented, followed, and verified.

### Iterative Maintenance Changes

For minor modifications within an already established and verified workflow (e.g., single-line bug fixes, wording corrections, styling adjustments, or minor refactors with no dependency changes):

The AI may use a streamlined response. However, it must still explicitly identify:
* What file changed.
* Where the change belongs.
* Whether generated artifacts are affected.
* How the running system should be verified.

*Note: If a supposedly minor change affects dependencies, build outputs, deployment steps, or runtime behavior, it immediately escalates to a full architectural analysis.*

---

## No Hidden Steps

The AI must not assume:

* The user knows which files are generated automatically.
* The user knows which files must be copied manually.
* The user knows which folders are deployment targets.
* The user knows when a build step is required.
* The user knows that a development environment differs from a production/runtime environment.

If a step is required, it must be explicitly identified.

---

## Deliverable Completeness

Whenever a project requires generated files, the AI must clearly separate:

### Human-Authored Files

Examples:
* `.ts`
* `.md`
* Source assets
* Configuration files

### Generated Files

Examples:
* `.js`
* Compiled bundles
* Generated metadata
* Packaged releases

The AI must explain:
* Who creates each file
* When it is created
* Where it belongs
* How it reaches the runtime environment

---

## Environment Awareness

If a project targets a specific application environment (for example: an Obsidian plugin), the AI must include environment requirements from the beginning.

**Example workflow:**


src/main.ts
↓
build process
↓
main.js
↓
manifest.json
↓
styles.css (if required)
↓
.obsidian/plugins/plugin-folder/
↓
Obsidian runtime test

---

## No Assumption of Technical Knowledge

The AI must behave as a guide and system architect, not merely a code generator.

Before implementation, it must identify:

* What the user must do manually.
* What the AI can prepare.
* What the computer environment must provide.
* What files must exist for success.

---

## Definition of Done

A task is not complete simply because:
* Code compiles.
* Tests pass in the AI environment.
* A commit exists.

A task is complete only when:
* The user can reproduce the result.
* Required files exist.
* Required files are in the correct location.
* The runtime environment can load the result.
* Verification steps are documented.

---

## Failure Prevention

The AI should prefer:

* **Explicit instructions** over implied knowledge.
* **Complete workflows** over partial artifacts.
* **Honest limitations** over silent assumptions.
* **Preparation** over retrofit.

