import { initialCalendarState } from "@/lib/calendar/mock-data";
import type { CalendarFilters, CalendarState, ContentIdea, ContentPillar, ContentVersion } from "@/lib/calendar/types";
import { isSocialPlatform } from "@/lib/platforms";

export const calendarStateStorageKey = "brand-pilot:calendar-state:v1";

const schemaVersion = 1;

type CalendarStateEnvelope = {
  version: typeof schemaVersion;
  state: CalendarState;
};

type CalendarStateStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface CalendarStateRepository {
  load(): CalendarState;
  save(state: CalendarState): void;
  reset(): CalendarState;
}

export function createLocalCalendarStateRepository(storage: CalendarStateStorage): CalendarStateRepository {
  return {
    load() {
      const raw = storage.getItem(calendarStateStorageKey);
      if (raw) {
        try {
          const envelope: unknown = JSON.parse(raw);
          if (isRecord(envelope) && envelope.version === schemaVersion) {
            const state = normalizeCalendarState(envelope.state);
            writeState(storage, state);
            return state;
          }
        } catch {
          // Invalid prototype data is replaced with a clean initial snapshot below.
        }
      }

      const state = cloneInitialCalendarState();
      writeState(storage, state);
      return state;
    },
    save(state) {
      writeState(storage, normalizeCalendarState(state));
    },
    reset() {
      storage.removeItem(calendarStateStorageKey);
      const state = cloneInitialCalendarState();
      writeState(storage, state);
      return state;
    },
  };
}

export function normalizeCalendarState(value: unknown): CalendarState {
  if (!isRecord(value)) return cloneInitialCalendarState();

  const pillars = deduplicateById(Array.isArray(value.pillars) ? value.pillars.filter(isContentPillar) : []);
  const ideas = deduplicateById(Array.isArray(value.ideas) ? value.ideas.filter(isContentIdea) : []);
  const ideaIds = new Set(ideas.map((idea) => idea.id));
  const versions = deduplicateById(Array.isArray(value.versions) ? value.versions.filter(isContentVersion) : [])
    .filter((version) => ideaIds.has(version.contentIdeaId));

  return {
    view: value.view === "week" ? "week" : "month",
    currentDate: isDateString(value.currentDate) ? value.currentDate : initialCalendarState.currentDate,
    selectedDate: isDateString(value.selectedDate) ? value.selectedDate : undefined,
    selectedVersionId: undefined,
    postDetailDrawerOpen: false,
    filters: normalizeFilters(value.filters, pillars, versions),
    pillars: pillars.length ? pillars : clone(initialCalendarState.pillars),
    ideas,
    versions,
  };
}

function writeState(storage: Pick<Storage, "setItem">, state: CalendarState): void {
  const envelope: CalendarStateEnvelope = { version: schemaVersion, state };
  storage.setItem(calendarStateStorageKey, JSON.stringify(envelope));
}

function cloneInitialCalendarState(): CalendarState {
  return clone(initialCalendarState);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function normalizeFilters(value: unknown, pillars: ContentPillar[], versions: ContentVersion[]): CalendarFilters {
  const filters = isRecord(value) ? value : {};
  const pillarIds = new Set(pillars.map((pillar) => pillar.id));
  const creators = new Set(versions.map((version) => version.createdBy));
  const statuses = new Set(["draft", "ready", "scheduled", "publishing", "published", "failed"]);
  return {
    platform: filters.platform === "all" || isSocialPlatform(filters.platform) ? filters.platform : "all",
    pillarId: filters.pillarId === "all" || (typeof filters.pillarId === "string" && pillarIds.has(filters.pillarId)) ? filters.pillarId : "all",
    status: filters.status === "all" || (typeof filters.status === "string" && statuses.has(filters.status)) ? filters.status as CalendarFilters["status"] : "all",
    createdBy: filters.createdBy === "all" || (typeof filters.createdBy === "string" && creators.has(filters.createdBy)) ? filters.createdBy : "all",
  };
}

function isContentPillar(value: unknown): value is ContentPillar {
  return isRecord(value) && isNonEmptyString(value.id) && isNonEmptyString(value.name) && isNonEmptyString(value.color);
}

function isContentIdea(value: unknown): value is ContentIdea {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.title)
    && isNonEmptyString(value.coreTopic)
    && isNonEmptyString(value.pillarId)
    && ["educate", "engage", "inform", "sell"].includes(String(value.objective))
    && isNonEmptyString(value.targetAudience)
    && isNonEmptyString(value.mainMessage)
    && ["manual", "generated_plan", "ai", "template", "repurposed", "brand-asset"].includes(String(value.creationSource))
    && isNonEmptyString(value.createdAt)
    && isNonEmptyString(value.updatedAt);
}

function isContentVersion(value: unknown): value is ContentVersion {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.contentIdeaId)
    && isSocialPlatform(value.platform)
    && isNonEmptyString(value.assetType)
    && typeof value.headline === "string"
    && typeof value.caption === "string"
    && typeof value.cta === "string"
    && Array.isArray(value.hashtags)
    && value.hashtags.every((hashtag) => typeof hashtag === "string")
    && isDateString(value.publishDate)
    && typeof value.publishTime === "string"
    && isNonEmptyString(value.timezone)
    && ["draft", "ready", "scheduled", "publishing", "published", "failed"].includes(String(value.status))
    && isOptionalString(value.publishingStartedAt)
    && isOptionalString(value.publishedAt)
    && isOptionalString(value.publishFailedAt)
    && isOptionalString(value.publishFailureReason)
    && isNonEmptyString(value.createdBy)
    && isNonEmptyString(value.createdAt)
    && isNonEmptyString(value.updatedAt);
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
