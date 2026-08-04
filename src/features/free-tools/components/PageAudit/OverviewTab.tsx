import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { PageAuditResult } from "@/types/pageAudit";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#f97316" : "#ef4444";
  return (
    <div
      className="relative flex size-40 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)` }}
    >
      <div className="flex size-32 flex-col items-center justify-center rounded-full bg-card">
        <span className="text-3xl font-extrabold text-foreground">{score}%</span>
        <span className="text-xs text-muted-foreground">Overall</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, value }: { label: string; value: number }) {
  const color = value >= 85 ? "bg-emerald-500" : value >= 65 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[13px] text-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function OverviewTab({ result }: { result: PageAuditResult }) {
  const scores = result.categoryScores!;
  const keyword = result.keywordPerformance!;

  const checks = [
    { label: "Keyword In Meta Title", ok: keyword.inMetaTitle },
    { label: "Keyword In Meta Description", ok: keyword.inMetaDescription },
    { label: "Keyword In H1 Heading", ok: keyword.inH1 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SectionCard title="SEO Score">
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={result.seoScore!} />
          <Badge variant={result.seoScore! >= 90 ? "default" : "destructive"}>{result.scoreStatus}</Badge>
          <div className="mt-2 flex w-full flex-col gap-2">
            <CategoryBar label="Metadata" value={scores.metadata} />
            <CategoryBar label="Content" value={scores.content} />
            <CategoryBar label="Headings" value={scores.headings} />
            <CategoryBar label="Keywords" value={scores.keywords} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Keyword Performance">
        <p className="-mt-2 mb-3 text-[13px] text-muted-foreground">Given Keyword: "{keyword.keyword}"</p>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-foreground">Keyword Density:</span>
          <Badge variant={keyword.densityStatus === "too_high" ? "destructive" : "default"}>
            {keyword.density.toFixed(1)}% {keyword.densityStatus === "too_high" ? "(Too High)" : ""}
          </Badge>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between text-[13px]">
              <span className="text-foreground">{check.label}</span>
              {check.ok ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-4 text-orange-500" />
              )}
            </div>
          ))}
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground">Keyword Occurrences</span>
            <span className="font-semibold text-foreground">{keyword.occurrences}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recommendations">
        <div className="flex flex-col gap-3">
          {result.recommendations!.map((rec) => (
            <div key={rec.title} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-500" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{rec.title}</p>
                <p className="text-[12.5px] text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
