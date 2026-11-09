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

// Parts of a FloatingCard whose look a caller can replace via `classNames`.
export type FloatingCardPart =
  | "card"
  | "header"
  | "title"
  | "subtitle"
  | "closeButton"
  | "body"
  | "footer";

// Default Tailwind classes per part. Positioning, flex layout and the
// open/close transition stay in the component so an override can't break
// how the card sits and animates.
export const FLOATING_CARD_CLASSES: Record<FloatingCardPart, string> = {
  card: "rounded-[14px] border border-border-subtle bg-surface-elevated shadow-xl",
  header:
    "min-h-[60px] border-b border-border-subtle py-2 pl-[18px] pr-2.5 sm:pl-6",
  title: "break-words text-[17px] font-bold leading-snug text-foreground",
  subtitle: "break-words text-[13px] text-muted",
  closeButton:
    "h-[38px] w-[38px] rounded-lg text-muted hover:bg-surface-hover hover:text-foreground",
  body: "px-[18px] pb-5 pt-[18px] sm:px-6 sm:pb-6 sm:pt-[22px]",
  footer:
    "border-t border-border-subtle bg-surface-elevated px-[18px] py-3 sm:px-6 sm:py-3.5",
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
