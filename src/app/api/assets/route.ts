import { requireAuth } from "@/lib/auth/guard";
import { getAssets, upsertAsset } from "@/lib/db/platform-data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const assets = await getAssets();
  return Response.json({ data: assets });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await request.json();
  const asset = await upsertAsset(body);
  return Response.json({ message: "Asset saved", data: asset }, { status: 201 });
}
