import { useMutation } from "@tanstack/react-query";
import { generateTitles } from "@/services/titleGenerator.service";

export function useGenerateTitles(projectId: string) {
  return useMutation({
    mutationFn: (keyword: string) => generateTitles(projectId, keyword),
  });
}
