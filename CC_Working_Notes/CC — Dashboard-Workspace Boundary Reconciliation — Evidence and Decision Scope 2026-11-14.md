---
type: working-note
status: Conflict 1 ruled by Kurt 2026-11-15 (Option 1A, Interpret), extended to the exit statements R156, R162, R326; Conflict 3 ruled by Kurt 2026-11-16 (Option 3A with 3C); Conflicts 2 and 4 still await rulings; Conflicts 1 and 3 have been annotated; no ACP drafted; evidence corrected 2026-11-14 after GPT's review
date: 2026-11-14
authority: Kurt (decisions); this note is not authoritative
baseline: Command_Center main at 281052c
tracked_in: Master Implementation Index, Outstanding Items — "Dashboard/Workspace requirement reconciliation"
---

# Command Center — Dashboard/Workspace Boundary Reconciliation: Evidence and Decision Scope

## 1. Purpose and limits

The Master Implementation Index records that older Matrix requirements phrase project access in terms of a "Project Workspace" that predates the Dashboard/Workspace split, and that this "must be settled before the Workspace specification." The scope note of 2026-10-09 (§6) names four questions it must not settle by implication.

This note collects the evidence for those four conflicts, keeps them distinct, and lists the options that could resolve each. It does not choose among them.

**This note does not:** annotate any requirement, draft an ACP, change code, or specify the Workspace. Those follow only after Kurt rules on each conflict. Rulings are recorded in §12; the sections before it are the evidence as it stood when the rulings were requested and are not rewritten after a ruling. Two small Master Index corrections (the detached ACP-017 table row; the WP16 entry that still says "two decisions remain open") are intended for the same eventual documentation pass but are unrelated to these rulings.

**Revision (2026-11-14).** Corrected after GPT's review, each point checked against the repository first: R321 is a Workspace requirement, not evidence of Dashboard content (§6.3); R591 does not list Handovers (§6.3); the Dashboard/Workspace overlap is narrowed to exactly what WP16 specifies (§5.2); Option 4B is restated so the Workspace is not left without an estimate (§7.4); Documents B, C and D are now read (§2; see the table row for the one truncation that had to be re-read); G12 is now checked against the code (§3). A second pass the same day: Option 2A is split so the reinterpretation of R150 is labeled as such (§5.4); Attention (R582) is no longer listed among Workspace-named items (§5.2); Option 3A states that it does not satisfy R587's literal wording (§6.4). A third pass the same day: the WP6 read statement is quoted exactly and shown to support three readings instead of being stated as a prohibition (note on G4); Option 2C no longer defers whether R322/R323 remain part of the Workspace contract; Option 3C no longer defers the 3A/3B choice. A fourth pass: Option 2C acknowledges that moving R150 to the Dashboard needs the same ruling as 2A(ii), and records the ACP-015 §4 presentation constraint on what it leaves to the Workspace specification. A sixth pass: Option 4C now states that it changes the sequence in §11 and carries the R783 question into a later decision, and Option 2C calls R150, R151 and R318 "primary-view statements" because R150's wording combines identity and operational state. A fifth pass: Option 2C separates the two grounds for the Workspace's "Where Things Stand" (R322 on its own, R323 via ACP-015 §4) and states that the content the requirements name is not optional for the specification.

**Reading convention.** *Evidence* is what a repository document says, quoted or cited. *Inconsistency* is where two cited statements cannot both be applied literally. *Options* are candidate resolutions. Anything under Options is interpretation, not fact.

## 2. Sources read (all on `main` at 281052c)

| Source | Parts read |
|---|---|
| Phase 3 Architecture Record | §A (overview), §C (navigation, as annotated by ACP-017), §D (Project Dashboard WP5; Project Workspace Entry Point WP6) |
| UI Architecture Specification v1.0 | §1 Screen Hierarchy, §2 Navigation Model, §3 Persistent vs. Dynamic UI |
| Matrix Document A | Category 8 and 9 (Steps 8–14); Category 24 (Steps 22–28); Categories 43 and 44 (Steps 43–49); Categories 50 and 63 (Steps 50–64) |
| Matrix Documents B, C, D | all 24 files (File Index §1, item 4). First pass printed every file but truncated 32 lines longer than 330 characters (the longest is 921); a second pass read the truncated remainder of each of those 32 lines. Nothing in either pass bears on the four conflicts beyond §2.1. |
| WP16 Dashboard Core-Content Specification | §2 (resolved presentation); heading structure |
| Source code (`src/`) | searched only, to check where the navigation depth `"workspace"` is referenced and which controller methods exist; not read in full |
| ACP-015 | §2.5, §4 |
| CC_Working_Notes | Dashboard Core-Content Specification Scope 2026-10-09 (§3, §6) |
| Master Index | Outstanding Items; WP16 entry |

