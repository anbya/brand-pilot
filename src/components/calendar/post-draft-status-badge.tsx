import type { ManualPostStatus } from "@/lib/calendar/manual-post-types";

const statusMap: Record<ManualPostStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-50 text-amber-800" },
  changes_requested: { label: "Changes Requested", className: "bg-rose-50 text-rose-800" },
  scheduled: { label: "Scheduled", className: "bg-blue-50 text-blue-800" },
};
export function PostDraftStatusBadge({ status }: { status: ManualPostStatus }) { const value = statusMap[status]; return <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] ${value.className}`}>{value.label}</span>; }
