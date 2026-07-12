"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type RefObject } from "react";
import { parseLocalDate } from "@/lib/calendar/date-utils";
import { formatAssetTypeLabel, formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { ContentIdea, ContentPillar, ContentVersion } from "@/lib/calendar/types";

type PostDetailDrawerProps = {
  open: boolean;
  version?: ContentVersion;
  idea?: ContentIdea;
  pillar?: ContentPillar;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  onEdit: (versionId: string) => void;
  onDuplicate: (versionId: string) => void;
  onReschedule: (versionId: string) => void;
  onDelete: (versionId: string) => void;
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

export function PostDetailDrawer({ open, version, idea, pillar, returnFocusRef, onClose, onEdit, onDuplicate, onReschedule, onDelete }: PostDetailDrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = returnFocusRef?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    headingRef.current?.focus();
    function closeOnEscape(event: globalThis.KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return event.preventDefault();
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  const headline = version?.headline.trim() || idea?.title || "Post details";
  const pillarName = pillar?.name ?? "Unknown pillar";
  const pillarColor = pillar?.color ?? "#94A3B8";

  return <div role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} className="fixed inset-0 z-[85] flex justify-end bg-[#071b33]/55 backdrop-blur-[1px] motion-safe:transition-colors">
    <aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={trapFocus} onMouseDown={(event) => event.stopPropagation()} className="flex h-full w-full flex-col overflow-hidden bg-white text-[#0b1c30] shadow-[-24px_0_70px_rgba(7,27,51,.22)] outline-none sm:w-[72vw] sm:max-w-[520px] sm:rounded-l-2xl">
      <header className="shrink-0 border-b border-[#d3e4fe] bg-white px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#0058bc]">Post Details</p><h2 ref={headingRef} id={titleId} tabIndex={-1} className="mt-2 break-words text-xl font-extrabold outline-none sm:text-2xl">{headline}</h2>{version && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#0058bc]">{formatPlatformLabel(version.platform)}</span><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[version.status]}`}>{formatAssetTypeLabel(version.status)}</span></div>}</div><button type="button" aria-label="Close Post Details" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8d8ef] text-xl text-[#526174] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">×</button></div>
        <div className="mt-4 h-1 w-full rounded-full" aria-hidden="true" style={{ backgroundColor: pillarColor }} />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f8faff] p-4 sm:p-6">
        {!version ? <Unavailable title="Post data is unavailable." description="The selected content version could not be found." /> : <div className="grid gap-5">
          <DetailSection title="Content Preview"><div className="rounded-xl border-l-4 bg-white p-4" style={{ borderLeftColor: pillarColor }}><h3 className="break-words text-lg font-extrabold">{headline}</h3><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#414755]">{version.caption || "No caption"}</p><div className="mt-4 rounded-lg bg-[#eff4ff] p-3"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Call to action</p><p className="mt-1 break-words text-sm font-bold">{version.cta || "No CTA"}</p></div><div className="mt-4 flex flex-wrap gap-2">{version.hashtags.length ? version.hashtags.map((tag) => <span key={tag} className="break-all rounded-full bg-[#e5eeff] px-2.5 py-1 text-xs font-bold text-[#0058bc]">#{tag}</span>) : <span className="text-xs font-semibold text-[#8b96a5]">No hashtags</span>}</div><div className="mt-4 border-t border-[#e2e8f0] pt-4">{version.mediaUrl ? <a href={version.mediaUrl} target="_blank" rel="noreferrer" className="block break-all text-sm font-bold text-[#0058bc] underline decoration-blue-200 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Open media</a> : <p className="text-sm font-semibold text-[#8b96a5]">No media attached</p>}</div>{version.visualBrief && <div className="mt-4"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Visual brief</p><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[#414755]">{version.visualBrief}</p></div>}</div></DetailSection>

          <DetailSection title="Strategy">{idea ? <dl className="grid gap-4"><DetailItem label="Content Title" value={idea.title} /><DetailItem label="Core Topic" value={idea.coreTopic} /><div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Content Pillar</dt><dd className="mt-1.5 flex items-center gap-2 text-sm font-bold"><span className="h-3 w-3 rounded-full" aria-hidden="true" style={{ backgroundColor: pillarColor }} />{pillarName}</dd></div><DetailItem label="Objective" value={formatAssetTypeLabel(idea.objective)} /><DetailItem label="Target Audience" value={idea.targetAudience} /><DetailItem label="Main Message" value={idea.mainMessage} /><DetailItem label="Creation Source" value={idea.creationSource === "ai" ? "AI" : formatAssetTypeLabel(idea.creationSource)} /><DetailItem label="Linked Campaign" value={idea.campaignId || "Not linked"} mono={Boolean(idea.campaignId)} /></dl> : <Unavailable title="Content idea data is unavailable." description="Version details remain available, but its strategy relationship is missing." />}</DetailSection>

          <DetailSection title="Platform & Format"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Platform" value={formatPlatformLabel(version.platform)} /><DetailItem label="Asset Type" value={formatAssetTypeLabel(version.assetType)} /><DetailItem label="Created By" value={version.createdBy} /></dl></DetailSection>
          <DetailSection title="Schedule"><dl className="grid gap-4 sm:grid-cols-2"><DetailItem label="Publish Date" value={formatDateOnly(version.publishDate)} /><DetailItem label="Publish Time" value={version.publishTime} /><DetailItem label="Timezone" value={version.timezone} /><div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">Status</dt><dd className="mt-1.5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[version.status]}`}>{formatAssetTypeLabel(version.status)}</span></dd></div></dl></DetailSection>
          <DetailSection title="Metadata" muted><dl className="grid gap-4"><DetailItem label="Version ID" value={version.id} mono /><DetailItem label="Content Idea ID" value={version.contentIdeaId} mono /><DetailItem label="Created At" value={formatTimestamp(version.createdAt)} /><DetailItem label="Updated At" value={formatTimestamp(version.updatedAt)} /></dl></DetailSection>
        </div>}
      </div>
      <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[#d3e4fe] bg-white px-5 py-4 sm:px-6">{version && <><button type="button" onClick={() => onDelete(version.id)} className="mr-auto rounded-lg px-3 py-2.5 text-sm font-bold text-rose-600 outline-none hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-600">Delete</button><button type="button" onClick={() => onDuplicate(version.id)} className="rounded-lg border border-[#c5d2e5] px-3 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Duplicate</button><button type="button" onClick={() => onReschedule(version.id)} className="rounded-lg border border-[#c5d2e5] px-3 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Reschedule</button><button type="button" onClick={() => onEdit(version.id)} className="rounded-lg bg-[#0058bc] px-4 py-2.5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Edit Post</button></>}<button type="button" onClick={onClose} className="rounded-lg px-3 py-2.5 text-sm font-bold text-[#657080] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button></footer>
    </aside>
  </div>;
}

function DetailSection({ title, children, muted = false }: { title: string; children: React.ReactNode; muted?: boolean }) { return <section className={`rounded-xl border border-[#d3e4fe] p-4 sm:p-5 ${muted ? "bg-[#f1f5f9]" : "bg-white"}`}><h3 className="mb-4 text-sm font-extrabold text-[#0058bc]">{title}</h3>{children}</section>; }
function DetailItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div className="min-w-0"><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}</dt><dd className={`mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold text-[#0b1c30] ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</dd></div>; }
function Unavailable({ title, description }: { title: string; description: string }) { return <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-extrabold text-amber-900">{title}</p><p className="mt-1 text-sm leading-6 text-amber-800">{description}</p></div>; }
function formatDateOnly(value: string): string { try { return dateFormatter.format(parseLocalDate(value)); } catch { return value || "Unavailable"; } }
function formatTimestamp(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : timestampFormatter.format(date); }
