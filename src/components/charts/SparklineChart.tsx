import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/components/charts/chartSetup";

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
}

function SparklineChartImpl({ data, color, height = 36 }: SparklineChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((_, i) => i),
      datasets: [
        {
          data,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: false,
        },
      ],
    }),
    [data, color],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    }),
    [],
  );

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export const SparklineChart = memo(SparklineChartImpl);
