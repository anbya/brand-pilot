"use client";

import { useState } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { activeWorkspace, workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { formatPlanPrice, getPlanFeatureLabels, pricingPlans } from "@/lib/billing/plans";
import { getBrandLimitMessage, getBrandUsage } from "@/lib/billing/selectors";
import type { PricingPlan, WorkspaceSubscription } from "@/lib/billing/types";
import { dashboardMockData } from "@/lib/dashboard/mock-data";

export function PricingClient() {
  const [subscription, setSubscription] = useState<WorkspaceSubscription>(workspaceSubscriptionMock);
  const [pending, setPending] = useState<PricingPlan>();
  const [salesOpen, setSalesOpen] = useState(false);
  const [message, setMessage] = useState("");
  const brands = dashboardMockData.brands.map((brand) => ({ ...brand, workspaceId: activeWorkspace.id }));
  const brandUsage = getBrandUsage(activeWorkspace.id, brands, subscription);

  function choose(plan: PricingPlan) {
    if (plan.actionType === "contact_sales") return setSalesOpen(true);
    setPending(plan);
  }

  function confirmPlan() {
    if (!pending) return;
    setSubscription((current) => ({ ...current, planId: pending.id, status: "active", assignedCampaignPackLimit: pending.entitlements.defaultCampaignPackLimit, renderCreditLimit: pending.entitlements.renderCreditLimit }));
    setMessage(`${pending.name} is now the active plan for ${activeWorkspace.name}. Existing Brands and Campaigns were preserved.`);
    setPending(undefined);
  }

  return <main className="bp-page">
    <div className="bp-page-container max-w-[1180px]">
      <header className="py-8 text-center sm:py-12"><p className="bp-eyebrow">Business Model</p><h1 className="bp-page-title mt-3">Freemium planning,<br />paid rendering.</h1><p className="bp-page-description mx-auto">Choose workspace-wide planning, campaign, and rendering capacity. Every workspace member shares the same plan and quota.</p></header>
      {message ? <p role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">{message}</p> : null}
      {brandUsage.overLimit ? <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-bold">Workspace is over the Brand limit</p><p className="mt-1">{getBrandLimitMessage(activeWorkspace.id, brands, subscription)} Existing Brands remain available and no data was removed.</p></div> : null}
      <section aria-label="Pricing plans" className="grid gap-5 lg:grid-cols-3">{pricingPlans.map((plan) => { const current = plan.id === subscription.planId; return <article key={plan.id} aria-label={`${plan.name} plan${current ? ", current plan" : ""}`} className={`bp-card flex min-h-[470px] flex-col ${plan.highlighted ? "border-[var(--bp-primary)] ring-1 ring-[var(--bp-primary)]" : ""}`}>
        <div className="flex items-start justify-between gap-3"><h2 className="bp-section-title">{plan.name}</h2>{current ? <StatusBadge tone="success">Current Plan</StatusBadge> : plan.highlighted ? <StatusBadge tone="info">Recommended</StatusBadge> : null}</div>
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--bp-text)]">{formatPlanPrice(plan)}</p>
        <p className="mt-4 min-h-[66px] text-sm leading-[22px] text-[var(--bp-text-secondary)]">{plan.description}</p>
        <ul className="mt-6 grid gap-3 text-sm text-[var(--bp-text-secondary)]">{getPlanFeatureLabels(plan).map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true" className="font-bold text-emerald-700">✓</span><span>{feature}</span></li>)}</ul>
        <div className="mt-auto pt-8"><button type="button" onClick={() => choose(plan)} aria-describedby={current ? `${plan.id}-current-note` : undefined} className={`bp-button w-full ${plan.highlighted ? "bp-button-primary" : "bp-button-secondary"}`}>{plan.actionLabel}</button>{current ? <p id={`${plan.id}-current-note`} className="bp-supporting mt-2 text-center">Currently active for this workspace.</p> : null}</div>
      </article>; })}</section>
      <p className="bp-supporting mt-6 text-center">Plan changes never delete existing Brands, Campaigns, or generated content.</p>
    </div>
    {pending ? <ResponsiveOverlayShell title={`Choose ${pending.name}?`} description="This updates the mock workspace subscription. No checkout or payment will be created." onClose={() => setPending(undefined)} footer={<><button type="button" onClick={() => setPending(undefined)} className="bp-button bp-button-secondary">Cancel</button><button type="button" onClick={confirmPlan} className="bp-button bp-button-primary">Confirm Plan</button></>}><p className="text-sm leading-6 text-[var(--bp-text-secondary)]">The new limits apply immediately. Existing data above a lower limit remains available but new over-limit actions will be blocked with an explanation.</p></ResponsiveOverlayShell> : null}
    {salesOpen ? <ResponsiveOverlayShell title="Talk to Sales" description="Custom plan consultation" onClose={() => setSalesOpen(false)} footer={<button type="button" onClick={() => setSalesOpen(false)} className="bp-button bp-button-primary">Close</button>}><p className="text-sm leading-6 text-[var(--bp-text-secondary)]">Contact your Brand Pilot account team to configure multi-brand access, annual planning, unlimited rendering, and unlimited Campaigns. No sales request is sent from this mockup.</p></ResponsiveOverlayShell> : null}
  </main>;
}
