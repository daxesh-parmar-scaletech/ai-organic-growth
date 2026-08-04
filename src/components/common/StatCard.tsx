import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  footer?: ReactNode;
  className?: string;
}

const CHANGE_TONE_CLASSES: Record<NonNullable<StatCardProps["changeTone"]>, string> = {
  positive: "bg-primary/10 text-primary",
  negative: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, change, changeTone = "positive", footer, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        {change ? (
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", CHANGE_TONE_CLASSES[changeTone])}>
            {change}
          </span>
        ) : null}
      </div>
      <div className="mt-2 mb-1.5 text-[28px] leading-none font-extrabold tracking-tight text-foreground">
        {value}
      </div>
      {footer}
    </div>
  );
}