**Not read for this note:** the rest of the WP16 specification (outside §2), the WP12 specification, Matrix categories other than those listed, and the source code beyond the search noted above.

### 2.1 What Documents B, C and D record (read in full)

- **None of the requirements in this note appears in Documents B, C or D.** None of P4-R149–R151, R156, R161, R162, R316–R318, R321–R323, R326, R580, R581, R587, R589–R591, R655, R656, R774–R776, R779, R783, R784 or R802 is recorded there as deferred, removed or open.
- **Document B, Category 63:** defers "Detailed Workspace implementations for different Project types," the full "Edit Using" mechanism and sophisticated scratch-space behavior. This is consistent with leaving Workspace internals to a later specification; it does not bear on the four conflicts.
- **Document B, Category 28:** P4-R404 ("Users should be able to navigate directly from CC to an associated thread where the provider permits it") is DEFER. This is relevant to the "Threads" part of R587 (§6).
- **Document D, Category 8:** open items on the visual arrangement of workspace sections, the representation of the ecosystem, the folder map, and the exact reference-model fields. They concern layout and field structure, not the four conflicts.
- **Document C, Category 41:** REVISE on using "Attention" both as the operational surface within "Where Things Stand" and as a notification severity level. It touches R582 (Attention), which WP16 deferred; it is not one of the four conflicts.
- **Document C, Category 28:** the handover model (persistent Project State primary; threads and handovers supporting) is relevant to where Handovers should be surfaced (§6.3), but states no placement.

## 3. The governing model: what the documents explicitly establish

These statements are the fixed points the four conflicts are measured against. Each is quoted or closely paraphrased from the named source.

| # | Statement | Source | Tier |
|---|---|---|---|
| G1 | Screen hierarchy: Entry → (Category/Gateway) → Project List → Project Dashboard → Project Workspace. "Every step down is optional except reaching the Dashboard — the architecture must never force a user through Workspace just to check status." | Phase 3 §A; UI Spec §1 | frozen |
| G2 | Dashboard answers "What is the state of this one project?" May display the metadata-layer field set tiered by status. **Forbidden:** architecture documents, decision logs, research notes, development logs, AI Context, reference materials. | Phase 3 §D (WP5) | frozen |
| G3 | Dashboard's downward transition to Workspace "is the single, uniform action defined in WP6." | Phase 3 §D (WP5) | frozen |
| G4 | Workspace (WP6, headed "Project Workspace Entry Point"): "Single question: Where do I actually work on this project?" May display/access Vision, Roadmap detail, Architecture notes, AI Context, Reference material, Development logs, Milestones, Kanban or equivalent. **Inputs received:** "the active `project_id` only, from Dashboard." **Read/write:** "reads `project_id` only from WP1; entry itself never writes to any WP1 field, under any circumstance." (See the note on G4 below the table.) | Phase 3 §D (WP6) | frozen |
| G5 | WP6 forbids "duplicating any of the above content into Category, Project List, or Dashboard; the Dashboard must not become a navigation hub offering multiple Workspace-section entry points." | Phase 3 §D (WP6) | frozen |
| G6 | `Up` from Workspace returns to the same project's Dashboard (ACP-007); `Up` from Dashboard returns to the originating Project List (ACP-017). | Phase 3 §C and annotation | accepted ACPs |
| G7 | R655: "Project Dashboard is the primary project-level orientation surface." R656: "Project Workspace provides deeper operational access without overloading the Dashboard." | Cat. 50 | KEEP-Foundation |
| G8 | R774–R776: Dashboard and Workspace have distinct cognitive purposes; Dashboard is "primarily an orientation/re-entry surface"; Workspace is "primarily an execution/work surface." R779: dense operational resources belong "primarily in Workspace rather than Dashboard." | Cat. 63 | KEEP-Foundation |
| G9 | R589: "Each Project should provide a detailed Workspace accessible from its Dashboard." R590: Workspace gives "deeper access to project resources without overloading the Dashboard." | Cat. 44 | KEEP-Phase4 |
| G10 | R784: "Navigation between Dashboard and Workspace should be lightweight and reversible." | Cat. 63 | KEEP-Foundation |
| G11 | ACP-015 §2.5: "The repository contains no documented rule establishing that one KEEP tier automatically overrides the other. This ACP therefore does not establish such a precedence rule." | ACP-015 | accepted ACP |
| G12 | Implemented behavior: Project List → Dashboard (WP13, WP15, WP16); the Dashboard-to-Workspace action (R589) is deferred by WP16 §2.7, and the Master Index records that no controller action reaches Workspace depth. A search of `src/` on 281052c found no reference to the depth `"workspace"` in `navigation-controller.ts`; it appears only in the `Depth` type, label resolution and `Up` resolution in `orientation.ts` and in the label call in `orientation-bar.ts`. The controller's state-changing methods are `selectCategory`, `selectProject`, `pageNext`, `pagePrevious`, `goUp`, `goTop`. | Master Index; WP16 §2.7; code search (not a full code read) | documented, spot-checked |

