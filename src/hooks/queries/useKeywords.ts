import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { getKeywords } from "@/services/keywords.service";

export function useKeywords(projectId: string) {
  return useQuery({
    queryKey: queryKeys.keywords(projectId),
    queryFn: () => getKeywords(projectId),
  });
}
