"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type SearchableSelectOption<T extends string | number = number> = {
  id: T;
  label: string;
  // Optional leading icon, shown in the list and on the trigger once picked.
  icon?: ReactNode;
};

// Searchable single-select whose ids may be strings or numbers, so enum
// values like "near_future" work too.
// Hand-rolled rather than a library so it stays on the Tailwind theme tokens
// instead of shipping a second UI runtime.
// `allLabel`, when given, renders as the null-value option pinned above
// the search results (e.g. "All Classrooms").
export function SearchableSelect<T extends string | number = number>({
  options,
  value,
  onChange,
  allLabel,
  placeholder = "Search…",
  className,
  compact = false,
  ariaLabel,
}: {
  options: SearchableSelectOption<T>[];
  value: T | null;
  onChange: (id: T | null) => void;
  allLabel?: string;
  placeholder?: string;
  className?: string;
  // Shorter trigger, search box and rows — for toolbars and tree rows.
  compact?: boolean;
  // Names the trigger button for screen readers (and tests).
  ariaLabel?: string;
}) {
  const triggerSize = compact ? "py-0.5 text-xs" : "py-1.5 text-sm";
  const rowSize = compact ? "py-0.5 text-xs" : "py-1 text-sm";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Focus-only side effect (no setState here) — safe to run whenever
  // `open` flips, unlike resetting `query`, which happens in toggleOpen
  // below so it's tied to the user's click, not a render.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [options, query],
  );

  const selected = options.find((o) => o.id === value);
  const selectedLabel =
    value === null ? (allLabel ?? "Select…") : (selected?.label ?? "Select…");

  function toggleOpen() {
    setOpen((wasOpen) => {
      const nowOpen = !wasOpen;
      if (nowOpen) setQuery("");
      return nowOpen;
    });
  }

  function select(id: T | null) {
    onChange(id);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 ${triggerSize} text-left text-foreground`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon}
          <span className="min-w-0 break-words">{selectedLabel}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-48 rounded-md border border-border-subtle bg-surface-elevated p-2 shadow-lg">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`mb-2 w-full rounded-md border border-border bg-surface px-2 ${rowSize} text-foreground`}
          />
          <ul className="max-h-56 overflow-y-auto">
            {allLabel && !query.trim() && (
              <li>
                <button
                  type="button"
                  onClick={() => select(null)}
                  className={`block w-full rounded px-2 ${rowSize} text-left hover:bg-surface-hover ${
                    value === null ? "font-medium text-cta" : "text-foreground"
                  }`}
                >
                  {allLabel}
                </button>
              </li>
            )}
            {filtered.length === 0 && (
              <li className={`px-2 ${rowSize} text-muted`}>No matches</li>
            )}
            {filtered.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => select(option.id)}
                  className={`flex w-full items-center gap-2 rounded px-2 ${rowSize} text-left hover:bg-surface-hover ${
                    value === option.id
                      ? "font-medium text-cta"
                      : "text-foreground"
                  }`}
                >
                  {option.icon}
                  <span className="min-w-0 break-words">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
