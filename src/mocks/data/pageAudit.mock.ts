import type {
  PageAuditResult,
  PageAuditWordDensityEntry,
  PageAuditRecommendation,
  PageAuditHeading,
  PageAuditCompetitorComparison,
} from "@/types/pageAudit";

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  }
}

// Deterministic pseudo-random int in [min, max] seeded from a string, so the
// same URL always returns the same mock audit result.
// FNV-1a over the string, then a murmur3-style finisher so seeds that differ
// by only their last char/digit don't land in neighboring buckets.
function seededInt(seed: string, min: number, max: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  const normalized = (hash >>> 0) / 0xffffffff;
  return min + Math.floor(normalized * (max - min + 1));
}

function seededPick<T>(seed: string, items: T[]): T {
  return items[seededInt(seed, 0, items.length - 1)];
}

const CANDIDATE_KEYWORDS = ["marketing agency", "seo services", "digital strategy", "content marketing", "link building"];

const RECOMMENDATION_POOL: PageAuditRecommendation[] = [
  { title: "Keyword Density", description: "You may be overusing your keyword. Verify that the language still feels natural." },
  { title: "Readability", description: "Your flesch reading score indicates this may be difficult to read, consider using simpler language." },
  { title: "Meta Title", description: "Your meta title should be between 30 and 60 characters." },
  { title: "Meta Description", description: "Your meta description should be between 50 and 160 characters." },
  { title: "Missing Alt Text", description: "Some images are missing alt text, which hurts accessibility and image search visibility." },
  { title: "Thin Content", description: "This page has a low word count relative to top-ranking competitors — consider expanding it." },
];

const HEADING_POOL: PageAuditHeading[] = [
  { level: "H1", text: "Page Title" },
  { level: "H2", text: "Overview" },
  { level: "H2", text: "Key Features" },
  { level: "H3", text: "Specification" },
  { level: "H2", text: "Shipping" },
  { level: "H2", text: "Frequently Asked Questions" },
];

const WORD_POOL = ["salt", "nic", "ice", "raspberry", "nicotine", "banana", "product", "quantity", "sweet", "fruit"];

function buildWordDensity(seed: string): PageAuditResult["wordDensity"] {
  const oneWord: PageAuditWordDensityEntry[] = WORD_POOL.map((word, index) => ({
    word,
    count: seededInt(`${seed}::1w::${index}`, 5, 70),
    pct: 0,
  })).sort((a, b) => b.count - a.count);
  const total = oneWord.reduce((sum, entry) => sum + entry.count, 0) || 1;
  oneWord.forEach((entry) => (entry.pct = Math.round((entry.count / total) * 1000) / 10));

  const twoWord: PageAuditWordDensityEntry[] = oneWord.slice(0, 6).map((entry, index) => ({
    word: `${entry.word} ${WORD_POOL[(index + 1) % WORD_POOL.length]}`,
    count: Math.max(1, Math.round(entry.count / 3)),
    pct: Math.round((entry.pct / 3) * 10) / 10,
  }));

  const threeWord: PageAuditWordDensityEntry[] = oneWord.slice(0, 4).map((entry, index) => ({
    word: `${entry.word} ${WORD_POOL[(index + 1) % WORD_POOL.length]} ${WORD_POOL[(index + 2) % WORD_POOL.length]}`,
    count: Math.max(1, Math.round(entry.count / 5)),
    pct: Math.round((entry.pct / 5) * 10) / 10,
  }));

  return { oneWord, twoWord, threeWord };
}

interface PageAuditCore {
  keyword: string;
  density: number;
  occurrences: number;
  occurrencesPct: number;
  categoryScores: { metadata: number; content: number; headings: number; keywords: number };
  seoScore: number;
  inMetaTitle: boolean;
  inMetaDescription: boolean;
  inH1: boolean;
}

function buildCore(seed: string): PageAuditCore {
  const keyword = seededPick(`${seed}::keyword`, CANDIDATE_KEYWORDS);
  const density = seededInt(`${seed}::density`, 60, 700) / 10;
  const occurrences = seededInt(`${seed}::occurrences`, 40, 300);
  const occurrencesPct = seededInt(`${seed}::occurrences-pct`, 400, 700) / 10;

  const categoryScores = {
    metadata: seededInt(`${seed}::cat::metadata`, 55, 90),
    content: seededInt(`${seed}::cat::content`, 55, 90),
    headings: seededInt(`${seed}::cat::headings`, 70, 100),
    keywords: seededInt(`${seed}::cat::keywords`, 50, 90),
  };
  const seoScore = Math.round(
    (categoryScores.metadata + categoryScores.content + categoryScores.headings + categoryScores.keywords) / 4,
  );

  return {
    keyword,
    density,
    occurrences,
    occurrencesPct,
    categoryScores,
    seoScore,
    inMetaTitle: seededInt(`${seed}::title-has-kw`, 0, 1) === 1,
    inMetaDescription: true,
    inH1: true,
  };
}

export function buildCompetitorComparisonMock(url: string, competitorUrl: string): PageAuditCompetitorComparison {
  const yours = buildCore(url);
  const competitor = buildCore(competitorUrl);

  return {
    competitorUrl,
    yourScore: yours.seoScore,
    competitorScore: competitor.seoScore,
    gapPct: yours.seoScore - competitor.seoScore,
    yourCategoryScores: yours.categoryScores,
    competitorCategoryScores: competitor.categoryScores,
    keyword: yours.keyword,
    yourOccurrences: yours.occurrences,
    yourOccurrencesPct: yours.occurrencesPct,
    competitorOccurrences: competitor.occurrences,
    competitorOccurrencesPct: competitor.occurrencesPct,
    checklist: [
      { label: "Keyword in Meta Title", you: yours.inMetaTitle, competitor: competitor.inMetaTitle },
      { label: "Keyword in Meta Description", you: yours.inMetaDescription, competitor: competitor.inMetaDescription },
      { label: "Keyword in H1 Heading", you: yours.inH1, competitor: competitor.inH1 },
    ],
  };
}

