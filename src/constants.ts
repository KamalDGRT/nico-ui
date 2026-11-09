// Must match the `duration-200` Tailwind class on the drawer panel.
export const DRAWER_TRANSITION_DURATION_MS = 200;

// Tailwind class: widest the drawer panel gets on larger screens.
export const DEFAULT_DRAWER_WIDTH_CLASS = "sm:max-w-md";

export type DrawerSide = "left" | "right";

// Tailwind classes per side: where the panel is pinned, which edge gets the
// border, and where it sits while closed (off-screen, so it slides in).
export const DRAWER_SIDE_CLASSES: Record<
  DrawerSide,
  { pinned: string; border: string; closed: string }
> = {
  right: { pinned: "right-0", border: "border-l", closed: "translate-x-full" },
  left: { pinned: "left-0", border: "border-r", closed: "-translate-x-full" },
};

// Tailwind class: width of the floating card on larger screens (on narrow
// screens it is the viewport minus the 1 rem gap on each side).
export const DEFAULT_FLOATING_CARD_WIDTH_CLASS = "sm:w-[540px]";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "md" | "sm";

// Tailwind classes per Button look. Colors are theme tokens only.
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-cta text-cta-foreground hover:bg-cta-hover",
  secondary:
    "border border-border bg-surface-elevated text-foreground hover:bg-surface-hover",
  danger: "bg-danger-text text-cta-foreground hover:brightness-90",
};

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-10 px-[18px] text-sm",
  sm: "min-h-[34px] px-3.5 text-[13px]",
};
