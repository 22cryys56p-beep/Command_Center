/**
 * CommandCenterView — the Main-Area ItemView shell hosting Command
 * Center's persistent orientation element and diagnostic view.
 *
 * WP12 Step 5, Slice 7 — first integration slice. Owns creation,
 * mounting, render coordination, and destruction of
 * NavigationController, OrientationBarComponent, and
 * NavigationInspector. Registration (registerView) and activation
 * (open command, leaf-reuse) remain deferred to Slices 8A/8B, per the
 * frozen roadmap — this file defines the view class only.
 *
 * IMPORTANT — this is NOT a screen implementation, and mounts none.
 * The persistent orientation bar and NavigationInspector's diagnostic
 * content are the only things mounted here. No Category/List/
 * Dashboard/Workspace screen, placeholder, or routing logic exists in
 * this file, consistent with the WP12 specification's boundary
 * ("does not build any of those screens itself, even minimally, even
 * as a placeholder") and the Slice 6 re-evaluation that established
 * NavigationInspector as a passive diagnostic view rather than screen
 * infrastructure.
 *
 * Ownership model (frozen, per WP12 Step 5 architecture, implemented
 * here): NavigationController is owned by CommandCenterView, created
 * in onOpen(), destroyed in onClose(). No plugin-level singleton. One
 * active Command Center instance only — enforced at the registration/
 * activation layer (Slice 8B's leaf-reuse logic), not by this class
 * itself, which only assumes it is never instantiated more than once
 * at a time.
 *
 * Render coordination (RESOLVED at Slice 7): this class is the sole
 * coordinator. It supplies OrientationBarComponent's onStateChange
 * callback; that callback calls orientationBar.render() and
 * navigationInspector.render(), in that order, unconditionally, every
 * time. No event bus, observer pattern, subscriptions, or global state
 * — a single closure is the entire coordination mechanism, approved
 * specifically because there is one coordinator and two rendering
 * consumers.
 *
 * ProjectRecordProvider: this slice uses a minimal stub, () => [],
 * per the approved Slice 7 scope. Real Metadata Cache access,
 * frontmatter parsing, ProjectRecord generation, and validation are
 * explicitly NOT implemented here — they belong to a later, dedicated
 * integration step not yet slotted into the roadmap.
 *
 * Obsidian coupling boundary: this is the first class in the project
 * to extend an Obsidian base class (ItemView) and implement its
 * required lifecycle (getViewType, getDisplayText, onOpen, onClose) —
 * a deeper coupling than OrientationBarComponent/NavigationInspector's
 * existing DOM-helper usage. NavigationController and orientation.ts
 * remain fully host-agnostic, untouched by this slice.
 *
 * Component teardown: current components (NavigationController,
 * OrientationBarComponent, NavigationInspector) own no timers,
 * subscriptions, or external resources requiring explicit teardown.
 * onClose() releases references and allows Obsidian's own DOM cleanup
 * to handle the rest. If future slices introduce persistent resources
 * (timers, subscriptions, open handles), teardown responsibilities
 * must be revisited explicitly, not assumed to remain this simple.
 */

import { ItemView, type WorkspaceLeaf } from "obsidian";
import { NavigationController } from "./navigation-controller";
import { OrientationBarComponent } from "./orientation-bar";
import { NavigationInspector } from "./navigation-inspector";
import type { ProjectRecord } from "../data/project-record";

export const COMMAND_CENTER_VIEW_TYPE = "command-center-view";

export class CommandCenterView extends ItemView {
  private controller: NavigationController | null = null;
  private orientationBar: OrientationBarComponent | null = null;
  private navigationInspector: NavigationInspector | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return COMMAND_CENTER_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Command Center";
  }

  async onOpen(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("command-center-view-root");

    // Stub provider per the approved Slice 7 scope — deliberately not
    // a real Metadata Cache-backed implementation. See class-level
    // comment.
    const stubProvider = (): readonly ProjectRecord[] => [];

    this.controller = new NavigationController(stubProvider);

    const orientationBarContainer = root.createDiv({
      cls: "command-center-orientation-bar-container",
    });
    const inspectorContainer = root.createDiv({
      cls: "command-center-inspector-container",
    });

    // The sole coordination mechanism (Slice 7, resolved): a single
    // callback, closing over both component references, calling both
    // render() methods in order. Not an event bus, not an observer
    // pattern — one coordinator, two rendering consumers.
    const onStateChange = (): void => {
      this.orientationBar?.render();
      this.navigationInspector?.render();
    };

    this.orientationBar = new OrientationBarComponent(
      orientationBarContainer,
      this.controller,
      onStateChange
    );
    this.navigationInspector = new NavigationInspector(
      inspectorContainer,
      this.controller
    );

    // Initial render for both, so state is visible immediately on
    // open without waiting for a click.
    this.orientationBar.render();
    this.navigationInspector.render();
  }

  async onClose(): Promise<void> {
    // Per the approved Slice 7 teardown decision: current components
    // own no timers, subscriptions, or external resources requiring
    // teardown. Releasing references and allowing Obsidian's DOM
    // cleanup to handle the rest is sufficient today. If future
    // slices introduce persistent resources, this must be revisited.
    this.controller = null;
    this.orientationBar = null;
    this.navigationInspector = null;
  }
}
