import { platformOptions } from "@/lib/calendar/platform-options";
import type { ManualPostFilters } from "@/lib/calendar/manual-post-selectors";

type Option = { value: string; label: string };
export function PostDraftToolbar({ filters, brands, campaigns, onChange }: { filters: ManualPostFilters; brands: Option[]; campaigns: Option[]; onChange: (filters: ManualPostFilters) => void }) {
  const selectClass = "h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100";
  return <section aria-label="Post draft filters" className="mt-6 grid gap-3 rounded-xl border border-[#d3e4fe] bg-white p-4 sm:grid-cols-2 xl:grid-cols-5">
    <label><span className="sr-only">Search post drafts</span><input aria-label="Search post drafts" value={filters.search} onChange={(event) => onChange({ ...filters, search: event.target.value })} placeholder="Search title, campaign, or brand" className={selectClass} /></label>
    <Filter label="Filter drafts by brand" value={filters.brandId} allLabel="All Brands" options={brands} onChange={(value) => onChange({ ...filters, brandId: value })} />
    <Filter label="Filter drafts by campaign" value={filters.campaignId} allLabel="All Campaigns" options={campaigns} onChange={(value) => onChange({ ...filters, campaignId: value })} />
    <Filter label="Filter drafts by platform" value={filters.platform} allLabel="All Platforms" options={platformOptions} onChange={(value) => onChange({ ...filters, platform: value as ManualPostFilters["platform"] })} />
    <Filter label="Filter drafts by status" value={filters.status} allLabel="All Statuses" options={[{ value: "open", label: "Open Workflows" }, { value: "draft", label: "Draft" }, { value: "pending_approval", label: "Pending Approval" }, { value: "changes_requested", label: "Changes Requested" }, { value: "scheduled", label: "Scheduled" }]} onChange={(value) => onChange({ ...filters, status: value as ManualPostFilters["status"] })} />
  </section>;
}
function Filter({ label, value, allLabel, options, onChange }: { label: string; value: string; allLabel: string; options: readonly Option[]; onChange: (value: string) => void }) { return <label><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"><option value="all">{allLabel}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }
