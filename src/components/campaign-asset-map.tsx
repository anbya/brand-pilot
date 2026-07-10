"use client";

import { useState } from "react";

export type CampaignAssetRow = { day: string; date: string; type: string; topic: string; status: "BLUEPRINT" | "GENERATING" | "READY"; action: string; icon: string };
type WorkflowStatus = CampaignAssetRow["status"] | "PUBLISHED" | "ARCHIVED";
type WorkflowRow = Omit<CampaignAssetRow, "status"> & { status: WorkflowStatus };

export function CampaignAssetMap({ initialRows }: { initialRows: CampaignAssetRow[] }) {
  const [rows, setRows] = useState<WorkflowRow[]>(initialRows);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : rows[selectedIndex];
  const visibleRows = expanded ? rows : rows.slice(0, 5);

  function moveTo(status: WorkflowStatus) {
    if (selectedIndex === null) return;
    setRows((current) => current.map((row, index) => index === selectedIndex ? { ...row, status, action: actionFor(status) } : row));
    setSelectedIndex(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead><tr className="bg-[#eff4ff]/70">{["Schedule", "Asset Type", "Core Topic", "Status", "Action"].map((header) => <th key={header} className={`px-6 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#717786] ${header === "Action" ? "text-right" : ""}`}>{header}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#d3e4fe]/60">
            {visibleRows.map((row, index) => <AssetRowItem key={`${row.day}-${row.type}`} row={row} onOpen={() => setSelectedIndex(index)} />)}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-center gap-2 border-t border-[#d3e4fe]/70 bg-[#eff4ff]/40 p-5 text-sm font-bold text-[#0058bc] transition hover:bg-[#eff4ff]/70">
        {expanded ? "Hide Full 30-Day Strategy" : "Load Full 30-Day Strategy"}
        <Chevron className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {selected && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b33]/55 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedIndex(null)}><section role="dialog" aria-modal="true" aria-labelledby="asset-modal-title" className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#d3e4fe] px-6 py-5"><div><StatusBadge status={selected.status} /><h3 id="asset-modal-title" className="mt-3 text-2xl font-black text-[#0b1c30]">{modalTitle(selected.status)}</h3><p className="mt-1 text-sm text-[#717786]">{selected.day} · {selected.type}</p></div><button type="button" aria-label="Close asset modal" onClick={() => setSelectedIndex(null)} className="rounded-lg p-2 text-[#717786] hover:bg-[#eff4ff]"><Close /></button></div>
        <div className="p-6"><StatusContent row={selected} /></div>
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#d3e4fe] bg-[#f9fbff] px-6 py-5"><button type="button" onClick={() => setSelectedIndex(null)} className="h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755] hover:bg-white">Close</button>{selected.status === "BLUEPRINT" && <PrimaryButton onClick={() => moveTo("GENERATING")}>Start Generating</PrimaryButton>}{selected.status === "GENERATING" && <PrimaryButton onClick={() => moveTo("READY")}>Complete Mock Generation</PrimaryButton>}{selected.status === "READY" && <PrimaryButton onClick={() => moveTo("PUBLISHED")}>Publish Content</PrimaryButton>}{selected.status === "PUBLISHED" && <PrimaryButton onClick={() => moveTo("ARCHIVED")}>Archive Campaign</PrimaryButton>}</div>
      </section></div>}
    </>
  );
}

function AssetRowItem({ row, onOpen }: { row: WorkflowRow; onOpen: () => void }) { return <tr className="group transition hover:bg-[#eff4ff]/70"><td className="w-[14%] px-6 py-5"><p className="text-sm font-extrabold text-[#0b1c30]">{row.day}</p><p className="mt-1 text-[10px] font-semibold text-[#717786]">{row.date}</p></td><td className="w-[23%] px-6 py-5"><div className="flex items-center gap-2"><AssetGlyph /><span className="text-sm font-semibold text-[#414755]">{row.type}</span></div></td><td className="w-[30%] px-6 py-5 text-sm font-semibold text-[#0b1c30]">{row.topic}</td><td className="w-[18%] px-6 py-5"><StatusBadge status={row.status} /></td><td className="w-[15%] px-6 py-5 text-right"><button onClick={onOpen} className="text-sm font-bold text-[#0058bc] transition hover:text-[#004493] group-hover:underline" type="button">{actionFor(row.status)}</button></td></tr> }

function StatusContent({ row }: { row: WorkflowRow }) {
  if (row.status === "BLUEPRINT") return <div className="grid gap-4"><Info label="Core Topic" value={row.topic} /><Info label="Objective" value="Build awareness and audience engagement" /><Info label="Key Message" value="Clear, helpful, and relevant content for the selected audience." /><Info label="CTA" value="Save this post and follow for the next insight." /></div>;
  if (row.status === "GENERATING") return <div><p className="text-sm leading-6 text-[#414755]">AI is generating copy, visuals, and layout for this asset.</p><div className="mt-6 flex items-center justify-between text-sm font-bold"><span>Generation progress</span><span className="text-[#0058bc]">68%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e5eeff]"><div className="h-full w-[68%] rounded-full bg-[#0070eb]" /></div><p className="mt-3 text-xs text-[#717786]">Estimated time remaining: 4 minutes · Queue position: 1</p></div>;
  if (row.status === "READY") return <div><div className="rounded-xl bg-gradient-to-br from-[#dceaff] via-white to-[#e8e4ff] p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-[#0058bc]">AI Marketing OS</p><h4 className="mt-10 max-w-sm text-3xl font-black leading-tight text-[#0b1c30]">{row.topic}</h4><p className="mt-4 text-sm text-[#414755]">Mock content preview ready for review and approval.</p></div><p className="mt-4 text-sm text-[#717786]">Asset is ready. Review this preview before publishing.</p></div>;
  if (row.status === "PUBLISHED") return <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5"><p className="font-extrabold text-emerald-800">Content successfully published</p><p className="mt-2 text-sm leading-6 text-emerald-700">The asset is live on its selected platform. Published today at 10:00 AM.</p></div>;
  return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5"><p className="font-extrabold text-slate-700">Campaign asset archived</p><p className="mt-2 text-sm leading-6 text-slate-600">This content has completed its lifecycle and is stored for reporting.</p></div>;
}

function StatusBadge({ status }: { status: WorkflowStatus }) { const styles: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#e5eeff] text-[#414755]", GENERATING: "bg-blue-50 text-[#0058bc]", READY: "bg-emerald-50 text-emerald-700", PUBLISHED: "bg-violet-50 text-violet-700", ARCHIVED: "bg-slate-100 text-slate-600" }; const dots: Record<WorkflowStatus, string> = { BLUEPRINT: "bg-[#717786]", GENERATING: "bg-[#0058bc]", READY: "bg-emerald-600", PUBLISHED: "bg-violet-600", ARCHIVED: "bg-slate-500" }; return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold ${styles[status]}`}><span className={`h-2 w-2 rounded-full ${dots[status]}`} />{status}</span> }
function actionFor(status: WorkflowStatus) { return status === "BLUEPRINT" ? "View Details" : status === "GENERATING" ? "Track" : status === "READY" ? "Preview" : status === "PUBLISHED" ? "View Post" : "View Archive"; }
function modalTitle(status: WorkflowStatus) { return status === "BLUEPRINT" ? "Asset Blueprint" : status === "GENERATING" ? "Generation Progress" : status === "READY" ? "Content Preview" : status === "PUBLISHED" ? "Published Content" : "Archived Content"; }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#0b1c30]">{value}</p></div> }
function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white hover:bg-[#004493]">{children}</button> }
function AssetGlyph() { return <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0058bc]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></svg> }
function Chevron({ className }: { className: string }) { return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg> }
function Close() { return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg> }
