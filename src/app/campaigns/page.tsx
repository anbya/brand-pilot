"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { campaigns as seedCampaigns, type Campaign } from "@/lib/mock-data";

type IconName = "add" | "analytics" | "assets" | "brands" | "calendar" | "campaign" | "check" | "chevronDown" | "close" | "dashboard" | "delete" | "edit" | "eye" | "layers" | "movie" | "play" | "post" | "search" | "settings" | "spark";
type CampaignForm = { primaryObjective: string; targetPlatforms: string[]; toneOfVoice: string[]; startDate: string; endDate: string };

const platforms = [
  { label: "Instagram", icon: "post" }, { label: "TikTok", icon: "movie" },
  { label: "Facebook", icon: "campaign" }, { label: "LinkedIn", icon: "layers" },
  { label: "YouTube", icon: "movie" },
] satisfies Array<{ label: string; icon: IconName }>;
const tones = ["Visionary", "Reliable", "Professional", "Friendly", "Bold", "Educational"];
const campaignStorageKey = "brand-pilot-campaigns";
const initialForm: CampaignForm = { primaryObjective: "", targetPlatforms: [], toneOfVoice: [], startDate: "2026-07-01", endDate: "2026-07-30" };
const navItems = [
  ["Dashboard", "dashboard", "/dashboard"], ["Brands", "brands", "/brands"],
  ["Campaigns", "campaign", "/campaigns"], ["Content Calendar", "calendar", "/calendar"],
  ["Analytics", "analytics", "/analytics"],
] satisfies Array<[string, IconName, string]>;

