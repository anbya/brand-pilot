import type { DashboardActivity, DashboardAttentionItem, DashboardAttentionType, DashboardCampaignSummary, DashboardDataSource, DashboardDateRange, DashboardMetricComparison, DashboardPercentageChange, DashboardViewModel } from "@/lib/dashboard/types";
import { canAccessDashboardDestination, canNavigateDashboardAttention, filterDashboardAttentionByPermissions, filterDashboardMetricsByPermissions, getDashboardPermissions } from "@/lib/dashboard/permissions";
import type { DashboardPermissions } from "@/lib/dashboard/types";

const attentionPriority: Record<DashboardAttentionType, number> = { failed_publish: 0, overdue: 1, approval: 2, missing_asset: 3, low_credit: 4 };
const campaignStatusPriority: Record<DashboardCampaignSummary["status"], number> = { active: 0, planning: 1, paused: 2, draft: 3, completed: 4 };
export const LOW_CREDIT_THRESHOLD_PERCENTAGE = 20;
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));

export function calculateCampaignProgress(completedPosts: number, totalPosts: number): number {
  if (!Number.isFinite(totalPosts) || totalPosts <= 0) return 0;
  return Math.round(clamp(completedPosts, 0, totalPosts) / totalPosts * 100);
}

export function calculateCreditUsage(remainingCredits: number, totalCredits: number) {
  const total = Math.max(0, Number.isFinite(totalCredits) ? totalCredits : 0);
  if (total === 0) return { remaining: 0, used: 0, usedPercentage: 0, total };
  const remaining = clamp(remainingCredits, 0, total);
  const used = total - remaining;
  return { remaining, used, usedPercentage: Math.round(used / total * 100), total };
}

export function calculatePercentageChange(currentValue: number, previousValue: number): DashboardPercentageChange {
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue) || previousValue === 0) return { state: "no-baseline", percentage: null };
  return { state: "percentage", percentage: (currentValue - previousValue) / Math.abs(previousValue) * 100 };
}

export function formatDashboardDateRange(startDate: string, endDate: string): string {
  const format = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const start = new Date(`${startDate}T00:00:00Z`); const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Date unavailable";
  return `${format.format(start)} - ${format.format(end)}`;
}

export function getCampaignsForDashboard(campaigns: DashboardCampaignSummary[], selectedBrandId: string, dateRange: DashboardDateRange) {
  return campaigns.filter((campaign) => (selectedBrandId === "all" || campaign.brandId === selectedBrandId) && campaign.startDate <= dateRange.endDate && campaign.endDate >= dateRange.startDate);
}

export function getRecentCampaigns(campaigns: DashboardCampaignSummary[], limit = 4) {
  return [...campaigns].sort((first, second) => campaignStatusPriority[first.status] - campaignStatusPriority[second.status] || first.endDate.localeCompare(second.endDate) || second.startDate.localeCompare(first.startDate) || first.id.localeCompare(second.id)).slice(0, Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 0)));
}

export function getAttentionItemsByPriority(items: DashboardAttentionItem[], limit?: number) {
  const sorted = [...items].sort((first, second) => attentionPriority[first.type] - attentionPriority[second.type] || second.occurredAt.localeCompare(first.occurredAt));
  return limit === undefined ? sorted : sorted.slice(0, Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 0)));
}

export function getLatestActivities(activities: DashboardActivity[], limit = 5) {
  return [...activities].sort((first, second) => second.occurredAt.localeCompare(first.occurredAt)).slice(0, Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 0)));
}

export function formatDashboardAbsoluteTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(date);
}

export function formatDashboardRelativeTime(occurredAt: string, referenceTime: string): string {
  const occurred = new Date(occurredAt); const reference = new Date(referenceTime);
  if (Number.isNaN(occurred.getTime()) || Number.isNaN(reference.getTime())) return "Time unavailable";
  const differenceMs = reference.getTime() - occurred.getTime();
  if (differenceMs < 0) return Math.abs(differenceMs) <= 5 * 60_000 ? "In a few minutes" : formatDashboardAbsoluteTime(occurredAt);
  const minutes = Math.floor(differenceMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} days ago`;
  return formatDashboardAbsoluteTime(occurredAt);
}

function isDateInRange(value: string, dateRange: DashboardDateRange): boolean {
  const date = value.slice(0, 10);
  return date >= dateRange.startDate && date <= dateRange.endDate;
}

export function getPreviousPeriodDateRange(dateRange: DashboardDateRange): DashboardDateRange {
  const start = new Date(`${dateRange.startDate}T00:00:00Z`); const end = new Date(`${dateRange.endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return { id: `previous-${dateRange.id}`, label: "Previous period", startDate: dateRange.startDate, endDate: dateRange.startDate };
  const durationDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const previousEnd = new Date(start); previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd); previousStart.setUTCDate(previousStart.getUTCDate() - durationDays + 1);
  return { id: `previous-${dateRange.id}`, label: "Previous period", startDate: previousStart.toISOString().slice(0, 10), endDate: previousEnd.toISOString().slice(0, 10) };
}

export function aggregateCampaignMetrics(campaigns: DashboardCampaignSummary[]) {
  return {
    activeCampaigns: campaigns.filter((campaign) => campaign.status === "active").length,
    totalPosts: campaigns.reduce((total, campaign) => total + campaign.totalPosts, 0),
    readyPosts: campaigns.reduce((total, campaign) => total + campaign.readyPosts, 0),
  };
}

