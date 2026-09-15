import { describe, it, expect, vi } from "vitest";
import { NewProjectView } from "../../src/views/new-project-view";
import type { ProjectStatus } from "../../src/data/project-record";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
  public value = "";
  public disabled = false;
  public selected = false;
  public listeners: Record<string, Array<() => void>> = {};
  public tagName: string;

  constructor(tagName = "div", text = "") {
    this.tagName = tagName;
    this.textContent = text;
  }

  empty(): void {
    this.children = [];
    this.textContent = "";
  }

  addClass(className: string): void {
    this.classList.push(className);
  }

  createEl(tagName: string, options?: { text?: string; cls?: string; value?: string }): FakeElement {
    const element = new FakeElement(tagName, options?.text ?? "");
    if (options?.cls) {
      element.addClass(options.cls);
    }
    if (options?.value !== undefined) {
      element.value = options.value;
    }
    this.children.push(element);
    return element;
  }

  createDiv(options?: { cls?: string }): FakeElement {
    return this.createEl("div", options);
  }

  addEventListener(type: string, handler: () => void): void {
    this.listeners[type] ??= [];
    this.listeners[type].push(handler);
  }

  dispatchEvent(type: string): void {
    for (const handler of this.listeners[type] ?? []) {
      handler();
    }
  }

  setText(text: string): void {
    this.textContent = text;
  }

  findByClass(cls: string): FakeElement | undefined {
    for (const child of this.children) {
      if (child.classList.includes(cls)) return child;
      const nested = child.findByClass(cls);
      if (nested) return nested;
    }
    return undefined;
  }
}

function buildView(onSubmit?: (status: string) => void) {
  const container = new FakeElement();
  const onCancel = vi.fn();
  const submitSpy = onSubmit ? vi.fn(onSubmit) : undefined;
  const view = new NewProjectView(container as unknown as HTMLElement, {
    onCancel,
    onSubmit: submitSpy as ((status: ProjectStatus) => void) | undefined,
  });
  view.render();
  return { container, onCancel, submitSpy, view };
}

describe("NewProjectView", () => {
  it("renders a status selector offering only possible, planned, current", () => {
    const { container } = buildView();
    const selector = container.findByClass("new-project-status-selector");
    expect(selector).toBeDefined();
    const values = selector!.children.map((opt) => opt.value);
    expect(values).toEqual(["", "possible", "planned", "current"]);
  });

  it("does not render ongoing, archived, or completed as options", () => {
    const { container } = buildView();
    const selector = container.findByClass("new-project-status-selector");
    const values = selector!.children.map((opt) => opt.value);
    expect(values).not.toContain("ongoing");
    expect(values).not.toContain("archived");
    expect(values).not.toContain("completed");
  });

  it("calls onCancel when Cancel is clicked, with no other side effects", () => {
    const { container, onCancel, submitSpy } = buildView(() => {});
    const cancelButton = container.findByClass("new-project-cancel-button");
    cancelButton!.dispatchEvent("click");
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it("fails honestly on Submit when no status is selected, without calling onSubmit", () => {
    const { container, submitSpy } = buildView(() => {});
    const submitButton = container.findByClass("new-project-submit-button");
    submitButton!.dispatchEvent("click");
    expect(submitSpy).not.toHaveBeenCalled();
    const message = container.findByClass("new-project-submit-message");
    expect(message!.style.display).toBe("block");
  });

  it("fails honestly on Submit when onSubmit is not supplied (no real provider), even with a valid status", () => {
    const { container } = buildView(undefined);
    const selector = container.findByClass("new-project-status-selector");
    (selector as unknown as { value: string }).value = "planned";
    const submitButton = container.findByClass("new-project-submit-button");
    submitButton!.dispatchEvent("click");
    const message = container.findByClass("new-project-submit-message");
    expect(message!.style.display).toBe("block");
  });

  it("calls onSubmit with the selected status when it is supplied and a status is chosen", () => {
    const { container, submitSpy } = buildView(() => {});
    const selector = container.findByClass("new-project-status-selector");
    (selector as unknown as { value: string }).value = "current";
    const submitButton = container.findByClass("new-project-submit-button");
    submitButton!.dispatchEvent("click");
    expect(submitSpy).toHaveBeenCalledWith("current");
  });

  it("clear() empties the container and resets internal state", () => {
    const { container, view } = buildView();
    view.clear();
    expect(container.children).toEqual([]);
  });
});
