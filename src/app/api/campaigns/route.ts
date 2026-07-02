import { campaigns } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ data: campaigns });
}

export async function POST() {
  return Response.json(
    {
      message: "Campaign created",
      data: campaigns[0],
    },
    { status: 201 },
  );
}
