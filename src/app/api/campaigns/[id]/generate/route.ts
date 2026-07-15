export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaigns/[id]/generate">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Campaign generation started",
    campaignId: id,
    operationStatus: "generating",
  });
}
