import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../src";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and children when open", () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test modal">
        <p>Body content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog", { name: "Test modal" })).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose on backdrop click but not on card click", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first field on open and does not steal focus when onClose changes", () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} title="Test">
        <input aria-label="first" />
        <input aria-label="second" />
      </Modal>,
    );
    const first = screen.getByLabelText("first");
    const second = screen.getByLabelText("second");
    expect(first).toHaveFocus();

    second.focus();
    rerender(
      <Modal isOpen onClose={() => {}} title="Test">
        <input aria-label="first" />
        <input aria-label="second" />
      </Modal>,
    );
    expect(second).toHaveFocus();
  });

  it("uses a caller-supplied className for the card", () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test" className="custom-card">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("custom-card");
  });
});
