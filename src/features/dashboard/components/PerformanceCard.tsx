import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { SectionCard } from "@/components/common/SectionCard";
import type { DashboardTrend } from "@/types/dashboard";

interface PerformanceCardProps {
  title: string;
  trend: DashboardTrend;
}

export function PerformanceCard({ title, trend }: PerformanceCardProps) {
  return (
    <SectionCard
      title={title}
      action={
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-primary" />
            Clicks
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand-indigo" />
            Impressions
          </span>
        </div>
      }
    >
      <TrendAreaChart
        labels={trend.labels}
        series={[
          { label: "Clicks", data: trend.clicksSeries, color: "#0B6B3C" },
          { label: "Impressions", data: trend.impressionsSeries, color: "#5B5BD6" },
        ]}
      />
    </SectionCard>
  );
}
