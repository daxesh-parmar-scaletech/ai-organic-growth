import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { recommendationsMock } from "@/mocks/data/recommendations.mock";
import httpService from "@/services/http.service";
import type { Recommendation } from "@/types/recommendation";

// Future backend contract:
//   GET  /projects/:id/recommendations       -> Recommendation[]
//   POST /recommendations/:id/apply          -> void

export async function getRecommendations(projectId: string): Promise<Recommendation[]> {
  if (USE_MOCKS) return mockDelay(recommendationsMock);
  return httpService.get<Recommendation[]>(API_CONFIG.recommendations(projectId));
}

export async function applyRecommendation(recommendationId: string): Promise<void> {
  if (USE_MOCKS) return mockDelay(undefined);
  return httpService.post<void>(API_CONFIG.applyRecommendation(recommendationId));
}
