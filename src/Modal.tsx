"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Centered modal — replaces window.alert/confirm/prompt. Backdrop click +
// Escape both close; first focusable element gets focus on open. No focus
// trap: one dialog at a time is the supported case.
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Separate from the Escape-key effect below: `onClose` is typically an
  // inline arrow function from the caller, a new reference on every
  // keystroke-triggered re-render — if this ran on every `onClose` identity
  // change too, it would steal focus back to the first field on every
  // keystroke instead of only once when the dialog actually opens.
  useEffect(() => {
    if (!isOpen) return;
    cardRef.current
      ?.querySelector<HTMLElement>("input, button, textarea, select")
      ?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={
          className ??
          "w-80 rounded-lg border-2 border-border bg-surface-elevated p-4"
        }
      >
        <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
        {children}
      </div>
    </div>
  );
}
