"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { DEFAULT_FLOATING_CARD_WIDTH_CLASS } from "./constants";
import { useOverlay } from "./useOverlay";

// A drawer that floats: a rounded card inset from the top-right corner of
// the screen instead of a full-height slide-over, over a dimmed backdrop.
// Opens, closes and dismisses exactly like Drawer (Escape, backdrop click,
// Close button, 200 ms transition, first field focused). The header can
// carry a subtitle under the title, and `footer` is pinned under the
// scrolling body for the action buttons.
export function FloatingCard({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  widthClassName = DEFAULT_FLOATING_CARD_WIDTH_CLASS,
  closeButtonClassName,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Small line under the title, e.g. the name of what the card is about.
  subtitle?: string;
  // Pinned under the body, outside the scroll area.
  footer?: ReactNode;
  // Replaces the default width, e.g. "sm:w-[28rem]".
  widthClassName?: string;
  // Added to the close button, e.g. "min-h-10 min-w-10" for a larger tap target.
  closeButtonClassName?: string;
  children: ReactNode;
}) {
  const { mounted, visible, contentRef } = useOverlay(isOpen, onClose);

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
        className={`fixed right-4 top-4 flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated shadow-lg transition duration-200 ${widthClassName} ${
          visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        }`}
      >
        <div className="flex min-h-14 items-center justify-between gap-2 border-b border-border-subtle py-2 pl-5 pr-2.5">
          <div className="flex min-w-0 flex-col">
            <p className="break-words text-sm font-semibold text-foreground">
              {title}
            </p>
            {subtitle && (
              <span className="break-words text-xs text-muted">{subtitle}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`inline-flex shrink-0 items-center justify-center rounded p-1.5 text-muted hover:bg-surface-hover hover:text-foreground ${closeButtonClassName ?? ""}`}
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto p-5">
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle bg-surface-elevated px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
