"use client";

import Link from "next/link";
import { GeneratedPlanStatusBadge } from "@/components/calendar/generated-plan-status-badge";
import { PlanningBriefStatusBadge } from "@/components/calendar/planning-brief-status-badge";
import { PostActionDialogShell } from "@/components/calendar/post-action-dialog-shell";
import { getGeneratedPlanByBriefId, readGeneratedPlans } from "@/lib/calendar/generated-plan-store";
import type { GeneratedDraftPlan } from "@/lib/calendar/generated-plan-types";
import { formatAssetTypeLabel, platformOptions } from "@/lib/calendar/platform-options";
import type { PlanningBrief, PlanningBriefPermissions } from "@/lib/calendar/planning-brief-types";

type Props = { brief?: PlanningBrief; generatedPlan?: GeneratedDraftPlan; permissions: PlanningBriefPermissions; onClose: () => void; onSubmit: () => void; onApprove: () => void; onRequestChanges: () => void; onViewGeneratedPlan?: (planId: string) => void };

export function PlanningBriefPreviewDrawer({ brief, generatedPlan, permissions, onClose, onSubmit, onApprove, onRequestChanges, onViewGeneratedPlan }: Props) {
  if (!brief) return null;
  const plan = generatedPlan ?? getGeneratedPlanByBriefId(readGeneratedPlans(window.localStorage), brief.id);
  const editable = permissions.canEdit && (brief.status === "draft" || brief.status === "changes_requested");
  const request = brief.request;
  const footer = <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <button type="button" onClick={onClose} className="min-h-11 rounded-lg border px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button>
    {editable && <Link href={`/calendar?editBrief=${encodeURIComponent(brief.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Edit</Link>}
    {brief.status === "draft" && permissions.canSubmit && <button type="button" onClick={onSubmit} className="min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white">Submit for Approval</button>}
    {brief.status === "changes_requested" && permissions.canSubmit && <button type="button" onClick={onSubmit} className="min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white">Resubmit for Approval</button>}
    {brief.status === "pending_approval" && permissions.canRequestChanges && <button type="button" onClick={onRequestChanges} className="min-h-11 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700">Request Changes</button>}
    {brief.status === "pending_approval" && permissions.canApprove && <button type="button" onClick={onApprove} className="min-h-11 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white">Approve</button>}
    {brief.status === "approved" && plan && (onViewGeneratedPlan ? <button type="button" onClick={() => onViewGeneratedPlan(plan.id)} className="min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">View Draft Plan</button> : <Link href={`/calendar?viewPlan=${encodeURIComponent(plan.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white">View Draft Plan</Link>)}
    {brief.status === "approved" && !plan && permissions.canGenerate && <Link href={`/calendar?generateBrief=${encodeURIComponent(brief.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white">Generate Draft Plan</Link>}
  </div>;
  return <PostActionDialogShell open title={brief.title} description="Read-only Planning Brief preview" onClose={onClose} footer={footer} maxWidth="max-w-[900px]">
    <div className="mb-5 flex flex-wrap items-center gap-3"><PlanningBriefStatusBadge status={brief.status} />{brief.status === "pending_approval" && !permissions.canApprove && <span className="text-sm font-semibold text-[#657080]">Awaiting approval</span>}</div>
    <dl className="grid gap-5 sm:grid-cols-2"><Info label="Campaign" value={brief.campaignName} /><Info label="Brand" value={brief.brandName} /><Info label="Owner" value={brief.ownerName} /><Info label="Date Range" value={`${request.startDate} – ${request.endDate}`} /><Info label="Platforms" value={request.platforms.map((platform) => platformOptions.find((item) => item.value === platform)?.label ?? platform).join(", ")} /><Info label="Objective" value={formatAssetTypeLabel(request.objective)} /><Info label="Target Audience" value={request.targetAudience} /><Info label="Tone of Voice" value={brief.toneOfVoice} /><Info label="Content Pillars" value={request.pillarIds.join(", ")} /><Info label="Deliverables" value={`${request.numberOfPosts} planned posts`} /><Info label="Publishing Days" value={request.allowedDays.map(formatAssetTypeLabel).join(", ")} /><Info label="Preferred Times" value={request.preferredTimes.join(", ")} /></dl>
    {plan && <section className="mt-6 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-extrabold">Generated Draft Plan</h3><GeneratedPlanStatusBadge status={plan.status} /></div><dl className="mt-4 grid gap-4 sm:grid-cols-2"><Info label="Generated At" value={formatDateTime(plan.generatedAt)} /><Info label="Items Added" value={`${plan.items.filter((item) => item.calendarStatus === "added_to_calendar").length} of ${plan.items.length}`} /></dl></section>}
    {brief.approvalNote && <section className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4"><h3 className="font-extrabold text-rose-900">Approval note</h3><p className="mt-2 text-sm text-rose-800">{brief.approvalNote}</p></section>}
    <dl className="mt-6 grid gap-3 border-t pt-5 text-xs text-[#657080] sm:grid-cols-2"><Info label="Created" value={formatDateTime(brief.createdAt)} /><Info label="Updated" value={formatDateTime(brief.updatedAt)} />{brief.submittedAt && <Info label="Submitted" value={`${formatDateTime(brief.submittedAt)} by ${brief.submittedBy}`} />}{brief.approvedAt && <Info label="Approved" value={`${formatDateTime(brief.approvedAt)} by ${brief.approvedBy}`} />}</dl>
  </PostActionDialogShell>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-extrabold uppercase tracking-[.08em] text-[#8b96a5]">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-[#0b1c30]">{value || "Not specified"}</dd></div>; }
function formatDateTime(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date); }
