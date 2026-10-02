ACP-016 — Dashboard ProjectRecord Resolution (Missing, Invalid, Duplicate)

Status: Accepted
Date: 2026-10-01
Decision Authority: Kurt
Decision: Approved

## 1. Scope

This ACP resolves P4-R797 and P4-R798 (Phase 4 Matrix, Document D — Open Items, Category 43), both OPEN since before Step 65 and never previously resolved. Per SESSION_START.md Section 14, architectural work occurring after Step 65 proceeds through the ACP process rather than continued matrix numbering; resolving these two OPEN items is such work.

This ACP establishes the architectural contract for how Command Center resolves a requested `project_id` to a `ProjectRecord`, and what Command Center must do when that resolution fails.

### Documents / requirements directly touched

- P4-R797 — Dashboard's exact presentation of a missing ProjectRecord
- P4-R798 — Dashboard's exact presentation of an invalid ProjectRecord
- Phase 3 Architecture Record, Section E (AI Observation Boundary) — not amended; explicitly confirmed as not requiring amendment (see Section 4)
- P4-R529 (Category 37) — referenced as precedent only, not authority

### Preceding work

This ACP formalizes the decision set developed through an evidence-first process (`CC_Working_Notes/Dashboard ProjectRecord Resolution Gap — Evidence and Decision Scope.md` and its successor consolidated decision set), independently reasoned through by Claude and GPT across ten questions (Q1–Q10), with each lock checked for internal consistency and for smuggled implementation decisions before being accepted. No Codex audit was obtained — Codex became unavailable before responding — so this ACP proceeds on the basis of the completed Claude/GPT independent review alone, consistent with CC's existing multi-AI workflow, which does not require every AI's sign-off for every decision.

---

## 2. Evidence

### 2.1 P4-R797/P4-R798 contain no operational definition

Their complete text, in full: "The Dashboard's exact presentation of a missing ProjectRecord remains OPEN" and "...invalid ProjectRecord remains OPEN." Neither item defines what "missing" or "invalid" means operationally, which layer owns detection, what information should travel through navigation, or how the two conditions should differ. No richer or earlier-stage version of either item exists anywhere in the Matrix documents.

### 2.2 The current architecture cannot supply Dashboard with the distinction these items assume exists

Verified directly against live source:

- `NavigationController.enterProject()` sets `CurrentObject` to `{ kind: "project", project_id, category }` with no check that the `project_id` currently resolves to a valid record.
- `CurrentObject` carries only `project_id` and `category` — never the `ProjectRecord` itself, never a validity flag.
- Phase 3 Section D confirms Dashboard's only input is this same bare `project_id`.
- `ObsidianProjectRecordProvider` exposes exactly one public method, `getProjectRecords()`, returning valid records only. No single-record lookup exists.
- Invalid and duplicate records are excluded by the provider with a `console.warn()` only — never exposed in any return value.
- Every test in the provider's test suite confirms this exclusion behavior as intentional and verified, not an oversight.
- WP14's provider is explicitly non-caching (re-reads vault state on every call), making a stale-reference scenario — valid at selection, invalid or deleted by the time Dashboard resolves it — a real, not merely hypothetical, case.

### 2.3 No existing rule governs this

Phase 3 Section C (Final Navigation Model) contains no rule about a stale or missing `CurrentObject` reference, for any object type. Phase 3 Section D describes only the happy path. WP14's specification does not address single-record lookup; this was not deliberately excluded, it was simply not considered.

### 2.4 P4-R529 — precedent, not authority

P4-R529 (Category 37, "Files, Sources & External Locations," KEEP-Foundation) establishes that CC values distinguishing "unavailable" from "missing or deleted" for external Sources — a different domain from the `ProjectRecord` note itself. It demonstrates the distinction fits CC's existing design philosophy; it does not govern this case, and treating it as if it did would itself be a new architectural decision rather than a discovery.

---

## 3. Architectural Decision

### 3.1 Resolution umbrella (Q1)

**Unresolved ProjectRecord**: the requested `project_id` does not currently resolve to a valid `ProjectRecord`. This is a description of current resolution state only — it does not characterize cause or history.

### 3.2 Resolution taxonomy (Q2)

The Unresolved condition partitions into exactly three mutually exclusive, exhaustive data conditions:

1. **Missing** — no identifiable resource corresponds to the requested `project_id`.
2. **Invalid** — exactly one identifiable corresponding resource exists but fails applicable validity requirements.
3. **Duplicate identity** — more than one resource corresponds to the requested `project_id`. This is neither a missing condition nor an intrinsic validity failure of a single record; the failure is relational (uniqueness), not a property of any individual record's content. Classifying Duplicate as Invalid would risk misdirecting a user toward fixing fields in a record when the actual corrective action concerns multiple records.

These conditions describe the underlying project-data condition, not merely Dashboard's ability to produce a usable record — consistent with P4-R797/R798's own wording (which characterizes "a missing ProjectRecord" and "an invalid ProjectRecord," not an abstract resolution failure) and with the existing accepted principle (SESSION_START Section 15) that CC must fail honestly rather than substitute fabricated, stale, or misleading content.

### 3.3 Resolution ownership (Q3)

The provider/data layer owns resolution of the requested `project_id`. Navigation's defined role is position-tracking; Dashboard's defined role is display, receiving only a bare `project_id`. The provider already performs the underlying work required (scanning candidates, validating, detecting duplicates) — today it discards this information rather than lacking it.

### 3.4 CurrentObject (Q4)

