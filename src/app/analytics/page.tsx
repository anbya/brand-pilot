import { AnalyticsClient } from "@/components/analytics/analytics-client";
import { analyticsMockData } from "@/lib/analytics/mock-data";
import { getAnalyticsPermissions } from "@/lib/analytics/permissions";
import { analyticsStateScenarios } from "@/lib/analytics/state-scenarios";
import type { AnalyticsFilters, AnalyticsRole, AnalyticsScenario } from "@/lib/analytics/types";
import { dashboardRoleUsers } from "@/lib/dashboard/mock-data";

const validRoles: AnalyticsRole[] = ["admin", "manager", "editor", "viewer"];
const defaultFilters: AnalyticsFilters = { dateRangeId: "7-days", brandId: "all", campaignId: "all", platform: "all", contentType: "all" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const roleValue = typeof query.role === "string" ? query.role : "admin";
  const role = validRoles.includes(roleValue as AnalyticsRole) ? roleValue as AnalyticsRole : "admin";
  const scenarioName = typeof query.scenario === "string" ? query.scenario : "ready";
  const scenario = getScenario(scenarioName);
  const permissions = getAnalyticsPermissions(role);
  const scenarioRecords = scenarioName === "empty" ? [] : analyticsMockData.records;
  const records = permissions.viewAnalyticsFinancialMetrics ? scenarioRecords : scenarioRecords.map((record) => ({ ...record, spend: 0, attributedRevenue: 0 }));
  const dataSource = { ...analyticsMockData, user: dashboardRoleUsers[role], records };
  const initialFilters = scenarioName === "filter-empty" ? { ...defaultFilters, brandId: "brand-coffee-xyz", platform: "youtube" as const } : defaultFilters;
  return <main className="bp-page"><AnalyticsClient dataSource={dataSource} permissions={permissions} initialScenario={scenario} initialFilters={initialFilters} /></main>;
}

function getScenario(value: string): AnalyticsScenario {
  if (value === "loading") return analyticsStateScenarios.loading;
  if (value === "error") return analyticsStateScenarios.globalError;
  if (value === "metrics-error") return analyticsStateScenarios.metricsError;
  if (value === "chart-error") return analyticsStateScenarios.chartError;
  if (value === "channels-error") return analyticsStateScenarios.channelsError;
  if (value === "content-error") return analyticsStateScenarios.contentError;
  return analyticsStateScenarios.ready;
}
