import { deleteAsset } from "@/lib/db/platform-data";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/assets/[id]">,
) {
  const { id } = await context.params;
  await deleteAsset(id);
  return Response.json({ message: "Asset deleted", id });
}
