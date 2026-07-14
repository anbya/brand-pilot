"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { BrandVoiceMockModal } from "@/components/brand-brain/brand-voice-mock-modal";
import { AssetPickerDialog } from "@/components/assets/asset-picker-dialog";
import { ToneDialMockModal } from "@/components/brand-brain/tone-dial-mock-modal";
import { AnalyzeBrandMockModal } from "@/components/brand-brain/analyze-brand-mock-modal";
import { BrandInsightsMockDrawer } from "@/components/brand-brain/brand-insights-mock-drawer";
import { brandBrainReducer } from "@/lib/brand-brain/reducer";
import type { BrandAnalysis, BrandBrainState, BrandRecommendation } from "@/lib/brand-brain/types";
import { assetLibraryMockData } from "@/lib/assets/mock-data";
import { readAssetLibrary, subscribeToAssetLibrary, syncBrandAssetReferences } from "@/lib/assets/store";
import type { WorkspaceAsset } from "@/lib/assets/types";

type IconName =
  | "add"
  | "analytics"
  | "assets"
  | "brain"
  | "brands"
  | "calendar"
  | "campaign"
  | "check"
  | "chevronDown"
  | "dashboard"
  | "download"
  | "edit"
  | "logo"
  | "settings"
  | "spark"
  | "tune"
  | "upload"
  | "view"
  | "voice";

const headerProfileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0caw30WtyUGSUyxpyOs2SGUK9WGKRo2RlKSgaAsv2NUD9hD0Kvc5oZd0WssRZ0-N2mKrGtArN10nMVusbyGXHwFRZjjI2NrKVqzxsz1fAlBTDq3Cqjib4E06nbJqfvVpl_IpDLuue1rASaOhvTCRTEnhgkT0XQA4db5J7aoQvgcMUiUbCSkyiI4WcowUgnxmBONblLjzkAsElucfKlhSIq9cHmwO-3ySjrkZ3JxOdIICjKnOV8ohr";
const brandAssetReferencesKey = "brand-pilot-brand-asset-references-v1";

