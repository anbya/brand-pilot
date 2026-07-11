"use client";

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { BrandAsset, BrandAssetType, BrandAssetUsage } from "@/lib/brand-brain/types";

export const brandAssetTypes: Array<{ value: BrandAssetType; label: string }> = [
  { value: "product-photo", label: "Product Photo" }, { value: "lifestyle-photo", label: "Lifestyle Photo" },
  { value: "store-location", label: "Store or Location" }, { value: "packaging", label: "Packaging" },
  { value: "logo", label: "Logo" }, { value: "illustration", label: "Illustration" },
  { value: "icon", label: "Icon" }, { value: "background", label: "Background" },
  { value: "template", label: "Template" }, { value: "other", label: "Other" },
];
const usageOptions: Array<{ value: BrandAssetUsage; label: string }> = [
  { value: "social-media", label: "Social Media" }, { value: "advertising", label: "Advertising" },
  { value: "website", label: "Website" }, { value: "presentation", label: "Presentation" },
  { value: "campaign", label: "Campaign" }, { value: "product-marketing", label: "Product Marketing" },
  { value: "general", label: "General" },
];

export function EditBrandAssetMockModal({ asset, onClose, onSave }: { asset: BrandAsset; onClose: () => void; onSave: (asset: BrandAsset) => void }) {
  const [draft, setDraft] = useState<BrandAsset>(() => ({ ...asset, tags: [...asset.tags], usage: [...asset.usage] }));
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const nameError = !draft.name.trim() ? "Asset Name is required." : draft.name.length > 100 ? "Asset Name can contain up to 100 characters." : "";
  const usageError = draft.usage.length ? "" : "Select at least one usage.";
  const isValid = !nameError && !usageError && draft.description.length <= 300;
  const usageLabels = useMemo(() => new Map(usageOptions.map((item) => [item.value, item.label])), []);

  function addTag() {
    const tag = tagInput.trim().replace(/^#+/, "").trim();
    if (!tag) return setTagError("Enter a tag before adding it.");
    if (tag.length > 30) return setTagError("Tags can contain up to 30 characters.");
    if (draft.tags.length >= 8) return setTagError("You can add up to 8 tags.");
    if (draft.tags.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())) return setTagError("This tag has already been added.");
    setDraft((current) => ({ ...current, tags: [...current.tags, tag] })); setTagInput(""); setTagError("");
  }

  function submit(event: FormEvent) { event.preventDefault(); if (isValid) onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim(), alt: draft.name.trim(), tags: [...draft.tags], usage: [...draft.usage] }); }
  function tagKeyDown(event: KeyboardEvent<HTMLInputElement>) { if (event.key === "Enter") { event.preventDefault(); addTag(); } }
  function toggleUsage(value: BrandAssetUsage) { setDraft((current) => ({ ...current, usage: current.usage.includes(value) ? current.usage.filter((item) => item !== value) : [...current.usage, value] })); }

  return <BrandBrainDialog title="Edit Brand Asset" description="Update asset metadata without replacing the original file." onClose={onClose} footer={<><button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-5 text-sm font-bold text-[#414755] hover:bg-[#eff4ff]">Cancel</button><button form="edit-brand-asset-form" type="submit" disabled={!isValid} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white hover:bg-[#004493] disabled:cursor-not-allowed disabled:bg-[#aab8ca]">Save Changes</button></>}>
    <form id="edit-brand-asset-form" onSubmit={submit} className="grid gap-6">
      <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Asset Name<input value={draft.name} maxLength={100} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={`h-11 rounded-lg border px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:ring-2 focus:ring-blue-100 ${nameError ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />{nameError ? <span className="normal-case tracking-normal text-rose-600">{nameError}</span> : null}</label>
      <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Asset Type<select value={draft.assetType} onChange={(event) => setDraft((current) => ({ ...current, assetType: event.target.value as BrandAssetType }))} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">{brandAssetTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Description<textarea value={draft.description} maxLength={300} rows={4} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="resize-y rounded-lg border border-[#c5d2e5] p-3 text-sm font-medium normal-case leading-6 tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /><span className="text-right font-semibold normal-case tracking-normal text-[#717786]">{draft.description.length}/300</span></label>
      <section><label htmlFor="edit-asset-tag" className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Tags</label><div className="mt-2 flex gap-2"><input id="edit-asset-tag" value={tagInput} maxLength={31} onKeyDown={tagKeyDown} onChange={(event) => { setTagInput(event.target.value.replace(/^#+/, "")); setTagError(""); }} className="h-11 min-w-0 flex-1 rounded-lg border border-[#c5d2e5] px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={addTag} disabled={draft.tags.length >= 8} className="rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] disabled:border-[#c5d2e5] disabled:text-[#8b96a5]">Add</button></div>{tagError ? <p className="mt-2 text-xs font-semibold text-rose-600">{tagError}</p> : null}<div className="mt-3 flex flex-wrap gap-2">{draft.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1.5 text-sm font-bold text-[#0058bc]">{tag}<button type="button" aria-label={`Remove ${tag} tag`} onClick={() => setDraft((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))}>×</button></span>)}</div></section>
      <fieldset><legend className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Usage</legend><div className="mt-2 flex flex-wrap gap-2">{usageOptions.map((option) => <label key={option.value} title={usageLabels.get(option.value)} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold ${draft.usage.includes(option.value) ? "border-[#0058bc] bg-[#eff4ff] text-[#0058bc]" : "border-[#c5d2e5] text-[#414755]"}`}><input type="checkbox" className="sr-only" checked={draft.usage.includes(option.value)} onChange={() => toggleUsage(option.value)} />{option.label}</label>)}</div>{usageError ? <p className="mt-2 text-xs font-semibold text-rose-600">{usageError}</p> : null}</fieldset>
    </form>
  </BrandBrainDialog>;
}

export function readableBrandAssetType(type: BrandAssetType) { return brandAssetTypes.find((item) => item.value === type)?.label ?? "Other"; }
