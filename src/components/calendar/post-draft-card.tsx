import Link from "next/link";
import { PostDraftStatusBadge } from "@/components/calendar/post-draft-status-badge";
import { formatAssetTypeLabel, formatPlatformLabel } from "@/lib/calendar/platform-options";
import type { ManualPostDraft, ManualPostPermissions } from "@/lib/calendar/manual-post-types";

export function PostDraftCard({ post, permissions, onPreview }: { post: ManualPostDraft; permissions: ManualPostPermissions; onPreview: (id: string) => void }) {
  const first = post.versions[0]; const editable = permissions.canEdit && (post.status === "draft" || post.status === "changes_requested");
  return <article className="min-w-0 rounded-xl border border-[#d3e4fe] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-lg font-extrabold">{post.idea.title}</h3><p className="mt-1 text-sm text-[#657080]">{post.idea.campaignName || "No campaign"} · {post.idea.brandName || "No brand"}</p></div><PostDraftStatusBadge status={post.status} /></div>
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Meta label="Platforms" value={post.versions.length === 1 && first ? formatPlatformLabel(first.platform) : `${post.versions.length} platforms`} /><Meta label="Content Type" value={first ? formatAssetTypeLabel(first.assetType) : "Unavailable"} /><Meta label="Planned Schedule" value={first ? `${first.publishDate} at ${first.publishTime}` : "Unavailable"} /><Meta label="Owner" value={post.ownerName} /><Meta label="Updated" value={formatDate(post.updatedAt)} /></dl>
    <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => onPreview(post.id)} className="min-h-10 rounded-lg border px-4 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Preview</button>{editable && <Link href={`/calendar?editDraft=${encodeURIComponent(post.id)}`} className="inline-flex min-h-10 items-center rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc]">Edit</Link>}</div>
  </article>;
}
function Meta({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase text-[#8b96a5]">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(date); }