**Note on G4 — how its read statement can be taken.** The text does not settle what "reads `project_id` only from WP1" limits. Three readings are available, and this note does not choose among them.

1. *Field reading.* The Workspace reads only the `project_id` field. Support: Phase 3 phrases the other screens' reads the same way, by the fields read ("reads `status` (aggregated) from WP1" for Category; "reads `name`/`focus` …" for Project List; "reads the full metadata layer for one record" for Dashboard), so "`project_id` only" would contrast with the Dashboard's "full metadata layer."
2. *Source reading.* The Workspace obtains the project's identity from WP1 and from nowhere else. This reading does not limit which other Project Record fields a Workspace section may present.
3. *Scope reading.* The bullet belongs to the section headed "Entry Point," and its second clause ("entry itself never writes …") concerns the entry, so the limit may bound the entry action rather than the Workspace's content. Against this, the Implementation Boundary summary says WP3–WP6 define "the responsibilities, information boundaries, and read/write permissions of all four screens."

Whether a Workspace "Where Things Stand" drawing on other Project Record fields (R322/R323) requires amending WP6 therefore depends on which reading governs. Under reading 1 it would; under readings 2 and 3 it has not been shown to.

**Evidence note on G11.** The same unresolved question applies throughout this note: where a KEEP-Phase4 requirement and a KEEP-Foundation requirement or a frozen Phase 3 statement differ, nothing in the repository says which prevails. Rulings are therefore needed per conflict rather than derivable from tiers.

## 4. Conflict 1 — Does selecting a project open the Workspace or the Dashboard?

### 4.1 Evidence

| Requirement | Text | Location | Tier |
|---|---|---|---|
| P4-R149 | "Selecting a project from a status/category view opens a dedicated Project Workspace" | Cat. 8 | KEEP-Phase4 |
| P4-R161 | "Selecting a project opens its Project Workspace" | Cat. 9 | KEEP-Phase4 |
| P4-R316 | "Selecting a project must open a dedicated Project Workspace for that project" | Cat. 24 | KEEP-Phase4 |
| (unnumbered) | "A selected project opens as a dedicated Project Workspace" | Cat. 8, first bullet | KEEP-Foundation |

Against G1, G3, G4 (Workspace input comes "from Dashboard"), G7, G9 and G12.

### 4.2 Inconsistency

Read literally, the four statements say selection leads to the Workspace. The frozen record, two Foundation requirements (R655, R774–R776) and the implemented flow say selection leads to the Dashboard and the Workspace is reached from it. A user cannot both arrive at the Workspace on selection and "never be forced through Workspace just to check status" unless selection skips the Dashboard, which G4 (Workspace input only from Dashboard) excludes.

