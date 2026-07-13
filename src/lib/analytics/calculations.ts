import type { AnalyticsPerformanceRecord, AnalyticsTrend } from "@/lib/analytics/types";

export function normalizeNegativeZero(value: number): number { return Object.is(value, -0) ? 0 : value; }
export function safeDivide(numerator: number | undefined, denominator: number | undefined): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || !denominator) return 0;
  const result = (numerator ?? 0) / (denominator ?? 0);
  return Number.isFinite(result) ? normalizeNegativeZero(result) : 0;
}
export function calculateEngagementTotal(record: Pick<AnalyticsPerformanceRecord, "likes" | "comments" | "shares" | "saves">): number { return record.likes + record.comments + record.shares + record.saves; }
export function calculateEngagementRate(engagement: number, impressions: number): number { return safeDivide(engagement, impressions) * 100; }
export function calculateConversionRate(conversions: number, clicks: number): number { return safeDivide(conversions, clicks) * 100; }
export function calculateRoas(revenue: number, spend: number): number { return safeDivide(revenue, spend); }
export function calculateChannelBudgetShare(channelSpend: number, totalSpend: number): number { return safeDivide(channelSpend, totalSpend) * 100; }
export function calculateChannelPerformanceShare(channelConversions: number, totalConversions: number): number { return safeDivide(channelConversions, totalConversions) * 100; }

export function calculateTrendPercentage(current: number, previous: number, hasPrevious: boolean, comparable = true): AnalyticsTrend {
  if (!comparable) return { state: "unavailable", percentage: null, label: "Comparison unavailable" };
  if (!hasPrevious) return { state: "no-baseline", percentage: null, label: "No previous period data" };
  if (previous === 0) return current > 0 ? { state: "new-activity", percentage: null, label: "New activity" } : { state: "no-change", percentage: 0, label: "No change from previous period" };
  const percentage = normalizeNegativeZero((current - previous) / Math.abs(previous) * 100);
  if (!Number.isFinite(percentage)) return { state: "unavailable", percentage: null, label: "Comparison unavailable" };
  if (percentage === 0) return { state: "no-change", percentage: 0, label: "No change from previous period" };
  const absolute = Math.abs(percentage);
  return percentage > 0
    ? { state: "increase", percentage: absolute, label: `${formatPercentage(absolute)} higher than previous period` }
    : { state: "decrease", percentage: absolute, label: `${formatPercentage(absolute)} lower than previous period` };
}

export function formatCompactNumber(value: number): string { return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number.isFinite(value) ? value : 0); }
export function formatNumber(value: number): string { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0); }
export function formatPercentage(value: number): string { return `${normalizeNegativeZero(Number.isFinite(value) ? value : 0).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}%`; }
export function formatCurrency(value: number): string { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0); }
