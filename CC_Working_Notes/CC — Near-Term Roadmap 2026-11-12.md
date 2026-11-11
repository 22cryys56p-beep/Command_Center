Yes. Based on current `main` at `27ba74f`, I would replace the active roadmap with this:

## Proposed active roadmap

|Order|Work|Completion criterion|
|---|---|---|
|1|Dashboard/Workspace boundary reconciliation|Resolve the documented conflict between older “open Workspace on selection” language and the governing Project List → Dashboard → Workspace model.|
|2|Dashboard deferred decisions|Resolve staleness; define the AI Progress Estimate derivation/input contract only for the work package that will implement it. These can proceed in parallel with step 1.|
|3|Workspace implementation specification|Define the Workspace entry, its strict boundary from Dashboard, and the Dashboard → Workspace action using the resolved architecture.|
|4|Workspace implementation|Implement and test Workspace, including the real Dashboard → Workspace transition. This makes the remaining Workspace → Dashboard `Up` path reachable and closes the last meaningful WP12 verification gap.|
|5|Complete deferred Dashboard capabilities|Add Attention, approved downstream navigation, staleness, and AI Progress Estimate only through individually bounded specifications.|
|6|New Project creation/persistence|Separate write-capable lifecycle work package; do not expand the current read-only provider implicitly.|
|7|Future capability tracks|Ideas, Sources, Threads, Decisions, Tasks, History, Search, integrations, broader AI/agent capability, and older-record compatibility.|

## What is not on the active critical path

Gateway, Project List, the provider, unresolved-record handling, Dashboard core content, and Dashboard → Project List `Up` are implemented. They should not be reopened merely because later work touches adjacent areas.

The orientation-label name wiring is a small, valid implementation follow-up—not an architectural prerequisite. It can be addressed in the next relevant navigation/presentation pass.

## Immediate next step

The most appropriate next step is the **Dashboard/Workspace boundary reconciliation**.

It is the repository’s stated prerequisite to a Workspace specification, and it prevents an implementation team from guessing whether older Matrix “Workspace” language means the modern Project Dashboard, the actual deeper Workspace, or both.

In parallel, a bounded decision can settle Dashboard staleness. AI Progress Estimate derivation should remain separate and should begin only when its implementation work package is being prepared.

This yields a coherent path:

```
Boundary reconciliation
        ↓
Workspace specification
        ↓
Workspace implementation
        ↓
Complete Dashboard + verify WP12 end-to-end
        ↓
New Project and broader capability tracks
```

This is a proposed roadmap, not a new architectural decision.