import type { ComponentProps, ReactNode } from "react";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "dark"
  | "secondary"
  | "subtle"
  | "ghost"
  | "plain";
export type ButtonSize = "sm" | "lg";

const variants: Record<ButtonVariant, string> = {
  /** Main call to action. One per view. */
  primary: "bg-brand text-white hover:bg-brand-strong",
  /** Strong neutral action, e.g. "Done". */
  dark: "bg-ink text-white hover:bg-ink/85",
  /** Outlined, for secondary actions. */
  secondary:
    "border border-line-strong bg-surface text-ink hover:bg-subtle disabled:border-line",
  /** Filled grey, for an "on" state that shouldn't shout. */
  subtle: "bg-subtle text-ink hover:bg-line",
  /** Text-only, muted until hovered. */
  ghost: "text-muted hover:bg-subtle hover:text-ink",
  /** Text-only, full contrast. */
  plain: "text-ink hover:bg-subtle",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-2.5 text-[13px]",
  lg: "h-11 gap-2 rounded-xl px-5 text-[15px]",
};

export type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. */
  icon?: ReactNode;
  /** Icon shown after the label. */
  iconEnd?: ReactNode;
  children: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "sm",
  icon,
  iconEnd,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition disabled:pointer-events-none disabled:text-faint",
        sizes[size],
        variants[variant],
        focusRing,
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {iconEnd}
    </button>
  );
}

export type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "aria-label"
> & {
  /** Accessible name; icon-only buttons must have one. */
  label: string;
  children: ReactNode;
};

/** Square, icon-only button (close, etc.). */
export function IconButton({
  label,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-subtle hover:text-ink",
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
