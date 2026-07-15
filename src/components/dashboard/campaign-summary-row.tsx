import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashboardProgress } from "@/components/dashboard/dashboard-progress";
import { CampaignStatusBadge } from "@/components/campaign-status-badge";
import { formatDashboardDateRange } from "@/lib/dashboard/selectors";
import type { DashboardPlatform, DashboardViewModel } from "@/lib/dashboard/types";
import { socialPlatformLabels } from "@/lib/platforms";

type Campaign = DashboardViewModel["campaigns"][number];

export function CampaignSummaryRow({ campaign }: { campaign: Campaign }) {
  const visiblePlatforms = campaign.platforms.slice(0, 3);
  const hiddenPlatformCount = Math.max(0, campaign.platforms.length - visiblePlatforms.length);
  const completionText = `${campaign.completedPosts.toLocaleString("en-US")} of ${campaign.totalPosts.toLocaleString("en-US")} posts completed`;

  return <article className="grid min-w-0 gap-3 rounded-lg border border-[#e5eaf3] p-3 min-[375px]:p-4 sm:grid-cols-[56px_1fr] sm:gap-4"><div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] sm:h-14 sm:w-14"><DashboardIcon name={campaign.icon} className={`h-6 w-6 sm:h-7 sm:w-7 ${campaign.textColor}`} /></div><div className="min-w-0"><div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h3 className="break-words text-base font-extrabold text-[#0b1c30]">{campaign.name}</h3><p className="mt-1 break-words text-xs font-semibold text-[#717786]">{campaign.brandName} · {formatDashboardDateRange(campaign.startDate, campaign.endDate)}</p></div><CampaignStatusBadge status={campaign.status} /></div><div className="mt-3 flex min-w-0 flex-wrap gap-2">{visiblePlatforms.map((platform) => <span key={platform} className="max-w-full break-words rounded-full border border-[#d3e4fe] bg-[#eff4ff] px-2.5 py-1 text-[10px] font-bold text-[#414755]">{formatPlatform(platform)}</span>)}{hiddenPlatformCount > 0 && <span className="rounded-full border border-[#d3e4fe] bg-white px-2.5 py-1 text-[10px] font-bold text-[#657080]"><span aria-hidden="true">+{hiddenPlatformCount} more</span><span className="sr-only">and {hiddenPlatformCount} more platforms</span></span>}</div><div className="mt-4"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><p className="min-w-0 break-words text-xs font-bold text-[#414755]">{completionText}</p><span className={`shrink-0 text-sm font-extrabold ${campaign.textColor}`}>{campaign.progress}%</span></div><DashboardProgress value={campaign.progress} label={`${campaign.name} campaign progress`} valueText={completionText} barClassName={campaign.color} /></div></div></article>;
}

function formatPlatform(platform: DashboardPlatform) { return socialPlatformLabels[platform]; }
