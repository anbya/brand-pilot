import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { GeneratedDraftPlan, GeneratedDraftPlanItem, GeneratedPlanStatus } from "@/lib/calendar/generated-plan-types";
import type { PlanningBrief } from "@/lib/calendar/planning-brief-types";
import { isSocialPlatform } from "@/lib/platforms";

export const generatedPlanStorageKey = "brand-pilot:generated-draft-plans:v1";

export function readGeneratedPlans(storage: Pick<Storage, "getItem">): GeneratedDraftPlan[] {
  try { const raw = storage.getItem(generatedPlanStorageKey); if (!raw) return []; const value: unknown = JSON.parse(raw); if (!Array.isArray(value)) return []; return value.filter(isGeneratedPlan).map((plan) => { const items = plan.items.map((item) => ({ ...item, selected: false })); return { ...plan, items, status: calculateGeneratedPlanStatus(items) }; }); } catch { return []; }
}
export function writeGeneratedPlans(storage: Pick<Storage, "setItem">, plans: GeneratedDraftPlan[]): void { storage.setItem(generatedPlanStorageKey, JSON.stringify(plans)); }
export function getGeneratedPlanByBriefId(plans: GeneratedDraftPlan[], planningBriefId: string): GeneratedDraftPlan | undefined { return plans.find((plan) => plan.planningBriefId === planningBriefId); }
export function getGeneratedPlanById(plans: GeneratedDraftPlan[], id: string): GeneratedDraftPlan | undefined { return plans.find((plan) => plan.id === id); }

export function createGeneratedPlan(storage: Pick<Storage, "getItem" | "setItem">, brief: PlanningBrief, generatedItems: AiPlanDraftItem[]): GeneratedDraftPlan {
  const plans = readGeneratedPlans(storage); const existing = getGeneratedPlanByBriefId(plans, brief.id); if (existing) return existing;
  const now = new Date().toISOString();
  const plan: GeneratedDraftPlan = { id: `generated-plan-${brief.id}`, planningBriefId: brief.id, planningBriefTitle: brief.title, campaignId: brief.campaignId, campaignName: brief.campaignName, brandId: brief.brandId, brandName: brief.brandName, status: "generated", generatedAt: now, generatedBy: "AI Planner", generatorVersion: "mock-ai-planner-v1", items: generatedItems.map((item): GeneratedDraftPlanItem => ({ ...item, selected: false, calendarStatus: "not_added" })), createdAt: now, updatedAt: now };
  writeGeneratedPlans(storage, [plan, ...plans]); return plan;
}
export function saveGeneratedPlan(storage: Pick<Storage, "getItem" | "setItem">, plan: GeneratedDraftPlan): GeneratedDraftPlan {
  const plans = readGeneratedPlans(storage); const normalized = { ...plan, status: calculateGeneratedPlanStatus(plan.items), updatedAt: new Date().toISOString() }; writeGeneratedPlans(storage, [normalized, ...plans.filter((item) => item.id !== plan.id)]); return normalized;
}
export function calculateGeneratedPlanStatus(items: GeneratedDraftPlanItem[]): GeneratedPlanStatus { const added = items.filter((item) => item.calendarStatus === "added_to_calendar").length; if (!added) return "generated"; return added === items.length ? "approved_to_calendar" : "partially_approved"; }
function isGeneratedPlan(value: unknown): value is GeneratedDraftPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<GeneratedDraftPlan>;
  return typeof plan.id === "string" && typeof plan.planningBriefId === "string" && typeof plan.planningBriefTitle === "string" && typeof plan.campaignId === "string" && typeof plan.campaignName === "string" && typeof plan.brandId === "string" && typeof plan.brandName === "string" && isStatus(plan.status) && typeof plan.generatedAt === "string" && typeof plan.generatedBy === "string" && typeof plan.generatorVersion === "string" && typeof plan.createdAt === "string" && typeof plan.updatedAt === "string" && Array.isArray(plan.items) && plan.items.every(isGeneratedPlanItem);
}
function isGeneratedPlanItem(value: unknown): value is GeneratedDraftPlanItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GeneratedDraftPlanItem>;
  const validCalendarRelation = item.calendarStatus === "not_added" ? item.calendarPostId === undefined : typeof item.calendarPostId === "string" && item.calendarPostId.length > 0;
  return typeof item.id === "string" && typeof item.selected === "boolean" && typeof item.title === "string" && typeof item.coreTopic === "string" && typeof item.pillarId === "string" && isObjective(item.objective) && typeof item.targetAudience === "string" && typeof item.mainMessage === "string" && typeof item.isPromotional === "boolean" && isPlatform(item.platform) && typeof item.assetType === "string" && typeof item.headline === "string" && typeof item.caption === "string" && typeof item.cta === "string" && isStringArray(item.hashtags) && typeof item.visualBrief === "string" && typeof item.publishDate === "string" && typeof item.publishTime === "string" && typeof item.timezone === "string" && Array.isArray(item.conflicts) && item.conflicts.every(isConflict) && (item.calendarStatus === "not_added" || item.calendarStatus === "added_to_calendar") && validCalendarRelation;
}
function isConflict(value: unknown): boolean { if (!value || typeof value !== "object") return false; const conflict = value as { type?: unknown; message?: unknown }; return (conflict.type === "existing-time-conflict" || conflict.type === "generated-time-conflict") && typeof conflict.message === "string"; }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every((item) => typeof item === "string"); }
function isStatus(value: unknown): value is GeneratedPlanStatus { return value === "generated" || value === "partially_approved" || value === "approved_to_calendar"; }
function isObjective(value: unknown): boolean { return value === "educate" || value === "engage" || value === "inform" || value === "sell"; }
function isPlatform(value: unknown): boolean { return isSocialPlatform(value); }
