# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered:** Categories 8–14

---

### Category 13 — AI Access & Governance

- **REVISE** — Terminology throughout the matrix: "Kurt remains the final authority..." / "Kurt controls..." was replaced with **"The Project Owner remains the final authority over project governance and significant project decisions."**

  Reason: Kurt is the Project Owner of the Command Center project specifically, but the finished Command Center application is intended to be general-purpose — usable by anyone managing their own projects. Hard-coding "Kurt" into the governing architecture would incorrectly imply the finished system only works for one named person. This correction applies retroactively to any earlier matrix item that used "Kurt" in a way meant to describe the *general* governance model (e.g., P4-R172 in Category 10) rather than something specific to the current Command Center development project. Where "Kurt" refers specifically to the current CC-development context (Kurt as today's Project Owner), the original wording remains accurate and unchanged.

### Category 14 — Command Center as Its Own Project

- **REMOVE** — P4-R218: "CC should eventually be capable of managing its own project information using its own standard mechanisms."

  Reason: Its intent is already captured more strongly by P4-R211–213, which establish self-hosting as a present-tense architectural requirement, not a deferred future capability. Treating self-management as something CC "should eventually" do — rather than a test the architecture must already pass — weakens a requirement that should be binding now.
