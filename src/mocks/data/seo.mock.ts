import type { CoreWebVitalsReport, CwvMetric, SeoBreakdownItem, SeoIssue, SiteAdvice } from "@/types/seo";

export const seoBreakdownMock: SeoBreakdownItem[] = [
  { label: "Technical SEO", score: 81 },
  { label: "On-page & content", score: 74 },
  { label: "Indexing & crawl", score: 58 },
  { label: "Core Web Vitals", score: 52 },
  { label: "Backlink profile", score: 69 },
];

export const issuesMock: SeoIssue[] = [
  { type: "Not indexed", pages: "34 product pages", severity: "High", status: "Open" },
  { type: "Slow LCP (mobile)", pages: "218 pages", severity: "High", status: "Open" },
  { type: "Redirect chains", pages: "11 pages", severity: "Medium", status: "Open" },
  { type: "Missing alt text", pages: "96 images", severity: "Low", status: "Open" },
  { type: "Duplicate titles", pages: "22 pages", severity: "Medium", status: "In review" },
];

export const cwvMock: CwvMetric[] = [
  { label: "LCP", name: "Largest Contentful Paint", value: "2.1s", status: "Good", percent: 78 },
  { label: "INP", name: "Interaction to Next Paint", value: "190ms", status: "Needs work", percent: 52 },
  { label: "CLS", name: "Cumulative Layout Shift", value: "0.06", status: "Good", percent: 88 },
];

export const coreWebVitalsReportMock: CoreWebVitalsReport = {
  mobile: {
    score: 68,
    metrics: [
      { label: "LCP", name: "Largest Contentful Paint", value: "3.2s", status: "Needs work", percent: 41 },
      { label: "TBT", name: "Total Blocking Time (lab proxy for INP)", value: "280ms", status: "Needs work", percent: 44 },
      { label: "CLS", name: "Cumulative Layout Shift", value: "0.08", status: "Good", percent: 92 },
    ],
  },
  desktop: {
    score: 91,
    metrics: [
      { label: "LCP", name: "Largest Contentful Paint", value: "1.4s", status: "Good", percent: 94 },
      { label: "TBT", name: "Total Blocking Time (lab proxy for INP)", value: "60ms", status: "Good", percent: 88 },
      { label: "CLS", name: "Cumulative Layout Shift", value: "0.02", status: "Good", percent: 98 },
    ],
  },
};

export const seoHealthScoreMock = 72;

export const domainAuthorityMock = 38;

export const indexingMock = {
  indexed: 1180,
  discovered: 1204,
  excluded: 24,
};

export const sitemapMock = {
  status: "Submitted & read",
  file: "sitemap.xml",
  urlCount: 1204,
  readAgo: "2 days ago",
};

export const crawlIssuesMock = {
  errors: 3,
  warnings: 12,
};

export const siteAdviceMock: SiteAdvice = {
  summary:
    "Your site is showing up in Google for some searches, but a chunk of your pages aren't being seen yet, and a few quick fixes could help more people find and trust your site.",
  fixes: [
    "Submit an updated sitemap so Google knows about every page on your site.",
    "Fix the pages showing errors first — Google skips pages it can't read properly.",
    "Clean up the redirect chains flagged below — each hop makes Google trust the page a little less.",
  ],
  improvementSuggestions: [
    "Add fresh, useful content to your lowest-ranking pages instead of only your homepage.",
    "Get other trustworthy websites to link to yours — it's one of the strongest trust signals for Google.",
    "Make sure your site loads quickly on mobile phones, not just desktop computers.",
    "Break up long blocks of text with headings and bullet points so it's easy to scan.",
  ],
};
