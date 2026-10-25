"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";

export type PromptField = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  optional?: boolean;
};

// One or more labeled text inputs + Cancel/OK — replaces window.prompt.
// Submits all fields together (name -> value) so callers that used to chain
// sequential prompt() calls can collect them in one dialog instead.
export function PromptModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  submitLabel = "OK",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: PromptField[];
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(
        Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
      );
    }
    // Only reset when the dialog opens, not on every field-prop identity
    // change — fields is recreated per render by callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const canSubmit = fields.every(
    (f) => f.optional || (values[f.name] ?? "").trim(),
  );

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(
      Object.fromEntries(fields.map((f) => [f.name, values[f.name].trim()])),
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="mb-4 space-y-3">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                {f.label}
              </span>
              <input
                type="text"
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [f.name]: e.target.value }))
                }
                placeholder={f.placeholder}
                className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-cta px-3 py-1.5 text-sm font-medium text-cta-foreground hover:bg-cta-hover hover:font-semibold disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
