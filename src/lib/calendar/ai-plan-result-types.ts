import type { ContentObjective, SocialPlatform } from "@/lib/calendar/types";
import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";

export type AiPlanConflictType = "existing-time-conflict" | "generated-time-conflict";
export type AiPlanConflict = { type: AiPlanConflictType; message: string; conflictingVersionId?: string; conflictingPlanItemId?: string };
export type AiPlanDraftItem = {
  id: string; selected: boolean; title: string; coreTopic: string; pillarId: string; objective: ContentObjective;
  targetAudience: string; mainMessage: string; isPromotional: boolean; platform: SocialPlatform; assetType: string;
  headline: string; caption: string; cta: string; hashtags: string[]; visualBrief: string;
  publishDate: string; publishTime: string; timezone: string; conflicts: AiPlanConflict[];
  source?: "ai_plan" | "manual_create_content";
  sourceDraftId?: string;
  brandId?: string;
  brandName?: string;
  campaignId?: string;
  campaignName?: string;
  createdBy?: string;
};
export type AiPlanGenerationResult = { request: AiPlanRequest; items: AiPlanDraftItem[]; generatedAt: string };
