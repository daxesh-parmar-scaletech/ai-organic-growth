import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { getPagesStatus } from "@/services/pagesStatus.service";

export function usePagesStatus(projectId: string) {
  return useQuery({
    queryKey: queryKeys.pagesStatus(projectId),
    queryFn: () => getPagesStatus(projectId),
  });
}
