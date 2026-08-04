import type { Recommendation } from "@/types/recommendation";

export function pageRecommendationsMock(pageUrl: string): Recommendation[] {
  return [
    {
      id: `seo-${pageUrl}`,
      priority: "High",
      category: "SEO",
      title: "Meta title doesn't match top ranking query intent",
      description: "The current title under-targets the queries actually driving impressions to this page.",
      impact: "+12% CTR",
      effort: "Low",
      steps: [
        "Rewrite the meta title to lead with the top query's primary keyword",
        "Keep the title under 60 characters",
        "Add a compelling value prop to the meta description",
      ],
    },
    {
      id: `content-${pageUrl}`,
      priority: "Medium",
      category: "Content Quality",
      title: "Content is thinner than competing top-10 results",
      description: "Comparable ranking pages cover more subtopics in more depth.",
      impact: "+8% clicks",
      effort: "Medium",
      steps: [
        "Add sections addressing related subtopics searchers also ask about",
        "Include original data, examples, or images not found on competitor pages",
      ],
    },
    {
      id: `technical-${pageUrl}`,
      priority: "Medium",
      category: "Technical SEO",
      title: "Missing structured data for this page type",
      description: "Adding relevant schema markup can unlock rich results in search.",
      impact: "+5% CTR",
      effort: "Low",
      steps: ["Add appropriate schema.org markup", "Validate with Google's Rich Results Test", "Resubmit for indexing"],
    },
    {
      id: `ux-${pageUrl}`,
      priority: "Low",
      category: "User Experience",
      title: "Primary call-to-action is below the fold on mobile",
      description: "Mobile visitors from search may not see the main CTA without scrolling.",
      impact: "+3% conversions",
      effort: "Low",
      steps: ["Move the primary CTA higher in the mobile layout", "A/B test placement against current version"],
    },
    {
      id: `performance-${pageUrl}`,
      priority: "Medium",
      category: "Performance",
      title: "Largest Contentful Paint is slower than top competitors",
      description: "Slower load times can suppress both rankings and click-through on mobile.",
      impact: "+6% rankings",
      effort: "Medium",
      steps: ["Compress and lazy-load below-the-fold images", "Preload the largest above-the-fold asset"],
    },
  ];
}
