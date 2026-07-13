import { analyticsPlatforms } from "@/lib/analytics/constants";
import { calculateChannelBudgetShare, calculateChannelPerformanceShare, calculateConversionRate, calculateEngagementRate, calculateEngagementTotal, calculateRoas, calculateTrendPercentage, formatCompactNumber, formatPercentage } from "@/lib/analytics/calculations";
import type { AnalyticsCampaign, AnalyticsDataSource, AnalyticsDateRangeId, AnalyticsFilters, AnalyticsKpi, AnalyticsPerformanceRecord, AnalyticsPermissions, AnalyticsPlatform, AnalyticsViewModel, ChannelPerformance, ReachEngagementPoint, TopPerformingContentItem } from "@/lib/analytics/types";

function toDate(value: string) { return new Date(`${value.slice(0, 10)}T00:00:00Z`); }
function isoDate(value: Date) { return value.toISOString().slice(0, 10); }
function shiftDate(value: string, days: number) { const date = toDate(value); date.setUTCDate(date.getUTCDate() + days); return isoDate(date); }

export function getAnalyticsPeriod(dateRangeId: AnalyticsDateRangeId, referenceTime: string, records: AnalyticsPerformanceRecord[]) {
  const end = referenceTime.slice(0, 10);
  if (dateRangeId === "all-time") {
    const dates = records.map((record) => record.publishedAt.slice(0, 10)).sort();
    return { start: dates[0] ?? end, end, previousStart: null, previousEnd: null };
  }
  const days = dateRangeId === "7-days" ? 7 : 30;
  const start = shiftDate(end, -(days - 1));
  return { start, end, previousStart: shiftDate(start, -days), previousEnd: shiftDate(start, -1) };
}

function matchesBaseFilters(record: AnalyticsPerformanceRecord, filters: AnalyticsFilters) {
  return (filters.brandId === "all" || record.brandId === filters.brandId)
    && (filters.campaignId === "all" || record.campaignId === filters.campaignId)
    && (filters.platform === "all" || record.platform === filters.platform);
}

export function selectAnalyticsRecords(records: AnalyticsPerformanceRecord[], filters: AnalyticsFilters, campaigns: AnalyticsCampaign[]) {
  const publishedCampaignIds = new Set(campaigns.filter((campaign) => campaign.status === "active" || campaign.status === "completed").map((campaign) => campaign.id));
  return records.filter((record) => publishedCampaignIds.has(record.campaignId) && matchesBaseFilters(record, filters));
}

export function selectCurrentPeriodRecords(data: AnalyticsDataSource, filters: AnalyticsFilters) {
  const period = getAnalyticsPeriod(filters.dateRangeId, data.referenceTime, data.records);
  return selectAnalyticsRecords(data.records, filters, data.campaigns).filter((record) => { const date = record.publishedAt.slice(0, 10); return date >= period.start && date <= period.end; });
}

export function selectPreviousPeriodRecords(data: AnalyticsDataSource, filters: AnalyticsFilters) {
  const period = getAnalyticsPeriod(filters.dateRangeId, data.referenceTime, data.records);
  if (!period.previousStart || !period.previousEnd) return [];
  return selectAnalyticsRecords(data.records, filters, data.campaigns).filter((record) => { const date = record.publishedAt.slice(0, 10); return date >= period.previousStart! && date <= period.previousEnd!; });
}

export function selectAvailableBrands(data: AnalyticsDataSource) { return [...data.brands].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)); }
export function selectAvailableCampaigns(data: AnalyticsDataSource, brandId: string) { return data.campaigns.filter((campaign) => (campaign.status === "active" || campaign.status === "completed") && (brandId === "all" || campaign.brandId === brandId)).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)); }
export function selectAvailablePlatforms(data: AnalyticsDataSource, filters: AnalyticsFilters): AnalyticsPlatform[] {
  const records = data.records.filter((record) => (filters.brandId === "all" || record.brandId === filters.brandId) && (filters.campaignId === "all" || record.campaignId === filters.campaignId));
  const present = new Set(records.map((record) => record.platform));
  return analyticsPlatforms.filter((platform) => present.has(platform));
}

