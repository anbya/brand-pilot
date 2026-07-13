"use client";

import Link from "next/link";
import { useState } from "react";
import { PostActionDialogShell } from "@/components/calendar/post-action-dialog-shell";
import { formatAssetTypeLabel, formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { ManualPostDraft } from "@/lib/calendar/manual-post-types";

export function GeneratedPostMockupDialog({ post, onClose }: { post: ManualPostDraft; onClose: () => void }) {
  const [activeVersionId, setActiveVersionId] = useState(post.versions[0]?.id ?? "");
  const version = post.versions.find((item) => item.id === activeVersionId) ?? post.versions[0];
  if (!version) return null;
  const video = /video|reel|shorts|tutorial|demo|behind the scenes/i.test(version.assetType);
  const calendarHref = `/calendar?post=${encodeURIComponent(version.id)}`;
  const footer = <><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button><Link href={calendarHref} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">View in Calendar</Link></>;

  return <PostActionDialogShell open title="Generated Post Mockup" description="Generated automatically from the approved post draft." onClose={onClose} footer={footer} maxWidth="max-w-[760px]">
    {post.versions.length > 1 && <div aria-label="Generated platform versions" className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1">{post.versions.map((item) => <button key={item.id} type="button" aria-pressed={item.id === version.id} onClick={() => setActiveVersionId(item.id)} className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] ${item.id === version.id ? "bg-[#0058bc] text-white" : "border border-[#c5d2e5] bg-white text-[#414755]"}`}>{formatPlatformLabel(item.platform)}</button>)}</div>}
    <article aria-label={`${formatPlatformLabel(version.platform)} generated post mockup`} className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-[#d3e4fe] bg-white shadow-lg">
      <header className="flex items-center justify-between border-b border-[#e5edf8] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0058bc] text-xs font-black text-white">{initials(post.idea.brandName || "Brand Pilot")}</span><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#0b1c30]">{post.idea.brandName || "Brand Pilot"}</p><p className="text-xs font-semibold text-[#717786]">{formatPlatformLabel(version.platform)} · Scheduled {version.publishTime}</p></div></div>
        <span aria-hidden="true" className="text-lg font-black tracking-[.12em] text-[#717786]">•••</span>
      </header>
      <div className="relative flex aspect-square flex-col justify-between overflow-hidden bg-gradient-to-br from-[#dceaff] via-[#f9fbff] to-[#e8e4ff] p-7 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-2"><span className="w-fit rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0058bc]">{formatAssetTypeLabel(version.assetType)}</span><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-emerald-700">Generated</span></div>
        {video && <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0058bc] text-2xl text-white shadow-xl">▶</span>}
        <div><p className="break-words text-3xl font-black leading-tight tracking-[-.03em] text-[#0b1c30] sm:text-4xl">{version.headline}</p>{version.visualBrief && <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-[#414755]">{version.visualBrief}</p>}<p className="mt-4 text-xs font-extrabold uppercase tracking-[.14em] text-[#0058bc]">{version.cta || (video ? "Watch now" : "Learn more")} →</p></div>
        {!video && /carousel/i.test(version.assetType) && <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#0058bc]">1 / 5</span>}
      </div>
      <div className="p-5"><div aria-hidden="true" className="mb-4 flex gap-5 text-2xl text-[#26384d]"><span>♡</span><span>○</span><span>⌁</span></div><p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#414755]"><b className="mr-1 text-[#0b1c30]">{slug(post.idea.brandName || "brandpilot")}</b>{version.caption}</p>{version.hashtags.length > 0 && <p className="mt-2 break-words text-sm font-semibold text-[#0058bc]">{version.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ")}</p>}<p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.14em] text-emerald-700">Scheduled for {formatDate(version.publishDate)} at {version.publishTime} · Generated {formatTimestamp(post.generatedAt ?? post.approvedAt ?? post.updatedAt)}</p></div>
    </article>
  </PostActionDialogShell>;
}

function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "BP"; }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "brandpilot"; }
function formatDate(value: string) { const [year, month, day] = value.split("-").map(Number); const date = new Date(year, month - 1, day); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date); }
function formatTimestamp(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "after approval" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date); }
