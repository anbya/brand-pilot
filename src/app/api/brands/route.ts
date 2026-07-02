import { brandProfile } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ data: [brandProfile] });
}

export async function POST() {
  return Response.json(
    {
      message: "Brand created",
      data: brandProfile,
    },
    { status: 201 },
  );
}
