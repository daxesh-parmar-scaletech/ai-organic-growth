export interface PageStatus {
  url: string;
  indexed: boolean;
  coverageState: string | null;
  lastCheckedAt: string | null;
  rank: number | null;
  rankKeyword: string | null;
  previousRank: number | null;
  rankDelta: number | null;
  previousCapturedAt: string | null;
}
