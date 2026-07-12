import type { ContentCreationSource, ContentObjective, SocialPlatform } from "@/lib/calendar/types";
export type UnscheduledIdeaSource = "manual" | "ai" | "campaign" | "brand-brain";
export type UnscheduledIdea = { id: string; title: string; coreTopic: string; pillarId: string; objective: ContentObjective; targetAudience: string; mainMessage: string; suggestedPlatform?: SocialPlatform; suggestedAssetType?: string; campaignId?: string; source: UnscheduledIdeaSource; creationSource: ContentCreationSource; notes?: string; createdAt: string; updatedAt: string };
export type UnscheduledIdeaFilters = { search: string; pillarId: string | "all"; platform: SocialPlatform | "all"; source: UnscheduledIdeaSource | "all" };
