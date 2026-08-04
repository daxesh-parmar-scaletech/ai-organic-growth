export interface PageAuditKeywordPerformance {
  keyword: string;
  density: number;
  densityStatus: "ok" | "too_high";
  inMetaTitle: boolean;
  inMetaDescription: boolean;
  inH1: boolean;
  occurrences: number;
}

export interface PageAuditRecommendation {
  title: string;
  description: string;
}

export interface PageAuditReadability {
  fleschScore: number;
  fleschLabel: string;
  passiveVoice: number;
  sentenceLength: number;
  paragraphLength: number;
  wordComplexity: number;
  transitionWords: number;
}

export interface PageAuditStats {
  wordCount: number;
  keywordOccurrences: number;
  keywordDensity: number;
  images: number;
  imagesWithAltText: number;
  links: number;
  paragraphs: number;
  sentences: number;
  transitionedSentences: number;
}

export interface PageAuditWordDensityEntry {
  word: string;
  count: number;
  pct: number;
}

export interface PageAuditHeading {
  level: string;
  text: string;
}

export interface PageAuditMetaField {
  value: string;
  status: "good" | "warning";
  note: string;
  suggestion?: string;
}

export interface PageAuditMetaDataEntry {
  key: string;
  value: string;
}

export interface PageAuditCompetitorChecklistItem {
  label: string;
  you: boolean;
  competitor: boolean;
}

export interface PageAuditCompetitorComparison {
  competitorUrl: string;
  yourScore: number;
  competitorScore: number;
  gapPct: number;
  yourCategoryScores: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  competitorCategoryScores: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  keyword: string;
  yourOccurrences: number;
  yourOccurrencesPct: number;
  competitorOccurrences: number;
  competitorOccurrencesPct: number;
  checklist: PageAuditCompetitorChecklistItem[];
}

export interface PageAuditGscQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
}

export interface PageAuditGscInsights {
  indexed: boolean;
  coverageState: string;
  lastCrawlTime: string | null;
  performance?: {
    clicks: number;
    impressions: number;
    ctr: string;
    position: string;
  };
  topQueries: PageAuditGscQuery[];
}

export interface PageAuditResult {
  status: "not_connected" | "domain_mismatch" | "fetch_failed" | "ok";
  url: string;
  reason?: string;
  metadataOnly?: true;
  gscInsights?: PageAuditGscInsights;
  seoScore?: number;
  scoreStatus?: string;
  categoryScores?: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  keywordPerformance?: PageAuditKeywordPerformance;
  recommendations?: PageAuditRecommendation[];
  readability?: PageAuditReadability;
  stats?: PageAuditStats;
  wordDensity?: {
    oneWord: PageAuditWordDensityEntry[];
    twoWord: PageAuditWordDensityEntry[];
    threeWord: PageAuditWordDensityEntry[];
  };
  headings?: PageAuditHeading[];
  metaTitle?: PageAuditMetaField;
  metaDescription?: PageAuditMetaField;
  allMetaData?: PageAuditMetaDataEntry[];
  competitorComparison?: PageAuditCompetitorComparison;
  isSampleData?: true;
  htmlFetchBlocked?: true;
}