export function BrandBrainClient({ initialData }: { initialData: BrandBrainState }) {
  const [state, dispatch] = useReducer(brandBrainReducer, initialData);
  const [isBrandVoiceModalOpen, setIsBrandVoiceModalOpen] = useState(false);
  const [isToneDialModalOpen, setIsToneDialModalOpen] = useState(false);
  const [isBrandLogoModalOpen, setIsBrandLogoModalOpen] = useState(false);
  const [isBrandAssetModalOpen, setIsBrandAssetModalOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<WorkspaceAsset[]>(assetLibraryMockData);
  const [isAnalyzeBrandModalOpen, setIsAnalyzeBrandModalOpen] = useState(false);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [analysisHighlight, setAnalysisHighlight] = useState(false);
  const [isBrandInsightsDrawerOpen, setIsBrandInsightsDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const recommendationRef = useRef<HTMLElement>(null);
  const toneDials = [
    { left: "Casual", right: "Formal", value: state.toneDial.casualFormal },
    { left: "Playful", right: "Serious", value: state.toneDial.playfulSerious },
    { left: "Concise", right: "Detailed", value: state.toneDial.conciseDetailed },
  ];
  const logoAsset = libraryAssets.find((asset) => asset.id === state.logoAssetId) ?? null;
  const coreAssets = state.coreAssetIds.flatMap((id) => { const asset = libraryAssets.find((item) => item.id === id); return asset ? [asset] : []; }).slice(0, 3);

  const closeBrandVoiceModal = useCallback(() => setIsBrandVoiceModalOpen(false), []);
  const closeToneDialModal = useCallback(() => setIsToneDialModalOpen(false), []);
  const closeBrandLogoModal = useCallback(() => setIsBrandLogoModalOpen(false), []);
  const closeBrandAssetModal = useCallback(() => setIsBrandAssetModalOpen(false), []);
  const closeAnalyzeBrandModal = useCallback(() => setIsAnalyzeBrandModalOpen(false), []);
  const changeAnalysisRunning = useCallback((running: boolean) => setIsAnalysisRunning(running), []);
  const closeBrandInsightsDrawer = useCallback(() => setIsBrandInsightsDrawerOpen(false), []);

  useEffect(() => { const unsubscribe = subscribeToAssetLibrary(setLibraryAssets); const timer = window.setTimeout(() => setLibraryAssets(readAssetLibrary(window.localStorage)), 0); return () => { window.clearTimeout(timer); unsubscribe(); }; }, []);
  useEffect(() => { const timer = window.setTimeout(() => { try { const stored = JSON.parse(window.localStorage.getItem(brandAssetReferencesKey) ?? "null") as { logoAssetId?: string | null; coreAssetIds?: string[] } | null; if (stored) { dispatch({ type: "SELECT_BRAND_LOGO", payload: { assetId: stored.logoAssetId ?? null } }); dispatch({ type: "SET_CORE_ASSETS", payload: { assetIds: stored.coreAssetIds ?? [] } }); } } catch { window.localStorage.removeItem(brandAssetReferencesKey); } }, 0); return () => window.clearTimeout(timer); }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(""), 2000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  function saveBrandVoice(voice: BrandBrainState["voice"]) {
    dispatch({ type: "UPDATE_BRAND_VOICE", payload: voice });
    setIsBrandVoiceModalOpen(false);
    setSuccessMessage("Brand Voice updated successfully.");
  }

  function saveToneDial(toneDial: BrandBrainState["toneDial"]) {
    dispatch({ type: "UPDATE_TONE_DIAL", payload: toneDial });
    setIsToneDialModalOpen(false);
    setSuccessMessage("Tone Dial updated successfully.");
  }

  function selectBrandLogo(ids: string[]) {
    const assetId = ids[0] ?? null;
    dispatch({ type: "SELECT_BRAND_LOGO", payload: { assetId } });
    window.localStorage.setItem(brandAssetReferencesKey, JSON.stringify({ logoAssetId: assetId, coreAssetIds: state.coreAssetIds }));
    syncBrandAssetReferences(window.localStorage, state.brand.id, assetId, state.coreAssetIds);
    setIsBrandLogoModalOpen(false);
    setSuccessMessage("Brand Logo selected from Asset Library.");
  }

  function selectCoreAssets(ids: string[]) {
    dispatch({ type: "SET_CORE_ASSETS", payload: { assetIds: ids } });
    window.localStorage.setItem(brandAssetReferencesKey, JSON.stringify({ logoAssetId: state.logoAssetId, coreAssetIds: ids }));
    syncBrandAssetReferences(window.localStorage, state.brand.id, state.logoAssetId, ids);
    setIsBrandAssetModalOpen(false);
    setSuccessMessage("Core Brand Assets selected from Asset Library.");
  }

  const completeBrandAnalysis = useCallback((analysis: BrandAnalysis, sourceCount: number) => {
    const coreAssetCount = state.coreAssetIds.length;
    const detailRecommendation = state.toneDial.conciseDetailed < 50
      ? "Keep captions concise while maintaining reliable product information."
      : state.toneDial.conciseDetailed <= 65
        ? "Balance concise messaging with enough detail to support confident decisions."
        : "Use richer and more detailed content to explain products and brand expertise.";
    const friendly = state.voice.primaryPersonality.toLocaleLowerCase().includes("friendly");
    const recommendation: BrandRecommendation = {
      ...state.recommendation,
      title: "Brand profile successfully analyzed",
      description: `Your ${state.voice.primaryPersonality} personality and ${state.voice.communicationStyle} communication style create a clear, approachable brand presence. ${coreAssetCount === 3 ? "Your current visual assets provide a strong foundation for consistent content creation." : "Add more core visual references to improve content consistency."}`,
      items: [
        friendly ? "Continue using an approachable and knowledgeable voice." : "Keep the brand voice consistent across every channel.",
        detailRecommendation,
        `${state.logoAssetId ? "Your visual identity is established." : "Select a primary logo from Asset Library to establish visual identity."} ${sourceCount > 1 ? "Multiple sources improve brand understanding." : "Add more brand sources for a deeper analysis."}`,
      ],
      highlightedVoice: state.voice.primaryPersonality,
      highlightedTone: state.voice.communicationStyle,
      performanceLift: Math.max(state.recommendation.performanceLift, 24),
    };
    dispatch({ type: "UPDATE_ANALYSIS", payload: analysis });
    dispatch({ type: "UPDATE_RECOMMENDATION", payload: recommendation });
    setSuccessMessage("Brand analysis completed successfully.");
    return recommendation.description;
  }, [state.coreAssetIds.length, state.logoAssetId, state.recommendation, state.toneDial.conciseDetailed, state.voice.communicationStyle, state.voice.primaryPersonality]);

  const viewUpdatedRecommendation = useCallback(() => {
    setIsAnalyzeBrandModalOpen(false);
    window.requestAnimationFrame(() => {
      recommendationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      recommendationRef.current?.focus({ preventScroll: true });
      setAnalysisHighlight(true);
    });
  }, []);

  function openBrandInsights() {
    setIsBrandVoiceModalOpen(false);
    setIsToneDialModalOpen(false);
    setIsBrandLogoModalOpen(false);
    setIsBrandAssetModalOpen(false);
    setIsAnalyzeBrandModalOpen(false);
    setIsBrandInsightsDrawerOpen(true);
  }

  useEffect(() => {
    if (!analysisHighlight) return;
    const timer = window.setTimeout(() => setAnalysisHighlight(false), 1800);
    return () => window.clearTimeout(timer);
  }, [analysisHighlight]);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      <section className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-[#d3e4fe]/70 bg-white/80 px-4 py-5 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0b1c30]">Brand Brain</h1>
              <p className="mt-1 text-sm text-[#717786]">
                Manage your AI&apos;s understanding of {state.brand.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAnalyzeBrandModalOpen(true)}
                disabled={isAnalysisRunning}
                className="inline-flex items-center gap-2 rounded-lg border border-[#0058bc] px-4 py-2 text-sm font-bold text-[#0058bc] transition hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:border-[#aab8ca] disabled:text-[#8b96a5] disabled:hover:bg-transparent"
                type="button"
              >
                <Icon name="spark" className="h-4 w-4" />
                {isAnalysisRunning ? "Analyzing..." : state.analysis.status === "complete" ? "Re-analyze Brand Data" : "Analyze Brand Data"}
              </button>
              <Image
                src={headerProfileImage}
                width={40}
                height={40}
                alt="Marketing executive profile"
                className="hidden h-10 w-10 rounded-full border border-[#c1c6d7] object-cover sm:block"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <BrainCard className="col-span-12 xl:col-span-8">
            <CardHeader icon="voice" title="Brand Voice" actionIcon="edit" actionLabel="Edit" onAction={() => setIsBrandVoiceModalOpen(true)} />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <VoicePanel
                eyebrow="Primary Personality"
                title={state.voice.primaryPersonality}
                description={state.voice.primaryPersonalityDescription}
              />
              <VoicePanel
                eyebrow="Communication Style"
                title={state.voice.communicationStyle}
                description={state.voice.communicationStyleDescription}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {state.voice.traits.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#e1e0ff] px-3 py-1 text-sm font-bold text-[#4648d4]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </BrainCard>

          <BrainCard className="col-span-12 xl:col-span-4">
            <CardHeader icon="logo" title="Brand Logo" actionIcon="assets" actionLabel="Select" onAction={() => setIsBrandLogoModalOpen(true)} />
            <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c1c6d7] bg-white p-8 text-center transition hover:bg-[#eff4ff]">
              {logoAsset ? (
                <>
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={logoAsset.previewUrl}
                      width={72}
                      height={72}
                      unoptimized
                      alt={logoAsset.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#0b1c30]">{logoAsset.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#717786]">{logoAsset.fileName}</p>
                </>
              ) : (
                <p className="text-sm font-bold text-[#657080]">No brand logo selected</p>
              )}
            </div>
          </BrainCard>

          <BrainCard className="col-span-12 xl:col-span-4">
            <CardHeader icon="tune" title="Tone Dial" actionIcon="edit" actionLabel="Adjust" onAction={() => setIsToneDialModalOpen(true)} />
            <div className="mt-6 grid gap-6 py-2">
              {toneDials.map((dial) => (
                <div key={dial.left} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-[0.12em] text-[#717786]">
                    <span>{dial.left}</span>
                    <span>{dial.right}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[#e5eeff]">
                    <span
                      className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0058bc] shadow-md"
                      style={{ left: `clamp(8px, ${dial.value}%, calc(100% - 8px))` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </BrainCard>

          <BrainCard className="col-span-12 xl:col-span-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <IconBubble icon="assets" />
                <h2 className="text-xl font-bold text-[#0b1c30]">Core Brand Assets</h2>
              </div>

            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {coreAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-[#d3e4fe]"
                >
                  <Image src={asset.previewUrl} alt={asset.name} fill unoptimized className={asset.kind === "logo" ? "object-contain p-3" : "object-cover"} sizes="(max-width: 768px) 50vw, 180px" />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <button className="rounded-full bg-white/15 p-2 text-white backdrop-blur" type="button">
                      <Icon name="view" className="h-5 w-5" />
                    </button>
                    <button className="rounded-full bg-white/15 p-2 text-white backdrop-blur" type="button">
                      <Icon name="download" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setIsBrandAssetModalOpen(true)}
                className="aspect-square rounded-lg border-2 border-dashed border-[#c1c6d7] text-[#717786] transition hover:border-[#0058bc] hover:text-[#0058bc]"
                type="button"
              >
                <span className="flex h-full flex-col items-center justify-center gap-2 text-sm font-bold">
                  <Icon name="add" className="h-8 w-8" />
                  Choose Asset
                </span>
              </button>
            </div>
          </BrainCard>

          <section ref={recommendationRef} tabIndex={-1} className={`col-span-12 rounded-lg border border-l-4 border-[#0058bc] border-l-[#0058bc] bg-white p-6 shadow-sm outline-none transition-all duration-300 ${analysisHighlight ? "ring-4 ring-blue-200 shadow-lg" : ""}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0070eb] text-white">
                <Icon name="spark" className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-extrabold text-[#0058bc]">{state.recommendation.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#0b1c30] sm:text-base">{state.recommendation.description}</p>
              </div>
              <button
                type="button"
                onClick={openBrandInsights}
                className="inline-flex w-fit items-center justify-center rounded-lg bg-[#0058bc] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#004493]"
              >
                View Insights
              </button>
            </div>
          </section>
        </div>
      </section>

      {successMessage ? (
        <div role="status" className="fixed bottom-5 right-5 z-[70] rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-lg">
          {successMessage}
        </div>
      ) : null}

      {isBrandVoiceModalOpen ? (
        <BrandVoiceMockModal voice={state.voice} onClose={closeBrandVoiceModal} onSave={saveBrandVoice} />
      ) : null}

      {isToneDialModalOpen ? (
        <ToneDialMockModal isOpen currentToneDial={state.toneDial} onClose={closeToneDialModal} onSave={saveToneDial} />
      ) : null}

      {isBrandLogoModalOpen ? (
        <AssetPickerDialog assets={libraryAssets} mode="logo" selectedIds={state.logoAssetId ? [state.logoAssetId] : []} maximum={1} onClose={closeBrandLogoModal} onSave={selectBrandLogo} />
      ) : null}

      {isBrandAssetModalOpen ? (
        <AssetPickerDialog assets={libraryAssets} mode="core" selectedIds={state.coreAssetIds} maximum={3} onClose={closeBrandAssetModal} onSave={selectCoreAssets} />
      ) : null}

      {isAnalyzeBrandModalOpen ? (
        <AnalyzeBrandMockModal
          isOpen
          currentAnalysis={state.analysis}
          onClose={closeAnalyzeBrandModal}
          onRunningChange={changeAnalysisRunning}
          onComplete={completeBrandAnalysis}
          onViewRecommendation={viewUpdatedRecommendation}
        />
      ) : null}

      {isBrandInsightsDrawerOpen ? (
        <BrandInsightsMockDrawer isOpen state={state} libraryAssets={libraryAssets} onClose={closeBrandInsightsDrawer} />
      ) : null}
    </main>
  );
}

function BrainCard({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section className={`rounded-lg border border-[#d3e4fe]/70 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}>
      {children}
    </section>
  );
}

function CardHeader({
  actionIcon,
  actionLabel,
  icon,
  onAction,
  title,
}: {
  actionIcon: IconName;
  actionLabel: string;
  icon: IconName;
  onAction?: () => void;
  title: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <IconBubble icon={icon} />
        <h2 className="text-xl font-bold text-[#0b1c30]">{title}</h2>
      </div>
      <button
        onClick={onAction}
        className="inline-flex items-center gap-1 text-sm font-bold text-[#0058bc] transition hover:text-[#004493]"
        type="button"
      >
        <Icon name={actionIcon} className="h-4 w-4" />
        {actionLabel}
      </button>
    </div>
  );
}

function IconBubble({ icon }: { icon: IconName }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eeff] text-[#0058bc]">
      <Icon name={icon} className="h-5 w-5" />
    </span>
  );
}

function VoicePanel({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-[#d3e4fe]/80 bg-[#eff4ff] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0058bc]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-extrabold text-[#0b1c30]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#414755]">{description}</p>
    </article>
  );
}

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    add: <path d="M12 5v14M5 12h14" />,
    analytics: <path d="M4 19V5M9 19V9M14 19v-6M19 19V7" />,
    assets: <path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    brain: <path d="M8 6a3 3 0 0 1 6 0v12a3 3 0 0 1-6 0V6Zm6 1a3 3 0 1 1 2 5.2M8 7a3 3 0 1 0-2 5.2M14 17a3 3 0 1 0 2-5.2M8 17a3 3 0 1 1-2-5.2" />,
    brands: <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" />,
    calendar: <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    campaign: <path d="M4 13V7l10-3v14L4 15v-2Zm10-3h3a3 3 0 0 1 0 6h-3M7 15l2 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    download: <path d="M12 4v10M7 9l5 5 5-5M4 20h16" />,
    edit: <path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4" />,
    logo: <path d="M4 5h16v14H4zM8 9h8M8 13h5" />,
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />,
    tune: <path d="M4 7h10M18 7h2M4 17h2M10 17h10M8 5v4M16 15v4" />,
    upload: <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />,
    view: <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    voice: <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 10v1a7 7 0 0 0 14 0v-1M12 18v3M8 21h8" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
