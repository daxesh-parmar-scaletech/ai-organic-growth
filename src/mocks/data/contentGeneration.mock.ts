import type { GeneratedContent, PlagiarismResult } from "@/types/contentGeneration";

export function buildPlagiarismMock(text: string): PlagiarismResult {
  const wordsChecked = text.trim().split(/\s+/).filter(Boolean).length;
  return {
    plagiarismPercentage: 3,
    matchesFound: 1,
    wordsChecked,
    matches: [
      {
        url: "https://example.com/similar-blog-post",
        title: "A blog post sharing a few common phrases",
        matchedWords: 12,
      },
    ],
  };
}

// Stands in for the real edit endpoint: appends a short note to the top of the
// article so it's obvious in mock mode that the instruction was "applied",
// without actually running an LLM.
export function buildEditContentMock(content: GeneratedContent, instruction: string): GeneratedContent {
  const note = `<p><em>[Mock edit applied: "${instruction}"]</em></p>\n`;
  return {
    ...content,
    contentHtml: note + content.contentHtml,
  };
}

export function buildContentGenerationMock(productUrl: string): GeneratedContent {
  return {
    productUrl,
    blogTitle: "Why the EcoFlow Steel Water Bottle Beats Plastic Every Time",
    slug: "eco-steel-water-bottle-vs-plastic",
    metaTitle: "EcoFlow Steel Water Bottle: Why It Beats Plastic",
    metaDescription:
      "Discover why the EcoFlow steel water bottle keeps drinks colder, lasts longer, and cuts plastic waste. Shop the bottle that pays for itself.",
    focusKeyword: "steel water bottle",
    tags: ["steel water bottle", "reusable bottles", "eco-friendly", "hydration", "sustainable living"],
    excerpt:
      "Plastic bottles pile up in landfills for centuries — here's why switching to a steel water bottle is one of the easiest upgrades you'll make this year.",
    contentHtml: `<h2>Why Your Water Bottle Choice Actually Matters</h2>
<p>Every year, the average person throws away over 150 plastic bottles. A quality <strong>steel water bottle</strong> like the <a href="${productUrl}">EcoFlow Steel Water Bottle</a> replaces all of them — and keeps your drink colder for longer while it's at it.</p>
<p>This article covers everything you need to know before switching, including durability, insulation performance, and the real cost savings over time.</p>
<h2>The Problem With Plastic Bottles</h2>
<p>Plastic bottles degrade with reuse, leach chemicals when left in the sun, and are one of the most common landfill and ocean pollutants worldwide. If you've ever noticed a plastic taste in your water, that's part of why.</p>
<h3>Health Concerns</h3>
<ul>
<li>BPA and microplastics can leach into your water over time</li>
<li>Plastic retains odors and bacteria more easily than steel</li>
<li>Most plastic bottles aren't designed for hundreds of reuse cycles</li>
</ul>
<h2>Why Steel Wins</h2>
<p>A double-walled, vacuum-insulated <a href="${productUrl}">steel water bottle</a> solves each of these problems directly.</p>
<h3>1. Temperature Retention</h3>
<p>Steel insulation keeps cold drinks cold for up to 24 hours and hot drinks hot for up to 12 — something plastic simply cannot do.</p>
<h3>2. Durability</h3>
<p>Steel bottles like the EcoFlow are dent-resistant and built to survive years of daily use, drops included, without cracking or clouding like plastic does.</p>
<h3>3. Sustainability</h3>
<p>One steel bottle replacing 150+ plastic bottles a year adds up fast — for your wallet and for the planet.</p>
<h2>How to Choose the Right Bottle</h2>
<ul>
<li>Look for <strong>18/8 stainless steel</strong> construction</li>
<li>Prioritize a <strong>double-wall vacuum seal</strong> for insulation</li>
<li>Check the lid — leak-proof matters more than it seems</li>
<li>Pick a size that matches your daily water goal (32oz is a common sweet spot)</li>
</ul>
<p>The <a href="${productUrl}">EcoFlow Steel Water Bottle</a> checks every one of these boxes, which is why it's become a go-to recommendation for anyone making the switch.</p>
<h2>Related Reading</h2>
<ul>
<li><a href="/blog/how-to-clean-steel-water-bottle">How to Clean a Steel Water Bottle Properly</a></li>
<li><a href="/blog/best-reusable-bottles-gym">Best Reusable Bottles for the Gym</a></li>
<li><a href="/blog/reduce-plastic-waste-at-home">A Beginner's Guide to Reducing Plastic Waste at Home</a></li>
<li><a href="/blog/insulated-vs-non-insulated-bottles">Insulated vs Non-Insulated Bottles: What's the Difference?</a></li>
</ul>`,
    wordCount: 1240,
    imagePrompt: `Create a professional, on-brand promotional product graphic for "Steel Water Bottle 32oz" by the brand "EcoFlow".

Layout template (keep this exact structure for consistency with this brand's other product images):
- Square 800x800 canvas, dark moody background (near-black) with soft warm gold-toned smoke/light gradient accents drifting from one corner.
- Brand name "EcoFlow" displayed in bold warm gold lettering in the top-left corner, small logo-style.
- A large bold headline introducing the product name "Steel Water Bottle 32oz" in the upper-left area, in white and warm gold lettering, big and highly legible.
- The product itself (packaging/bottle/box or primary product shot) rendered realistically, centered-right, well-lit with dramatic rim lighting matching the warm gold accent, sitting on a dark textured surface.
- A row of 3-4 small circular icon badges along the bottom-left with a one-line caption under each for these key features: "24-Hour Cold Retention", "Dent-Resistant Steel", "Leak-Proof Lid", "Eco-Friendly Build".
- Overall mood: premium, polished, high-end advertising photography style — consistent lighting, color grading, and composition so it looks like part of the same product-ad series every time.

Technical requirements: generate as a square 800x800 pixel image, high resolution and high quality, exported as an optimized/compressed file (compressed JPEG or WebP) suitable for fast web loading. Paste this prompt directly into ChatGPT/DALL-E, Claude, or Midjourney.`,
    internalLinkSuggestions: [
      { anchorText: "How to Clean a Steel Water Bottle Properly", note: "Link from the durability section to a care/maintenance guide." },
      { anchorText: "Best Reusable Bottles for the Gym", note: "Link from the 'choosing the right bottle' section for readers focused on fitness use." },
      { anchorText: "A Beginner's Guide to Reducing Plastic Waste at Home", note: "Link from the sustainability section to a broader eco-living pillar page." },
      { anchorText: "Insulated vs Non-Insulated Bottles", note: "Link from the temperature retention section for readers comparing bottle types." },
    ],
    faqs: [
      {
        question: "Is a steel water bottle worth it?",
        answer:
          "Yes — most pay for themselves within 2-3 months compared to buying plastic bottles, and they last 5-10 years with normal use.",
      },
      {
        question: "Will it affect the taste of water?",
        answer:
          "No, quality 18/8 stainless steel is non-reactive and won't alter taste or odor the way some plastics can over time.",
      },
      {
        question: "How long does it keep drinks cold?",
        answer:
          "A double-wall vacuum-insulated bottle like the EcoFlow keeps drinks cold for up to 24 hours and hot drinks hot for up to 12 hours.",
      },
      {
        question: "Is it safe to put in the dishwasher?",
        answer:
          "Most steel bottles are hand-wash recommended to protect the insulation seal — check the specific care instructions included with your bottle.",
      },
    ],
    faqJsonLd: `<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is a steel water bottle worth it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — most pay for themselves within 2-3 months compared to buying plastic bottles, and they last 5-10 years with normal use.",
        },
      },
      {
        "@type": "Question",
        name: "Will it affect the taste of water?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, quality 18/8 stainless steel is non-reactive and won't alter taste or odor the way some plastics can over time.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it keep drinks cold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A double-wall vacuum-insulated bottle like the EcoFlow keeps drinks cold for up to 24 hours and hot drinks hot for up to 12 hours.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to put in the dishwasher?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most steel bottles are hand-wash recommended to protect the insulation seal — check the specific care instructions included with your bottle.",
        },
      },
    ],
  },
  null,
  2,
)}
</script>`,
    seoRating: {
      score: 92,
      summary: "1,240-word article meets Rank Math's 1,200-word minimum; biggest gap: URL slug could front-load the keyword more.",
    },
    aeoRating: {
      score: 88,
      summary: "4 FAQ entries make this eligible for voice-assistant/answer-box results; biggest gap: opening paragraph runs a touch long.",
    },
    geoRating: {
      score: 85,
      summary: "Brand and product are named clearly, so AI engines can attribute this content correctly; biggest gap: add a few more concrete stats.",
    },
  };
}
