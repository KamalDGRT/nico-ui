import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingCard, Modal } from "../src";

const TRANSITION_MS = 200;

describe("FloatingCard", () => {
  it("renders nothing when closed", () => {
    render(
      <FloatingCard isOpen={false} onClose={vi.fn()} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title, subtitle and children when open", () => {
    render(
      <FloatingCard isOpen onClose={vi.fn()} title="Guardian contacts" subtitle="Maya Chen">
        <p>Body content</p>
      </FloatingCard>,
    );
    expect(screen.getByRole("dialog", { name: "Guardian contacts" })).toBeInTheDocument();
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("omits the subtitle line when none is given", () => {
    render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    const header = screen.getByText("Test").parentElement!;
    expect(header.children).toHaveLength(1);
  });

  it("floats inset from the top-right corner, not pinned full height", () => {
    render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    const card = screen.getByRole("dialog");
    expect(card).toHaveClass("right-4", "top-4", "rounded-[14px]", "max-h-[calc(100vh-2rem)]");
    expect(card).not.toHaveClass("inset-y-0", "right-0");
  });

  it("uses the default width, and widthClassName replaces it", () => {
    const { rerender } = render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("sm:w-[540px]");
    rerender(
      <FloatingCard isOpen onClose={vi.fn()} title="Test" widthClassName="sm:w-[28rem]">
        <p>Body</p>
      </FloatingCard>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("sm:w-[28rem]");
    expect(screen.getByRole("dialog")).not.toHaveClass("sm:w-[540px]");
  });

  it("pins the footer outside the scrolling body, only when given", () => {
    const { rerender } = render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
    rerender(
      <FloatingCard isOpen onClose={vi.fn()} title="Test" footer={<button>Save</button>}>
        <p>Body</p>
      </FloatingCard>,
    );
    const save = screen.getByRole("button", { name: "Save" });
    expect(screen.getByText("Body").parentElement).not.toContainElement(save);
  });

  it("classNames replaces only the parts it names and keeps the rest", () => {
    render(
      <FloatingCard
        isOpen
        onClose={vi.fn()}
        title="Test"
        subtitle="Sub"
        footer={<button>Save</button>}
        classNames={{
          card: "rounded-none bg-white",
          title: "text-lg",
          body: "p-2",
          footer: "px-1",
        }}
      >
        <p>Body</p>
      </FloatingCard>,
    );
    const card = screen.getByRole("dialog");
    expect(card).toHaveClass("rounded-none", "bg-white", "right-4", "top-4", "flex-col");
    expect(card).not.toHaveClass("rounded-[14px]", "shadow-xl");
    expect(screen.getByText("Test")).toHaveClass("text-lg");
    expect(screen.getByText("Test")).not.toHaveClass("font-bold");
    expect(screen.getByText("Sub")).toHaveClass("text-[13px]", "text-muted");
    expect(screen.getByText("Body").parentElement).toHaveClass("p-2", "overflow-y-auto");
    expect(screen.getByRole("button", { name: "Save" }).parentElement).toHaveClass("px-1", "flex");
  });

  it("closeButtonClassName is added to the Close button without dropping its defaults", () => {
    render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test" closeButtonClassName="min-h-10 min-w-10">
        <p>Body</p>
      </FloatingCard>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass(
      "min-h-10",
      "min-w-10",
      "text-muted",
    );
  });

  it("calls onClose on Escape and on the Close button", () => {
    const onClose = vi.fn();
    render(
      <FloatingCard isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("leaves Escape to a modal opened inside the card", () => {
    const onClose = vi.fn();
    render(
      <FloatingCard isOpen onClose={onClose} title="Test">
        <Modal isOpen onClose={vi.fn()} title="Confirm">
          <p>Sure?</p>
        </Modal>
      </FloatingCard>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose on backdrop click but not on card click", () => {
    const onClose = vi.fn();
    render(
      <FloatingCard isOpen onClose={onClose} title="Test">
        <p>Body</p>
      </FloatingCard>,
    );
    fireEvent.click(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first field in the body, not the close button", () => {
    render(
      <FloatingCard isOpen onClose={vi.fn()} title="Test">
        <input aria-label="first" />
      </FloatingCard>,
    );
    expect(screen.getByLabelText("first")).toHaveFocus();
  });

  describe("close transition", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("starts faded and offset, settles after a frame", () => {
      render(
        <FloatingCard isOpen onClose={vi.fn()} title="Test">
          <p>Body</p>
        </FloatingCard>,
      );
      expect(screen.getByRole("dialog")).toHaveClass("opacity-0", "translate-x-4");
      act(() => vi.advanceTimersByTime(50));
      expect(screen.getByRole("dialog")).toHaveClass("opacity-100", "translate-x-0");
    });

    it("stays mounted until the exit finishes, then unmounts", () => {
      const props = { onClose: vi.fn(), title: "Test", children: <p>Body</p> };
      const { rerender } = render(<FloatingCard isOpen {...props} />);
      rerender(<FloatingCard isOpen={false} {...props} />);
      act(() => vi.advanceTimersByTime(TRANSITION_MS - 1));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
