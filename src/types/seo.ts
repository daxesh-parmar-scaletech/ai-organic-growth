export interface SeoBreakdownItem {
  label: string;
  score: number;
}

export type IssueSeverity = "High" | "Medium" | "Low";
export type IssueStatus = "Open" | "In review";

export interface SeoIssue {
  type: string;
  pages: string;
  severity: IssueSeverity;
  status: IssueStatus;
}

export type CwvStatus = "Good" | "Needs work" | "Poor";

export interface CwvMetric {
  label: string;
  name: string;
  value: string;
  status: CwvStatus;
  percent: number;
}

export interface DeviceCwvReport {
  score: number | null;
  metrics: CwvMetric[];
}

export interface CoreWebVitalsReport {
  mobile: DeviceCwvReport;
  desktop: DeviceCwvReport;
}

export interface SiteAdvice {
  summary: string;
  fixes: string[];
  improvementSuggestions: string[];
}
