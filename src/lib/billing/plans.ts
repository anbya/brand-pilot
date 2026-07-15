import type { PricingPlan, PricingPlanId } from "@/lib/billing/types";

export const STARTER_RENDER_CREDIT_LIMIT = 450;
export const GROWTH_RENDER_CREDIT_LIMIT = 1_500;

export const pricingPlans = [
  {
    id: "starter", name: "Starter", monthlyPriceCents: 19_900, priceQualifier: "exact",
    description: "1 brand, 30-day planning, limited renders, and 1 campaign pack.", actionLabel: "Choose Plan", actionType: "choose_plan", highlighted: false,
    entitlements: { brandLimit: 1, planningHorizonDays: 30, campaignPackMin: 1, campaignPackMax: 1, defaultCampaignPackLimit: 1, renderMode: "limited", renderCreditLimit: STARTER_RENDER_CREDIT_LIMIT, unlimitedCampaigns: false },
  },
  {
    id: "growth", name: "Growth", monthlyPriceCents: 99_900, priceQualifier: "exact",
    description: "1 brand, 6-month planning, more render credits, and 2–3 campaign packs.", actionLabel: "Choose Plan", actionType: "choose_plan", highlighted: true,
    entitlements: { brandLimit: 1, planningHorizonMonths: 6, campaignPackMin: 2, campaignPackMax: 3, defaultCampaignPackLimit: 3, renderMode: "credits", renderCreditLimit: GROWTH_RENDER_CREDIT_LIMIT, unlimitedCampaigns: false },
  },
  {
    id: "custom", name: "Custom", monthlyPriceCents: 199_900, priceQualifier: "starting_at",
    description: "Multi-brand support, 1-year planning, unlimited renders, and unlimited campaigns.", actionLabel: "Talk to Sales", actionType: "contact_sales", highlighted: false,
    entitlements: { brandLimit: null, planningHorizonMonths: 12, campaignPackMin: null, campaignPackMax: null, defaultCampaignPackLimit: null, renderMode: "unlimited", renderCreditLimit: null, unlimitedCampaigns: true },
  },
] as const satisfies readonly PricingPlan[];

export const pricingPlanById = Object.fromEntries(pricingPlans.map((plan) => [plan.id, plan])) as Record<PricingPlanId, PricingPlan>;

export function formatPlanPrice(plan: PricingPlan): string {
  if (plan.actionType === "contact_sales") return "-";
  const amount = new Intl.NumberFormat("en-US").format(plan.monthlyPriceCents / 100);
  return `US$${amount}${plan.priceQualifier === "starting_at" ? "+" : ""}/mo`;
}

export function getPlanFeatureLabels(plan: PricingPlan): string[] {
  const entitlements = plan.entitlements;
  const brands = entitlements.brandLimit === null ? "Multi-brand support" : `${entitlements.brandLimit} brand`;
  const horizon = entitlements.planningHorizonDays ? `${entitlements.planningHorizonDays}-day planning` : `${entitlements.planningHorizonMonths}-month planning`;
  const campaigns = entitlements.unlimitedCampaigns ? "Unlimited campaigns" : entitlements.campaignPackMin === entitlements.campaignPackMax ? `${entitlements.campaignPackMax} campaign pack` : `${entitlements.campaignPackMin}–${entitlements.campaignPackMax} campaign packs`;
  const renders = entitlements.renderMode === "unlimited" ? "Unlimited renders" : `${entitlements.renderCreditLimit?.toLocaleString("en-US")} render credits`;
  return [brands, horizon, campaigns, renders];
}
