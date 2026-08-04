export interface LinkGapBacklink {
  sourceUrl: string;
  sourceDomain: string;
  domainRating: number;
  targetUrl: string;
  anchorText: string;
}

export interface LinkGapResult {
  yourUrl: string;
  competitorUrl: string;
  gapCount: number;
  backlinks: LinkGapBacklink[];
  // No real backlink-index provider (Ahrefs/DataForSEO/etc.) is configured yet —
  // every result is illustrative sample data, not a live crawl of the two sites.
  isSampleData: boolean;
}
