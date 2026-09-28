import { MinusIcon, PlusIcon } from "@/components/icons";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

const stepButton = cn(
  "grid size-8 place-items-center text-ink transition hover:bg-subtle disabled:text-faint disabled:hover:bg-transparent",
  focusRing,
);

/** Compact − value + control for quantities. */
export function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
  canDecrement = value > 0,
  canIncrement = true,
}: {
  /** What is being counted, used in the accessible labels. */
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement?: boolean;
  canIncrement?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={`${label} quantity`}
      className="flex items-center rounded-lg border border-line"
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={`Remove one ${label}`}
        className={cn(stepButton, "rounded-l-lg")}
      >
        <MinusIcon className="size-3.5" />
      </button>
      <span
        className="w-6 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={`Add one ${label}`}
        className={cn(stepButton, "rounded-r-lg")}
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
