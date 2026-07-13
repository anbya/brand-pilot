import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import type { PlanningBrief } from "@/lib/calendar/planning-brief-types";

export const planningBriefStorageKey = "brand-pilot:planning-briefs:v1";

export function readPlanningBriefs(storage: Pick<Storage, "getItem">): PlanningBrief[] {
  try {
    const raw = storage.getItem(planningBriefStorageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPlanningBrief) : [];
  } catch { return []; }
}

export function writePlanningBriefs(storage: Pick<Storage, "setItem">, briefs: PlanningBrief[]): void {
  storage.setItem(planningBriefStorageKey, JSON.stringify(briefs));
}

export function savePlanningBrief(storage: Pick<Storage, "getItem" | "setItem">, request: AiPlanRequest, existing?: PlanningBrief): PlanningBrief {
  const briefs = readPlanningBriefs(storage);
  const now = new Date().toISOString();
  const id = existing?.id ?? `planning-brief-${Date.now()}`;
  const brief: PlanningBrief = {
    id,
    title: request.title,
    campaignId: request.campaignId,
    campaignName: request.campaignName,
    brandId: request.brandId,
    brandName: request.brandName,
    toneOfVoice: request.toneOfVoice,
    request,
    ownerId: existing?.ownerId ?? "user-sarah-jenkins",
    ownerName: existing?.ownerName ?? "Sarah Jenkins",
    status: existing?.status === "changes_requested" ? "draft" : existing?.status ?? "draft",
    approvalNote: existing?.approvalNote,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  writePlanningBriefs(storage, [brief, ...briefs.filter((item) => item.id !== id)]);
  return brief;
}

function isPlanningBrief(value: unknown): value is PlanningBrief {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PlanningBrief>;
  return typeof item.id === "string" && typeof item.title === "string" && typeof item.status === "string" && Boolean(item.request);
}
