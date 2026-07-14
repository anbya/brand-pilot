import { formatAssetTypeLabel, formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { SocialPlatform } from "@/lib/platforms";

type GeneratedPostVisualPreviewProps = {
  platform: SocialPlatform;
  assetType: string;
  brandName?: string;
  headline: string;
  caption: string;
  cta?: string;
  hashtags?: string[];
  visualBrief?: string;
  status: string;
  publishTime?: string;
};

const platformStyles: Record<SocialPlatform, { canvas: string; accent: string; aspect: string }> = {
  instagram: { canvas: "from-[#dceaff] via-[#f9fbff] to-[#ece7ff]", accent: "text-[#0058bc]", aspect: "aspect-square" },
  tiktok: { canvas: "from-[#111827] via-[#172033] to-[#081018]", accent: "text-[#25f4ee]", aspect: "aspect-[4/5]" },
  youtube: { canvas: "from-[#ffe5e5] via-[#fff8f8] to-[#f4e9ea]", accent: "text-[#d80000]", aspect: "aspect-video" },
  facebook: { canvas: "from-[#dceaff] via-[#f8fbff] to-[#e7f0ff]", accent: "text-[#0866ff]", aspect: "aspect-[4/3]" },
};

export function GeneratedPostVisualPreview({ platform, assetType, brandName = "Brand Pilot", headline, caption, cta, hashtags = [], visualBrief, status, publishTime }: GeneratedPostVisualPreviewProps) {
  const style = platformStyles[platform];
  const video = /video|reel|short|tutorial|demo|behind the scenes/i.test(assetType);
  const carousel = /carousel/i.test(assetType);
  const normalizedStatus = formatAssetTypeLabel(status);
  const scheduled = status === "scheduled" || status === "published";

  return <article aria-label={`${formatPlatformLabel(platform)} ${formatAssetTypeLabel(assetType)} generated post preview`} className="overflow-hidden rounded-xl border border-[#c9d9ef] bg-white shadow-[0_12px_30px_rgba(18,52,91,.12)]">
    <header className="flex items-center justify-between border-b border-[#e5edf8] px-4 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0058bc] text-[10px] font-black text-white">{brandInitials(brandName)}</span>
        <div className="min-w-0"><p className="truncate text-xs font-extrabold text-[#0b1c30]">{brandName}</p><p className="truncate text-[10px] font-semibold text-[#717786]">{formatPlatformLabel(platform)} · {publishTime ? `${normalizedStatus} ${publishTime}` : normalizedStatus}</p></div>
      </div>
      <span aria-hidden="true" className="text-lg font-black tracking-[.12em] text-[#717786]">•••</span>
    </header>

    <div className={`relative flex ${style.aspect} min-h-[230px] flex-col justify-between overflow-hidden bg-gradient-to-br ${style.canvas} p-6 sm:p-8 ${platform === "tiktok" ? "text-white" : "text-[#0b1c30]"}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={`w-fit rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] ${style.accent}`}>{formatAssetTypeLabel(assetType)}</span>
        <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.12em] ${scheduled ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700"}`}>{normalizedStatus}</span>
      </div>
      {video && <span aria-hidden="true" className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl ${style.accent}`}><PlayIcon /></span>}
      <div className="relative z-10 max-w-[92%]">
        <p className="break-words text-2xl font-black leading-tight tracking-[-.03em] sm:text-3xl">{headline}</p>
        {visualBrief && !video && <p className={`mt-3 line-clamp-2 text-xs font-semibold leading-5 ${platform === "tiktok" ? "text-slate-200" : "text-[#526174]"}`}>{visualBrief}</p>}
        <p className={`mt-4 text-[10px] font-extrabold uppercase tracking-[.16em] ${style.accent}`}>{cta || (video ? "Watch now" : "Learn more")} →</p>
      </div>
      {carousel && <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-[#0058bc]">1 / 5</span>}
    </div>

    <div className="p-4">
      <div aria-hidden="true" className="mb-3 flex items-center gap-4 text-[#26384d]"><HeartIcon /><CommentIcon /><ShareIcon /></div>
      <p className="whitespace-pre-wrap break-words text-xs leading-5 text-[#414755]"><b className="mr-1 text-[#0b1c30]">{contentHandle(brandName)}</b>{caption || "No caption generated."}</p>
      {hashtags.length > 0 && <p className="mt-2 break-words text-xs font-semibold leading-5 text-[#0058bc]">{hashtags.map(formatHashtag).join(" ")}</p>}
      <p className={`mt-3 text-[10px] font-extrabold uppercase tracking-[.14em] ${scheduled ? "text-emerald-700" : "text-violet-700"}`}>{normalizedStatus}</p>
    </div>
  </article>;
}

function PlayIcon() { return <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" focusable="false"><path d="M8 5v14l11-7z" /></svg>; }
function HeartIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" focusable="false"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>; }
function CommentIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" focusable="false"><path d="M21 12a8.4 8.4 0 0 1-9 8 9.7 9.7 0 0 1-4-.8L3 21l1.7-4.2A8.6 8.6 0 0 1 3 12a8.4 8.4 0 0 1 9-8 8.4 8.4 0 0 1 9 8Z" /></svg>; }
function ShareIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" focusable="false"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>; }
function brandInitials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "BP"; }
function contentHandle(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "brandpilot"; }
function formatHashtag(value: string) { return value.startsWith("#") ? value : `#${value}`; }
