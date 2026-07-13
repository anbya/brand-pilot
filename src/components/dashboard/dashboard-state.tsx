import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export function DashboardGlobalError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <DashboardPanel className="mt-6"><div role="alert" className="py-6 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700"><DashboardIcon name="alert" className="h-6 w-6" /></span><h2 className="mt-4 text-lg font-extrabold text-[#0b1c30]">Dashboard unavailable</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#657080]">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-5 min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">Retry dashboard</button>}</div></DashboardPanel>;
}

export function DashboardWorkspaceEmpty({ canCreateCampaign, canViewCampaigns }: { canCreateCampaign: boolean; canViewCampaigns: boolean }) {
  const title = canCreateCampaign ? "Set up your workspace" : "No workspace activity yet";
  const description = canCreateCampaign ? "Create a campaign to start planning content and populate your Dashboard." : "Workspace activity will appear here when your team starts working.";
  return <DashboardPanel className="mt-6"><div className="py-8 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5eeff] text-[#0058bc]"><DashboardIcon name="campaign" className="h-6 w-6" /></span><h2 className="mt-4 text-lg font-extrabold text-[#0b1c30]">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#657080]">{description}</p>{canViewCampaigns && <Link href="/campaigns" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">{canCreateCampaign ? "Open Campaigns" : "View Campaigns"}</Link>}</div></DashboardPanel>;
}