The unnumbered Foundation-tier bullet is part of the same statement and is not covered by any of the three numbered requirements; any ruling needs to say whether it is included.

### 4.3 Related exit statements (not in the original list; see §9)

| Requirement | Text | Location |
|---|---|---|
| P4-R156 | "Closing a Project Workspace returns the user to the previous project-selection context" | Cat. 8 |
| P4-R162 | "Leaving a Project Workspace returns the user to the relevant project-selection context" | Cat. 9 |
| P4-R326 | "Closing a Project Workspace should return the user to the view from which the project was opened" | Cat. 24 |

Against G6 (`Up` from Workspace goes to the Dashboard). R326 is satisfied by `Up` if the Workspace is entered from the Dashboard. R156 and R162 name the "project-selection context," which is the Project List.

### 4.4 Options

These are candidate resolutions, not statements made by the quoted requirements. 1A is a reading of what the words "opens a Project Workspace" are taken to mean; the requirements themselves do not say that. 1B changes the requirement text (with the original preserved), whereas 1A leaves the text unchanged and annotates it.

- **1A. Interpret.** Record that "opens a Project Workspace" in R149/R161/R316 and the Category 8 bullet means "opens the project's primary view, the Dashboard, from which the Workspace is reached (R589)." The original text stays; an annotation points to the governing model.
- **1B. Revise.** Mark the four statements REVISE in place with replacement wording that names the Dashboard, preserving the original text as history.
- **1C. Leave as written and rely on the Phase 3 record.** Record nothing in the Matrix; treat Phase 3 and the Foundation requirements as controlling by implication. This conflicts with the repository's own rule that conflicts are surfaced, not silently resolved.

None of these options changes implemented behavior. Whether any requires an ACP depends on whether it alters accepted architecture. G1–G4 and G12 already express the Dashboard-first model in frozen and accepted material, so 1A and 1B appear to clarify rather than change it. That is a reading for Kurt and the reviewers to confirm.

## 5. Conflict 2 — Where do identity and operational state live: Dashboard, Workspace, or both?

### 5.1 Evidence

| Requirement | Text | Location | Tier |
|---|---|---|---|
| P4-R150 | "The Project Workspace presents the project's identity and operational state in one primary view" | Cat. 8 | KEEP-Phase4 |
| P4-R151 | "Purpose, Description, Focus, Status, Milestone, Progress, Next Action, Flags, and Blockers should be accessible from the primary workspace" | Cat. 8 | KEEP-Phase4 |
| P4-R318 | "Purpose, Description, and Focus should be directly accessible from the primary workspace" | Cat. 24 | KEEP-Phase4 |
| P4-R317 | "Project Workspace must clearly identify the selected project" | Cat. 24 | KEEP-Phase4 |
| P4-R322 | "Workspace should provide a concise 'Where Things Stand' operational section, covering the entire current-state picture with no artificial subdivision" | Cat. 24 | KEEP-Phase4 |
| P4-R321 (revised) | "Active Flags and Blockers must be prominently visible within the 'Where Things Stand' section" | Cat. 24 | KEEP-Phase4 |
| P4-R323 | "Where Things Stand should support Where Left Off, Next Action, and AI Progress Estimate" | Cat. 24 | KEEP-Phase4 |
| P4-R580, R581 | Dashboard must distinguish Purpose, Description and Focus; "Where Things Stand" must be the central operational section | Cat. 43 | KEEP-Phase4 |

Against G2, G4 ("reads `project_id` only from WP1"), G7, G8, and ACP-015 §4 (below).

### 5.2 Inconsistency

R150, R151, R318, R322, R321 and R323 place identity and a "Where Things Stand" operational section in the Workspace. The Dashboard already presents part, but not all, of that content under WP16. G8 says the two surfaces have distinct purposes. G4's statement that the Workspace "reads `project_id` only from WP1" may also bear on this, depending on how it is read (note on G4, §3).

**Exact overlap with the implemented Dashboard (WP16 §2.1–§2.7).**