function totals(records: AnalyticsPerformanceRecord[]) {
  return records.reduce((result, record) => ({ clicks: result.clicks + record.clicks, conversions: result.conversions + record.conversions, reach: result.reach + record.reach, spend: result.spend + record.spend, revenue: result.revenue + record.attributedRevenue }), { clicks: 0, conversions: 0, reach: 0, spend: 0, revenue: 0 });
}

export function selectAnalyticsKpis(current: AnalyticsPerformanceRecord[], previous: AnalyticsPerformanceRecord[], dateRangeId: AnalyticsDateRangeId, permissions: AnalyticsPermissions): AnalyticsKpi[] {
  const currentTotals = totals(current); const previousTotals = totals(previous);
  const comparable = dateRangeId !== "all-time"; const hasPrevious = previous.length > 0;
  const values = [
    { id: "clicks", label: "Total Clicks", value: currentTotals.clicks, previous: previousTotals.clicks, formattedValue: formatCompactNumber(currentTotals.clicks), description: `${currentTotals.clicks.toLocaleString("en-US")} clicks across selected channels.`, financial: false },
    { id: "conversion-rate", label: "Conversion Rate", value: calculateConversionRate(currentTotals.conversions, currentTotals.clicks), previous: calculateConversionRate(previousTotals.conversions, previousTotals.clicks), formattedValue: formatPercentage(calculateConversionRate(currentTotals.conversions, currentTotals.clicks)), description: "Conversions divided by clicks for the selected period.", financial: false },
    { id: "roas", label: "ROAS", value: calculateRoas(currentTotals.revenue, currentTotals.spend), previous: calculateRoas(previousTotals.revenue, previousTotals.spend), formattedValue: `${calculateRoas(currentTotals.revenue, currentTotals.spend).toFixed(2).replace(/\.00$/, "")}x`, description: currentTotals.spend > 0 ? "Attributed revenue divided by recorded spend." : "ROAS unavailable because recorded spend is zero.", financial: true },
    { id: "reach", label: "Reach", value: currentTotals.reach, previous: previousTotals.reach, formattedValue: formatCompactNumber(currentTotals.reach), description: `Estimated aggregated reach across selected channels. Full value: ${currentTotals.reach.toLocaleString("en-US")}.`, financial: false },
  ] satisfies Array<Omit<AnalyticsKpi, "trend"> & { previous: number }>;
  return values.filter((item) => !item.financial || permissions.viewAnalyticsFinancialMetrics).map(({ previous: previousValue, ...item }) => ({ ...item, trend: calculateTrendPercentage(item.value, previousValue, hasPrevious, comparable) }));
}

