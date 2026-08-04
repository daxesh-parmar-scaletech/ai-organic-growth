import { SectionCard } from "@/components/common/SectionCard";
import { Progress } from "@/components/ui/progress";
import type { CwvMetric } from "@/types/seo";

const STATUS_CLASSES: Record<CwvMetric["status"], string> = {
  Good: "bg-primary/10 text-primary",
  "Needs work": "bg-brand-medium/10 text-brand-medium",
  Poor: "bg-destructive/10 text-destructive",
};

export function CwvList({ metrics }: { metrics: CwvMetric[] }) {
  return (
    <SectionCard title="Core Web Vitals">
      <div className="flex flex-col">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3.5 border-b border-border py-3 last:border-b-0">
            <div className="w-14 shrink-0">
              <div className="text-lg font-extrabold">{metric.value}</div>
              <div className="text-[11px] font-semibold text-muted-foreground">{metric.label}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 text-[13px] text-muted-foreground">{metric.name}</div>
              <Progress value={metric.percent} className="h-1.5" />
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_CLASSES[metric.status]}`}>
              {metric.status}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