| Item named in R150/R151/R317/R318/R321–R323 | On the Dashboard (WP16)? |
|---|---|
| Identity (name) and Status | Yes — identity (`name`, `status`) at every status |
| Purpose, Description, Focus | Yes — the distinguished triad (§2.3) |
| Milestone, Progress, Next Action | Yes — within Where Things Stand at `planned`/`current` (§2.4) |
| Blockers | Yes — within Where Things Stand; `null` and `[]` shown as "No blockers." (§2.4 rule 4, D2) |
| Flags | No — `ProjectRecord` has no flags field, and WP16 presents none |
| "Where Left Off" | No — no corresponding `ProjectRecord` field; not in WP16 |
| AI Progress Estimate | No — excluded from WP16 (Track B); R802 remains outstanding |
| Last updated; `repo_reference` | Yes — `last_updated` within Where Things Stand; `repo_reference` outside it at `current` (not named in the Workspace requirements) |

Attention (R582) is not in this table because the Workspace requirements above do not name it. It is a Dashboard requirement (Category 43) that WP16 deferred without defining it or assigning it to the Workspace; its placement is unresolved and is not a Workspace requirement.

So the overlap is substantial but not complete: the Workspace requirements name items (Flags, Where Left Off, the estimate) that the Dashboard does not present, and the Dashboard presents items (`last_updated`, `repo_reference`) that the Workspace requirements do not name.

### 5.3 A constraint from an accepted ACP

ACP-015 §4 states that P4-R323 "remains authoritative" and that "The Project Workspace 'Where Things Stand' should support AI Progress Estimate alongside Where Left Off and Next Action." Any option below that removes a Workspace "Where Things Stand" section contradicts ACP-015 §4 as written. The word "primary workspace" in R151 and R318 may still be interpreted separately from R322/R323.

### 5.4 Options

- **2A. Read the three statements as describing the Dashboard.** This is two different moves, and the note keeps them apart. (i) For R151 and R318, which say "primary workspace," it reads that phrase as "the project's primary view (the Dashboard)." That resolves an ambiguity in the word "primary." (ii) For R150, which says "The Project Workspace presents the project's identity and operational state in one primary view," it would reinterpret a statement that names the Project Workspace directly as a statement about the Dashboard. That is a substantive reinterpretation of R150, not a reading of an ambiguous word, and it should be ruled on as such. R322/R321/R323 are handled separately; this option alone does not decide them.
- **2B. The Workspace has its own "Where Things Stand," drawn from the same Project Record.** It references rather than copies the record (consistent with R583 and R588) and differs from the Dashboard by purpose (execution context rather than orientation). Whether WP6's read statement needs annotation depends on how it is read (note on G4).
- **2C. Split by content.** The primary-view statements (R150, R151, R318) are treated as satisfied on the Dashboard, with the Workspace carrying a project identity header (R317). For R151 and R318 this reads "primary workspace" as the primary project view. For R150, which names the Project Workspace directly, it is the same substantive reinterpretation as 2A(ii) and requires that ruling too. The Workspace's "Where Things Stand" remains a Workspace requirement on two separate grounds: R322 is a KEEP-Phase4 requirement in its own right (Cat. 24), and ACP-015 §4 specifically preserves R323. Detailed presentation design, any additional fields and derivation mechanics may be left to the Workspace specification, within two fixed constraints. (i) ACP-015 §4 requires the Workspace presentation to preserve the distinction between user-maintained project information, observable project indicators, AI-generated estimates, and authoritative Project Status, so the specification cannot treat that distinction as undecided. (ii) The content the requirements expressly name is not optional: R321 (Active Flags and Blockers), R323 (Where Left Off, Next Action and the AI Progress Estimate) and R322 (the entire current-state picture). The specification decides how that content is sourced and presented, not whether it appears, unless a ruling changes the requirement. Today no `ProjectRecord` field exists for Flags or Where Left Off (§5.2), so how they are sourced is part of that specification's work. Whether R322/R323 remain part of the Workspace contract may **not** be left to it: ACP-015 §4 already answers that, so the specification must implement them or raise a genuine architectural conflict.

Whether 2B or 2C requires amending the WP6 read statement depends on how that statement is read (note on G4, §3). Under the field reading, a Workspace section drawing on other Project Record fields would exceed it, and changing it would be a change to frozen architecture, so the ACP process would apply. Under the source or scope readings, no amendment has been shown to be needed. Which reading governs is part of the ruling on Conflict 2.

