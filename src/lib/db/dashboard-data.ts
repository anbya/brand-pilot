import { dashboardMockData } from "@/lib/dashboard/mock-data";
import type { DashboardCampaignSummary, DashboardDataSource, DashboardUser } from "@/lib/dashboard/types";
import { getActiveSubscription, getBrands, getCampaigns, getRenderCreditUsages } from "@/lib/db/platform-data";
import type { AuthUser } from "@/lib/auth/session";

export async function getDashboardDataSource(authUser?: AuthUser): Promise<DashboardDataSource> {
  const [brands, campaigns, subscription] = await Promise.all([
    getBrands(),
    getCampaigns(),
    getActiveSubscription(),
  ]);
  const renderCreditUsages = await getRenderCreditUsages(subscription?.id);
  const brandNames = new Map(brands.map((brand) => [brand.id, brand.companyName]));
  const mockCampaigns = new Map(dashboardMockData.campaigns.map((campaign) => [campaign.id, campaign]));

  return {
    ...dashboardMockData,
    user: toDashboardUser(authUser) ?? dashboardMockData.user,
    brands: brands.map((brand) => ({ id: brand.id, name: brand.companyName, slug: brand.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })),
    workspaceSubscription: subscription ?? dashboardMockData.workspaceSubscription,
    renderCreditUsages,
    campaigns: campaigns.map((campaign): DashboardCampaignSummary => {
      const mock = mockCampaigns.get(campaign.id);
      return {
        id: campaign.id,
        brandId: campaign.brandId,
        brandName: brandNames.get(campaign.brandId) ?? campaign.brandId,
        name: campaign.name,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status,
        completedPosts: mock?.completedPosts ?? 0,
        readyPosts: mock?.readyPosts ?? 0,
        totalPosts: mock?.totalPosts ?? 0,
        platforms: campaign.platforms,
        icon: mock?.icon ?? "spark",
        color: mock?.color ?? "bg-blue-600",
        textColor: mock?.textColor ?? "text-blue-700",
      };
    }),
  };
}

function toDashboardUser(user: AuthUser | undefined): DashboardUser | undefined {
  if (!user) return undefined;
  return {
    id: user.id,
    name: user.name,
    role: user.role as DashboardUser["role"],
    initials: user.initials,
  };
}
