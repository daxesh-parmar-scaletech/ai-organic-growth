import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { dashboardMetricsMock } from "@/mocks/data/dashboard.mock";
import { clicksSeriesMock, impressionsSeriesMock, trendLabelsMock } from "@/mocks/data/trend.mock";
import { geoMock } from "@/mocks/data/geo.mock";
import { keywordsMock } from "@/mocks/data/keywords.mock";
import { pagesMock } from "@/mocks/data/pages.mock";
import httpService from "@/services/http.service";
import type { DashboardMetric, DashboardTrend } from "@/types/dashboard";
import type { GeoDatum } from "@/types/geo";
import type { GscSnapshot } from "@/types/gscSnapshot";

// Future backend contract:
//   GET /projects/:id/metrics -> DashboardMetric[]
//   GET /projects/:id/trend   -> DashboardTrend
//   GET /projects/:id/geo     -> GeoDatum[]
//   GET  /projects/:id/gsc-sync -> GscSnapshot (cached, offline read of the last manual sync)
//   POST /projects/:id/gsc-sync -> GscSnapshot (live fetch from Search Console, saved as the new snapshot)

export async function getDashboardMetrics(projectId: string): Promise<DashboardMetric[]> {
  if (USE_MOCKS) return mockDelay(dashboardMetricsMock);
  return httpService.get<DashboardMetric[]>(API_CONFIG.dashboardMetrics(projectId));
}

export async function getDashboardTrend(projectId: string): Promise<DashboardTrend> {
  if (USE_MOCKS) {
    return mockDelay({
      labels: trendLabelsMock,
      clicksSeries: clicksSeriesMock,
      impressionsSeries: impressionsSeriesMock,
    });
  }
  return httpService.get<DashboardTrend>(API_CONFIG.dashboardTrend(projectId));
}

export async function getDashboardGeo(projectId: string): Promise<GeoDatum[]> {
  if (USE_MOCKS) return mockDelay(geoMock);
  return httpService.get<GeoDatum[]>(API_CONFIG.dashboardGeo(projectId));
}

export async function getGscSnapshot(projectId: string): Promise<GscSnapshot> {
  if (USE_MOCKS) return mockDelay({ data: null, syncedAt: null });
  return httpService.get<GscSnapshot>(API_CONFIG.gscSync(projectId));
}

export async function syncGscSnapshot(projectId: string): Promise<GscSnapshot> {
  if (USE_MOCKS) {
    return mockDelay(
      {
        data: {
          metrics: dashboardMetricsMock,
          trend: { labels: trendLabelsMock, clicksSeries: clicksSeriesMock, impressionsSeries: impressionsSeriesMock },
          geo: geoMock,
          keywords: keywordsMock,
          pages: pagesMock,
        },
        syncedAt: new Date().toISOString(),
      },
      800,
    );
  }
  return httpService.post<GscSnapshot>(API_CONFIG.gscSync(projectId));
}
