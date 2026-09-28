/** Keyboard focus ring shared by every interactive element. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** Focus ring for a label that wraps a visually hidden input. */
export const focusRingWithin =
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand";

/**
 * Border treatment for anything the user can pick (cards, options).
 * The selected ring is drawn by an inset pseudo-element, so it stays
 * visible above full-bleed content (like a scene) and never spills
 * outside the element, where a scrolling parent would clip it.
 *
 * `emphasis: "soft"` gives a lighter 1px ring for multi-select lists.
 */
export function selectable(
  selected: boolean,
  emphasis: "strong" | "soft" = "strong",
) {
  const base =
    "relative border transition after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:transition";
  if (!selected) return `${base} border-line hover:border-line-strong`;
  return emphasis === "strong"
    ? `${base} border-ink after:shadow-[inset_0_0_0_1px_var(--color-ink)]`
    : `${base} border-ink/70`;
}
