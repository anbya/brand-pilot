"use client";

import { useRef, useState } from "react";
import { DedicatedInputPageShell } from "@/components/calendar/dedicated-input-page-shell";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { normalizeHashtags } from "@/lib/calendar/form-utils";
import { assetLibraryMockData } from "@/lib/assets/mock-data";
import type { ManualPostInput } from "@/lib/calendar/manual-post-types";
import { formatAssetTypeLabel, formatPlatformLabel, platformAssetTypes, platformOptions } from "@/lib/calendar/platform-options";
import type { ContentObjective, ContentPillar, SocialPlatform } from "@/lib/calendar/types";
import { WizardStepper } from "@/components/ui/wizard-stepper";
import { isCampaignUsableForContent } from "@/lib/campaign-status";
import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { validatePlanningRange } from "@/lib/billing/entitlements";

export type SchedulePostPayload = ManualPostInput;

type SchedulePostDialogProps = { open: boolean; pillars: ContentPillar[]; defaultDate?: string; initialPayload?: SchedulePostPayload; presentation?: "dialog" | "page"; onClose: () => void; onSubmit: (payload: SchedulePostPayload) => void };
type StrategyDraft = SchedulePostPayload["idea"];
type VersionDraft = Omit<SchedulePostPayload["versions"][number], "hashtags"> & { hashtags: string };
type Errors = Record<string, string>;

const steps = ["Strategy", "Platforms", "Idea Draft", "Review"];
const fieldClass = "bp-field";
const linkedCampaigns = dashboardMockData.campaigns.filter((campaign) => isCampaignUsableForContent(campaign.status));
const textareaClass = "bp-field";

function createVersion(platform: SocialPlatform, defaultDate: string): VersionDraft {
  void defaultDate;
  return { platform, assetType: platformAssetTypes[platform][0], headline: "", caption: "", cta: "", hashtags: "", assetId: "", visualBrief: "", publishDate: "", publishTime: "", timezone: "Asia/Jakarta", createdBy: "Wanda" };
}
function createInitialVersions(initialPayload: SchedulePostPayload | undefined, defaultDate: string): Partial<Record<SocialPlatform, VersionDraft>> { if (!initialPayload) return { instagram: createVersion("instagram", defaultDate) }; return Object.fromEntries(initialPayload.versions.map((version) => [version.platform, { ...version, hashtags: version.hashtags.join(", ") }])) as Partial<Record<SocialPlatform, VersionDraft>>; }

