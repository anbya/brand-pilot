export async function POST(
  _request: Request,
  context: RouteContext<"/api/caption/[id]/regenerate">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Caption regeneration queued",
    captionId: id,
    status: "queued",
  });
}
