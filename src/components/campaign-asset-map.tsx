"use client";

import { useEffect, useMemo, useState } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import type { SocialPlatformLabel } from "@/lib/platforms";

export type ContentAsset = {
  id: string;
  campaignDayId: string;
  platform: SocialPlatformLabel;
  assetType: string;
  coreTopic: string;
  caption?: string;
  status: "BLUEPRINT" | "GENERATING" | "READY";
  publishTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignDay = { id: string; campaignId: string; dayNumber: number; scheduledDate: string; assets: ContentAsset[] };
type WorkflowStatus = ContentAsset["status"] | "PUBLISHED" | "ARCHIVED";
type WorkflowAsset = Omit<ContentAsset, "status"> & { status: WorkflowStatus };
type WorkflowDay = Omit<CampaignDay, "assets"> & { assets: WorkflowAsset[] };
type WorkflowRow = WorkflowAsset & { dayNumber: number; scheduledDate: string };
type DayGroup = { dayNumber: number; scheduledDate: string; assets: WorkflowRow[] };
type ViewMode = "list" | "calendar";
type FilterValue = "ALL" | Extract<WorkflowStatus, "BLUEPRINT" | "READY" | "PUBLISHED">;
type EditableAssetFields = Pick<WorkflowAsset, "platform" | "assetType" | "publishTime" | "coreTopic" | "caption">;
const platformAssetTypes: Record<SocialPlatformLabel, string[]> = {
  Instagram: ["Carousel", "Reel", "Story", "Single Image Post", "Poll Story"],
  TikTok: ["Short Video", "Tutorial Video", "Product Demo", "Behind the Scenes"],
  YouTube: ["Shorts", "Long-form Video", "Tutorial", "Explainer Video"],
  Facebook: ["Single Image Post", "Carousel", "Video", "Story", "Poll"],
};
const editablePlatforms = Object.keys(platformAssetTypes) as SocialPlatformLabel[];

export function CampaignAssetMap({ initialDays }: { initialDays: CampaignDay[] }) {
  const [days, setDays] = useState<WorkflowDay[]>(initialDays);
  const [view, setView] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [daySheetDate, setDaySheetDate] = useState<string | null>(null);
  const initialMonth = parseLocalDate(initialDays[0]?.scheduledDate ?? toISODate(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const rows = useMemo(() => days.flatMap((day) => day.assets.map((asset) => ({ ...asset, dayNumber: day.dayNumber, scheduledDate: day.scheduledDate }))), [days]);
  const filteredRows = useMemo(() => filter === "ALL" ? rows : rows.filter((row) => row.status === filter), [filter, rows]);
  const selected = selectedKey ? rows.find((row) => rowKey(row) === selectedKey) ?? null : null;

  useEffect(() => {
    function approveAllBlueprints() {
      setDays((current) => current.map((day) => ({ ...day, assets: day.assets.map((asset) => asset.status === "BLUEPRINT" ? { ...asset, status: "GENERATING" } : asset) })));
      window.setTimeout(() => {
        setDays((current) => current.map((day) => ({ ...day, assets: day.assets.map((asset) => asset.status === "GENERATING" ? { ...asset, status: isPublishDue(day.scheduledDate, asset.publishTime) ? "PUBLISHED" : "READY" } : asset) })));
      }, 1800);
    }
    window.addEventListener("campaign-approve-blueprints", approveAllBlueprints);
    return () => window.removeEventListener("campaign-approve-blueprints", approveAllBlueprints);
  }, []);

  useEffect(() => {
    function publishDueAssets() {
      setDays((current) => current.map((day) => ({ ...day, assets: day.assets.map((asset) => asset.status === "READY" && isPublishDue(day.scheduledDate, asset.publishTime) ? { ...asset, status: "PUBLISHED" } : asset) })));
    }
    publishDueAssets();
    const timer = window.setInterval(publishDueAssets, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  function moveTo(status: WorkflowStatus) {
    if (!selectedKey) return;
    setDays((current) => current.map((day) => ({ ...day, assets: day.assets.map((asset) => asset.id === selectedKey ? { ...asset, status } : asset) })));
    setSelectedKey(null);
  }

  function deleteSelected() {
    if (!selectedKey) return;
    setDays((current) => current.map((day) => ({ ...day, assets: day.assets.filter((asset) => asset.id !== selectedKey) })).filter((day) => day.assets.length > 0));
    setSelectedKey(null);
  }

  function updateAsset(assetId: string, changes: EditableAssetFields) {
    setDays((current) => current.map((day) => ({
      ...day,
      assets: day.assets.map((asset) => asset.id === assetId ? { ...asset, ...changes } : asset),
    })));
  }

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-[#d3e4fe]/70 bg-white px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="text-xl font-bold text-[#0b1c30]">Content Asset Map</h2>
          <div className="flex rounded-lg bg-[#eff4ff] p-1" role="tablist" aria-label="Content asset view">
            <TabButton active={view === "list"} onClick={() => setView("list")}>List View</TabButton>
            <TabButton active={view === "calendar"} onClick={() => setView("calendar")}>Calendar View</TabButton>
          </div>
        </div>
        <label className="flex w-fit items-center gap-2 text-sm font-semibold text-[#717786]">Filter:
          <select aria-label="Filter assets by status" value={filter} onChange={(event) => setFilter(event.target.value as FilterValue)} className="rounded-lg border border-[#d3e4fe] bg-white px-3 py-2 text-sm font-bold text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">
            <option value="ALL">All Stages</option><option value="BLUEPRINT">Blueprint</option><option value="READY">Ready</option><option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      {view === "list" ? <ListView rows={filteredRows} onOpen={(row) => setSelectedKey(rowKey(row))} /> : <ContentAssetCalendarView rows={filteredRows} allRowsCount={rows.length} month={visibleMonth} onMonthChange={setVisibleMonth} onOpen={(row) => setSelectedKey(rowKey(row))} onOpenDay={setDaySheetDate} />}

      {daySheetDate && <DayAssetsSheet date={daySheetDate} rows={filteredRows.filter((row) => row.scheduledDate === daySheetDate)} onClose={() => setDaySheetDate(null)} onOpen={(row) => { setDaySheetDate(null); setSelectedKey(rowKey(row)); }} />}
      {selectedKey && (selected ? <AssetDetailSheet row={selected} onClose={() => setSelectedKey(null)} onMove={moveTo} onDelete={deleteSelected} onSave={(changes) => updateAsset(selected.id, changes)} /> : <MissingPostDrawer selectedId={selectedKey} onClose={() => setSelectedKey(null)} />)}
    </>
  );
}

export function ApproveAllBlueprintsButton() {
  const [approved, setApproved] = useState(false);

  function approve() {
    if (approved) return;
    setApproved(true);
    window.dispatchEvent(new Event("campaign-approve-blueprints"));
  }

  return <button type="button" disabled={approved} onClick={approve} className="rounded-lg bg-[#0058bc] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-[#aab8ca] disabled:text-white disabled:shadow-none">{approved ? "Blueprints Approved" : "Approve All Blueprints"}</button>;
}

function ListView({ rows, onOpen }: { rows: WorkflowRow[]; onOpen: (row: WorkflowRow) => void }) {
  const groups = groupRowsByDay(rows);
  return <div><div className="hidden grid-cols-[1fr_2fr] gap-4 bg-[#eff4ff]/70 px-6 py-4 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#717786] md:grid"><span>Schedule</span><span>Core Topic</span></div>{groups.map((group) => <DayGroupList key={group.scheduledDate} group={group} onOpen={onOpen} />)}{!groups.length && <EmptyState text="No matching assets." />}</div>;
}

function ContentAssetCalendarView({ rows, allRowsCount, month, onMonthChange, onOpen, onOpenDay }: { rows: WorkflowRow[]; allRowsCount: number; month: Date; onMonthChange: (month: Date) => void; onOpen: (row: WorkflowRow) => void; onOpenDay: (date: string) => void }) {
  const cells = buildCalendarCells(month);
  const monthRows = rows.filter((row) => isSameMonth(parseLocalDate(row.scheduledDate), month));
  const emptyText = allRowsCount > 0 && !rows.length ? "No matching assets." : "No assets scheduled this month.";
  return <div>
    <CalendarHeader month={month} onPrevious={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))} onNext={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))} onToday={() => { const today = new Date(); onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1)); }} />
    <div className="hidden md:block"><div className="grid grid-cols-7 border-y border-[#d3e4fe]/70 bg-[#eff4ff]/50">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="px-2 py-3 text-center text-[11px] font-extrabold uppercase tracking-[.12em] text-[#717786]">{day}</div>)}</div><div className="grid grid-cols-7 bg-[#d3e4fe]/70 gap-px">{cells.map((date) => <CalendarDayCell key={toISODate(date)} date={date} currentMonth={month} rows={rows.filter((row) => row.scheduledDate === toISODate(date))} onOpen={onOpen} onOpenDay={onOpenDay} />)}</div>{!monthRows.length && <EmptyState text={emptyText} />}</div>
    <CalendarAgendaView rows={monthRows} emptyText={emptyText} onOpen={onOpen} />
  </div>;
}

