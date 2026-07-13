import type { AnalyticsPermissions, AnalyticsRole } from "@/lib/analytics/types";

const analyticsRolePermissions: Record<AnalyticsRole, AnalyticsPermissions> = {
  admin: { viewAnalytics: true, useAnalyticsFilters: true, viewAnalyticsFinancialMetrics: true, exportAnalytics: true, viewChannelBreakdown: true, openAnalyticsAsset: false },
  manager: { viewAnalytics: true, useAnalyticsFilters: true, viewAnalyticsFinancialMetrics: true, exportAnalytics: true, viewChannelBreakdown: true, openAnalyticsAsset: false },
  editor: { viewAnalytics: true, useAnalyticsFilters: true, viewAnalyticsFinancialMetrics: false, exportAnalytics: false, viewChannelBreakdown: true, openAnalyticsAsset: false },
  viewer: { viewAnalytics: true, useAnalyticsFilters: true, viewAnalyticsFinancialMetrics: false, exportAnalytics: false, viewChannelBreakdown: true, openAnalyticsAsset: false },
};

export function getAnalyticsPermissions(role: AnalyticsRole): AnalyticsPermissions { return { ...analyticsRolePermissions[role] }; }
