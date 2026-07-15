import { canPublishCampaign, canStartRender } from "@/lib/billing/selectors";
import { getCurrentPlan } from "@/lib/billing/selectors";
import type { BillableCampaign, CampaignPackUsage, PlanningRangeValidation, PublishCampaignResult, RenderCreditMutationResult, RenderCreditUsage, WorkspaceSubscription } from "@/lib/billing/types";

export function validatePlanningRange({ subscription, startDate, endDate, referenceDate }: { subscription?: WorkspaceSubscription; startDate: string; endDate: string; referenceDate: string }): PlanningRangeValidation {
  if (!subscription || !["active", "trialing"].includes(subscription.status)) return { valid: false, code: "subscription_unavailable", message: "An active workspace subscription is required for planning." };
  const start = parseDate(startDate); const end = parseDate(endDate); const reference = parseDate(referenceDate);
  if (!start || !end || !reference || end < start) return { valid: false, code: "invalid_date_range", message: "Enter a valid start and end date." };
  const entitlements = getCurrentPlan(subscription)?.entitlements;
  if (!entitlements) return { valid: false, code: "subscription_unavailable", message: "The workspace plan is unavailable." };
  const maximum = entitlements.planningHorizonDays
    ? addUtcDays(reference, entitlements.planningHorizonDays)
    : addUtcMonthsClamped(reference, entitlements.planningHorizonMonths ?? 0);
  return end <= maximum ? { valid: true } : { valid: false, code: "outside_plan_horizon", message: `This date range exceeds the ${entitlements.planningHorizonDays ? `${entitlements.planningHorizonDays}-day` : `${entitlements.planningHorizonMonths}-month`} planning horizon for the current workspace plan.` };
}

export function publishCampaignWithEntitlements<T extends BillableCampaign>(options: { campaign: T; subscription?: WorkspaceSubscription; usages: readonly CampaignPackUsage[]; workspaceBrandIds: readonly string[]; campaignComplete: boolean; hasPermission: boolean; actorId: string; now: string; referenceDate: string }): PublishCampaignResult<T> {
  const currentUsages = options.usages.map((usage) => ({ ...usage }));
  if (options.campaign.status === "published" && options.campaign.campaignPackConsumed) return { ok: true, campaign: { ...options.campaign }, usages: currentUsages, idempotent: true };
  const range = validatePlanningRange({ subscription: options.subscription, startDate: options.campaign.startDate, endDate: options.campaign.endDate, referenceDate: options.referenceDate });
  if (!range.valid) return { ok: false, campaign: { ...options.campaign }, usages: currentUsages, code: range.code, message: range.message };
  const decision = canPublishCampaign({ status: options.campaign.status, campaignComplete: options.campaignComplete, brandInWorkspace: options.workspaceBrandIds.includes(options.campaign.brandId), hasPermission: options.hasPermission, campaignPackConsumed: options.campaign.campaignPackConsumed, subscription: options.subscription, usages: currentUsages });
  if (!decision.allowed || !options.subscription) return { ok: false, campaign: { ...options.campaign }, usages: currentUsages, code: decision.allowed ? "subscription_unavailable" : decision.code, message: decision.allowed ? "Workspace subscription unavailable." : decision.message };
  const existing = currentUsages.find((usage) => usage.campaignId === options.campaign.id && usage.subscriptionId === options.subscription!.id);
  const usage = existing ?? { id: `campaign-pack-${options.subscription.id}-${options.campaign.id}`, workspaceId: options.subscription.workspaceId, subscriptionId: options.subscription.id, campaignId: options.campaign.id, billingPeriodStart: options.subscription.currentPeriodStart, billingPeriodEnd: options.subscription.currentPeriodEnd, consumedAt: options.now, consumedBy: options.actorId };
  const usages = existing ? currentUsages : [...currentUsages, usage];
  return { ok: true, campaign: { ...options.campaign, status: "published", campaignPackConsumed: true, campaignPackUsageId: usage.id, publishedAt: options.now, publishedBy: options.actorId }, usages, idempotent: Boolean(existing) };
}

export function reserveRenderCredits(options: { subscription?: WorkspaceSubscription; usages: readonly RenderCreditUsage[]; contentId: string; renderJobId: string; credits: number; now: string }): RenderCreditMutationResult {
  const usages = options.usages.map((usage) => ({ ...usage }));
  const existing = usages.find((usage) => usage.renderJobId === options.renderJobId);
  if (existing) return { ok: true, usages, usage: existing, unlimited: false, idempotent: true };
  const decision = canStartRender(options.credits, usages, options.subscription);
  if (!decision.allowed) return { ok: false, usages, code: decision.code === "subscription_unavailable" ? "subscription_unavailable" : "insufficient_render_credits", message: decision.message };
  const unlimited = getCurrentPlan(options.subscription)?.entitlements.renderMode === "unlimited";
  if (unlimited) return { ok: true, usages, unlimited: true, idempotent: false };
  const usage: RenderCreditUsage = { id: `render-credit-${options.renderJobId}`, workspaceId: options.subscription!.workspaceId, subscriptionId: options.subscription!.id, contentId: options.contentId, renderJobId: options.renderJobId, credits: Math.max(0, options.credits), status: "reserved", createdAt: options.now, updatedAt: options.now };
  return { ok: true, usages: [...usages, usage], usage, unlimited: false, idempotent: false };
}

export function settleRenderCredits(usagesInput: readonly RenderCreditUsage[], renderJobId: string, outcome: "consumed" | "refunded", now: string): RenderCreditMutationResult {
  const usages = usagesInput.map((usage) => ({ ...usage }));
  const index = usages.findIndex((usage) => usage.renderJobId === renderJobId);
  if (index < 0) return { ok: false, usages, code: "usage_not_found", message: "Reserved render credit usage was not found." };
  const current = usages[index];
  if (!current) return { ok: false, usages, code: "usage_not_found", message: "Reserved render credit usage was not found." };
  if (current.status === outcome) return { ok: true, usages, usage: current, unlimited: false, idempotent: true };
  if (current.status !== "reserved") return { ok: true, usages, usage: current, unlimited: false, idempotent: true };
  const usage = { ...current, status: outcome, updatedAt: now };
  usages[index] = usage;
  return { ok: true, usages, usage, unlimited: false, idempotent: false };
}

function parseDate(value: string): Date | undefined { const date = new Date(`${value}T00:00:00Z`); return Number.isNaN(date.getTime()) ? undefined : date; }
function addUtcDays(date: Date, days: number): Date { const result = new Date(date); result.setUTCDate(result.getUTCDate() + days); return result; }
function addUtcMonthsClamped(date: Date, months: number): Date { const result = new Date(date); const day = result.getUTCDate(); result.setUTCDate(1); result.setUTCMonth(result.getUTCMonth() + months); const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate(); result.setUTCDate(Math.min(day, lastDay)); return result; }
