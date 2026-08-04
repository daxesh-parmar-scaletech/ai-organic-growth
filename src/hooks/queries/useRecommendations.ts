import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { applyRecommendation, getRecommendations } from "@/services/recommendations.service";

export function useRecommendations(projectId: string) {
  return useQuery({
    queryKey: queryKeys.recommendations(projectId),
    queryFn: () => getRecommendations(projectId),
  });
}

export function useApplyRecommendation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations(projectId) });
    },
  });
}
