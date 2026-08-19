import {
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import { useRef } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { useCompetitorAudit } from "@/hooks/queries/usePageAudit";
import {
  buildCompetitorComparisonDoc,
  downloadHtmlAsDoc,
  printElementAsPdf,
} from "@/lib/exportDocument";

function ScoreRing({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="relative flex size-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)`,
      }}
    >
      <div className="flex size-[104px] flex-col items-center justify-center rounded-full bg-card">
        <span className="text-2xl font-extrabold text-foreground">
          {score}%
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  you,
  competitor,
}: {
  label: string;
  you: number;
  competitor: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[13px] text-foreground">{label}</span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${you}%` }}
          />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-red-500"
            style={{ width: `${competitor}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CompetitorTab({
  yourUrl,
  competitorUrl,
  onCompetitorUrlChange,
  competitorAudit,
}: {
  yourUrl: string | undefined;
  competitorUrl: string;
  onCompetitorUrlChange: (value: string) => void;
  competitorAudit: ReturnType<typeof useCompetitorAudit>;
}) {
  const comparison = competitorAudit.data;
  const resultsRef = useRef<HTMLDivElement>(null);

  const canSubmit = !!yourUrl && competitorUrl.trim().length > 0;

  const handleAnalyze = () => {
    if (!canSubmit || !yourUrl) return;
    competitorAudit.mutate({
      url: yourUrl,
      competitorUrl: competitorUrl.trim(),
    });
  };

  const handleDownloadPdf = () => {
    if (!resultsRef.current) return;
    printElementAsPdf(resultsRef.current, "Competitor Analysis");
  };

  const handleDownloadDoc = () => {
    if (!comparison) return;
    const namePart = comparison.competitorUrl.replace(/[^a-z0-9]+/gi, "-");
    downloadHtmlAsDoc(
      buildCompetitorComparisonDoc(comparison),
      `competitor-analysis-${namePart}.doc`,
      "Competitor Analysis",
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Analyze & Compare a Competitor">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-[13px] font-semibold text-foreground">
              Page Url
            </label>
            <Input
              value={competitorUrl}
              onChange={(e) => onCompetitorUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="https://competitor.com/their-page/"
              className="h-9"
              disabled={!yourUrl}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={competitorAudit.isPending || !canSubmit}
            className="h-9"
          >
            {competitorAudit.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Analyze
          </Button>
        </div>
        {!yourUrl ? (
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Run an audit on your own page first.
          </p>
        ) : null}
        {competitorAudit.isError || competitorAudit.isSuccess ? (
          !comparison ? (
            <p className="mt-2 text-[12.5px] text-destructive">
              Couldn't read one of the pages — it may be blocking automated
              requests. Try again.
            </p>
          ) : null
        ) : null}
      </SectionCard>

      {comparison ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDoc}
              className="h-9"
            >
              <FileText className="size-4" />
              Download as Word
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              className="h-9"
            >
              <Printer className="size-4" />
              Download PDF
            </Button>
          </div>
          <div
            ref={resultsRef}
            className="grid grid-cols-1 gap-4 bg-background p-1 lg:grid-cols-2"
          >
            <SectionCard title="Competitor SEO Score">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <ScoreRing
                    score={comparison.yourScore}
                    label="You"
                    color="#f97316"
                  />
                  <ScoreRing
                    score={comparison.competitorScore}
                    label="Competitor"
                    color="#f97316"
                  />
                </div>
                <div className="flex items-center gap-4 text-[12.5px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-500" /> You
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />{" "}
                    Competitor
                  </span>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <ComparisonBar
                    label="Metadata"
                    you={comparison.yourCategoryScores.metadata}
                    competitor={comparison.competitorCategoryScores.metadata}
                  />
                  <ComparisonBar
                    label="Content"
                    you={comparison.yourCategoryScores.content}
                    competitor={comparison.competitorCategoryScores.content}
                  />
                  <ComparisonBar
                    label="Headings"
                    you={comparison.yourCategoryScores.headings}
                    competitor={comparison.competitorCategoryScores.headings}
                  />
                  <ComparisonBar
                    label="Keywords"
                    you={comparison.yourCategoryScores.keywords}
                    competitor={comparison.competitorCategoryScores.keywords}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Ranking Potential">
              <div className="flex flex-col gap-4">
                <div
                  className={`flex items-start gap-2 rounded-lg border p-3 ${
                    comparison.gapPct >= 0
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {comparison.gapPct >= 0 ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p
                      className={`text-[13px] font-medium ${comparison.gapPct >= 0 ? "text-emerald-900" : "text-red-900"}`}
                    >
                      {comparison.gapPct >= 0
                        ? "Your page is in better shape compared to your competitors page"
                        : "Your page is in worse shape compared to your competitors page"}
                    </p>
                    <p
                      className={`text-[12.5px] ${comparison.gapPct >= 0 ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {comparison.gapPct >= 0 ? "+" : ""}
                      {comparison.gapPct}% gap
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[13px] font-semibold text-foreground">
                    Keyword Usage
                  </p>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-foreground">Your occurrences:</span>
                    <span className="font-semibold text-foreground">
                      {comparison.yourOccurrences} (
                      {comparison.yourOccurrencesPct}%)
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[13px]">
                    <span className="text-foreground">
                      Competitor occurrences:
                    </span>
                    <span className="font-semibold text-foreground">
                      {comparison.competitorOccurrences} (
                      {comparison.competitorOccurrencesPct}%)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-end text-[12px] text-muted-foreground">
                    You vs Competitor
                  </div>
                  <div className="flex flex-col gap-2">
                    {comparison.checklist.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-[13px]"
                      >
                        <span className="text-foreground">{item.label}</span>
                        <div className="flex items-center gap-4">
                          {item.you ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : (
                            <XCircle className="size-4 text-red-500" />
                          )}
                          {item.competitor ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : (
                            <XCircle className="size-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      ) : (
        <SectionCard title="Competitor">
          <p className="text-[13px] text-muted-foreground">
            Add a competitor URL above and analyze it to see a side-by-side
            comparison against your page.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
