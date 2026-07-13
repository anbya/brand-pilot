import type { DashboardActivityHref, DashboardAttentionItem, DashboardMetric, DashboardPermissions, DashboardUserRole } from "@/lib/dashboard/types";

const rolePermissions: Record<DashboardUserRole, DashboardPermissions> = {
  admin: { canViewDashboard: true, canViewCampaigns: true, canViewCalendar: true, canViewAssets: true, canViewBrandBrain: true, canCreateCampaign: true, canReviewContent: true, canManageAssets: true, canViewCredits: true, canViewAttention: true, canViewWorkspaceActivity: true, canRetryDashboardState: true },
  manager: { canViewDashboard: true, canViewCampaigns: true, canViewCalendar: true, canViewAssets: true, canViewBrandBrain: true, canCreateCampaign: true, canReviewContent: true, canManageAssets: true, canViewCredits: true, canViewAttention: true, canViewWorkspaceActivity: true, canRetryDashboardState: true },
  editor: { canViewDashboard: true, canViewCampaigns: true, canViewCalendar: true, canViewAssets: true, canViewBrandBrain: true, canCreateCampaign: false, canReviewContent: true, canManageAssets: true, canViewCredits: false, canViewAttention: true, canViewWorkspaceActivity: true, canRetryDashboardState: true },
  viewer: { canViewDashboard: true, canViewCampaigns: true, canViewCalendar: true, canViewAssets: true, canViewBrandBrain: true, canCreateCampaign: false, canReviewContent: false, canManageAssets: false, canViewCredits: false, canViewAttention: true, canViewWorkspaceActivity: true, canRetryDashboardState: true },
};

export function getDashboardPermissions(role: DashboardUserRole): DashboardPermissions { return { ...rolePermissions[role] }; }
export function formatDashboardRole(role: DashboardUserRole): string { return role.charAt(0).toUpperCase() + role.slice(1); }

export function canAccessDashboardDestination(permissions: DashboardPermissions, href: DashboardActivityHref | "/campaigns" | "/calendar" | "/assets"): boolean {
  if (href === "/campaigns") return permissions.canViewCampaigns;
  if (href === "/calendar") return permissions.canViewCalendar;
  if (href === "/assets") return permissions.canViewAssets;
  if (href === "/brain") return permissions.canViewBrandBrain;
  return false;
}

export function filterDashboardAttentionByPermissions(items: DashboardAttentionItem[], permissions: DashboardPermissions): DashboardAttentionItem[] {
  if (!permissions.canViewAttention) return [];
  return items.filter((item) => item.type !== "low_credit" || permissions.canViewCredits);
}

export function canNavigateDashboardAttention(item: DashboardAttentionItem, permissions: DashboardPermissions): boolean {
  if (!item.href) return false;
  if (!canAccessDashboardDestination(permissions, item.href)) return false;
  if (item.type === "missing_asset") return permissions.canManageAssets;
  if (item.type === "failed_publish" || item.type === "overdue" || item.type === "approval") return permissions.canReviewContent;
  return false;
}

export function filterDashboardMetricsByPermissions(metrics: DashboardMetric[], permissions: DashboardPermissions): DashboardMetric[] {
  return permissions.canViewCredits ? metrics : metrics.filter((metric) => metric.id !== "metric-credits-left");
}
