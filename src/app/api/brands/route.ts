import { brandProfile } from "@/lib/mock-data";
import { activeWorkspace, workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { canCreateBrand, getBrandUsage } from "@/lib/billing/selectors";
import { dashboardMockData } from "@/lib/dashboard/mock-data";

export async function GET() {
  return Response.json({ data: [brandProfile] });
}

export async function POST() {
  const brands = dashboardMockData.brands.map((brand) => ({ ...brand, workspaceId: activeWorkspace.id }));
  const decision = canCreateBrand(activeWorkspace.id, brands, workspaceSubscriptionMock);
  if (!decision.allowed) return Response.json({ message: decision.message, code: decision.code, usage: getBrandUsage(activeWorkspace.id, brands, workspaceSubscriptionMock) }, { status: 409 });
  return Response.json(
    {
      message: "Brand created",
      data: brandProfile,
    },
    { status: 201 },
  );
}
