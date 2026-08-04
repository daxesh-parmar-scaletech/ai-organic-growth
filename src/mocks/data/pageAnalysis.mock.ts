import type { PageAnalysis } from "@/types/pageAnalysis";

export function pageAnalysisMock(url: string, competitorUrl?: string, manualHtml?: string): PageAnalysis {
  // Deterministic-ish: URLs containing "draft" or "old" pretend to be not indexed.
  const looksUnindexed = /draft|old|new|test|blocked/i.test(url);
  const looksBlocked = /blocked/i.test(url) && !manualHtml?.trim();

  const competitorComparison = competitorUrl
    ? {
        competitorUrl,
        gapAnalysis:
          "The competitor page covers more subtopics (brewing ratios, cleaning, FAQs) in roughly 2x the word count, includes customer review schema markup, and links internally from 3+ related category pages. Your page is thinner and has no structured data, which likely hurts both relevance signals and rich-result eligibility.",
        suggestedUpdates: [
          "Expand content to at least 900 words, covering brew ratio guidance, cleaning instructions, and a short FAQ",
          "Add Product and Review schema markup (JSON-LD) so star ratings can appear in search results",
          "Add 3-5 internal links from related blog posts and category pages to this page",
          "Add a comparison section addressing how this product differs from close alternatives",
          "Refresh the published/updated date to signal content freshness to Google",
        ],
      }
    : undefined;

  if (looksUnindexed && looksBlocked) {
    return {
      url,
      indexed: false,
      indexingReason: "Crawled - currently not indexed",
      indexingExplanation:
        "Google's Search Console shows this page was crawled but not indexed. We couldn't independently verify the live HTML because our automated check was blocked, so we can't pinpoint an exact HTML-level cause right now.",
      htmlFetchBlocked: true,
      fixSteps: [
        "Paste this page's HTML manually above (view-source in your browser) for an exact diagnosis",
        "In the meantime, manually check for a noindex meta tag, thin content, or an incorrect canonical tag",
      ],
      reindexSteps: [
        "Use Search Console's URL Inspection \"Test Live URL\" to confirm Google can fetch it cleanly",
        "Click \"Request Indexing\" only after that test looks clean",
      ],
      competitorComparison,
    };
  }

  if (looksUnindexed) {
    return {
      url,
      indexed: false,
      indexingReason: "Crawled - currently not indexed",
      indexingExplanation: manualHtml?.trim()
        ? "You pasted this page's real HTML — it has a thin body and no meta description, which likely reads to Google as low-value/duplicate-ish content rather than a technical block."
        : "We read your page's actual HTML — it has a thin 90-word body and no meta description, which likely reads to Google as low-value/duplicate-ish content rather than a technical block.",
      fixSteps: [
        "Open this page in your CMS/site editor",
        "Add a unique meta description summarizing this exact page in 1-2 sentences",
        "Expand the body content to at least 300-500 words covering details a shopper would want",
        "Publish the changes",
      ],
      fixSnippetLabel: "Add this to your page's <head> section",
      fixSnippet: `<meta name="description" content="Write a unique 1-2 sentence summary of this exact page here.">`,
      reindexSteps: [
        "View the page's live source (Ctrl+U / Cmd+Opt+U) to confirm the new meta description is actually present",
        "In Search Console, go to URL Inspection, paste this URL, and click \"Test Live URL\" to confirm Google sees the update",
        "Only after the live test looks correct, click \"Request Indexing\"",
        "Re-checks typically take a few days to 2 weeks — avoid repeatedly re-submitting in the meantime",
      ],
      competitorComparison,
    };
  }

  return {
    url,
    indexed: true,
    performance: {
      clicks: 1240,
      impressions: 48200,
      ctr: "2.6%",
      position: "9.4",
      topQueries: [
        { query: "cold brew maker", position: "7.1" },
        { query: "best cold brew coffee maker", position: "11.3" },
        { query: "cold brew equipment", position: "14.8" },
      ],
    },
    suggestions: {
      candidateKeywords: ["cold brew maker", "cold brew coffee maker", "cold brew coffee machine"],
      focusKeyword: "cold brew maker",
      keywordConfidence: "verified_volume",
      keywordVerificationNote: "Ahrefs shows this exact phrase carries the highest real monthly search volume of the candidates at a rankable position.",
      currentMetaTitle: "Brewhaus Coffee Equipment",
      titleAssessment: "The current title is generic and doesn't contain your focus keyword — update recommended.",
      titleNeedsChange: true,
      metaTitle: "Cold Brew Maker — Smooth, Rich Coffee at Home | Brewhaus",
      metaTitleCharCount: 58,
      currentMetaDescription:
        "Brew smooth, low-acid cold brew coffee at home in minutes. Shop our top-rated cold brew maker with free shipping and a 30-day trial.",
      descriptionAssessment:
        "Already contains the focus keyword and is within length — no change needed.",
      descriptionNeedsChange: false,
      metaDescription:
        "Brew smooth, low-acid cold brew coffee at home in minutes. Shop our top-rated cold brew maker with free shipping and a 30-day trial.",
      metaDescriptionCharCount: 136,
      currentH1: "Brewhaus Coffee Equipment",
      h1Suggestion: "Cold Brew Maker",
      complianceNote: null,
      complianceFlags: [],
      contentTips: [
        "Add a comparison table against 2-3 similar products to capture 'vs' search queries",
        "Include a FAQ section answering common questions like brew time and cleaning",
        "Add customer review snippets with star ratings near the top of the page",
      ],
      keywordIdeas: ["cold brew coffee maker", "cold brew equipment", "how to make cold brew at home"],
    },
    competitorComparison,
  };
}
