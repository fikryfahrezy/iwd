import { formatUsd } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** A weekly price, e.g. "$6/wk". */
export function Price({
  value,
  unit = "wk",
  className,
}: {
  value: number;
  unit?: string;
  className?: string;
}) {
  return (
    <span className={cn("text-sm text-muted tabular-nums", className)}>
      <span className="font-medium text-ink">{formatUsd(value)}</span>/{unit}
    </span>
  );
}
