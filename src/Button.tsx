"use client";

import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
} from "react";
import {
  BUTTON_HOVER_CLASSES,
  BUTTON_RIPPLE_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  RIPPLE_FADE_MS,
  RIPPLE_GROW_MS,
  type ButtonSize,
  type ButtonVariant,
} from "./constants";

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// Text button in the three looks the dialogs and drawers use: filled `primary`
// (the CTA), white `secondary` with a border, and `danger` for the
// destructive action. `size="sm"` is the compact form for buttons inside a
// body. Takes every normal button attribute; `type` defaults to "button" so
// it never submits a surrounding form by accident.
//
// Hovering with a mouse or pen paints a ripple: a circle grows from where
// the pointer entered to cover the button, and fades when it leaves. It is
// skipped for touch and when the user asked for reduced motion; pass
// `ripple={false}` for a plain instant hover fill instead.
//
// `variantClassName`, `sizeClassName` and `rippleClassName` replace the
// colors, the height and padding, and the ripple fill, so the look can be
// changed from the calling app without a new release of this package;
// `className` is added on top.
export function Button({
  variant = "primary",
  size = "md",
  ripple = true,
  variantClassName,
  sizeClassName,
  rippleClassName,
  type = "button",
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ripple?: boolean;
  variantClassName?: string;
  sizeClassName?: string;
  rippleClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  // Drop a ripple still on screen if the button unmounts mid-hover.
  useEffect(() => () => rippleRef.current?.remove(), []);

  function startRipple(event: PointerEvent<HTMLButtonElement>) {
    onPointerEnter?.(event);
    if (!ripple || event.pointerType === "touch" || prefersReducedMotion()) {
      return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Reaches the farthest corner, so the whole button ends up covered.
    const radius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y),
    );
    const circle = document.createElement("span");
    circle.className = `pointer-events-none absolute rounded-full ${rippleClassName ?? BUTTON_RIPPLE_CLASSES[variant]}`;
    circle.style.left = `${x - radius}px`;
    circle.style.top = `${y - radius}px`;
    circle.style.width = circle.style.height = `${radius * 2}px`;
    button.prepend(circle);
    // No Web Animations support: leave the plain button, no half-drawn circle.
    if (typeof circle.animate !== "function") {
      circle.remove();
      return;
    }
    rippleRef.current?.remove();
    rippleRef.current = circle;
    circle.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
      duration: RIPPLE_GROW_MS,
      easing: "ease-out",
      fill: "forwards",
    });
  }

  function endRipple(event: PointerEvent<HTMLButtonElement>) {
    onPointerLeave?.(event);
    const circle = rippleRef.current;
    if (!circle) return;
    rippleRef.current = null;
    const fade = circle.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: RIPPLE_FADE_MS,
      fill: "forwards",
    });
    const remove = () => circle.remove();
    fade.finished.then(remove, remove);
  }

  const hover =
    !ripple && variantClassName === undefined ? BUTTON_HOVER_CLASSES[variant] : "";

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-lg font-semibold disabled:pointer-events-none disabled:opacity-50 ${sizeClassName ?? BUTTON_SIZE_CLASSES[size]} ${variantClassName ?? BUTTON_VARIANT_CLASSES[variant]} ${hover} ${className ?? ""}`}
      onPointerEnter={startRipple}
      onPointerLeave={endRipple}
      {...rest}
    >
      {/* Above the ripple, which is absolutely positioned behind it. */}
      <span className="relative inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
