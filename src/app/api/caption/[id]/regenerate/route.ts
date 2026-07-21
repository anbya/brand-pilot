import { queueOperationJob } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/caption/[id]/regenerate">,
) {
  const { id } = await context.params;
  const job = await queueOperationJob({
    type: "caption_regeneration",
    entityId: id,
    message: "Caption regeneration queued",
  });

  return Response.json({
    message: "Caption regeneration queued",
    captionId: id,
    jobId: job.id,
    status: "queued",
  });
}
