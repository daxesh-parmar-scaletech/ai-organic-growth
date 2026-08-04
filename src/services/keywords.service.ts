import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { keywordsMock } from "@/mocks/data/keywords.mock";
import httpService from "@/services/http.service";
import type { Keyword } from "@/types/keyword";

// Future backend contract: GET /projects/:id/keywords -> Keyword[]

export async function getKeywords(projectId: string): Promise<Keyword[]> {
  if (USE_MOCKS) return mockDelay(keywordsMock);
  return httpService.get<Keyword[]>(API_CONFIG.keywords(projectId));
}
