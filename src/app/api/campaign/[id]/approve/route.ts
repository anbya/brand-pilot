import { publishCampaign } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaign/[id]/approve">,
) {
  const { id } = await context.params;
  const result = await publishCampaign(id);
  if (!result.ok) return Response.json({ message: result.message, code: result.code }, { status: result.code === "campaign_not_found" ? 404 : 409 });
  return Response.json({ message: result.idempotent ? "Campaign already published" : "Campaign published", campaign: result.campaign, campaignPackUsage: result.usages.find((usage) => usage.campaignId === id), idempotent: result.idempotent });
}
