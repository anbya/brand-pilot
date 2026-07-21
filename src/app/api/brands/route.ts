import { canCreateBrand, getBrandUsage } from "@/lib/billing/selectors";
import { createBrand, getActiveSubscription, getActiveWorkspace, getBrands } from "@/lib/db/platform-data";

export async function GET() {
  const brands = await getBrands();
  return Response.json({ data: brands });
}

export async function POST(request: Request) {
  const [activeWorkspace, subscription, brands] = await Promise.all([
    getActiveWorkspace(),
    getActiveSubscription(),
    getBrands(),
  ]);
  const decision = canCreateBrand(activeWorkspace.id, brands, subscription);
  if (!decision.allowed) return Response.json({ message: decision.message, code: decision.code, usage: getBrandUsage(activeWorkspace.id, brands, subscription) }, { status: 409 });
  const body = await readBody(request);
  const brand = await createBrand(body);
  return Response.json(
    {
      message: "Brand created",
      data: brand,
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
