import { requireAuth } from "@/lib/auth/guard";
import { reserveRenderCreditsForContent } from "@/lib/db/platform-data";

const VIDEO_RENDER_CREDITS = 25;

export async function POST(
  request: Request,
  context: RouteContext<"/api/video/[id]/generate">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  if (request.headers.get("x-workspace-role") === "viewer") return Response.json({ message: "Viewers cannot start rendering.", code: "permission_denied" }, { status: 403 });
  const renderJobId = `video-${id}`;
  const { reservation, credits } = await reserveRenderCreditsForContent({
    contentId: id,
    renderJobId,
    credits: VIDEO_RENDER_CREDITS,
  });

  if (!reservation.ok) {
    return Response.json({ message: reservation.message, code: reservation.code }, { status: 409 });
  }

  return Response.json({
    message: "Video generation queued",
    calendarItemId: id,
    renderJobId,
    status: "queued",
    creditUsage: reservation.usage,
    credits,
  });
}
