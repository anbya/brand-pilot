import { getCalendarItems } from "@/lib/db/platform-data";

export async function GET() {
  const items = await getCalendarItems();
  return Response.json({ data: items });
}
