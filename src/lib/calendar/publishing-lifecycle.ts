import type { ContentVersion } from "@/lib/calendar/types";

export type PublishOutcome = "published" | "failed";

export interface PublishingLifecycleRepository {
  startPublishing(versionId: string, startedAt: string): Promise<void>;
  completePublishing(versionId: string, outcome: PublishOutcome, completedAt: string): Promise<void>;
}

export function isScheduleDue(version: ContentVersion, now: string): boolean {
  if (version.status !== "scheduled" || !version.publishDate || !version.publishTime) return false;
  const instant = new Date(now);
  if (Number.isNaN(instant.getTime())) return false;

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: version.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(instant);
    const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const currentLocalTime = `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}`;
    return currentLocalTime >= `${version.publishDate}T${version.publishTime}`;
  } catch {
    return false;
  }
}

export function startPrototypePublishing(version: ContentVersion, startedAt: string): ContentVersion {
  if (!isScheduleDue(version, startedAt)) return version;
  return { ...version, status: "publishing", publishingStartedAt: startedAt, publishedAt: undefined, publishFailedAt: undefined, publishFailureReason: undefined, updatedAt: startedAt };
}

export function completePrototypePublishing(version: ContentVersion, outcome: PublishOutcome, completedAt: string): ContentVersion {
  if (version.status !== "publishing") return version;
  return outcome === "published"
    ? { ...version, status: "published", publishedAt: completedAt, publishFailedAt: undefined, publishFailureReason: undefined, updatedAt: completedAt }
    : { ...version, status: "failed", publishedAt: undefined, publishFailedAt: completedAt, publishFailureReason: "Demo publish simulation returned a failed outcome.", updatedAt: completedAt };
}
