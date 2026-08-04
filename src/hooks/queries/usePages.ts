import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { getPages } from "@/services/pages.service";

export function usePages(projectId: string) {
  return useQuery({
    queryKey: queryKeys.pages(projectId),
    queryFn: () => getPages(projectId),
  });
}
