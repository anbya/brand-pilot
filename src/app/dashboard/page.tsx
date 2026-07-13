import Link from "next/link";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { getDashboardPermissions } from "@/lib/dashboard/permissions";
import { dashboardStateScenarios } from "@/lib/dashboard/state-scenarios";

export default function DashboardPage() {
  const permissions = getDashboardPermissions(dashboardMockData.user.role);
  return <div className="min-h-screen min-w-0 bg-[#f8f9ff] text-[#0b1c30]">
    <main id="dashboard-content" className="min-w-0"><DashboardClient dataSource={dashboardMockData} permissions={permissions} initialDateRangeId="range-july" initialScenario={dashboardStateScenarios.ready} /></main>
    {permissions.canCreateCampaign && <Link aria-label="Quick Start Campaign" className="fixed bottom-4 right-4 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-[#0058bc] text-white shadow-lg outline-none transition hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2 lg:flex xl:bottom-6 xl:right-6" href="/campaigns"><DashboardIcon name="add" className="h-6 w-6" /></Link>}
  </div>;
}
