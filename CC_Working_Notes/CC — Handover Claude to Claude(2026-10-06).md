# Command Center — Handover to a Fresh Claude Thread (2026-10-06)

## Purpose

You're picking up Command Center mid-project, no memory of the conversation that produced this. The repository (`22cryys56p-beep/Command_Center`) is authoritative — verify everything here against it.

**Read `SESSION_START.md` in full first, then `docs/indexes/CC_Repository File Index.md`.** That index is the complete, maintained map of every authoritative file in the repo — this handover does not re-enumerate it. Don't start work until you've read both.

## Immediate orientation

Last verified `main`: `7900228`. `tsc --noEmit` clean, **147/147 tests**. Verify this yourself before trusting it — it will already be stale by the time you read this.

## What's actually done

- **ACP-015** — AI Progress Estimate, a distinct non-authoritative AI-output category. Accepted. Its derivation method ("Track B") is separately unresolved.
- **ACP-016** — resolves P4-R797/P4-R798. Missing/Invalid/Duplicate taxonomy for a requested `project_id`; provider owns resolution; `CurrentObject` unchanged; no historical state required. **Did not receive the originally planned third independent Codex audit** — Codex hit its paywall before performing it. Formalized on Claude+GPT review alone, per SESSION_START §14's rule that post-Step-65 work proceeds via ACP regardless of Codex's availability. Don't represent it as Codex-audited — it wasn't.
- **WP15** (`docs/specifications/`) — the implementation spec for ACP-016's "Track A" (resolution + presentation), accepted after four GPT-reviewed drafting rounds. Proposes `resolveProjectRecord()` on the provider with two binding requirements: reuse the existing `discoverCandidates()`/`excludeDuplicateIds()` pipeline (don't reimplement it), and duplicate exclusion must be checked before/independently of validity. Six required acceptance tests, named in WP15 §6. Does not cover Track B.
- **WP15's P3–P6 presentation/interaction locks**, folded into WP15 §3.6/§3.7: the `Top`→Gateway escape must stay available; presentation must never itself trigger a navigation-state change; no remembered resolution history required beyond the current result. Layout/copy/component structure remain implementation choice.
- **SESSION_START §15** — new principle: navigation-state changes must never be content-driven, to prevent a render→navigation-state→render feedback loop. **This was Kurt's own prior design rule, not something discovered from the code** — see lesson #2 below.

## What's genuinely still open

- **WP15 implementation** — no code written yet.
- **Track B** — AI Progress Estimate's derivation. Needs its own evidence-first process. Not started.
- **"CC self-integrity checking"** — parked idea, deferred until Dashboard work settles.
- **New Tab/New Window** — Claude confirmed the architecture doesn't foreclose this (Obsidian natively supports multiple leaves; `NavigationController` is already per-instance; single-instance behavior is isolated to one method, `activateView()` in `main.ts`). Confirmed clean, nothing modified, still has no permanent documentation home — ask Kurt if he wants it written up now.

## What is NOT currently open — do not reopen without genuine contradicting evidence

- ACP-015's accepted status (Track B's derivation is open; the ACP itself is not)
- ACP-016's taxonomy and all of Q1–Q10
- `CurrentObject`'s shape
- The duplicate-before-validity rule; the provider-pipeline-reuse requirement
- P3, P4, P5, P6; the content-driven-navigation prohibition

If implementation genuinely contradicts one of these, stop and flag it — don't quietly work around it.

## Hard-won lessons — do not relearn these

1. **A completion summary is not verification.** Run the actual tool, read the actual file.
2. **Check whether something is a stated rule before reverse-engineering a rationale for it.** The content-driven-navigation prohibition looked, for a while, like an architectural property Claude and GPT had jointly discovered by inspecting the code. It wasn't — it was Kurt's own prior design decision, which neither AI knew about until he said so directly. If an absence in the code looks suspiciously clean or convenient, consider asking whether it's a known constraint before spending effort explaining it.
3. **Your own local git working copy can go stale and mislead you.** `git pull` reporting "already up to date" only means no new *remote* commits — it does not discard your own uncommitted local edits. If you've used `str_replace`/`create_file` against a cloned file earlier in a session, a later read of that file may show your own draft, not GitHub's actual content. `git status --short` before trusting a re-read of anything you've previously edited; `git checkout -- .` to discard and get the true state.
4. **Check a shared document's actual current structure before adding a new section to it.** A duplicate "Section 20" got created in SESSION_START earlier in this project because the live file wasn't re-read before writing — content GPT had already placed in the existing Section 5.
5. **Frontmatter and body titles can silently drift from each other.** Check both match when finalizing a document.
6. **Multi-AI review catches genuinely different things.** Keep doing independent checks even when the first opinion sounds confident.

## What to do if your repository access appears unavailable

GPT hit exactly this in the prior thread and got it wrong — concluded access was unavailable after one failed connector check, without retrying or following the established rule first. Don't repeat that: retry before concluding anything. Only once access is genuinely, confirmedly unavailable does SESSION_START §4's fallback apply (state the limitation explicitly, don't claim verification, don't invent commit information).

## Working style with Kurt

One step at a time. Full-file deliveries, not diffs. Finalize immediately in the same reply once something's approved — never leave "proposed"/"draft" language for a later turn. Check claims against the actual artifact, from you and from anything you're reviewing. He's the only one with push access. The Documentation Synchronization Protocol (SESSION_START §5) is standing: any meaningful change gets its full set of affected authoritative documents updated in the same pass, including `CC_Repository File Index.md` if a file was added/renamed/removed.

## Immediate next step, if none specified

Nothing's blocked. Candidates: WP15 implementation, Track B's derivation question, or the New Tab/Window write-up. Confirm with Kurt rather than assuming.