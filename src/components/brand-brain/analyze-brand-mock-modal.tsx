"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { BrandAnalysis, BrandAnalysisSource } from "@/lib/brand-brain/types";

type Stage = "input" | "analyzing" | "complete";
type FileKey = "brandGuidelines" | "companyProfile" | "productCatalogue";
type MockFile = { file: File | null; fileName: string; size: number };
type AnalysisDraft = {
  websiteUrl: string;
  instagramUsername: string;
  youtubeChannel: string;
  brandGuidelines: MockFile;
  companyProfile: MockFile;
  productCatalogue: MockFile;
};

const maximumFileSize = 10 * 1024 * 1024;
const acceptedExtensions = new Set(["pdf", "doc", "docx", "ppt", "pptx"]);
const acceptedMimeTypes = new Set([
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);
const analysisSteps = [
  "Analyzing brand sources", "Identifying brand personality", "Reviewing communication style",
  "Evaluating visual assets", "Generating recommendations",
];

export function AnalyzeBrandMockModal({ currentAnalysis, isOpen, onClose, onComplete, onRunningChange, onViewRecommendation }: {
  currentAnalysis: BrandAnalysis; isOpen: boolean; onClose: () => void;
  onComplete: (analysis: BrandAnalysis, sourceCount: number) => string;
  onRunningChange: (running: boolean) => void; onViewRecommendation: () => void;
}) {
  const [draft, setDraft] = useState<AnalysisDraft>(() => draftFromAnalysis(currentAnalysis));
  const [stage, setStage] = useState<Stage>("input");
  const [progress, setProgress] = useState(0);
  const [fileErrors, setFileErrors] = useState<Partial<Record<FileKey, string>>>({});
  const [completedAt, setCompletedAt] = useState("");
  const [completedRecommendation, setCompletedRecommendation] = useState("");
  const intervalRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const completedRef = useRef(false);

  const websiteError = draft.websiteUrl.trim() && !isValidWebUrl(draft.websiteUrl.trim()) ? "Enter a valid URL beginning with http:// or https://." : "";
  const selectedSources = useMemo(() => sourceLabels(draft), [draft]);
  const isInputValid = selectedSources.length > 0 && !websiteError && !Object.values(fileErrors).some(Boolean);
  const activeStep = Math.min(5, Math.max(1, Math.ceil(progress / 20)));

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const closeSafely = useCallback(() => {
    cancelledRef.current = true;
    clearTimer();
    onRunningChange(false);
    onClose();
  }, [clearTimer, onClose, onRunningChange]);

  useEffect(() => () => { cancelledRef.current = true; clearTimer(); onRunningChange(false); }, [clearTimer, onRunningChange]);

  useEffect(() => {
    if (stage !== "analyzing") return;
    intervalRef.current = window.setInterval(() => setProgress((value) => Math.min(100, value + 4)), 100);
    return clearTimer;
  }, [clearTimer, stage]);

  useEffect(() => {
    if (stage !== "analyzing" || progress < 100 || completedRef.current || cancelledRef.current) return;
    completedRef.current = true;
    clearTimer();
    const sources = sourcesFromDraft(draft);
    const lastAnalyzedAt = new Date().toISOString();
    const recommendation = onComplete({ status: "complete", progress: 100, activeStep: 5, sources, lastAnalyzedAt }, selectedSources.length);
    setCompletedAt(lastAnalyzedAt);
    setCompletedRecommendation(recommendation);
    onRunningChange(false);
    setStage("complete");
  }, [clearTimer, draft, onComplete, onRunningChange, progress, selectedSources.length, stage]);

  if (!isOpen) return null;

  function selectFile(key: FileKey, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLocaleLowerCase() ?? "";
    if (!acceptedMimeTypes.has(file.type) && !acceptedExtensions.has(extension)) {
      setFileErrors((current) => ({ ...current, [key]: "Unsupported file. Choose PDF, DOC, DOCX, PPT, or PPTX." })); event.target.value = ""; return;
    }
    if (file.size > maximumFileSize) {
      setFileErrors((current) => ({ ...current, [key]: "Files must be 10 MB or smaller." })); event.target.value = ""; return;
    }
    setDraft((current) => ({ ...current, [key]: { file, fileName: file.name, size: file.size } }));
    setFileErrors((current) => ({ ...current, [key]: "" }));
  }

  function removeFile(key: FileKey) {
    setDraft((current) => ({ ...current, [key]: emptyFile() }));
    setFileErrors((current) => ({ ...current, [key]: "" }));
  }

  function startAnalysis() {
    if (!isInputValid || stage !== "input") return;
    cancelledRef.current = false; completedRef.current = false; setProgress(0); setStage("analyzing"); onRunningChange(true);
  }

  const footer = stage === "input" ? <><button type="button" onClick={closeSafely} className="h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755]">Cancel</button><button type="button" onClick={startAnalysis} disabled={!isInputValid} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#aab8ca]">Start Analysis</button></> : stage === "complete" ? <><button type="button" onClick={closeSafely} className="h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755]">Close</button><button type="button" onClick={onViewRecommendation} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white">View Updated Recommendation</button></> : null;

  return <BrandBrainDialog title="Analyze Brand Data" description="Add existing brand sources to simulate how AI builds a deeper understanding of your brand." onClose={closeSafely} footer={footer}>
    {stage === "input" ? <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080] sm:col-span-2">Brand Website URL<input type="url" value={draft.websiteUrl} aria-describedby={websiteError ? "analysis-website-error" : undefined} onChange={(event) => setDraft((current) => ({ ...current, websiteUrl: event.target.value }))} placeholder="https://coffeexyz.com" className={`h-11 rounded-lg border px-3 text-sm font-medium normal-case tracking-normal outline-none focus:ring-2 focus:ring-blue-100 ${websiteError ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />{websiteError ? <span id="analysis-website-error" className="normal-case tracking-normal text-rose-600">{websiteError}</span> : null}</label>
        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Instagram Username<input value={draft.instagramUsername} maxLength={100} onChange={(event) => setDraft((current) => ({ ...current, instagramUsername: event.target.value }))} placeholder="@coffeexyz" className="h-11 rounded-lg border border-[#c5d2e5] px-3 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label>
        <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">YouTube Channel<input value={draft.youtubeChannel} maxLength={200} onChange={(event) => setDraft((current) => ({ ...current, youtubeChannel: event.target.value }))} placeholder="youtube.com/@coffeexyz" className="h-11 rounded-lg border border-[#c5d2e5] px-3 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label>
      </div>
      <div className="grid gap-3">{([['brandGuidelines', 'Brand Guidelines File'], ['companyProfile', 'Company Profile File'], ['productCatalogue', 'Product Catalogue File']] as Array<[FileKey, string]>).map(([key, label]) => <MockFileField key={key} fieldKey={key} label={label} value={draft[key]} error={fileErrors[key] ?? ""} onSelect={selectFile} onRemove={removeFile} />)}</div>
      <section className="rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4"><h3 className="text-sm font-extrabold">Analysis Sources</h3>{selectedSources.length ? <ul className="mt-3 grid gap-2 text-sm text-[#414755]">{selectedSources.map((source) => <li key={source} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0058bc]" />{source}</li>)}</ul> : <p className="mt-2 text-sm font-semibold text-rose-600">Add at least one brand source to start the analysis.</p>}</section>
    </div> : stage === "analyzing" ? <AnalyzingState progress={progress} activeStep={activeStep} /> : <CompleteState sources={selectedSources} lastAnalyzedAt={completedAt} recommendation={completedRecommendation} />}
  </BrandBrainDialog>;
}

function AnalyzingState({ activeStep, progress }: { activeStep: number; progress: number }) { return <div className="py-4 text-center"><span className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#e5eeff] text-2xl text-[#0058bc]">✦</span><h3 className="mt-5 text-xl font-extrabold">Analyzing your brand</h3><p className="mt-2 text-sm leading-6 text-[#657080]">We are reviewing your brand identity, communication style, and visual references.</p><div className="mt-6" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="flex justify-between text-sm font-bold"><span>Analysis progress</span><span>{progress}%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e5eeff]"><div className="h-full rounded-full bg-[#0058bc] transition-[width] duration-100" style={{ width: `${progress}%` }} /></div></div><div className="mt-6 grid gap-2 text-left" aria-live="polite">{analysisSteps.map((step, index) => { const number = index + 1; const complete = number < activeStep || progress === 100; const active = number === activeStep && progress < 100; return <div key={step} className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold ${active ? "border-[#78aef5] bg-[#eff4ff] text-[#0058bc]" : complete ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#d3e4fe] text-[#8b96a5]"}`}><span>{step}</span><span>{complete ? "Complete ✓" : active ? "Active" : "Pending"}</span></div>; })}</div></div>; }
function CompleteState({ lastAnalyzedAt, recommendation, sources }: { lastAnalyzedAt: string; recommendation: string; sources: string[] }) { return <div className="py-4 text-center" aria-live="polite"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-700">✓</span><h3 className="mt-5 text-xl font-extrabold">Brand analysis complete</h3><p className="mt-2 text-sm text-[#657080]">Your Brand Brain has been updated with the selected brand sources.</p><div className="mt-6 rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-4 text-left"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Analyzed sources</p><p className="mt-2 text-sm font-semibold">{sources.join(", ")}</p><p className="mt-3 text-xs text-[#717786]">Completed {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lastAnalyzedAt))}</p><p className="mt-4 text-sm leading-6 text-[#414755]">{recommendation}</p></div></div>; }

function MockFileField({ error, fieldKey, label, onRemove, onSelect, value }: { error: string; fieldKey: FileKey; label: string; onRemove: (key: FileKey) => void; onSelect: (key: FileKey, event: ChangeEvent<HTMLInputElement>) => void; value: MockFile }) { const id = `analysis-${fieldKey}`; return <section className="rounded-xl border border-[#d3e4fe] p-4"><label htmlFor={id} className="text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}</label>{value.fileName ? <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[#f8faff] p-3"><div className="min-w-0"><p className="truncate text-sm font-bold">{value.fileName}</p><p className="mt-1 text-xs text-[#717786]">{value.size ? formatFileSize(value.size) : "Previously selected mock source"}</p></div><button type="button" aria-label={`Remove ${label}`} onClick={() => onRemove(fieldKey)} className="text-xs font-bold text-rose-600">Remove</button></div> : <input id={id} type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={(event) => onSelect(fieldKey, event)} className="mt-3 block w-full rounded-lg border border-[#c5d2e5] text-sm file:mr-3 file:border-0 file:border-r file:bg-[#eff4ff] file:px-3 file:py-2.5 file:font-bold file:text-[#0058bc]" />}{error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}</section>; }
function draftFromAnalysis(analysis: BrandAnalysis): AnalysisDraft { return { websiteUrl: analysis.sources.websiteUrl, instagramUsername: analysis.sources.instagramUsername, youtubeChannel: analysis.sources.youtubeChannel, brandGuidelines: previousFile(analysis.sources.brandGuidelinesFileName), companyProfile: previousFile(analysis.sources.companyProfileFileName), productCatalogue: previousFile(analysis.sources.productCatalogueFileName) }; }
function sourcesFromDraft(draft: AnalysisDraft): BrandAnalysisSource { return { websiteUrl: draft.websiteUrl.trim(), instagramUsername: draft.instagramUsername.trim(), youtubeChannel: draft.youtubeChannel.trim(), brandGuidelinesFileName: draft.brandGuidelines.fileName, companyProfileFileName: draft.companyProfile.fileName, productCatalogueFileName: draft.productCatalogue.fileName }; }
function sourceLabels(draft: AnalysisDraft) { return [[draft.websiteUrl, "Website"], [draft.instagramUsername, "Instagram"], [draft.youtubeChannel, "YouTube"], [draft.brandGuidelines.fileName, "Brand Guidelines"], [draft.companyProfile.fileName, "Company Profile"], [draft.productCatalogue.fileName, "Product Catalogue"]].filter(([value]) => value.trim()).map(([, label]) => label); }
function isValidWebUrl(value: string) { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } }
function emptyFile(): MockFile { return { file: null, fileName: "", size: 0 }; }
function previousFile(fileName: string): MockFile { return { file: null, fileName, size: 0 }; }
function formatFileSize(bytes: number) { return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`; }
