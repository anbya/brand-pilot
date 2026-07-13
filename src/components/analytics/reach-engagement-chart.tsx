import { formatCompactNumber, formatNumber, formatPercentage } from "@/lib/analytics/calculations";
import type { AnalyticsDateRangeId, ReachEngagementPoint } from "@/lib/analytics/types";

const chartWidth = 720; const chartHeight = 250; const left = 54; const right = 18; const top = 18; const bottom = 46;
function linePath(points: Array<{ x: number; y: number }>) { return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "); }

export function ReachEngagementChart({ series, dateRangeId }: { series: ReachEngagementPoint[]; dateRangeId: AnalyticsDateRangeId }) {
  if (!series.length) return <section className="rounded-lg border border-[#d3e4fe]/80 bg-white p-5 shadow-sm sm:p-6"><ChartHeading /><div className="mt-8 rounded-lg bg-[#f8faff] px-4 py-12 text-center text-sm text-[#657080]">No reach or engagement data for this selection.</div></section>;
  const innerWidth = chartWidth - left - right; const innerHeight = chartHeight - top - bottom; const reachMax = Math.max(...series.map((point) => point.reach), 1); const engagementMax = Math.max(...series.map((point) => point.engagement), 1);
  const x = (index: number) => left + (series.length === 1 ? innerWidth / 2 : index / (series.length - 1) * innerWidth);
  const reachPoints = series.map((point, index) => ({ x: x(index), y: top + innerHeight - point.reach / reachMax * innerHeight }));
  const engagementPoints = series.map((point, index) => ({ x: x(index), y: top + innerHeight - point.engagement / engagementMax * innerHeight }));
  const reachPeak = [...series].sort((a, b) => b.reach - a.reach || a.id.localeCompare(b.id))[0]; const engagementPeak = [...series].sort((a, b) => b.engagement - a.engagement || a.id.localeCompare(b.id))[0];
  const last = series.at(-1); const beforeLast = series.at(-2); const movement = !last || !beforeLast ? "Only one reporting period is available." : last.reach === beforeLast.reach ? "Reach was unchanged in the latest period." : `Reach ${last.reach > beforeLast.reach ? "increased" : "decreased"} in the latest period.`;
  const summary = `Reach peaked in ${reachPeak.fullLabel} at ${formatNumber(reachPeak.reach)}. Engagement peaked in ${engagementPeak.fullLabel} at ${formatNumber(engagementPeak.engagement)}. ${movement}`;
  const labelStep = series.length > 12 ? Math.ceil(series.length / 6) : 1;
  return <section className="min-w-0 rounded-lg border border-[#d3e4fe]/80 bg-white p-4 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><ChartHeading /><div className="flex flex-wrap gap-4 text-xs font-bold text-[#526174]"><Legend color="#0058bc" label="Reach" /><Legend color="#4648d4" label="Engagement" /></div></div><div className="mt-5 min-w-0 overflow-hidden"><svg aria-hidden="true" className="h-auto w-full min-w-0" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
    {[0, .25, .5, .75, 1].map((ratio) => { const y = top + innerHeight * ratio; return <g key={ratio}><line x1={left} x2={chartWidth - right} y1={y} y2={y} stroke="#dce6f5" strokeWidth="1" /><text x={left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#657080">{formatCompactNumber(reachMax * (1 - ratio))}</text></g>; })}
    <path d={`${linePath(reachPoints)} L${reachPoints.at(-1)!.x},${top + innerHeight} L${reachPoints[0].x},${top + innerHeight} Z`} fill="#0058bc" opacity=".09" />
    <path d={linePath(reachPoints)} fill="none" stroke="#0058bc" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    <path d={linePath(engagementPoints)} fill="none" stroke="#4648d4" strokeDasharray="7 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    {series.map((point, index) => <g key={point.id}>{index % labelStep === 0 || index === series.length - 1 ? <text x={x(index)} y={chartHeight - 14} textAnchor="middle" fontSize="10" fill="#657080">{point.label}</text> : null}<circle cx={reachPoints[index].x} cy={reachPoints[index].y} r="4" fill="#fff" stroke="#0058bc" strokeWidth="2"><title>{`${point.fullLabel}: reach ${formatNumber(point.reach)}, engagement ${formatNumber(point.engagement)}, engagement rate ${formatPercentage(point.engagementRate)}`}</title></circle><circle cx={engagementPoints[index].x} cy={engagementPoints[index].y} r="3.5" fill="#fff" stroke="#4648d4" strokeWidth="2"><title>{`${point.fullLabel}: engagement ${formatNumber(point.engagement)}`}</title></circle></g>)}
  </svg></div><p className="mt-4 rounded-lg bg-[#f4f7fd] px-4 py-3 text-xs leading-5 text-[#526174]">{summary}</p><span className="sr-only">Chart aggregation: {dateRangeId === "all-time" ? "monthly" : "daily"}.</span></section>;
}
function ChartHeading() { return <div><h2 className="text-xl font-extrabold text-[#0b1c30]">Reach &amp; Engagement</h2><p className="mt-1 text-sm text-[#657080]">Aggregated published-content performance.</p></div>; }
function Legend({ color, label }: { color: string; label: string }) { return <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span>; }
