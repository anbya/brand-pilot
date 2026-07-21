import { requireAuth } from "@/lib/auth/guard";
import { queueOperationJob } from "@/lib/db/platform-data";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/calendar/[id]/regenerate">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const job = await queueOperationJob({
    type: "calendar_item_regeneration",
    entityId: id,
    message: "Calendar item regeneration queued",
  });

  return Response.json({
    message: "Calendar item regeneration queued",
    calendarItemId: id,
    jobId: job.id,
    status: "queued",
  });
}
