import { memo, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "@/components/charts/chartSetup";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  score: number;
  label: string;
  color: string;
  trackColor?: string;
  dark?: boolean;
  size?: number;
}

/** Semicircle gauge built from a 2-segment Doughnut (value + remainder), rotated to sweep 180°. */
function GaugeChartImpl({ score, label, color, trackColor, dark = false, size = 200 }: GaugeChartProps) {
  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: [score, 100 - score],
          backgroundColor: [color, trackColor ?? (dark ? "rgba(255,255,255,.14)" : "#EDEFF2")],
          borderWidth: 0,
        },
      ],
    }),
    [score, color, trackColor, dark],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      circumference: 180,
      rotation: 270,
      cutout: "78%",
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    }),
    [],
  );

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 8 }}>
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-x-0 bottom-1 text-center">
        <div className="text-[38px] leading-none font-extrabold tracking-tight text-foreground">{score}</div>
        <div className={cn("text-xs font-bold", dark ? "text-amber-400" : "")} style={dark ? undefined : { color }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export const GaugeChart = memo(GaugeChartImpl);
