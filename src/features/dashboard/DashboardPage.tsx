import { useNavigate } from "react-router";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { GeoPerformanceCard } from "@/features/dashboard/components/GeoPerformanceCard";
import { HealthScoreCard } from "@/features/dashboard/components/HealthScoreCard";
import { HealthStrip } from "@/features/dashboard/components/HealthStrip";
import { MetricsRow } from "@/features/dashboard/components/MetricsRow";
import { PerformanceCard } from "@/features/dashboard/components/PerformanceCard";
import { TopContentCard } from "@/features/dashboard/components/TopContentCard";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useRecommendations } from "@/hooks/queries/useRecommendations";
import { useSeoAnalysis } from "@/hooks/queries/useSeoAnalysis";
import { useGscSnapshot, useSyncGscSnapshot } from "@/hooks/queries/useDashboard";

/** Short relative-time label ("just now", "5m ago", "3h ago", "2d ago") with no date library. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Full local date + time, e.g. "31 Jul 2026, 17:57". */
function formatSyncedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const project = useActiveProject();
  const navigate = useNavigate();

  const recommendationsQuery = useRecommendations(project.id);
  const seoQuery = useSeoAnalysis(project.id);
  const gscSnapshotQuery = useGscSnapshot(project.id);
  const syncGscSnapshotMutation = useSyncGscSnapshot(project.id);

  const isLoading = recommendationsQuery.isLoading || seoQuery.isLoading || gscSnapshotQuery.isLoading;
  const isError = recommendationsQuery.isError || seoQuery.isError || gscSnapshotQuery.isError;

  if (isLoading) return <PageLoader label="Loading dashboard…" />;
  if (isError || !seoQuery.data || !recommendationsQuery.data || !gscSnapshotQuery.data) {
    return (
      <QueryErrorFallback
        message="We couldn't load the dashboard."
        onRetry={() => {
          recommendationsQuery.refetch();
          seoQuery.refetch();
          gscSnapshotQuery.refetch();
        }}
      />
    );
  }

  const seo = seoQuery.data;
  const snapshot = gscSnapshotQuery.data;
  const openIssuesCount = seo.issues.filter((issue) => issue.status === "Open").length;

  const syncButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => syncGscSnapshotMutation.mutate()}
      disabled={syncGscSnapshotMutation.isPending}
    >
      <RefreshCw className={`size-4 ${syncGscSnapshotMutation.isPending ? "animate-spin" : ""}`} />
      {syncGscSnapshotMutation.isPending ? "Syncing…" : "Sync GSC data"}
    </Button>
  );

  // Everything below is served entirely from the last saved GSC snapshot — nothing here
  // triggers a live Search Console call; only the "Sync GSC data" button does that.
  if (!snapshot.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-24 text-center">
        <p className="text-sm text-muted-foreground">
          No Search Console data has been synced yet for <b className="text-foreground">{project.domain}</b>.
        </p>
        {syncButton}
      </div>
    );
  }

  const { metrics, trend, geo, keywords, pages } = snapshot.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Organic search overview for <b className="text-foreground">{project.domain}</b>
          {snapshot.syncedAt && (
            <> · synced {formatSyncedAt(snapshot.syncedAt)} ({timeAgo(snapshot.syncedAt)})</>
          )}
        </p>
        {syncButton}
      </div>

      <MetricsRow metrics={metrics} trend={trend} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.9fr_1fr]">
        <PerformanceCard title="Search performance" trend={trend} />
        <HealthScoreCard
          score={seo.healthScore}
          indexed={`${seo.indexing.indexed.toLocaleString()} / ${seo.indexing.discovered.toLocaleString()}`}
          openIssues={openIssuesCount}
          quickWins={recommendationsQuery.data.filter((r) => r.effort === "Low").length}
          domainAuthority={seo.domainAuthority}
        />
      </div>

      <HealthStrip
        indexing={seo.indexing}
        sitemap={seo.sitemap}
        crawlIssues={seo.crawlIssues}
        onViewIssues={() => navigate(`/app/${project.id}/seo-analysis`)}
      />

      <GeoPerformanceCard data={geo} />

      <TopContentCard projectId={project.id} keywords={keywords} pages={pages} />
    </div>
  );
}
