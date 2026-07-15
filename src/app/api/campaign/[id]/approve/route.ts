export async function POST(
  _request: Request,
  context: RouteContext<"/api/campaign/[id]/approve">,
) {
  const { id } = await context.params;

  return Response.json({
    message: "Campaign published",
    campaignId: id,
    status: "published",
  });
}
