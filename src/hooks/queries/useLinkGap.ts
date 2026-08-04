import { useMutation } from "@tanstack/react-query";
import { checkLinkGap } from "@/services/linkGap.service";

export function useLinkGap(projectId: string) {
  return useMutation({
    mutationFn: ({ yourUrl, competitorUrl }: { yourUrl: string; competitorUrl: string }) =>
      checkLinkGap(projectId, yourUrl, competitorUrl),
  });
}
