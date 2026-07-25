/**
 * Command Center — Obsidian plugin entry point.
 *
 * WP12 Step 5, Slice 1: minimal plugin scaffold only. This slice
 * establishes the build pipeline end-to-end for the first time — no
 * view is registered, no navigation logic is wired, no UI is rendered.
 * onload/onunload confirm the plugin loads and unloads cleanly; nothing
 * more.
 *
 * Per WP10's isolation requirement, everything this plugin needs beyond
 * bare lifecycle hooks (NavigationController, OrientationBarComponent,
 * ScreenHost, CommandCenterView) is introduced in later slices, each
 * building on a confirmed-working foundation rather than all at once.
 */

import { Plugin } from "obsidian";

export default class CommandCenterPlugin extends Plugin {
  async onload(): Promise<void> {
    console.log("Command Center: plugin loaded (Slice 1 — scaffold only, no view registered yet).");
  }

  onunload(): void {
    console.log("Command Center: plugin unloaded.");
  }
}
