import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildLinkGapMock } from "@/mocks/data/linkGap.mock";
import httpService from "@/services/http.service";
import type { LinkGapResult } from "@/types/linkGap";

// Future backend contract:
//   POST /projects/:id/link-gap { yourUrl, competitorUrl } -> LinkGapResult

export async function checkLinkGap(
  projectId: string,
  yourUrl: string,
  competitorUrl: string,
): Promise<LinkGapResult> {
  if (USE_MOCKS) return mockDelay(buildLinkGapMock(yourUrl, competitorUrl), 1400);
  return httpService.post<LinkGapResult>(API_CONFIG.linkGap(projectId), { yourUrl, competitorUrl });
}
