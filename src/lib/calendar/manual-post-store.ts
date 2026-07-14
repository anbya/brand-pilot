import type { ManualPostDraft, ManualPostInput, ManualPostStatus } from "@/lib/calendar/manual-post-types";
import { isManualPostComplete } from "@/lib/calendar/manual-post-validation";
import { isSocialPlatform } from "@/lib/platforms";

export const manualPostStorageKey = "brand-pilot:manual-post-drafts:v1";
export type ManualPostReadResult = { status: "ready"; posts: ManualPostDraft[] } | { status: "error"; posts: []; message: string };

export function readManualPostResult(storage: Pick<Storage, "getItem">): ManualPostReadResult {
  try {
    const raw = storage.getItem(manualPostStorageKey);
    if (!raw) return { status: "ready", posts: [] };
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every(isManualPostDraft)) return { status: "error", posts: [], message: "Post drafts could not be loaded." };
    return { status: "ready", posts: value };
  } catch { return { status: "error", posts: [], message: "Post drafts could not be loaded." }; }
}
export function readManualPosts(storage: Pick<Storage, "getItem">): ManualPostDraft[] { return readManualPostResult(storage).posts; }
export function writeManualPosts(storage: Pick<Storage, "setItem">, posts: ManualPostDraft[]): void { storage.setItem(manualPostStorageKey, JSON.stringify(posts)); }
export function getManualPostById(posts: ManualPostDraft[], id: string): ManualPostDraft | undefined { return posts.find((post) => post.id === id); }
export function manualPostToInput(post: ManualPostDraft): ManualPostInput { return { idea: { title: post.idea.title, coreTopic: post.idea.coreTopic, pillarId: post.idea.pillarId, objective: post.idea.objective, targetAudience: post.idea.targetAudience, mainMessage: post.idea.mainMessage, campaignId: post.idea.campaignId, campaignName: post.idea.campaignName, brandId: post.idea.brandId, brandName: post.idea.brandName }, versions: post.versions.map((version) => ({ platform: version.platform, assetType: version.assetType, headline: version.headline, caption: version.caption, cta: version.cta, hashtags: version.hashtags, assetId: version.assetId, visualBrief: version.visualBrief, publishDate: version.publishDate, publishTime: version.publishTime, timezone: version.timezone, createdBy: version.createdBy })) }; }

export function saveManualPostDraft(storage: Pick<Storage, "getItem" | "setItem">, input: ManualPostInput, existing?: ManualPostDraft): ManualPostDraft {
  const posts = readManualPosts(storage); const now = new Date().toISOString(); const id = existing?.id ?? `manual-post-${Date.now()}`; const ideaId = existing?.idea.id ?? `idea-${id}`;
  const post: ManualPostDraft = {
    id,
    idea: { id: ideaId, ...input.idea, creationSource: "manual", ownerId: existing?.ownerId ?? "user-wanda", ownerName: existing?.ownerName ?? "Wanda", approvalNote: existing?.approvalNote, createdAt: existing?.idea.createdAt ?? now, updatedAt: now },
    versions: input.versions.map((version) => ({ ...version, id: `${id}-${version.platform}`, contentIdeaId: ideaId, status: "draft", createdAt: existing?.versions.find((item) => item.platform === version.platform)?.createdAt ?? now, updatedAt: now })),
    status: "draft", ownerId: existing?.ownerId ?? "user-wanda", ownerName: existing?.ownerName ?? "Wanda", approvalNote: existing?.approvalNote, generationStatus: "not_generated",
    submittedAt: existing?.submittedAt, submittedBy: existing?.submittedBy, changesRequestedAt: existing?.changesRequestedAt, changesRequestedBy: existing?.changesRequestedBy,
    createdAt: existing?.createdAt ?? now, updatedAt: now,
  };
  writeManualPosts(storage, [post, ...posts.filter((item) => item.id !== id)]); return post;
}
export function saveManualPost(storage: Pick<Storage, "getItem" | "setItem">, post: ManualPostDraft): ManualPostDraft { const posts = readManualPosts(storage); writeManualPosts(storage, [post, ...posts.filter((item) => item.id !== post.id)]); return post; }
export function submitManualPost(post: ManualPostDraft, actor: string): ManualPostDraft { if (post.status !== "draft" || !isManualPostComplete(post)) return post; const now = new Date().toISOString(); return { ...post, status: "pending_approval", approvalNote: undefined, submittedAt: now, submittedBy: actor, updatedAt: now }; }
export function requestManualPostChanges(post: ManualPostDraft, actor: string, note: string): ManualPostDraft { if (post.status !== "pending_approval") return post; const now = new Date().toISOString(); return { ...post, status: "changes_requested", approvalNote: note, changesRequestedAt: now, changesRequestedBy: actor, updatedAt: now }; }
export function approveManualPost(post: ManualPostDraft, actor: string): ManualPostDraft { if (post.status !== "pending_approval" || !isManualPostComplete(post)) return post; const now = new Date().toISOString(); return { ...post, status: "scheduled", approvalNote: undefined, approvedAt: now, approvedBy: actor, generationStatus: "ready", generatedAt: now, generatorVersion: "mock-content-renderer-v1", updatedAt: now, versions: post.versions.map((version) => ({ ...version, status: "scheduled", updatedAt: now })) }; }

function isManualPostDraft(value: unknown): value is ManualPostDraft {
  if (!value || typeof value !== "object") return false; const post = value as Partial<ManualPostDraft>;
  return typeof post.id === "string" && isStatus(post.status) && typeof post.ownerId === "string" && typeof post.ownerName === "string" && typeof post.createdAt === "string" && typeof post.updatedAt === "string" && isIdea(post.idea) && Array.isArray(post.versions) && post.versions.every(isVersion);
}
function isStatus(value: unknown): value is ManualPostStatus { return value === "draft" || value === "pending_approval" || value === "changes_requested" || value === "scheduled"; }
function isIdea(value: unknown): boolean { if (!value || typeof value !== "object") return false; const idea = value as Record<string, unknown>; return ["id", "title", "coreTopic", "pillarId", "objective", "targetAudience", "mainMessage", "creationSource", "createdAt", "updatedAt"].every((key) => typeof idea[key] === "string"); }
function isVersion(value: unknown): boolean { if (!value || typeof value !== "object") return false; const version = value as Record<string, unknown>; return ["id", "contentIdeaId", "assetType", "headline", "caption", "cta", "publishDate", "publishTime", "timezone", "status", "createdBy", "createdAt", "updatedAt"].every((key) => typeof version[key] === "string") && isSocialPlatform(version.platform) && Array.isArray(version.hashtags) && version.hashtags.every((item) => typeof item === "string"); }
