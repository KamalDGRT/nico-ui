import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Star } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { SearchableSelect } from "../src";

const STRING_OPTIONS = [
  { id: "near_future", label: "Near future" },
  { id: "way_far", label: "Way far" },
  { id: "tool", label: "Tools (shared)" },
];

const NUMBER_OPTIONS = [
  { id: 1, label: "Animation" },
  { id: 2, label: "Game" },
];

function setup(value: string | null = null, allLabel?: string) {
  const onChange = vi.fn();
  render(
    <SearchableSelect
      ariaLabel="List"
      options={STRING_OPTIONS}
      value={value}
      onChange={onChange}
      allLabel={allLabel}
    />,
  );
  return onChange;
}

describe("SearchableSelect", () => {
  it("shows the selected option's label on the trigger", () => {
    setup("way_far");
    expect(screen.getByRole("button", { name: "List" })).toHaveTextContent("Way far");
  });

  it("shows Select… when nothing is selected, or the allLabel when one is given", () => {
    const { unmount } = render(
      <SearchableSelect ariaLabel="List" options={STRING_OPTIONS} value={null} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "List" })).toHaveTextContent("Select…");
    unmount();
    setup(null, "Any list");
    expect(screen.getByRole("button", { name: "List" })).toHaveTextContent("Any list");
  });

  it("typing filters the options, case-insensitively", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.type(screen.getByPlaceholderText("Search…"), "TOO");
    expect(screen.getByRole("button", { name: "Tools (shared)" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Way far" })).toBeNull();
  });

  it("says 'No matches' when nothing fits", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.type(screen.getByPlaceholderText("Search…"), "zzz");
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("picking reports the string id and closes the panel", async () => {
    const user = userEvent.setup();
    const onChange = setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(screen.getByRole("button", { name: "Way far" }));
    expect(onChange).toHaveBeenCalledWith("way_far");
    expect(screen.queryByPlaceholderText("Search…")).toBeNull();
  });

  it("reports numeric ids as numbers", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchableSelect options={NUMBER_OPTIONS} value={null} onChange={onChange} ariaLabel="Type" />);
    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(screen.getByRole("button", { name: "Game" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("allLabel is a null-value option pinned on top, hidden while searching", async () => {
    const user = userEvent.setup();
    const onChange = setup("tool", "Any list");
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.type(screen.getByPlaceholderText("Search…"), "far");
    expect(screen.queryByRole("button", { name: "Any list" })).toBeNull();
    await user.clear(screen.getByPlaceholderText("Search…"));
    await user.click(screen.getByRole("button", { name: "Any list" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("clicking outside closes the panel", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(document.body);
    expect(screen.queryByPlaceholderText("Search…")).toBeNull();
  });

  it("exposes expanded state and clears the search each time it reopens", async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole("button", { name: "List" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.type(screen.getByPlaceholderText("Search…"), "far");
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.getByPlaceholderText("Search…")).toHaveValue("");
  });

  it("focuses the search box when opened", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByPlaceholderText("Search…")).toHaveFocus();
  });

  it("shows an option's icon on the trigger once it is picked", () => {
    const { container } = render(
      <SearchableSelect
        ariaLabel="Type"
        options={[{ id: 1, label: "Starred", icon: <Star /> }]}
        value={1}
        onChange={vi.fn()}
      />,
    );
    expect(container.querySelector("svg.lucide-star")).not.toBeNull();
  });
});

describe("SearchableSelect compact", () => {
  function trigger(compact?: boolean) {
    render(<SearchableSelect options={NUMBER_OPTIONS} value={1} onChange={() => {}} compact={compact} />);
    return screen.getByRole("button", { name: /Animation/ });
  }

  it("uses the standard row height by default", () => {
    expect(trigger()).toHaveClass("py-1.5", "text-sm");
  });

  it("compact shrinks the trigger, the search box and the rows", async () => {
    const user = userEvent.setup();
    const button = trigger(true);
    expect(button).toHaveClass("py-0.5", "text-xs");
    expect(button).not.toHaveClass("py-1.5");

    await user.click(button);
    expect(screen.getByPlaceholderText("Search…")).toHaveClass("py-0.5", "text-xs");
    expect(screen.getByRole("button", { name: "Game" })).toHaveClass("py-0.5", "text-xs");
  });
});
