import { useMemo } from "react";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import type { ActivityLog } from "@/types/activity";

interface UsageOverTimeChartProps {
  logs: ActivityLog[];
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

export function UsageOverTimeChart({ logs }: UsageOverTimeChartProps) {
  const { labels, requestSeries, errorSeries } = useMemo(() => {
    const counts = new Map<string, { requests: number; errors: number }>();
    for (const log of logs) {
      const key = toDateKey(log.createdAt);
      const entry = counts.get(key) ?? { requests: 0, errors: 0 };
      entry.requests += 1;
      if (log.isError) entry.errors += 1;
      counts.set(key, entry);
    }
    const sortedDates = [...counts.keys()].sort();
    return {
      labels: sortedDates,
      requestSeries: sortedDates.map((date) => counts.get(date)!.requests),
      errorSeries: sortedDates.map((date) => counts.get(date)!.errors),
    };
  }, [logs]);

  if (labels.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Not enough activity yet to chart usage over time.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-sm font-semibold text-foreground">Requests over time</p>
      <TrendAreaChart
        labels={labels}
        series={[
          { label: "Requests", data: requestSeries, color: "#0B6B3C" },
          { label: "Errors", data: errorSeries, color: "#DC2626" },
        ]}
      />
    </div>
  );
}
