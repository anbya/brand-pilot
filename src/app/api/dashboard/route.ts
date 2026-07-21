import { getDashboardDataSource } from "@/lib/db/dashboard-data";

export async function GET() {
  const data = await getDashboardDataSource();
  return Response.json({ data });
}
