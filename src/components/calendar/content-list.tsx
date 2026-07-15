"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarWorkspaceHeader } from "@/components/calendar/calendar-workspace-header";
import { CalendarWorkspaceShell } from "@/components/calendar/calendar-workspace-shell";
import { GeneratedPostVisualPreview } from "@/components/calendar/generated-post-visual-preview";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { canEditContent } from "@/lib/calendar/content-mutation-policy";
import { approveGeneratedIdeas, filterContentWorkflow, generateIdeasFromDraft, readContentWorkflow, scheduleWorkflow, updateGeneratedIdeas, updateWorkflowSchedule } from "@/lib/calendar/content-workflow-store";
import { platformAssetTypes, platformOptions } from "@/lib/calendar/platform-options";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { ContentWorkflowFilters, ContentWorkflowItem, ContentWorkflowStage } from "@/lib/calendar/content-workflow-types";

const initialFilters: ContentWorkflowFilters = { query: "", source: "all", stage: "all" };
const fieldClass = "bp-field";

export function ContentList() {
  const [items, setItems] = useState<ContentWorkflowItem[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedId, setSelectedId] = useState<string>();
  const [hydrated, setHydrated] = useState(false);
  const visible = useMemo(() => filterContentWorkflow(items, filters), [items, filters]);
  const selected = items.find((item) => item.id === selectedId);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      const storedItems = readContentWorkflow(window.localStorage);
      const requestedId = new URLSearchParams(window.location.search).get("view");
      setItems(storedItems);
      if (requestedId && storedItems.some((item) => item.id === requestedId && (item.stage === "unscheduled" || item.stage === "scheduled"))) setSelectedId(requestedId);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  function replace(next: ContentWorkflowItem) {
    setItems((current) => [next, ...current.filter((item) => item.id !== next.id)]);
  }

  function act(action: (storage: Storage, item: ContentWorkflowItem) => ContentWorkflowItem) {
    if (!selected) return;
    replace(action(window.localStorage, selected));
  }

  function actAndClose(action: (storage: Storage, item: ContentWorkflowItem) => ContentWorkflowItem) {
    if (!selected) return;
    replace(action(window.localStorage, selected));
    setSelectedId(undefined);
  }

  return <>
    <CalendarWorkspaceShell header={<CalendarWorkspaceHeader variant="content-list" canCreate />}>
      <section aria-labelledby="content-list-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 id="content-list-heading" className="text-3xl font-extrabold">Content List</h2><p className="mt-2 text-sm text-[#657080]">Preview and edit Generated Ideas, approve them to generate content, then schedule the result.</p></div>
          <p className="text-sm font-bold text-[#0058bc]">{items.length} content item{items.length === 1 ? "" : "s"}</p>
        </div>
        <div className="mt-6 grid gap-3 rounded-xl border border-[#d3e4fe] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_190px_210px_auto]">
          <label><span className="sr-only">Search content</span><input value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search title, brand, or campaign" className={fieldClass} /></label>
          <Filter label="Source" value={filters.source} onChange={(value) => setFilters((current) => ({ ...current, source: value as ContentWorkflowFilters["source"] }))} options={[["all", "All Sources"], ["ai_plan", "AI Plan"], ["create_post", "Create Post"]]} />
          <Filter label="Stage" value={filters.stage} onChange={(value) => setFilters((current) => ({ ...current, stage: value as ContentWorkflowFilters["stage"] }))} options={[["all", "All Stages"], ...stageOptions]} />
          <button type="button" onClick={() => setFilters(initialFilters)} className="min-h-11 rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold text-[#414755] hover:bg-[#eff4ff]">Reset</button>
        </div>
        {!hydrated ? <Loading /> : visible.length ? <ContentTable items={visible} onPreview={setSelectedId} /> : <Empty hasItems={Boolean(items.length)} />}
      </section>
    </CalendarWorkspaceShell>
    {selected && <ContentPreview key={`${selected.id}:${selected.stage}`} item={selected} onClose={() => setSelectedId(undefined)} onChange={replace} act={act} actAndClose={actAndClose} />}
  </>;
}

function ContentTable({ items, onPreview }: { items: ContentWorkflowItem[]; onPreview: (id: string) => void }) {
  return <div className="mt-6 overflow-hidden rounded-xl border border-[#d3e4fe] bg-white">
    <div className="hidden grid-cols-[minmax(220px,1.5fr)_130px_minmax(180px,1fr)_150px_130px_100px] gap-4 border-b bg-[#eff4ff]/60 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#657080] lg:grid"><span>Content</span><span>Source</span><span>Brand / Campaign</span><span>Stage</span><span>Updated</span><span className="text-right">Action</span></div>
    <div className="divide-y divide-[#d3e4fe]">{items.map((item) => <article key={item.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(220px,1.5fr)_130px_minmax(180px,1fr)_150px_130px_100px] lg:items-center">
      <div className="min-w-0"><h3 className="truncate font-extrabold">{item.title}</h3><p className="mt-1 text-xs text-[#657080]">Owner: {item.ownerName}</p></div>
      <p className="text-sm font-semibold">{sourceLabel(item)}</p>
      <div className="text-sm"><p className="font-bold">{item.brandName || "No brand"}</p><p className="mt-1 truncate text-xs text-[#657080]">{item.campaignName || "No campaign"}</p></div>
      <StageBadge stage={item.stage} />
      <time className="text-sm text-[#657080]">{formatDate(item.updatedAt)}</time>
      {item.stage === "generated_ideas"
        ? <Link href={item.source === "ai_plan" ? `/calendar/ai-plan/${encodeURIComponent(item.id)}/ideas` : `/calendar/create-content/${encodeURIComponent(item.id)}/ideas`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] hover:bg-[#eff4ff] lg:justify-self-end">View Ideas</Link>
        : <button type="button" onClick={() => onPreview(item.id)} className="min-h-10 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] hover:bg-[#eff4ff] lg:justify-self-end">{item.stage === "unscheduled" || item.stage === "scheduled" ? "View Post" : "Preview"}</button>}
    </article>)}</div>
  </div>;
}

function ContentPreview({ item, onClose, onChange, act, actAndClose }: { item: ContentWorkflowItem; onClose: () => void; onChange: (item: ContentWorkflowItem) => void; act: (action: (storage: Storage, item: ContentWorkflowItem) => ContentWorkflowItem) => void; actAndClose: (action: (storage: Storage, item: ContentWorkflowItem) => ContentWorkflowItem) => void }) {
  const records = item.stage === "generated_ideas" ? item.ideas : item.drafts;
  const isPostDetails = item.stage === "unscheduled" || item.stage === "scheduled";
  const [schedulingRecordId, setSchedulingRecordId] = useState(item.drafts[0]?.id ?? "");
  const schedulingRecord = item.drafts.find((record) => record.id === schedulingRecordId) ?? item.drafts[0];
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState(() => scheduleValues(schedulingRecord));
  const [editingIdeas, setEditingIdeas] = useState(false);
  const [ideaDrafts, setIdeaDrafts] = useState<AiPlanDraftItem[]>(() => item.ideas.map((idea) => ({ ...idea, hashtags: [...idea.hashtags], conflicts: [...idea.conflicts] })));
  const scheduleComplete = item.drafts.length > 0 && item.drafts.every((record) => record.publishDate && record.publishTime);
  const ideasComplete = ideaDrafts.length > 0 && ideaDrafts.every((idea) => idea.title.trim() && idea.headline.trim() && idea.caption.trim());

  function chooseRecord(recordId: string) {
    const record = item.drafts.find((candidate) => candidate.id === recordId);
    if (!record) return;
    setSchedulingRecordId(recordId);
    setScheduleDraft(scheduleValues(record));
  }

  function saveSchedule() {
    if (!schedulingRecord) return;
    const next = updateWorkflowSchedule(window.localStorage, item, schedulingRecord.id, scheduleDraft);
    onChange(next); setScheduling(false);
  }

  function saveIdeas() {
    if (!ideasComplete) return;
    const next = updateGeneratedIdeas(window.localStorage, item, ideaDrafts);
    onChange(next);
    setIdeaDrafts(next.ideas.map((idea) => ({ ...idea, hashtags: [...idea.hashtags], conflicts: [...idea.conflicts] })));
    setEditingIdeas(false);
  }

  const footer = <>
    <button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold">Close</button>
    {item.stage === "idea_draft" && <Link href={`${item.source === "ai_plan" ? "/calendar/ai-plan/new" : "/calendar/content/new"}?edit=${encodeURIComponent(item.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0058bc] px-5 text-sm font-bold text-[#0058bc]">Edit Draft</Link>}
    {item.stage === "unscheduled" && <button type="button" onClick={() => setScheduling((value) => !value)} className="min-h-11 rounded-lg border border-[#0058bc] px-5 text-sm font-bold text-[#0058bc]">{scheduling ? "Cancel Scheduling" : "Schedule Date and Time"}</button>}
    {scheduling && <button type="button" onClick={saveSchedule} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">Save Schedule</button>}
    {item.stage === "idea_draft" && <button type="button" onClick={() => actAndClose((storage, current) => generateIdeasFromDraft(storage, current))} className="min-h-11 rounded-lg bg-emerald-700 px-5 text-sm font-bold text-white">Generate Ideas</button>}
    {item.stage === "generated_ideas" && !editingIdeas && canEditContent({ entityType: "content_work_item", stage: item.stage }) && <button type="button" onClick={() => setEditingIdeas(true)} className="min-h-11 rounded-lg border border-[#0058bc] px-5 text-sm font-bold text-[#0058bc]">Edit Generated Ideas</button>}
    {item.stage === "generated_ideas" && editingIdeas && <button type="button" onClick={() => { setIdeaDrafts(item.ideas.map((idea) => ({ ...idea, hashtags: [...idea.hashtags], conflicts: [...idea.conflicts] }))); setEditingIdeas(false); }} className="min-h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold">Cancel Editing</button>}
    {item.stage === "generated_ideas" && editingIdeas && <button type="button" disabled={!ideasComplete} onClick={saveIdeas} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white disabled:bg-[#a1a9b5]">Save Ideas</button>}
    {item.stage === "generated_ideas" && !editingIdeas && <button type="button" onClick={() => actAndClose((storage, current) => approveGeneratedIdeas(storage, current, "Sarah Jenkins"))} className="min-h-11 rounded-lg bg-emerald-700 px-5 text-sm font-bold text-white">Approve Ideas &amp; Generate Content</button>}
    {item.stage === "unscheduled" && scheduleComplete && !scheduling && <button type="button" onClick={() => act(scheduleWorkflow)} className="min-h-11 rounded-lg bg-emerald-700 px-5 text-sm font-bold text-white">Add to Calendar Grid</button>}
  </>;

  return <ResponsiveOverlayShell variant={isPostDetails ? "drawer" : "dialog"} eyebrow={isPostDetails ? "Content Details" : undefined} title={isPostDetails ? item.stage === "scheduled" ? "Scheduled Content" : "Generated Content" : item.title} description={`${sourceLabel(item)} · ${stageLabel(item.stage)}`} maxWidth={isPostDetails ? "max-w-[620px]" : "max-w-[900px]"} onClose={onClose} footer={footer}>
    {item.approvalNote && <div role="note" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm"><b>Previous generated ideas rejected:</b> {item.approvalNote}</div>}
    {!isPostDetails && <dl className="grid gap-3 sm:grid-cols-2"><Info label="Brand" value={item.brandName || "Not linked"} /><Info label="Campaign" value={item.campaignName || "Not linked"} /><Info label="Owner" value={item.ownerName} /><Info label="Stage" value={stageLabel(item.stage)} /></dl>}
    {editingIdeas ? <GeneratedIdeasEditor ideas={ideaDrafts} onChange={setIdeaDrafts} /> : scheduling && schedulingRecord ? <ScheduleEditor records={item.drafts} record={schedulingRecord} draft={scheduleDraft} onChoose={chooseRecord} onDraftChange={setScheduleDraft} /> : isPostDetails && item.drafts.length ? <PostDetailsView item={item} /> : records.length ? <div className="mt-6 grid gap-4">{records.map((record) => <ContentRecord key={record.id} record={record} />)}</div> : <DraftSourcePreview item={item} />}
  </ResponsiveOverlayShell>;
}

type ScheduleValues = ReturnType<typeof scheduleValues>;

function scheduleValues(record?: ContentWorkflowItem["drafts"][number]) {
  return { publishDate: record?.publishDate ?? "", publishTime: record?.publishTime ?? "" };
}

function GeneratedIdeasEditor({ ideas, onChange }: { ideas: AiPlanDraftItem[]; onChange: React.Dispatch<React.SetStateAction<AiPlanDraftItem[]>> }) {
  function update(index: number, values: Partial<AiPlanDraftItem>) {
    onChange((current) => current.map((idea, ideaIndex) => ideaIndex === index ? { ...idea, ...values } : idea));
  }

  return <div className="mt-6 grid gap-5">{ideas.map((idea, index) => <section key={idea.id} className="rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-extrabold">Generated Idea {index + 1}</h3><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0058bc]">Editable before approval</span></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <EditField label="Title"><input value={idea.title} onChange={(event) => update(index, { title: event.target.value })} className={fieldClass} /></EditField>
      <EditField label="Core Topic"><input value={idea.coreTopic} onChange={(event) => update(index, { coreTopic: event.target.value })} className={fieldClass} /></EditField>
      <EditField label="Platform"><select value={idea.platform} onChange={(event) => { const platform = event.target.value as AiPlanDraftItem["platform"]; update(index, { platform, assetType: platformAssetTypes[platform][0] }); }} className={fieldClass}>{platformOptions.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></EditField>
      <EditField label="Content Type"><select value={idea.assetType} onChange={(event) => update(index, { assetType: event.target.value })} className={fieldClass}>{platformAssetTypes[idea.platform].map((assetType) => <option key={assetType} value={assetType}>{formatContentLabel(assetType)}</option>)}</select></EditField>
      <EditField label="Headline"><input value={idea.headline} onChange={(event) => update(index, { headline: event.target.value })} className={fieldClass} /></EditField>
      <EditField label="CTA"><input value={idea.cta} onChange={(event) => update(index, { cta: event.target.value })} className={fieldClass} /></EditField>
      <div className="sm:col-span-2"><EditField label="Main Message"><textarea rows={3} value={idea.mainMessage} onChange={(event) => update(index, { mainMessage: event.target.value })} className={`${fieldClass} py-3`} /></EditField></div>
      <div className="sm:col-span-2"><EditField label="Caption / Body"><textarea rows={5} value={idea.caption} onChange={(event) => update(index, { caption: event.target.value })} className={`${fieldClass} py-3`} /></EditField></div>
      <div className="sm:col-span-2"><EditField label="Hashtags"><input value={idea.hashtags.join(" ")} onChange={(event) => update(index, { hashtags: event.target.value.split(/[\s,]+/).map((tag) => tag.replace(/^#/, "").trim()).filter(Boolean) })} placeholder="digitalmarketing brandstrategy" className={fieldClass} /></EditField></div>
      <div className="sm:col-span-2"><EditField label="Visual Brief"><textarea rows={3} value={idea.visualBrief} onChange={(event) => update(index, { visualBrief: event.target.value })} className={`${fieldClass} py-3`} /></EditField></div>
    </div>
  </section>)}</div>;
}

function ScheduleEditor({ records, record, draft, onChoose, onDraftChange }: { records: ContentWorkflowItem["drafts"]; record: ContentWorkflowItem["drafts"][number]; draft: ScheduleValues; onChoose: (id: string) => void; onDraftChange: React.Dispatch<React.SetStateAction<ScheduleValues>> }) {
  return <div className="mt-6 grid gap-4 rounded-xl border border-[#d3e4fe] p-4">{records.length > 1 && <EditField label="Content Item"><select value={record.id} onChange={(event) => onChoose(event.target.value)} className={fieldClass}>{records.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title} ({item.platform})</option>)}</select></EditField>}<div className="grid gap-4 sm:grid-cols-2"><EditField label="Schedule Date"><input type="date" value={draft.publishDate} onChange={(event) => onDraftChange((current) => ({ ...current, publishDate: event.target.value }))} className={fieldClass} /></EditField><EditField label="Schedule Time"><input type="time" value={draft.publishTime} onChange={(event) => onDraftChange((current) => ({ ...current, publishTime: event.target.value }))} className={fieldClass} /></EditField></div></div>;
}

function ContentRecord({ record }: { record: ContentWorkflowItem["drafts"][number] | ContentWorkflowItem["ideas"][number] }) {
  return <article className="rounded-xl border border-[#d3e4fe] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-extrabold">{record.title}</h3><span className="rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-bold text-[#0058bc]">{record.platform} · {record.assetType}</span></div><p className="mt-3 font-bold">{record.headline}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#657080]">{record.caption}</p><dl className="mt-4 grid gap-3 sm:grid-cols-2"><Info label="CTA" value={record.cta || "Not set"} /><Info label="Hashtags" value={record.hashtags.length ? record.hashtags.map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" ") : "Not set"} /><Info label="Visual Brief" value={record.visualBrief || "Not set"} /><Info label="Schedule" value={record.publishDate && record.publishTime ? `${record.publishDate} at ${record.publishTime} (${record.timezone})` : "Unscheduled"} /></dl></article>;
}

function PostDetailsView({ item }: { item: ContentWorkflowItem }) {
  return <div className="grid gap-6">
    <StageBadge stage={item.stage} />
    <dl className="grid gap-5"><DetailInfo label="Brand" value={item.brandName || "No brand"} /><DetailInfo label="Campaign" value={item.campaignName || "No campaign"} /><DetailInfo label="Owner" value={item.ownerName} /></dl>
    {item.drafts.map((record, index) => <section key={record.id} aria-labelledby={`post-detail-${record.id}`} className={`${index ? "border-t border-[#d3e4fe] pt-6" : ""}`}>
      {item.drafts.length > 1 && <p id={`post-detail-${record.id}`} className="mb-5 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#0058bc]">Post {index + 1} of {item.drafts.length}</p>}
      <dl className="grid gap-5"><DetailInfo label="Date" value={record.publishDate ? formatPublishDate(record.publishDate) : "Not scheduled"} /><DetailInfo label="Platform" value={formatContentLabel(record.platform)} /><DetailInfo label="Asset Type" value={formatContentLabel(record.assetType)} /><DetailInfo label="Publish Time" value={record.publishTime || "Not scheduled"} /><DetailInfo label="Core Topic" value={record.coreTopic || record.title} /></dl>
      <div className="mt-5"><GeneratedPostVisualPreview platform={record.platform} assetType={record.assetType} brandName={item.brandName} headline={record.headline || record.coreTopic || record.title} caption={record.caption || record.mainMessage} cta={record.cta} hashtags={record.hashtags} visualBrief={record.visualBrief} status={item.stage} publishTime={record.publishTime} /></div>
    </section>)}
  </div>;
}

function DraftSourcePreview({ item }: { item: ContentWorkflowItem }) {
  if (item.aiRequest) return <section className="mt-6 rounded-xl border border-[#d3e4fe] p-5"><h3 className="font-extrabold">AI Planning Brief</h3><dl className="mt-4 grid gap-3 sm:grid-cols-2"><Info label="Period" value={`${item.aiRequest.startDate} – ${item.aiRequest.endDate}`} /><Info label="Requested Posts" value={String(item.aiRequest.numberOfPosts)} /><Info label="Platforms" value={item.aiRequest.platforms.join(", ")} /><Info label="Objective" value={item.aiRequest.objective} /><Info label="Target Audience" value={item.aiRequest.targetAudience} /><Info label="Tone of Voice" value={item.aiRequest.toneOfVoice} /></dl></section>;
  if (item.manualInput) return <section className="mt-6 rounded-xl border border-[#d3e4fe] p-5"><h3 className="font-extrabold">Create Post Draft</h3><p className="mt-2 text-sm text-[#657080]">{item.manualInput.idea.coreTopic}</p><dl className="mt-4 grid gap-3 sm:grid-cols-2"><Info label="Objective" value={item.manualInput.idea.objective} /><Info label="Target Audience" value={item.manualInput.idea.targetAudience} /><Info label="Main Message" value={item.manualInput.idea.mainMessage} /><Info label="Platforms" value={item.manualInput.versions.map((version) => version.platform).join(", ")} /></dl></section>;
  return <div className="mt-6 rounded-xl border border-dashed border-[#c5d2e5] p-6 text-sm text-[#657080]">No source details are available.</div>;
}

const stageOptions: Array<[ContentWorkflowStage, string]> = [["idea_draft", "Idea Draft"], ["generated_ideas", "Generated Ideas"], ["unscheduled", "Unscheduled"], ["scheduled", "Scheduled"]];
function stageLabel(stage: ContentWorkflowStage) { return stageOptions.find(([value]) => value === stage)?.[1] ?? stage; }
function sourceLabel(item: ContentWorkflowItem) { return item.source === "ai_plan" ? "AI Plan" : "Create Post"; }
function StageBadge({ stage }: { stage: ContentWorkflowStage }) { const tone = stage === "scheduled" ? "bg-emerald-50 text-emerald-800" : stage === "unscheduled" ? "bg-violet-50 text-violet-800" : stage === "generated_ideas" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"; return <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${tone}`}>{stageLabel(stage)}</span>; }
function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) { return <label><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-[#f8faff] p-4"><dt className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>; }
function DetailInfo({ label, value }: { label: string; value: string }) { return <div><dt className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</dt><dd className="mt-1 text-sm font-semibold leading-6 text-[#0b1c30]">{value}</dd></div>; }
function EditField({ label, children }: { label: string; children: React.ReactNode }) { return <label><span className="mb-2 block text-xs font-extrabold uppercase tracking-[.1em] text-[#657080]">{label}</span>{children}</label>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }
function formatPublishDate(value: string) { const [year, month, day] = value.split("-").map(Number); return new Intl.DateTimeFormat("en", { weekday: "short", month: "long", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day)); }
function formatContentLabel(value: string) { return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function Loading() { return <div role="status" className="mt-6 animate-pulse rounded-xl border bg-white p-6"><span className="sr-only">Loading content list</span><div className="h-6 w-48 rounded bg-slate-200" /><div className="mt-4 h-24 rounded bg-slate-100" /></div>; }
function Empty({ hasItems }: { hasItems: boolean }) { return <section className="mt-6 rounded-xl border border-dashed border-[#c5d2e5] bg-white p-10 text-center"><h3 className="text-lg font-extrabold">{hasItems ? "No content matches these filters" : "No content work yet"}</h3><p className="mt-2 text-sm text-[#657080]">{hasItems ? "Try resetting the filters." : "Save an Idea Draft to automatically create Generated Ideas."}</p>{!hasItems && <div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/calendar/ai-plan/new" className="inline-flex min-h-11 items-center rounded-lg border border-[#0058bc] px-5 text-sm font-bold text-[#0058bc]">AI Plan Content</Link><Link href="/calendar/content/new" className="inline-flex min-h-11 items-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">Create Post</Link></div>}</section>; }
