import { GaugeChart } from "@/components/charts/GaugeChart";
import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  score: number;
  indexed: string;
  openIssues: number;
  quickWins: number;
  domainAuthority: number | null;
  variant?: "light" | "dark";
}

function healthLabel(score: number): string {
  if (score >= 80) return "GOOD";
  if (score >= 60) return "FAIR";
  return "NEEDS WORK";
}

export function HealthScoreCard({
  score,
  indexed,
  openIssues,
  quickWins,
  domainAuthority,
  variant = "light",
}: HealthScoreCardProps) {
  const dark = variant === "dark";
  const label = healthLabel(score);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-5",
        dark
          ? "items-center justify-center border-transparent bg-[linear-gradient(160deg,#17181D,#23252D)] text-white"
          : "border-border bg-card",
      )}
    >
      <div className={cn("mb-1 text-sm font-bold", dark ? "self-start text-[#AEB4BE]" : "text-foreground")}>
        SEO Health Score
      </div>
      <div className="my-1.5 self-center">
        <GaugeChart score={score} label={label} color={dark ? "#F0A93B" : "#E0900B"} dark={dark} />
      </div>
      {dark ? (
        <>
          <p className="text-center text-[13px] leading-relaxed text-[#AEB4BE]">
            Fixing the 3 high-priority issues could raise this to <b className="text-[#12D06A]">~86</b>.
          </p>
          <div className="mt-2 flex justify-between text-[13px]">
            <span className="text-[#AEB4BE]">Domain authority</span>
            <span className="font-bold text-white">{domainAuthority ?? "—"}</span>
          </div>
        </>
      ) : (
        <div className="mt-1.5 flex flex-col gap-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Indexed pages</span>
            <span className="font-bold">{indexed}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Open issues</span>
            <span className="font-bold text-destructive">{openIssues}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Quick wins</span>
            <span className="font-bold text-primary">{quickWins}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Domain authority</span>
            <span className="font-bold">{domainAuthority ?? "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
