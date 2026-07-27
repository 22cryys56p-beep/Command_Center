/**
 * Command Center — Obsidian plugin entry point.
 *
 * WP12 Step 5, Slice 1: minimal plugin scaffold. Slice 8A: registers
 * CommandCenterView with Obsidian via registerView() — makes the view
 * constructible, not yet reachable. Slice 8B (this revision): adds a
 * single command that opens Command Center, enforcing the
 * single-instance model entirely through leaf-reuse logic. No ribbon
 * icon and no auto-open on plugin load — both explicitly excluded from
 * this slice's scope, not merely deferred by omission.
 *
 * Per WP10's isolation requirement, everything this plugin needs beyond
 * bare lifecycle hooks (NavigationController, OrientationBarComponent,
 * NavigationInspector, CommandCenterView) was introduced in Slices 2–7,
 * each building on a confirmed-working foundation rather than all at
 * once.
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

    this.addCommand({
      id: "open-command-center",
      name: "Open Command Center",
      callback: () => {
        this.activateView();
      },
    });

    console.log(
      "Command Center: plugin loaded (Slice 8B — view registered and activatable via the \"Open Command Center\" command)."
    );
  }

  onunload(): void {
    console.log("Command Center: plugin unloaded.");
  }

  /**
   * Opens Command Center, enforcing the single-instance model solely
   * through this leaf-reuse check — Obsidian itself places no inherent
   * limit on how many leaves of a given view type can exist; nothing
   * in registerView() (Slice 8A) prevents duplicates on its own.
   * Prevention is entirely this method's responsibility, checked fresh
   * on every invocation, with no other safeguard.
   */
  private async activateView(): Promise<void> {
    const existingLeaves = this.app.workspace.getLeavesOfType(
      COMMAND_CENTER_VIEW_TYPE
    );

    if (existingLeaves.length > 0) {
      this.app.workspace.revealLeaf(existingLeaves[0]);
      return;
    }

    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: COMMAND_CENTER_VIEW_TYPE, active: true });
  }
}
