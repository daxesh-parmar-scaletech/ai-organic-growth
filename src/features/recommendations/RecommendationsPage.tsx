import { toast } from "react-toastify";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { PageAnalyzerCard } from "@/features/recommendations/components/PageAnalyzerCard";
import { RecommendationCard } from "@/features/recommendations/components/RecommendationCard";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useApplyRecommendation, useRecommendations } from "@/hooks/queries/useRecommendations";

export function RecommendationsPage() {
  const project = useActiveProject();
  const { data: recommendations, isLoading, isError, refetch } = useRecommendations(project.id);
  const applyMutation = useApplyRecommendation(project.id);

  const handleApply = (id: string) => {
    applyMutation.mutate(id, {
      onSuccess: () => toast.success("Fix applied — we'll track its impact over the next few days."),
    });
  };

  if (isLoading) return <PageLoader label="Loading recommendations…" />;
  if (isError || !recommendations) {
    return <QueryErrorFallback message="We couldn't load recommendations." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageAnalyzerCard projectId={project.id} />
      <div className="flex flex-col gap-3.5">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onApply={handleApply}
            isApplying={applyMutation.isPending && applyMutation.variables === recommendation.id}
          />
        ))}
      </div>
    </div>
  );
}
