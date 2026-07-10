"use client";

import { useEffect, useMemo, useState } from "react";

export type CampaignAssetRow = {
  day: string;
  date: string;
  scheduledDate: string;
  type: string;
  topic: string;
  status: "BLUEPRINT" | "GENERATING" | "READY";
  action: string;
  icon: string;
};

type WorkflowStatus = CampaignAssetRow["status"] | "PUBLISHED" | "ARCHIVED";
type WorkflowRow = Omit<CampaignAssetRow, "status"> & { status: WorkflowStatus };
type ViewMode = "list" | "calendar";
type FilterValue = "ALL" | WorkflowStatus;

export function CampaignAssetMap({ initialRows }: { initialRows: CampaignAssetRow[] }) {
  const [rows, setRows] = useState<WorkflowRow[]>(initialRows);
  const [view, setView] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [expanded, setExpanded] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [daySheetDate, setDaySheetDate] = useState<string | null>(null);
  const [selectedBlueprints, setSelectedBlueprints] = useState<Set<string>>(() => new Set());
  const [batchSelectionEnabled, setBatchSelectionEnabled] = useState(false);
  const initialMonth = parseLocalDate(initialRows[0]?.scheduledDate ?? toISODate(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const filteredRows = useMemo(() => filter === "ALL" ? rows : rows.filter((row) => row.status === filter), [filter, rows]);
  const selected = selectedKey ? rows.find((row) => rowKey(row) === selectedKey) ?? null : null;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("campaign-blueprint-selection", { detail: selectedBlueprints.size }));
  }, [selectedBlueprints]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("campaign-batch-mode", { detail: batchSelectionEnabled }));
  }, [batchSelectionEnabled]);

  useEffect(() => {
    function enableBatchSelection() {
      setBatchSelectionEnabled(true);
    }
    function cancelBatchSelection() {
      setBatchSelectionEnabled(false);
      setSelectedBlueprints(new Set());
    }
    window.addEventListener("campaign-enable-batch-selection", enableBatchSelection);
    window.addEventListener("campaign-cancel-batch-selection", cancelBatchSelection);
    return () => {
      window.removeEventListener("campaign-enable-batch-selection", enableBatchSelection);
      window.removeEventListener("campaign-cancel-batch-selection", cancelBatchSelection);
    };
  }, []);

  useEffect(() => {
    function generateSelected() {
      setRows((current) => current.map((row) => selectedBlueprints.has(rowKey(row)) && row.status === "BLUEPRINT" ? { ...row, status: "GENERATING", action: "Track" } : row));
      setSelectedBlueprints(new Set());
      setBatchSelectionEnabled(false);
    }
    window.addEventListener("campaign-start-batch", generateSelected);
    return () => window.removeEventListener("campaign-start-batch", generateSelected);
  }, [selectedBlueprints]);

  function moveTo(status: WorkflowStatus) {
    if (!selectedKey) return;
    setRows((current) => current.map((row) => rowKey(row) === selectedKey ? { ...row, status, action: actionFor(status) } : row));
    setSelectedKey(null);
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
            <option value="ALL">All Stages</option><option value="BLUEPRINT">Blueprint</option><option value="GENERATING">Generating</option><option value="READY">Ready</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
          </select>
        </label>
      </div>

      {view === "list" ? <ListView rows={filteredRows} expanded={expanded} batchSelectionEnabled={batchSelectionEnabled} selectedBlueprints={selectedBlueprints} onSelect={(row) => setSelectedBlueprints((current) => toggleSetValue(current, rowKey(row)))} onToggle={() => setExpanded((value) => !value)} onOpen={(row) => setSelectedKey(rowKey(row))} /> : <ContentAssetCalendarView rows={filteredRows} allRowsCount={rows.length} month={visibleMonth} onMonthChange={setVisibleMonth} onOpen={(row) => setSelectedKey(rowKey(row))} onOpenDay={setDaySheetDate} />}

      {daySheetDate && <DayAssetsSheet date={daySheetDate} rows={filteredRows.filter((row) => row.scheduledDate === daySheetDate)} onClose={() => setDaySheetDate(null)} onOpen={(row) => { setDaySheetDate(null); setSelectedKey(rowKey(row)); }} />}
      {selected && <AssetDetailSheet row={selected} onClose={() => setSelectedKey(null)} onMove={moveTo} />}
    </>
  );
}

