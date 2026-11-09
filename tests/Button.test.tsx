import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../src";

describe("Button", () => {
  it("is a primary, medium, non-submitting button by default", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-cta", "text-cta-foreground", "font-semibold", "min-h-10");
  });

  it("secondary is white with a border, danger is solid red with light text", () => {
    const { rerender } = render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "bg-surface-elevated", "text-foreground");
    expect(screen.getByRole("button")).not.toHaveClass("bg-cta");
    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-danger-text", "text-cta-foreground");
    expect(screen.getByRole("button")).not.toHaveClass("bg-danger-bg");
  });

  it("size sm is the compact form", () => {
    render(<Button size="sm">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("min-h-[34px]", "text-[13px]");
    expect(screen.getByRole("button")).not.toHaveClass("min-h-10");
  });

  it("passes click, disabled and extra classes through", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button onClick={onClick} className="flex-1">
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveClass("flex-1", "bg-cta");
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("type can be overridden to submit", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("variantClassName replaces the variant's colors, keeping the base and size", () => {
    render(
      <Button variant="danger" variantClassName="bg-black text-white">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-black", "text-white", "font-semibold", "min-h-10");
    expect(button).not.toHaveClass("bg-danger-text");
  });

  it("sizeClassName replaces the size's height and padding, keeping the colors", () => {
    render(<Button sizeClassName="min-h-12 px-6 text-base">Big</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("min-h-12", "px-6", "bg-cta");
    expect(button).not.toHaveClass("min-h-10");
  });

  describe("hover ripple", () => {
    let animate: ReturnType<typeof vi.fn>;
    let finish: () => void;

    beforeEach(() => {
      // jsdom has no Web Animations API: stand in for it, and let the test
      // decide when the fade-out "finishes".
      animate = vi.fn(() => ({
        finished: new Promise<void>((resolve) => {
          finish = resolve;
        }),
      }));
      Element.prototype.animate = animate as unknown as Element["animate"];
    });
    afterEach(() => {
      // @ts-expect-error restoring jsdom's missing method
      delete Element.prototype.animate;
      vi.unstubAllGlobals();
    });

    const ripples = (button: HTMLElement) =>
      button.querySelectorAll("span.rounded-full");

    it("grows a ripple in the variant's fill on hover, behind the label", () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole("button");
      fireEvent.pointerEnter(button, { pointerType: "mouse" });
      expect(ripples(button)).toHaveLength(1);
      expect(ripples(button)[0]).toHaveClass("bg-cta-hover", "absolute", "pointer-events-none");
      expect(animate).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Save").parentElement).toHaveClass("relative");
      expect(button).toHaveClass("overflow-hidden", "relative");
    });

    it("has no instant hover fill while the ripple is on, and gets it back when switched off", () => {
      const { rerender } = render(<Button>Save</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("hover:bg-cta-hover");
      rerender(<Button ripple={false}>Save</Button>);
      expect(screen.getByRole("button")).toHaveClass("hover:bg-cta-hover");
      fireEvent.pointerEnter(screen.getByRole("button"), { pointerType: "mouse" });
      expect(ripples(screen.getByRole("button"))).toHaveLength(0);
    });

    it("fades the ripple on leave and removes it once the fade finishes", async () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole("button");
      fireEvent.pointerEnter(button, { pointerType: "mouse" });
      fireEvent.pointerLeave(button, { pointerType: "mouse" });
      expect(animate).toHaveBeenCalledTimes(2);
      expect(ripples(button)).toHaveLength(1);
      finish();
      await waitFor(() => expect(ripples(button)).toHaveLength(0));
    });

    it("rippleClassName replaces the fill", () => {
      render(<Button rippleClassName="bg-black/10">Save</Button>);
      const button = screen.getByRole("button");
      fireEvent.pointerEnter(button, { pointerType: "mouse" });
      expect(ripples(button)[0]).toHaveClass("bg-black/10");
      expect(ripples(button)[0]).not.toHaveClass("bg-cta-hover");
    });

    it("skips touch pointers and reduced motion", () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole("button");
      fireEvent.pointerEnter(button, { pointerType: "touch" });
      expect(ripples(button)).toHaveLength(0);

      vi.stubGlobal("matchMedia", () => ({ matches: true }));
      fireEvent.pointerEnter(button, { pointerType: "mouse" });
      expect(ripples(button)).toHaveLength(0);
    });

    it("still calls the caller's own pointer handlers", () => {
      const onPointerEnter = vi.fn();
      const onPointerLeave = vi.fn();
      render(
        <Button onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
          Save
        </Button>,
      );
      fireEvent.pointerEnter(screen.getByRole("button"), { pointerType: "mouse" });
      fireEvent.pointerLeave(screen.getByRole("button"), { pointerType: "mouse" });
      expect(onPointerEnter).toHaveBeenCalledTimes(1);
      expect(onPointerLeave).toHaveBeenCalledTimes(1);
    });

    it("leaves no ripple behind when it unmounts mid-hover", () => {
      const { unmount, container } = render(<Button>Save</Button>);
      fireEvent.pointerEnter(screen.getByRole("button"), { pointerType: "mouse" });
      unmount();
      expect(container.querySelector("span.rounded-full")).toBeNull();
    });
  });
});