`CurrentObject` is unchanged by this ACP. It remains `{ kind: "project", project_id, category }` and does not become a container for resolved data or cached validity state. This follows from Section 3.3 (resolution is computed fresh by the provider, not carried in navigation state) and Section 3.6 below (no historical state is required).

### 3.5 Required data-layer capability (Q5)

Given a requested `project_id`, the data layer must be capable of determining and communicating its current resolution condition (Missing / Invalid / Duplicate per Section 3.2), including sufficient diagnostic information for Invalid and Duplicate conditions (see Section 3.8). The specific provider interface or data structure this requires is explicitly not decided by this ACP — that is implementation-specification territory, to be determined when the Dashboard implementation specification is written.

### 3.6 Resolution path (Q6)

Dashboard obtains resolution information from the provider, using the `project_id` it already receives via `CurrentObject`. The existing `getProjectRecords()` method cannot satisfy this alone, since it already excludes every non-valid case by design. The specific resolution-path mechanism (a new method, an enriched return shape, or another approach) is explicitly not decided by this ACP.

### 3.7 Presentation-level distinguishability (Q7)

Missing, Invalid, and Duplicate must remain distinguishable in the information presented to the user. Dashboard must not collapse these conditions into a single undifferentiated failure state when doing so would obscure the actual data condition or misdirect corrective action. This does not prescribe separate views, a shared presentation with condition-specific content, or any other visual treatment.

### 3.8 Honest unresolved state (Q8)

When a `ProjectRecord` cannot be resolved, Dashboard must present an explicit, honest unresolved state rather than render fabricated, stale, misleading, or apparently normal project content. The presentation must distinguish Missing, Invalid, and Duplicate and provide sufficient condition-specific diagnostic information for the user to understand the problem and take appropriate corrective action:

- **Missing** — sufficient information to establish what was requested and that no corresponding resource was found.
- **Invalid** — sufficient information to identify the relevant validation failure(s), including missing required fields where applicable. This diagnostic information must also support the already-accepted Section E invalid-absence observation capability (see Section 4).
- **Duplicate** — sufficient information to identify the conflicting resources, making the identity collision actionable rather than merely stating that one exists.

The presentation must not require historical cause information (Section 3.9) and does not prescribe a particular visual layout, navigation/interaction behavior, or implementation mechanism. Whether an unresolved state keeps the user within Dashboard context, offers navigation elsewhere, or takes some other interaction approach is explicitly excluded from this decision as a presentation choice, not an architectural requirement.

### 3.9 Cause/history (Q9)

Cause/history — never existed, existed then deleted, became invalid, became duplicated — does not need to be preserved by the resolution mechanism. CC does not require historical cause to classify the current resolution condition: the current data condition (Missing/Invalid/Duplicate) is sufficient for the resolution layer's purpose. This is consistent with WP14's deliberately stateless provider design. If a future need for history emerges, Category 30's existing Project History / Audit Trail capability (P4-R442) is the architecturally appropriate home for it — this ACP does not add state to the resolution chain. Whether cause should influence presentation wording (distinct from the resolution state itself) remains open and is not decided here.

---

## 4. Relationship to Section E (Q10)

This ACP does not amend, reinterpret, or otherwise alter Phase 3 Section E (AI Observation Boundary). Resolution determines the current condition of the requested `project_id`; Section E governs what AI may observe about project-record information once that information is available. These are related but distinct concerns — Section E's "invalid absence" example is itself a sub-case of this ACP's Invalid condition (Section 3.2), not a separate resolution category or a separate architectural concept requiring amendment.

**Adjacent finding, carried forward as an implementation consideration, not a separate decision:** Section E's invalid-absence observation presupposes Dashboard can receive a record with a missing required field so it has something to observe. The current provider excludes all invalid records before Dashboard ever sees them — meaning Section E's own already-accepted observation capability may currently be unimplementable, for the same underlying reason this ACP resolves. Whatever implements Section 3.5/3.6 of this ACP must be checked against whether it also unblocks Section E's existing capability — this is now an explicit acceptance constraint on the eventual Dashboard implementation specification, not an optional improvement.

---

## 5. Explicit Non-Goals

This ACP does **not**:

- Choose a provider interface, method name, or data structure (Sections 3.5, 3.6).
- Choose a Dashboard visual layout, component structure, or UI copy (Sections 3.7, 3.8).
- Choose a navigation or interaction behavior for the unresolved state (Section 3.8).
- Amend, reinterpret, or require any change to Phase 3 Section E (Section 4).
- Change `CurrentObject`'s shape (Section 3.4).
- Introduce any historical or cached state into the resolution chain (Section 3.9).
- Decide whether cause should influence presentation wording (Section 3.9).

Dashboard implementation specification work may now proceed using this architectural contract, satisfying both P4-R797/R798 and the Section E acceptance constraint identified in Section 4.

---

## 6. Status / Next Action

**Status:** Accepted

**Decision:** Approved by Kurt on 2026-10-01.

The affected architecture and implementation documentation should be updated to reflect:

1. Missing / Invalid / Duplicate identity as the resolution taxonomy for a requested `project_id` (Section 3.2).
2. The provider/data layer as the owner of resolution (Section 3.3).
3. The required data-layer capability and resolution path, as architectural requirements without a chosen implementation (Sections 3.5, 3.6).
4. The presentation requirements, including diagnostic parity across all three conditions (Section 3.8).
5. The dual acceptance constraint on the eventual Dashboard implementation specification: satisfy P4-R797/R798 and unblock Section E's existing invalid-absence capability (Section 4).

The next bounded work may proceed to the Dashboard implementation specification, using this accepted architectural contract rather than reopening the resolution-taxonomy question.
