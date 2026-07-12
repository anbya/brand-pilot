"use client";

import { useRef } from "react";
import { PostActionDialogShell } from "@/components/calendar/post-action-dialog-shell";
import { formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { ContentIdea, ContentVersion } from "@/lib/calendar/types";

export function DeletePostDialog({ open, version, idea, siblingVersionCount, onClose, onConfirm }: { open: boolean; version?: ContentVersion; idea?: ContentIdea; siblingVersionCount: number; onClose: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const footer = <><button ref={cancelRef} type="button" onClick={onClose} className="rounded-lg border border-[#c5d2e5] bg-white px-5 py-2.5 text-sm font-bold outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">Cancel</button><button type="button" disabled={!version || !idea} onClick={onConfirm} className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-bold text-white outline-none hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-600 disabled:bg-[#a1a9b5]">Delete Post</button></>;
  return <PostActionDialogShell open={open} title="Delete Post?" description="This action cannot be undone." initialFocusRef={cancelRef} onClose={onClose} footer={footer} maxWidth="max-w-[520px]">{version && idea ? <div className="grid gap-5"><section className="rounded-xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs font-extrabold uppercase tracking-[.1em] text-rose-700">{formatPlatformLabel(version.platform)}</p><h3 className="mt-2 break-words text-lg font-extrabold text-rose-950">{version.headline || idea.title}</h3><p className="mt-2 text-sm font-semibold text-rose-800">{version.publishDate} at {version.publishTime}</p></section><p className="text-sm leading-6 text-[#414755]">{siblingVersionCount > 1 ? "This deletes only the selected platform version. Other platform versions will remain available." : "This is the final platform version for this content idea. Deleting it will also remove the content idea."}</p></div> : <p role="status" className="rounded-xl bg-amber-50 p-5 text-sm font-bold text-amber-900">The selected post relationship is unavailable.</p>}</PostActionDialogShell>;
}
