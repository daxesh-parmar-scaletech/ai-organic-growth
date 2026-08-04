import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { pageRecommendationsMock } from "@/mocks/data/pageRecommendations.mock";
import httpService from "@/services/http.service";
import type { Recommendation } from "@/types/recommendation";

// Future backend contract: POST /projects/:id/pages/recommendations { url } -> Recommendation[]

export async function generatePageRecommendations(projectId: string, url: string): Promise<Recommendation[]> {
  if (USE_MOCKS) return mockDelay(pageRecommendationsMock(url), 1400);
  return httpService.post<Recommendation[]>(API_CONFIG.pageRecommendations(projectId), { url });
}
