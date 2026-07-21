import { requireAuth } from "@/lib/auth/guard";
import { getDashboardDataSource } from "@/lib/db/dashboard-data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const data = await getDashboardDataSource(auth.session.user);
  return Response.json({ data });
}
