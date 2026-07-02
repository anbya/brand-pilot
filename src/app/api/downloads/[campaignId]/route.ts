export async function POST(
  _request: Request,
  context: RouteContext<"/api/downloads/[campaignId]">,
) {
  const { campaignId } = await context.params;

  return Response.json({
    message: "Download package queued",
    campaignId,
    status: "queued",
  });
}
