import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { getSeoAnalysis } from "@/services/seo.service";

export function useSeoAnalysis(projectId: string) {
  return useQuery({
    queryKey: queryKeys.seoAnalysis(projectId),
    queryFn: () => getSeoAnalysis(projectId),
  });
}
