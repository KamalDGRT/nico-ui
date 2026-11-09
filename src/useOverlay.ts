import { useEffect, useRef, useState } from "react";
import { DRAWER_TRANSITION_DURATION_MS as TRANSITION_DURATION_MS } from "./constants";

// Open/close lifecycle shared by Drawer and FloatingCard. Stays mounted
// slightly past `isOpen: false` so the close transition can play, focuses
// the first field of the body once per open, and closes on Escape unless a
// dialog opened inside the body should take it. Attach `contentRef` to the
// body element. Internal: not exported from the package.
export function useOverlay(isOpen: boolean, onClose: () => void) {
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
  // keystroke instead of only once when the overlay actually opens. Queries
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
      // A modal opened inside the overlay closes itself on Escape; the
      // overlay stays.
      if (contentRef.current?.querySelector('[role="dialog"]')) return;
      onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return { mounted, visible, contentRef };
}
