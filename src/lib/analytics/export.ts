import { contentTypeLabels, platformLabels } from "@/lib/analytics/constants";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/analytics/calculations";
import type { AnalyticsDataSource, AnalyticsFilters, AnalyticsPermissions, AnalyticsViewModel } from "@/lib/analytics/types";

function csvCell(value: string | number) { const text = String(value); return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function row(values: Array<string | number>) { return values.map(csvCell).join(","); }

export function buildAnalyticsCsv(view: AnalyticsViewModel, data: AnalyticsDataSource, filters: AnalyticsFilters, permissions: AnalyticsPermissions) {
  const brand = data.brands.find((item) => item.id === filters.brandId)?.name ?? "All Brands";
  const campaign = data.campaigns.find((item) => item.id === filters.campaignId)?.name ?? "All Campaigns";
  const platform = filters.platform === "all" ? "All Platforms" : platformLabels[filters.platform];
  const lines = [row(["Analytics Performance Report"]), row(["Date Range", `${view.periodStart} to ${view.periodEnd}`]), row(["Brand", brand]), row(["Campaign", campaign]), row(["Platform", platform]), row(["Generated At", data.referenceTime]), "", row(["Summary"]), row(["Metric", "Value"])];
  for (const kpi of view.kpis) lines.push(row([kpi.label, kpi.id === "reach" || kpi.id === "clicks" ? formatNumber(kpi.value) : kpi.id === "conversion-rate" ? formatPercentage(kpi.value) : `${kpi.value.toFixed(2)}x`]));
  lines.push("", row(["Channel Performance"]), row(["Channel", ...(permissions.viewAnalyticsFinancialMetrics ? ["Spend"] : []), "Reach", "Impressions", "Engagement", "Engagement Rate", "Clicks", "Conversions", "Conversion Rate", ...(permissions.viewAnalyticsFinancialMetrics ? ["ROAS"] : [])]));
  for (const channel of view.channels) lines.push(row([platformLabels[channel.platform], ...(permissions.viewAnalyticsFinancialMetrics ? [formatCurrency(channel.spend)] : []), channel.reach, channel.impressions, channel.engagement, formatPercentage(channel.engagementRate), channel.clicks, channel.conversions, formatPercentage(channel.conversionRate), ...(permissions.viewAnalyticsFinancialMetrics ? [`${channel.roas.toFixed(2)}x`] : [])]));
  lines.push("", row(["Content Performance"]), row(["Content Name", "Campaign", "Channel", "Content Type", "Published Date", "Impressions", "Engagement Rate", "Clicks", "Conversions", "Trend"]));
  for (const item of view.content) lines.push(row([item.postTitle, item.campaignName, platformLabels[item.platform], contentTypeLabels[item.contentType], item.publishedAt.slice(0, 10), item.impressions, formatPercentage(item.engagementRate), item.clicks, item.conversions, item.trend.label]));
  return `\uFEFF${lines.join("\r\n")}`;
}

export function downloadAnalyticsCsv(csv: string, start: string, end: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `analytics-performance-${start}-to-${end}.csv`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
}
