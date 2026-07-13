import type { ManualPostDraft, ManualPostStatus } from "@/lib/calendar/manual-post-types";
import type { SocialPlatform } from "@/lib/calendar/types";

export type ManualPostFilters = { search: string; brandId: string | "all"; campaignId: string | "all"; platform: SocialPlatform | "all"; status: ManualPostStatus | "all" | "open" };
const priority: Record<ManualPostStatus, number> = { pending_approval: 0, changes_requested: 1, draft: 2, scheduled: 3 };
export function filterAndSortManualPosts(posts: ManualPostDraft[], filters: ManualPostFilters): ManualPostDraft[] {
  const query = filters.search.trim().toLowerCase();
  return posts.filter((post) => post.idea.creationSource === "manual" && (!query || [post.idea.title, post.idea.coreTopic, post.idea.campaignName, post.idea.brandName].some((value) => value?.toLowerCase().includes(query))) && (filters.brandId === "all" || post.idea.brandId === filters.brandId) && (filters.campaignId === "all" || post.idea.campaignId === filters.campaignId) && (filters.platform === "all" || post.versions.some((version) => version.platform === filters.platform)) && (filters.status === "all" || (filters.status === "open" ? post.status !== "scheduled" : post.status === filters.status))).sort((first, second) => priority[first.status] - priority[second.status] || second.updatedAt.localeCompare(first.updatedAt) || first.id.localeCompare(second.id));
}
