import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";

export type GeneratedPlanStatus = "generated" | "partially_approved" | "approved_to_calendar";
export type GeneratedPlanItemCalendarStatus = "not_added" | "added_to_calendar";
export type GeneratedDraftPlanItem = Omit<AiPlanDraftItem, "selected"> & {
  selected: boolean;
  calendarStatus: GeneratedPlanItemCalendarStatus;
  calendarPostId?: string;
};
export type GeneratedDraftPlan = {
  id: string;
  planningBriefId: string;
  planningBriefTitle: string;
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  status: GeneratedPlanStatus;
  generatedAt: string;
  generatedBy: string;
  generatorVersion: string;
  items: GeneratedDraftPlanItem[];
  createdAt: string;
  updatedAt: string;
};