## 6. Conflict 3 — R587 against the "no navigation hub" rule

### 6.1 Evidence

| Source | Text |
|---|---|
| P4-R587 (Cat. 43, KEEP-Phase4) | "Dashboard should provide direct navigation to relevant Sources, Threads, Decisions, Tasks, Flags, Blockers, Handovers, and History" |
| Phase 3 §D, WP6 (frozen) | "the Dashboard must not become a navigation hub offering multiple Workspace-section entry points" |
| Phase 3 §D, WP5 (frozen) | Dashboard's downward transition "is the single, uniform action defined in WP6" |
| P4-R589, R590, R591 (Cat. 44) | The Workspace is accessible from the Dashboard; Workspace views "capable of exposing Files, Tasks, Decisions, AI/Threads, History, and Sources" |

Scope note 2026-10-09 deferred R587 from WP16 for this reason.

### 6.2 Inconsistency

R587 asks the Dashboard for direct links into several Workspace-resident areas. The frozen record forbids a Dashboard that offers multiple Workspace-section entry points and defines a single uniform action to the Workspace.

### 6.3 Observation on the list in R587

R587's targets fall into different groups; this is evidence about the requirement, not a ruling on it.

- **Blockers.** The Dashboard already presents `blockers` within Where Things Stand (WP16 §2.4 rule 4). P4-R321 is not evidence of this: it is a Category 24 (Project Workspace) requirement placing Active Flags and Blockers within the Workspace's "Where Things Stand."
- **Flags.** No Dashboard presentation of Flags is established: `ProjectRecord` has no flags field and WP16 presents none.
- **Sources, Threads, Decisions, Tasks, History.** R591 (Cat. 44) lists "Files, Tasks, Decisions, AI/Threads, History, and Sources" as Workspace views. For the Threads part, P4-R404 (direct navigation from CC to an associated thread) is DEFER in Document B.
- **Handovers.** R591 does not list Handovers. Handover records are defined as project artifacts in Category 28 (R407–R425), which does not say where they are surfaced.

### 6.4 Options

- **3A. Phase 3 prevails.** R587's intended access to those resources is treated as fulfilled through the Workspace: the single Dashboard-to-Workspace action (R589), then navigation inside the Workspace. This does **not** satisfy R587's literal wording, which asks for direct navigation from the Dashboard. The annotation would have to say that plainly rather than call R587 satisfied. No ACP, because the frozen "no navigation hub" rule stands.
- **3B. R587 prevails in limited form.** The frozen "no navigation hub" statement is amended for a specific, bounded set of direct links. This changes frozen architecture and needs an ACP.
- **3C. Narrow what remains to be placed (combines with 3A or 3B; it is not an alternative to them).** Blockers are recorded as already presented on the Dashboard; Flags as not established there; the placement of the remaining targets (including Handovers, which no cited requirement places) is left to the Workspace specification. This option does **not** decide between 3A and 3B. That choice is a boundary question the scope note (§6) and the Master Index assign to this reconciliation, to be settled before the Workspace specification. Keeping R587 deferred past the Workspace specification, as WP16 did, would be a different ruling that changes that documented sequencing and should be made explicitly.

## 7. Conflict 4 — R783 against R802 and R323

### 7.1 Evidence

| Requirement | Text | Location | Tier |
|---|---|---|---|
| P4-R783 | "Dashboard and Workspace should not duplicate each other's responsibilities" | Cat. 63 | KEEP-Foundation |
| P4-R802 | "The Dashboard must automatically display the AI Progress Estimate within its Where Things Stand section when the Dashboard is opened" | Cat. 43 | KEEP-Phase4 |
| P4-R323 | "Where Things Stand should support Where Left Off, Next Action, and AI Progress Estimate" (Workspace) | Cat. 24 | KEEP-Phase4 |
| ACP-015 §4 | R802 "remains authoritative"; R323 "remains authoritative"; "The Workspace presentation must preserve the same distinction between: user-maintained project information; observable project indicators; AI-generated estimates; authoritative Project Status." | ACP-015 | accepted ACP |

### 7.2 Inconsistency

