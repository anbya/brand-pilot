import { createCampaign, getCampaigns } from "@/lib/db/platform-data";

export async function GET() {
  const campaigns = await getCampaigns();
  return Response.json({ data: campaigns });
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const campaign = await createCampaign(body);
  return Response.json(
    {
      message: "Campaign created",
      data: campaign,
    },
    { status: 201 },
  );
}

async function readBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