export function StartBatchGenerationButton() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    function updateCount(event: Event) {
      setSelectedCount((event as CustomEvent<number>).detail);
    }
    function updateMode(event: Event) {
      setSelectionMode((event as CustomEvent<boolean>).detail);
    }
    window.addEventListener("campaign-blueprint-selection", updateCount);
    window.addEventListener("campaign-batch-mode", updateMode);
    window.dispatchEvent(new Event("campaign-cancel-batch-selection"));
    return () => {
      window.removeEventListener("campaign-blueprint-selection", updateCount);
      window.removeEventListener("campaign-batch-mode", updateMode);
    };
  }, []);

  function handleClick() {
    if (!selectionMode) {
      setSelectionMode(true);
      window.dispatchEvent(new Event("campaign-enable-batch-selection"));
      return;
    }
    if (selectedCount === 0) {
      setSelectionMode(false);
      window.dispatchEvent(new Event("campaign-cancel-batch-selection"));
      return;
    }
    if (selectedCount > 0) {
      window.dispatchEvent(new Event("campaign-start-batch"));
      setSelectionMode(false);
    }
  }

  return <button type="button" onClick={handleClick} className={`rounded-lg px-8 py-4 text-sm font-bold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectionMode && selectedCount === 0 ? "border border-[#c5d2e5] bg-white text-[#414755] shadow-none hover:bg-[#f4f7fb]" : "bg-[#0058bc] text-white shadow-blue-900/10 hover:bg-[#004493]"}`}>{!selectionMode ? "Start Batch Generation" : selectedCount > 0 ? `Start Batch Generation (${selectedCount})` : "Cancel Batch Selection"}</button>;
}

