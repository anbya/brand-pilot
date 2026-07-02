export async function POST(
  _request: Request,
  context: RouteContext<"/api/calendar/[id]/regenerate">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Calendar item regeneration queued",
    calendarItemId: id,
    status: "queued",
  });
}
