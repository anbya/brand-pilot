"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { BrandVoiceMockModal } from "@/components/brand-brain/brand-voice-mock-modal";
import { BrandAssetMockModal } from "@/components/brand-brain/brand-asset-mock-modal";
import { BrandLogoMockModal, readableLogoType } from "@/components/brand-brain/brand-logo-mock-modal";
import { ToneDialMockModal } from "@/components/brand-brain/tone-dial-mock-modal";
import { brandBrainReducer } from "@/lib/brand-brain/reducer";
import type { BrandBrainState } from "@/lib/brand-brain/types";
import type { BrandAsset } from "@/lib/brand-brain/types";

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

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5LtcSEZ7F5QffQjEpFdB4p3jqD2GVDvGjOPezI4zUOYKPK6IqzRZwAMUi9xvpAiVsZ81RRy_bbmzqkzqLaGPEZoGs-LQTRXzJlojqaC6BLHrNa-iu_stwKurd_kr30Pu52GcQJ48h7mj5pEF91bwZFXHnaEZS4JFXdalOTDUX9H_X-AzbxIMa9VQG87tdkaA4g32dcXsT3FBGWsgzbIC_mqPyFjj410cbXW19irJXn_0-Q9h_HKro";

const headerProfileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0caw30WtyUGSUyxpyOs2SGUK9WGKRo2RlKSgaAsv2NUD9hD0Kvc5oZd0WssRZ0-N2mKrGtArN10nMVusbyGXHwFRZjjI2NrKVqzxsz1fAlBTDq3Cqjib4E06nbJqfvVpl_IpDLuue1rASaOhvTCRTEnhgkT0XQA4db5J7aoQvgcMUiUbCSkyiI4WcowUgnxmBONblLjzkAsElucfKlhSIq9cHmwO-3ySjrkZ3JxOdIICjKnOV8ohr";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Brands", icon: "brands", href: "/brands", active: true },
  { label: "Campaigns", icon: "campaign", href: "/campaigns" },
  { label: "Content Calendar", icon: "calendar", href: "/calendar" },
  { label: "Assets", icon: "assets", href: "/assets" },
  { label: "Analytics", icon: "analytics", href: "/analytics" },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

