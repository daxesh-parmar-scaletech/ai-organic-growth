import { StatCard } from "@/components/common/StatCard";
import { SparklineChart } from "@/components/charts/SparklineChart";
import type { DashboardMetric } from "@/types/dashboard";

interface MetricCardProps {
  metric: DashboardMetric;
  sparklineData?: number[];
  sparklineColor?: string;
}

export function MetricCard({ metric, sparklineData, sparklineColor = "#0B6B3C" }: MetricCardProps) {
  return (
    <StatCard
      label={metric.label}
      value={metric.value}
      change={metric.change}
      footer={sparklineData ? <SparklineChart data={sparklineData} color={sparklineColor} /> : undefined}
    />
  );
}
