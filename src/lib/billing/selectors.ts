import { pricingPlanById } from "@/lib/billing/plans";
import type { CampaignPackUsage, EntitlementDecision, PricingPlan, RenderCreditUsage, WorkspaceSubscription, WorkspaceUsage } from "@/lib/billing/types";

export function getActiveSubscription(subscriptions: readonly WorkspaceSubscription[], workspaceId: string): WorkspaceSubscription | undefined {
  return subscriptions.find((subscription) => subscription.workspaceId === workspaceId && subscription.status !== "canceled");
}

export function getCurrentPlan(subscription?: WorkspaceSubscription): PricingPlan | undefined {
  return subscription ? pricingPlanById[subscription.planId] : undefined;
}

export function getPlanEntitlements(subscription?: WorkspaceSubscription) {
  return getCurrentPlan(subscription)?.entitlements;
}

export function getBrandUsage(workspaceId: string, brands: readonly { workspaceId?: string }[], subscription?: WorkspaceSubscription): WorkspaceUsage {
  const used = brands.filter((brand) => !brand.workspaceId || brand.workspaceId === workspaceId).length;
  const limit = getPlanEntitlements(subscription)?.brandLimit;
  return buildUsage(used, limit);
}

export function canCreateBrand(workspaceId: string, brands: readonly { workspaceId?: string }[], subscription?: WorkspaceSubscription): EntitlementDecision {
  if (!subscription || subscription.workspaceId !== workspaceId || !["active", "trialing"].includes(subscription.status)) return { allowed: false, code: "subscription_unavailable", message: "An active workspace subscription is required to create a Brand." };
  const usage = getBrandUsage(workspaceId, brands, subscription);
  return usage.unlimited || usage.used < usage.limit ? { allowed: true } : { allowed: false, code: "brand_limit_reached", message: getBrandLimitMessage(workspaceId, brands, subscription) };
}

export function getBrandLimitMessage(workspaceId: string, brands: readonly { workspaceId?: string }[], subscription?: WorkspaceSubscription): string {
  const usage = getBrandUsage(workspaceId, brands, subscription);
  if (usage.unlimited) return `${usage.used} brands used · Unlimited on ${getCurrentPlan(subscription)?.name ?? "current plan"}.`;
  return `${usage.used} of ${usage.limit} brands used. Upgrade your workspace plan or reduce usage before creating another Brand.`;
}

export function getCampaignPackLimit(subscription?: WorkspaceSubscription): number | null {
  if (!subscription) return 0;
  const plan = getCurrentPlan(subscription);
  if (!plan || plan.entitlements.unlimitedCampaigns) return plan?.entitlements.unlimitedCampaigns ? null : 0;
  const assigned = subscription.assignedCampaignPackLimit ?? plan.entitlements.defaultCampaignPackLimit ?? 0;
  if (subscription.planId === "growth" && assigned !== 2 && assigned !== 3) return plan.entitlements.defaultCampaignPackLimit ?? 3;
  return Math.max(0, assigned);
}

export function getCampaignPackUsage(usages: readonly CampaignPackUsage[], subscription?: WorkspaceSubscription): CampaignPackUsage[] {
  if (!subscription) return [];
  return usages.filter((usage) => usage.subscriptionId === subscription.id && usage.workspaceId === subscription.workspaceId && usage.billingPeriodStart === subscription.currentPeriodStart && usage.billingPeriodEnd === subscription.currentPeriodEnd);
}

export function getCampaignPacksRemaining(usages: readonly CampaignPackUsage[], subscription?: WorkspaceSubscription): number | null {
  const limit = getCampaignPackLimit(subscription);
  return limit === null ? null : Math.max(0, limit - getCampaignPackUsage(usages, subscription).length);
}

export function canPublishCampaign(options: { status: string; campaignComplete: boolean; brandInWorkspace: boolean; hasPermission: boolean; campaignPackConsumed: boolean; subscription?: WorkspaceSubscription; usages: readonly CampaignPackUsage[] }): EntitlementDecision {
  if (options.status === "published" && options.campaignPackConsumed) return { allowed: true, idempotent: true };
  if (options.status !== "ready") return { allowed: false, code: "invalid_campaign_status", message: "Only a Ready campaign can be published." };
  if (!options.campaignComplete) return { allowed: false, code: "campaign_incomplete", message: "Complete all required Campaign fields before publishing." };
  if (!options.brandInWorkspace) return { allowed: false, code: "brand_outside_workspace", message: "The linked Brand does not belong to this workspace." };
  if (!options.hasPermission) return { allowed: false, code: "permission_denied", message: "You do not have permission to publish this Campaign." };
  if (!options.subscription || !["active", "trialing"].includes(options.subscription.status)) return { allowed: false, code: "subscription_unavailable", message: "An active workspace subscription is required to publish a Campaign." };
  const remaining = getCampaignPacksRemaining(options.usages, options.subscription);
  return remaining === null || remaining > 0 ? { allowed: true } : { allowed: false, code: "campaign_pack_exhausted", message: "Campaign pack limit reached for this billing period. Upgrade the workspace plan to publish another Campaign." };
}

export function getRenderCreditUsage(usages: readonly RenderCreditUsage[], subscription?: WorkspaceSubscription): RenderCreditUsage[] {
  if (!subscription) return [];
  return usages.filter((usage) => usage.subscriptionId === subscription.id && usage.workspaceId === subscription.workspaceId && usage.status !== "refunded");
}

export function getRenderCreditsRemaining(usages: readonly RenderCreditUsage[], subscription?: WorkspaceSubscription): WorkspaceUsage {
  const used = getRenderCreditUsage(usages, subscription).reduce((total, usage) => total + safeCredits(usage.credits), 0);
  const plan = getCurrentPlan(subscription);
  const limit = plan?.entitlements.renderMode === "unlimited" ? null : subscription?.renderCreditLimit ?? plan?.entitlements.renderCreditLimit ?? 0;
  return buildUsage(used, limit);
}

export function canStartRender(credits: number, usages: readonly RenderCreditUsage[], subscription?: WorkspaceSubscription): EntitlementDecision {
  if (!subscription || !["active", "trialing"].includes(subscription.status)) return { allowed: false, code: "subscription_unavailable", message: "An active workspace subscription is required to start rendering." };
  const requested = safeCredits(credits);
  if (requested <= 0) return { allowed: false, code: "invalid_render_credits", message: "Render credits must be greater than zero." };
  const usage = getRenderCreditsRemaining(usages, subscription);
  return usage.unlimited || usage.remaining >= requested ? { allowed: true } : { allowed: false, code: "insufficient_render_credits", message: `This render needs ${requested} credits, but only ${usage.remaining} remain.` };
}

function buildUsage(usedValue: number, limit: number | null | undefined): WorkspaceUsage {
  const used = Math.max(0, Number.isFinite(usedValue) ? usedValue : 0);
  if (limit === null) return { unlimited: true, used, limit: null, remaining: null, overLimit: false };
  const safeLimit = Math.max(0, Number.isFinite(limit) ? limit ?? 0 : 0);
  return { unlimited: false, used, limit: safeLimit, remaining: Math.max(0, safeLimit - used), overLimit: used > safeLimit };
}

function safeCredits(value: number): number { return Math.max(0, Number.isFinite(value) ? value : 0); }