export function BrandBrainClient({ initialData }: { initialData: BrandBrainState }) {
  const [state, dispatch] = useReducer(brandBrainReducer, initialData);
  const [isBrandVoiceModalOpen, setIsBrandVoiceModalOpen] = useState(false);
  const [isToneDialModalOpen, setIsToneDialModalOpen] = useState(false);
  const [isBrandLogoModalOpen, setIsBrandLogoModalOpen] = useState(false);
  const [isBrandAssetModalOpen, setIsBrandAssetModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const committedLogoBlobUrlRef = useRef(state.logo?.previewUrl.startsWith("blob:") ? state.logo.previewUrl : null);
  const committedAssetBlobUrlsRef = useRef(new Set(state.assets.filter((asset) => asset.imageUrl.startsWith("blob:")).map((asset) => asset.imageUrl)));
  const toneDials = [
    { left: "Casual", right: "Formal", value: state.toneDial.casualFormal },
    { left: "Playful", right: "Serious", value: state.toneDial.playfulSerious },
    { left: "Concise", right: "Detailed", value: state.toneDial.conciseDetailed },
  ];
  const coreAssets = state.assets.filter((asset) => asset.isCoreAsset).slice(0, 3);

  const closeBrandVoiceModal = useCallback(() => setIsBrandVoiceModalOpen(false), []);
  const closeToneDialModal = useCallback(() => setIsToneDialModalOpen(false), []);
  const closeBrandLogoModal = useCallback(() => setIsBrandLogoModalOpen(false), []);
  const closeBrandAssetModal = useCallback(() => setIsBrandAssetModalOpen(false), []);

  useEffect(() => () => {
    const committedBlobUrl = committedLogoBlobUrlRef.current;
    if (committedBlobUrl) URL.revokeObjectURL(committedBlobUrl);
    committedAssetBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

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

  function saveBrandLogo(logo: NonNullable<BrandBrainState["logo"]>) {
    const previousBlobUrl = committedLogoBlobUrlRef.current;
    if (previousBlobUrl && previousBlobUrl !== logo.previewUrl) URL.revokeObjectURL(previousBlobUrl);
    committedLogoBlobUrlRef.current = logo.previewUrl.startsWith("blob:") ? logo.previewUrl : null;
    dispatch({ type: "UPDATE_BRAND_LOGO", payload: logo });
    setIsBrandLogoModalOpen(false);
    setSuccessMessage("Brand Logo updated successfully.");
  }

  function saveBrandAsset(asset: BrandAsset, replaceCoreAssetId: string | null) {
    if (replaceCoreAssetId) dispatch({ type: "REMOVE_CORE_ASSET", payload: { id: replaceCoreAssetId } });
    dispatch({ type: "ADD_ASSET", payload: asset });
    if (asset.imageUrl.startsWith("blob:")) committedAssetBlobUrlsRef.current.add(asset.imageUrl);
    setIsBrandAssetModalOpen(false);
    setSuccessMessage("Brand Asset added successfully.");
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
      <BrainSidebar />

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
                className="inline-flex items-center gap-2 rounded-lg border border-[#0058bc] px-4 py-2 text-sm font-bold text-[#0058bc] transition hover:bg-[#e5eeff]"
                type="button"
              >
                <Icon name="spark" className="h-4 w-4" />
                Analyze Brand Data
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
            <CardHeader icon="logo" title="Brand Logo" actionIcon="upload" actionLabel="Change" onAction={() => setIsBrandLogoModalOpen(true)} />
            <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c1c6d7] bg-white p-8 text-center transition hover:bg-[#eff4ff]">
              {state.logo ? (
                <>
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={state.logo.previewUrl}
                      width={72}
                      height={72}
                      unoptimized={state.logo.previewUrl.startsWith("blob:")}
                      alt={state.logo.alt}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#0b1c30]">{readableLogoType(state.logo.logoType)} ({state.logo.fileType})</p>
                  <p className="mt-1 text-xs font-semibold text-[#717786]">{state.logo.fileName}</p>
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
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e5eeff] px-3 py-2 text-sm font-bold text-[#414755] transition hover:bg-[#dce9ff]"
                  type="button"
                >
                  <Icon name="assets" className="h-4 w-4" />
                  Manage All
                </button>
                <button
                  onClick={() => setIsBrandAssetModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0058bc] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#004493]"
                  type="button"
                >
                  <Icon name="add" className="h-4 w-4" />
                  Upload
                </button>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {coreAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-[#d3e4fe]"
                >
                  <Image src={asset.imageUrl} alt={asset.name} fill unoptimized={asset.imageUrl.startsWith("blob:")} className="object-cover" sizes="(max-width: 768px) 50vw, 180px" />
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
                  Add New
                </span>
              </button>
            </div>
          </BrainCard>

          <section className="col-span-12 rounded-lg border border-l-4 border-[#0058bc] border-l-[#0058bc] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0070eb] text-white">
                <Icon name="spark" className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-extrabold text-[#0058bc]">{state.recommendation.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#0b1c30] sm:text-base">
                  Based on your latest campaign performance, users respond best to a{" "}
                  <span className="font-bold">{state.recommendation.highlightedVoice}</span> voice with a{" "}
                  <span className="font-bold">{state.recommendation.highlightedTone}</span> tone. Your current assets are
                  performing {state.recommendation.performanceLift}% higher than industry average.
                </p>
              </div>
              <Link
                className="inline-flex w-fit items-center justify-center rounded-lg bg-[#0058bc] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#004493]"
                href="/analytics"
              >
                View Insights
              </Link>
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
        <BrandLogoMockModal isOpen currentLogo={state.logo} onClose={closeBrandLogoModal} onSave={saveBrandLogo} />
      ) : null}

      {isBrandAssetModalOpen ? (
        <BrandAssetMockModal isOpen currentAssets={state.assets} onClose={closeBrandAssetModal} onSave={saveBrandAsset} />
      ) : null}
    </main>
  );
}

function BrainSidebar() {
  return (
    <aside className="border-b border-[#d3e4fe] bg-white lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:p-4">
        <Link className="flex items-center gap-3" href="/dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0058bc] text-white">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-[#0058bc]">
              AI Marketing OS
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#717786]">
              Enterprise Suite
            </span>
          </span>
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-lg bg-[#4648d4] px-3 py-2 text-xs font-bold text-white lg:hidden"
          href="/campaigns"
        >
          <Icon name="add" className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
              item.active
                ? "bg-[#0070eb] text-white"
                : "text-[#414755] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
            }`}
            href={item.href}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-[#d3e4fe] p-4 lg:block">
        <Link
          className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#393bb8]"
          href="/campaigns"
        >
          <Icon name="add" className="h-5 w-5" />
          New Campaign
        </Link>
        <Link
          className="mb-4 inline-flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff]"
          href="/settings"
        >
          <Icon name="settings" className="h-5 w-5" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-[#eff4ff] p-2">
          <Image
            src={profileImage}
            width={40}
            height={40}
            alt="Sarah Jenkins profile"
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#0b1c30]">Sarah Jenkins</p>
            <p className="truncate text-xs font-semibold text-[#717786]">Admin</p>
          </div>
          <Icon name="chevronDown" className="h-4 w-4 text-[#717786]" />
        </div>
      </div>
    </aside>
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
