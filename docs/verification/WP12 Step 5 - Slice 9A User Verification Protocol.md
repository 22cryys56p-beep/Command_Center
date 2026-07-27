---
type: verification-protocol
phase: 4
work_package: WP12
step: 5
slice: 9A
title: User Verification Protocol
status: ready for execution
date: 2026-07-27
---

# WP12 Step 5 — Slice 9A: User Verification Protocol

Verifies everything reachable through the current UI, exactly as a normal user would encounter it. No developer console interaction except where explicitly noted for error observation. No console calls to `NavigationController` methods — that is Slice 9B's scope entirely.

Execute in order. Each step has a pass/fail condition.

---

## 1. Plugin Installation and Activation

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 1.1 | Install/enable the plugin in Obsidian (Community Plugins settings). | Plugin appears enabled, no error toast. | Plugin fails to load, error toast appears. |
| 1.2 | Open Developer Console (Ctrl/Cmd+Shift+I) *— for error observation only, no interaction*. | No error referencing `command-center` appears. | Any such error appears. |
| 1.3 | Open Command Palette (Ctrl/Cmd+P), search "Command Center". | `Open Command Center` appears in results. | Command absent or misnamed. |

---

## 2. Opening Command Center

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 2.1 | Invoke `Open Command Center`. | A new tab opens in the Main Area (not sidebar, not modal). | Opens elsewhere, or fails silently. |
| 2.2 | Inspect the opened tab. | Orientation Bar visible at the top: `<<`, a label, `>>`, `Up`, `Top`, in that left-to-right order. | Any control missing, duplicated, or reordered. |
| 2.3 | Inspect below the Orientation Bar. | `NavigationInspector` visible, showing a heading and a text block. | Inspector absent. |
| 2.4 | Read the Orientation Bar's label. | Reads exactly `Command Center: Projects`. | Any other text. |

---

## 3. Single-Instance Enforcement

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 3.1 | With Command Center open, invoke `Open Command Center` again. | Focus moves to the existing tab. No new tab appears. | A second Command Center tab is created. |
| 3.2 | Count open tabs matching Command Center. | Exactly 1. | 2 or more. |
| 3.3 | Repeat invocation 3 more times in a row. | Still exactly 1 tab; each invocation just refocuses it. | Tab count increases at any point. |

---

## 4. Orientation Bar Rendering

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 4.1 | Inspect `<<`, `>>`, `Up` button state. | All three rendered disabled (grayed out / non-interactive). | Any of the three appears enabled. |
| 4.2 | Inspect `Top` button state. | Rendered enabled. | Rendered disabled. |
| 4.3 | Attempt to click `<<`. | Button does not respond. | Any visible change occurs. |
| 4.4 | Attempt to click `>>`. | Same as 4.3. | Same as 4.3. |
| 4.5 | Attempt to click `Up`. | Same as 4.3. | Same as 4.3. |
| 4.6 | Click `Top`. | No visible change — label remains `Command Center: Projects`. | Label or layout changes. |

**Note, not a failure:** `<<`, `>>`, and `Up` remaining permanently disabled throughout this protocol is expected. No UI path currently exists to reach a category or project selection — that arrives with a future work package (screens), not this one. Deeper verification of what these controls *would* do if reachable is covered separately in Slice 9B, using developer tooling not exposed to a normal user.

---

## 5. NavigationInspector Rendering

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 5.1 | Read the Inspector's displayed content. | Shows a plain, unstyled state dump — no lists, cards, or structured layout resembling a screen. | Content resembles a Category/List/Dashboard/Workspace screen in any way. |
| 5.2 | Attempt to click anywhere inside the Inspector's region. | Nothing responds — the Inspector is not interactive. | Any click target found. |
| 5.3 | Click `Top` (4.6) and re-check the Inspector. | Content unchanged, consistent with 4.6 being a no-op. | Content changes despite no real state change. |

---

## 6. Boundary Verification

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 6.1 | Inspect all visible UI in the Command Center tab. | Only: Orientation Bar (5 controls) + Inspector (heading + content). Nothing else. | Any additional element not accounted for above. |
| 6.2 | Confirm no category/project list, dashboard, or workspace-style content appears anywhere. | Confirmed absent. | Any such content appears, even partially or as a stub. |

---

## 7. Lifecycle Verification

| # | Action | Pass condition | Fail condition |
|---|---|---|---|
| 7.1 | Close the Command Center tab. | Tab closes cleanly. | Error appears, or tab fails to close. |
| 7.2 | Reload the plugin (disable then re-enable, or use a plugin-reload command if available). | Plugin reloads without error. | Any error during reload. |
| 7.3 | Invoke `Open Command Center` again. | Behaves identically to Section 2 — fresh initial state. | Any prior state appears to persist. |
| 7.4 | Repeat single-instance check (Section 3) after reload. | Still exactly 1 tab under repeated invocation. | Duplicate tabs appear post-reload. |

---

## 8. Failure Conditions

Any of the following, at any point, is an automatic overall failure:

- Any error referencing `command-center` in the console.
- More than one Command Center tab existing simultaneously, at any point.
- The Orientation Bar or Inspector failing to render.
- Any of the five orientation controls missing, duplicated, or in the wrong order.
- The Inspector displaying screen-shaped or interactive content.
- State persisting across a close/reopen or plugin reload cycle.
- Any button's disabled/enabled state not matching Section 4's stated initial-state expectations.
- The plugin failing to load, or the command failing to appear in the Command Palette.

**Expected, NOT a failure:** `<<`, `>>`, and `Up` remaining permanently disabled and un-clickable throughout — see the note under Section 4.

---

## Completion Criteria

Slice 9A is complete if and only if every row in Sections 1–7 shows Pass, with zero occurrences of any Section 8 failure condition. Slice 9A passing is a prerequisite for the Baseline Freeze but is not sufficient alone — Slice 9B must also pass before the freeze is approved.
