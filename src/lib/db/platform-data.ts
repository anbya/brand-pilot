import { prisma } from "@/lib/prisma";
import { normalizeCampaignStatus } from "@/lib/campaign-status";
import { normalizeSocialPlatforms } from "@/lib/platforms";
import { publishCampaignWithEntitlements, reserveRenderCredits } from "@/lib/billing/entitlements";
import { getRenderCreditsRemaining } from "@/lib/billing/selectors";
import type { Campaign } from "@/lib/mock-data";
import type {
  CampaignPackUsage,
  RenderCreditUsage,
  Workspace,
  WorkspaceSubscription,
} from "@/lib/billing/types";
import type {
  Prisma,
  CalendarItem as PrismaCalendarItem,
  BrandProfile as PrismaBrandProfile,
  Campaign as PrismaCampaign,
  CampaignPackUsage as PrismaCampaignPackUsage,
  RenderCreditUsage as PrismaRenderCreditUsage,
  Workspace as PrismaWorkspace,
  WorkspaceAsset as PrismaWorkspaceAsset,
  WorkspaceSubscription as PrismaWorkspaceSubscription,
} from "@/generated/prisma/client";
import type { WorkspaceAsset } from "@/lib/assets/types";
import type { CalendarItem } from "@/lib/mock-data";

export const DEFAULT_WORKSPACE_ID = "workspace-brand-pilot";
export const DEFAULT_ACTOR_ID = "user-sarah-jenkins";

export type BrandRecord = {
  id: string;
  workspaceId: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  businessDescription: string;
  usp: string;
  brandVoice: string;
  language: string;
  location: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  primaryColor: string;
  secondaryColor: string;
  aiSummary: string;
  aiPersonality: string;
  aiTone: string;
  aiKeywords: string[];
  aiNegativePrompt: string;
};

export async function getBrands(workspaceId = DEFAULT_WORKSPACE_ID): Promise<BrandRecord[]> {
  const brands = await prisma.brandProfile.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });
  return brands.map(toBrandRecord);
}

export async function createBrand(input: Partial<BrandRecord>, workspaceId = DEFAULT_WORKSPACE_ID): Promise<BrandRecord> {
  const companyName = cleanString(input.companyName) || "Untitled Brand";
  const slug = slugify(companyName);
  const nowId = Date.now();
  const brand = await prisma.brandProfile.create({
    data: {
      id: input.id || `brand-${slug || nowId}`,
      workspaceId,
      companyName,
      slug: `${slug || "brand"}-${nowId}`,
      industry: cleanString(input.industry) || "General",
      targetAudience: cleanString(input.targetAudience) || "General audience",
      businessDescription: cleanString(input.businessDescription) || "Brand profile created from API.",
      usp: cleanString(input.usp) || "Differentiated brand experience.",
      brandVoice: cleanString(input.brandVoice) || "Professional",
      language: cleanString(input.language) || "id",
      location: cleanString(input.location) || "Indonesia",
      website: optionalString(input.website),
      instagram: optionalString(input.instagram),
      facebook: optionalString(input.facebook),
      tiktok: optionalString(input.tiktok),
      youtube: optionalString(input.youtube),
      primaryColor: cleanString(input.primaryColor) || "#0058bc",
      secondaryColor: cleanString(input.secondaryColor) || "#d3e4fe",
      aiSummary: cleanString(input.aiSummary) || "AI summary pending.",
      aiPersonality: cleanString(input.aiPersonality) || "Helpful and clear",
      aiTone: cleanString(input.aiTone) || "Simple and friendly",
      aiKeywords: input.aiKeywords?.length ? input.aiKeywords : [],
      aiNegativePrompt: cleanString(input.aiNegativePrompt) || "",
    },
  });
  return toBrandRecord(brand);
}

