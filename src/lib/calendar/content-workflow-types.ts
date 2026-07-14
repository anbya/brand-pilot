import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { ManualPostInput } from "@/lib/calendar/manual-post-types";

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
};

export type ContentWorkflowItem = {
  id: string;
  title: string;
  source: ContentWorkflowSource;
  stage: ContentWorkflowStage;
  brandId?: string;
  brandName?: string;
  campaignId?: string;
  campaignName?: string;
  ownerName: string;
  aiRequest?: AiPlanRequest;
  manualInput?: ManualPostInput;
  ideas: AiPlanDraftItem[];
  drafts: GeneratedContentMock[];
  approvalNote?: string;
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
