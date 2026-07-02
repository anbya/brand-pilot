export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaign/[id]/approve">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Campaign approved",
    campaignId: id,
    status: "approved",
  });
}
