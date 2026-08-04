import { MetricCard } from "@/features/dashboard/components/MetricCard";
import type { DashboardMetric, DashboardTrend } from "@/types/dashboard";

const SPARKLINE_COLOR: Record<string, string> = {
  "Total clicks": "#12A150",
  Impressions: "#5B5BD6",
};

interface MetricsRowProps {
  metrics: DashboardMetric[];
  trend?: DashboardTrend;
}

export function MetricsRow({ metrics, trend }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const color = SPARKLINE_COLOR[metric.label];
        const series =
          metric.label === "Total clicks"
            ? trend?.clicksSeries
            : metric.label === "Impressions"
              ? trend?.impressionsSeries
              : undefined;
        return (
          <MetricCard
            key={metric.label}
            metric={metric}
            sparklineData={series?.slice(-14)}
            sparklineColor={color}
          />
        );
      })}
    </div>
  );
}
