Here's the exact list, ready to hand to Copilot when it's back:

1. **`SESSION_START.md`** — line 84 (Section 3, step 8): `` Check `Working_Notes/` for any open architectural question... ``

2. **`Working_Notes/README.md`** — line 1: `# Working_Notes` (the file's own title header — also worth checking if this file has an internal self-reference elsewhere, but this is the one hit)

3. **`Working_Notes/CC_State_of_Repo_for_Codex_2026-09-25.md`** — 4 mentions: line 5, line 37, line 38, line 53

4. **`docs/architecture/CC_UI Architecture Specification v1.0.md`** — line 129: reference to `` Working_Notes/Visual_Portfolio_Representation_Candidate.md ``

5. **`docs/architecture/ACP-013 — New Project Representation and Navigation Lifecycle.md`** — line 43: reference to `` Working_Notes/CC_Phase 4_New Project Intake and Data Model — Candidate Design Notes.md ``

6. **`docs/architecture/ACP-014 — Purpose and Description Metadata Representation.md`** — 2 mentions: line 12 and line 71, both referencing `` Working_Notes/Purpose_Description_Ownership_Open_Question.md ``

Worth flagging one thing for whoever does this (Copilot or otherwise, per the sync protocol): this search only caught files with extensions `.md`, `.ts`, `.mjs`, `.json`. If there are any `.txt` files (like `Codex CC Roadmap 2026.09.13.txt`) or other formats referencing the folder by name internally, those wouldn't have shown up — worth a quick broader search before calling the rename complete.

(Note - Claude didn't find any other references to the "Working_Notes" folder)