import type { DashboardMetric, DashboardTrend } from "@/types/dashboard";
import type { GeoDatum } from "@/types/geo";
import type { Keyword } from "@/types/keyword";
import type { PageMetric } from "@/types/page";

export interface GscSnapshotData {
  metrics: DashboardMetric[];
  trend: DashboardTrend;
  geo: GeoDatum[];
  keywords: Keyword[];
  pages: PageMetric[];
}

export interface GscSnapshot {
  data: GscSnapshotData | null;
  syncedAt: string | null;
}
