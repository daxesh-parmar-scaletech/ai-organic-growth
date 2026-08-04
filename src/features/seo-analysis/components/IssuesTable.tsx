import { cn } from "@/lib/utils";
import type { IssueSeverity, SeoIssue } from "@/types/seo";

const SEVERITY_CLASSES: Record<IssueSeverity, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-brand-medium/10 text-brand-medium",
  Low: "bg-brand-low/10 text-brand-low",
};

const COLUMNS = "grid-cols-[1.4fr_2fr_1fr_1fr]";

export function IssuesTable({ issues }: { issues: SeoIssue[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5.5 py-4.5 text-[15px] font-bold">Detected issues</div>
      <div className={cn("grid gap-2 bg-muted/40 px-5.5 py-2.5 text-[11.5px] font-bold tracking-wide text-muted-foreground", COLUMNS)}>
        <div>ISSUE</div>
        <div>AFFECTED PAGES</div>
        <div>SEVERITY</div>
        <div>STATUS</div>
      </div>
      {issues.map((issue) => (
        <div key={issue.type} className={cn("grid items-center gap-2 border-t border-border/70 px-5.5 py-3.5 text-[13.5px]", COLUMNS)}>
          <div className="font-semibold">{issue.type}</div>
          <div className="text-muted-foreground">{issue.pages}</div>
          <div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${SEVERITY_CLASSES[issue.severity]}`}>
              {issue.severity}
            </span>
          </div>
          <div className="text-muted-foreground">{issue.status}</div>
        </div>
      ))}
    </div>
  );
}
