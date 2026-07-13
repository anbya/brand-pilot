import type { GeneratedDraftPlanItem } from "@/lib/calendar/generated-plan-types";

export const defaultGeneratedPostTime = "09:00";

export function getGeneratedItemScheduleIssue(item: GeneratedDraftPlanItem): string | undefined {
  if (!item.id.trim()) return "Generated item identity is missing.";
  if (!item.title.trim()) return "A content title is required before this item can be added to the Calendar.";
  if (!item.publishDate.trim() || !item.platform) return "A scheduled date and platform are required before this item can be added to the Calendar.";
  return undefined;
}

export function getGeneratedItemTime(item: GeneratedDraftPlanItem): string {
  return item.publishTime.trim() || defaultGeneratedPostTime;
}
