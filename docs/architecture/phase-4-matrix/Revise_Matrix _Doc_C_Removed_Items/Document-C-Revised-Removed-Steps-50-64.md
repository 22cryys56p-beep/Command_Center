# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered:** Categories 50–64

---

### Category 51 — Core Object Model

- **Caution, not REVISE/REMOVE:** The audit explicitly flagged that the long list of proposed core object types (P4-R659) "should not automatically become a frozen implementation schema." This is a scope caveat on how the item is used going forward, not a correction to the item itself — the separation-of-concepts principle is architectural and sound; only the exact inventory of object types remains subject to change. Retained in Document A with this caveat noted inline.

### Category 64 — The Project List

- **Carry-forward flag, not itself a REVISE/REMOVE item:** Category 64's source material lists example Project States including "Paused" and "Completed" as if they were established values. Per the Category 49 correction (documented in the prior chunk's Document C), these are **not** established architectural states — `Completed` was explicitly rejected in Category 1, and no formal `Paused` state was ever adopted (per the Category 65 drift-session correction: such circumstances belong in Notes, not new status values). Category 64's own architectural point — that Project State and Project Visibility should be modeled separately — remains sound and is retained in Document A. Only the specific example values inherited from the rejected taxonomy are excluded; they are not restated here as their own REMOVE entries since they were already addressed comprehensively in the Categories 43–49 chunk's Document C.

---

No other REVISE or REMOVE items were identified in Categories 50–63. These resolved entirely into KEEP, DEFER, or (for Category 55's P4-R698) OPEN — see Document D.
