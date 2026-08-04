import { SectionCard } from "@/components/common/SectionCard";
import { Progress } from "@/components/ui/progress";
import type { CwvMetric } from "@/types/seo";

const STATUS_CLASSES: Record<CwvMetric["status"], string> = {
  Good: "bg-primary/10 text-primary",
  "Needs work": "bg-brand-medium/10 text-brand-medium",
  Poor: "bg-destructive/10 text-destructive",
};

function scoreColorClass(score: number): string {
  if (score >= 90) return "text-primary";
  if (score >= 50) return "text-brand-medium";
  return "text-destructive";
}

interface CoreWebVitalsCardProps {
  metrics: CwvMetric[];
  title?: string;
  score?: number | null;
}

export function CoreWebVitalsCard({ metrics, title = "Core Web Vitals", score }: CoreWebVitalsCardProps) {
  return (
    <SectionCard
      title={title}
      action={
        typeof score === "number" ? (
          <span className={`text-lg font-bold ${scoreColorClass(score)}`}>{score}</span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="font-semibold">
                {metric.label} — {metric.name}
              </span>
              <span className="font-bold">
                {metric.value} ·{" "}
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_CLASSES[metric.status]}`}>
                  {metric.status}
                </span>
              </span>
            </div>
            <Progress value={metric.percent} className="h-1.75" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
