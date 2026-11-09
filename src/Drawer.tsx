"use client";

import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  DEFAULT_DRAWER_WIDTH_CLASS,
  DRAWER_SIDE_CLASSES,
  type DrawerSide,
} from "./constants";
import { useOverlay } from "./useOverlay";

// Slide-over panel, from the right by default — the "full screen right hand
// side" pattern (full width on mobile, capped on larger screens, full
// height). Pass `side="left"` for a navigation-style drawer. Stays
// mounted slightly past `isOpen: false` so the close transition can play
// instead of vanishing instantly.
export function Drawer({
  isOpen,
  onClose,
  title,
  icon: Icon,
  side = "right",
  widthClassName = DEFAULT_DRAWER_WIDTH_CLASS,
  closeButtonClassName,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Shown in a tinted chip beside the title.
  icon?: LucideIcon;
  // Edge the panel slides in from.
  side?: DrawerSide;
  // Replaces the default width cap, e.g. "sm:max-w-lg".
  widthClassName?: string;
  // Added to the close button, e.g. "min-h-10 min-w-10" for a larger tap target.
  closeButtonClassName?: string;
  children: ReactNode;
}) {
  const { mounted, visible, contentRef } = useOverlay(isOpen, onClose);

  if (!mounted) return null;

  const sideClasses = DRAWER_SIDE_CLASSES[side];

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
        className={`fixed inset-y-0 ${sideClasses.pinned} flex w-full flex-col ${sideClasses.border} border-border-subtle bg-surface-elevated shadow-lg transition-transform duration-200 ${widthClassName} ${
          visible ? "translate-x-0" : sideClasses.closed
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
            className={`inline-flex items-center justify-center rounded p-1 text-muted hover:bg-surface-hover hover:text-foreground ${closeButtonClassName ?? ""}`}
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
