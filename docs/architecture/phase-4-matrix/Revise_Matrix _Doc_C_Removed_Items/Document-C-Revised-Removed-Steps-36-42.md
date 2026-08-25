# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered:** Categories 36–42

---

### Category 41 — Notifications & Signals

- **REVISE** — "Urgent" as a notification severity label. Reason: "Urgent" must not imply authoritative judgment about the Project's actual condition — a notification can flag that something deserves fast attention without that label being mistaken for CC (or AI) rendering a verdict on the project itself. This keeps notification severity a purely informational/significance signal, consistent with the broader principle that AI/CC observations must not be confused with owner-controlled governance state.

- **REVISE** — Using "Attention" simultaneously as both the operational surface (the persistent area within a Project's "Where Things Stand") and as one of the proposed notification severity levels (Info / Attention / Urgent). Reason: reusing the same term for two different concepts risks exactly the kind of ambiguity the architecture has been careful to avoid elsewhere (compare: Category 15's "Current" naming overlap with the Home Screen button). The severity vocabulary needs revision so "Attention" isn't asked to mean two different things depending on context.

### Category 42 — Search & Discovery

- **REVISE** — The Search model needed an explicit distinction between **CC-indexed AI context** (Thread References, metadata, and content CC has actually stored) and **live search of an external AI provider's complete conversation history** (which CC generally does not have access to). Reason: without this distinction, Search results involving AI threads could imply CC has deeper access to a provider's conversation history than it actually does — a direct application of the Honest Failure principle already established for Disk Search and Storage Provider availability.
