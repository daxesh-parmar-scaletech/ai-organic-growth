import { useMutation } from "@tanstack/react-query";
import { runCompetitorAudit, runPageAudit } from "@/services/pageAudit.service";
import type { Project } from "@/types/project";

export function usePageAudit(project: Project) {
  return useMutation({
    mutationFn: ({ url, competitorUrl, manualHtml }: { url: string; competitorUrl?: string; manualHtml?: string }) =>
      runPageAudit(project, url, competitorUrl, manualHtml),
  });
}

export function useCompetitorAudit(project: Project) {
  return useMutation({
    mutationFn: ({ url, competitorUrl }: { url: string; competitorUrl: string }) =>
      runCompetitorAudit(project, url, competitorUrl),
  });
}
