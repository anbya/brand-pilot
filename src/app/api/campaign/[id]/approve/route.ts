import { publishCampaignWithEntitlements } from "@/lib/billing/entitlements";
import { activeWorkspace, campaignPackUsageMock, workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { campaigns } from "@/lib/mock-data";

let campaignState = campaigns.map((campaign) => ({ ...campaign }));
let campaignPackUsageState = campaignPackUsageMock.map((usage) => ({ ...usage }));

export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaign/[id]/approve">,
) {
  const { id } = await context.params;
  const campaign = campaignState.find((item) => item.id === id);
  if (!campaign) return Response.json({ message: "Campaign not found", code: "campaign_not_found" }, { status: 404 });

  const result = publishCampaignWithEntitlements({
    campaign,
    subscription: workspaceSubscriptionMock,
    usages: campaignPackUsageState,
    workspaceBrandIds: campaignState.filter((item) => item.workspaceId === activeWorkspace.id).map((item) => item.brandId),
    campaignComplete: Boolean(campaign.name && campaign.strategy && campaign.platforms.length),
    hasPermission: true,
    actorId: "user-sarah-jenkins",
    now: new Date().toISOString(),
    referenceDate: "2026-07-15",
  });

  if (!result.ok) return Response.json({ message: result.message, code: result.code }, { status: 409 });
  campaignState = campaignState.map((item) => item.id === result.campaign.id ? result.campaign : item);
  campaignPackUsageState = result.usages;
  return Response.json({ message: result.idempotent ? "Campaign already published" : "Campaign published", campaign: result.campaign, campaignPackUsage: result.usages.find((usage) => usage.campaignId === id), idempotent: result.idempotent });
}
