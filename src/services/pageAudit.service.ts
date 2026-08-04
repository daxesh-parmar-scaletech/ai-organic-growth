import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildPageAuditMock, buildCompetitorComparisonMock } from "@/mocks/data/pageAudit.mock";
import httpService from "@/services/http.service";
import type { PageAuditCompetitorComparison, PageAuditResult } from "@/types/pageAudit";
import type { Project } from "@/types/project";

// Future backend contract:
//   POST /projects/:id/page-audit { url, competitorUrl?, manualHtml? } -> PageAuditResult

export async function runPageAudit(
  project: Project,
  url: string,
  competitorUrl?: string,
  manualHtml?: string,
): Promise<PageAuditResult> {
  if (USE_MOCKS) {
    return mockDelay(buildPageAuditMock(url, project.domain, project.connected, competitorUrl), 1400);
  }
  return httpService.post<PageAuditResult>(API_CONFIG.pageAudit(project.id), { url, competitorUrl, manualHtml });
}

// Future backend contract:
//   POST /projects/:id/page-audit/competitor { url, competitorUrl } -> PageAuditCompetitorComparison

export async function runCompetitorAudit(
  project: Project,
  url: string,
  competitorUrl: string,
): Promise<PageAuditCompetitorComparison | null> {
  if (USE_MOCKS) {
    return mockDelay(buildCompetitorComparisonMock(url, competitorUrl), 1400);
  }
  return httpService.post<PageAuditCompetitorComparison | null>(API_CONFIG.pageAuditCompetitor(project.id), {
    url,
    competitorUrl,
  });
}
