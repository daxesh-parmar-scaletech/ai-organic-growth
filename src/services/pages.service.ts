import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { pagesMock } from "@/mocks/data/pages.mock";
import httpService from "@/services/http.service";
import type { PageMetric } from "@/types/page";

// Future backend contract: GET /projects/:id/pages -> PageMetric[]

export async function getPages(projectId: string): Promise<PageMetric[]> {
  if (USE_MOCKS) return mockDelay(pagesMock);
  return httpService.get<PageMetric[]>(API_CONFIG.pages(projectId));
}
