import type { CampaignStatus } from "@/lib/campaign-status";
import type { DashboardUserRole } from "@/lib/dashboard/types";

export type PricingPlanId = "starter" | "growth" | "custom";
export type RenderMode = "limited" | "credits" | "unlimited";

export type PlanEntitlements = {
  brandLimit: number | null;
  planningHorizonDays?: number;
  planningHorizonMonths?: number;
  campaignPackMin: number | null;
  campaignPackMax: number | null;
  defaultCampaignPackLimit: number | null;
  renderMode: RenderMode;
  renderCreditLimit: number | null;
  unlimitedCampaigns: boolean;
};

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  monthlyPriceCents: number;
  priceQualifier: "exact" | "starting_at";
  description: string;
  actionLabel: string;
  actionType: "choose_plan" | "contact_sales";
  highlighted: boolean;
  entitlements: PlanEntitlements;
};

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export type WorkspaceSubscription = {
  id: string;
  workspaceId: string;
  planId: PricingPlanId;
  status: SubscriptionStatus;
  billingInterval: "month";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  assignedCampaignPackLimit: number | null;
  renderCreditLimit: number | null;
  startedAt: string;
  canceledAt?: string;
};

export type Workspace = { id: string; name: string };
export type WorkspaceMembership = { id: string; workspaceId: string; userId: string; role: DashboardUserRole };

export type CampaignPackUsage = {
  id: string;
  workspaceId: string;
  subscriptionId: string;
  campaignId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  consumedAt: string;
  consumedBy: string;
};

export type RenderCreditUsageStatus = "reserved" | "consumed" | "refunded";
export type RenderCreditUsage = {
  id: string;
  workspaceId: string;
  subscriptionId: string;
  contentId: string;
  renderJobId: string;
  credits: number;
  status: RenderCreditUsageStatus;
  createdAt: string;
  updatedAt: string;
};

export type PlanningRangeValidation =
  | { valid: true }
  | { valid: false; code: "outside_plan_horizon" | "invalid_date_range" | "subscription_unavailable"; message: string };

export type LimitedUsage = { unlimited: false; used: number; limit: number; remaining: number; overLimit: boolean };
export type UnlimitedUsage = { unlimited: true; used: number; limit: null; remaining: null; overLimit: false };
export type WorkspaceUsage = LimitedUsage | UnlimitedUsage;

export type EntitlementDecision =
  | { allowed: true; idempotent?: boolean }
  | { allowed: false; code: string; message: string };

export type BillableCampaign = {
  id: string;
  workspaceId: string;
  brandId: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  campaignPackConsumed: boolean;
  campaignPackUsageId?: string;
  publishedAt?: string;
  publishedBy?: string;
};

export type PublishCampaignResult<T extends BillableCampaign> =
  | { ok: true; campaign: T; usages: CampaignPackUsage[]; idempotent: boolean }
  | { ok: false; campaign: T; usages: CampaignPackUsage[]; code: string; message: string };

export type RenderCreditMutationResult =
  | { ok: true; usages: RenderCreditUsage[]; usage?: RenderCreditUsage; unlimited: boolean; idempotent: boolean }
  | { ok: false; usages: RenderCreditUsage[]; code: "subscription_unavailable" | "insufficient_render_credits" | "usage_not_found"; message: string };
