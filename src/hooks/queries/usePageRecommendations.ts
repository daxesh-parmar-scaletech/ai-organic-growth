import { useMutation } from "@tanstack/react-query";
import { generatePageRecommendations } from "@/services/pageRecommendations.service";

export function usePageRecommendations(projectId: string) {
  return useMutation({
    mutationFn: (url: string) => generatePageRecommendations(projectId, url),
  });
}
