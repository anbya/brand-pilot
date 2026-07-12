import { getDatesInRange, normalizePreferredTimes } from "@/lib/calendar/ai-plan-utils";
import { parseLocalDate } from "@/lib/calendar/date-utils";
import { platformAssetTypes } from "@/lib/calendar/platform-options";
import type { AiPlanConflict, AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { AiPlanRequest, CalendarWeekday } from "@/lib/calendar/ai-plan-types";
import type { ContentPillar, ContentVersion } from "@/lib/calendar/types";

const weekdays: CalendarWeekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function getAvailablePlanDates(request: AiPlanRequest): string[] {
  const allowed = new Set(request.allowedDays);
  const dates = getDatesInRange(request.startDate, request.endDate).filter((date) => allowed.has(weekdays[parseLocalDate(date).getDay()]));
  const important = new Set(request.importantDates.map((item) => item.date));
  return [...dates.filter((date) => important.has(date)), ...dates.filter((date) => !important.has(date))];
}

export function derivePlanTime(preferredTimes: string[], slotIndex: number): string {
  const times = normalizePreferredTimes(preferredTimes);
  const base = times[Math.min(slotIndex, Math.max(times.length - 1, 0))] ?? "09:00";
  if (slotIndex < times.length) return base;
  const [hour, minute] = base.split(":").map(Number);
  const total = Math.min(hour * 60 + minute + (slotIndex - times.length + 1) * 60, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function detectAiPlanConflicts(items: AiPlanDraftItem[], existingVersions: ContentVersion[]): AiPlanDraftItem[] {
  return items.map((item, index) => {
    const conflicts: AiPlanConflict[] = existingVersions.filter((version) => version.publishDate === item.publishDate && version.publishTime === item.publishTime).map((version) => ({ type: "existing-time-conflict", message: "This time conflicts with an existing calendar post.", conflictingVersionId: version.id }));
    const generated = items.find((candidate, candidateIndex) => candidateIndex !== index && candidate.publishDate === item.publishDate && candidate.publishTime === item.publishTime);
    if (generated) conflicts.push({ type: "generated-time-conflict", message: "This time conflicts with another draft plan item.", conflictingPlanItemId: generated.id });
    return { ...item, conflicts };
  });
}

export function generateMockAiPlan(request: AiPlanRequest, pillars: ContentPillar[], existingVersions: ContentVersion[]): AiPlanDraftItem[] {
  const validPillars = request.pillarIds.map((id) => pillars.find((pillar) => pillar.id === id)).filter((pillar): pillar is ContentPillar => Boolean(pillar));
  const dates = getAvailablePlanDates(request);
  const platforms = request.platforms.filter((platform) => platformAssetTypes[platform]);
  if (!validPillars.length || !platforms.length || !dates.length || request.numberOfPosts < 1) return [];
  const promotionalCount = Math.round(request.numberOfPosts * request.promotionalPercentage / 100);
  const promotionPillar = validPillars.find((pillar) => pillar.id === "promotion");
  const dateSlots = dates.flatMap((date) => Array.from({ length: request.maximumPostsPerDay }, (_, slotIndex) => ({ date, slotIndex }))).slice(0, request.numberOfPosts);
  const occupied = new Set(existingVersions.map((version) => `${version.publishDate}|${version.publishTime}`));
  const generatedKeys = new Set<string>();
  const items = dateSlots.map(({ date, slotIndex }, index) => {
    const platform = platforms[index % platforms.length];
    const isPromotional = index >= Math.max(0, request.numberOfPosts - promotionalCount);
    const basePillar = validPillars[index % validPillars.length];
    const pillar = isPromotional && promotionPillar ? promotionPillar : basePillar;
    let time = derivePlanTime(request.preferredTimes, slotIndex);
    for (let attempt = slotIndex + 1; attempt < slotIndex + 24 && (occupied.has(`${date}|${time}`) || generatedKeys.has(`${date}|${time}`)); attempt += 1) {
      const candidate = derivePlanTime(request.preferredTimes, attempt);
      if (candidate === time) break;
      time = candidate;
    }
    generatedKeys.add(`${date}|${time}`);
    const important = request.importantDates.find((item) => item.date === date);
    const content = buildContent(pillar.name, index + 1, platform, request, isPromotional, important?.label);
    return { id: `ai-plan-item-${index + 1}`, selected: true, ...content, pillarId: pillar.id, objective: isPromotional && !promotionPillar ? "sell" : request.objective, targetAudience: request.targetAudience, isPromotional, platform, assetType: platformAssetTypes[platform][index % platformAssetTypes[platform].length], publishDate: date, publishTime: time, timezone: "Asia/Jakarta", conflicts: [] } satisfies AiPlanDraftItem;
  });
  return detectAiPlanConflicts(items, existingVersions);
}

function buildContent(pillarName: string, number: number, platform: string, request: AiPlanRequest, promotional: boolean, importantLabel?: string) {
  const product = request.priorityProduct || "Our Featured Product";
  const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() || "content";
  let title = `${pillarName} Content Idea ${number}`; let headline = `Explore ${pillarName}`; let cta = "Learn more";
  if (pillarName === "Education") { title = `Education: Practical Guide ${number}`; headline = `A Practical Guide for ${request.targetAudience}`; cta = "Save this guide"; }
  else if (pillarName === "Product") { title = `${request.priorityProduct || "Product"} Spotlight`; headline = `Discover ${product}`; }
  else if (pillarName === "Promotion" || promotional) { title = "Limited-Time Offer"; headline = "Don't Miss This Special Offer"; cta = "Shop now"; }
  else if (pillarName === "Lifestyle") { title = "Everyday Lifestyle Inspiration"; headline = `A Better Everyday Moment ${number}`; cta = "Share your experience"; }
  else if (pillarName === "Sustainability") { title = "A More Sustainable Choice"; headline = "Choose a More Thoughtful Option"; cta = "Learn how"; }
  else if (pillarName === "Customer Stories") { title = "Customer Story"; headline = `A Customer Story Worth Sharing ${number}`; cta = "Tell us your story"; }
  else if (pillarName === "Behind the Scenes") { title = "Behind the Scenes"; headline = `Inside the Process ${number}`; cta = "Follow the journey"; }
  if (importantLabel) { title = `${importantLabel} Content`; headline = `${importantLabel}: ${headline}`; }
  return { title, coreTopic: importantLabel ? `${importantLabel} content opportunity` : `${pillarName} guidance for ${request.targetAudience}`, mainMessage: `${pillarName} content designed to support ${request.targetAudience}.`, headline, caption: `${headline}. A locally generated draft for ${platform}, planned as item ${number}.`, cta, hashtags: [...new Set([slug(pillarName), slug(platform), promotional ? "promotion" : "contentplan"])], visualBrief: `Create a clear ${platform} visual focused on ${pillarName.toLowerCase()}.` };
}
