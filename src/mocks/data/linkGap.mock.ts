import type { LinkGapBacklink, LinkGapResult } from "@/types/linkGap";

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  }
}

// Deterministic pseudo-random int in [min, max] seeded from a string, so the
// same pair of URLs always returns the same mock numbers/list.
// FNV-1a over the string, then a murmur3-style finisher so seeds that differ
// by only their last char/digit (e.g. "a::1" vs "a::2") don't land in
// neighboring buckets — plain FNV-1a alone leaves those correlated.
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

// Real, live homepages only (no fabricated deep paths) so every link in the
// sample actually resolves — this is illustrative sample data, not a real
// crawl, but the links themselves should never 404.
const SAMPLE_REFERRING_SITES = [
  "techcrunch.com",
  "forbes.com",
  "medium.com",
  "producthunt.com",
  "reddit.com",
  "hubspot.com",
  "g2.com",
  "capterra.com",
  "businessinsider.com",
  "searchenginejournal.com",
  "quicksprout.com",
  "backlinko.com",
  "neilpatel.com",
  "ahrefs.com",
  "semrush.com",
  "wired.com",
  "cnet.com",
  "pcmag.com",
  "zapier.com",
  "trustpilot.com",
];

const ANCHOR_TEXTS = [
  "read the full review",
  "check out this tool",
  "one of the best options",
  "a solid alternative",
  "learn more here",
  "compare pricing and features",
  "see how it stacks up",
  "highly recommended",
];

export function buildLinkGapMock(yourUrl: string, competitorUrl: string): LinkGapResult {
  const yourDomain = extractDomain(yourUrl);
  const competitorDomain = extractDomain(competitorUrl);
  const seed = `${yourDomain}::${competitorDomain}`;

  const gapCount = seededInt(seed, 180, 650);

  const backlinks: LinkGapBacklink[] = SAMPLE_REFERRING_SITES.map((domain, index) => {
    const itemSeed = `${seed}::${index}`;
    return {
      sourceUrl: `https://${domain}/`,
      sourceDomain: domain,
      domainRating: seededInt(itemSeed, 42, 91),
      targetUrl: `https://${competitorDomain}/`,
      anchorText: ANCHOR_TEXTS[seededInt(itemSeed, 0, ANCHOR_TEXTS.length - 1)],
    };
  });

  return {
    yourUrl,
    competitorUrl,
    gapCount,
    backlinks,
    isSampleData: true,
  };
}
