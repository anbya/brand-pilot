import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { ManualPostInput } from "@/lib/calendar/manual-post-types";
import type { ManualGeneratedIdeasLifecycle } from "@/lib/calendar/manual-generated-ideas-lifecycle";

export type ContentWorkflowSource = "ai_plan" | "create_post";
export type ContentWorkflowStage =
  | "idea_draft"
  | "generated_ideas"
  | "unscheduled"
  | "scheduled";

export type GeneratedContentMock = AiPlanDraftItem & {
  generationStatus: "unscheduled" | "scheduled";
  generatedAt: string;
  generatorVersion: "cca-606-deterministic-v1" | "legacy-migrated";
  sourceRelationship?: {
    sourceType: "manual_generated_idea";
    sourceDraftId: string;
    sourcePlanId: string;
    sourceIdeaId: string;
    brandId?: string;
    campaignId?: string;
    platform: AiPlanDraftItem["platform"];
    format: string;
  };
};

export type ContentWorkflowItem = {
  id: string;
  title: string;
  source: ContentWorkflowSource;
  stage: ContentWorkflowStage;
  generationLifecycle?: ManualGeneratedIdeasLifecycle;
  brandId?: string;
  brandName?: string;
  campaignId?: string;
  campaignName?: string;
  ownerName: string;
  aiRequest?: AiPlanRequest;
  manualInput?: ManualPostInput;
  ideas: AiPlanDraftItem[];
  drafts: GeneratedContentMock[];
  generatedContentIds?: string[];
  approvalNote?: string;
  draftSavedAt?: string;
  ideasGeneratedAt?: string;
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContentWorkflowFilters = {
  query: string;
  source: ContentWorkflowSource | "all";
  stage: ContentWorkflowStage | "all";
};
