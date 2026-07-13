import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashboardProgress } from "@/components/dashboard/dashboard-progress";
import type { DashboardCalculatedCreditUsage, DashboardMetric } from "@/lib/dashboard/types";

type Props = { metric: DashboardMetric; creditUsage?: DashboardCalculatedCreditUsage };
const cardClass = "flex min-h-[168px] min-w-0 flex-col justify-between rounded-lg border border-[#d3e4fe]/80 bg-white p-5 shadow-sm sm:min-h-[172px] sm:p-6";

export function DashboardMetricCard({ metric, creditUsage }: Props) {
  const content = <MetricContent metric={metric} creditUsage={creditUsage} />;
  if (metric.href) return <Link href={metric.href} className={`${cardClass} transition hover:border-[#78aef5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2`}>{content}</Link>;
  return <div className={cardClass}>{content}</div>;
}

function MetricContent({ metric, creditUsage }: Props) {
  const toneClass = { blue: "bg-[#e5eeff] text-[#0058bc]", indigo: "bg-[#e1e0ff] text-[#4648d4]", red: "bg-red-50 text-red-700" }[metric.tone];
  return <><div className="flex items-start justify-between gap-4"><p className="text-sm font-bold text-[#717786]">{metric.label}</p><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClass}`}><DashboardIcon name={metric.icon} className="h-5 w-5" /></span></div><div className="mt-5 min-w-0"><p className="break-words text-4xl font-extrabold leading-none text-[#0b1c30]">{formatMetricValue(metric.value)}</p><p className="mt-2 text-xs font-semibold text-[#717786]">{metric.supportingText}</p>{creditUsage ? <CreditDetails creditUsage={creditUsage} /> : <Comparison metric={metric} />}</div></>;
}

function Comparison({ metric }: { metric: DashboardMetric }) {
  const comparison = metric.comparison;
  return <p className="mt-2 inline-flex items-start gap-1 text-xs font-bold text-[#414755]">{comparison.state !== "no-baseline" && comparison.state !== "unchanged" ? <DashboardIcon name="trend" className={`mt-0.5 h-4 w-4 shrink-0 text-[#0058bc] ${comparison.state === "decrease" ? "rotate-90" : ""}`} /> : null}<span>{comparison.label}</span></p>;
}

function CreditDetails({ creditUsage }: { creditUsage: DashboardCalculatedCreditUsage }) {
  return <div className="mt-3"><DashboardProgress value={creditUsage.usedPercentage} label="Workspace credits used" valueText={`${creditUsage.used} of ${creditUsage.total} credits used`} /><p className="mt-2 text-xs font-semibold text-[#414755]">{formatMetricValue(creditUsage.remaining)} of {formatMetricValue(creditUsage.total)} credits remaining</p><p className="mt-1 text-xs font-bold text-[#717786]">{creditUsage.usedPercentage}% used</p></div>;
}

function formatMetricValue(value: number): string { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value); }
