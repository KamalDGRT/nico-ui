"use client";

import type { ButtonHTMLAttributes } from "react";
import { BUTTON_SIZE_CLASSES, BUTTON_VARIANT_CLASSES, type ButtonSize, type ButtonVariant } from "./constants";

// Text button in the three looks the dialogs and drawers use: filled `primary`
// (the CTA), white `secondary` with a border, and `danger` for the
// destructive action. `size="sm"` is the compact form for buttons inside a
// body. Takes every normal button attribute; `type` defaults to "button" so
// it never submits a surrounding form by accident. `variantClassName` and
// `sizeClassName` replace the colors / the height and padding of the chosen
// variant and size, so the look can be changed from the calling app without
// a new release of this package; `className` is added on top.
export function Button({
  variant = "primary",
  size = "md",
  variantClassName,
  sizeClassName,
  type = "button",
  className,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  variantClassName?: string;
  sizeClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold disabled:pointer-events-none disabled:opacity-50 ${sizeClassName ?? BUTTON_SIZE_CLASSES[size]} ${variantClassName ?? BUTTON_VARIANT_CLASSES[variant]} ${className ?? ""}`}
      {...rest}
    />
  );
}
