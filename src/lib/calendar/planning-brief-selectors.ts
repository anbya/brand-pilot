import type { PlanningBrief, PlanningBriefStatus } from "@/lib/calendar/planning-brief-types";

export type PlanningBriefFilters = { search: string; brandId: string; campaignId: string; status: PlanningBriefStatus | "all" };
const priority: Record<PlanningBriefStatus, number> = { pending_approval: 0, changes_requested: 1, draft: 2, approved: 3 };

export function filterAndSortPlanningBriefs(briefs: PlanningBrief[], filters: PlanningBriefFilters): PlanningBrief[] {
  const search = filters.search.trim().toLowerCase();
  return briefs.filter((brief) => (!search || [brief.title, brief.campaignName, brief.brandName].some((value) => value.toLowerCase().includes(search))) && (filters.brandId === "all" || brief.brandId === filters.brandId) && (filters.campaignId === "all" || brief.campaignId === filters.campaignId) && (filters.status === "all" || brief.status === filters.status)).sort((first, second) => priority[first.status] - priority[second.status] || second.updatedAt.localeCompare(first.updatedAt) || first.id.localeCompare(second.id));
}
