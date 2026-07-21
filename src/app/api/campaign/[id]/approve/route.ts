import { requireAuth } from "@/lib/auth/guard";
import { publishCampaign } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaign/[id]/approve">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const result = await publishCampaign(id, auth.session.userId);
  if (!result.ok) return Response.json({ message: result.message, code: result.code }, { status: result.code === "campaign_not_found" ? 404 : 409 });
  return Response.json({ message: result.idempotent ? "Campaign already published" : "Campaign published", campaign: result.campaign, campaignPackUsage: result.usages.find((usage) => usage.campaignId === id), idempotent: result.idempotent });
}