export function buildMetricComparison(currentValue: number, previousValue: number, hasPreviousData: boolean): DashboardMetricComparison {
  if (!hasPreviousData) return { state: "no-baseline", label: "No previous period data" };
  const change = calculatePercentageChange(currentValue, previousValue);
  if (change.state === "no-baseline") return { state: "no-baseline", label: "No previous period baseline" };
  const percentage = Math.round(Math.abs(change.percentage));
  if (change.percentage === 0) return { state: "unchanged", percentage: 0, label: "No change from previous period" };
  const state = change.percentage > 0 ? "increase" : "decrease";
  return { state, percentage, label: `${percentage}% ${state} vs previous period` };
}

function buildFilteredMetrics(data: DashboardDataSource, campaigns: DashboardCampaignSummary[], previousCampaigns: DashboardCampaignSummary[]) {
  const current = aggregateCampaignMetrics(campaigns);
  const previous = aggregateCampaignMetrics(previousCampaigns);
  const hasPreviousData = previousCampaigns.length > 0;
  const credit = calculateCreditUsage(data.creditUsage.remainingCredits, data.creditUsage.totalCredits);
  return data.metrics.map((metric) => {
    if (metric.id === "metric-total-campaigns") return { ...metric, value: current.activeCampaigns, comparison: buildMetricComparison(current.activeCampaigns, previous.activeCampaigns, hasPreviousData) };
    if (metric.id === "metric-total-posts") return { ...metric, value: current.totalPosts, comparison: buildMetricComparison(current.totalPosts, previous.totalPosts, hasPreviousData) };
    if (metric.id === "metric-ready-publish") return { ...metric, value: current.readyPosts, comparison: buildMetricComparison(current.readyPosts, previous.readyPosts, hasPreviousData) };
    if (metric.id === "metric-credits-left") return { ...metric, value: credit.remaining };
    return metric;
  });
}

export function buildDashboardViewModel(data: DashboardDataSource, options: { selectedBrandId?: string; selectedDateRangeId?: string; activityLimit?: number; attentionLimit?: number; campaignLimit?: number; permissions?: DashboardPermissions } = {}): DashboardViewModel {
  const selectedBrandId = options.selectedBrandId ?? "all";
  const selectedDateRange = data.dateRanges.find((range) => range.id === options.selectedDateRangeId) ?? data.dateRanges[0];
  if (!selectedDateRange) throw new Error("Dashboard requires at least one date range.");
  const permissions = options.permissions ?? getDashboardPermissions(data.user.role);
  const campaigns = getCampaignsForDashboard(data.campaigns, selectedBrandId, selectedDateRange);
  const previousCampaigns = getCampaignsForDashboard(data.campaigns, selectedBrandId, getPreviousPeriodDateRange(selectedDateRange));
  const matchesBrand = (brandId: string) => selectedBrandId === "all" || brandId === selectedBrandId;
  const creditUsage = calculateCreditUsage(data.creditUsage.remainingCredits, data.creditUsage.totalCredits);
  const remainingPercentage = creditUsage.total > 0 ? creditUsage.remaining / creditUsage.total * 100 : 100;
  const attentionItems = data.attentionItems.flatMap((item) => {
    if (item.type === "low_credit") return remainingPercentage <= LOW_CREDIT_THRESHOLD_PERCENTAGE ? [{ ...item, count: creditUsage.remaining }] : [];
    return item.brandId && matchesBrand(item.brandId) && isDateInRange(item.occurredAt, selectedDateRange) ? [item] : [];
  });
  const visibleAttentionItems = filterDashboardAttentionByPermissions(attentionItems, permissions).map((item) => item.href && !canNavigateDashboardAttention(item, permissions) ? { ...item, href: undefined } : item);
  const visibleMetrics = filterDashboardMetricsByPermissions(buildFilteredMetrics(data, campaigns, previousCampaigns), permissions).map((metric) => metric.href && !canAccessDashboardDestination(permissions, metric.href) ? { ...metric, href: undefined } : metric);
  const activityItems = data.activities.filter((item) => (item.scope === "workspace" ? permissions.canViewWorkspaceActivity : Boolean(item.brandId && matchesBrand(item.brandId))) && isDateInRange(item.occurredAt, selectedDateRange));
  return {
    user: data.user, brands: data.brands, selectedBrandId, selectedDateRange, dateRanges: data.dateRanges,
    metrics: visibleMetrics, creditUsage,
    referenceTime: data.referenceTime,
    campaigns: getRecentCampaigns(campaigns, options.campaignLimit ?? 4).map((campaign) => ({ ...campaign, progress: calculateCampaignProgress(campaign.completedPosts, campaign.totalPosts) })),
    totalCampaignCount: data.campaigns.length,
    filteredCampaignCount: campaigns.length,
    isWorkspaceEmpty: data.brands.length === 0 && data.campaigns.length === 0 && data.attentionItems.length === 0 && data.activities.length === 0,
    attentionItems: getAttentionItemsByPriority(visibleAttentionItems, options.attentionLimit ?? 3),
    activities: getLatestActivities(activityItems, options.activityLimit ?? 5).map((item) => ({ ...(item.href && !canAccessDashboardDestination(permissions, item.href) ? { ...item, href: undefined } : item), relativeTime: formatDashboardRelativeTime(item.occurredAt, data.referenceTime), absoluteTime: formatDashboardAbsoluteTime(item.occurredAt) })),
  };
}
