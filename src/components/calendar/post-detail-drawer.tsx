"use client";

import type { RefObject } from "react";
import { parseLocalDate } from "@/lib/calendar/date-utils";
import { GeneratedPlanStatusBadge } from "@/components/calendar/generated-plan-status-badge";
import { GeneratedPostVisualPreview } from "@/components/calendar/generated-post-visual-preview";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { formatAssetTypeLabel, formatPlatformLabel } from "@/lib/calendar/platform-options";
import { getCalendarPostActions } from "@/lib/calendar/content-mutation-policy";
import type { GeneratedDraftPlan, GeneratedDraftPlanItem } from "@/lib/calendar/generated-plan-types";
import type { PlanningBrief } from "@/lib/calendar/planning-brief-types";
import type { ContentIdea, ContentPillar, ContentVersion } from "@/lib/calendar/types";

type PostDetailDrawerProps = {
  open: boolean;
  version?: ContentVersion;
  idea?: ContentIdea;
  pillar?: ContentPillar;
  generatedPlan?: GeneratedDraftPlan;
  generatedItem?: GeneratedDraftPlanItem;
  planningBrief?: PlanningBrief;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  onDuplicate: (versionId: string) => void;
  onReschedule: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  onViewGeneratedPlan: (planId: string, itemId: string, versionId: string) => void;
  onViewPlanningBrief: (briefId: string, versionId: string) => void;
};

