"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { BrandAsset, BrandAssetType, BrandAssetUsage } from "@/lib/brand-brain/types";

const maximumFileSize = 5 * 1024 * 1024;
const maximumTags = 8;
const maximumTagLength = 30;
const supportedMimeTypes = new Set(["image/svg+xml", "image/png", "image/jpeg", "image/webp"]);
const assetTypes: Array<{ value: BrandAssetType; label: string }> = [
  { value: "product-photo", label: "Product Photo" },
  { value: "lifestyle-photo", label: "Lifestyle Photo" },
  { value: "store-location", label: "Store or Location" },
  { value: "packaging", label: "Packaging" },
  { value: "logo", label: "Logo" },
  { value: "illustration", label: "Illustration" },
  { value: "icon", label: "Icon" },
  { value: "background", label: "Background" },
  { value: "template", label: "Template" },
  { value: "other", label: "Other" },
];
const usageOptions: Array<{ value: BrandAssetUsage; label: string }> = [
  { value: "social-media", label: "Social Media" },
  { value: "advertising", label: "Advertising" },
  { value: "website", label: "Website" },
  { value: "presentation", label: "Presentation" },
  { value: "campaign", label: "Campaign" },
  { value: "product-marketing", label: "Product Marketing" },
  { value: "general", label: "General" },
];

type AssetDraft = {
  selectedFile: File | null;
  previewUrl: string;
  name: string;
  assetType: BrandAssetType;
  description: string;
  tags: string[];
  usage: BrandAssetUsage[];
  isCoreAsset: boolean;
  replaceCoreAssetId: string;
  fileName: string;
  fileType: BrandAsset["fileType"] | "";
};

