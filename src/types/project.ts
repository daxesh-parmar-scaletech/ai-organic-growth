export interface ProjectMetrics {
  clicks: string;
  impressions: string;
  avgPosition: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  letter: string;
  color: string;
  connected: boolean;
  metrics?: ProjectMetrics;
}
