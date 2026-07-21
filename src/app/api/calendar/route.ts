import { requireAuth } from "@/lib/auth/guard";
import { getCalendarItems } from "@/lib/db/platform-data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const items = await getCalendarItems();
  return Response.json({ data: items });
}
