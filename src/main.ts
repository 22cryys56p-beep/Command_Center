/**
 * Command Center — Obsidian plugin entry point.
 *
 * WP12 Step 5, Slice 1: minimal plugin scaffold. Slice 8A (this
 * revision): registers CommandCenterView with Obsidian via
 * registerView(). Registration makes the view constructible; it does
 * not yet make it reachable — no command, ribbon icon, or leaf-reuse
 * logic exists yet. That is Slice 8B's scope, not this one.
 *
 * Per WP10's isolation requirement, everything this plugin needs beyond
 * bare lifecycle hooks (NavigationController, OrientationBarComponent,
 * NavigationInspector, CommandCenterView) was introduced in Slices 2–7,
 * each building on a confirmed-working foundation rather than all at
 * once. (Corrected from an earlier revision of this comment, which
 * referenced "ScreenHost" — a concept discarded at Slice 6 in favor of
 * NavigationInspector, a passive diagnostic view, not a screen. This
 * file was not touched during that rename, so the stale reference
 * persisted until this slice actually modified the file again.)
 *
 * COMMAND_CENTER_VIEW_TYPE is owned by command-center-view.ts and
 * imported here, not redefined — single source of truth for the view
 * type string, consistent with the same principle already applied to
 * WP1's project_id.
 */

import { Plugin } from "obsidian";
import { CommandCenterView, COMMAND_CENTER_VIEW_TYPE } from "./navigation/command-center-view";

export default class CommandCenterPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(
      COMMAND_CENTER_VIEW_TYPE,
      (leaf) => new CommandCenterView(leaf)
    );

    console.log(
      "Command Center: plugin loaded (Slice 8A — view registered, not yet activatable; no command or ribbon icon exists yet)."
    );
  }

  onunload(): void {
    console.log("Command Center: plugin unloaded.");
  }
}
