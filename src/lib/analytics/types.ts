import type { DashboardUser, DashboardUserRole } from "@/lib/dashboard/types";
import type { SocialPlatform } from "@/lib/platforms";
import type { CampaignStatus } from "@/lib/campaign-status";

export type AnalyticsPlatform = SocialPlatform;
export type AnalyticsContentType = "image" | "video" | "carousel" | "story" | "document";
export type AnalyticsDateRangeId = "7-days" | "30-days" | "all-time";
export type AnalyticsTrendState = "increase" | "decrease" | "no-change" | "new-activity" | "no-baseline" | "unavailable";
export type AnalyticsWidgetKey = "metrics" | "chart" | "channels" | "content";
export type AnalyticsLoadState = { status: "ready" } | { status: "loading" } | { status: "error"; message: string };
export type AnalyticsWidgetState = { status: "ready" } | { status: "loading" } | { status: "error"; message: string };

export interface AnalyticsFilters {
  dateRangeId: AnalyticsDateRangeId;
  brandId: string;
  campaignId: string;
  platform: AnalyticsPlatform | "all";
  contentType: AnalyticsContentType | "all";
}

export interface AnalyticsBrand { id: string; name: string }
export interface AnalyticsCampaign { id: string; brandId: string; name: string; status: CampaignStatus }

export interface AnalyticsPerformanceRecord {
  id: string;
  brandId: string;
  campaignId: string;
  postId: string;
  assetId: string;
  postTitle: string;
  thumbnailUrl?: string;
  platform: AnalyticsPlatform;
  contentType: AnalyticsContentType;
  publishedAt: string;
  recordedAt: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  conversions: number;
  spend: number;
  attributedRevenue: number;
}

export interface AnalyticsTrend { state: AnalyticsTrendState; percentage: number | null; label: string }
export interface AnalyticsKpi { id: "clicks" | "conversion-rate" | "roas" | "reach"; label: string; value: number; formattedValue: string; description: string; trend: AnalyticsTrend; financial: boolean }
export interface ReachEngagementPoint { id: string; label: string; fullLabel: string; reach: number; engagement: number; engagementRate: number }
export interface ChannelPerformance { platform: AnalyticsPlatform; spend: number; reach: number; impressions: number; engagement: number; engagementRate: number; clicks: number; conversions: number; conversionRate: number; roas: number; budgetShare: number; conversionShare: number }
export interface TopPerformingContentItem extends AnalyticsPerformanceRecord { campaignName: string; engagement: number; engagementRate: number; trend: AnalyticsTrend }

export interface AnalyticsPermissions {
  viewAnalytics: boolean;
  useAnalyticsFilters: boolean;
  viewAnalyticsFinancialMetrics: boolean;
  exportAnalytics: boolean;
  viewChannelBreakdown: boolean;
  openAnalyticsAsset: boolean;
}

export interface AnalyticsDataSource {
  user: DashboardUser;
  referenceTime: string;
  brands: AnalyticsBrand[];
  campaigns: AnalyticsCampaign[];
  records: AnalyticsPerformanceRecord[];
}

export interface AnalyticsViewModel {
  filters: AnalyticsFilters;
  brands: AnalyticsBrand[];
  campaigns: AnalyticsCampaign[];
  platforms: AnalyticsPlatform[];
  currentRecords: AnalyticsPerformanceRecord[];
  previousRecords: AnalyticsPerformanceRecord[];
  kpis: AnalyticsKpi[];
  series: ReachEngagementPoint[];
  channels: ChannelPerformance[];
  content: TopPerformingContentItem[];
  isWorkspaceEmpty: boolean;
  isFilterEmpty: boolean;
  periodStart: string;
  periodEnd: string;
}

export interface AnalyticsScenario {
  analytics: AnalyticsLoadState;
  widgets: Record<AnalyticsWidgetKey, AnalyticsWidgetState>;
}

export type AnalyticsRole = DashboardUserRole;
