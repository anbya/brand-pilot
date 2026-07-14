"use client";

import Link from "next/link";
import { useState } from "react";
import { GeneratedPostVisualPreview } from "@/components/calendar/generated-post-visual-preview";
import { PostActionDialogShell } from "@/components/calendar/post-action-dialog-shell";
import { formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { ManualPostDraft } from "@/lib/calendar/manual-post-types";

export function GeneratedPostMockupDialog({ post, onClose }: { post: ManualPostDraft; onClose: () => void }) {
  const [activeVersionId, setActiveVersionId] = useState(post.versions[0]?.id ?? "");
  const version = post.versions.find((item) => item.id === activeVersionId) ?? post.versions[0];
  if (!version) return null;
  const calendarHref = `/calendar?post=${encodeURIComponent(version.id)}`;
  const footer = <><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Close</button><Link href={calendarHref} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">View in Calendar</Link></>;

  return <PostActionDialogShell open title="Generated Post Mockup" description="Generated automatically from the approved post draft." onClose={onClose} footer={footer} maxWidth="max-w-[760px]">
    {post.versions.length > 1 && <div aria-label="Generated platform versions" className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1">{post.versions.map((item) => <button key={item.id} type="button" aria-pressed={item.id === version.id} onClick={() => setActiveVersionId(item.id)} className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] ${item.id === version.id ? "bg-[#0058bc] text-white" : "border border-[#c5d2e5] bg-white text-[#414755]"}`}>{formatPlatformLabel(item.platform)}</button>)}</div>}
    <div className="mx-auto max-w-xl"><GeneratedPostVisualPreview platform={version.platform} assetType={version.assetType} brandName={post.idea.brandName} headline={version.headline} caption={version.caption} cta={version.cta} hashtags={version.hashtags} visualBrief={version.visualBrief} status={version.status} publishTime={version.publishTime} /></div>
  </PostActionDialogShell>;
}
