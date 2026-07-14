import { generateMockAiPlan } from "@/lib/calendar/ai-plan-generator";
import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { platformAssetTypes } from "@/lib/calendar/platform-options";
import type { ManualPostInput } from "@/lib/calendar/manual-post-types";
import { generateDeterministicContentMock } from "@/lib/calendar/generated-content-mock";
import type { ContentWorkflowFilters, ContentWorkflowItem, ContentWorkflowStage, GeneratedContentMock } from "@/lib/calendar/content-workflow-types";
import { isSocialPlatform, normalizeSocialPlatforms } from "@/lib/platforms";

export const contentWorkflowStorageKey = "brand-pilot:content-workflow:v1";

type ReadStorage = Pick<Storage, "getItem">;
type WriteStorage = Pick<Storage, "getItem" | "setItem">;

export function readContentWorkflow(storage: ReadStorage): ContentWorkflowItem[] {
  try {
    const raw = storage.getItem(contentWorkflowStorageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.flatMap((value) => {
      const item = migrateWorkflowItem(value);
      return item ? [item] : [];
    }) : [];
  } catch {
    return [];
  }
}

export function writeContentWorkflow(storage: Pick<Storage, "setItem">, items: ContentWorkflowItem[]) {
  storage.setItem(contentWorkflowStorageKey, JSON.stringify(items));
}

export function saveAiPlanWorkflow(storage: WriteStorage, request: AiPlanRequest, existing?: ContentWorkflowItem) {
  const now = new Date().toISOString();
  const item: ContentWorkflowItem = {
    id: existing?.id ?? `content-ai-${Date.now()}`,
    title: request.title,
    source: "ai_plan",
    stage: "idea_draft",
    brandId: request.brandId,
    brandName: request.brandName,
    campaignId: request.campaignId,
    campaignName: request.campaignName,
    ownerName: existing?.ownerName ?? "Sarah Jenkins",
    aiRequest: request,
    ideas: [],
    drafts: [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  return persist(storage, item);
}

export function saveManualWorkflow(storage: WriteStorage, input: ManualPostInput, existing?: ContentWorkflowItem) {
  const now = new Date().toISOString();
  const item: ContentWorkflowItem = {
    id: existing?.id ?? `content-manual-${Date.now()}`,
    title: input.idea.title,
    source: "create_post",
    stage: "idea_draft",
    brandId: input.idea.brandId,
    brandName: input.idea.brandName,
    campaignId: input.idea.campaignId,
    campaignName: input.idea.campaignName,
    ownerName: existing?.ownerName ?? "Wanda",
    manualInput: input,
    ideas: [],
    drafts: [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  return persist(storage, item);
}

export function approveDraft(storage: WriteStorage, item: ContentWorkflowItem, actor: string) {
  if (item.stage !== "idea_draft") return item;
  const now = new Date().toISOString();
  const ideas = item.source === "ai_plan" && item.aiRequest
    ? generateMockAiPlan(item.aiRequest, initialCalendarState.pillars, initialCalendarState.versions)
    : manualIdeas(item);
  return persist(storage, { ...item, stage: "generated_ideas", ideas, drafts: [], approvedAt: now, approvedBy: actor, approvalNote: undefined, updatedAt: now });
}

export function approveGeneratedIdeas(storage: WriteStorage, item: ContentWorkflowItem, actor: string) {
  if (item.stage !== "generated_ideas") return item;
  const now = new Date().toISOString();
  const drafts = item.ideas.map((idea, index) => generateDeterministicContentMock(idea, index, now));
  return persist(storage, { ...item, stage: "unscheduled", drafts, approvedAt: now, approvedBy: actor, approvalNote: undefined, updatedAt: now });
}

export function rejectGeneratedIdeas(storage: WriteStorage, item: ContentWorkflowItem, actor: string, note?: string) {
  if (item.stage !== "generated_ideas") return item;
  const now = new Date().toISOString();
  return persist(storage, { ...item, stage: "idea_draft", ideas: [], drafts: [], approvalNote: note?.trim() || `Generated ideas rejected by ${actor}.`, updatedAt: now });
}

export function scheduleWorkflow(storage: WriteStorage, item: ContentWorkflowItem) {
  if (item.stage !== "unscheduled" || !item.drafts.length || item.drafts.some((draft) => !draft.publishDate || !draft.publishTime)) return item;
  const now = new Date().toISOString();
  const drafts = item.drafts.map((draft) => ({ ...draft, generationStatus: "scheduled" as const }));
  return persist(storage, { ...item, stage: "scheduled", drafts, scheduledAt: now, updatedAt: now });
}

export function updateWorkflowSchedule(storage: WriteStorage, item: ContentWorkflowItem, recordId: string, values: { publishDate: string; publishTime: string }) {
  if (item.stage !== "unscheduled") return item;
  const drafts = item.drafts.map((record) => record.id === recordId ? { ...record, publishDate: values.publishDate, publishTime: values.publishTime } : record);
  return persist(storage, { ...item, drafts, updatedAt: new Date().toISOString() });
}

export function filterContentWorkflow(items: ContentWorkflowItem[], filters: ContentWorkflowFilters) {
  const query = filters.query.trim().toLowerCase();
  const priority: Record<ContentWorkflowStage, number> = { idea_draft: 0, generated_ideas: 1, unscheduled: 2, scheduled: 3 };
  return items.filter((item) => (!query || [item.title, item.brandName, item.campaignName, item.ownerName].some((value) => value?.toLowerCase().includes(query))) && (filters.source === "all" || item.source === filters.source) && (filters.stage === "all" || item.stage === filters.stage)).sort((a, b) => priority[a.stage] - priority[b.stage] || b.updatedAt.localeCompare(a.updatedAt));
}

function persist(storage: WriteStorage, item: ContentWorkflowItem) {
  const items = readContentWorkflow(storage);
  writeContentWorkflow(storage, [item, ...items.filter((current) => current.id !== item.id)]);
  return item;
}

function manualIdeas(item: ContentWorkflowItem): AiPlanDraftItem[] {
  if (!item.manualInput) return [];
  return item.manualInput.versions.map((version, index) => ({
    id: `idea-${item.id}-${index}`,
    selected: false,
    title: item.manualInput!.idea.title,
    coreTopic: item.manualInput!.idea.coreTopic,
    pillarId: item.manualInput!.idea.pillarId,
    objective: item.manualInput!.idea.objective,
    targetAudience: item.manualInput!.idea.targetAudience,
    mainMessage: item.manualInput!.idea.mainMessage,
    isPromotional: item.manualInput!.idea.objective === "sell",
    platform: version.platform,
    assetType: version.assetType,
    headline: version.headline,
    caption: version.caption,
    cta: version.cta,
    hashtags: version.hashtags,
    visualBrief: version.visualBrief ?? "",
    publishDate: version.publishDate,
    publishTime: version.publishTime,
    timezone: version.timezone,
    conflicts: [],
  }));
}

type LegacyWorkflowStage = "draft" | "pending_approval" | "changes_requested" | "content_idea" | "content_draft" | "ready" | "draft_pending_approval" | "draft_changes_requested" | "draft_approved" | "generated_ideas_pending_approval" | "generated_ideas_changes_requested" | "generated_ideas_approved";

function migrateWorkflowItem(value: unknown): ContentWorkflowItem | undefined {
  if (!value || typeof value !== "object") return undefined;
  const item = value as Partial<ContentWorkflowItem>;
  if (typeof item.id !== "string" || typeof item.title !== "string" || (item.source !== "ai_plan" && item.source !== "create_post") || !isKnownStage(item.stage) || !Array.isArray(item.ideas) || !Array.isArray(item.drafts) || typeof item.createdAt !== "string" || typeof item.updatedAt !== "string") return undefined;
  const originalStage = item.stage as ContentWorkflowStage | LegacyWorkflowStage;
  const stage = migrateStage(originalStage);
  const resetSchedule = originalStage === "content_draft" || originalStage === "ready";
  const drafts = item.drafts.map((draft) => normalizeGeneratedContent(resetSchedule ? { ...draft, publishDate: "", publishTime: "", conflicts: [] } : draft, stage, item.updatedAt!));
  const ideas = item.ideas.map(normalizeIdeaPlatform);
  const aiRequest = item.aiRequest ? { ...item.aiRequest, platforms: normalizeSocialPlatforms(item.aiRequest.platforms, ["instagram"]) } : undefined;
  const manualInput = item.manualInput ? { ...item.manualInput, versions: item.manualInput.versions.map((version) => normalizeVersionPlatform(version)) } : undefined;
  return { ...item, stage, ideas, drafts, aiRequest, manualInput } as ContentWorkflowItem;
}

function normalizeGeneratedContent(draft: AiPlanDraftItem | GeneratedContentMock, stage: ContentWorkflowStage, fallbackGeneratedAt: string): GeneratedContentMock {
  const stored = draft as Partial<GeneratedContentMock>;
  const platform = isSocialPlatform(draft.platform) ? draft.platform : "instagram";
  return {
    ...draft,
    platform,
    assetType: isSocialPlatform(draft.platform) ? draft.assetType : platformAssetTypes[platform][0],
    generationStatus: stage === "scheduled" ? "scheduled" : "unscheduled",
    generatedAt: typeof stored.generatedAt === "string" ? stored.generatedAt : fallbackGeneratedAt,
    generatorVersion: stored.generatorVersion === "cca-606-deterministic-v1" ? stored.generatorVersion : "legacy-migrated",
  };
}

function normalizeIdeaPlatform(idea: AiPlanDraftItem): AiPlanDraftItem {
  const platform = isSocialPlatform(idea.platform) ? idea.platform : "instagram";
  return { ...idea, platform, assetType: isSocialPlatform(idea.platform) ? idea.assetType : platformAssetTypes[platform][0] };
}

function normalizeVersionPlatform(version: ManualPostInput["versions"][number]): ManualPostInput["versions"][number] {
  const platform = isSocialPlatform(version.platform) ? version.platform : "instagram";
  return { ...version, platform, assetType: isSocialPlatform(version.platform) ? version.assetType : platformAssetTypes[platform][0] };
}

function isStage(value: unknown): value is ContentWorkflowStage {
  return value === "idea_draft" || value === "generated_ideas" || value === "unscheduled" || value === "scheduled";
}

function isKnownStage(value: unknown): value is ContentWorkflowStage | LegacyWorkflowStage { return isStage(value) || value === "draft" || value === "pending_approval" || value === "changes_requested" || value === "content_idea" || value === "content_draft" || value === "ready" || value === "draft_pending_approval" || value === "draft_changes_requested" || value === "draft_approved" || value === "generated_ideas_pending_approval" || value === "generated_ideas_changes_requested" || value === "generated_ideas_approved"; }
function migrateStage(stage: ContentWorkflowStage | LegacyWorkflowStage): ContentWorkflowStage { if (isStage(stage)) return stage; const stages: Record<LegacyWorkflowStage, ContentWorkflowStage> = { draft: "idea_draft", pending_approval: "idea_draft", changes_requested: "idea_draft", content_idea: "generated_ideas", content_draft: "unscheduled", ready: "unscheduled", draft_pending_approval: "idea_draft", draft_changes_requested: "idea_draft", draft_approved: "idea_draft", generated_ideas_pending_approval: "generated_ideas", generated_ideas_changes_requested: "generated_ideas", generated_ideas_approved: "generated_ideas" }; return stages[stage]; }
