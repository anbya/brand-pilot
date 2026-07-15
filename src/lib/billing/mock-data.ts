import { GROWTH_RENDER_CREDIT_LIMIT } from "@/lib/billing/plans";
import type { CampaignPackUsage, RenderCreditUsage, Workspace, WorkspaceMembership, WorkspaceSubscription } from "@/lib/billing/types";

export const activeWorkspace: Workspace = { id: "workspace-brand-pilot", name: "Brand Pilot Workspace" };

export const workspaceMemberships: WorkspaceMembership[] = [
  { id: "membership-sarah", workspaceId: activeWorkspace.id, userId: "user-sarah-jenkins", role: "admin" },
  { id: "membership-mika", workspaceId: activeWorkspace.id, userId: "user-mika-putri", role: "manager" },
  { id: "membership-ari", workspaceId: activeWorkspace.id, userId: "user-ari-pratama", role: "editor" },
  { id: "membership-nina", workspaceId: activeWorkspace.id, userId: "user-nina-wijaya", role: "viewer" },
];

export const workspaceSubscriptionMock: WorkspaceSubscription = {
  id: "subscription-growth-july-2026", workspaceId: activeWorkspace.id, planId: "growth", status: "active", billingInterval: "month",
  currentPeriodStart: "2026-07-01", currentPeriodEnd: "2026-08-01", assignedCampaignPackLimit: 3,
  renderCreditLimit: GROWTH_RENDER_CREDIT_LIMIT, startedAt: "2026-07-01T00:00:00+07:00",
};

export const campaignPackUsageMock: CampaignPackUsage[] = [
  { id: "campaign-pack-cmp-1", workspaceId: activeWorkspace.id, subscriptionId: workspaceSubscriptionMock.id, campaignId: "cmp-1", billingPeriodStart: workspaceSubscriptionMock.currentPeriodStart, billingPeriodEnd: workspaceSubscriptionMock.currentPeriodEnd, consumedAt: "2026-07-01T09:00:00+07:00", consumedBy: "user-sarah-jenkins" },
];

export const renderCreditUsageMock: RenderCreditUsage[] = [
  { id: "render-usage-hero", workspaceId: activeWorkspace.id, subscriptionId: workspaceSubscriptionMock.id, contentId: "asset-ai-summer", renderJobId: "render-job-hero", credits: 600, status: "consumed", createdAt: "2026-07-08T10:00:00+07:00", updatedAt: "2026-07-08T10:03:00+07:00" },
  { id: "render-usage-reel", workspaceId: activeWorkspace.id, subscriptionId: workspaceSubscriptionMock.id, contentId: "post-coffee-reel", renderJobId: "render-job-reel", credits: 120, status: "reserved", createdAt: "2026-07-11T09:00:00+07:00", updatedAt: "2026-07-11T09:00:00+07:00" },
];

export const workspaceSubscriptionStateMocks = {
  active: workspaceSubscriptionMock,
  trialing: { ...workspaceSubscriptionMock, id: "subscription-growth-trial", status: "trialing" },
  pastDue: { ...workspaceSubscriptionMock, id: "subscription-growth-past-due", status: "past_due" },
  canceled: { ...workspaceSubscriptionMock, id: "subscription-growth-canceled", status: "canceled", canceledAt: "2026-07-15T09:00:00+07:00" },
  missing: undefined,
  unlimited: { ...workspaceSubscriptionMock, id: "subscription-custom-july-2026", planId: "custom", assignedCampaignPackLimit: null, renderCreditLimit: null },
} satisfies Record<string, WorkspaceSubscription | undefined>;

export const campaignPackExhaustedUsageMock: CampaignPackUsage[] = [
  ...campaignPackUsageMock,
  ...["cmp-2", "cmp-3"].map((campaignId) => ({ ...campaignPackUsageMock[0]!, id: `campaign-pack-${campaignId}`, campaignId })),
];

function renderUsageForState(id: string, credits: number): RenderCreditUsage[] {
  return [{ id: `render-usage-${id}`, workspaceId: activeWorkspace.id, subscriptionId: workspaceSubscriptionMock.id, contentId: `content-${id}`, renderJobId: `render-job-${id}`, credits, status: "consumed", createdAt: "2026-07-15T09:00:00+07:00", updatedAt: "2026-07-15T09:05:00+07:00" }];
}

export const renderCreditStateMocks = {
  low: renderUsageForState("low", GROWTH_RENDER_CREDIT_LIMIT * 0.9),
  exhausted: renderUsageForState("exhausted", GROWTH_RENDER_CREDIT_LIMIT),
  refunded: [{ ...renderUsageForState("refunded", GROWTH_RENDER_CREDIT_LIMIT)[0]!, status: "refunded" }],
} satisfies Record<string, RenderCreditUsage[]>;
