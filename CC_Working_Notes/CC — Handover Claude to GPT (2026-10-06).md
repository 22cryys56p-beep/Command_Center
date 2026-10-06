# Command Center — Handover to a Fresh GPT Thread (2026-10-06)

## Purpose

You're picking up Command Center mid-project, no memory of the conversation that produced this. The repository (`22cryys56p-beep/Command_Center`) is authoritative.

**Before anything else: verify your own actual repository access** — see the dedicated section below; this went wrong once already. **Then read `SESSION_START.md` in full, then `docs/indexes/CC_Repository File Index.md`** — the complete, maintained map of every authoritative file in the repo. This handover does not re-enumerate it.

## Immediate orientation

Last verified `main`: `7900228`. `tsc --noEmit` clean, **147/147 tests**. Verify yourself before trusting it.

## What's actually done

- **ACP-015** — AI Progress Estimate, distinct non-authoritative AI-output category. Accepted. Derivation method ("Track B") separately unresolved.
- **ACP-016** — resolves P4-R797/P4-R798. Missing/Invalid/Duplicate taxonomy; provider owns resolution; `CurrentObject` unchanged; no historical state required. **ACP-016 did not receive the originally planned third independent Codex audit** — Codex hit its paywall before performing it. Formalized on GPT+Claude review alone, per SESSION_START §14's rule. Don't represent it as Codex-audited — it wasn't.
- **WP15** — implementation spec for ACP-016's "Track A," accepted after four drafting rounds you reviewed against live source each time. Proposes `resolveProjectRecord()` with two binding requirements: reuse the existing `discoverCandidates()`/`excludeDuplicateIds()` pipeline, and duplicate exclusion checked before/independently of validity. Six required acceptance tests in WP15 §6. Does not cover Track B.
- **WP15's P3–P6 locks**, folded into WP15 §3.6/§3.7: Gateway escape stays available; presentation never triggers navigation-state changes; no remembered history required beyond current result. Layout/copy left open.
- **SESSION_START §15** — new principle: navigation-state changes must never be content-driven. **This was Kurt's own prior design rule, not something you and Claude discovered** — see lesson #1 below, since this one's specifically about a reasoning trap you fell into.

## What's genuinely still open

- **WP15 implementation** — no code yet.
- **Track B** — AI Progress Estimate derivation. Not started.
- **"CC self-integrity checking"** — parked, deferred.
- **New Tab/New Window** — you raised this yourself as a foresight question; Claude confirmed the architecture doesn't foreclose it (Obsidian natively supports multiple leaves, `NavigationController` is already per-instance, single-instance behavior is isolated to one method). Confirmed clean, still undocumented permanently — raise with Kurt again if relevant.

## What is NOT currently open — do not reopen without genuine contradicting evidence

- ACP-015's accepted status (Track B's derivation is open; the ACP is not)
- ACP-016's taxonomy and all of Q1–Q10
- `CurrentObject`'s shape
- Duplicate-before-validity; provider-pipeline-reuse
- P3, P4, P5, P6; the content-driven-navigation prohibition

## Hard-won lessons — do not relearn these

1. **Don't mistake a suspiciously clean absence of code for something you've discovered — it may be an unstated rule.** This happened to you directly: you and Claude investigated the code trying to determine *why* no content-driven-navigation mechanism existed, when it was actually Kurt's own prior design decision neither of you had been told about. Correct order: known rule → implementation should honor it → inspection verifies it does. Not: observe an absence → reverse-engineer a rationale → mistake your own rationale for the rule.
2. **Verify your own repository access before concluding it's unavailable.** You checked a connector, got a result that looked like the repo wasn't exposed, and concluded live inspection was impossible — then reasoned from documents alone instead. Wrong. See the dedicated section below.
3. **A completion summary is not verification**, including yours and including Claude's. Check the actual repo when it's available.
4. **When reviewing another AI's claim, check it directly rather than reasoning about whether it's likely true.** You left `ValidationIssue`'s export status as an open question across several turns when one `grep` would have resolved it immediately — Claude ended up doing that check instead.
5. **Multi-AI disagreement has repeatedly caught real errors in this project** — yours, Claude's, and each other's. Keep checking independently rather than treating agreement as sufficient.

## What to do if your repository access appears unavailable

This happened to you already, and the conclusion was wrong. Retry before concluding anything — a connector returning an unexpected result on the first attempt isn't confirmed unavailability. Follow the project's established rule (GitHub is the final authority; use the actual repo, not memory or a stale buffer) rather than falling back to document-only reasoning at the first negative signal. Only once access is genuinely, confirmedly unavailable does SESSION_START §4's fallback apply: state the limitation explicitly, don't claim verification, don't invent commit information.

## Working style with Kurt

One step at a time. Full-file deliveries for document edits, not diffs. The moment Kurt approves something, the next output should already be final — not deferred. He wants claims checked against the actual repository, from you and from whatever you're reviewing. He's the only one with push access. The Documentation Synchronization Protocol (SESSION_START §5) is standing: every meaningful change updates its full set of affected authoritative documents in the same pass, including `CC_Repository File Index.md` if a file was added/renamed/removed.

## Immediate next step, if none specified

Nothing's blocked. Candidates: WP15 implementation, Track B's derivation question, or the New Tab/Window write-up. Confirm with Kurt rather than assuming.