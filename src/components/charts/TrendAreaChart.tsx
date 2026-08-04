import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/components/charts/chartSetup";

interface TrendSeries {
  label: string;
  data: number[];
  color: string;
}

interface TrendAreaChartProps {
  labels: string[];
  series: TrendSeries[];
  height?: number;
}

/** Parses a "YYYY-MM-DD" label into a Date, or null if the label isn't a real date (e.g. mock "Day 1" labels). */
function parseIsoDate(label: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) return null;
  const date = new Date(`${label}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDate(label: string): string {
  const date = parseIsoDate(label);
  if (!date) return label;
  return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`;
}

function formatTooltipTitle(label: string): string {
  const date = parseIsoDate(label);
  if (!date) return label;
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function TrendAreaChartImpl({ labels, series, height = 220 }: TrendAreaChartProps) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: series.map((s, i) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: `${s.color}33`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: s.color,
        tension: 0.3,
        fill: true,
        // Each series gets its own y-axis so they're independently normalized —
        // otherwise a small-magnitude series (clicks) reads as a flat line next
        // to a large-magnitude one (impressions) sharing the same scale.
        yAxisID: i === 0 ? "y" : "y1",
      })),
    }),
    [labels, series],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#fff",
          titleColor: "#111827",
          bodyColor: "#111827",
          borderColor: "#E5E7EB",
          borderWidth: 1,
          padding: 12,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            title: (items: { label: string }[]) => (items[0] ? formatTooltipTitle(items[0].label) : ""),
            label: (item: { dataset: { label?: string }; parsed: { y: number | null } }) =>
              `${item.dataset.label}: ${(item.parsed.y ?? 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          border: { display: false },
          ticks: {
            display: true,
            color: "#9CA3AF",
            font: { size: 11 },
            callback: (_value: unknown, index: number) => formatShortDate(labels[index] ?? ""),
            maxRotation: 0,
            autoSkip: true,
            autoSkipPadding: 16,
          },
        },
        y: {
          display: true,
          position: "left" as const,
          grid: { color: "#F0F1F3" },
          border: { display: false },
          title: { display: true, text: series[0]?.label ?? "", color: "#9CA3AF", font: { size: 11 } },
          ticks: { display: true, color: "#9CA3AF", font: { size: 11 } },
          beginAtZero: true,
        },
        y1: {
          display: true,
          position: "right" as const,
          grid: { display: false },
          border: { display: false },
          title: { display: true, text: series[1]?.label ?? "", color: "#9CA3AF", font: { size: 11 } },
          ticks: { display: true, color: "#9CA3AF", font: { size: 11 } },
          beginAtZero: true,
        },
      },
    }),
    [labels, series],
  );

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export const TrendAreaChart = memo(TrendAreaChartImpl);
