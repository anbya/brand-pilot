import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";

export type PlanningBriefStatus = "draft" | "pending_approval" | "approved" | "changes_requested";
export type PlanningBriefRole = "admin" | "manager" | "editor" | "viewer";

export type PlanningBrief = {
  id: string;
  title: string;
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  toneOfVoice: string;
  request: AiPlanRequest;
  ownerId: string;
  ownerName: string;
  status: PlanningBriefStatus;
  approvalNote?: string;
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  changesRequestedAt?: string;
  changesRequestedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type PlanningBriefPermissions = {
  canCreate: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canRequestChanges: boolean;
  canGenerate: boolean;
  canApproveGeneratedContent: boolean;
};
