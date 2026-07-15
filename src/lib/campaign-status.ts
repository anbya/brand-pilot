export type CampaignStatus = "blueprint" | "ready" | "published";

export const campaignStatuses = ["blueprint", "ready", "published"] as const satisfies readonly CampaignStatus[];

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  blueprint: "Blueprint",
  ready: "Ready",
  published: "Published",
};

export type CampaignTransitionResult =
  | { ok: true; status: CampaignStatus }
  | { ok: false; status: CampaignStatus; reason: "invalid_transition" };

export function isCampaignStatus(value: unknown): value is CampaignStatus {
  return typeof value === "string" && campaignStatuses.includes(value as CampaignStatus);
}

export function normalizeCampaignStatus(value: unknown, options: { complete?: boolean } = {}): CampaignStatus {
  if (isCampaignStatus(value)) return value;

  switch (typeof value === "string" ? value.toLowerCase() : "") {
    case "approved":
    case "active":
    case "completed":
    case "archived":
      return "published";
    case "review":
    case "planning":
    case "paused":
      return "ready";
    case "generating":
      return options.complete ? "ready" : "blueprint";
    case "draft":
    default:
      return "blueprint";
  }
}

export function transitionCampaignStatus(current: CampaignStatus, target: CampaignStatus): CampaignTransitionResult {
  const allowed = (current === "blueprint" && target === "ready")
    || (current === "ready" && (target === "blueprint" || target === "published"));
  return allowed ? { ok: true, status: target } : { ok: false, status: current, reason: "invalid_transition" };
}

export function isCampaignUsableForContent(status: CampaignStatus, allowReady = true): boolean {
  return status === "published" || (allowReady && status === "ready");
}
