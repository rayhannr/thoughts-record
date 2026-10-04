import { cn } from "@/lib/utils";

/**
 * Intensity is never colour alone: the bar is also a length, and the number
 * always sits beside it.
 */
export function IntensityBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span aria-hidden className="relative h-1.5 w-20 overflow-hidden rounded-[1px] bg-rule">
        <span
          className="intensity-fill absolute inset-y-0 left-0"
          style={{ width: `${value}%`, "--v": value } as React.CSSProperties}
        />
      </span>
      <span className="w-7 text-right font-sans text-sm tabular-nums text-ink">
        <span className="sr-only">intensitas </span>
        {value}
      </span>
    </span>
  );
}
