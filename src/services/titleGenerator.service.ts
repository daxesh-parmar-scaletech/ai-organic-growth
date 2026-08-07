import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildTitleGenerationMock } from "@/mocks/data/titleGenerator.mock";
import httpService from "@/services/http.service";
import type { TitleGenerationResult } from "@/types/titleGenerator";

// Future backend contract:
//   POST /projects/:id/title-generator { keyword } -> TitleGenerationResult

export async function generateTitles(projectId: string, keyword: string): Promise<TitleGenerationResult> {
  if (USE_MOCKS) return mockDelay(buildTitleGenerationMock(keyword), 1000);
  return httpService.post<TitleGenerationResult>(API_CONFIG.titleGenerator(projectId), { keyword });
}
