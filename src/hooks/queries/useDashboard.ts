import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import {
  getDashboardGeo,
  getDashboardMetrics,
  getDashboardTrend,
  getGscSnapshot,
  syncGscSnapshot,
} from "@/services/dashboard.service";

export function useDashboardMetrics(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboardMetrics(projectId),
    queryFn: () => getDashboardMetrics(projectId),
  });
}

export function useDashboardTrend(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboardTrend(projectId),
    queryFn: () => getDashboardTrend(projectId),
  });
}

export function useDashboardGeo(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboardGeo(projectId),
    queryFn: () => getDashboardGeo(projectId),
  });
}

/** Offline read: the last snapshot a manual sync saved, so the dashboard doesn't refetch live GSC data on every load. */
export function useGscSnapshot(projectId: string) {
  return useQuery({
    queryKey: queryKeys.gscSnapshot(projectId),
    queryFn: () => getGscSnapshot(projectId),
  });
}

/** Manual "Sync now" button: fetches fresh data from Search Console and refreshes every dashboard query. */
export function useSyncGscSnapshot(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => syncGscSnapshot(projectId),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(queryKeys.gscSnapshot(projectId), snapshot);
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardMetrics(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardTrend(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardGeo(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.keywords(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pages(projectId) });
    },
  });
}
