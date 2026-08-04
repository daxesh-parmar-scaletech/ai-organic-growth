import { useMutation } from "@tanstack/react-query";
import { analyzePage } from "@/services/pageAnalysis.service";

interface AnalyzePageVariables {
  url: string;
  competitorUrl?: string;
  manualHtml?: string;
}

export function usePageAnalysis(projectId: string) {
  return useMutation({
    mutationFn: ({ url, competitorUrl, manualHtml }: AnalyzePageVariables) =>
      analyzePage(projectId, url, competitorUrl, manualHtml),
  });
}
