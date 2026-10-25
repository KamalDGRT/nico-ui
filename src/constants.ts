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
