export type CalendarView = "month" | "week";

export type ContentObjective = "educate" | "engage" | "inform" | "sell";

export type ContentCreationSource =
  | "manual"
  | "generated_plan"
  | "ai"
  | "template"
  | "repurposed"
  | "brand-asset";

export type ContentStatus = "draft" | "ready" | "scheduled" | "published" | "failed";

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "facebook"
  | "youtube";

export type ContentPillar = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

export type ContentIdea = {
  id: string;
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
  planningBriefId?: string;
  generatedPlanId?: string;
  generatedPlanItemId?: string;
  ownerId?: string;
  ownerName?: string;
  approvalNote?: string;
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  changesRequestedAt?: string;
  changesRequestedBy?: string;
  creationSource: ContentCreationSource;
  createdAt: string;
  updatedAt: string;
};

export type ContentVersion = {
  id: string;
  contentIdeaId: string;
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
  status: ContentStatus;
  createdBy: string;
  planningBriefId?: string;
  generatedPlanId?: string;
  generatedPlanItemId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CalendarFilters = {
  platform: SocialPlatform | "all";
  pillarId: string | "all";
  status: ContentStatus | "all";
  createdBy: string | "all";
};

export type CalendarState = {
  view: CalendarView;
  currentDate: string;
  selectedDate?: string;
  selectedVersionId?: string;
  scheduleDialogOpen: boolean;
  postDetailDrawerOpen: boolean;
  aiPlanDialogOpen: boolean;
  filters: CalendarFilters;
  pillars: ContentPillar[];
  ideas: ContentIdea[];
  versions: ContentVersion[];
};
