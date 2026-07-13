import { AnalyticsIcon } from "@/components/analytics/analytics-icon";
import { analyticsDateRanges, platformLabels } from "@/lib/analytics/constants";
import type { AnalyticsBrand, AnalyticsCampaign, AnalyticsDateRangeId, AnalyticsFilters, AnalyticsPermissions, AnalyticsPlatform } from "@/lib/analytics/types";

export function AnalyticsHeader({ filters, brands, campaigns, platforms, permissions, onDateRangeChange, onBrandChange, onCampaignChange, onPlatformChange, onExport }: {
  filters: AnalyticsFilters; brands: AnalyticsBrand[]; campaigns: AnalyticsCampaign[]; platforms: AnalyticsPlatform[]; permissions: AnalyticsPermissions;
  onDateRangeChange: (value: AnalyticsDateRangeId) => void; onBrandChange: (value: string) => void; onCampaignChange: (value: string) => void; onPlatformChange: (value: AnalyticsPlatform | "all") => void; onExport: () => void;
}) {
  return <>
    <header className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#0058bc]">Workspace analytics</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.03em] text-[#0b1c30] sm:text-4xl">Analytics Performance</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#526174]">Performance insights across campaigns, channels, and published content.</p></div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <div aria-label="Analytics date range" className="grid grid-cols-3 rounded-lg bg-[#e5eeff] p-1">
          {analyticsDateRanges.map((range) => <button key={range.id} type="button" aria-pressed={filters.dateRangeId === range.id} onClick={() => onDateRangeChange(range.id)} className={`min-h-10 rounded-md px-3 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-[#0058bc] ${filters.dateRangeId === range.id ? "bg-white text-[#0058bc] shadow-sm" : "text-[#414755] hover:bg-white/60"}`}>{range.label}</button>)}
        </div>
        {permissions.exportAnalytics ? <button type="button" onClick={onExport} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none transition hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2"><AnalyticsIcon name="download" className="h-4 w-4" />Export Data</button> : null}
      </div>
    </header>
    {permissions.useAnalyticsFilters ? <section aria-label="Analytics filters" className="mt-6 grid min-w-0 gap-3 rounded-lg border border-[#d3e4fe]/80 bg-white p-4 shadow-sm sm:grid-cols-3 sm:p-5">
      <FilterSelect label="Brand" value={filters.brandId} onChange={onBrandChange}><option value="all">All Brands</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</FilterSelect>
      <FilterSelect label="Campaign" value={filters.campaignId} onChange={onCampaignChange}><option value="all">All Campaigns</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</FilterSelect>
      <FilterSelect label="Platform" value={filters.platform} onChange={(value) => onPlatformChange(value as AnalyticsPlatform | "all")}><option value="all">All Platforms</option>{platforms.map((platform) => <option key={platform} value={platform}>{platformLabels[platform]}</option>)}</FilterSelect>
    </section> : null}
  </>;
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="grid min-w-0 gap-1.5 text-xs font-extrabold uppercase tracking-[.1em] text-[#526174]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 min-w-0 rounded-lg border border-[#bfd3f2] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#0b1c30] outline-none focus-visible:border-[#0058bc] focus-visible:ring-2 focus-visible:ring-[#b8d5ff]">{children}</select></label>;
}
