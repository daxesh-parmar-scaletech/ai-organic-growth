import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import {
  crawlIssuesMock,
  cwvMock,
  domainAuthorityMock,
  indexingMock,
  issuesMock,
  seoBreakdownMock,
  seoHealthScoreMock,
  siteAdviceMock,
  sitemapMock,
} from "@/mocks/data/seo.mock";
import httpService from "@/services/http.service";
import type { CwvMetric, SeoBreakdownItem, SeoIssue, SiteAdvice } from "@/types/seo";

export interface SeoAnalysisResponse {
  healthScore: number;
  breakdown: SeoBreakdownItem[];
  issues: SeoIssue[];
  cwv: CwvMetric[];
  indexing: typeof indexingMock;
  sitemap: typeof sitemapMock;
  crawlIssues: typeof crawlIssuesMock;
  siteAdvice: SiteAdvice | null;
  domainAuthority: number | null;
}

// Future backend contract: GET /projects/:id/seo-analysis -> SeoAnalysisResponse

export async function getSeoAnalysis(projectId: string): Promise<SeoAnalysisResponse> {
  if (USE_MOCKS) {
    return mockDelay({
      healthScore: seoHealthScoreMock,
      breakdown: seoBreakdownMock,
      issues: issuesMock,
      cwv: cwvMock,
      indexing: indexingMock,
      sitemap: sitemapMock,
      crawlIssues: crawlIssuesMock,
      siteAdvice: siteAdviceMock,
      domainAuthority: domainAuthorityMock,
    });
  }
  return httpService.get<SeoAnalysisResponse>(API_CONFIG.seoAnalysis(projectId));
}
