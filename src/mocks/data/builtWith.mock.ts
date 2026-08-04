import type { BuiltWithResult } from "@/types/builtWith";

export function buildBuiltWithMock(url: string): BuiltWithResult {
  return {
    url,
    finalUrl: url,
    httpStatus: 200,
    technologies: [
      { name: "WordPress", category: "CMS" },
      { name: "jQuery", category: "JS Library" },
      { name: "Google Analytics", category: "Analytics" },
      { name: "Cloudflare", category: "CDN" },
    ],
    hosting: {
      ip: "192.0.2.10",
      hostingProvider: "Cloudflare, Inc.",
      country: "United States",
      city: "San Francisco",
    },
    serverHeader: "cloudflare",
    poweredByHeader: null,
  };
}
