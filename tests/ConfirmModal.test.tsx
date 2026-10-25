import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmModal } from "../src";

const baseProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  title: "Delete thing",
  message: "Are you sure?",
};

describe("ConfirmModal", () => {
  it("shows the title and message", () => {
    render(<ConfirmModal {...baseProps} />);
    expect(screen.getByRole("dialog", { name: "Delete thing" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("defaults the confirm label to Confirm", () => {
    render(<ConfirmModal {...baseProps} />);
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal {...baseProps} onConfirm={onConfirm} confirmLabel="Delete" danger />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel is clicked and never confirms", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<ConfirmModal {...baseProps} onClose={onClose} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("renders and wires up the optional secondary button", () => {
    const onSecondary = vi.fn();
    render(
      <ConfirmModal
        {...baseProps}
        secondaryLabel="Mark Inactive"
        onSecondary={onSecondary}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Mark Inactive" }));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it("hides the secondary button unless both label and handler are given", () => {
    render(<ConfirmModal {...baseProps} secondaryLabel="Mark Inactive" />);
    expect(screen.queryByRole("button", { name: "Mark Inactive" })).not.toBeInTheDocument();
  });

  it("styles the confirm button as destructive only when danger is set", () => {
    const { rerender } = render(<ConfirmModal {...baseProps} confirmLabel="Go" />);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("bg-cta");
    rerender(<ConfirmModal {...baseProps} confirmLabel="Go" danger />);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("bg-danger-bg");
  });
});
