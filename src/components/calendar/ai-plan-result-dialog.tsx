"use client";

import Link from "next/link";
import { useRef, type RefObject } from "react";
import { GeneratedPlanStatusBadge } from "@/components/calendar/generated-plan-status-badge";
import { PostActionDialogShell } from "@/components/calendar/post-action-dialog-shell";
import { activePlanningBriefPermissions } from "@/lib/calendar/planning-brief-permissions";
import { getGeneratedItemScheduleIssue, getGeneratedItemTime } from "@/lib/calendar/generated-plan-utils";
import { formatAssetTypeLabel } from "@/lib/calendar/platform-options";
import type { GeneratedDraftPlan, GeneratedDraftPlanItem } from "@/lib/calendar/generated-plan-types";

type Props = {
  open: boolean;
  plan?: GeneratedDraftPlan;
  items: GeneratedDraftPlanItem[];
  canApprove: boolean;
  message?: string;
  focusedItemId?: string;
  onViewInCalendar?: () => void;
  onClose: () => void;
  onToggleItem: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onApproveSelected: () => void;
};

export function AiPlanResultDialog({ open, plan, items, canApprove: requestedCanApprove, message, focusedItemId, onViewInCalendar, onClose, onToggleItem, onSelectAll, onClearSelection, onApproveSelected }: Props) {
  const focusedItemRef = useRef<HTMLElement>(null);
  if (!open) return null;
  const canApprove = requestedCanApprove && activePlanningBriefPermissions.canApproveGeneratedContent;
  if (!plan) return <PostActionDialogShell open title="Draft plan not found" description="The generated draft plan could not be loaded." onClose={onClose} footer={<Link href="/calendar/planning-briefs" className="inline-flex min-h-11 items-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">Back to Planning Briefs</Link>}><p className="text-sm text-[#657080]">Return to the Planning Brief List and open an available generated plan.</p></PostActionDialogShell>;

  const eligible = items.filter((item) => item.calendarStatus === "not_added" && !item.calendarPostId);
  const selected = eligible.filter((item) => item.selected);
  const added = items.length - eligible.length;
  const blocked = selected.some((item) => item.conflicts.length > 0);
  const footer = <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div aria-live="polite">{canApprove ? <><p className="text-sm font-bold text-[#414755]">{selected.length} item{selected.length === 1 ? "" : "s"} selected</p><p className="mt-1 text-xs text-[#657080]">Selected items with a valid schedule will be added as Scheduled posts. Generated history remains available.</p>{blocked && <p className="mt-1 text-xs font-bold text-rose-700">Resolve schedule conflicts before approval.</p>}</> : <p className="text-sm font-semibold text-[#657080]">This generated plan is read-only for your role.</p>}</div>
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto"><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button>{added > 0 && onViewInCalendar && <button type="button" onClick={onViewInCalendar} className="min-h-11 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">View in Calendar</button>}{canApprove && eligible.length > 0 && <button type="button" disabled={!selected.length || blocked} onClick={onApproveSelected} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none disabled:cursor-not-allowed disabled:bg-[#a1a9b5] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">Approve Selected to Calendar</button>}</div>
  </div>;

  return <PostActionDialogShell open title="AI Draft Content Plan" description={plan.planningBriefTitle} onClose={onClose} footer={footer} maxWidth="max-w-[1000px]" initialFocusRef={focusedItemId ? focusedItemRef : undefined}>
    <Link href="/calendar/planning-briefs" className="inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-bold text-[#0058bc] outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]"><span aria-hidden="true">←</span><span className="ml-2">Back to Planning Briefs</span></Link>
    {message && <p role="status" className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">{message}</p>}
    <div className="mt-4 grid gap-3 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 sm:grid-cols-2 lg:grid-cols-4"><Meta label="Campaign" value={plan.campaignName} /><Meta label="Brand" value={plan.brandName} /><Meta label="Generated" value={formatDate(plan.generatedAt)} /><div><dt className="text-xs font-bold uppercase text-[#8b96a5]">Status</dt><dd className="mt-1"><GeneratedPlanStatusBadge status={plan.status} /></dd></div><Meta label="Total Items" value={String(items.length)} /><Meta label="Not Added" value={String(eligible.length)} /><Meta label="Added to Calendar" value={`${added} of ${items.length}`} /><Meta label="Generator" value={plan.generatorVersion} /></div>
    {canApprove && eligible.length > 0 && <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onSelectAll} className="min-h-10 rounded-lg border px-3 text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#0058bc]">Select All Available</button><button type="button" onClick={onClearSelection} className="min-h-10 rounded-lg border px-3 text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#0058bc]">Clear Selection</button></div>}
    <div className="mt-4 grid gap-3 md:grid-cols-2">{items.map((item) => <PlanItem key={item.id} item={item} focused={item.id === focusedItemId} focusRef={item.id === focusedItemId ? focusedItemRef : undefined} canSelect={canApprove} onToggle={onToggleItem} />)}</div>
    {items.length === 0 && <div className="rounded-xl border border-dashed p-8 text-center"><h3 className="font-extrabold">No generated content items</h3><p className="mt-2 text-sm text-[#657080]">This stored plan does not contain any generated items.</p></div>}
  </PostActionDialogShell>;
}

function PlanItem({ item, focused, focusRef, canSelect, onToggle }: { item: GeneratedDraftPlanItem; focused: boolean; focusRef?: RefObject<HTMLElement | null>; canSelect: boolean; onToggle: (id: string, selected: boolean) => void }) {
  const added = item.calendarStatus === "added_to_calendar";
  const scheduleIssue = getGeneratedItemScheduleIssue(item);
  return <article ref={focusRef} tabIndex={focused ? -1 : undefined} className={`min-w-0 rounded-xl border bg-white p-4 outline-none ${focused ? "border-[#0058bc] ring-2 ring-[#0058bc] ring-offset-2" : "border-[#d3e4fe]"}`}><div className="flex items-start gap-3">
    {canSelect && !added && <label className="flex min-h-10 shrink-0 items-center"><input type="checkbox" checked={item.selected} onChange={(event) => onToggle(item.id, event.target.checked)} aria-label={`Select ${item.title}`} className="h-5 w-5 accent-[#0058bc]" /></label>}
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="break-words font-extrabold">{item.title}</h3><div className="flex flex-wrap justify-end gap-1">{focused && <span className="rounded-full bg-[#0058bc] px-2.5 py-1 text-[10px] font-extrabold uppercase text-white">Current Calendar Post</span>}<span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${added ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{added ? "Added to Calendar" : "Not Added"}</span></div></div>
      <p className="mt-2 text-xs font-semibold text-[#657080]">{item.publishDate || "Date required"} · {getGeneratedItemTime(item)} · {item.platform ? formatAssetTypeLabel(item.platform) : "Platform required"} · {item.assetType}</p>
      <p className="mt-3 break-words text-sm leading-6 text-[#414755]">{item.caption}</p>
      {scheduleIssue && !added && <p role="status" className="mt-3 text-xs font-bold text-rose-700">{scheduleIssue}</p>}
      {item.conflicts.length > 0 && !added && <p className="mt-3 text-xs font-bold text-rose-700">Schedule conflict: {item.conflicts.map((conflict) => conflict.message).join(", ")}</p>}
      {item.calendarPostId && <p className="mt-3 text-xs font-semibold text-emerald-800">Scheduled post created</p>}
    </div>
  </div></article>;
}

function Meta({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase text-[#8b96a5]">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date); }
