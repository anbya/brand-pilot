import { DashboardAttentionItem } from "@/components/dashboard/dashboard-attention-item";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { DashboardAttentionItem as AttentionItem } from "@/lib/dashboard/types";

export function DashboardNeedsAttention({ items }: { items: AttentionItem[] }) {
  return <DashboardPanel className="mt-5 sm:mt-6"><div className="min-w-0"><h2 className="break-words text-lg font-bold text-[#0b1c30]">Needs Attention</h2><p className="mt-1 break-words text-sm text-[#657080]">Review the highest-priority items for the selected filters.</p></div>{items.length ? <ul className="mt-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <li key={item.id} className="min-w-0"><DashboardAttentionItem item={item} /></li>)}</ul> : <div className="mt-4 flex min-w-0 flex-col items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 min-[380px]:flex-row"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700"><DashboardIcon name="check" className="h-5 w-5" /></span><div className="min-w-0"><h3 className="break-words text-sm font-extrabold text-[#0b1c30]">You&apos;re all caught up</h3><p className="mt-1 break-words text-sm text-[#414755]">No urgent items need your attention for the selected filters.</p></div></div>}</DashboardPanel>;
}
