import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import type { DashboardBrand, DashboardDateRange, DashboardUser } from "@/lib/dashboard/types";

type Props = {
  user: DashboardUser;
  brands: DashboardBrand[];
  dateRanges: DashboardDateRange[];
  selectedBrandId: string;
  selectedDateRangeId: string;
  disabled?: boolean;
  onBrandChange: (brandId: string) => void;
  onDateRangeChange: (dateRangeId: string) => void;
};

const selectClass = "h-11 w-full min-w-0 max-w-full appearance-none rounded-full border border-[#c1c6d7] bg-white py-2 pl-10 pr-9 text-sm font-semibold text-[#0b1c30] shadow-sm outline-none transition hover:border-[#0058bc] focus-visible:border-[#0058bc] focus-visible:ring-2 focus-visible:ring-[#0058bc] disabled:cursor-not-allowed disabled:bg-[#eef1f6] disabled:text-[#657080] disabled:opacity-100";

export function DashboardHeader({ user, brands, dateRanges, selectedBrandId, selectedDateRangeId, disabled = false, onBrandChange, onDateRangeChange }: Props) {
  return <header className="flex min-w-0 flex-col gap-4 border-b border-[#d3e4fe] pb-5 sm:pb-6 xl:flex-row xl:items-end xl:justify-between"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#717786]">Dashboard Overview</p><h1 className="mt-2 break-words text-2xl font-bold leading-tight text-[#0b1c30] sm:text-3xl">Good morning, {user.name.split(" ")[0]}!</h1><p className="mt-2 max-w-2xl break-words text-sm leading-6 text-[#414755]">Here&apos;s what&apos;s happening with your brands today.</p></div><div className="grid min-w-0 w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[minmax(0,180px)_minmax(0,240px)]"><label className="relative block min-w-0"><span className="sr-only">Filter dashboard by brand</span><DashboardIcon name="brands" className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#0058bc]" /><select disabled={disabled} value={selectedBrandId} onChange={(event) => onBrandChange(event.target.value)} className={selectClass}><option value="all">All Brands</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select><DashboardIcon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" /></label><label className="relative block min-w-0"><span className="sr-only">Filter dashboard by date range</span><DashboardIcon name="calendar" className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#0058bc]" /><select disabled={disabled} value={selectedDateRangeId} onChange={(event) => onDateRangeChange(event.target.value)} className={selectClass}>{dateRanges.map((range) => <option key={range.id} value={range.id}>{range.label}</option>)}</select><DashboardIcon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" /></label></div></header>;
}
