# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered so far:** Categories 1–7

---

### Category 3 — Project Identity & Purpose

- **REMOVE** — "Every project must have an eventual product/platform target." Reason: the domain-agnostic model means some projects simply have no eventual product form; forcing one would violate the domain-agnostic principle established across the matrix.

- **Process note (numbering collision, not a REVISE/REMOVE item):** IDs P4-R102–105 were assigned twice in the source material — first to Product Direction fields (current form / eventual form / rationale / identity-independence), then reassigned to the Purpose/Description/Focus distinction after Kurt's input. Both requirement sets are real and retained in Document A, but the ID numbering will need to be corrected during formal specification (e.g., renumber the Purpose/Description/Focus set as new IDs rather than reusing 102–105).

### Category 4 — Operational State

- **REMOVE** — "Flagging automatically makes something a Blocker." Reason: raising a Flag does not establish severity; this contradicts the intake-mechanism model that was later established.

- **REMOVE** — "CC automatically reclassifies Flags/Blockers." Reason: CC preserves and displays project state; it does not independently determine project severity. Reclassification requires human/technical assessment, not automatic system behavior.

- **REVISE (superseded within-session, resolved to final wording in Document A) —** The original P4-R117 ("Kurt is the authority for determining whether something is a Flag or Blocker") was too broad. Kurt raised the concern that he doesn't have the technical background to make that call unassisted — the actual precedent was Claude identifying the Phase 3 flags, not Kurt independently judging their severity. This was revised twice in-session:
  1. First revision split "final project authority" (Kurt) from "technical assessment" (any participant/AI), producing an intermediate P4-R117–121 set.
  2. Second revision (final, reflected in Document A) reframed Flags as an *intake mechanism* — any participant or AI may raise one; raising it does not itself establish Blocker status; Kurt retains authority over what happens to it.

  The intermediate wording is superseded and should not be treated as authoritative — only the final P4-R117–121 set in Document A stands.

### Category 7 — Documents, Files, Source Code & Search

- **REVISE** — "CC does not become authoritative editor of external project artifacts." Original wording was too broad — it could be read as prohibiting CC from editing *any* information, including CC's own project-management data. Corrected wording (now P4-R142 in Document A): CC must not become the authoritative editor of *externally owned* project artifacts specifically; CC may freely maintain and modify information that belongs to CC itself.
