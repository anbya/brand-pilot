import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

const block = "animate-pulse rounded bg-[#e5eaf3] motion-reduce:animate-none";

export function DashboardSkeleton({ metricCount = 4 }: { metricCount?: number }) {
  return <div className="min-w-0" role="status" aria-live="polite"><span className="sr-only">Loading dashboard</span><DashboardAttentionSkeleton /><DashboardMetricsSkeleton count={metricCount} /><div className="mt-5 grid min-w-0 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-12"><div className="min-w-0 xl:col-span-8"><DashboardCampaignsSkeleton /></div><div className="min-w-0 xl:col-span-4"><DashboardActivitySkeleton /></div></div></div>;
}

export function DashboardAttentionSkeleton() {
  return <DashboardPanel className="mt-5 sm:mt-6" ariaHidden><SkeletonHeading /><div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="min-w-0 rounded-lg border border-[#e5eaf3] p-4"><div className={`${block} h-4 w-28 max-w-full`} /><div className={`${block} mt-3 h-3 w-full`} /><div className={`${block} mt-2 h-3 w-2/3`} /></div>)}</div></DashboardPanel>;
}

export function DashboardMetricsSkeleton({ count = 4 }: { count?: number }) {
  return <section aria-hidden="true" className={`mt-5 grid min-w-0 grid-cols-1 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2 ${count >= 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>{Array.from({ length: count }, (_, index) => <DashboardPanel key={index} className="min-h-[168px] sm:min-h-[172px]"><div className={`${block} h-4 w-24 max-w-full`} /><div className={`${block} mt-8 h-9 w-20 max-w-full`} /><div className={`${block} mt-4 h-3 w-36 max-w-full`} /></DashboardPanel>)}</section>;
}

export function DashboardCampaignsSkeleton() {
  return <DashboardPanel ariaHidden><SkeletonHeading />{[1, 2, 3].map((item) => <div key={item} className="mt-4 min-w-0 rounded-lg border border-[#e5eaf3] p-3 min-[375px]:p-4"><div className={`${block} h-4 w-40 max-w-full`} /><div className={`${block} mt-3 h-3 w-56 max-w-full`} /><div className={`${block} mt-5 h-2 w-full`} /></div>)}</DashboardPanel>;
}

export function DashboardActivitySkeleton() {
  return <DashboardPanel ariaHidden><SkeletonHeading />{[1, 2, 3, 4].map((item) => <div key={item} className="mt-4 flex min-w-0 gap-3"><div className={`${block} h-9 w-9 shrink-0 rounded-full`} /><div className="min-w-0 flex-1"><div className={`${block} h-3 w-full`} /><div className={`${block} mt-2 h-3 w-2/3`} /></div></div>)}</DashboardPanel>;
}

function SkeletonHeading() { return <><div className={`${block} h-5 w-36 max-w-full`} /><div className={`${block} mt-3 h-3 w-64 max-w-full`} /></>; }
