"use client";

import { Modal } from "./Modal";

// Message + Cancel/Confirm — for destructive confirmations (replaces
// window.confirm). Confirm styled danger-red when `danger` is set.
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  // Optional third button, rendered between Cancel and Confirm — for
  // dialogs offering a safe alternative to a destructive Confirm (e.g.
  // "Mark Inactive" next to "Delete Permanently"). Never itself styled
  // `danger`; that's reserved for the main destructive action.
  secondaryLabel,
  onSecondary,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-4 text-sm text-foreground">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-hover"
        >
          Cancel
        </button>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          className={
            danger
              ? "rounded-md bg-danger-bg px-3 py-1.5 text-sm font-medium text-danger-text hover:opacity-90"
              : "rounded-md bg-cta px-3 py-1.5 text-sm font-medium text-cta-foreground hover:bg-cta-hover hover:font-semibold"
          }
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
