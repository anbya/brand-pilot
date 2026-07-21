import { requireAuth } from "@/lib/auth/guard";
import { queueOperationJob } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaigns/[id]/generate">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const job = await queueOperationJob({
    type: "campaign_generation",
    entityId: id,
    message: "Campaign generation started",
    status: "generating",
  });

  return Response.json({
    message: "Campaign generation started",
    campaignId: id,
    jobId: job.id,
    operationStatus: "generating",
  });
}
