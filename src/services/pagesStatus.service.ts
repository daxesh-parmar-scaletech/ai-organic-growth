import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { pagesStatusMock } from "@/mocks/data/pagesStatus.mock";
import httpService from "@/services/http.service";
import type { PageStatus } from "@/types/pages";

// Future backend contract: GET /projects/:id/pages/status -> PageStatus[]
export async function getPagesStatus(projectId: string): Promise<PageStatus[]> {
  if (USE_MOCKS) return mockDelay(pagesStatusMock);
  return httpService.get<PageStatus[]>(API_CONFIG.pagesStatus(projectId));
}

// Future backend contract: POST /projects/:id/pages/sync -> PageStatus[]
export async function syncPages(projectId: string): Promise<PageStatus[]> {
  if (USE_MOCKS) return mockDelay(pagesStatusMock, 1800);
  return httpService.post<PageStatus[]>(API_CONFIG.pagesSync(projectId));
}
