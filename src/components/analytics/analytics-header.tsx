import { AnalyticsIcon } from "@/components/analytics/analytics-icon";
import { analyticsDateRanges, platformLabels } from "@/lib/analytics/constants";
import type { AnalyticsBrand, AnalyticsCampaign, AnalyticsDateRangeId, AnalyticsFilters, AnalyticsPermissions, AnalyticsPlatform } from "@/lib/analytics/types";
import { PageHeader } from "@/components/ui/page-header";

export function AnalyticsHeader({ filters, brands, campaigns, platforms, permissions, onDateRangeChange, onBrandChange, onCampaignChange, onPlatformChange, onExport }: {
  filters: AnalyticsFilters; brands: AnalyticsBrand[]; campaigns: AnalyticsCampaign[]; platforms: AnalyticsPlatform[]; permissions: AnalyticsPermissions;
  onDateRangeChange: (value: AnalyticsDateRangeId) => void; onBrandChange: (value: string) => void; onCampaignChange: (value: string) => void; onPlatformChange: (value: AnalyticsPlatform | "all") => void; onExport: () => void;
}) {
  return <>
    <PageHeader eyebrow="Workspace analytics" title="Analytics Performance" description="Performance insights across campaigns, channels, and published content." actions={<>
        <div aria-label="Analytics date range" className="grid grid-cols-3 rounded-lg bg-[#e5eeff] p-1">
          {analyticsDateRanges.map((range) => <button key={range.id} type="button" aria-pressed={filters.dateRangeId === range.id} onClick={() => onDateRangeChange(range.id)} className={`min-h-10 rounded-md px-3 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-[#0058bc] ${filters.dateRangeId === range.id ? "bg-white text-[#0058bc] shadow-sm" : "text-[#414755] hover:bg-white/60"}`}>{range.label}</button>)}
        </div>
        {permissions.exportAnalytics ? <button type="button" onClick={onExport} className="bp-button bp-button-primary"><AnalyticsIcon name="download" className="h-4 w-4" />Export Data</button> : null}
      </>} />
    {permissions.useAnalyticsFilters ? <section aria-label="Analytics filters" className="bp-card mt-6 grid gap-3 sm:grid-cols-3">
      <FilterSelect label="Brand" value={filters.brandId} onChange={onBrandChange}><option value="all">All Brands</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</FilterSelect>
      <FilterSelect label="Campaign" value={filters.campaignId} onChange={onCampaignChange}><option value="all">All Campaigns</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</FilterSelect>
      <FilterSelect label="Platform" value={filters.platform} onChange={(value) => onPlatformChange(value as AnalyticsPlatform | "all")}><option value="all">All Platforms</option>{platforms.map((platform) => <option key={platform} value={platform}>{platformLabels[platform]}</option>)}</FilterSelect>
    </section> : null}
  </>;
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="bp-label grid min-w-0 gap-1.5">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="bp-field min-w-0 normal-case tracking-normal">{children}</select></label>;
}