export default function CampaignsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All status");
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => seedCampaigns.map((campaign) => ({ ...campaign })));
  const [storageReady, setStorageReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const restoreCampaigns = window.setTimeout(() => {
      try {
        const storedCampaigns = window.localStorage.getItem(campaignStorageKey);
        if (storedCampaigns) {
          const parsedCampaigns = JSON.parse(storedCampaigns) as unknown;
          if (Array.isArray(parsedCampaigns)) setCampaigns(parsedCampaigns as Campaign[]);
        }
      } catch {
        window.localStorage.removeItem(campaignStorageKey);
      } finally {
        setStorageReady(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreCampaigns);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(campaignStorageKey, JSON.stringify(campaigns));
  }, [campaigns, storageReady]);

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [modalOpen]);

  const campaignRows = campaigns.filter((campaign) => {
    const matchesQuery = campaign.name.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All status" || campaign.status === status);
  });

  function openModal() { setEditingId(null); setForm(initialForm); setError(""); setSaved(false); setModalOpen(true); }
  function editCampaign(campaign: Campaign) {
    setEditingId(campaign.id);
    setForm({
      primaryObjective: campaign.goal.charAt(0).toUpperCase() + campaign.goal.slice(1),
      targetPlatforms: campaign.platforms.map((platform) => platform.charAt(0).toUpperCase() + platform.slice(1)),
      toneOfVoice: ["Professional"],
      startDate: "2026-07-01",
      endDate: campaign.durationDays === 14 ? "2026-07-14" : "2026-07-30",
    });
    setError(""); setSaved(false); setModalOpen(true);
  }
  function update<K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) { setForm((current) => ({ ...current, [key]: value })); setError(""); setSaved(false); }
  function toggle(key: "targetPlatforms" | "toneOfVoice", value: string) { update(key, form[key].includes(value) ? form[key].filter((item) => item !== value) : [...form[key], value]); }
  function validate() {
    if (!form.primaryObjective.trim()) return "Primary objective wajib diisi.";
    if (!form.targetPlatforms.length) return "Pilih minimal satu target platform.";
    if (!form.toneOfVoice.length) return "Pilih minimal satu tone of voice.";
    if (!form.startDate || !form.endDate) return "Tanggal mulai dan selesai wajib diisi.";
    if (form.endDate < form.startDate) return "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.";
    return "";
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const message = validate();
    if (message) return setError(message);
    if (editingId) {
      setCampaigns((current) => current.map((campaign) => campaign.id === editingId ? {
        ...campaign,
        goal: objectiveToGoal(form.primaryObjective),
        platforms: form.targetPlatforms.map((platform) => platform.toLowerCase()),
        durationDays: durationFromDates(form.startDate, form.endDate),
      } : campaign));
      setModalOpen(false);
      setEditingId(null);
      return;
    }
  }
  function saveDraft() {
    const message = validate();
    if (message) return setError(message);

    const objective = form.primaryObjective.trim();
    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: objective,
      goal: objectiveToGoal(objective),
      platforms: form.targetPlatforms.map((platform) => platform.toLowerCase()),
      durationDays: durationFromDates(form.startDate, form.endDate),
      status: "approved",
      strategy: "Approved campaign strategy ready to be started and generated.",
      contentPillars: form.toneOfVoice,
      postingFrequency: "Not configured",
      ctaRecommendation: "Not configured",
    };

    setCampaigns((current) => [newCampaign, ...current]);
    setSaved(true);
    setModalOpen(false);
    setForm(initialForm);
  }
  function deleteCampaign() {
    if (!deletingCampaign) return;
    setCampaigns((current) => current.filter((campaign) => campaign.id !== deletingCampaign.id));
    setDeletingCampaign(null);
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-[#071b33] lg:pl-64">
      <Sidebar />
      <section className="mx-auto min-h-screen w-full max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold text-[#6b7482]">Campaigns</p><h1 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Campaign List</h1><p className="mt-3 text-sm text-[#6b7482]">Manage, review, and create your marketing campaigns.</p></div>
          <button onClick={openModal} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0869e8] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,105,232,.18)] transition hover:bg-[#0058bc]" type="button"><Icon name="add" />New Campaign</button>
        </div>

        <section className="mt-8 rounded-xl border border-[#dce7f8] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#e6edf8] p-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-sm"><Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77808d]" /><input aria-label="Search campaigns" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns..." className="h-11 w-full rounded-lg border border-[#d7e2f3] pl-11 pr-4 text-sm outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></label>
            <select aria-label="Filter campaign status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-lg border border-[#d7e2f3] bg-white px-4 text-sm font-semibold outline-none"><option>All status</option><option value="approved">Approved</option><option value="review">In review</option><option value="draft">Draft</option></select>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead className="bg-[#f8faff] text-[11px] font-extrabold uppercase tracking-[.14em] text-[#727b89]"><tr><th className="px-6 py-4">Campaign</th><th className="px-6 py-4">Objective</th><th className="px-6 py-4">Platforms</th><th className="px-6 py-4">Duration</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#e9eff8]">{campaignRows.map((campaign) => <tr key={campaign.id} className="transition hover:bg-[#fbfcff]"><td className="px-6 py-5"><p className="font-extrabold">{campaign.name}</p><p className="mt-1 text-xs text-[#7a8390]">Updated Jul 8, 2026</p></td><td className="px-6 py-5 text-sm capitalize text-[#495463]">{campaign.goal}</td><td className="px-6 py-5"><div className="flex flex-wrap gap-1.5">{campaign.platforms.map((item) => <span key={item} className="rounded-md bg-[#eef4ff] px-2 py-1 text-xs font-bold capitalize text-[#075cbe]">{item}</span>)}</div></td><td className="px-6 py-5 text-sm text-[#495463]">{campaign.durationDays} days</td><td className="px-6 py-5"><Status status={campaign.status} /></td><td className="px-6 py-5"><div className="flex items-center justify-end gap-1">{campaign.status === "approved" && <Link title={`Start ${campaign.name}`} aria-label={`Start ${campaign.name}`} href={campaignBlueprintHref(campaign)} className="mr-2 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0869e8] px-3 text-xs font-extrabold text-white transition hover:bg-[#0058bc]"><Icon name="play" className="h-4 w-4" />Start</Link>}<ActionButton label={`View ${campaign.name}`} icon="eye" onClick={() => setViewingCampaign(campaign)} /><ActionButton label={`Edit ${campaign.name}`} icon="edit" onClick={() => editCampaign(campaign)} /><ActionButton label={`Delete ${campaign.name}`} icon="delete" danger onClick={() => setDeletingCampaign(campaign)} /></div></td></tr>)}</tbody></table></div>
          {!campaignRows.length && <div className="px-6 py-16 text-center text-sm text-[#737d8b]">No campaigns match your search.</div>}
          <div className="flex items-center justify-between border-t border-[#e9eff8] px-6 py-4 text-xs font-semibold text-[#737d8b]"><span>Showing {campaignRows.length} of {campaigns.length} campaigns</span><span>Page 1 of 1</span></div>
        </section>
      </section>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#071b33]/55 p-3 backdrop-blur-[2px] sm:p-6" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title" className="my-auto w-full max-w-[980px] rounded-xl border border-[#d3e4fe] bg-white shadow-2xl">
        <form onSubmit={submit}>
          <div className="flex items-start justify-between border-b border-[#e5edf8] px-6 py-5 sm:px-8"><div><p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#717786]">{editingId ? "Edit Campaign" : "New Campaign"}</p><h2 id="campaign-modal-title" className="mt-2 text-2xl font-black">{editingId ? "Update Campaign Data" : "Create Campaign Data"}</h2></div><div className="flex items-center gap-3"><span className={`rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.18em] ${saved ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#0869e8]"}`}>{saved ? "Saved" : "Ready"}</span><button aria-label="Close campaign modal" onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-[#657080] hover:bg-[#eff4ff]" type="button"><Icon name="close" /></button></div></div>
          <div className="grid gap-6 px-6 py-6 sm:px-8">
            <FieldLabel label="Primary Objective"><input autoFocus value={form.primaryObjective} onChange={(e) => update("primaryObjective", e.target.value)} className="h-14 rounded-lg border border-[#bdd7ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel>
            <ChoiceGroup label="Target Platforms">{platforms.map((item) => <Choice key={item.label} active={form.targetPlatforms.includes(item.label)} onClick={() => toggle("targetPlatforms", item.label)} className="h-14 justify-start px-5"><Icon name={item.icon} />{item.label}</Choice>)}</ChoiceGroup>
            <ChoiceGroup label="Tone of Voice" compact>{tones.map((tone) => <Choice key={tone} active={form.toneOfVoice.includes(tone)} onClick={() => toggle("toneOfVoice", tone)} className="h-12 px-4">{tone}</Choice>)}</ChoiceGroup>
            <div className="grid gap-4 sm:grid-cols-2"><FieldLabel label="Campaign Start Date"><input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className="h-14 rounded-lg border border-[#cfe0ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel><FieldLabel label="Campaign End Date"><input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} className="h-14 rounded-lg border border-[#cfe0ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel></div>
            {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-[#e5edf8] px-6 py-5 sm:flex-row sm:px-8">{editingId ? <button type="submit" className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#0869e8] px-6 text-sm font-bold text-white hover:bg-[#0058bc]"><Icon name="check" />Save Changes</button> : <button type="button" onClick={saveDraft} className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#0869e8] px-6 text-sm font-bold text-white hover:bg-[#0058bc]"><Icon name="check" />Save &amp; Approve</button>}</div>
        </form>
      </section></div>}

      {viewingCampaign && <ModalBackdrop onClose={() => setViewingCampaign(null)}><section role="dialog" aria-modal="true" aria-labelledby="view-campaign-title" className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#e5edf8] px-6 py-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#0869e8]">Campaign Detail</p><h2 id="view-campaign-title" className="mt-2 text-2xl font-black">{viewingCampaign.name}</h2></div><button type="button" aria-label="Close campaign detail" onClick={() => setViewingCampaign(null)} className="rounded-lg p-2 text-[#657080] hover:bg-[#eff4ff]"><Icon name="close" /></button></div><div className="grid gap-5 p-6 sm:grid-cols-2"><Detail label="Objective" value={viewingCampaign.goal} /><Detail label="Duration" value={`${viewingCampaign.durationDays} days`} /><Detail label="Status"><Status status={viewingCampaign.status} /></Detail><Detail label="Posting Frequency" value={viewingCampaign.postingFrequency} /><Detail label="Platforms"><div className="flex flex-wrap gap-2">{viewingCampaign.platforms.map((platform) => <span key={platform} className="rounded-md bg-[#eef4ff] px-2 py-1 text-xs font-bold capitalize text-[#075cbe]">{platform}</span>)}</div></Detail><Detail label="Content Pillars" value={viewingCampaign.contentPillars.join(", ")} /><div className="sm:col-span-2"><Detail label="Strategy" value={viewingCampaign.strategy} /></div><div className="sm:col-span-2"><Detail label="CTA Recommendation" value={viewingCampaign.ctaRecommendation} /></div></div><div className="flex flex-wrap justify-end gap-3 border-t border-[#e5edf8] px-6 py-5">{viewingCampaign.status === "approved" && <Link href={campaignBlueprintHref(viewingCampaign)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0869e8] px-5 text-sm font-bold text-white"><Icon name="play" />Start Campaign</Link>}<button type="button" onClick={() => { const campaign = viewingCampaign; setViewingCampaign(null); editCampaign(campaign); }} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#b8c8df] px-5 text-sm font-bold hover:bg-[#f7f9ff]"><Icon name="edit" />Edit Campaign</button></div></section></ModalBackdrop>}

      {deletingCampaign && <ModalBackdrop onClose={() => setDeletingCampaign(null)}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-campaign-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Icon name="delete" /></span><h2 id="delete-campaign-title" className="mt-5 text-xl font-black">Delete campaign?</h2><p className="mt-2 text-sm leading-6 text-[#657080]">Campaign <b className="text-[#071b33]">{deletingCampaign.name}</b> akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeletingCampaign(null)} className="h-11 rounded-lg border border-[#c8d4e5] px-5 text-sm font-bold hover:bg-[#f7f9ff]">Cancel</button><button type="button" onClick={deleteCampaign} className="inline-flex h-11 items-center gap-2 rounded-lg bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700"><Icon name="delete" />Delete</button></div></section></ModalBackdrop>}
    </main>
  );
}

