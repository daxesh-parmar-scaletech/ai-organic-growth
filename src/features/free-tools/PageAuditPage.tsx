import { useState } from "react";
import { AlertCircle, ArrowLeft, ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useCompetitorAudit, usePageAudit } from "@/hooks/queries/usePageAudit";
import { OverviewTab } from "@/features/free-tools/components/PageAudit/OverviewTab";
import { ContentTab } from "@/features/free-tools/components/PageAudit/ContentTab";
import { MetadataTab } from "@/features/free-tools/components/PageAudit/MetadataTab";
import { CompetitorTab } from "@/features/free-tools/components/PageAudit/CompetitorTab";

export function PageAuditPage() {
  const project = useActiveProject();
  const [pageUrl, setPageUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [manualHtml, setManualHtml] = useState("");
  const [showManualHtml, setShowManualHtml] = useState(false);
  const auditMutation = usePageAudit(project);
  const competitorAudit = useCompetitorAudit(project);
  const result = auditMutation.data;

  const canSubmit = pageUrl.trim().length > 0;
  const wasBlocked = result?.htmlFetchBlocked ?? false;

  const handleAnalyze = () => {
    if (!canSubmit) return;
    auditMutation.mutate({ url: pageUrl.trim(), manualHtml: manualHtml.trim() || undefined });
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/app/${project.id}/free-tools`}
        className="flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Tools
      </Link>

      <SectionCard title="Analyze your Web Page">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-[13px] font-semibold text-foreground">Page Url</label>
            <Input
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder={`https://${project.domain}/your-page/`}
              className="h-9"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={auditMutation.isPending || !canSubmit} className="h-9">
            {auditMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Analyze
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setShowManualHtml((v) => !v)}
          className="mt-3 flex w-fit items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {showManualHtml ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          Paste page HTML manually (use this if your site blocks our automatic check)
        </button>
        {showManualHtml ? (
          <textarea
            value={manualHtml}
            onChange={(e) => setManualHtml(e.target.value)}
            placeholder="View-source the page in your browser, copy the full HTML, and paste it here for a real analysis."
            rows={6}
            className="mt-2 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        ) : null}

        {wasBlocked && !showManualHtml ? (
          <p className="mt-3 text-[13px] leading-relaxed text-destructive">
            We couldn't read your page's live HTML (likely bot protection blocking our request). Use "Paste page
            HTML manually" above and re-analyze for a real, exact audit.
          </p>
        ) : null}
      </SectionCard>

      {auditMutation.isError ? (
        <p className="text-sm text-destructive">Couldn't run the audit. Try again.</p>
      ) : null}

      {result && result.status !== "ok" ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-amber-900">Search Console connection required</p>
            <p className="text-sm text-amber-800">
              {result.status === "not_connected"
                ? "This project isn't connected to Google Search Console yet. Connect it in Settings, then try again."
                : result.reason}
            </p>
          </div>
        </div>
      ) : null}

      {result && result.status === "ok" ? (
        <div className="flex flex-col gap-4">
          {result.isSampleData || result.metadataOnly ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p className="text-[12.5px] text-amber-900">
                {result.reason ??
                  "Sample data — this tool isn't connected to a live crawler yet, so these numbers are illustrative, not a real analysis of the page you entered."}
              </p>
            </div>
          ) : null}

          {result.gscInsights ? (
            <SectionCard title="What Search Console reports for this page">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-foreground">Indexing status</span>
                  <span className="font-semibold text-foreground">
                    {result.gscInsights.indexed ? "Indexed" : "Not indexed"} — {result.gscInsights.coverageState}
                  </span>
                </div>
                {result.gscInsights.lastCrawlTime ? (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-foreground">Last crawled by Google</span>
                    <span className="font-semibold text-foreground">
                      {new Date(result.gscInsights.lastCrawlTime).toLocaleString()}
                    </span>
                  </div>
                ) : null}

                {result.gscInsights.performance ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Clicks (28d)</p>
                      <p className="text-lg font-semibold text-foreground">{result.gscInsights.performance.clicks}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Impressions (28d)</p>
                      <p className="text-lg font-semibold text-foreground">
                        {result.gscInsights.performance.impressions}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">CTR</p>
                      <p className="text-lg font-semibold text-foreground">{result.gscInsights.performance.ctr}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] text-muted-foreground">Avg. Position</p>
                      <p className="text-lg font-semibold text-foreground">
                        {result.gscInsights.performance.position}
                      </p>
                    </div>
                  </div>
                ) : null}

                {result.gscInsights.topQueries.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[13px] font-semibold text-foreground">Top queries (last 28 days)</p>
                    <div className="flex flex-col gap-1">
                      {result.gscInsights.topQueries.map((q) => (
                        <div key={q.query} className="flex items-center justify-between text-[13px]">
                          <span className="text-foreground">{q.query}</span>
                          <span className="text-muted-foreground">
                            pos. {q.position} · {q.clicks} clicks · {q.ctr} CTR
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </SectionCard>
          ) : null}

          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="competitor">Competitor</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <OverviewTab result={result} />
            </TabsContent>
            <TabsContent value="content">
              <ContentTab result={result} />
            </TabsContent>
            <TabsContent value="metadata">
              <MetadataTab result={result} />
            </TabsContent>
            <TabsContent value="competitor">
              <CompetitorTab
                yourUrl={result.url}
                competitorUrl={competitorUrl}
                onCompetitorUrlChange={setCompetitorUrl}
                competitorAudit={competitorAudit}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
