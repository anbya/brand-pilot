import { requireAuth } from "@/lib/auth/guard";
import { queueOperationJob } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/downloads/[campaignId]">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { campaignId } = await context.params;
  const job = await queueOperationJob({
    type: "download_package",
    entityId: campaignId,
    message: "Download package queued",
  });

  return Response.json({
    message: "Download package queued",
    campaignId,
    jobId: job.id,
    status: "queued",
  });
}