function Sidebar() { return <aside className="border-b border-[#d3e4fe] bg-white lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r"><div className="flex items-center justify-between px-4 py-4"><Link href="/dashboard" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0864c9] text-white"><Icon name="check" /></span><span><b className="block text-base text-[#075cbe]">AI Marketing OS</b><small className="block text-[9px] font-bold uppercase tracking-[.2em] text-[#717786]">Enterprise Suite</small></span></Link></div><nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible">{navItems.map(([label, icon, href]) => <Link key={label} href={href} className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold ${label === "Campaigns" ? "bg-[#0869e8] text-white" : "text-[#26384d] hover:bg-[#eff4ff]"}`}><Icon name={icon} />{label}</Link>)}</nav><div className="hidden border-t border-[#d3e4fe] p-4 lg:block"><Link href="/settings" className="inline-flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold hover:bg-[#eff4ff]"><Icon name="settings" />Settings</Link><div className="mt-3 flex items-center gap-3 rounded-lg bg-[#eff4ff] p-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075cbe] text-xs font-black text-white">SJ</span><span className="min-w-0 flex-1"><b className="block truncate text-xs">Sarah Jenkins</b><small className="text-[#717786]">Admin</small></span><Icon name="chevronDown" /></div></div></aside> }
function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</span>{children}</label> }
function ChoiceGroup({ label, children, compact = false }: { label: string; children: React.ReactNode; compact?: boolean }) { return <div className="grid gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</span><div className={compact ? "flex flex-wrap gap-2" : "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"}>{children}</div></div> }
function Choice({ active, onClick, className, children }: { active: boolean; onClick: () => void; className: string; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`inline-flex items-center gap-3 rounded-lg border text-sm font-semibold transition ${className} ${active ? "border-[#0869e8] bg-[#eff4ff] text-[#075cbe]" : "border-[#cfe0ff] text-[#414755] hover:bg-[#f7f9ff]"}`}>{children}</button> }
function ActionButton({ label, icon, onClick, danger = false }: { label: string; icon: IconName; onClick: () => void; danger?: boolean }) { return <button type="button" title={label} aria-label={label} onClick={onClick} className={`rounded-lg p-2 transition ${danger ? "text-[#7d8794] hover:bg-rose-50 hover:text-rose-600" : "text-[#657080] hover:bg-[#eaf3ff] hover:text-[#0869e8]"}`}><Icon name={icon} className="h-[18px] w-[18px]" /></button> }
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#071b33]/55 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>{children}</div> }
function Detail({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) { return <div><p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#7a8390]">{label}</p>{children ?? <p className="mt-2 text-sm font-semibold capitalize leading-6 text-[#27384b]">{value}</p>}</div> }
function Status({ status }: { status: string }) { const style = status === "approved" ? "bg-emerald-50 text-emerald-700" : status === "review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"; return <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] ${style}`}>{status === "review" ? "In review" : status}</span> }
function objectiveToGoal(objective: string): Campaign["goal"] { const value = objective.toLowerCase(); if (value.includes("sale")) return "sales"; if (value.includes("promo")) return "promotion"; if (value.includes("educat")) return "education"; if (value.includes("event")) return "event"; return "awareness"; }
function durationFromDates(start: string, end: string): Campaign["durationDays"] { const days = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1); return days <= 7 ? 7 : days <= 14 ? 14 : 30; }
function campaignBlueprintHref(campaign: Campaign) { const start = "2026-07-01"; const endDay = campaign.durationDays === 7 ? "07" : campaign.durationDays === 14 ? "14" : "30"; const params = new URLSearchParams({ name: campaign.name, objective: campaign.goal.charAt(0).toUpperCase() + campaign.goal.slice(1), platforms: campaign.platforms.join(","), tone: "Visionary,Reliable,Professional", start, end: `2026-07-${endDay}` }); return `/campaigns/blueprint?${params}`; }
function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) { const paths: Record<IconName, React.ReactNode> = { add:<path d="M12 5v14M5 12h14"/>, analytics:<path d="M4 19V5M9 19V9M14 19v-6M19 19V7"/>, assets:<path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>, brands:<path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/>, calendar:<path d="M7 3v4M17 3v4M4 9h16M5 5h14v15H4V6a1 1 0 0 1 1-1Z"/>, campaign:<path d="M4 13V7l10-3v14L4 15v-2Zm10-3h3a3 3 0 0 1 0 6h-3M7 15l2 5"/>, check:<path d="m5 12 4 4L19 6"/>, chevronDown:<path d="m6 9 6 6 6-6"/>, close:<path d="M6 6l12 12M18 6 6 18"/>, dashboard:<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>, delete:<><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>, edit:<><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></>, eye:<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>, layers:<path d="m12 3 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4"/>, movie:<path d="M4 5h16v14H4zM8 5l2 4M14 5l2 4M4 9h16"/>, play:<path d="m8 5 11 7-11 7V5Z"/>, post:<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>, search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>, settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></>, spark:<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/> }; return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">{paths[name]}</svg> }