function CalendarHeader({ month, onPrevious, onNext, onToday }: { month: Date; onPrevious: () => void; onNext: () => void; onToday: () => void }) { return <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"><div className="flex items-center gap-2"><IconButton label="Previous month" onClick={onPrevious}><Arrow direction="left" /></IconButton><h3 className="min-w-32 text-center text-sm font-extrabold text-[#0b1c30]">{new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(month)}</h3><IconButton label="Next month" onClick={onNext}><Arrow direction="right" /></IconButton></div><button type="button" onClick={onToday} className="rounded-lg border border-[#d3e4fe] bg-white px-4 py-2 text-xs font-bold text-[#0058bc] hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-blue-500">Today</button></div> }

function CalendarDayCell({ date, currentMonth, rows, onOpen, onOpenDay }: { date: Date; currentMonth: Date; rows: WorkflowRow[]; onOpen: (row: WorkflowRow) => void; onOpenDay: (date: string) => void }) { const current = isSameMonth(date, currentMonth); const today = isSameDay(date, new Date()); return <div className={`min-h-32 bg-white p-2 lg:min-h-36 ${current ? "" : "bg-[#fafbfe] text-[#a1a9b5]"} ${today ? "ring-2 ring-inset ring-[#78aef5]" : ""}`}><button type="button" disabled={!rows.length} aria-label={`Open all assets for ${formatAgendaDate(toISODate(date))}`} onClick={() => onOpenDay(toISODate(date))} className={`mb-2 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-default ${today ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0070eb] text-white" : rows.length ? "rounded text-[#0058bc] hover:underline" : ""}`}>{date.getDate()}</button><div className="grid gap-1.5">{rows.slice(0, 3).map((row) => <CalendarEvent key={rowKey(row)} row={row} onClick={() => onOpen(row)} />)}{rows.length > 3 && <button type="button" onClick={() => onOpenDay(toISODate(date))} className="text-left text-[10px] font-extrabold text-[#0058bc] hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">+{rows.length - 3} more</button>}</div></div> }
function CalendarEvent({ row, onClick }: { row: WorkflowRow; onClick: () => void }) { return <button type="button" onClick={onClick} aria-label={`Open ${row.platform} ${row.assetType} on ${formatScheduleDate(row.scheduledDate)}`} className={`w-full rounded-md px-2 py-1.5 text-left transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ${eventTone(row.status)}`}><span className="block truncate text-[10px] font-extrabold"><AssetGlyph className="mr-1 inline h-3 w-3" />{row.platform} · {row.assetType}</span><span className="mt-0.5 flex items-center gap-1 text-[9px] font-bold"><StatusDot status={row.status} />{titleCase(row.status)}</span></button> }
function CalendarAgendaView({ rows, emptyText, onOpen }: { rows: WorkflowRow[]; emptyText: string; onOpen: (row: WorkflowRow) => void }) { return <div className="divide-y divide-[#d3e4fe]/70 md:hidden">{rows.length ? rows.map((row) => <button type="button" key={rowKey(row)} onClick={() => onOpen(row)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-[#eff4ff]/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"><div><p className="text-xs font-extrabold text-[#717786]">{formatAgendaDate(row.scheduledDate)}</p><p className="mt-2 text-sm font-bold text-[#0b1c30]">{row.platform} · {row.assetType}</p><p className="mt-1 line-clamp-1 text-xs text-[#717786]">{row.coreTopic}</p></div><StatusBadge status={row.status} /></button>) : <EmptyState text={emptyText} />}</div> }

function DayGroupList({ group, onOpen }: { group: DayGroup; onOpen: (row: WorkflowRow) => void }) { return <section className="border-b border-[#d3e4fe]/70"><div className="grid gap-5 bg-white px-5 py-6 md:grid-cols-[1fr_2fr] md:items-center md:px-6"><span><b className="block text-[15px] font-extrabold tracking-[-0.01em] text-[#0b1c30]">Day {group.dayNumber}</b><small className="mt-1.5 block text-[11px] font-medium text-[#657080]">{formatScheduleDate(group.scheduledDate)}</small></span><SummaryField label="Core Topic"><span className="line-clamp-2 text-[15px] font-bold leading-6 tracking-[-0.01em] text-[#0b1c30]">{group.assets[0]?.coreTopic}</span></SummaryField></div><div className="border-t border-[#d3e4fe]/70 bg-[#fbfcff] px-5 py-2 sm:px-6"><div className="hidden grid-cols-[1fr_1.35fr_1fr_.65fr] gap-6 border-b border-[#dce6f5] px-4 py-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#657080] sm:grid"><span>Platform</span><span>Asset Type</span><span>Status</span><span className="text-right">Action</span></div>{group.assets.map((asset) => <AssetListRow key={asset.id} row={asset} onOpen={() => onOpen(asset)} />)}</div></section> }
function AssetListRow({ row, onOpen }: { row: WorkflowRow; onOpen: () => void }) { return <div className="grid gap-4 border-b border-[#e5edf8] px-4 py-4.5 last:border-b-0 sm:grid-cols-[1fr_1.35fr_1fr_.65fr] sm:items-center sm:gap-6"><div><span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786] sm:hidden">Platform</span><span className="inline-flex rounded-md bg-[#eaf2ff] px-2.5 py-1.5 text-[11px] font-bold capitalize leading-none text-[#0058bc]">{row.platform}</span></div><div><span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786] sm:hidden">Asset Type</span><span className="text-sm font-semibold leading-5 text-[#26384d]">{row.assetType}</span></div><div><span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786] sm:hidden">Status</span><StatusBadge status={row.status} /></div><button type="button" onClick={onOpen} className="w-fit justify-self-start rounded-md px-1 py-1 text-sm font-semibold text-[#0066d6] transition hover:bg-[#eaf2ff] hover:text-[#004faa] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:justify-self-end">{actionFor(row.status)}</button></div> }
function SummaryField({ label, children }: { label: string; children: React.ReactNode }) { return <div><span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#717786] md:hidden">{label}</span>{children}</div> }

function AssetDetailSheet({ row, onClose, onMove, onDelete, onSave }: { row: WorkflowRow; onClose: () => void; onMove: (status: WorkflowStatus) => void; onDelete: () => void; onSave: (changes: EditableAssetFields) => void }) {
  const [postPreviewOpen, setPostPreviewOpen] = useState(false);
  const viewPost = () => setPostPreviewOpen(true);
  return <>
    <Sheet onClose={onClose}><div className="flex items-start justify-between border-b border-[#d3e4fe] px-6 py-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#717786]">Asset Details</p><h3 className="mt-2 text-2xl font-black text-[#0b1c30]">{modalTitle(row.status)}</h3></div><IconButton label="Close asset details" onClick={onClose}><Close /></IconButton></div><div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6"><StatusBadge status={row.status} /><Info label="Day" value={`Day ${row.dayNumber}`} /><Info label="Date" value={formatScheduleDate(row.scheduledDate)} />{row.status === "BLUEPRINT" ? <AssetEditor row={row} onSave={onSave} /> : <><Info label="Platform" value={row.platform} /><Info label="Asset Type" value={row.assetType} /><Info label="Publish Time" value={row.publishTime} /><Info label="Core Topic" value={row.coreTopic} /><StatusContent row={row} /></>}</div><div className="mt-auto flex flex-wrap gap-2 border-t border-[#d3e4fe] bg-[#f9fbff] p-5">{row.status === "BLUEPRINT" && <SecondaryButton onClick={() => window.dispatchEvent(new CustomEvent("campaign-edit-asset", { detail: row.id }))}>Edit</SecondaryButton>}{row.status === "GENERATING" && <PrimaryButton onClick={() => onMove("READY")}>Complete Mock Generation</PrimaryButton>}{(row.status === "READY" || row.status === "PUBLISHED") && <SecondaryButton onClick={viewPost}>View Post</SecondaryButton>}{row.status === "ARCHIVED" && <><SecondaryButton>View Archive</SecondaryButton><PrimaryButton onClick={() => onMove("READY")}>Restore</PrimaryButton><DangerButton onClick={onDelete}>Delete</DangerButton></>}</div></Sheet>
    {postPreviewOpen && <GeneratedPostPreview row={row} published={row.status === "PUBLISHED"} onClose={() => setPostPreviewOpen(false)} />}
  </>;
}

function MissingPostDrawer({ selectedId, onClose }: { selectedId: string; onClose: () => void }) {
  return <ResponsiveOverlayShell variant="drawer" title="Post unavailable" description="Campaign Blueprint could not resolve the selected content entity." maxWidth="max-w-md" onClose={onClose} footer={<button type="button" onClick={onClose} className="min-h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">Close</button>}><div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-extrabold text-amber-900">Post details could not be loaded</p><p className="mt-2 text-sm leading-6 text-amber-800">The selected relationship <code className="break-all font-bold">{selectedId}</code> no longer matches a Campaign Blueprint content item.</p></div></ResponsiveOverlayShell>;
}

function AssetEditor({ row, onSave }: { row: WorkflowRow; onSave: (changes: EditableAssetFields) => void }) {
  const initialCaption = row.caption ?? "Blueprint contains the outline, target audience, key message, and CTA before generation begins.";
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [caption, setCaption] = useState(initialCaption);
  const [instruction, setInstruction] = useState("");
  const [platform, setPlatform] = useState(row.platform);
  const [assetType, setAssetType] = useState(() => platformAssetTypes[row.platform]?.includes(row.assetType) ? row.assetType : platformAssetTypes[row.platform]?.[0] ?? row.assetType);
  const [publishTime, setPublishTime] = useState(row.publishTime);
  const [coreTopic, setCoreTopic] = useState(row.coreTopic);

  useEffect(() => {
    function openEditor(event: Event) {
      if ((event as CustomEvent<string>).detail === row.id) setEditing(true);
    }
    window.addEventListener("campaign-edit-asset", openEditor);
    return () => window.removeEventListener("campaign-edit-asset", openEditor);
  }, [row.id]);

  function generateWithAI() {
    const direction = instruction.trim();
    setCaption(`${coreTopic}: Discover the key insights, practical takeaways, and next steps your audience can use today.${direction ? ` ${direction}` : ""}`);
  }

  function save() {
    onSave({ platform, assetType: assetType.trim(), publishTime, coreTopic: coreTopic.trim(), caption: caption.trim() || initialCaption });
    setEditing(false);
  }

  if (!editing) return <div className="flex flex-1 flex-col gap-5"><Info label="Platform" value={platform} /><Info label="Asset Type" value={assetType} /><Info label="Publish Time" value={publishTime} /><Info label="Core Topic" value={coreTopic} /><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786]">Caption</p><p className="mt-2 text-sm leading-6 text-[#414755]">{caption}</p></div></div>;

  return <div className="rounded-xl border border-[#d3e4fe] bg-[#f9fbff] p-4"><p className="text-sm font-extrabold text-[#0b1c30]">Edit Asset</p><div className="mt-4 grid gap-4"><EditField label="Platform" value={platform} onChange={(value) => setPlatform(value as SocialPlatformLabel)} /><EditField label="Asset Type" value={assetType} onChange={setAssetType} /><label><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">Publish Time</span><input type="time" value={publishTime} onChange={(event) => setPublishTime(event.target.value)} className="h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label><EditField label="Core Topic" value={coreTopic} onChange={setCoreTopic} /></div><p className="mt-5 text-xs font-extrabold uppercase tracking-[.12em] text-[#717786]">Caption editing</p><div className="mt-2 flex rounded-lg bg-[#eaf2ff] p-1"><button type="button" onClick={() => setMode("manual")} className={`flex-1 rounded-md px-3 py-2 text-xs font-bold ${mode === "manual" ? "bg-white text-[#0058bc] shadow-sm" : "text-[#717786]"}`}>Manual</button><button type="button" onClick={() => setMode("ai")} className={`flex-1 rounded-md px-3 py-2 text-xs font-bold ${mode === "ai" ? "bg-white text-[#0058bc] shadow-sm" : "text-[#717786]"}`}>AI</button></div>{mode === "manual" ? <label className="mt-4 block"><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">Caption</span><textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={6} className="w-full resize-y rounded-lg border border-[#c5d2e5] bg-white p-3 text-sm leading-6 outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label> : <div className="mt-4"><label className="block"><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">AI instruction</span><textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Contoh: Buat lebih singkat dan profesional" rows={3} className="w-full resize-y rounded-lg border border-[#c5d2e5] bg-white p-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label><button type="button" onClick={generateWithAI} className="mt-3 rounded-lg bg-[#e5eeff] px-4 py-2.5 text-xs font-bold text-[#0058bc] hover:bg-[#d9e7ff]">Generate with AI</button><p className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-[#414755]">{caption}</p></div>}<div className="mt-4 flex gap-2"><button type="button" onClick={save} className="rounded-lg bg-[#0058bc] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#004493]">Save Changes</button><button type="button" onClick={() => { setPlatform(row.platform); setAssetType(row.assetType); setPublishTime(row.publishTime); setCoreTopic(row.coreTopic); setCaption(initialCaption); setEditing(false); }} className="rounded-lg border border-[#c5d2e5] px-4 py-2.5 text-xs font-bold text-[#414755]">Cancel</button></div></div>;
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const isPlatform = label === "Platform";
  const isAssetType = label === "Asset Type";
  const inferredPlatform: SocialPlatformLabel = isPlatform && editablePlatforms.includes(value as SocialPlatformLabel) ? value as SocialPlatformLabel : editablePlatforms.find((platform) => platformAssetTypes[platform].includes(value)) ?? "Instagram";
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatformLabel>(inferredPlatform);

  useEffect(() => {
    if (!isAssetType) return;
    function syncAssetTypes(event: Event) {
      const platform = (event as CustomEvent<SocialPlatformLabel>).detail;
      if (!editablePlatforms.includes(platform)) return;
      setSelectedPlatform(platform);
      onChange(platformAssetTypes[platform][0]);
    }
    window.addEventListener("asset-editor-platform-change", syncAssetTypes);
    return () => window.removeEventListener("asset-editor-platform-change", syncAssetTypes);
  }, [isAssetType, onChange]);

  if (isPlatform) return <label><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">{label}</span><select value={value} onChange={(event) => { const platform = event.target.value as SocialPlatformLabel; onChange(platform); window.dispatchEvent(new CustomEvent("asset-editor-platform-change", { detail: platform })); }} className="h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">{editablePlatforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select></label>;
  if (isAssetType) return <label><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">{platformAssetTypes[selectedPlatform].map((assetType) => <option key={assetType} value={assetType}>{assetType}</option>)}</select></label>;
  return <label><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#717786]">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label>;
}
function DayAssetsSheet({ date, rows, onClose, onOpen }: { date: string; rows: WorkflowRow[]; onClose: () => void; onOpen: (row: WorkflowRow) => void }) { return <Sheet onClose={onClose}><div className="flex items-start justify-between border-b border-[#d3e4fe] p-6"><div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#717786]">Scheduled Assets</p><h3 className="mt-2 text-xl font-black text-[#0b1c30]">{formatAgendaDate(date)}</h3></div><IconButton label="Close scheduled assets" onClick={onClose}><Close /></IconButton></div><div className="grid gap-3 p-5">{rows.map((row) => <button key={rowKey(row)} type="button" onClick={() => onOpen(row)} className="rounded-lg border border-[#d3e4fe] p-4 text-left hover:bg-[#eff4ff]/50 focus:outline-none focus:ring-2 focus:ring-blue-500"><p className="text-xs font-extrabold text-[#0058bc]">{row.platform}</p><p className="mt-1 text-sm font-extrabold text-[#0b1c30]">{row.assetType}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#717786]">{row.coreTopic}</p><div className="mt-3"><StatusBadge status={row.status} /></div></button>)}</div></Sheet> }
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) { return <ResponsiveOverlayShell variant="drawer" title="Campaign asset details" showHeader={false} maxWidth="max-w-md" bodyScrollable={false} bodyClassName="flex flex-col p-0" panelClassName="asset-detail-sheet" onClose={onClose}>{children}</ResponsiveOverlayShell> }

function StatusContent({ row }: { row: WorkflowRow }) { if (row.status === "GENERATING") return <div><div className="flex justify-between text-sm font-bold"><span>Generating content mockup</span><span className="text-[#0058bc]">In progress</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e5eeff]"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#0070eb]" /></div><p className="mt-2 text-xs text-[#717786]">The asset will move to Ready automatically when generation is complete.</p></div>; if (row.status === "READY" || row.status === "PUBLISHED") return <ReadyContentMockup row={row} />; if (row.status === "ARCHIVED") return <p className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-600">This asset is archived.</p>; return null; }
function ReadyContentMockup({ row }: { row: WorkflowRow }) {
  const published = row.status === "PUBLISHED";
  return <><div className="overflow-hidden rounded-xl border border-[#d3e4fe] bg-white shadow-sm"><MockPostHeader row={row} published={published} /><GeneratedMedia row={row} compact /><div className="p-4"><div className="mb-3 flex gap-4 text-lg text-[#26384d]"><span>♡</span><span>○</span><span>⌁</span></div><p className="text-xs leading-5 text-[#414755]"><b className="mr-1 text-[#0b1c30]">brandpilot</b>{captionFor(row)}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-emerald-700">{published ? "Published automatically on schedule" : "Ready · Auto-publish scheduled"}</p></div></div></>;
}

function GeneratedPostPreview({ row, published, onClose }: { row: WorkflowRow; published: boolean; onClose: () => void }) { return <ResponsiveOverlayShell title={`${row.platform} · ${row.assetType}`} eyebrow="Generated Post Preview" maxWidth="max-w-2xl" bodyClassName="p-0" closeLabel="Close generated post preview" onClose={onClose}><MockPostHeader row={row} published={published} /><GeneratedMedia row={row} /><div className="p-5"><div className="mb-4 flex gap-5 text-2xl text-[#26384d]"><span>♡</span><span>○</span><span>⌁</span></div><p className="text-sm leading-6 text-[#414755]"><b className="mr-1 text-[#0b1c30]">brandpilot</b>{captionFor(row)}</p><p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.14em] text-emerald-700">{published ? "Published" : `Scheduled for ${formatScheduleDate(row.scheduledDate)} at ${row.publishTime}`}</p></div></ResponsiveOverlayShell>; }
function MockPostHeader({ row, published }: { row: WorkflowRow; published: boolean }) { return <div className="flex items-center justify-between border-b border-[#e5edf8] px-4 py-3"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0058bc] text-[10px] font-black text-white">BP</span><div><p className="text-xs font-extrabold text-[#0b1c30]">Brand Pilot</p><p className="text-[10px] font-semibold capitalize text-[#717786]">{row.platform} · {published ? "Published" : "Scheduled"} {row.publishTime}</p></div></div><span className="text-lg font-bold text-[#717786]">•••</span></div>; }
function GeneratedMedia({ row, compact = false }: { row: WorkflowRow; compact?: boolean }) { const video = /video|reel|shorts|tutorial|demo|behind the scenes/i.test(row.assetType); return <div className={`relative flex aspect-square flex-col justify-between overflow-hidden bg-gradient-to-br from-[#dceaff] via-[#f9fbff] to-[#e8e4ff] ${compact ? "p-6" : "p-8 sm:p-10"}`}><span className="w-fit rounded-full bg-white/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0058bc]">{row.assetType}</span>{video && <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0058bc] text-2xl text-white shadow-xl">▶</span>}<div><p className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-black leading-tight tracking-[-.03em] text-[#0b1c30]`}>{row.coreTopic}</p><p className="mt-3 text-xs font-bold uppercase tracking-[.14em] text-[#0058bc]">{video ? "Watch now" : "Learn more"} →</p></div>{!video && /carousel/i.test(row.assetType) && <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#0058bc]">1 / 5</span>}</div>; }
function captionFor(row: WorkflowRow) { return row.caption ?? "Blueprint contains the outline, target audience, key message, and CTA before generation begins."; }
function StatusBadge({ status }: { status: WorkflowStatus }) { const styles: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#e5eeff] text-[#414755]", GENERATING: "bg-blue-50 text-[#0058bc]", READY: "bg-emerald-50 text-emerald-700", PUBLISHED: "bg-violet-50 text-violet-700", ARCHIVED: "bg-slate-100 text-slate-600" }; return <span className={`status-${status.toLowerCase()} inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase leading-none tracking-[.06em] ${styles[status]}`}><StatusDot status={status} />{titleCase(status)}</span> }
function StatusDot({ status }: { status: WorkflowStatus }) { const dots: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#717786]", GENERATING: "bg-[#0058bc]", READY: "bg-emerald-600", PUBLISHED: "bg-violet-600", ARCHIVED: "bg-slate-500" }; return <span className={`h-2 w-2 shrink-0 rounded-full ${dots[status]}`} /> }
function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) { return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`rounded-md px-4 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${active ? "bg-[#0070eb] text-white" : "text-[#414755] hover:bg-white"}`}>{children}</button> }
function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) { return <button type="button" aria-label={label} onClick={onClick} className="rounded-lg border border-[#d3e4fe] p-2 text-[#414755] hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg bg-[#0058bc] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg border border-[#c5d2e5] px-4 py-2.5 text-xs font-bold text-[#414755] hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function DangerButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500">{children}</button> }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</p><p className="mt-1 text-sm font-semibold capitalize leading-6 text-[#0b1c30]">{value}</p></div> }
function EmptyState({ text }: { text: string }) { return <div className="bg-white px-5 py-12 text-center text-sm font-semibold text-[#717786]">{text}</div> }

function buildCalendarCells(month: Date) { const first = new Date(month.getFullYear(), month.getMonth(), 1); const start = new Date(month.getFullYear(), month.getMonth(), 1 - first.getDay()); return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)); }
function groupRowsByDay(rows: WorkflowRow[]): DayGroup[] { const groups = new Map<string, DayGroup>(); for (const row of rows) { const existing = groups.get(row.scheduledDate); if (existing) existing.assets.push(row); else groups.set(row.scheduledDate, { dayNumber: row.dayNumber, scheduledDate: row.scheduledDate, assets: [row] }); } return Array.from(groups.values()).sort((left, right) => left.dayNumber - right.dayNumber); }
function parseLocalDate(value: string) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function toISODate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function isSameMonth(left: Date, right: Date) { return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth(); }
function isSameDay(left: Date, right: Date) { return isSameMonth(left, right) && left.getDate() === right.getDate(); }
function isPublishDue(date: string, time: string) { const scheduledAt = new Date(`${date}T${time || "00:00"}:00`); return !Number.isNaN(scheduledAt.getTime()) && scheduledAt.getTime() <= Date.now(); }
function rowKey(row: WorkflowRow) { return row.id; }
function actionFor(status: WorkflowStatus) { return status === "BLUEPRINT" ? "View Details" : status === "GENERATING" ? "Track" : status === "READY" || status === "PUBLISHED" ? "View Post" : "View Archive"; }
function modalTitle(status: WorkflowStatus) { return status === "BLUEPRINT" ? "Asset Blueprint" : status === "GENERATING" ? "Generation Progress" : status === "READY" ? "Content Preview" : status === "PUBLISHED" ? "Published Content" : "Archived Content"; }
function eventTone(status: WorkflowStatus) { return status === "BLUEPRINT" ? "bg-[#edf3ff] text-[#414755]" : status === "GENERATING" ? "bg-blue-50 text-[#0058bc]" : status === "READY" ? "bg-emerald-50 text-emerald-700" : status === "PUBLISHED" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"; }
function titleCase(value: string) { return value.charAt(0) + value.slice(1).toLowerCase(); }
function formatAgendaDate(value: string) { return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(parseLocalDate(value)); }
function formatScheduleDate(value: string) { return new Intl.DateTimeFormat("en", { weekday: "short", month: "long", day: "numeric", year: "numeric" }).format(parseLocalDate(value)); }
function AssetGlyph({ className }: { className: string }) { return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></svg> }
function Arrow({ direction }: { direction: "left" | "right" }) { return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} /></svg> }
function Close() { return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg> }