export async function getCampaigns(workspaceId = DEFAULT_WORKSPACE_ID): Promise<Campaign[]> {
  const campaigns = await prisma.campaign.findMany({
    where: { workspaceId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
  return campaigns.map(toCampaign);
}

export async function getCalendarItems(workspaceId = DEFAULT_WORKSPACE_ID): Promise<CalendarItem[]> {
  const items = await prisma.calendarItem.findMany({
    where: { workspaceId },
    orderBy: [{ scheduledDate: "asc" }, { dayNumber: "asc" }],
  });
  return items.map(toCalendarItem);
}

export async function createCampaign(input: Partial<Campaign>, workspaceId = DEFAULT_WORKSPACE_ID): Promise<Campaign> {
  const brandId = input.brandId || await getDefaultBrandId(workspaceId);
  const startDate = input.startDate || new Date().toISOString().slice(0, 10);
  const endDate = input.endDate || startDate;
  const campaign = await prisma.campaign.create({
    data: {
      id: input.id || `cmp-${Date.now()}`,
      workspaceId,
      brandId,
      name: cleanString(input.name) || "Untitled Campaign",
      goal: cleanString(input.goal) || "awareness",
      platforms: normalizeSocialPlatforms(input.platforms, ["instagram"]),
      durationDays: normalizeDuration(input.durationDays),
      startDate,
      endDate,
      status: normalizeCampaignStatus(input.status),
      campaignPackConsumed: Boolean(input.campaignPackConsumed),
      campaignPackUsageId: input.campaignPackUsageId,
      publishedAt: input.publishedAt,
      publishedBy: input.publishedBy,
      strategy: cleanString(input.strategy) || "Campaign blueprint saved and ready for completion.",
      contentPillars: input.contentPillars?.length ? input.contentPillars : [],
      postingFrequency: cleanString(input.postingFrequency) || "Not configured",
      ctaRecommendation: cleanString(input.ctaRecommendation) || "Not configured",
    },
  });
  return toCampaign(campaign);
}

export async function getActiveWorkspace(workspaceId = DEFAULT_WORKSPACE_ID): Promise<Workspace> {
  const workspace = await prisma.workspace.findUniqueOrThrow({ where: { id: workspaceId } });
  return toWorkspace(workspace);
}

export async function getActiveSubscription(workspaceId = DEFAULT_WORKSPACE_ID): Promise<WorkspaceSubscription | undefined> {
  const subscription = await prisma.workspaceSubscription.findFirst({
    where: { workspaceId, status: { in: ["active", "trialing", "past_due"] } },
    orderBy: { createdAt: "desc" },
  });
  return subscription ? toWorkspaceSubscription(subscription) : undefined;
}

export async function getCampaignPackUsages(subscriptionId?: string): Promise<CampaignPackUsage[]> {
  if (!subscriptionId) return [];
  const usages = await prisma.campaignPackUsage.findMany({ where: { subscriptionId } });
  return usages.map(toCampaignPackUsage);
}

export async function getRenderCreditUsages(subscriptionId?: string): Promise<RenderCreditUsage[]> {
  if (!subscriptionId) return [];
  const usages = await prisma.renderCreditUsage.findMany({ where: { subscriptionId } });
  return usages.map(toRenderCreditUsage);
}

export async function publishCampaign(campaignId: string, actorId = DEFAULT_ACTOR_ID, workspaceId = DEFAULT_WORKSPACE_ID) {
  const [campaignRecord, subscription, usages, workspaceCampaigns] = await Promise.all([
    prisma.campaign.findUnique({ where: { id: campaignId } }),
    getActiveSubscription(workspaceId),
    prisma.campaignPackUsage.findMany({ where: { workspaceId } }),
    prisma.campaign.findMany({ where: { workspaceId }, select: { brandId: true } }),
  ]);

  if (!campaignRecord) return { ok: false as const, code: "campaign_not_found", message: "Campaign not found" };

  const campaign = toCampaign(campaignRecord);
  const result = publishCampaignWithEntitlements({
    campaign,
    subscription,
    usages: usages.map(toCampaignPackUsage),
    workspaceBrandIds: workspaceCampaigns.map((item) => item.brandId),
    campaignComplete: Boolean(campaign.name && campaign.strategy && campaign.platforms.length),
    hasPermission: true,
    actorId,
    now: new Date().toISOString(),
    referenceDate: new Date().toISOString().slice(0, 10),
  });

  if (!result.ok) return result;

  const updated = await prisma.$transaction(async (tx) => {
    const savedCampaign = await tx.campaign.update({
      where: { id: campaign.id },
      data: {
        status: result.campaign.status,
        campaignPackConsumed: result.campaign.campaignPackConsumed,
        campaignPackUsageId: result.campaign.campaignPackUsageId,
        publishedAt: result.campaign.publishedAt,
        publishedBy: result.campaign.publishedBy,
      },
    });

    const usage = result.usages.find((item) => item.campaignId === campaign.id);
    if (usage) {
      await tx.campaignPackUsage.upsert({
        where: { subscriptionId_campaignId: { subscriptionId: usage.subscriptionId, campaignId: usage.campaignId } },
        create: usage,
        update: usage,
      });
    }

    return savedCampaign;
  });

  return {
    ...result,
    campaign: toCampaign(updated),
  };
}

export async function reserveRenderCreditsForContent(options: {
  contentId: string;
  renderJobId: string;
  credits: number;
  workspaceId?: string;
}) {
  const workspaceId = options.workspaceId ?? DEFAULT_WORKSPACE_ID;
  const subscription = await getActiveSubscription(workspaceId);
  const existingUsages = await getRenderCreditUsages(subscription?.id);
  const reservation = reserveRenderCredits({
    subscription,
    usages: existingUsages,
    contentId: options.contentId,
    renderJobId: options.renderJobId,
    credits: options.credits,
    now: new Date().toISOString(),
  });

  if (!reservation.ok) return { reservation, credits: getRenderCreditsRemaining(existingUsages, subscription) };

  if (reservation.usage && !reservation.idempotent) {
    await prisma.renderCreditUsage.create({ data: reservation.usage });
  }

  const usages = await getRenderCreditUsages(subscription?.id);
  return { reservation: { ...reservation, usages }, credits: getRenderCreditsRemaining(usages, subscription) };
}

export async function queueOperationJob(options: {
  type: string;
  entityId: string;
  message: string;
  status?: string;
  metadata?: Prisma.InputJsonObject;
  workspaceId?: string;
}) {
  return prisma.operationJob.create({
    data: {
      workspaceId: options.workspaceId ?? DEFAULT_WORKSPACE_ID,
      type: options.type,
      entityId: options.entityId,
      message: options.message,
      status: options.status ?? "queued",
      metadata: options.metadata,
    },
  });
}

export async function getAssets(workspaceId = DEFAULT_WORKSPACE_ID): Promise<WorkspaceAsset[]> {
  const assets = await prisma.workspaceAsset.findMany({
    where: { workspaceId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
  return assets.map(toWorkspaceAsset);
}

export async function upsertAsset(asset: WorkspaceAsset, workspaceId = DEFAULT_WORKSPACE_ID): Promise<WorkspaceAsset> {
  const saved = await prisma.workspaceAsset.upsert({
    where: { id: asset.id },
    create: { ...asset, workspaceId, usage: asset.usage },
    update: { ...asset, workspaceId, usage: asset.usage },
  });
  return toWorkspaceAsset(saved);
}

export async function deleteAsset(assetId: string) {
  await prisma.workspaceAsset.delete({ where: { id: assetId } });
}

async function getDefaultBrandId(workspaceId: string) {
  const brand = await prisma.brandProfile.findFirst({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!brand) throw new Error("No brand exists for this workspace.");
  return brand.id;
}

function toBrandRecord(brand: PrismaBrandProfile): BrandRecord {
  return {
    id: brand.id,
    workspaceId: brand.workspaceId,
    companyName: brand.companyName,
    industry: brand.industry,
    targetAudience: brand.targetAudience,
    businessDescription: brand.businessDescription,
    usp: brand.usp,
    brandVoice: brand.brandVoice,
    language: brand.language,
    location: brand.location,
    website: brand.website ?? undefined,
    instagram: brand.instagram ?? undefined,
    facebook: brand.facebook ?? undefined,
    tiktok: brand.tiktok ?? undefined,
    youtube: brand.youtube ?? undefined,
    primaryColor: brand.primaryColor,
    secondaryColor: brand.secondaryColor,
    aiSummary: brand.aiSummary,
    aiPersonality: brand.aiPersonality,
    aiTone: brand.aiTone,
    aiKeywords: [...brand.aiKeywords],
    aiNegativePrompt: brand.aiNegativePrompt,
  };
}

function toCampaign(campaign: PrismaCampaign): Campaign {
  return {
    id: campaign.id,
    workspaceId: campaign.workspaceId,
    brandId: campaign.brandId,
    name: campaign.name,
    goal: normalizeGoal(campaign.goal),
    platforms: normalizeSocialPlatforms(campaign.platforms, ["instagram"]),
    durationDays: normalizeDuration(campaign.durationDays),
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    status: normalizeCampaignStatus(campaign.status),
    campaignPackConsumed: campaign.campaignPackConsumed,
    campaignPackUsageId: campaign.campaignPackUsageId ?? undefined,
    publishedAt: campaign.publishedAt ?? undefined,
    publishedBy: campaign.publishedBy ?? undefined,
    strategy: campaign.strategy,
    contentPillars: [...campaign.contentPillars],
    postingFrequency: campaign.postingFrequency,
    ctaRecommendation: campaign.ctaRecommendation,
  };
}

function toCalendarItem(item: PrismaCalendarItem): CalendarItem {
  return {
    id: item.id,
    dayNumber: item.dayNumber,
    topic: item.topic,
    hook: item.hook,
    objective: item.objective,
    cta: item.cta,
    assetNeeded: item.assetNeeded,
    captionPreview: item.captionPreview,
    platform: normalizeSocialPlatforms([item.platform], ["instagram"])[0]!,
    status: normalizeAppStatus(item.status),
  };
}

function toWorkspace(workspace: PrismaWorkspace): Workspace {
  return { id: workspace.id, name: workspace.name };
}

function toWorkspaceSubscription(subscription: PrismaWorkspaceSubscription): WorkspaceSubscription {
  return {
    id: subscription.id,
    workspaceId: subscription.workspaceId,
    planId: subscription.planId as WorkspaceSubscription["planId"],
    status: subscription.status as WorkspaceSubscription["status"],
    billingInterval: subscription.billingInterval as WorkspaceSubscription["billingInterval"],
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    assignedCampaignPackLimit: subscription.assignedCampaignPackLimit,
    renderCreditLimit: subscription.renderCreditLimit,
    startedAt: subscription.startedAt,
    canceledAt: subscription.canceledAt ?? undefined,
  };
}

function toCampaignPackUsage(usage: PrismaCampaignPackUsage): CampaignPackUsage {
  return {
    id: usage.id,
    workspaceId: usage.workspaceId,
    subscriptionId: usage.subscriptionId,
    campaignId: usage.campaignId,
    billingPeriodStart: usage.billingPeriodStart,
    billingPeriodEnd: usage.billingPeriodEnd,
    consumedAt: usage.consumedAt,
    consumedBy: usage.consumedBy,
  };
}

function toRenderCreditUsage(usage: PrismaRenderCreditUsage): RenderCreditUsage {
  return {
    id: usage.id,
    workspaceId: usage.workspaceId,
    subscriptionId: usage.subscriptionId,
    contentId: usage.contentId,
    renderJobId: usage.renderJobId,
    credits: usage.credits,
    status: usage.status as RenderCreditUsage["status"],
    createdAt: usage.createdAt,
    updatedAt: usage.updatedAt,
  };
}

function toWorkspaceAsset(asset: PrismaWorkspaceAsset): WorkspaceAsset {
  return {
    id: asset.id,
    name: asset.name,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
    kind: asset.kind as WorkspaceAsset["kind"],
    source: asset.source as WorkspaceAsset["source"],
    previewUrl: asset.previewUrl,
    description: asset.description,
    tags: [...asset.tags],
    sizeBytes: asset.sizeBytes,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    brandIds: [...asset.brandIds],
    campaignIds: [...asset.campaignIds],
    usage: Array.isArray(asset.usage) ? asset.usage as WorkspaceAsset["usage"] : [],
  };
}

function normalizeGoal(value: string): Campaign["goal"] {
  if (["awareness", "sales", "promotion", "education", "event"].includes(value)) return value as Campaign["goal"];
  return "awareness";
}

function normalizeDuration(value: unknown): Campaign["durationDays"] {
  const days = Number(value);
  if (days <= 7) return 7;
  if (days <= 14) return 14;
  return 30;
}

function normalizeAppStatus(value: string): CalendarItem["status"] {
  if (["draft", "generating", "review", "approved", "rejected", "need_revision", "failed"].includes(value)) return value as CalendarItem["status"];
  return "draft";
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown): string | undefined {
  const cleaned = cleanString(value);
  return cleaned || undefined;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
