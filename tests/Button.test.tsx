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

  it("secondary is white with a border, danger uses the danger tokens", () => {
    const { rerender } = render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "bg-surface-elevated", "text-foreground");
    expect(screen.getByRole("button")).not.toHaveClass("bg-cta");
    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-danger-bg", "text-danger-text");
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
});
