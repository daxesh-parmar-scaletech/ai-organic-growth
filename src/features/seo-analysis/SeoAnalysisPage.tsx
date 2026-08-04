import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { AllPagesCard } from "@/features/seo-analysis/components/AllPagesCard";
import { CwvList } from "@/features/seo-analysis/components/CwvList";
import { HealthBreakdownCard } from "@/features/seo-analysis/components/HealthBreakdownCard";
import { IssuesTable } from "@/features/seo-analysis/components/IssuesTable";
import { SiteImprovementCard } from "@/features/seo-analysis/components/SiteImprovementCard";
import { SolutionsCard } from "@/features/seo-analysis/components/SolutionsCard";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useSeoAnalysis } from "@/hooks/queries/useSeoAnalysis";

export function SeoAnalysisPage() {
  const project = useActiveProject();
  const { data, isLoading, isError, refetch } = useSeoAnalysis(project.id);

  if (isLoading) return <PageLoader label="Loading SEO analysis…" />;
  if (isError || !data) {
    return <QueryErrorFallback message="We couldn't load the SEO analysis." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HealthBreakdownCard items={data.breakdown} />
        <CwvList metrics={data.cwv} />
      </div>
      <IssuesTable issues={data.issues} />

      <AllPagesCard projectId={project.id} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SolutionsCard advice={data.siteAdvice} />
        <SiteImprovementCard advice={data.siteAdvice} />
      </div>
    </div>
  );
}
