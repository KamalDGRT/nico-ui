"use client";

import type { ButtonHTMLAttributes } from "react";
import { BUTTON_SIZE_CLASSES, BUTTON_VARIANT_CLASSES, type ButtonSize, type ButtonVariant } from "./constants";

// Text button in the three looks the dialogs and drawers use: filled `primary`
// (the CTA), white `secondary` with a border, and `danger` for the
// destructive action. `size="sm"` is the compact form for buttons inside a
// body. Takes every normal button attribute; `type` defaults to "button" so
// it never submits a surrounding form by accident.
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold disabled:pointer-events-none disabled:opacity-50 ${BUTTON_SIZE_CLASSES[size]} ${BUTTON_VARIANT_CLASSES[variant]} ${className ?? ""}`}
      {...rest}
    />
  );
}