export function buildPageAuditMock(
  url: string,
  projectDomain: string,
  projectConnected: boolean,
  competitorUrl?: string,
): PageAuditResult {
  const pageDomain = extractDomain(url);
  const propertyDomain = projectDomain.replace(/^www\./, "");

  if (!projectConnected) {
    return { status: "not_connected", url };
  }
  if (pageDomain !== propertyDomain) {
    return {
      status: "domain_mismatch",
      url,
      reason: `This URL isn't part of your connected Search Console property (${propertyDomain}). Enter a page from that domain to run an audit.`,
    };
  }

  const seed = url;
  const keyword = seededPick(`${seed}::keyword`, CANDIDATE_KEYWORDS);
  const density = seededInt(`${seed}::density`, 60, 700) / 10;
  const occurrences = seededInt(`${seed}::occurrences`, 40, 300);

  const categoryScores = {
    metadata: seededInt(`${seed}::cat::metadata`, 55, 90),
    content: seededInt(`${seed}::cat::content`, 55, 90),
    headings: seededInt(`${seed}::cat::headings`, 70, 100),
    keywords: seededInt(`${seed}::cat::keywords`, 50, 90),
  };
  const seoScore = Math.round(
    (categoryScores.metadata + categoryScores.content + categoryScores.headings + categoryScores.keywords) / 4,
  );

  const recommendationCount = seededInt(`${seed}::rec-count`, 2, 4);
  const recommendations: PageAuditRecommendation[] = [];
  const usedIndices = new Set<number>();
  for (let i = 0; i < recommendationCount; i++) {
    let index = seededInt(`${seed}::rec::${i}`, 0, RECOMMENDATION_POOL.length - 1);
    while (usedIndices.has(index)) index = (index + 1) % RECOMMENDATION_POOL.length;
    usedIndices.add(index);
    recommendations.push(RECOMMENDATION_POOL[index]);
  }

  const fleschScore = seededInt(`${seed}::flesch`, 35, 75);

  const result: PageAuditResult = {
    status: "ok",
    url,
    seoScore,
    scoreStatus: seoScore >= 90 ? "Excellent" : seoScore >= 75 ? "Good" : "Needs Improvement",
    categoryScores,
    keywordPerformance: {
      keyword,
      density,
      densityStatus: density > 3 ? "too_high" : "ok",
      inMetaTitle: seededInt(`${seed}::title-has-kw`, 0, 1) === 1,
      inMetaDescription: true,
      inH1: true,
      occurrences,
    },
    recommendations,
    readability: {
      fleschScore,
      fleschLabel: fleschScore >= 60 ? "Fairly Easy" : fleschScore >= 50 ? "Fairly Difficult" : "Difficult",
      passiveVoice: seededInt(`${seed}::passive`, 70, 100),
      sentenceLength: seededInt(`${seed}::sentence`, 70, 100),
      paragraphLength: seededInt(`${seed}::paragraph`, 70, 100),
      wordComplexity: seededInt(`${seed}::complexity`, 40, 75),
      transitionWords: seededInt(`${seed}::transition`, 10, 40),
    },
    stats: {
      wordCount: seededInt(`${seed}::wordcount`, 800, 2200),
      keywordOccurrences: occurrences,
      keywordDensity: density,
      images: seededInt(`${seed}::images`, 1, 6),
      imagesWithAltText: seededInt(`${seed}::images-alt`, 1, 6),
      links: seededInt(`${seed}::links`, 20, 150),
      paragraphs: seededInt(`${seed}::paragraphs`, 30, 220),
      sentences: seededInt(`${seed}::sentences`, 100, 400),
      transitionedSentences: seededInt(`${seed}::transitioned`, 5, 20),
    },
    wordDensity: buildWordDensity(seed),
    headings: HEADING_POOL,
    metaTitle: {
      value: `${keyword.replace(/\b\w/g, (c) => c.toUpperCase())} | ${propertyDomain}`,
      status: seededInt(`${seed}::title-status`, 0, 1) === 1 ? "good" : "warning",
      note: "Your meta title should be between 30 and 60 characters.",
    },
    metaDescription: {
      value: `Explore ${keyword} with ${propertyDomain} for a complete overview and expert guidance.`,
      status: "good",
      note: "Keyword appears in description. Description is between 50 and 160 characters.",
    },
    allMetaData: [
      { key: "title", value: `${keyword.replace(/\b\w/g, (c) => c.toUpperCase())} | ${propertyDomain}` },
      { key: "description", value: `Explore ${keyword} with ${propertyDomain} for a complete overview.` },
      { key: "canonical", value: url },
      { key: "ogTitle", value: `${keyword.replace(/\b\w/g, (c) => c.toUpperCase())} | ${propertyDomain}` },
      { key: "ogType", value: "website" },
      { key: "ogUrl", value: url },
    ],
    isSampleData: true,
  };

  if (competitorUrl) {
    result.competitorComparison = buildCompetitorComparisonMock(url, competitorUrl);
  }

  return result;
}