function ListView({ rows, expanded, batchSelectionEnabled, selectedBlueprints, onSelect, onToggle, onOpen }: { rows: WorkflowRow[]; expanded: boolean; batchSelectionEnabled: boolean; selectedBlueprints: Set<string>; onSelect: (row: WorkflowRow) => void; onToggle: () => void; onOpen: (row: WorkflowRow) => void }) {
  const visible = expanded ? rows : rows.slice(0, 5);
  return <><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="bg-[#eff4ff]/70">{["Schedule", "Asset Type", "Core Topic", "Status", "Action"].map((header) => <th key={header} className={`px-6 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#717786] ${header === "Action" ? "text-right" : ""}`}>{header}</th>)}</tr></thead><tbody className="divide-y divide-[#d3e4fe]/60">{visible.map((row) => <AssetRowItem key={rowKey(row)} row={row} selectionEnabled={batchSelectionEnabled} selected={selectedBlueprints.has(rowKey(row))} onSelect={() => onSelect(row)} onOpen={() => onOpen(row)} />)}</tbody></table>{!rows.length && <EmptyState text="No matching assets." />}</div>{rows.length > 5 && <button type="button" onClick={onToggle} className="flex w-full items-center justify-center gap-2 border-t border-[#d3e4fe]/70 bg-[#eff4ff]/40 p-5 text-sm font-bold text-[#0058bc] transition hover:bg-[#eff4ff]/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">{expanded ? "Hide Full 30-Day Strategy" : "Load Full 30-Day Strategy"}<Chevron className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>}</>;
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

function CalendarDayCell({ date, currentMonth, rows, onOpen, onOpenDay }: { date: Date; currentMonth: Date; rows: WorkflowRow[]; onOpen: (row: WorkflowRow) => void; onOpenDay: (date: string) => void }) { const current = isSameMonth(date, currentMonth); const today = isSameDay(date, new Date()); return <div className={`min-h-32 bg-white p-2 lg:min-h-36 ${current ? "" : "bg-[#fafbfe] text-[#a1a9b5]"} ${today ? "ring-2 ring-inset ring-[#78aef5]" : ""}`}><div className={`mb-2 text-xs font-extrabold ${today ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0070eb] text-white" : ""}`}>{date.getDate()}</div><div className="grid gap-1.5">{rows.slice(0, 3).map((row) => <CalendarEvent key={rowKey(row)} row={row} onClick={() => onOpen(row)} />)}{rows.length > 3 && <button type="button" onClick={() => onOpenDay(toISODate(date))} className="text-left text-[10px] font-extrabold text-[#0058bc] hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">+{rows.length - 3} more</button>}</div></div> }
function CalendarEvent({ row, onClick }: { row: WorkflowRow; onClick: () => void }) { return <button type="button" onClick={onClick} aria-label={`Open ${row.type} on ${row.date}`} className={`w-full rounded-md px-2 py-1.5 text-left transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ${eventTone(row.status)}`}><span className="block truncate text-[10px] font-extrabold"><AssetGlyph className="mr-1 inline h-3 w-3" />{shortType(row.type)}</span><span className="mt-0.5 flex items-center gap-1 text-[9px] font-bold"><StatusDot status={row.status} />{titleCase(row.status)}</span></button> }
function CalendarAgendaView({ rows, emptyText, onOpen }: { rows: WorkflowRow[]; emptyText: string; onOpen: (row: WorkflowRow) => void }) { return <div className="divide-y divide-[#d3e4fe]/70 md:hidden">{rows.length ? rows.map((row) => <button type="button" key={rowKey(row)} onClick={() => onOpen(row)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-[#eff4ff]/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"><div><p className="text-xs font-extrabold text-[#717786]">{formatAgendaDate(row.scheduledDate)}</p><p className="mt-2 text-sm font-bold text-[#0b1c30]">{row.type}</p><p className="mt-1 line-clamp-1 text-xs text-[#717786]">{row.topic}</p></div><StatusBadge status={row.status} /></button>) : <EmptyState text={emptyText} />}</div> }

function AssetRowItem({ row, selectionEnabled, selected, onSelect, onOpen }: { row: WorkflowRow; selectionEnabled: boolean; selected: boolean; onSelect: () => void; onOpen: () => void }) { return <tr className={`group transition hover:bg-[#eff4ff]/70 ${selected ? "bg-[#f2f7ff]" : ""}`}><td className="w-[14%] px-6 py-5"><p className="text-sm font-extrabold text-[#0b1c30]">{row.day}</p><p className="mt-1 text-[10px] font-semibold text-[#717786]">{row.date}</p></td><td className="w-[23%] px-6 py-5"><div className="flex items-center gap-2"><AssetGlyph className="h-5 w-5 shrink-0 text-[#0058bc]" /><span className="text-sm font-semibold text-[#414755]">{row.type}</span></div></td><td className="w-[30%] px-6 py-5 text-sm font-semibold text-[#0b1c30]">{row.topic}</td><td className="w-[18%] px-6 py-5"><div className="flex items-center gap-2">{selectionEnabled && row.status === "BLUEPRINT" && <button type="button" aria-label={`${selected ? "Unselect" : "Select"} ${row.type} for batch generation`} aria-pressed={selected} onClick={onSelect} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected ? "border-[#0070eb] bg-[#0070eb] text-white" : "border-[#aebdd2] bg-white text-transparent hover:border-[#0070eb]"}`}><Check /></button>}<StatusBadge status={row.status} /></div></td><td className="w-[15%] px-6 py-5 text-right"><button onClick={onOpen} className="text-sm font-bold text-[#0058bc] transition hover:text-[#004493] group-hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500" type="button">{actionFor(row.status)}</button></td></tr> }

function AssetDetailSheet({ row, onClose, onMove }: { row: WorkflowRow; onClose: () => void; onMove: (status: WorkflowStatus) => void }) { return <Sheet onClose={onClose}><div className="flex items-start justify-between border-b border-[#d3e4fe] px-6 py-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#717786]">Asset Details</p><h3 className="mt-2 text-2xl font-black text-[#0b1c30]">{modalTitle(row.status)}</h3></div><IconButton label="Close asset details" onClick={onClose}><Close /></IconButton></div><div className="grid gap-5 overflow-y-auto p-6"><StatusBadge status={row.status} /><Info label="Day" value={row.day} /><Info label="Date" value={row.date} /><Info label="Platform" value={platformFromType(row.type)} /><Info label="Asset Type" value={row.type} /><Info label="Core Topic" value={row.topic} /><StatusContent row={row} /></div><div className="mt-auto flex flex-wrap gap-2 border-t border-[#d3e4fe] bg-[#f9fbff] p-5">{row.status === "BLUEPRINT" && <><SecondaryButton>View Details</SecondaryButton><PrimaryButton onClick={() => onMove("GENERATING")}>Generate Asset</PrimaryButton><SecondaryButton>Edit</SecondaryButton><SecondaryButton onClick={() => onMove("ARCHIVED")}>Archive</SecondaryButton></>}{row.status === "GENERATING" && <PrimaryButton onClick={() => onMove("READY")}>Complete Mock Generation</PrimaryButton>}{row.status === "READY" && <><PrimaryButton onClick={() => onMove("PUBLISHED")}>Publish Content</PrimaryButton><SecondaryButton>Edit</SecondaryButton><SecondaryButton onClick={() => onMove("ARCHIVED")}>Archive</SecondaryButton></>}{row.status === "PUBLISHED" && <><SecondaryButton>View Post</SecondaryButton><PrimaryButton onClick={() => onMove("ARCHIVED")}>Archive</PrimaryButton></>}{row.status === "ARCHIVED" && <><SecondaryButton>View Archive</SecondaryButton><PrimaryButton onClick={() => onMove("READY")}>Restore</PrimaryButton></>}</div></Sheet> }
function DayAssetsSheet({ date, rows, onClose, onOpen }: { date: string; rows: WorkflowRow[]; onClose: () => void; onOpen: (row: WorkflowRow) => void }) { return <Sheet onClose={onClose}><div className="flex items-start justify-between border-b border-[#d3e4fe] p-6"><div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#717786]">Scheduled Assets</p><h3 className="mt-2 text-xl font-black text-[#0b1c30]">{formatAgendaDate(date)}</h3></div><IconButton label="Close scheduled assets" onClick={onClose}><Close /></IconButton></div><div className="grid gap-3 p-5">{rows.map((row) => <button key={rowKey(row)} type="button" onClick={() => onOpen(row)} className="rounded-lg border border-[#d3e4fe] p-4 text-left hover:bg-[#eff4ff]/50 focus:outline-none focus:ring-2 focus:ring-blue-500"><p className="text-sm font-extrabold text-[#0b1c30]">{row.type}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#717786]">{row.topic}</p><div className="mt-3"><StatusBadge status={row.status} /></div></button>)}</div></Sheet> }
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-[70] flex justify-end bg-[#071b33]/45 backdrop-blur-[1px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">{children}</section></div> }

function StatusContent({ row }: { row: WorkflowRow }) { if (row.status === "GENERATING") return <div><div className="flex justify-between text-sm font-bold"><span>Generation progress</span><span className="text-[#0058bc]">68%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e5eeff]"><div className="h-full w-[68%] rounded-full bg-[#0070eb]" /></div><p className="mt-2 text-xs text-[#717786]">Estimated time remaining: 4 minutes</p></div>; if (row.status === "READY") return <div className="rounded-xl bg-gradient-to-br from-[#dceaff] via-white to-[#e8e4ff] p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-[#0058bc]">Content Preview</p><p className="mt-8 text-xl font-black leading-tight text-[#0b1c30]">{row.topic}</p></div>; if (row.status === "PUBLISHED") return <p className="rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-700">Content successfully published.</p>; if (row.status === "ARCHIVED") return <p className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-600">This asset is archived.</p>; return <p className="text-sm leading-6 text-[#414755]">Blueprint contains the outline, target audience, key message, and CTA before generation begins.</p> }
function StatusBadge({ status }: { status: WorkflowStatus }) { const styles: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#e5eeff] text-[#414755]", GENERATING: "bg-blue-50 text-[#0058bc]", READY: "bg-emerald-50 text-emerald-700", PUBLISHED: "bg-violet-50 text-violet-700", ARCHIVED: "bg-slate-100 text-slate-600" }; return <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[10px] font-extrabold ${styles[status]}`}><StatusDot status={status} />{status}</span> }
function StatusDot({ status }: { status: WorkflowStatus }) { const dots: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#717786]", GENERATING: "bg-[#0058bc]", READY: "bg-emerald-600", PUBLISHED: "bg-violet-600", ARCHIVED: "bg-slate-500" }; return <span className={`h-2 w-2 shrink-0 rounded-full ${dots[status]}`} /> }
function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) { return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`rounded-md px-4 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${active ? "bg-[#0070eb] text-white" : "text-[#414755] hover:bg-white"}`}>{children}</button> }
function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) { return <button type="button" aria-label={label} onClick={onClick} className="rounded-lg border border-[#d3e4fe] p-2 text-[#414755] hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg bg-[#0058bc] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg border border-[#c5d2e5] px-4 py-2.5 text-xs font-bold text-[#414755] hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</button> }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</p><p className="mt-1 text-sm font-semibold capitalize leading-6 text-[#0b1c30]">{value}</p></div> }
function EmptyState({ text }: { text: string }) { return <div className="bg-white px-5 py-12 text-center text-sm font-semibold text-[#717786]">{text}</div> }

function buildCalendarCells(month: Date) { const first = new Date(month.getFullYear(), month.getMonth(), 1); const start = new Date(month.getFullYear(), month.getMonth(), 1 - first.getDay()); return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)); }
function parseLocalDate(value: string) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function toISODate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function isSameMonth(left: Date, right: Date) { return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth(); }
function isSameDay(left: Date, right: Date) { return isSameMonth(left, right) && left.getDate() === right.getDate(); }
function rowKey(row: WorkflowRow) { return `${row.scheduledDate}-${row.type}`; }
function actionFor(status: WorkflowStatus) { return status === "BLUEPRINT" ? "View Details" : status === "GENERATING" ? "Track" : status === "READY" ? "Preview" : status === "PUBLISHED" ? "View Post" : "View Archive"; }
function modalTitle(status: WorkflowStatus) { return status === "BLUEPRINT" ? "Asset Blueprint" : status === "GENERATING" ? "Generation Progress" : status === "READY" ? "Content Preview" : status === "PUBLISHED" ? "Published Content" : "Archived Content"; }
function eventTone(status: WorkflowStatus) { return status === "BLUEPRINT" ? "bg-[#edf3ff] text-[#414755]" : status === "GENERATING" ? "bg-blue-50 text-[#0058bc]" : status === "READY" ? "bg-emerald-50 text-emerald-700" : status === "PUBLISHED" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"; }
function shortType(type: string) { return type.replace(/Instagram|TikTok|LinkedIn|Facebook|YouTube/gi, "").trim(); }
function platformFromType(type: string) { return ["Instagram", "TikTok", "LinkedIn", "Facebook", "YouTube"].find((platform) => type.includes(platform)) ?? "Multi-platform"; }
function titleCase(value: string) { return value.charAt(0) + value.slice(1).toLowerCase(); }
function formatAgendaDate(value: string) { return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(parseLocalDate(value)); }
function toggleSetValue(current: Set<string>, value: string) { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next; }
function AssetGlyph({ className }: { className: string }) { return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></svg> }
function Chevron({ className }: { className: string }) { return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg> }
function Arrow({ direction }: { direction: "left" | "right" }) { return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} /></svg> }
function Close() { return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg> }
function Check() { return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg> }
