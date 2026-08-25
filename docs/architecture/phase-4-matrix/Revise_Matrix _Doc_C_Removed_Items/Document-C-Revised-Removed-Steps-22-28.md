# CC Phase 4 Matrix — Document C: Revised / Removed Items, With Rationale

**Scope covered:** Categories 22–28

---

### Category 26 — Repository Integration / Project Sources

- **REVISE** — Original P4-R347–355 ("Repository" as the primary concept, with GitHub-centric wording) was superseded by the broader "Project Sources" model. Reason: Kurt pointed out that authoritative project material can live in iCloud, Google Drive, Dropbox, or other non-code locations, not just Git repositories. The corrected model separates **provider** (GitHub, iCloud, Google Drive, Dropbox, local filesystem, Obsidian, etc.) from **role** (Repository, Vault, Primary Source, Workspace, Documents, Backup, Reference), so "Repository" becomes one possible role a Project Source can have, rather than the universal model every project is assumed to need.

- **Process note (numbering collision, not itself a REVISE/REMOVE item):** IDs P4-R347–355 were reused between the original Repository-centric wording and the later Project Sources revision — the same pattern already flagged for Categories 3, 4, and 20 in earlier chunks. Only the revised, final wording is authoritative and appears in Document A.

### Category 28 — AI Session Handoff & Re-entry

- **REVISE** — "AI Session" as the primary persistent entity. Reason: the audit found this framing too coarse. The corrected model is **AI Participant/Agent → Chat Thread/Agent Activity → Project**, with **persistent Project State** (not any individual AI's session or memory) treated as the primary re-entry mechanism. Chat Threads and Handovers are supporting context and provenance, not the primary record. This correction is reflected throughout Document A's Category 28 entries (P4-R393 onward), which describe Chat Threads and Handovers as distinct, explicit artifacts rather than folding everything into an undifferentiated "AI session" concept.
