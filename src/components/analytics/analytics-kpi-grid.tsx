import { AnalyticsIcon, type AnalyticsIconName } from "@/components/analytics/analytics-icon";
import type { AnalyticsKpi } from "@/lib/analytics/types";

const iconByKpi: Record<AnalyticsKpi["id"], AnalyticsIconName> = { clicks: "clicks", "conversion-rate": "conversion", roas: "roas", reach: "reach" };
export function AnalyticsKpiGrid({ kpis }: { kpis: AnalyticsKpi[] }) {
  return <section aria-label="Analytics summary" className={`mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 ${kpis.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>{kpis.map((kpi) => <AnalyticsKpiCard key={kpi.id} kpi={kpi} />)}</section>;
}
function AnalyticsKpiCard({ kpi }: { kpi: AnalyticsKpi }) {
  const trendIcon: AnalyticsIconName = kpi.trend.state === "increase" ? "trendUp" : kpi.trend.state === "decrease" ? "trendDown" : "minus";
  const trendTone = kpi.trend.state === "increase" ? "text-[#006947]" : kpi.trend.state === "decrease" ? "text-[#ba1a1a]" : "text-[#657080]";
  return <article className="min-w-0 rounded-lg border border-[#d3e4fe]/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#0058bc]"><AnalyticsIcon name={iconByKpi[kpi.id]} /></span><span className={`inline-flex min-w-0 items-center gap-1 text-right text-xs font-bold ${trendTone}`}><AnalyticsIcon name={trendIcon} className="h-4 w-4 shrink-0" /><span>{kpi.trend.label}</span></span></div><h2 className="mt-5 text-xs font-extrabold uppercase tracking-[.12em] text-[#526174]">{kpi.label}</h2><p className="mt-1 text-3xl font-extrabold tracking-[-.03em] text-[#0b1c30]" aria-label={`${kpi.label}: ${kpi.description}`}>{kpi.formattedValue}</p><p className="sr-only">{kpi.description}</p></article>;
}