The AI Progress Estimate is required to appear in both surfaces' "Where Things Stand," while R783 says the surfaces should not duplicate each other's responsibilities. ACP-015 §4 accepted both statements and did not resolve how they fit together.

### 7.3 Constraint, and an ambiguity in the word "support"

ACP-015 keeps both R802 and R323 authoritative. R802 says the Dashboard must "display" the estimate. R323 and ACP-015 §4 say the Workspace's Where Things Stand "should support" it "alongside Where Left Off and Next Action." Whether "support" means display the estimate, or provide material that supports it, is itself unstated. The phrasing "alongside Where Left Off and Next Action" reads more naturally as presence of the estimate in that section, but that is a reading for the reviewers, not text. Any option must keep an estimate present in the Workspace's Where Things Stand unless Kurt rules that "support" does not require it.

The estimate's derivation ("Track B") is separate and undefined; any resolution here concerns responsibility and presentation only.

### 7.4 Options

- **4A. Same estimate on both, one source.** The estimate is computed once and displayed on both surfaces. R783 is read as concerning responsibilities (orientation vs. execution), not repeated display of one value.
- **4B. Same estimate, different role.** The Workspace presents the same single-source estimate (never a second, independently computed one) together with additional context useful for execution, so the Workspace does more with it than the Dashboard rather than less. The Dashboard's display remains the orientation view of it.
- **4C. Carry forward.** Record the reading of R783 as unresolved and take it up when a Workspace specification includes the estimate. This option changes the agreed sequence in §11: the Workspace specification would be written with R783's reading still open, and the unresolved question is carried into a later decision instead of being settled by these rulings. Choosing it should be an explicit ruling to that effect.

None of these removes the estimate from the Workspace. An option that did would contradict ACP-015 §4 unless "support" is ruled not to require presence.

## 8. Dependencies between the conflicts (stated, not assumed)

- **Conflict 1** is independent of the others. Its options do not depend on how 2, 3 or 4 are ruled.
- **Conflicts 2 and 4** share one question: whether the Workspace has its own "Where Things Stand" (R322/R323). Ruling on 2 (B or C) constrains 4; ruling on 4 (A or B) presupposes a Workspace section. Neither ruling should be treated as made by the other.
- **Conflict 3** depends only on G3, G5, R589 and R784; it is independent of 2 and 4.

## 9. Findings outside the four conflicts (for Kurt and the reviewers to include or exclude)

1. **Category 8's Foundation bullets.** Category 8 carries unnumbered KEEP-Foundation statements that read "A selected project opens as a dedicated Project Workspace" and "Project information, ecosystem information, and source/document references belong within the workspace." These sit in the same tier as R655/R656 and R774–R776, which point the other way. ACP-015 §2.5 says no precedence rule exists between tiers.
2. **Exit statements R156, R162, R326** (§4.3). Whether they belong with Conflict 1 or are a fifth item is for Kurt to decide.
3. **R321, R322 and R317** (§5.1) were not named in the scope note's list; they bear on Conflict 2.

## 10. What each kind of ruling would require

These are mechanics, not recommendations.

