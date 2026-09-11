import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  /** "none" when a child owns its own padding (tables, maps). */
  padding?: "default" | "sm" | "none";
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

const PADDING = {
  default: "p-5",
  sm: "p-4",
  none: "",
} as const;

export function SectionCard({
  title,
  description,
  action,
  padding = "default",
  footer,
  className,
  children,
}: Readonly<SectionCardProps>) {
  const hasHeader = Boolean(title || action);
  return (
    <div className={cn("rounded-lg border border-border bg-card", PADDING[padding], className)}>
      {hasHeader ? (
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            description ? "mb-4" : "mb-3.5",
            padding === "none" && "border-b border-border p-5 pb-3.5",
          )}
        >
          <div className="min-w-0">
            {/* 17px/600. The old title was text-sm font-semibold — the same size as
                its own body text, compensating with weight. That flatness is
                most of why the UI read as undesigned. */}
            {title ? <h2 className="text-lg font-semibold text-foreground">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div
          className={cn(
            "border-t border-border text-sm text-muted-foreground",
            padding === "none" ? "px-5 py-3" : "mt-4 pt-3.5",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
