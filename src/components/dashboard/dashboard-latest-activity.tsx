import Link from "next/link";
import { DashboardIcon, type DashboardIconName } from "@/components/dashboard/dashboard-icon";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { DashboardActivityView } from "@/lib/dashboard/types";

const activityIcons: Record<DashboardActivityView["type"], DashboardIconName> = { campaign_created: "campaign", post_approved: "check", post_scheduled: "calendar", asset_uploaded: "upload", brand_brain_updated: "spark", ai_ideas_generated: "idea" };
const rowClass = "flex min-w-0 gap-3 rounded-lg border border-transparent p-2";

export function DashboardLatestActivity({ activities }: { activities: DashboardActivityView[] }) {
  return <DashboardPanel><h2 className="text-lg font-bold text-[#0b1c30]">Latest Activity</h2><p className="mt-1 text-sm text-[#657080]">Recent workspace updates for the selected filters.</p>{activities.length ? <ul className="mt-4 grid gap-2">{activities.map((activity) => <li key={activity.id}><ActivityRow activity={activity} /></li>)}</ul> : <div className="mt-4 rounded-lg border border-dashed border-[#c5d2e5] px-4 py-8 text-center"><h3 className="text-sm font-extrabold text-[#0b1c30]">No recent activity</h3><p className="mt-2 text-sm leading-5 text-[#657080]">No workspace activity was found for the selected filters.</p></div>}</DashboardPanel>;
}

function ActivityRow({ activity }: { activity: DashboardActivityView }) {
  const content = <><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0058bc] text-[10px] font-extrabold text-white">{activity.actorInitials.slice(0, 2).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="break-words text-sm leading-5 text-[#414755]"><span className="font-extrabold text-[#0b1c30]">{activity.actorName}</span>{" "}{activity.action}{" "}<span className="font-bold text-[#0b1c30]">“{activity.entityName}”</span></p><div className="mt-1 flex min-w-0 items-start gap-2 text-xs font-semibold text-[#717786]"><DashboardIcon name={activityIcons[activity.type]} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0058bc]" /><span className="min-w-0 break-words">{activity.supportingContext ? `${activity.supportingContext} · ` : ""}<time dateTime={activity.occurredAt} title={activity.absoluteTime}>{activity.relativeTime}</time></span></div></div></>;
  if (activity.href) return <Link href={activity.href} className={`${rowClass} transition hover:border-[#d3e4fe] hover:bg-[#f8f9ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2`}>{content}</Link>;
  return <article className={rowClass}>{content}</article>;
}
