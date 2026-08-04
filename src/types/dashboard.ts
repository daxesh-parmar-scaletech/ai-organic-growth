export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
}

export interface DashboardTrend {
  labels: string[];
  clicksSeries: number[];
  impressionsSeries: number[];
}
