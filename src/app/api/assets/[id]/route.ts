import { requireAuth } from "@/lib/auth/guard";
import { deleteAsset } from "@/lib/db/platform-data";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/assets/[id]">,
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  await deleteAsset(id);
  return Response.json({ message: "Asset deleted", id });
}
