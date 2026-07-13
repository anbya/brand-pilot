export type DashboardCampaignStatus = "draft" | "planning" | "active" | "paused" | "completed";
export type DashboardUserRole = "admin" | "manager" | "editor" | "viewer";
export type DashboardPlatform = "instagram" | "tiktok" | "facebook" | "linkedin" | "youtube";
export type DashboardAttentionType = "failed_publish" | "overdue" | "approval" | "missing_asset" | "low_credit";
export type DashboardActivityType = "campaign_created" | "post_approved" | "post_scheduled" | "asset_uploaded" | "brand_brain_updated" | "ai_ideas_generated";
export type DashboardActivityHref = "/campaigns" | "/calendar" | "/assets" | "/brain";
export type DashboardWidgetKey = "metrics" | "attention" | "campaigns" | "activity";
export type DashboardLoadState = { status: "ready" } | { status: "loading" } | { status: "error"; message: string };
export type DashboardWidgetState = { status: "ready" } | { status: "loading" } | { status: "error"; message: string };
export type DashboardWidgetStates = Record<DashboardWidgetKey, DashboardWidgetState>;
export interface DashboardStateScenario { dashboard: DashboardLoadState; widgets: DashboardWidgetStates }
export interface DashboardPermissions { canViewDashboard: boolean; canViewCampaigns: boolean; canViewCalendar: boolean; canViewAssets: boolean; canViewBrandBrain: boolean; canCreateCampaign: boolean; canReviewContent: boolean; canManageAssets: boolean; canViewCredits: boolean; canViewAttention: boolean; canViewWorkspaceActivity: boolean; canRetryDashboardState: boolean }
export type DashboardMetricTone = "blue" | "indigo" | "red";
export type DashboardMetricIcon = "campaign" | "dashboard" | "spark" | "bolt";
export type DashboardMetricComparison =
  | { state: "increase" | "decrease" | "unchanged"; percentage: number; label: string }
  | { state: "no-baseline"; label: string };

export interface DashboardUser { id: string; name: string; role: DashboardUserRole; initials: string; avatarUrl?: string }
export interface DashboardBrand { id: string; name: string; slug: string }
export interface DashboardDateRange { id: string; label: string; startDate: string; endDate: string }
export interface DashboardMetric { id: string; label: string; value: number; icon: DashboardMetricIcon; tone: DashboardMetricTone; supportingText: string; comparison: DashboardMetricComparison; href?: "/campaigns" | "/calendar" }
export interface DashboardCreditUsage { id: string; remainingCredits: number; totalCredits: number }
export interface DashboardCampaignSummary { id: string; brandId: string; brandName: string; name: string; startDate: string; endDate: string; status: DashboardCampaignStatus; completedPosts: number; readyPosts: number; totalPosts: number; platforms: DashboardPlatform[]; icon: "spark" | "idea" | "check"; color: string; textColor: string }
export interface DashboardAttentionItem { id: string; brandId?: string; campaignId?: string; scope: "brand" | "workspace"; type: DashboardAttentionType; title: string; description: string; count: number; countLabel: string; occurredAt: string; href?: "/calendar" | "/assets" }
export interface DashboardActivity { id: string; scope: "brand" | "workspace"; brandId?: string; brandName?: string; campaignId?: string; type: DashboardActivityType; actorName: string; actorInitials: string; action: string; entityName: string; supportingContext?: string; occurredAt: string; href?: DashboardActivityHref }
export interface DashboardActivityView extends DashboardActivity { relativeTime: string; absoluteTime: string }
export interface DashboardCalculatedCreditUsage { remaining: number; used: number; usedPercentage: number; total: number }
export type DashboardPercentageChange = { state: "percentage"; percentage: number } | { state: "no-baseline"; percentage: null };

export interface DashboardDataSource {
  user: DashboardUser;
  brands: DashboardBrand[];
  dateRanges: DashboardDateRange[];
  metrics: DashboardMetric[];
  creditUsage: DashboardCreditUsage;
  referenceTime: string;
  campaigns: DashboardCampaignSummary[];
  attentionItems: DashboardAttentionItem[];
  activities: DashboardActivity[];
}

export interface DashboardViewModel {
  user: DashboardUser;
  brands: DashboardBrand[];
  selectedBrandId: string;
  selectedDateRange: DashboardDateRange;
  dateRanges: DashboardDateRange[];
  metrics: DashboardMetric[];
  creditUsage: DashboardCalculatedCreditUsage;
  referenceTime: string;
  campaigns: Array<DashboardCampaignSummary & { progress: number }>;
  totalCampaignCount: number;
  filteredCampaignCount: number;
  isWorkspaceEmpty: boolean;
  attentionItems: DashboardAttentionItem[];
  activities: DashboardActivityView[];
}
