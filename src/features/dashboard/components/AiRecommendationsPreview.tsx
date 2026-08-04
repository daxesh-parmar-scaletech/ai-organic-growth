import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";

const PRIORITY_DOT: Record<Recommendation["priority"], string> = {
  High: "bg-destructive",
  Medium: "bg-brand-medium",
  Low: "bg-brand-low",
};

interface AiRecommendationsPreviewProps {
  recommendations: Recommendation[];
  projectId: string;
}

export function AiRecommendationsPreview({ recommendations, projectId }: AiRecommendationsPreviewProps) {
  const navigate = useNavigate();
  const topThree = recommendations.slice(0, 3);
  const highPriorityCount = recommendations.filter((r) => r.priority === "High").length;

  return (
    <div className="rounded-2xl border border-[#E4E4F5] bg-[linear-gradient(135deg,#F2F1FD,#EAF7F0)] p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[30px] items-center justify-center rounded-lg bg-brand-indigo text-white">
            <Sparkles className="size-[17px]" />
          </span>
          <span className="text-[15px] font-bold">AI Growth Recommendations</span>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-indigo">
          {highPriorityCount} high priority
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {topThree.map((reco) => (
          <div key={reco.id} className="flex gap-3 rounded-[11px] bg-white/70 px-3.5 py-3">
            <span className={`mt-1 size-2 shrink-0 rounded-full ${PRIORITY_DOT[reco.priority]}`} />
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] leading-snug font-semibold">{reco.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Impact <b className="text-primary">{reco.impact}</b> · {reco.effort} effort
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="dark" className="mt-1.5 w-full" onClick={() => navigate(`/app/${projectId}/competitors`)}>
        View all recommendations
      </Button>
    </div>
  );
}
