import Link from "next/link";
import { DashboardIcon, type DashboardIconName } from "@/components/dashboard/dashboard-icon";
import type { DashboardAttentionItem as AttentionItem } from "@/lib/dashboard/types";

const baseClass = "flex min-w-0 flex-col items-start gap-3 rounded-lg border bg-white p-4 min-[380px]:flex-row min-[380px]:gap-4";
const presentation: Record<AttentionItem["type"], { icon: DashboardIconName; label: string; iconClass: string; borderClass: string }> = {
  failed_publish: { icon: "alert", label: "Failed publish", iconClass: "bg-red-50 text-red-700", borderClass: "border-red-200" },
  overdue: { icon: "clock", label: "Overdue", iconClass: "bg-orange-50 text-orange-700", borderClass: "border-orange-200" },
  approval: { icon: "check", label: "Approval", iconClass: "bg-[#e1e0ff] text-[#4648d4]", borderClass: "border-[#c9c8fa]" },
  missing_asset: { icon: "assets", label: "Missing asset", iconClass: "bg-amber-50 text-amber-700", borderClass: "border-amber-200" },
  low_credit: { icon: "bolt", label: "Low render credit", iconClass: "bg-amber-50 text-amber-700", borderClass: "border-amber-200" },
};

export function DashboardAttentionItem({ item }: { item: AttentionItem }) {
  const style = presentation[item.type];
  const content = <><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconClass}`}><DashboardIcon name={style.icon} className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-sm font-extrabold text-[#0b1c30]">{item.title}</h3><span className="rounded-full bg-[#eff4ff] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#414755]">{style.label}</span></div><p className="mt-2 text-sm leading-5 text-[#414755]">{item.description}</p><p className="mt-3 text-xs font-extrabold text-[#0b1c30]">{formatAttentionCount(item)}</p></div></>;
  if (item.href) return <Link href={item.href} className={`${baseClass} ${style.borderClass} shadow-sm transition hover:border-[#78aef5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2`}>{content}</Link>;
  return <article className={`${baseClass} ${style.borderClass}`}>{content}</article>;
}

function formatAttentionCount(item: AttentionItem): string {
  if (item.type === "low_credit") return `${item.count.toLocaleString("en-US")} render ${item.count === 1 ? "credit" : "credits"} remaining`;
  return `${item.count.toLocaleString("en-US")} ${item.countLabel}${item.count === 1 ? "" : "s"}`;
}
