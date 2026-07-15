"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLatestActivity } from "@/components/dashboard/dashboard-latest-activity";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardNeedsAttention } from "@/components/dashboard/dashboard-needs-attention";
import { DashboardActivitySkeleton, DashboardAttentionSkeleton, DashboardCampaignsSkeleton, DashboardMetricsSkeleton, DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardGlobalError, DashboardWorkspaceEmpty } from "@/components/dashboard/dashboard-state";
import { DashboardWidgetError } from "@/components/dashboard/dashboard-widget-error";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { buildDashboardViewModel } from "@/lib/dashboard/selectors";
import { readyDashboardWidgetStates } from "@/lib/dashboard/state-scenarios";
import type { DashboardDataSource, DashboardLoadState, DashboardPermissions, DashboardStateScenario, DashboardWidgetKey, DashboardWidgetStates } from "@/lib/dashboard/types";

type Props = { dataSource: DashboardDataSource; permissions: DashboardPermissions; initialDateRangeId: string; initialScenario: DashboardStateScenario };

export function DashboardClient({ dataSource, permissions, initialDateRangeId, initialScenario }: Props) {
  const [selectedBrandId, setSelectedBrandId] = useState("all");
  const [selectedDateRangeId, setSelectedDateRangeId] = useState(initialDateRangeId);
  const [loadState, setLoadState] = useState<DashboardLoadState>(initialScenario.dashboard);
  const [widgetStates, setWidgetStates] = useState<DashboardWidgetStates>(initialScenario.widgets);
  const dashboard = useMemo(() => buildDashboardViewModel(dataSource, { selectedBrandId, selectedDateRangeId, activityLimit: 5, attentionLimit: 3, campaignLimit: 4, permissions }), [dataSource, permissions, selectedBrandId, selectedDateRangeId]);

  function retryDashboard() { setLoadState({ status: "ready" }); setWidgetStates({ ...readyDashboardWidgetStates }); }
  function retryWidget(key: DashboardWidgetKey) { setWidgetStates((current) => ({ ...current, [key]: { status: "ready" } })); }

  return <div className="bp-page-container">
    <DashboardHeader user={dashboard.user} brands={dashboard.brands} dateRanges={dashboard.dateRanges} selectedBrandId={selectedBrandId} selectedDateRangeId={dashboard.selectedDateRange.id} disabled={loadState.status !== "ready"} onBrandChange={setSelectedBrandId} onDateRangeChange={setSelectedDateRangeId} />
    {loadState.status === "loading" ? <DashboardSkeleton metricCount={permissions.canViewCredits ? 4 : 3} /> : loadState.status === "error" ? <DashboardGlobalError message={loadState.message} onRetry={permissions.canRetryDashboardState ? retryDashboard : undefined} /> : dashboard.isWorkspaceEmpty ? <DashboardWorkspaceEmpty canCreateCampaign={permissions.canCreateCampaign} canViewCampaigns={permissions.canViewCampaigns} /> : <>
      {widgetStates.attention.status === "loading" ? <DashboardAttentionSkeleton /> : widgetStates.attention.status === "error" ? <DashboardWidgetError className="mt-6" title="Needs Attention unavailable" message={widgetStates.attention.message} onRetry={permissions.canRetryDashboardState ? () => retryWidget("attention") : undefined} /> : <DashboardNeedsAttention items={dashboard.attentionItems} />}
      {widgetStates.metrics.status === "loading" ? <DashboardMetricsSkeleton count={permissions.canViewCredits ? 4 : 3} /> : widgetStates.metrics.status === "error" ? <DashboardWidgetError className="mt-6" title="Dashboard summary unavailable" message={widgetStates.metrics.message} onRetry={permissions.canRetryDashboardState ? () => retryWidget("metrics") : undefined} /> : <DashboardMetrics metrics={dashboard.metrics} creditUsage={dashboard.creditUsage} />}
      <div className="mt-5 grid min-w-0 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-12">
        <section className="min-w-0 xl:col-span-8">{widgetStates.campaigns.status === "loading" ? <DashboardCampaignsSkeleton /> : widgetStates.campaigns.status === "error" ? <DashboardWidgetError title="Recent Campaigns unavailable" message={widgetStates.campaigns.message} onRetry={permissions.canRetryDashboardState ? () => retryWidget("campaigns") : undefined} /> : <RecentCampaigns campaigns={dashboard.campaigns} totalCampaignCount={dashboard.totalCampaignCount} filteredCampaignCount={dashboard.filteredCampaignCount} canViewAll={permissions.canViewCampaigns} />}</section>
        <div className="min-w-0 xl:col-span-4">{widgetStates.activity.status === "loading" ? <DashboardActivitySkeleton /> : widgetStates.activity.status === "error" ? <DashboardWidgetError title="Latest Activity unavailable" message={widgetStates.activity.message} onRetry={permissions.canRetryDashboardState ? () => retryWidget("activity") : undefined} /> : <DashboardLatestActivity activities={dashboard.activities} />}</div>
      </div>
    </>}
  </div>;
}