- **Interpretation or annotation only** (e.g., 1A, 2A(i), 3A, 3C; 3A would have to state that it does not meet R587's literal wording): a clearly marked annotation placed beside the affected Matrix requirement, preserving the original wording, recorded in the Master Index. Per `SESSION_START.md`, an ACP is needed only when accepted architecture changes.
- **Revision of a requirement** (e.g., 1B; and 2A(ii) or 2C, since each reinterprets R150, a statement that names the Workspace directly): REVISE marking in the Matrix with original text preserved.
- **Change to frozen Phase 3 wording** (e.g., 2B/2C only if the WP6 read statement is ruled to bar them; 3B): an ACP, with the Phase 3 text annotated, not rewritten.

## 11. Next steps

1. GPT and Codex check the evidence in §3–§7 and the quoted text against the repository, and challenge the options.
2. Kurt rules on each conflict separately, and on whether §9 items are in scope.
3. Only then: an annotation pass (and an ACP only if a ruling changes frozen architecture), together with the two Master Index corrections.
4. The Workspace specification is derived from the rulings; it is not started before them.

## 12. Rulings recorded

| Conflict | Ruling | By | Date | Status |
|---|---|---|---|---|
| 1 — Does selecting a project open the Workspace or the Dashboard? | **Option 1A (Interpret).** P4-R149, P4-R161, P4-R316 and the unnumbered Category 8 KEEP-Foundation bullet stay unchanged. A formal annotation states that, under the accepted Dashboard-first architecture, selecting a project opens its Dashboard as the primary project view, with the Workspace reached from the Dashboard. No ACP. | Kurt | 2026-11-15 | Ruled; annotated 2026-11-15 (commit 0cc610b) |
| 2 — Identity and operational information | — | — | — | Open |
| 3 — R587 against the no-navigation-hub rule | **Option 3A with 3C.** Full text below. | Kurt | 2026-11-16 | Ruled; annotation on P4-R587 applied in the same commit as this revision |
| 4 — R783 against R802 and R323 | — | — | — | Open |

**Conflict 3 ruling text (Kurt, 2026-11-16).** Option 3A with 3C. Phase 3's single, uniform Dashboard-to-Workspace transition remains in force and carries the active project's identity without a section-specific destination. Its wording does not limit the action to one control, so a later specification may let more than one Dashboard element invoke it, provided none carries a section-specific destination and no section menu or navigation hub is introduced. Navigation among Workspace sections is handled within the Workspace. R587's literal wording of direct navigation from the Dashboard to individual resources is not met, and section-specific links would need a separate ACP. WP16 §2.7 stays in force until the Dashboard-to-Workspace action (R589) is specified, and that specification will amend §2.7 explicitly. No Dashboard content becomes interactive by this ruling. Under 3C: Blockers are already presented on the Dashboard (WP16); Flags are not established there; the placement of the remaining resources, including Handovers, is left to the Workspace specification. Reviewed independently by GPT (approved with the wording refinements incorporated).

**Extension to the exit statements (Kurt, 2026-11-15).** The Conflict 1 ruling also covers P4-R156, P4-R162 and P4-R326 (§4.3, §9 item 2), read under the accepted navigation model: the Project Workspace is reached from the Project Dashboard, so leaving the Workspace returns to that project's Dashboard (`Up`, ACP-007), and the project-selection context is reached from the Dashboard (`Up`, ACP-017). The original wording is unchanged. This follows the `Up` decisions already accepted and is not an open question.

## 13. Evidence addendum (2026-11-16)

Evidence found while examining Conflict 3. It does not change §3–§11, which are left as they stood when the rulings were requested.

1. **Two WP numbering series.** WP1–WP9 are Phase 3 (frozen architecture; WP5 Dashboard and WP6 Workspace Entry Point are in Phase 3 §D). WP10–WP16 are Phase 4 (implementation). "WP6" and "WP16" are different packages.
2. **UI Architecture Specification §3** lists "workspace navigation (Workspace only, scoped to the currently open project)" among the elements that appear only where relevant. This is a second governing source, beside Phase 3 WP6, for keeping Workspace navigation inside the Workspace (Conflict 3).
3. **WP16 §2.7** says resolved content is non-interactive, with R587 and R589 deferred. D1 rejected a clickable `repo_reference` as needing "an explicit exception to §2.7." The non-interactivity is tied to those deferrals, so it describes WP16's implemented scope.
4. **"Content-driven navigation"** is defined narrowly in WP15 §3.6 (item 4) and `SESSION_START.md` §15: a render or resolution outcome must never itself cause a navigation-state transition; navigation changes come only from explicit user-initiated actions. A user's click is not content-driven navigation in that sense.
5. **Phase 3 §A, data ownership:** "Every screen that displays project information reads from this record; no screen owns or independently stores a competing copy of that data," and document-body content is "owned by the Workspace layer." This bears on the WP6 read statement (note on G4, §3, and Conflict 2): it favors readings 2 and 3 over the strict field reading.
6. **Corrections to earlier readings.** R587–R591 are Matrix requirements (Categories 43 and 44), not introduced by WP16; WP16 deferred only R587 and R589 and never mentions R590 or R591. ACP-014 cites R151 and R318 but allocates neither and decides no Dashboard presentation or Workspace detail.
