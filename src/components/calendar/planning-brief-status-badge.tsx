import type { PlanningBriefStatus } from "@/lib/calendar/planning-brief-types";

const presentation: Record<PlanningBriefStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-50 text-amber-800" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-800" },
  changes_requested: { label: "Changes Requested", className: "bg-rose-50 text-rose-800" },
};

export function PlanningBriefStatusBadge({ status }: { status: PlanningBriefStatus }) { const item = presentation[status]; return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] ${item.className}`}>{item.label}</span>; }
