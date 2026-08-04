import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { syncPages } from "@/services/pagesStatus.service";

export function useSyncPages(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => syncPages(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.pagesStatus(projectId), data);
    },
    onError: (error) => {
      console.error("Failed to sync pages", error);
    },
  });
}
