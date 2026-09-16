/**
 * CommandCenterView — the Main-Area ItemView shell hosting Command
 * Center's persistent orientation element and diagnostic view.
 *
 * WP12 Step 5, Slice 7 — first integration slice. Owns creation,
 * mounting, render coordination, and destruction of
 * NavigationController, OrientationBarComponent, NavigationInspector,
 * GatewayView, and ProjectListView. Registration (registerView) and
 * activation (open command, leaf-reuse) are implemented in main.ts
 * (Slices 8A/8B) — this file defines the view class only and does not
 * itself register or activate.
 *
 * IMPORTANT — this is not a routing layer. It owns no navigation
 * logic of its own: Gateway and Project List are constructed here,
 * but each renders itself from NavigationController's state, and
 * transitions happen through NavigationController, not through this
 * class. This file's job is construction, mounting, and render
 * coordination — not deciding what screen the user sees next.
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
 * callback; that callback calls orientationBar.render(),
 * navigationInspector.render(), gatewayView.render(), and
 * projectListView.render(), in that order, unconditionally, every
 * time. No event bus, observer pattern, subscriptions, or global state
 * — a single closure is the entire coordination mechanism, approved
 * specifically because there is one coordinator and several rendering
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
import { EntryView } from "../views/entry-view";
import { ProjectListView } from "../views/project-list-view";
import { GatewayView } from "../views/gateway-view";
import { NewProjectView } from "../views/new-project-view";
import type { ProjectRecord, ProjectStatus } from "../data/project-record";

export const COMMAND_CENTER_VIEW_TYPE = "command-center-view";

export class CommandCenterView extends ItemView {
  private controller: NavigationController | null = null;
  private orientationBar: OrientationBarComponent | null = null;
  private navigationInspector: NavigationInspector | null = null;
  private projectListView: ProjectListView | null = null;
  private gatewayView: GatewayView | null = null;
  private entryView: EntryView | null = null;

  // Stored directly (not re-queried by CSS class) so New Project's view
  // swap can show/hide them without depending on DOM query support.
  private orientationBarContainer: HTMLElement | null = null;
  private gatewayViewContainer: HTMLElement | null = null;
  private projectListViewContainer: HTMLElement | null = null;

  private newProjectView: NewProjectView | null = null;
  private newProjectContainer: HTMLElement | null = null;
  private isNewProjectActive = false;

  // Records each suppressed container's display value so exitNewProject
  // can restore it exactly, rather than assuming it was "".
  private readonly priorDisplayValues = new Map<HTMLElement, string>();

  // Always null today. This is the seam a future, separately scoped work
  // package uses to attach real project-creation capability once a real
  // ProjectRecordProvider exists — see NewProjectView's class comment.
  // Nothing in enterNewProject/exitNewProject needs to change when that
  // happens; only this field's assignment does.
  private projectCreationHandler: ((status: ProjectStatus) => void) | null = null;

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
    this.showEntry();
  }

  private showEntry(): void {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("command-center-view-root");

    this.entryView = new EntryView(root, () => {
      this.enterNavigationRoot();
    });
    this.entryView.render();
  }

  private enterNavigationRoot(): void {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();

    this.entryView = null;

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
    const gatewayViewContainer = root.createDiv({
      cls: "command-center-gateway-view-container",
    });
    const projectListViewContainer = root.createDiv({
      cls: "command-center-project-list-view-container",
    });

    this.orientationBarContainer = orientationBarContainer;
    this.gatewayViewContainer = gatewayViewContainer;
    this.projectListViewContainer = projectListViewContainer;

    // The sole coordination mechanism (Slice 7, resolved): a single
    // callback, closing over all mounted component references, calling
    // each render() method in order. Not an event bus, not an observer
    // pattern — one coordinator, several rendering consumers.
    const onStateChange = (): void => {
      this.orientationBar?.render();
      this.navigationInspector?.render();
      this.gatewayView?.render();
      this.projectListView?.render();
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
    // Gateway replaces Category Screen as the root surface (ACP-011/012).
    this.gatewayView = new GatewayView(
      gatewayViewContainer,
      this.controller,
      () => this.enterNewProject()
    );
    this.projectListView = new ProjectListView(
      projectListViewContainer,
      this.controller,
      stubProvider
    );

    this.gatewayView.setOnStateChange(onStateChange);
    this.projectListView.setOnStateChange(onStateChange);

    // Initial render for all, so state is visible immediately upon
    // reaching the Gateway root, without waiting for a click.
    this.orientationBar.render();
    this.navigationInspector.render();
    this.gatewayView.render();
    this.projectListView.render();
  }

  async onClose(): Promise<void> {
    // Per the approved Slice 7 teardown decision: current components
    // own no timers, subscriptions, or external resources requiring
    // teardown. Releasing references and allowing Obsidian's DOM
    // cleanup to handle the rest is sufficient today. If future
    // slices introduce persistent resources, this must be revisited.
    this.entryView = null;
    this.controller = null;
    this.orientationBar = null;
    this.navigationInspector = null;
    this.projectListView = null;
    this.gatewayView = null;
    this.gatewayViewContainer = null;
    this.orientationBarContainer = null;
    this.projectListViewContainer = null;
    this.newProjectView = null;
    this.newProjectContainer = null;
    this.isNewProjectActive = false;
    this.priorDisplayValues.clear();
  }

  /**
   * Entry point for the New Project shell. Per ACP-013 and the approved
   * New Project Entry-Point Work Package, this is a plain method call —
   * not a NavigationController transition. It does not read, construct,
   * or modify NavigationState. Gateway (once implemented, in its own
   * work package) invokes this directly; this method itself performs no
   * Gateway wiring.
   *
   * Integration contract only (Work Package Section 4): this exposes the
   * entry point Gateway will call. It does not implement Gateway.
   */
  enterNewProject(): void {
    if (this.isNewProjectActive) {
      return;
    }

    // Deliberately no NavigationController check. New Project exists
    // entirely outside NavigationState (ACP-013 §3.1); gating entry on
    // the controller's existence would create exactly the dependency
    // that decision removed.
    this.suppressContainer(this.orientationBarContainer);
    this.suppressContainer(this.gatewayViewContainer);
    this.suppressContainer(this.projectListViewContainer);

    const root = this.containerEl.children[1] as HTMLElement;
    this.newProjectContainer = root.createDiv({
      cls: "command-center-new-project-view-container",
    });

    this.newProjectView = new NewProjectView(this.newProjectContainer, {
      onCancel: () => this.exitNewProject(),
      onSubmit: this.projectCreationHandler ?? undefined,
    });
    this.newProjectView.render();
    this.isNewProjectActive = true;
  }

  /** Hides a container, recording its prior display value for exact restoration. */
  private suppressContainer(container: HTMLElement | null): void {
    if (!container) {
      return;
    }
    this.priorDisplayValues.set(container, container.style.display);
    container.style.display = "none";
  }

  /** Restores a container to the exact display value it had before suppression. */
  private restoreContainer(container: HTMLElement | null): void {
    if (!container) {
      return;
    }
    const prior = this.priorDisplayValues.get(container);
    if (prior !== undefined) {
      container.style.display = prior;
      this.priorDisplayValues.delete(container);
    }
  }

  /**
   * Reverses enterNewProject()'s view swap. NavigationState was never
   * touched, so there is nothing to restore beyond visibility — the
   * orientation bar and prior screen reappear exactly as they were.
   */
  private exitNewProject(): void {
    if (!this.isNewProjectActive) {
      return;
    }

    this.newProjectView?.clear();
    this.newProjectView = null;
    this.newProjectContainer?.remove();
    this.newProjectContainer = null;

    if (this.orientationBarContainer) this.restoreContainer(this.orientationBarContainer);
    if (this.gatewayViewContainer) this.restoreContainer(this.gatewayViewContainer);
    if (this.projectListViewContainer) this.restoreContainer(this.projectListViewContainer);

    this.isNewProjectActive = false;
  }
}
