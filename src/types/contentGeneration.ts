export interface InternalLinkSuggestion {
  anchorText: string;
  note: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface PlagiarismMatch {
  url: string;
  title: string;
  matchedWords: number;
}

export interface PlagiarismResult {
  plagiarismPercentage: number;
  matchesFound: number;
  wordsChecked: number;
  matches: PlagiarismMatch[];
}

export interface ContentRating {
  score: number;
  summary: string;
}

export interface GeneratedContent {
  productUrl: string;
  blogTitle: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  tags: string[];
  excerpt: string;
  contentHtml: string;
  wordCount: number;
  imagePrompt: string;
  internalLinkSuggestions: InternalLinkSuggestion[];
  faqs: Faq[];
  faqJsonLd: string;
  seoRating: ContentRating;
  aeoRating: ContentRating;
  geoRating: ContentRating;
}
