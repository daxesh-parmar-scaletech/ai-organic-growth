export interface PageAnalysisPerformance {
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
  topQueries: { query: string; position: string }[];
}

export interface PageAnalysisSuggestions {
  candidateKeywords: string[];
  focusKeyword: string;
  keywordConfidence: "verified_volume" | "estimated";
  keywordVerificationNote: string;
  currentMetaTitle: string | null;
  titleAssessment: string;
  titleNeedsChange: boolean;
  metaTitle: string;
  metaTitleCharCount: number;
  currentMetaDescription: string | null;
  descriptionAssessment: string;
  descriptionNeedsChange: boolean;
  metaDescription: string;
  metaDescriptionCharCount: number;
  currentH1: string | null;
  h1Suggestion: string | null;
  complianceNote: string | null;
  complianceFlags: string[];
  contentTips: string[];
  keywordIdeas: string[];
}

export interface PageAnalysisCompetitorComparison {
  competitorUrl: string;
  gapAnalysis: string;
  suggestedUpdates: string[];
}

export interface PageAnalysis {
  url: string;
  indexed: boolean;
  lastCrawlTime?: string | null;
  inspectionResultLink?: string | null;
  indexingReason?: string;
  indexingExplanation?: string;
  fixSnippetLabel?: string;
  fixSnippet?: string;
  fixSteps?: string[];
  reindexSteps?: string[];
  htmlFetchBlocked?: boolean;
  indexingCheckFailed?: boolean;
  performance?: PageAnalysisPerformance;
  suggestions?: PageAnalysisSuggestions;
  competitorComparison?: PageAnalysisCompetitorComparison;
}
