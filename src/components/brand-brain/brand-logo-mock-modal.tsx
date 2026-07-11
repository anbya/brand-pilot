"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { BrandLogo, BrandLogoPreviewBackground, BrandLogoType } from "@/lib/brand-brain/types";

const maximumFileSize = 5 * 1024 * 1024;
const supportedMimeTypes = new Set(["image/svg+xml", "image/png", "image/jpeg", "image/webp"]);
const logoTypes: Array<{ value: BrandLogoType; label: string }> = [
  { value: "primary", label: "Primary Logo" },
  { value: "secondary", label: "Secondary Logo" },
  { value: "icon", label: "Icon or Symbol" },
  { value: "monochrome", label: "Monochrome Logo" },
  { value: "light", label: "Light Version" },
  { value: "dark", label: "Dark Version" },
];
const previewBackgrounds: Array<{ value: BrandLogoPreviewBackground; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "transparent", label: "Transparent Grid" },
];

type LogoDraft = {
  displayName: string;
  logoType: BrandLogoType | "";
  previewBackground: BrandLogoPreviewBackground | "";
  fileName: string;
  fileType: BrandLogo["fileType"] | "";
  previewUrl: string;
  selectedFile: File | null;
};

export function BrandLogoMockModal({
  currentLogo,
  isOpen,
  onClose,
  onSave,
}: {
  currentLogo: BrandLogo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (logo: BrandLogo) => void;
}) {
  const [draft, setDraft] = useState<LogoDraft>(() => createDraft(currentLogo));
  const [fileError, setFileError] = useState("");
  const displayNameEditedRef = useRef(false);
  const temporaryUrlRef = useRef<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => () => {
    const temporaryUrl = temporaryUrlRef.current;
    if (temporaryUrl && !savedRef.current) URL.revokeObjectURL(temporaryUrl);
  }, []);

  const displayNameError = !draft.displayName.trim()
    ? "Display Name is required."
    : draft.displayName.length > 80
      ? "Display Name can contain up to 80 characters."
      : "";
  const isValid = Boolean(
    draft.previewUrl &&
    draft.logoType &&
    draft.previewBackground &&
    draft.fileName &&
    draft.fileType &&
    !displayNameError &&
    !fileError,
  );

  const previewStyle = useMemo(() => previewBackgroundStyle(draft.previewBackground), [draft.previewBackground]);

  if (!isOpen) return null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!supportedMimeTypes.has(file.type)) {
      setFileError("Unsupported file format. Choose an SVG, PNG, JPG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > maximumFileSize) {
      setFileError("Logo files must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const previousTemporaryUrl = temporaryUrlRef.current;
    if (previousTemporaryUrl) URL.revokeObjectURL(previousTemporaryUrl);
    const previewUrl = URL.createObjectURL(file);
    temporaryUrlRef.current = previewUrl;
    const autoDisplayName = displayNameFromFileName(file.name);

    setDraft((current) => ({
      ...current,
      displayName: displayNameEditedRef.current ? current.displayName : autoDisplayName,
      fileName: file.name,
      fileType: fileTypeFromMime(file.type),
      previewUrl,
      selectedFile: file,
    }));
    setFileError("");
  }

  function save() {
    if (!isValid || !draft.logoType || !draft.previewBackground || !draft.fileType) return;
    savedRef.current = true;
    onSave({
      id: currentLogo?.id ?? `mock-logo-${Date.now()}`,
      displayName: draft.displayName.trim(),
      logoType: draft.logoType,
      previewBackground: draft.previewBackground,
      fileName: draft.fileName,
      fileType: draft.fileType,
      previewUrl: draft.previewUrl,
      alt: `${draft.displayName.trim()} logo`,
    });
  }

  return (
    <BrandBrainDialog
      title="Change Brand Logo"
      description="Upload and preview the logo used across your brand content."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-5 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-[#78aef5]">Cancel</button>
          <button type="button" onClick={save} disabled={!isValid} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white transition hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-[#78aef5] disabled:cursor-not-allowed disabled:bg-[#aab8ca]">Save Changes</button>
        </>
      }
    >
      <div className="grid gap-6">
        <section className={`flex min-h-52 items-center justify-center rounded-xl border-2 border-dashed border-[#b9c9e1] p-8 transition ${previewStyle.className}`} style={previewStyle.style}>
          {draft.previewUrl ? (
            <Image src={draft.previewUrl} width={220} height={160} unoptimized={draft.previewUrl.startsWith("blob:")} alt={draft.displayName ? `${draft.displayName} preview` : "Brand logo preview"} className="max-h-40 w-auto max-w-full object-contain" />
          ) : (
            <p className="text-sm font-bold text-[#657080]">No brand logo selected</p>
          )}
        </section>

        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-logo-file">
          Logo File
          <input id="brand-logo-file" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" aria-describedby={fileError ? "brand-logo-file-error" : "brand-logo-file-help"} onChange={handleFileChange} className="block w-full rounded-lg border border-[#c5d2e5] bg-white text-sm font-medium normal-case tracking-normal text-[#414755] file:mr-4 file:border-0 file:border-r file:border-[#c5d2e5] file:bg-[#eff4ff] file:px-4 file:py-3 file:text-sm file:font-bold file:text-[#0058bc] hover:file:bg-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-blue-100" />
          {fileError ? <span id="brand-logo-file-error" role="alert" className="normal-case tracking-normal text-rose-600">{fileError}</span> : <span id="brand-logo-file-help" className="normal-case tracking-normal text-[#717786]">SVG, PNG, JPG, JPEG, or WebP. Maximum 5 MB.</span>}
        </label>

        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-logo-display-name">
          Display Name
          <input id="brand-logo-display-name" value={draft.displayName} maxLength={80} aria-describedby={displayNameError ? "brand-logo-name-error" : undefined} onChange={(event) => { displayNameEditedRef.current = true; setDraft((current) => ({ ...current, displayName: event.target.value })); }} className={`h-11 rounded-lg border bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:ring-2 focus:ring-blue-100 ${displayNameError ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />
          {displayNameError ? <span id="brand-logo-name-error" className="normal-case tracking-normal text-rose-600">{displayNameError}</span> : null}
        </label>

        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]" htmlFor="brand-logo-type">
          Logo Type
          <select id="brand-logo-type" value={draft.logoType} onChange={(event) => setDraft((current) => ({ ...current, logoType: event.target.value as BrandLogoType }))} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100">
            {logoTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <fieldset>
          <legend className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Preview Background</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {previewBackgrounds.map((option) => (
              <label key={option.value} className={`cursor-pointer rounded-lg border px-3 py-3 text-center text-sm font-bold transition ${draft.previewBackground === option.value ? "border-[#0058bc] bg-[#eff4ff] text-[#0058bc]" : "border-[#c5d2e5] bg-white text-[#414755] hover:bg-[#f8faff]"}`}>
                <input type="radio" name="brand-logo-preview-background" value={option.value} checked={draft.previewBackground === option.value} onChange={() => setDraft((current) => ({ ...current, previewBackground: option.value }))} className="sr-only" />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <section className="rounded-lg border border-[#d3e4fe] bg-[#f8faff] p-4">
          <p className="text-sm font-extrabold text-[#0b1c30]">{draft.displayName || "Untitled Logo"}</p>
          <p className="mt-1 text-xs font-semibold text-[#657080]">{readableLogoType(draft.logoType)}{draft.fileType ? ` (${draft.fileType})` : ""}</p>
          <p className="mt-1 break-all text-xs text-[#717786]">{draft.fileName || "No file selected"}</p>
        </section>
      </div>
    </BrandBrainDialog>
  );
}

export function readableLogoType(type: BrandLogoType | "") {
  return logoTypes.find((option) => option.value === type)?.label ?? "Logo";
}

function createDraft(logo: BrandLogo | null): LogoDraft {
  return logo ? {
    displayName: logo.displayName,
    logoType: logo.logoType,
    previewBackground: logo.previewBackground,
    fileName: logo.fileName,
    fileType: logo.fileType,
    previewUrl: logo.previewUrl,
    selectedFile: null,
  } : {
    displayName: "",
    logoType: "primary",
    previewBackground: "light",
    fileName: "",
    fileType: "",
    previewUrl: "",
    selectedFile: null,
  };
}

function fileTypeFromMime(mimeType: string): BrandLogo["fileType"] {
  if (mimeType === "image/svg+xml") return "SVG";
  if (mimeType === "image/png") return "PNG";
  if (mimeType === "image/webp") return "WEBP";
  return "JPG";
}

function displayNameFromFileName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  return withoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function previewBackgroundStyle(background: BrandLogoPreviewBackground | "") {
  if (background === "dark") return { className: "bg-[#0b1c30]", style: undefined };
  if (background === "transparent") return {
    className: "bg-white",
    style: {
      backgroundImage: "linear-gradient(45deg,#dce4ef 25%,transparent 25%),linear-gradient(-45deg,#dce4ef 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#dce4ef 75%),linear-gradient(-45deg,transparent 75%,#dce4ef 75%)",
      backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
      backgroundSize: "16px 16px",
    },
  };
  return { className: "bg-[#f8faff]", style: undefined };
}
