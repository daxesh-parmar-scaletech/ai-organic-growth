import type { TitleGenerationResult } from "@/types/titleGenerator";

// Deterministic mock titles built from the keyword, mirroring the spread of
// real search intents the real prompt researches (best-of, product/benefit,
// buying guide, comparison, how-it-works) — purely for local/mocked development.
export function buildTitleGenerationMock(keyword: string): TitleGenerationResult {
  const term = keyword.trim();
  const titled = term
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    titles: [
      `Best ${titled} in 2026 - Top Picks Compared | GuidePro`,
      `${titled} - Premium Quality, Fast Shipping | PureSupply`,
      `${titled} Buying Guide: What to Look for Before You Order`,
      `${titled} vs the Alternatives: Which Is Right for You?`,
      `What Is ${titled}? A Beginner's Guide | LearnHub`,
    ],
  };
}
