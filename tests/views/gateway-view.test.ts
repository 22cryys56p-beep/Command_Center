import { describe, it, expect, vi } from "vitest";
import { GatewayView, GATEWAY_DESTINATIONS } from "../../src/views/gateway-view";
import { NavigationController } from "../../src/navigation/navigation-controller";
import type { ProjectRecord } from "../../src/data/project-record";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
  public type = "";
  public listeners: Record<string, Array<() => void>> = {};

  constructor(public tagName = "div", text = "") {
    this.textContent = text;
  }

  empty(): void {
    this.children = [];
  }

  addClass(cls: string): void {
    this.classList.push(cls);
  }

  createEl(tagName: string, options?: { text?: string; cls?: string }): FakeElement {
    const el = new FakeElement(tagName, options?.text ?? "");
    if (options?.cls) el.addClass(options.cls);
    this.children.push(el);
    return el;
  }

  createDiv(options?: { cls?: string }): FakeElement {
    return this.createEl("div", options);
  }

  addEventListener(type: string, handler: () => void): void {
    this.listeners[type] ??= [];
    this.listeners[type].push(handler);
  }

  dispatchEvent(type: string): void {
    for (const h of this.listeners[type] ?? []) h();
  }
}

function build() {
  const container = new FakeElement();
  const controller = new NavigationController((): readonly ProjectRecord[] => []);
  const onEnterNewProject = vi.fn();
  const view = new GatewayView(
    container as unknown as HTMLElement,
    controller,
    onEnterNewProject
  );
  view.render();
  return { container, controller, onEnterNewProject, view };
}

function buttonLabeled(container: FakeElement, label: string): FakeElement {
  const found = container.children.find((c) => c.textContent === label);
  if (!found) throw new Error(`No Gateway button labeled "${label}"`);
  return found;
}

describe("GatewayView", () => {
  it("renders exactly the six authoritative destinations in ACP-011's order", () => {
    const { container } = build();
    expect(container.children.map((c) => c.textContent)).toEqual([
      "Current",
      "Planning",
      "Ideas",
      "Ongoing",
      "New Project",
      "Archive",
    ]);
  });

  it("maps each status-backed destination to its required ProjectStatus", () => {
    const cases: Array<[string, string]> = [
      ["Current", "current"],
      ["Planning", "planned"],
      ["Ideas", "possible"],
      ["Ongoing", "ongoing"],
      ["Archive", "archived"],
    ];

    for (const [label, expectedStatus] of cases) {
      const { container, controller } = build();
      buttonLabeled(container, label).dispatchEvent("click");
      const state = controller.getState();
      expect(state.depth).toBe("list");
      expect(state.object).toEqual({ kind: "category", category: expectedStatus });
    }
  });

  it("never maps any destination to `completed` or an unrecognized status", () => {
    const statuses = GATEWAY_DESTINATIONS.filter(
      (d): d is Extract<typeof d, { kind: "status" }> => d.kind === "status"
    ).map((d) => d.status);
    expect(statuses).toEqual(["current", "planned", "possible", "ongoing", "archived"]);
    expect(statuses).not.toContain("completed");
  });

  it("invokes the New Project entry point without altering NavigationState", () => {
    const { container, controller, onEnterNewProject } = build();
    const before = controller.getState();
    buttonLabeled(container, "New Project").dispatchEvent("click");
    expect(onEnterNewProject).toHaveBeenCalledTimes(1);
    expect(controller.getState()).toEqual(before);
    expect(controller.getState().depth).toBe("gateway");
  });

  it("introduces no gateway CurrentObject kind — root state stays object-less", () => {
    const { controller } = build();
    const state = controller.getState();
    expect(state.object).toBeNull();
    expect(state.depth).toBe("gateway");
  });

  it("hides itself when navigation is not at gateway depth", () => {
    const { container, controller, view } = build();
    controller.selectCategory("current");
    view.render();
    expect(container.style.display).toBe("none");
    expect(container.children).toEqual([]);
  });

  it("leaves category-level paging unavailable after a status-backed transition", () => {
    const { container, controller } = build();
    buttonLabeled(container, "Planning").dispatchEvent("click");
    const availability = controller.getAvailability();
    expect(availability.canPagePrevious).toBe(false);
    expect(availability.canPageNext).toBe(false);
  });
});