export function SchedulePostDialog({ open, pillars, defaultDate = "2026-07-01", initialPayload, presentation = "dialog", onClose, onSubmit }: SchedulePostDialogProps) {
  const dirtyRef = useRef(false);
  const [step, setStep] = useState(0);
  const [strategy, setStrategy] = useState<StrategyDraft>(() => initialPayload?.idea ?? { title: "", coreTopic: "", pillarId: pillars[0]?.id ?? "", objective: "educate", targetAudience: "", mainMessage: "", campaignId: "", campaignName: "", brandId: "brand-default", brandName: "Default Brand" });
  const [versions, setVersions] = useState<Partial<Record<SocialPlatform, VersionDraft>>>(() => createInitialVersions(initialPayload, defaultDate));
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(() => initialPayload?.versions[0]?.platform ?? "instagram");
  const [errors, setErrors] = useState<Errors>({});

  if (!open) return null;
  const selectedPlatforms = platformOptions.map(({ value }) => value).filter((platform) => Boolean(versions[platform]));
  function requestClose() { if (!dirtyRef.current || window.confirm("Discard unsaved post changes?")) onClose(); }

  function clearError(key: string) { setErrors((current) => { if (!current[key]) return current; const next = { ...current }; delete next[key]; return next; }); }
  function updateStrategy<Key extends keyof StrategyDraft>(key: Key, value: StrategyDraft[Key]) { dirtyRef.current = true; setStrategy((current) => ({ ...current, [key]: value })); clearError(`strategy-${key}`); }
  function updateVersion<Key extends keyof VersionDraft>(platform: SocialPlatform, key: Key, value: VersionDraft[Key]) { dirtyRef.current = true; setVersions((current) => ({ ...current, [platform]: current[platform] ? { ...current[platform], [key]: value } : current[platform] })); clearError(`${platform}-${key}`); }
  function focusField(id: string) { window.requestAnimationFrame(() => document.getElementById(id)?.focus()); }

  function validateStrategy() {
    const next: Errors = {};
    const required: Array<[keyof StrategyDraft, string]> = [["title", "Content title"], ["coreTopic", "Core topic"], ["pillarId", "Content pillar"], ["objective", "Objective"], ["targetAudience", "Target audience"], ["mainMessage", "Main message"]];
    for (const [key, label] of required) if (!String(strategy[key] ?? "").trim()) next[`strategy-${key}`] = `${label} is required.`;
    setErrors(next); const first = Object.keys(next)[0]; if (first) focusField(first); return !first;
  }
  function validatePlatforms() { if (selectedPlatforms.length) { setErrors({}); return true; } setErrors({ platforms: "Select at least one platform." }); focusField("platform-instagram"); return false; }
  function validateVersions() {
    const next: Errors = {};
    for (const platform of selectedPlatforms) { const draft = versions[platform]; if (!draft) continue; for (const key of ["assetType", "headline", "caption", "cta", "timezone", "createdBy"] as const) if (!String(draft[key]).trim()) next[`${platform}-${key}`] = `${formatAssetTypeLabel(key)} is required.`; if (draft.publishDate) { const range = validatePlanningRange({ subscription: workspaceSubscriptionMock, startDate: draft.publishDate, endDate: draft.publishDate, referenceDate: defaultDate }); if (!range.valid) next[`${platform}-publishDate`] = range.message; } }
    setErrors(next); const first = Object.keys(next)[0]; if (first) { const platform = first.split("-")[0] as SocialPlatform; if (selectedPlatforms.includes(platform)) setActivePlatform(platform); focusField(first); } return !first;
  }
  function nextStep() { const valid = step === 0 ? validateStrategy() : step === 1 ? validatePlatforms() : step === 2 ? validateVersions() : true; if (valid) { setErrors({}); setStep((current) => Math.min(current + 1, 3)); } }
  function togglePlatform(platform: SocialPlatform) { dirtyRef.current = true; setVersions((current) => { if (current[platform]) { const next = { ...current }; delete next[platform]; const remaining = platformOptions.map(({ value }) => value).filter((value) => Boolean(next[value])); if (activePlatform === platform && remaining[0]) setActivePlatform(remaining[0]); return next; } setActivePlatform(platform); return { ...current, [platform]: createVersion(platform, defaultDate) }; }); clearError("platforms"); }
  function submit() { if (!validateStrategy() || !validatePlatforms() || !validateVersions()) return; dirtyRef.current = false; onSubmit({ idea: { ...strategy, campaignId: strategy.campaignId?.trim() || undefined, campaignName: strategy.campaignName?.trim() || undefined, brandId: strategy.brandId?.trim() || undefined, brandName: strategy.brandName?.trim() || undefined }, versions: selectedPlatforms.flatMap((platform) => { const draft = versions[platform]; return draft ? [{ ...draft, assetId: draft.assetId?.trim() || undefined, visualBrief: draft.visualBrief?.trim() || undefined, hashtags: normalizeHashtags(draft.hashtags) }] : []; }) }); }

  const footer = <><button type="button" onClick={requestClose} className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#657080] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#0058bc]">Cancel</button><div className="flex w-full flex-wrap gap-2 min-[480px]:w-auto">{step > 0 && <button type="button" onClick={() => { setErrors({}); setStep((current) => current - 1); }} className="min-h-11 flex-1 rounded-lg border border-[#c5d2e5] bg-white px-5 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc] min-[480px]:flex-none">Back</button>}{step < 3 ? <button type="button" onClick={nextStep} className="min-h-11 flex-1 rounded-lg bg-[#0058bc] px-5 py-2.5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2 min-[480px]:flex-none">Next</button> : <button type="button" onClick={submit} className="min-h-11 flex-1 rounded-lg bg-[#0058bc] px-5 py-2.5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2 min-[480px]:flex-none">Save Draft &amp; Generate Ideas</button>}</div></>;

  const content = <>
    <WizardStepper label="Create post steps" steps={steps} current={step} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
        {step === 0 && <StrategyStep strategy={strategy} pillars={pillars} errors={errors} onChange={updateStrategy} />}
        {step === 1 && <PlatformStep selected={selectedPlatforms} error={errors.platforms} onToggle={togglePlatform} />}
        {step === 2 && <ContentStep platforms={selectedPlatforms} versions={versions} activePlatform={activePlatform} errors={errors} onActivePlatform={setActivePlatform} onChange={updateVersion} />}
        {step === 3 && <ReviewStep strategy={strategy} versions={versions} platforms={selectedPlatforms} pillars={pillars} />}
      </div>
  </>;
  if (presentation === "page") return <DedicatedInputPageShell title={initialPayload ? "Edit Idea Draft" : "Create Content"} description="Save an Idea Draft and automatically create editable Generated Ideas in Content List. Scheduling starts after approval generates content." footer={footer}>{content}</DedicatedInputPageShell>;
  return <ResponsiveOverlayShell open title={initialPayload ? "Edit Idea Draft" : "Create Content"} description="Saving automatically creates editable Generated Ideas in Content List. Scheduling starts after approval generates content." footer={footer} maxWidth="max-w-[900px]" bodyScrollable={false} bodyClassName="flex flex-col p-0" closeLabel="Close idea draft dialog" onClose={requestClose}>{content}</ResponsiveOverlayShell>;
}