export function BrandAssetMockModal({
  currentAssets,
  isOpen,
  onClose,
  onSave,
}: {
  currentAssets: BrandAsset[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: BrandAsset, replaceCoreAssetId: string | null) => void;
}) {
  const [draft, setDraft] = useState<AssetDraft>(createEmptyDraft);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [fileError, setFileError] = useState("");
  const manuallyEditedNameRef = useRef(false);
  const temporaryUrlRef = useRef<string | null>(null);
  const savedRef = useRef(false);
  const coreAssets = currentAssets.filter((asset) => asset.isCoreAsset).slice(0, 3);
  const needsReplacement = draft.isCoreAsset && coreAssets.length >= 3;

  useEffect(() => () => {
    const temporaryUrl = temporaryUrlRef.current;
    if (temporaryUrl && !savedRef.current) URL.revokeObjectURL(temporaryUrl);
  }, []);

  if (!isOpen) return null;

  const fileRequiredError = !draft.selectedFile ? "Choose an asset file." : "";
  const nameError = !draft.name.trim()
    ? "Asset Name is required."
    : draft.name.length > 100
      ? "Asset Name can contain up to 100 characters."
      : "";
  const usageError = draft.usage.length ? "" : "Select at least one usage.";
  const replacementError = needsReplacement && !draft.replaceCoreAssetId
    ? "Choose one existing core asset to replace."
    : "";
  const isValid = Boolean(
    draft.selectedFile && draft.previewUrl && draft.assetType && draft.fileType &&
    !fileError && !nameError && !usageError && !replacementError,
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!supportedMimeTypes.has(file.type)) {
      setFileError("Unsupported file format. Choose an SVG, PNG, JPG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > maximumFileSize) {
      setFileError("Asset files must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const previousTemporaryUrl = temporaryUrlRef.current;
    if (previousTemporaryUrl) URL.revokeObjectURL(previousTemporaryUrl);
    const previewUrl = URL.createObjectURL(file);
    temporaryUrlRef.current = previewUrl;
    setDraft((current) => ({
      ...current,
      selectedFile: file,
      previewUrl,
      name: manuallyEditedNameRef.current ? current.name : displayNameFromFileName(file.name),
      fileName: file.name,
      fileType: fileTypeFromMime(file.type),
    }));
    setFileError("");
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#+/, "").trim();
    if (!tag) return setTagError("Enter a tag before adding it.");
    if (tag.length > maximumTagLength) return setTagError(`Tags can contain up to ${maximumTagLength} characters.`);
    if (draft.tags.length >= maximumTags) return setTagError(`You can add up to ${maximumTags} tags.`);
    if (draft.tags.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())) return setTagError("This tag has already been added.");
    setDraft((current) => ({ ...current, tags: [...current.tags, tag] }));
    setTagInput("");
    setTagError("");
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addTag();
  }

  function toggleUsage(usage: BrandAssetUsage) {
    setDraft((current) => ({
      ...current,
      usage: current.usage.includes(usage)
        ? current.usage.filter((item) => item !== usage)
        : [...current.usage, usage],
    }));
  }

  function save() {
    if (!isValid || !draft.fileType) return;
    savedRef.current = true;
    onSave({
      id: `mock-asset-${Date.now()}`,
      name: draft.name.trim(),
      imageUrl: draft.previewUrl,
      alt: draft.name.trim(),
      assetType: draft.assetType,
      description: draft.description.trim(),
      tags: [...draft.tags],
      usage: [...draft.usage],
      fileName: draft.fileName,
      fileType: draft.fileType,
      isCoreAsset: draft.isCoreAsset,
    }, needsReplacement ? draft.replaceCoreAssetId : null);
  }

  return (
    <BrandBrainDialog
      title="Upload Brand Asset"
      description="Add a visual asset that represents your brand consistently."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-5 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-[#78aef5]">Cancel</button>
          <button type="button" onClick={save} disabled={!isValid} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white transition hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-[#78aef5] disabled:cursor-not-allowed disabled:bg-[#aab8ca]">Add Asset</button>
        </>
      }
    >
      <div className="grid gap-6">
        <section className="flex min-h-52 items-center justify-center rounded-xl border-2 border-dashed border-[#b9c9e1] bg-[#f8faff] p-6">
          {draft.previewUrl ? <Image src={draft.previewUrl} width={360} height={220} unoptimized alt={draft.name || "New brand asset preview"} className="max-h-52 w-auto max-w-full rounded-lg object-contain" /> : <p className="text-sm font-bold text-[#657080]">Choose an image to preview</p>}
        </section>

        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-asset-file">Asset File<input id="brand-asset-file" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" aria-describedby="brand-asset-file-message" onChange={handleFileChange} className="block w-full rounded-lg border border-[#c5d2e5] bg-white text-sm font-medium normal-case tracking-normal text-[#414755] file:mr-4 file:border-0 file:border-r file:border-[#c5d2e5] file:bg-[#eff4ff] file:px-4 file:py-3 file:text-sm file:font-bold file:text-[#0058bc] hover:file:bg-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-blue-100" /><span id="brand-asset-file-message" className={`normal-case tracking-normal ${fileError || fileRequiredError ? "text-rose-600" : "text-[#717786]"}`}>{fileError || fileRequiredError || "SVG, PNG, JPG, JPEG, or WebP. Maximum 5 MB."}</span></label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-asset-name">Asset Name<input id="brand-asset-name" value={draft.name} maxLength={100} aria-describedby={nameError ? "brand-asset-name-error" : undefined} onChange={(event) => { manuallyEditedNameRef.current = true; setDraft((current) => ({ ...current, name: event.target.value })); }} className={`h-11 rounded-lg border bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:ring-2 focus:ring-blue-100 ${nameError ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />{nameError ? <span id="brand-asset-name-error" className="normal-case tracking-normal text-rose-600">{nameError}</span> : null}</label>
          <label className="grid content-start gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-asset-type">Asset Type<select id="brand-asset-type" value={draft.assetType} onChange={(event) => setDraft((current) => ({ ...current, assetType: event.target.value as BrandAssetType }))} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">{assetTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>

        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-asset-description">Description<textarea id="brand-asset-description" value={draft.description} maxLength={300} rows={4} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="resize-y rounded-lg border border-[#c5d2e5] bg-white p-3 text-sm font-medium normal-case leading-6 tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /><span className="text-right font-semibold normal-case tracking-normal text-[#717786]">{draft.description.length}/300</span></label>

        <section><label className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-asset-tag">Tags</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="brand-asset-tag" value={tagInput} maxLength={maximumTagLength + 1} onChange={(event) => { setTagInput(event.target.value.replace(/^#+/, "")); setTagError(""); }} onKeyDown={handleTagKeyDown} placeholder="e.g. coffee" className="h-11 min-w-0 flex-1 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={addTag} disabled={draft.tags.length >= maximumTags} className="h-11 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:border-[#c5d2e5] disabled:text-[#8b96a5]">Add</button></div>{tagError ? <p role="alert" className="mt-2 text-xs font-semibold text-rose-600">{tagError}</p> : null}<div className="mt-3 flex flex-wrap gap-2">{draft.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1.5 text-sm font-bold text-[#0058bc]">{tag}<button type="button" aria-label={`Remove ${tag} tag`} onClick={() => setDraft((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))}>×</button></span>)}</div></section>

        <fieldset><legend className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Usage</legend><div className="mt-2 flex flex-wrap gap-2">{usageOptions.map((option) => <label key={option.value} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold transition ${draft.usage.includes(option.value) ? "border-[#0058bc] bg-[#eff4ff] text-[#0058bc]" : "border-[#c5d2e5] bg-white text-[#414755] hover:bg-[#f8faff]"}`}><input type="checkbox" checked={draft.usage.includes(option.value)} onChange={() => toggleUsage(option.value)} className="sr-only" />{option.label}</label>)}</div>{usageError ? <p className="mt-2 text-xs font-semibold text-rose-600">{usageError}</p> : null}</fieldset>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4"><input type="checkbox" checked={draft.isCoreAsset} onChange={(event) => setDraft((current) => ({ ...current, isCoreAsset: event.target.checked, replaceCoreAssetId: event.target.checked ? current.replaceCoreAssetId : "" }))} className="mt-1 h-4 w-4 accent-[#0058bc]" /><span><span className="block text-sm font-extrabold text-[#0b1c30]">Set as Core Brand Asset</span><span className="mt-1 block text-xs leading-5 text-[#657080]">Core assets are highlighted on the Brand Brain overview and used as primary visual references.</span></span></label>

        {needsReplacement ? <fieldset><legend className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Replace Core Asset</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{coreAssets.map((asset) => <label key={asset.id} className={`cursor-pointer overflow-hidden rounded-xl border p-2 transition ${draft.replaceCoreAssetId === asset.id ? "border-[#0058bc] bg-[#eff4ff] ring-2 ring-blue-100" : "border-[#c5d2e5] bg-white hover:bg-[#f8faff]"}`}><input type="radio" name="replace-core-asset" value={asset.id} checked={draft.replaceCoreAssetId === asset.id} onChange={() => setDraft((current) => ({ ...current, replaceCoreAssetId: asset.id }))} className="sr-only" /><span className="relative block aspect-square overflow-hidden rounded-lg bg-[#eff4ff]"><Image src={asset.imageUrl} alt={asset.name} fill unoptimized={asset.imageUrl.startsWith("blob:")} className="object-cover" /></span><span className="mt-2 block truncate text-xs font-extrabold text-[#0b1c30]">{asset.name}</span><span className="mt-1 block text-[10px] font-semibold text-[#657080]">{readableAssetType(asset.assetType)}</span></label>)}</div>{replacementError ? <p className="mt-2 text-xs font-semibold text-rose-600">{replacementError}</p> : null}</fieldset> : null}
      </div>
    </BrandBrainDialog>
  );
}

function createEmptyDraft(): AssetDraft {
  return { selectedFile: null, previewUrl: "", name: "", assetType: "product-photo", description: "", tags: [], usage: [], isCoreAsset: false, replaceCoreAssetId: "", fileName: "", fileType: "" };
}

function readableAssetType(type: BrandAssetType) {
  return assetTypes.find((option) => option.value === type)?.label ?? "Other";
}

function fileTypeFromMime(mimeType: string): BrandAsset["fileType"] {
  if (mimeType === "image/svg+xml") return "SVG";
  if (mimeType === "image/png") return "PNG";
  if (mimeType === "image/webp") return "WEBP";
  return "JPG";
}

function displayNameFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (character) => character.toUpperCase());
}
