import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { pageAnalysisMock } from "@/mocks/data/pageAnalysis.mock";
import httpService from "@/services/http.service";
import type { PageAnalysis } from "@/types/pageAnalysis";

// Future backend contract: POST /projects/:id/page-analysis { url, competitorUrl?, manualHtml? } -> PageAnalysis

export async function analyzePage(
  projectId: string,
  url: string,
  competitorUrl?: string,
  manualHtml?: string,
): Promise<PageAnalysis> {
  if (USE_MOCKS) return mockDelay(pageAnalysisMock(url, competitorUrl, manualHtml), competitorUrl ? 2200 : 1600);
  return httpService.post<PageAnalysis>(API_CONFIG.pageAnalysis(projectId), { url, competitorUrl, manualHtml });
}