function FieldError({ id, message }: { id: string; message?: string }) { return message ? <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-rose-600">{message}</p> : null; }
function Field({ id, label, error, children, optional = false }: { id: string; label: string; error?: string; children: React.ReactNode; optional?: boolean }) { return <label className="block" htmlFor={id}><span className="mb-2 block text-xs font-extrabold uppercase tracking-[.1em] text-[#657080]">{label}{optional && <span className="ml-1 font-medium normal-case tracking-normal text-[#a1a9b5]">(optional)</span>}</span>{children}<FieldError id={id} message={error} /></label>; }

function StrategyStep({ strategy, pillars, errors, onChange }: { strategy: StrategyDraft; pillars: ContentPillar[]; errors: Errors; onChange: <Key extends keyof StrategyDraft>(key: Key, value: StrategyDraft[Key]) => void }) {
  return <div><h3 className="text-lg font-extrabold">Content strategy</h3><p className="mt-1 text-sm text-[#657080]">Define the shared strategic foundation for every platform version.</p><div className="mt-5 grid gap-5 sm:grid-cols-2">
    <Field id="strategy-title" label="Content Title" error={errors["strategy-title"]}><input id="strategy-title" autoFocus value={strategy.title} onChange={(event) => onChange("title", event.target.value)} placeholder="Coffee Brewing Basics" aria-invalid={Boolean(errors["strategy-title"])} aria-describedby={errors["strategy-title"] ? "strategy-title-error" : undefined} className={fieldClass} /></Field>
    <Field id="strategy-coreTopic" label="Core Topic" error={errors["strategy-coreTopic"]}><input id="strategy-coreTopic" value={strategy.coreTopic} onChange={(event) => onChange("coreTopic", event.target.value)} placeholder="Beginner coffee brewing techniques" aria-invalid={Boolean(errors["strategy-coreTopic"])} className={fieldClass} /></Field>
    <Field id="strategy-pillarId" label="Content Pillar" error={errors["strategy-pillarId"]}><select id="strategy-pillarId" value={strategy.pillarId} onChange={(event) => onChange("pillarId", event.target.value)} aria-invalid={Boolean(errors["strategy-pillarId"])} className={fieldClass}>{pillars.map((pillar) => <option key={pillar.id} value={pillar.id}>{pillar.name}</option>)}</select></Field>
    <Field id="strategy-objective" label="Objective" error={errors["strategy-objective"]}><select id="strategy-objective" value={strategy.objective} onChange={(event) => onChange("objective", event.target.value as ContentObjective)} className={fieldClass}>{["educate", "engage", "inform", "sell"].map((value) => <option key={value} value={value}>{formatAssetTypeLabel(value)}</option>)}</select></Field>
    <Field id="strategy-targetAudience" label="Target Audience" error={errors["strategy-targetAudience"]}><input id="strategy-targetAudience" value={strategy.targetAudience} onChange={(event) => onChange("targetAudience", event.target.value)} placeholder="Young professionals and home brewers" aria-invalid={Boolean(errors["strategy-targetAudience"])} className={fieldClass} /></Field>
    <Field id="strategy-brandName" label="Brand Name" optional><input id="strategy-brandName" value={strategy.brandName ?? ""} onChange={(event) => onChange("brandName", event.target.value)} placeholder="Default Brand" className={fieldClass} /></Field>
    <Field id="strategy-brandId" label="Brand ID" optional><input id="strategy-brandId" value={strategy.brandId ?? ""} onChange={(event) => onChange("brandId", event.target.value)} placeholder="brand-default" className={fieldClass} /></Field>
    <Field id="strategy-campaignName" label="Campaign Name" optional><input id="strategy-campaignName" value={strategy.campaignName ?? ""} onChange={(event) => onChange("campaignName", event.target.value)} placeholder="Summer Brew" className={fieldClass} /></Field>
    <Field id="strategy-campaignId" label="Linked Campaign" optional><select id="strategy-campaignId" value={strategy.campaignId ?? ""} onChange={(event) => { const campaign = linkedCampaigns.find((candidate) => candidate.id === event.target.value); onChange("campaignId", campaign?.id ?? ""); onChange("campaignName", campaign?.name ?? ""); onChange("brandId", campaign?.brandId ?? "brand-default"); onChange("brandName", campaign?.brandName ?? "Default Brand"); }} className={fieldClass}><option value="">No linked campaign</option>{linkedCampaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></Field>
    <div className="sm:col-span-2"><Field id="strategy-mainMessage" label="Main Message" error={errors["strategy-mainMessage"]}><textarea id="strategy-mainMessage" value={strategy.mainMessage} onChange={(event) => onChange("mainMessage", event.target.value)} placeholder="Great coffee can be brewed consistently at home." rows={4} aria-invalid={Boolean(errors["strategy-mainMessage"])} className={textareaClass} /></Field></div>
  </div></div>;
}

function PlatformStep({ selected, error, onToggle }: { selected: SocialPlatform[]; error?: string; onToggle: (platform: SocialPlatform) => void }) {
  return <div><h3 className="text-lg font-extrabold">Choose platforms</h3><p className="mt-1 text-sm text-[#657080]">Each selected platform creates its own editable content version.</p><fieldset className="mt-5"><legend className="sr-only">Social platforms</legend><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{platformOptions.map((option) => { const checked = selected.includes(option.value); return <label key={option.value} className={`cursor-pointer rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-[#0058bc] ${checked ? "border-[#0058bc] bg-[#eff4ff]" : "border-[#c5d2e5] hover:bg-[#f8faff]"}`}><input id={`platform-${option.value}`} type="checkbox" checked={checked} onChange={() => onToggle(option.value)} className="h-4 w-4 accent-[#0058bc]" /><span className="ml-3 text-sm font-extrabold">{option.label}</span><span className="mt-2 block text-xs text-[#657080]">{platformAssetTypes[option.value].map(formatAssetTypeLabel).join(", ")}</span></label>; })}</div><FieldError id="platforms" message={error} /></fieldset></div>;
}

function ContentStep({ platforms, versions, activePlatform, errors, onActivePlatform, onChange }: { platforms: SocialPlatform[]; versions: Partial<Record<SocialPlatform, VersionDraft>>; activePlatform: SocialPlatform; errors: Errors; onActivePlatform: (platform: SocialPlatform) => void; onChange: <Key extends keyof VersionDraft>(platform: SocialPlatform, key: Key, value: VersionDraft[Key]) => void }) {
  const draft = versions[activePlatform]; if (!draft) return <p className="text-sm text-rose-600">Select at least one platform to continue.</p>;
  const error = (key: keyof VersionDraft) => errors[`${activePlatform}-${key}`];
  return <div><div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Platform versions">{platforms.map((platform) => <button key={platform} type="button" role="tab" aria-selected={activePlatform === platform} onClick={() => onActivePlatform(platform)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] ${activePlatform === platform ? "bg-[#0058bc] text-white" : "bg-[#e5eeff] text-[#414755]"}`}>{formatPlatformLabel(platform)}</button>)}</div><div className="mt-5 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.1em] text-[#0058bc]">Platform version</p><h3 className="mt-1 text-lg font-extrabold">{formatPlatformLabel(activePlatform)}</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#657080]">Asia/Jakarta</span></div><div className="mt-5 grid gap-5 sm:grid-cols-2">
    <Field id={`${activePlatform}-assetType`} label="Asset Type" error={error("assetType")}><select id={`${activePlatform}-assetType`} value={draft.assetType} onChange={(event) => onChange(activePlatform, "assetType", event.target.value)} className={fieldClass}>{platformAssetTypes[activePlatform].map((type) => <option key={type} value={type}>{formatAssetTypeLabel(type)}</option>)}</select></Field>
    <Field id={`${activePlatform}-headline`} label="Headline" error={error("headline")}><input id={`${activePlatform}-headline`} value={draft.headline} onChange={(event) => onChange(activePlatform, "headline", event.target.value)} aria-invalid={Boolean(error("headline"))} className={fieldClass} /></Field>
    <div className="sm:col-span-2"><Field id={`${activePlatform}-caption`} label="Caption" error={error("caption")}><textarea id={`${activePlatform}-caption`} value={draft.caption} onChange={(event) => onChange(activePlatform, "caption", event.target.value)} rows={5} aria-invalid={Boolean(error("caption"))} className={textareaClass} /></Field></div>
    <Field id={`${activePlatform}-cta`} label="CTA" error={error("cta")}><input id={`${activePlatform}-cta`} value={draft.cta} onChange={(event) => onChange(activePlatform, "cta", event.target.value)} placeholder="Save this guide" aria-invalid={Boolean(error("cta"))} className={fieldClass} /></Field>
    <Field id={`${activePlatform}-hashtags`} label="Hashtags" optional><input id={`${activePlatform}-hashtags`} value={draft.hashtags} onChange={(event) => onChange(activePlatform, "hashtags", event.target.value)} placeholder="coffee, brewing, homebarista" className={fieldClass} /></Field>
    <Field id={`${activePlatform}-assetId`} label="Asset Library File" optional><select id={`${activePlatform}-assetId`} value={draft.assetId ?? ""} onChange={(event) => onChange(activePlatform, "assetId", event.target.value)} className={fieldClass}><option value="">No asset selected</option>{assetLibraryMockData.filter((asset) => asset.kind !== "document").map((asset) => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</select></Field>
    <Field id={`${activePlatform}-createdBy`} label="Created By" error={error("createdBy")}><input id={`${activePlatform}-createdBy`} value={draft.createdBy} onChange={(event) => onChange(activePlatform, "createdBy", event.target.value)} aria-invalid={Boolean(error("createdBy"))} className={fieldClass} /></Field>
    <div className="sm:col-span-2"><Field id={`${activePlatform}-visualBrief`} label="Visual Brief" optional><textarea id={`${activePlatform}-visualBrief`} value={draft.visualBrief ?? ""} onChange={(event) => onChange(activePlatform, "visualBrief", event.target.value)} rows={3} className={textareaClass} /></Field></div>
  </div></div></div>;
}

function ReviewStep({ strategy, versions, platforms, pillars }: { strategy: StrategyDraft; versions: Partial<Record<SocialPlatform, VersionDraft>>; platforms: SocialPlatform[]; pillars: ContentPillar[] }) {
  const pillar = pillars.find((item) => item.id === strategy.pillarId);
  return <div><h3 className="text-lg font-extrabold">Review idea draft</h3><p className="mt-1 text-sm text-[#657080]">Saving creates editable Generated Ideas in Content List and does not create a Calendar Post.</p><section className="mt-5 rounded-xl border border-[#d3e4fe] p-5"><h4 className="text-sm font-extrabold text-[#0058bc]">Idea summary</h4><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><ReviewItem label="Title" value={strategy.title} /><ReviewItem label="Core Topic" value={strategy.coreTopic} /><ReviewItem label="Content Pillar" value={pillar?.name ?? strategy.pillarId} /><ReviewItem label="Objective" value={formatAssetTypeLabel(strategy.objective)} /><ReviewItem label="Target Audience" value={strategy.targetAudience} /><ReviewItem label="Creation Source" value="Manual" /><ReviewItem label="Brand" value={strategy.brandName || "Not specified"} /><ReviewItem label="Linked Campaign" value={strategy.campaignName || strategy.campaignId || "Not linked"} /></dl></section><div className="mt-4 grid gap-4">{platforms.map((platform) => { const draft = versions[platform]; if (!draft) return null; return <section key={platform} className="rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-5"><h4 className="text-sm font-extrabold text-[#0058bc]">{formatPlatformLabel(platform)}</h4><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3"><ReviewItem label="Asset Type" value={formatAssetTypeLabel(draft.assetType)} /><ReviewItem label="Headline" value={draft.headline} /><ReviewItem label="Status" value="Generated after save" /><ReviewItem label="Created By" value={draft.createdBy} /></dl></section>; })}</div></div>;
}
function ReviewItem({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[#8b96a5]">{label}</dt><dd className="mt-1 font-semibold text-[#0b1c30]">{value}</dd></div>; }
