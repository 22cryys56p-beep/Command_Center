/**
 * NewProjectView — the temporary New Project creation-workflow shell.
 *
 * Implements the view-layer shell specified by the approved New Project
 * Entry-Point Work Package (WP13/Phase 4), governed by ACP-013 and
 * ACP-011.
 *
 * SCOPE AND BOUNDARIES (do not expand without a separate approved change):
 * - Pure view-layer component. Imports no NavigationController and reads
 *   or modifies no NavigationState. It has no knowledge of Gateway,
 *   CurrentObject, or Depth.
 * - Defines no intake fields, Type taxonomy, participant/resource model,
 *   or template/seed selection. The form region is an empty, labeled
 *   extension point only.
 * - Defines no ProjectRecordProvider interface, input schema, or
 *   persistence mechanics. See the onSubmit config field below for how
 *   the handoff boundary is expressed without inventing that shape.
 * - Introduces no new CurrentObject kind or Depth value (it introduces
 *   none at all — this component is outside NavigationState entirely).
 *
 * PROVIDER HANDOFF BOUNDARY (Work Package Section 3.8):
 * `onSubmit` is optional and, as of this work package, is never supplied
 * by CommandCenterView — there is no real ProjectRecordProvider yet. Its
 * mere absence is the detection mechanism: Submit checks whether it was
 * given a handler at all, and if not, fails visibly and honestly. There
 * is no hardcoded flag to remember to flip later. When a future,
 * separately scoped work package adds real creation capability, it does
 * so by supplying this callback — nothing in this file needs to change.
 */

import type { ProjectStatus } from "../data/project-record";

const CREATABLE_STATUSES: readonly ProjectStatus[] = ["possible", "planned", "current"];

export interface NewProjectViewConfig {
  /** Discards the in-progress workflow. NavigationState is never touched, so there is nothing to restore. */
  onCancel: () => void;
  /**
   * Invoked only when a valid status has been selected. Left unset by
   * CommandCenterView today — see the class-level comment. Its shape is
   * intentionally minimal (just the chosen status) and defines nothing
   * about a future provider's real interface.
   */
  onSubmit?: (status: ProjectStatus) => void;
}

export class NewProjectView {
  private readonly container: HTMLElement;
  private readonly config: NewProjectViewConfig;
  private statusSelector: HTMLSelectElement | null = null;
  private messageRegion: HTMLElement | null = null;

  constructor(container: HTMLElement, config: NewProjectViewConfig) {
    this.container = container;
    this.config = config;
  }

  render(): void {
    this.container.empty();
    this.container.addClass("new-project-view");

    this.container.createEl("h1", {
      text: "New Project",
      cls: "new-project-view-title",
    });

    const formContainer = this.container.createDiv({
      cls: "new-project-form-container",
    });

    this.renderStatusSelector(formContainer);
    this.renderFormRegion(formContainer);
    this.renderExpansionRegion(formContainer);

    this.messageRegion = formContainer.createDiv({
      cls: "new-project-submit-message",
    });
    this.messageRegion.style.display = "none";

    this.renderActionButtons(formContainer);
  }

  private renderStatusSelector(container: HTMLElement): void {
    const group = container.createDiv({ cls: "new-project-status-group" });
    group.createEl("label", {
      text: "Initial Status",
      cls: "new-project-status-label",
    });

    this.statusSelector = group.createEl("select", {
      cls: "new-project-status-selector",
    }) as HTMLSelectElement;

    const placeholder = this.statusSelector.createEl("option", {
      text: "Select status...",
      value: "",
    }) as HTMLOptionElement;
    placeholder.disabled = true;
    placeholder.selected = true;

    // Deliberately only these three. ongoing/archived do not apply to a
    // project that does not yet exist (Work Package Section 3.7).
    for (const status of CREATABLE_STATUSES) {
      this.statusSelector.createEl("option", {
        text: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      });
    }
  }

  private renderFormRegion(container: HTMLElement): void {
    const section = container.createDiv({ cls: "new-project-form-section" });
    section.createEl("h3", { text: "Project Information" });
    section.createEl("p", {
      text: "Intake fields are not yet defined. This region is an extension point for a separately scoped work package.",
      cls: "new-project-form-placeholder",
    });
  }

  private renderExpansionRegion(container: HTMLElement): void {
    // Structural extension point only, per Work Package Section 3.4.
    // No add/remove affordance is wired here — what can be expanded,
    // and how, is explicitly deferred. This container exists so a future
    // work package has a concrete place to attach that behavior without
    // restructuring the shell.
    const section = container.createDiv({
      cls: "new-project-expansion-region",
    });
    section.createEl("h3", { text: "Additional Sections" });
    section.createEl("p", {
      text: "Expandable/collapsible content will attach here. Its structure and behavior are defined by a separately scoped work package.",
      cls: "new-project-expansion-placeholder",
    });
  }

  private renderActionButtons(container: HTMLElement): void {
    const buttonRow = container.createDiv({ cls: "new-project-action-buttons" });

    const cancelButton = buttonRow.createEl("button", {
      text: "Cancel",
      cls: "new-project-cancel-button",
    });
    cancelButton.addEventListener("click", () => this.config.onCancel());

    const submitButton = buttonRow.createEl("button", {
      text: "Submit",
      cls: "new-project-submit-button",
    });
    submitButton.addEventListener("click", () => this.handleSubmit());
  }

  private handleSubmit(): void {
    const selectedStatus = this.statusSelector?.value as ProjectStatus | "" | undefined;

    if (!selectedStatus || !CREATABLE_STATUSES.includes(selectedStatus)) {
      this.displayMessage(
        "Please select an initial status (Possible, Planned, or Current) before submitting."
      );
      return;
    }

    if (!this.config.onSubmit) {
      this.displayMessage(
        "Project creation isn't available yet — the underlying creation capability hasn't been built. " +
        "Nothing you've entered has been lost; you can Cancel and return to Gateway, or wait until this is implemented."
      );
      return;
    }

    this.config.onSubmit(selectedStatus);
  }

  private displayMessage(message: string): void {
    if (!this.messageRegion) {
      return;
    }
    this.messageRegion.empty();
    this.messageRegion.createEl("strong", { text: "Cannot submit: " });
    this.messageRegion.createEl("span", { text: message });
    this.messageRegion.style.display = "block";
  }

  clear(): void {
    this.container.empty();
    this.statusSelector = null;
    this.messageRegion = null;
  }
}
