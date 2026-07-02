export async function POST(
  _request: Request,
  context: RouteContext<"/api/video/[id]/generate">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Video generation queued",
    calendarItemId: id,
    status: "queued",
  });
}
