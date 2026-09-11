import type { ReactNode } from "react";
import { CHANGE_ICON, CHANGE_TEXT, changeDirection, changeMagnitude, changeTone } from "@/lib/score";
import type { ChangeTone } from "@/lib/score";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  change?: string;
  /** Omit to infer from `change`. */
  changeTone?: ChangeTone;
  /** True for metrics like average position, where a falling number is an improvement. */
  lowerIsBetter?: boolean;
  caption?: string;
  footer?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeTone: toneOverride,
  lowerIsBetter = false,
  caption,
  footer,
  className,
}: Readonly<StatCardProps>) {
  // Tone is whether the change is GOOD; the arrow is which way it MOVED. For
  // average position those differ — the number falling is an improvement.
  const tone = toneOverride ?? (change ? changeTone(change, lowerIsBetter) : "neutral");
  const direction = change ? changeDirection(change) : "neutral";
  const ChangeIcon = CHANGE_ICON[direction];

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="tabular text-3xl font-semibold text-foreground">{value}</span>
        {change ? (
          <span className={cn("tabular inline-flex items-center gap-0.5 text-xs font-medium", CHANGE_TEXT[tone])}>
            <ChangeIcon className="size-3" aria-hidden="true" />
            {/* The glyph is stripped from the text so the icon doesn't double
                it up as "↑ ▲ 12.4%". */}
            {changeMagnitude(change)}
          </span>
        ) : null}
      </div>
      {caption ? <div className="mt-1 text-2xs text-muted-foreground">{caption}</div> : null}
      {footer ? <div className="mt-3 border-t border-border pt-3">{footer}</div> : null}
    </div>
  );
}
