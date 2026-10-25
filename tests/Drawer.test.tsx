import { act, fireEvent, render, screen } from "@testing-library/react";
import { Bell } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Drawer, Modal } from "../src";

const TRANSITION_MS = 200;

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer isOpen={false} onClose={vi.fn()} title="Test">
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and children when open", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} title="New Item">
        <p>Body content</p>
      </Drawer>,
    );
    expect(screen.getByRole("dialog", { name: "New Item" })).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("shows the icon chip only when an icon is given", () => {
    const { rerender, container } = render(
      <Drawer isOpen onClose={vi.fn()} title="Test">
        <p>Body</p>
      </Drawer>,
    );
    expect(container.querySelector("svg.lucide-bell")).toBeNull();
    rerender(
      <Drawer isOpen onClose={vi.fn()} title="Test" icon={Bell}>
        <p>Body</p>
      </Drawer>,
    );
    expect(container.querySelector("svg.lucide-bell")).not.toBeNull();
  });

  it("calls onClose on Escape and on the Close button", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("leaves Escape to a modal opened inside the drawer", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Test">
        <Modal isOpen onClose={vi.fn()} title="Confirm">
          <p>Sure?</p>
        </Modal>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose on backdrop click but not on panel click", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </Drawer>,
    );
    fireEvent.click(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first field in the body, not the close button", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} title="Test">
        <input aria-label="first" />
      </Drawer>,
    );
    expect(screen.getByLabelText("first")).toHaveFocus();
  });

  describe("close transition", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("stays mounted until the slide-out finishes, then unmounts", () => {
      const props = { onClose: vi.fn(), title: "Test", children: <p>Body</p> };
      const { rerender } = render(<Drawer isOpen {...props} />);
      rerender(<Drawer isOpen={false} {...props} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(TRANSITION_MS - 1));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("cancels the unmount if it reopens mid-transition", () => {
      const props = { onClose: vi.fn(), title: "Test", children: <p>Body</p> };
      const { rerender } = render(<Drawer isOpen {...props} />);
      rerender(<Drawer isOpen={false} {...props} />);
      act(() => vi.advanceTimersByTime(TRANSITION_MS / 2));
      rerender(<Drawer isOpen {...props} />);
      act(() => vi.advanceTimersByTime(TRANSITION_MS * 2));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
