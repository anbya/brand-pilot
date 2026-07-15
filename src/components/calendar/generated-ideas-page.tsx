"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { approveGeneratedIdeas, readContentWorkflow, updateGeneratedIdeas } from "@/lib/calendar/content-workflow-store";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { formatAssetTypeLabel, formatPlatformLabel, platformAssetTypes, platformOptions } from "@/lib/calendar/platform-options";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { ContentWorkflowItem } from "@/lib/calendar/content-workflow-types";
import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { getPlanningBriefPermissions } from "@/lib/calendar/planning-brief-permissions";

const inputClass = "min-h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100";

export function GeneratedIdeasPage({ workflowId, source = "ai_plan" }: { workflowId: string; source?: ContentWorkflowItem["source"] }) {
  const router = useRouter();
  const [item, setItem] = useState<ContentWorkflowItem>();
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState<AiPlanDraftItem>();

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      setItem(readContentWorkflow(window.localStorage).find((candidate) => candidate.id === workflowId && candidate.source === source));
      setReady(true);
    });
    return () => { active = false; };
  }, [workflowId, source]);

  function beginEdit(idea: AiPlanDraftItem) {
    if (item?.stage !== "generated_ideas") return;
    setEditingId(idea.id);
    setDraft(cloneIdea(idea));
  }

  function cancelEdit() {
    setEditingId(undefined);
    setDraft(undefined);
  }

  function saveIdea() {
    if (!item || !draft || !isComplete(draft)) return;
    const ideas = item.ideas.map((idea) => idea.id === draft.id ? cloneIdea(draft) : idea);
    const next = updateGeneratedIdeas(window.localStorage, item, ideas);
    setItem(next);
    cancelEdit();
  }

  function approveIdeas() {
    if (!item || item.stage !== "generated_ideas" || editingId) return;
    const next = approveGeneratedIdeas(window.localStorage, item, item.ownerName);
    if (next.stage !== "unscheduled") return;
    router.push(`/calendar/content?view=${encodeURIComponent(next.id)}`);
  }

  if (!ready) return <PageFrame><Loading /></PageFrame>;
  if (!item) return <PageFrame><Unavailable title="Generated Ideas not found" description={source === "create_post" ? "The requested Create Content draft or Generated Ideas plan is unavailable." : "The requested AI Plan result is unavailable or has been removed."} /></PageFrame>;
  if (source === "create_post") return <ManualGeneratedIdeas item={item} onApprove={approveIdeas} />;
  if (item.stage !== "generated_ideas") return <PageFrame><Unavailable title={item.stage === "unscheduled" || item.stage === "scheduled" ? "Content already generated" : "Generated Ideas unavailable"} description={item.stage === "unscheduled" || item.stage === "scheduled" ? "These ideas have already been approved and converted into Generated Content." : "This workflow item is not ready for Generated Ideas review."} actionHref={`/calendar/content?view=${encodeURIComponent(item.id)}`} actionLabel={item.stage === "unscheduled" || item.stage === "scheduled" ? "View Generated Content" : "Back to Content List"} /></PageFrame>;

  const conflictCount = item.ideas.reduce((total, idea) => total + idea.conflicts.length, 0);
  return <PageFrame>
    <header className="flex flex-col gap-4 border-b border-[#d3e4fe] px-5 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between">
      <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0058bc]">Generated Ideas</p><h1 className="mt-2 text-3xl font-extrabold">AI Draft Content Plan</h1><p className="mt-2 text-sm text-[#657080]">{item.title}</p><p className="mt-1 text-xs font-semibold text-[#657080]">{item.ideas.length} planned post{item.ideas.length === 1 ? "" : "s"} · {conflictCount} conflict{conflictCount === 1 ? "" : "s"}</p></div>
      <Link href="/calendar/content" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold text-[#414755] hover:bg-[#eff4ff]">Back to Content List</Link>
    </header>
    <div className="p-4 sm:p-6">
      <dl className="mb-5 grid gap-3 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="Brand" value={item.brandName || "Not linked"} /><Meta label="Campaign" value={item.campaignName || "Not linked"} /><Meta label="Owner" value={item.ownerName} /><Meta label="Status" value="Editable before approval" />
      </dl>
      <div className="overflow-x-auto rounded-xl border border-[#d3e4fe]">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[#eff4ff]"><tr className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#0b1c30]"><th className="px-4 py-3">Date &amp; Time</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Pillar</th><th className="px-4 py-3">Platform / Format</th><th className="px-4 py-3">Objective</th><th className="px-4 py-3">Conflict</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#d3e4fe] bg-white">{item.ideas.map((idea) => <IdeaRow key={idea.id} idea={idea} editing={editingId === idea.id} draft={editingId === idea.id ? draft : undefined} onEdit={() => beginEdit(idea)} onDraft={setDraft} onCancel={cancelEdit} onSave={saveIdea} />)}</tbody>
        </table>
      </div>
      {!item.ideas.length && <div className="rounded-xl border border-dashed border-[#c5d2e5] p-8 text-center"><h2 className="font-extrabold">No Generated Ideas</h2><p className="mt-2 text-sm text-[#657080]">Return to AI Plan Content and generate the plan again.</p></div>}
    </div>
    <footer className="sticky bottom-0 flex flex-col gap-3 border-t border-[#d3e4fe] bg-[#f8faff]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <p className="text-sm text-[#657080]">Review and save any edits before approving all ideas. Scheduling starts after content generation.</p>
      <button type="button" disabled={!item.ideas.length || Boolean(editingId)} onClick={approveIdeas} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none disabled:cursor-not-allowed disabled:bg-[#a1a9b5] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">Approve Ideas &amp; Generate Content</button>
    </footer>
  </PageFrame>;
}

function ManualGeneratedIdeas({ item, onApprove }: { item: ContentWorkflowItem; onApprove: () => void }) {
  const editable = item.stage === "generated_ideas" && item.generationLifecycle === "generated_ideas";
  const contentGenerated = item.stage === "unscheduled" || item.stage === "scheduled";
  const permissions = getPlanningBriefPermissions(dashboardMockData.user.role);
  const query = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const highlighted = query.get("edited");
  const saved = query.get("saved") === "1";
  const brandName = item.brandName?.trim() || dashboardMockData.brands.find((brand) => brand.id === item.brandId)?.name || "Not specified";
  const campaignName = item.campaignName?.trim() || dashboardMockData.campaigns.find((campaign) => campaign.id === item.campaignId)?.name || "Not linked";
  const owner = item.ideas.find((idea) => idea.createdBy)?.createdBy || item.ownerName || "Not specified";
  const status = contentGenerated ? "Content generated" : item.generationLifecycle === "generating_content" ? "Generating content" : item.generationLifecycle === "approved" ? "Approved" : "Editable before approval";
  const valid = item.ideas.length > 0 && item.ideas.every(isCompleteManualIdea);

  if (!item.manualInput) return <PageFrame><Unavailable title="Create Content draft not found" description="The source draft for these Generated Ideas is unavailable." /></PageFrame>;
  if (item.stage === "idea_draft") return <PageFrame><Unavailable title="Generated Ideas are not ready" description="Return to Create Content and complete the Review step to generate ideas." actionHref={`/calendar/content/new?edit=${encodeURIComponent(item.id)}`} actionLabel="Back to Edit" /></PageFrame>;
  if (item.generationLifecycle === "generation_failed") return <PageFrame><Unavailable title="Content generation failed" description="Your Generated Ideas are saved. Return to edit them or try content generation again." actionHref={`/calendar/content/new?editIdea=${encodeURIComponent(item.id)}`} actionLabel="Back to Edit" /><div className="pb-8 text-center"><button type="button" onClick={onApprove} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">Try Again</button></div></PageFrame>;

  return <PageFrame>
    <header className="flex flex-col gap-4 border-b border-[#d3e4fe] px-5 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between">
      <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0058bc]">Generated Ideas</p><h1 className="mt-2 text-3xl font-extrabold">Generated Content Ideas</h1><p className="mt-2 text-sm text-[#657080]">{item.manualInput?.idea.coreTopic || item.title}</p><p className="mt-1 text-xs font-semibold text-[#657080]">{item.ideas.length} generated idea{item.ideas.length === 1 ? "" : "s"}</p></div>
      <Link href="/calendar/content" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold text-[#414755] hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Back to Content List</Link>
    </header>
    <div className="p-4 sm:p-6">
      <dl className="mb-5 grid gap-3 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><Meta label="Brand" value={brandName} /><Meta label="Campaign" value={campaignName} /><Meta label="Owner" value={owner} /><Meta label="Status" value={status} /></dl>
      <p aria-live="polite" className="mb-3 min-h-5 text-sm font-bold text-emerald-700">{saved ? "Generated idea changes saved." : ""}</p>
      {!valid && item.ideas.length > 0 && <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Generated Ideas contain invalid form data. Edit each incomplete idea before approval.</div>}
      {item.ideas.length ? <><div className="hidden overflow-x-auto rounded-xl border border-[#d3e4fe] md:block"><table aria-label="Generated content ideas" className="w-full min-w-[820px] border-collapse text-left text-sm"><caption className="sr-only">Generated content ideas from {item.title}</caption><thead className="bg-[#eff4ff]"><tr className="text-[11px] font-extrabold uppercase tracking-[.08em]"><th className="px-4 py-3">Idea Title</th><th className="px-4 py-3">Platform / Format</th><th className="px-4 py-3">Pillar</th><th className="px-4 py-3">Objective</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-[#d3e4fe]">{item.ideas.map((idea) => <ManualIdeaRow key={idea.id} item={item} idea={idea} editable={editable && permissions.canEdit} highlighted={highlighted === idea.id} />)}</tbody></table></div><div className="grid gap-3 md:hidden">{item.ideas.map((idea) => <ManualIdeaCard key={idea.id} item={item} idea={idea} editable={editable && permissions.canEdit} highlighted={highlighted === idea.id} />)}</div></> : <div className="rounded-xl border border-dashed border-[#c5d2e5] p-8 text-center"><h2 className="font-extrabold">No Generated Ideas</h2><p className="mt-2 text-sm text-[#657080]">Return to Create Content and select at least one platform.</p><Link href={`/calendar/content/new?editIdea=${encodeURIComponent(item.id)}`} className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#0058bc] px-5 font-bold text-white">Back to Edit</Link></div>}
    </div>
    <footer className="sticky bottom-0 flex flex-col gap-3 border-t border-[#d3e4fe] bg-[#f8faff]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7"><p className="text-sm text-[#657080]">Review and save any edits before approving all ideas.<br />Content generation starts after approval.</p>{contentGenerated ? <Link href={`/calendar/content?view=${encodeURIComponent(item.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">View Generated Content</Link> : editable && permissions.canApprove && valid ? <button type="button" onClick={onApprove} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">Approve Ideas &amp; Generate Content</button> : null}</footer>
  </PageFrame>;
}

function ManualIdeaRow({ item, idea, editable, highlighted }: { item: ContentWorkflowItem; idea: AiPlanDraftItem; editable: boolean; highlighted: boolean }) {
  const pillar = initialCalendarState.pillars.find((candidate) => candidate.id === idea.pillarId)?.name ?? formatAssetTypeLabel(idea.pillarId);
  return <tr id={`idea-${idea.id}`} className={highlighted ? "bg-emerald-50 ring-2 ring-inset ring-emerald-400" : ""}><td className="max-w-[280px] px-4 py-4 font-extrabold">{idea.title}</td><td className="px-4 py-4"><span className="block font-semibold">{formatPlatformLabel(idea.platform)}</span><span className="mt-1 block text-xs text-[#657080]">{formatAssetTypeLabel(idea.assetType)}</span></td><td className="px-4 py-4 font-semibold">{pillar}</td><td className="px-4 py-4 font-semibold">{formatAssetTypeLabel(idea.objective)}</td><td className="px-4 py-4 font-bold text-[#0058bc]">{editable ? "Editable" : "Approved"}</td><td className="px-4 py-4">{editable && <Link href={`/calendar/content/new?editIdea=${encodeURIComponent(item.id)}&idea=${encodeURIComponent(idea.id)}`} className="inline-flex min-h-10 items-center rounded-lg px-3 font-bold text-[#0058bc] hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Edit</Link>}</td></tr>;
}

function ManualIdeaCard({ item, idea, editable, highlighted }: { item: ContentWorkflowItem; idea: AiPlanDraftItem; editable: boolean; highlighted: boolean }) {
  const pillar = initialCalendarState.pillars.find((candidate) => candidate.id === idea.pillarId)?.name ?? formatAssetTypeLabel(idea.pillarId);
  return <article id={`idea-${idea.id}`} className={`rounded-xl border p-4 ${highlighted ? "border-emerald-400 bg-emerald-50" : "border-[#d3e4fe]"}`}><div className="flex items-start justify-between gap-3"><h2 className="font-extrabold">{idea.title}</h2>{editable && <Link href={`/calendar/content/new?editIdea=${encodeURIComponent(item.id)}&idea=${encodeURIComponent(idea.id)}`} className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-bold text-[#0058bc] focus-visible:ring-2">Edit</Link>}</div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><Meta label="Platform / Format" value={`${formatPlatformLabel(idea.platform)} · ${formatAssetTypeLabel(idea.assetType)}`} /><Meta label="Pillar" value={pillar} /><Meta label="Objective" value={formatAssetTypeLabel(idea.objective)} /><Meta label="Status" value={editable ? "Editable" : "Approved"} /></dl></article>;
}

function isCompleteManualIdea(idea: AiPlanDraftItem) { return Boolean(idea.title.trim() && idea.coreTopic.trim() && idea.pillarId.trim() && idea.targetAudience.trim() && idea.mainMessage.trim() && idea.assetType.trim() && idea.headline.trim() && idea.caption.trim() && idea.cta.trim() && idea.createdBy?.trim()); }

function IdeaRow({ idea, editing, draft, onEdit, onDraft, onCancel, onSave }: { idea: AiPlanDraftItem; editing: boolean; draft?: AiPlanDraftItem; onEdit: () => void; onDraft: React.Dispatch<React.SetStateAction<AiPlanDraftItem | undefined>>; onCancel: () => void; onSave: () => void }) {
  const pillar = initialCalendarState.pillars.find((candidate) => candidate.id === idea.pillarId)?.name ?? formatAssetTypeLabel(idea.pillarId);
  return <>
    <tr className={editing ? "bg-blue-50/40" : undefined}>
      <td className="whitespace-nowrap px-4 py-4 font-semibold"><span className="block">{formatDate(idea.publishDate)}</span><span className="mt-1 block text-xs text-[#657080]">{idea.publishTime || "Time not planned"}</span></td>
      <td className="max-w-[260px] px-4 py-4"><span className="font-extrabold">{idea.title}</span>{idea.isPromotional && <span className="mt-1 block text-[10px] font-extrabold uppercase text-rose-600">Promotional</span>}</td>
      <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-[#2d6cdf]" />{pillar}</span></td>
      <td className="px-4 py-4"><span className="block font-semibold">{formatPlatformLabel(idea.platform)}</span><span className="mt-1 block text-xs text-[#657080]">{formatAssetTypeLabel(idea.assetType)}</span></td>
      <td className="px-4 py-4 font-semibold">{formatAssetTypeLabel(idea.objective)}</td>
      <td className="px-4 py-4"><span className={`font-bold ${idea.conflicts.length ? "text-rose-700" : "text-emerald-700"}`}>{idea.conflicts.length ? `${idea.conflicts.length} issue${idea.conflicts.length === 1 ? "" : "s"}` : "Clear"}</span></td>
      <td className="px-4 py-4"><button type="button" disabled={editing} onClick={onEdit} className="min-h-10 rounded-lg px-3 text-sm font-bold text-[#0058bc] outline-none hover:bg-[#eff4ff] disabled:text-[#8b96a5] focus-visible:ring-2 focus-visible:ring-[#0058bc]">{editing ? "Editing" : "Edit"}</button></td>
    </tr>
    {editing && draft && <tr><td colSpan={7} className="bg-[#f8faff] p-4 sm:p-5"><IdeaEditor idea={draft} onChange={(values) => onDraft((current) => current ? { ...current, ...values } : current)} /><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="min-h-11 rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold">Cancel</button><button type="button" disabled={!isComplete(draft)} onClick={onSave} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white disabled:bg-[#a1a9b5]">Save Idea</button></div></td></tr>}
  </>;
}

function IdeaEditor({ idea, onChange }: { idea: AiPlanDraftItem; onChange: (values: Partial<AiPlanDraftItem>) => void }) {
  return <div><h2 className="mb-4 text-lg font-extrabold">Edit Generated Idea</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Field label="Title"><input value={idea.title} onChange={(event) => onChange({ title: event.target.value })} className={inputClass} /></Field>
    <Field label="Core Topic"><input value={idea.coreTopic} onChange={(event) => onChange({ coreTopic: event.target.value })} className={inputClass} /></Field>
    <Field label="Objective"><select value={idea.objective} onChange={(event) => onChange({ objective: event.target.value as AiPlanDraftItem["objective"] })} className={inputClass}><option value="educate">Educate</option><option value="engage">Engage</option><option value="inform">Inform</option><option value="sell">Sell</option></select></Field>
    <Field label="Platform"><select value={idea.platform} onChange={(event) => { const platform = event.target.value as AiPlanDraftItem["platform"]; onChange({ platform, assetType: platformAssetTypes[platform][0] }); }} className={inputClass}>{platformOptions.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></Field>
    <Field label="Content Type"><select value={idea.assetType} onChange={(event) => onChange({ assetType: event.target.value })} className={inputClass}>{platformAssetTypes[idea.platform].map((assetType) => <option key={assetType} value={assetType}>{formatAssetTypeLabel(assetType)}</option>)}</select></Field>
    <Field label="Headline"><input value={idea.headline} onChange={(event) => onChange({ headline: event.target.value })} className={inputClass} /></Field>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="Main Message"><textarea rows={3} value={idea.mainMessage} onChange={(event) => onChange({ mainMessage: event.target.value })} className={`${inputClass} py-3`} /></Field></div>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="Caption / Body"><textarea rows={4} value={idea.caption} onChange={(event) => onChange({ caption: event.target.value })} className={`${inputClass} py-3`} /></Field></div>
    <Field label="CTA"><input value={idea.cta} onChange={(event) => onChange({ cta: event.target.value })} className={inputClass} /></Field>
    <div className="sm:col-span-2"><Field label="Hashtags"><input value={idea.hashtags.join(" ")} onChange={(event) => onChange({ hashtags: event.target.value.split(/[\s,]+/).map((tag) => tag.replace(/^#/, "").trim()).filter(Boolean) })} className={inputClass} /></Field></div>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="Visual Brief"><textarea rows={3} value={idea.visualBrief} onChange={(event) => onChange({ visualBrief: event.target.value })} className={`${inputClass} py-3`} /></Field></div>
  </div></div>;
}

function PageFrame({ children }: { children: React.ReactNode }) { return <main className="min-h-screen bg-[#f3f6fc] px-3 py-5 text-[#0b1c30] sm:px-6 lg:px-10 lg:py-8"><section className="mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-[#cbdaf0] bg-white shadow-sm">{children}</section></main>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label><span className="mb-2 block text-xs font-extrabold uppercase tracking-[.08em] text-[#657080]">{label}</span>{children}</label>; }
function Meta({ label, value }: { label: string; value: string }) { return <div><dt className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8b96a5]">{label}</dt><dd className="mt-1.5 font-bold">{value}</dd></div>; }
function Loading() { return <div role="status" className="p-8"><p className="font-bold text-[#657080]">Loading Generated Ideas…</p></div>; }
function Unavailable({ title, description, actionHref = "/calendar/content", actionLabel = "Back to Content List" }: { title: string; description: string; actionHref?: string; actionLabel?: string }) { return <div className="p-8 text-center sm:p-12"><h1 className="text-2xl font-extrabold">{title}</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#657080]">{description}</p><Link href={actionHref} className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">{actionLabel}</Link></div>; }
function cloneIdea(idea: AiPlanDraftItem): AiPlanDraftItem { return { ...idea, hashtags: [...idea.hashtags], conflicts: [...idea.conflicts] }; }
function isComplete(idea: AiPlanDraftItem) { return Boolean(idea.title.trim() && idea.coreTopic.trim() && idea.headline.trim() && idea.caption.trim()); }
function formatDate(value: string) { if (!value) return "Not planned"; const [year, month, day] = value.split("-").map(Number); return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day)); }