export function selectReachEngagementSeries(records: AnalyticsPerformanceRecord[], dateRangeId: AnalyticsDateRangeId): ReachEngagementPoint[] {
  const buckets = new Map<string, AnalyticsPerformanceRecord[]>();
  for (const record of records) {
    const date = toDate(record.publishedAt);
    const key = dateRangeId === "all-time" ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` : isoDate(date);
    buckets.set(key, [...(buckets.get(key) ?? []), record]);
  }
  return [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, items]) => {
    const reach = items.reduce((sum, record) => sum + record.reach, 0);
    const impressions = items.reduce((sum, record) => sum + record.impressions, 0);
    const engagement = items.reduce((sum, record) => sum + calculateEngagementTotal(record), 0);
    const date = toDate(key.length === 7 ? `${key}-01` : key);
    const label = new Intl.DateTimeFormat("en-US", dateRangeId === "all-time" ? { month: "short", year: "2-digit", timeZone: "UTC" } : { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
    const fullLabel = new Intl.DateTimeFormat("en-US", dateRangeId === "all-time" ? { month: "long", year: "numeric", timeZone: "UTC" } : { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
    return { id: key, label, fullLabel, reach, engagement, engagementRate: calculateEngagementRate(engagement, impressions) };
  });
}

export function selectChannelPerformance(records: AnalyticsPerformanceRecord[]): ChannelPerformance[] {
  const totalSpend = records.reduce((sum, record) => sum + record.spend, 0); const totalConversions = records.reduce((sum, record) => sum + record.conversions, 0);
  const grouped = new Map<AnalyticsPlatform, AnalyticsPerformanceRecord[]>();
  for (const record of records) grouped.set(record.platform, [...(grouped.get(record.platform) ?? []), record]);
  return [...grouped.entries()].map(([platform, items]) => {
    const spend = items.reduce((sum, record) => sum + record.spend, 0); const reach = items.reduce((sum, record) => sum + record.reach, 0); const impressions = items.reduce((sum, record) => sum + record.impressions, 0); const engagement = items.reduce((sum, record) => sum + calculateEngagementTotal(record), 0); const clicks = items.reduce((sum, record) => sum + record.clicks, 0); const conversions = items.reduce((sum, record) => sum + record.conversions, 0); const revenue = items.reduce((sum, record) => sum + record.attributedRevenue, 0);
    return { platform, spend, reach, impressions, engagement, engagementRate: calculateEngagementRate(engagement, impressions), clicks, conversions, conversionRate: calculateConversionRate(conversions, clicks), roas: calculateRoas(revenue, spend), budgetShare: calculateChannelBudgetShare(spend, totalSpend), conversionShare: calculateChannelPerformanceShare(conversions, totalConversions) };
  }).sort((a, b) => b.conversionShare - a.conversionShare || b.reach - a.reach || a.platform.localeCompare(b.platform));
}

export function selectTopPerformingContent(current: AnalyticsPerformanceRecord[], previous: AnalyticsPerformanceRecord[], campaigns: AnalyticsCampaign[], contentType: AnalyticsFilters["contentType"], limit = 10): TopPerformingContentItem[] {
  const campaignNames = new Map(campaigns.map((campaign) => [campaign.id, campaign.name]));
  const previousRate = previous.length ? calculateEngagementRate(previous.reduce((sum, record) => sum + calculateEngagementTotal(record), 0), previous.reduce((sum, record) => sum + record.impressions, 0)) : 0;
  return current.filter((record) => contentType === "all" || record.contentType === contentType).map((record) => {
    const engagement = calculateEngagementTotal(record); const engagementRate = calculateEngagementRate(engagement, record.impressions);
    return { ...record, campaignName: campaignNames.get(record.campaignId) ?? "Unknown campaign", engagement, engagementRate, trend: calculateTrendPercentage(engagementRate, previousRate, previous.length > 0) };
  }).sort((a, b) => b.engagementRate - a.engagementRate || b.conversions - a.conversions || b.impressions - a.impressions || a.id.localeCompare(b.id)).slice(0, limit);
}

export function selectAnalyticsViewModel(data: AnalyticsDataSource, filters: AnalyticsFilters, permissions: AnalyticsPermissions): AnalyticsViewModel {
  const availableCampaigns = selectAvailableCampaigns(data, filters.brandId);
  const normalizedFilters = availableCampaigns.some((campaign) => campaign.id === filters.campaignId) || filters.campaignId === "all" ? filters : { ...filters, campaignId: "all" };
  const currentRecords = selectCurrentPeriodRecords(data, normalizedFilters); const previousRecords = selectPreviousPeriodRecords(data, normalizedFilters);
  const period = getAnalyticsPeriod(normalizedFilters.dateRangeId, data.referenceTime, data.records);
  return { filters: normalizedFilters, brands: selectAvailableBrands(data), campaigns: availableCampaigns, platforms: selectAvailablePlatforms(data, normalizedFilters), currentRecords, previousRecords, kpis: selectAnalyticsKpis(currentRecords, previousRecords, normalizedFilters.dateRangeId, permissions), series: selectReachEngagementSeries(currentRecords, normalizedFilters.dateRangeId), channels: selectChannelPerformance(currentRecords), content: selectTopPerformingContent(currentRecords, previousRecords, data.campaigns, normalizedFilters.contentType), isWorkspaceEmpty: data.records.length === 0, isFilterEmpty: data.records.length > 0 && currentRecords.length === 0, periodStart: period.start, periodEnd: period.end };
}
