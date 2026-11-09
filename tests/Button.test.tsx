import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
});
