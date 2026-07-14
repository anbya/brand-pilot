import type { ContentIdea, ContentObjective, ContentVersion, SocialPlatform } from "@/lib/calendar/types";

export type ManualPostStatus = "draft" | "pending_approval" | "changes_requested" | "scheduled";
export type ManualPostGenerationStatus = "not_generated" | "ready";
export type ManualPostRole = "admin" | "manager" | "editor" | "viewer";
export type ManualPostVersionInput = {
  platform: SocialPlatform;
  assetType: string;
  headline: string;
  caption: string;
  cta: string;
  hashtags: string[];
  assetId?: string;
  /** Legacy display-only field for older mock records. New records use assetId. */
  mediaUrl?: string;
  visualBrief?: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
  createdBy: string;
};
export type ManualPostInput = {
  idea: {
    title: string;
    coreTopic: string;
    pillarId: string;
    objective: ContentObjective;
    targetAudience: string;
    mainMessage: string;
    campaignId?: string;
    campaignName?: string;
    brandId?: string;
    brandName?: string;
  };
  versions: ManualPostVersionInput[];
};
export type ManualPostDraft = {
  id: string;
  idea: ContentIdea;
  versions: ContentVersion[];
  status: ManualPostStatus;
  ownerId: string;
  ownerName: string;
  approvalNote?: string;
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  changesRequestedAt?: string;
  changesRequestedBy?: string;
  generationStatus?: ManualPostGenerationStatus;
  generatedAt?: string;
  generatorVersion?: string;
  createdAt: string;
  updatedAt: string;
};
export type ManualPostPermissions = {
  canCreate: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canRequestChanges: boolean;
  canView: boolean;
};
