import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { coreWebVitalsReportMock } from "@/mocks/data/seo.mock";
import httpService from "@/services/http.service";
import type { CoreWebVitalsReport } from "@/types/seo";

// Future backend contract:
//   POST /core-web-vitals { url } -> CoreWebVitalsReport

export async function checkCoreWebVitals(url: string): Promise<CoreWebVitalsReport> {
  if (USE_MOCKS) return mockDelay(coreWebVitalsReportMock, 1400);
  return httpService.post<CoreWebVitalsReport>(API_CONFIG.coreWebVitals, { url });
}
