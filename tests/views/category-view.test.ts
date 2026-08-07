import { describe, it, expect, vi } from "vitest";
import { CategoryView } from "../../src/views/category-view";
import { CATEGORY_ORDER } from "../../src/navigation/orientation";
import type { NavigationController } from "../../src/navigation/navigation-controller";

class FakeElement {
  public children: FakeElement[] = [];
  public style: Record<string, string> = {};
  public classList: string[] = [];
  public textContent = "";
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

  createEl(tagName: string, options?: { text?: string; cls?: string }): FakeElement {
    const element = new FakeElement(tagName, options?.text ?? "");

    if (options?.cls) {
      element.addClass(options.cls);
    }

    this.children.push(element);
    return element;
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
}

describe("CategoryView", () => {
  it("renders a button for every category in CATEGORY_ORDER and selects it on click", () => {
    const container = new FakeElement();
    const controller = {
      selectCategory: vi.fn(),
    } as unknown as NavigationController;

    const view = new CategoryView(container as unknown as HTMLElement, controller);
    const onStateChange = vi.fn();

    view.setOnStateChange(onStateChange);
    view.render();

    const buttons = container.children.filter((child) => child.tagName === "button");

    expect(buttons.map((button) => button.textContent)).toEqual(CATEGORY_ORDER);

    buttons[1].dispatchEvent("click");

    expect(controller.selectCategory).toHaveBeenCalledWith(CATEGORY_ORDER[1]);
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });
});
