"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { campaigns as seedCampaigns, type Campaign } from "@/lib/mock-data";
import { normalizeSocialPlatforms, socialPlatformLabels, socialPlatforms, type SocialPlatform } from "@/lib/platforms";

type IconName = "add" | "analytics" | "assets" | "brands" | "calendar" | "campaign" | "check" | "chevronDown" | "close" | "dashboard" | "layers" | "movie" | "post" | "search" | "settings" | "spark";
type CampaignForm = { primaryObjective: string; targetPlatforms: SocialPlatform[]; toneOfVoice: string[]; startDate: string; endDate: string };

const platforms = socialPlatforms.map((value) => ({ value, label: socialPlatformLabels[value], icon: value === "instagram" ? "post" : value === "facebook" ? "campaign" : "movie" })) satisfies Array<{ value: SocialPlatform; label: string; icon: IconName }>;
const tones = ["Visionary", "Reliable", "Professional", "Friendly", "Bold", "Educational"];
const campaignStorageKey = "brand-pilot-campaigns";
const initialForm: CampaignForm = { primaryObjective: "", targetPlatforms: [], toneOfVoice: [], startDate: "2026-07-01", endDate: "2026-07-30" };
export default function CampaignsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All status");
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => seedCampaigns.map((campaign) => ({ ...campaign })));
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const restoreCampaigns = window.setTimeout(() => {
      try {
        const storedCampaigns = window.localStorage.getItem(campaignStorageKey);
        if (storedCampaigns) {
          const parsedCampaigns = JSON.parse(storedCampaigns) as unknown;
          if (Array.isArray(parsedCampaigns)) setCampaigns((parsedCampaigns as Campaign[]).map((campaign) => ({ ...campaign, platforms: normalizeSocialPlatforms(campaign.platforms, ["instagram"]) })));
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

  const campaignRows = campaigns.filter((campaign) => {
    const matchesQuery = campaign.name.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All status" || campaign.status === status);
  });

  function openModal() { setForm(initialForm); setError(""); setSaved(false); setModalOpen(true); }
  function update<K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) { setForm((current) => ({ ...current, [key]: value })); setError(""); setSaved(false); }
  function togglePlatform(value: SocialPlatform) { update("targetPlatforms", form.targetPlatforms.includes(value) ? form.targetPlatforms.filter((item) => item !== value) : [...form.targetPlatforms, value]); }
  function toggleTone(value: string) { update("toneOfVoice", form.toneOfVoice.includes(value) ? form.toneOfVoice.filter((item) => item !== value) : [...form.toneOfVoice, value]); }
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
    saveCampaign();
  }
  function saveCampaign() {
    const message = validate();
    if (message) return setError(message);

    const objective = form.primaryObjective.trim();
    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: objective,
      goal: objectiveToGoal(objective),
      platforms: form.targetPlatforms,
      durationDays: durationFromDates(form.startDate, form.endDate),
      status: "review",
      strategy: "Campaign strategy submitted and waiting for review.",
      contentPillars: form.toneOfVoice,
      postingFrequency: "Not configured",
      ctaRecommendation: "Not configured",
    };

    setCampaigns((current) => [newCampaign, ...current]);
    setSaved(true);
    setModalOpen(false);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-[#071b33]">
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
          <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead className="bg-[#f8faff] text-[11px] font-extrabold uppercase tracking-[.14em] text-[#727b89]"><tr><th className="px-6 py-4">Campaign</th><th className="px-6 py-4">Objective</th><th className="px-6 py-4">Platforms</th><th className="px-6 py-4">Duration</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#e9eff8]">{campaignRows.map((campaign) => <tr key={campaign.id}><td className="px-6 py-5"><p className="font-extrabold">{campaign.name}</p><p className="mt-1 text-xs text-[#7a8390]">Updated Jul 8, 2026</p></td><td className="px-6 py-5 text-sm capitalize text-[#495463]">{campaign.goal}</td><td className="px-6 py-5"><div className="flex flex-wrap gap-1.5">{campaign.platforms.map((item) => <span key={item} className="rounded-md bg-[#eef4ff] px-2 py-1 text-xs font-bold text-[#075cbe]">{socialPlatformLabels[item]}</span>)}</div></td><td className="px-6 py-5 text-sm text-[#495463]">{campaign.durationDays} days</td><td className="px-6 py-5"><Status status={campaign.status} /></td><td className="px-6 py-5 text-right"><Link href={campaignBlueprintHref(campaign)} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#bfd6f6] px-4 text-sm font-bold text-[#075cbe] outline-none transition hover:bg-[#eaf3ff] focus-visible:ring-2 focus-visible:ring-[#0869e8] focus-visible:ring-offset-2">View Campaign<span className="sr-only"> {campaign.name}</span></Link></td></tr>)}</tbody></table></div>
          {!campaignRows.length && <div className="px-6 py-16 text-center text-sm text-[#737d8b]">No campaigns match your search.</div>}
          <div className="flex items-center justify-between border-t border-[#e9eff8] px-6 py-4 text-xs font-semibold text-[#737d8b]"><span>Showing {campaignRows.length} of {campaigns.length} campaigns</span><span>Page 1 of 1</span></div>
        </section>
      </section>

      {modalOpen && <ResponsiveOverlayShell title="Create Campaign Data" eyebrow="New Campaign" headerAside={<span className={`hidden rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.18em] min-[420px]:inline-flex ${saved ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#0869e8]"}`}>{saved ? "Saved" : "Ready"}</span>} maxWidth="max-w-[980px]" footer={<button form="create-campaign-form" type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0869e8] px-6 text-sm font-bold text-white hover:bg-[#0058bc]"><Icon name="check" />Create Campaign</button>} closeLabel="Close campaign modal" onClose={() => setModalOpen(false)}>
        <form id="create-campaign-form" onSubmit={submit}>
          <div className="grid gap-6">
            <FieldLabel label="Primary Objective"><input autoFocus value={form.primaryObjective} onChange={(e) => update("primaryObjective", e.target.value)} className="h-14 rounded-lg border border-[#bdd7ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel>
            <ChoiceGroup label="Target Platforms">{platforms.map((item) => <Choice key={item.value} active={form.targetPlatforms.includes(item.value)} onClick={() => togglePlatform(item.value)} className="h-14 justify-start px-5"><Icon name={item.icon} />{item.label}</Choice>)}</ChoiceGroup>
            <ChoiceGroup label="Tone of Voice" compact>{tones.map((tone) => <Choice key={tone} active={form.toneOfVoice.includes(tone)} onClick={() => toggleTone(tone)} className="h-12 px-4">{tone}</Choice>)}</ChoiceGroup>
            <div className="grid gap-4 sm:grid-cols-2"><FieldLabel label="Campaign Start Date"><input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className="h-14 rounded-lg border border-[#cfe0ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel><FieldLabel label="Campaign End Date"><input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} className="h-14 rounded-lg border border-[#cfe0ff] px-5 outline-none focus:border-[#0869e8] focus:ring-4 focus:ring-blue-50" /></FieldLabel></div>
            {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
          </div>
        </form>
      </ResponsiveOverlayShell>}

    </main>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</span>{children}</label> }
function ChoiceGroup({ label, children, compact = false }: { label: string; children: React.ReactNode; compact?: boolean }) { return <div className="grid gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#717786]">{label}</span><div className={compact ? "flex flex-wrap gap-2" : "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"}>{children}</div></div> }
function Choice({ active, onClick, className, children }: { active: boolean; onClick: () => void; className: string; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`inline-flex items-center gap-3 rounded-lg border text-sm font-semibold transition ${className} ${active ? "border-[#0869e8] bg-[#eff4ff] text-[#075cbe]" : "border-[#cfe0ff] text-[#414755] hover:bg-[#f7f9ff]"}`}>{children}</button> }
function Status({ status }: { status: string }) { const style = status === "approved" ? "bg-emerald-50 text-emerald-700" : status === "review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"; return <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] ${style}`}>{status === "review" ? "In review" : status}</span> }
function objectiveToGoal(objective: string): Campaign["goal"] { const value = objective.toLowerCase(); if (value.includes("sale")) return "sales"; if (value.includes("promo")) return "promotion"; if (value.includes("educat")) return "education"; if (value.includes("event")) return "event"; return "awareness"; }
function durationFromDates(start: string, end: string): Campaign["durationDays"] { const days = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1); return days <= 7 ? 7 : days <= 14 ? 14 : 30; }
function campaignBlueprintHref(campaign: Campaign) { const start = "2026-07-01"; const endDay = campaign.durationDays === 7 ? "07" : campaign.durationDays === 14 ? "14" : "30"; const params = new URLSearchParams({ name: campaign.name, objective: campaign.goal.charAt(0).toUpperCase() + campaign.goal.slice(1), platforms: campaign.platforms.join(","), tone: "Visionary,Reliable,Professional", start, end: `2026-07-${endDay}` }); return `/campaigns/blueprint?${params}`; }
function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) { const paths: Record<IconName, React.ReactNode> = { add:<path d="M12 5v14M5 12h14"/>, analytics:<path d="M4 19V5M9 19V9M14 19v-6M19 19V7"/>, assets:<path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>, brands:<path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/>, calendar:<path d="M7 3v4M17 3v4M4 9h16M5 5h14v15H4V6a1 1 0 0 1 1-1Z"/>, campaign:<path d="M4 13V7l10-3v14L4 15v-2Zm10-3h3a3 3 0 0 1 0 6h-3M7 15l2 5"/>, check:<path d="m5 12 4 4L19 6"/>, chevronDown:<path d="m6 9 6 6 6-6"/>, close:<path d="M6 6l12 12M18 6 6 18"/>, dashboard:<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>, layers:<path d="m12 3 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4"/>, movie:<path d="M4 5h16v14H4zM8 5l2 4M14 5l2 4M4 9h16"/>, post:<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>, search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>, settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></>, spark:<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/> }; return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">{paths[name]}</svg> }
