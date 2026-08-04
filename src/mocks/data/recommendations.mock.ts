import type { Recommendation } from "@/types/recommendation";

export const recommendationsMock: Recommendation[] = [
  {
    id: "reco-indexing",
    priority: "High",
    category: "Indexing",
    title: "34 product pages are excluded from Google's index",
    impact: "+18% clicks",
    effort: "Medium",
    description:
      "Google discovered these URLs but chose not to index them — mostly “Crawled – currently not indexed”. That removes them from search entirely.",
    steps: [
      "Review the 34 excluded URLs in the Indexing report",
      "Strengthen thin content and add unique meta data",
      "Add internal links from high-authority category pages",
      "Request indexing via the URL Inspection API",
    ],
  },
  {
    id: "reco-cwv",
    priority: "High",
    category: "Core Web Vitals",
    title: "Largest Contentful Paint is slow on mobile (3.9s)",
    impact: "+6% CTR",
    effort: "High",
    description:
      "62% of mobile URLs fail the LCP threshold, hurting rankings on mobile-first indexing and increasing bounce.",
    steps: [
      "Serve hero images as WebP/AVIF with explicit dimensions",
      "Preload the LCP image and defer non-critical JS",
      "Enable a CDN and cache static assets",
    ],
  },
  {
    id: "reco-rankings",
    priority: "High",
    category: "Rankings",
    title: "Dropped from #4 to #11 for “cold brew maker”",
    impact: "+9K clicks/mo",
    effort: "Medium",
    description:
      "A competitor published a stronger comparison page. This high-intent term drove significant traffic before the drop.",
    steps: [
      "Refresh the target page with updated 2026 data",
      "Add comparison table and FAQ schema",
      "Build 3–4 internal links from related guides",
    ],
  },
  {
    id: "reco-keywords",
    priority: "Medium",
    category: "Keywords",
    title: "12 keywords sit at positions #11–#15 — page-one within reach",
    impact: "+7% clicks",
    effort: "Low",
    description:
      "These “striking distance” keywords need small on-page nudges to break onto page one where CTR jumps sharply.",
    steps: [
      "Optimise title tags to include the exact query",
      "Expand sections that partially answer intent",
      "Add supporting internal links",
    ],
  },
  {
    id: "reco-internal-linking",
    priority: "Medium",
    category: "Internal linking",
    title: "48 orphan pages have no internal links",
    impact: "+4% coverage",
    effort: "Low",
    description:
      "Pages with no internal links are hard for Google to discover and pass little authority, limiting their ranking potential.",
    steps: [
      "Add contextual links from relevant articles",
      "Include orphans in category and hub pages",
    ],
  },
  {
    id: "reco-metadata",
    priority: "Low",
    category: "Metadata",
    title: "60 pages have duplicate or missing meta descriptions",
    impact: "+2% CTR",
    effort: "Low",
    description:
      "Missing descriptions let Google auto-generate snippets, which usually convert worse than a crafted description.",
    steps: [
      "Auto-draft unique descriptions with AI",
      "Keep within 150–160 characters and add a CTA",
    ],
  },
];
