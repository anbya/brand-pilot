export async function POST(
  _request: Request,
  context: RouteContext<"/api/image/[id]/generate">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Image generation queued",
    calendarItemId: id,
    status: "queued",
  });
}
