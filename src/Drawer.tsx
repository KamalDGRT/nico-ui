"use client";

import { X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DRAWER_TRANSITION_DURATION_MS as TRANSITION_DURATION_MS } from "./constants";

// Right-side slide-over panel — the "full screen right hand side" pattern
// (full width on mobile, capped on larger screens, full height). Stays
// mounted slightly past `isOpen: false` so the close transition can play
// instead of vanishing instantly.
export function Drawer({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Shown in a tinted chip beside the title.
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), TRANSITION_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Separate from the Escape-key effect below: `onClose` is typically an
  // inline arrow function from the caller, a new reference on every
  // keystroke-triggered re-render — if this ran on every `onClose` identity
  // change too, it would steal focus back to the first field on every
  // keystroke instead of only once when the drawer actually opens. Queries
  // within contentRef (the body, below the header) only, not the close
  // button, so it focuses the first real field rather than the ✕.
  useEffect(() => {
    if (!isOpen) return;
    contentRef.current
      ?.querySelector<HTMLElement>("input, button, textarea, select")
      ?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      // A modal opened inside the drawer closes itself on Escape; the
      // drawer stays.
      if (contentRef.current?.querySelector('[role="dialog"]')) return;
      onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 right-0 flex w-full flex-col border-l border-border-subtle bg-surface-elevated shadow-lg transition-transform duration-200 sm:max-w-md ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <p className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-foreground">
            {Icon && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning-text">
                <Icon aria-hidden className="h-4 w-4" />
              </span>
            )}
            <span className="break-words">{title}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