const statusStyles = {
  draft: "bg-slate-100 text-slate-700",
  ready: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-blue-100 text-blue-800",
  published: "bg-violet-100 text-violet-800",
  failed: "bg-rose-100 text-rose-800",
} as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
const timestampFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export function PostDetailDrawer({ open, version, idea, pillar, generatedPlan, generatedItem, planningBrief, returnFocusRef, onClose, onDuplicate, onReschedule, onDelete, onViewGeneratedPlan, onViewPlanningBrief }: PostDetailDrawerProps) {
  if (!open) return null;

  const headline = version?.headline.trim() || idea?.title || "Post details";
  const pillarName = pillar?.name ?? "Unknown pillar";
  const pillarColor = pillar?.color ?? "#94A3B8";
  const generatedPlanId = idea?.generatedPlanId ?? version?.generatedPlanId;
  const generatedItemId = idea?.generatedPlanItemId ?? version?.generatedPlanItemId;
  const planningBriefId = idea?.planningBriefId ?? version?.planningBriefId;
  const generatedPost = Boolean(idea?.creationSource === "generated_plan" || (generatedPlanId && generatedItemId));
  const manualPost = idea?.creationSource === "manual" && !generatedPost;
  const approvedManualPost = Boolean(version?.status === "scheduled" && manualPost && idea?.approvedAt);
  const actions = version ? getCalendarPostActions(version.status) : undefined;

  return <ResponsiveOverlayShell open variant="drawer" title={headline} showHeader={false} maxWidth="max-w-[620px]" bodyScrollable={false} bodyClassName="flex flex-col p-0" returnFocusRef={returnFocusRef} onClose={onClose}>
      <header className="shrink-0 border-b border-[#d3e4fe] bg-white px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#0058bc]">Post Details</p><h2 className="mt-2 break-words text-xl font-extrabold outline-none sm:text-2xl">{headline}</h2>{version && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#0058bc]">{formatPlatformLabel(version.platform)}</span><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[version.status]}`}>{formatAssetTypeLabel(version.status)}</span></div>}</div><button type="button" aria-label="Close Post Details" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8d8ef] text-xl text-[#526174] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">×</button></div>
        <div className="mt-4 h-1 w-full rounded-full" aria-hidden="true" style={{ backgroundColor: pillarColor }} />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f8faff] p-4 sm:p-6">
        {!version ? <Unavailable title="Post data is unavailable." description="The selected content version could not be found." /> : <div className="grid gap-5">
          <DetailSection title={generatedPost ? "Generated Post Preview" : "Post Preview"}><GeneratedPostVisualPreview platform={version.platform} assetType={version.assetType} brandName={idea?.brandName} headline={headline} caption={version.caption} cta={version.cta} hashtags={version.hashtags} visualBrief={version.visualBrief} status={version.status} publishTime={version.publishTime} />{version.mediaUrl && <a href={version.mediaUrl} target="_blank" rel="noreferrer" className="mt-4 block break-all text-sm font-bold text-[#0058bc] underline decoration-blue-200 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Open attached media</a>}</DetailSection>

          <DetailSection title="Post Content"><dl className="grid gap-4"><DetailItem label="Hook" value={headline} /><DetailItem label="Caption / Body" value={version.caption || "No caption"} /><DetailItem label="CTA" value={version.cta || "No CTA"} /><DetailItem label="Hashtags" value={version.hashtags.length ? version.hashtags.map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" ") : "No hashtags"} /><DetailItem label="Assets" value={version.assetId || version.mediaUrl || "No asset attached"} /><DetailItem label="Source Idea" value={idea ? `${idea.title} (${idea.id})` : "Source idea unavailable"} /><DetailItem label="Workflow Relationship" value={generatedPost ? "Idea Draft → Generated Ideas → Generated Content → Calendar Post" : "Idea Draft → Calendar Post"} /></dl></DetailSection>

          <DetailSection title="Strategy">{idea ? <dl className="grid gap-4"><DetailItem label="Content Title" value={idea.title} /><DetailItem label="Core Topic" value={idea.coreTopic} /><div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Content Pillar</dt><dd className="mt-1.5 flex items-center gap-2 text-sm font-bold"><span className="h-3 w-3 rounded-full" aria-hidden="true" style={{ backgroundColor: pillarColor }} />{pillarName}</dd></div><DetailItem label="Objective" value={formatAssetTypeLabel(idea.objective)} /><DetailItem label="Target Audience" value={idea.targetAudience} /><DetailItem label="Main Message" value={idea.mainMessage} /><DetailItem label="Creation Source" value={generatedPost ? "Generated from Planning Brief" : manualPost ? "Manual Post" : formatAssetTypeLabel(idea.creationSource)} /><DetailItem label="Linked Campaign" value={idea.campaignName || idea.campaignId || "Not linked"} /></dl> : <Unavailable title="Content idea data is unavailable." description="Version details remain available, but its strategy relationship is missing." />}</DetailSection>

          {generatedPost && idea && <DetailSection title="Source"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Source Type" value="Generated from Planning Brief" /><DetailItem label="Planning Brief" value={planningBrief?.title || generatedPlan?.planningBriefTitle || "Source planning brief is unavailable."} /><DetailItem label="Campaign" value={idea.campaignName || idea.campaignId || "Not linked"} /><DetailItem label="Brand" value={idea.brandName || "Not specified"} />{generatedPlan && <><div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Generated Plan Status</dt><dd className="mt-1.5"><GeneratedPlanStatusBadge status={generatedPlan.status} /></dd></div><DetailItem label="Generated At" value={formatTimestamp(generatedPlan.generatedAt)} /><DetailItem label="Generator" value={generatedPlan.generatorVersion} /></>}{generatedItem && <><DetailItem label="Generated Item" value={generatedItem.title} /><DetailItem label="Generated Content Type" value={formatAssetTypeLabel(generatedItem.assetType)} /><DetailItem label="Generated Platform" value={formatPlatformLabel(generatedItem.platform)} /><DetailItem label="Schedule Source" value={`${formatDateOnly(generatedItem.publishDate)} at ${generatedItem.publishTime}`} /></>}</dl>{!generatedPlan && <div className="mt-4"><Unavailable title="Generated draft plan unavailable" description="The source draft plan could not be loaded." /></div>}{generatedPlan && !generatedItem && <div className="mt-4"><Unavailable title="Generated content item unavailable" description="The source item is missing, but the generated draft plan remains available." /></div>}<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">{generatedPlan && generatedPlanId && generatedItemId && <button type="button" onClick={() => onViewGeneratedPlan(generatedPlanId, generatedItemId, version.id)} className="min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">View Draft Plan</button>}{planningBrief && planningBriefId && <button type="button" onClick={() => onViewPlanningBrief(planningBriefId, version.id)} className="min-h-11 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">View Planning Brief</button>}</div></DetailSection>}
          {manualPost && idea && <DetailSection title="Source"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Source Type" value="Manual Post" /><DetailItem label="Campaign" value={idea.campaignName || idea.campaignId || "Not linked"} /><DetailItem label="Brand" value={idea.brandName || "Not specified"} /><DetailItem label="Owner" value={idea.ownerName || version.createdBy} />{approvedManualPost && <><DetailItem label="Approved" value={idea.approvedAt ? formatTimestamp(idea.approvedAt) : "Unavailable"} /><DetailItem label="Approved By" value={idea.approvedBy || "Unavailable"} /></>}</dl></DetailSection>}
          <DetailSection title="Platform & Format"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Platform" value={formatPlatformLabel(version.platform)} /><DetailItem label="Content Type" value={formatAssetTypeLabel(version.assetType)} /><DetailItem label="Created By" value={version.createdBy} /></dl></DetailSection>
          <DetailSection title="Schedule"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Publish Date" value={formatDateOnly(version.publishDate)} /><DetailItem label="Publish Time" value={version.publishTime} /><DetailItem label="Timezone" value={version.timezone} /><div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Status</dt><dd className="mt-1.5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[version.status]}`}>{formatAssetTypeLabel(version.status)}</span></dd></div></dl></DetailSection>
          <DetailSection title="Metadata" muted><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Created At" value={formatTimestamp(version.createdAt)} /><DetailItem label="Updated At" value={formatTimestamp(version.updatedAt)} /></dl></DetailSection>
        </div>}
      </div>
      <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[#d3e4fe] bg-white px-5 py-4 sm:px-6">{version && actions?.canDelete && <button type="button" onClick={() => onDelete(version.id)} className="mr-auto rounded-lg px-3 py-2.5 text-sm font-bold text-rose-600 outline-none hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-600">Delete</button>}{version && actions?.canDuplicate && <button type="button" onClick={() => onDuplicate(version.id)} className="rounded-lg border border-[#c5d2e5] px-3 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Duplicate as Draft</button>}{version && actions?.canReschedule && <button type="button" onClick={() => onReschedule(version.id)} className="rounded-lg border border-[#c5d2e5] px-3 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Reschedule</button>}<button type="button" onClick={onClose} className="rounded-lg px-3 py-2.5 text-sm font-bold text-[#657080] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button></footer>
  </ResponsiveOverlayShell>;
}

function DetailSection({ title, children, muted = false }: { title: string; children: React.ReactNode; muted?: boolean }) { return <section className={`rounded-xl border border-[#d3e4fe] p-4 sm:p-5 ${muted ? "bg-[#f1f5f9]" : "bg-white"}`}><h3 className="mb-4 text-sm font-extrabold text-[#0058bc]">{title}</h3>{children}</section>; }
function DetailItem({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}</dt><dd className="mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold text-[#0b1c30]">{value || "—"}</dd></div>; }
function Unavailable({ title, description }: { title: string; description: string }) { return <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-extrabold text-amber-900">{title}</p><p className="mt-1 text-sm leading-6 text-amber-800">{description}</p></div>; }
function formatDateOnly(value: string): string { try { return dateFormatter.format(parseLocalDate(value)); } catch { return value || "Unavailable"; } }
function formatTimestamp(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : timestampFormatter.format(date); }
