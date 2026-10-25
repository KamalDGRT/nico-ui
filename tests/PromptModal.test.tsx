import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptModal, type PromptField } from "../src";

const FIELDS: PromptField[] = [
  { name: "name", label: "Name", defaultValue: "Ada" },
  { name: "note", label: "Note", optional: true },
];

function renderPrompt(onSubmit = vi.fn(), fields = FIELDS) {
  render(
    <PromptModal isOpen onClose={vi.fn()} onSubmit={onSubmit} title="Rename" fields={fields} />,
  );
  return onSubmit;
}

describe("PromptModal", () => {
  it("prefills defaults and submits every field trimmed, keyed by name", () => {
    const onSubmit = renderPrompt();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "  Grace  " } });
    fireEvent.change(screen.getByLabelText("Note"), { target: { value: " hi " } });
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Grace", note: "hi" });
  });

  it("keeps submit disabled and does not submit while a required field is blank", () => {
    const onSubmit = renderPrompt();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "   " } });
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("allows an empty optional field", () => {
    const onSubmit = renderPrompt();
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada", note: "" });
  });

  it("uses a custom submit label and cancels via onClose", () => {
    const onClose = vi.fn();
    render(
      <PromptModal
        isOpen
        onClose={onClose}
        onSubmit={vi.fn()}
        title="Rename"
        fields={FIELDS}
        submitLabel="Save"
      />,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets the fields to their defaults each time it opens", () => {
    const props = { onClose: vi.fn(), onSubmit: vi.fn(), title: "Rename", fields: FIELDS };
    const { rerender } = render(<PromptModal isOpen {...props} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "edited" } });
    rerender(<PromptModal isOpen={false} {...props} />);
    rerender(<PromptModal isOpen {...props} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
  });
});
