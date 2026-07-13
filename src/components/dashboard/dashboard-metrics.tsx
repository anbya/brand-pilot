import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import type { DashboardCalculatedCreditUsage, DashboardMetric } from "@/lib/dashboard/types";

export function DashboardMetrics({ metrics, creditUsage }: { metrics: DashboardMetric[]; creditUsage: DashboardCalculatedCreditUsage }) {
  return <section aria-labelledby="dashboard-metrics-title" className="mt-5 min-w-0 sm:mt-6"><h2 id="dashboard-metrics-title" className="sr-only">Dashboard summary</h2><div className={`grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 ${metrics.length >= 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>{metrics.map((metric) => <DashboardMetricCard key={metric.id} metric={metric} creditUsage={metric.id === "metric-credits-left" ? creditUsage : undefined} />)}</div></section>;
}
