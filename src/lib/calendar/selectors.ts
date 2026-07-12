import type {
  CalendarState,
  ContentIdea,
  ContentPillar,
  ContentStatus,
  ContentVersion,
  SocialPlatform,
} from "@/lib/calendar/types";

export type CalendarEventViewModel = {
  id: string;
  contentIdeaId: string;
  title: string;
  coreTopic: string;
  pillarId: string;
  pillarName: string;
  pillarColor: string;
  platform: SocialPlatform;
  assetType: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
  status: ContentStatus;
  createdBy: string;
};

export function getIdeaById(state: CalendarState, id: string): ContentIdea | undefined {
  return state.ideas.find((idea) => idea.id === id);
}

export function getVersionById(state: CalendarState, id: string): ContentVersion | undefined {
  return state.versions.find((version) => version.id === id);
}

export function getPillarById(state: CalendarState, id: string): ContentPillar | undefined {
  return state.pillars.find((pillar) => pillar.id === id);
}

export function getVersionsForDate(state: CalendarState, date: string): ContentVersion[] {
  return state.versions.filter((version) => version.publishDate === date);
}

export function getFilteredVersions(state: CalendarState): ContentVersion[] {
  return state.versions.filter((version) => {
    const idea = getIdeaById(state, version.contentIdeaId);
    return (
      (state.filters.platform === "all" || version.platform === state.filters.platform) &&
      (state.filters.pillarId === "all" || idea?.pillarId === state.filters.pillarId) &&
      (state.filters.status === "all" || version.status === state.filters.status) &&
      (state.filters.createdBy === "all" || version.createdBy === state.filters.createdBy)
    );
  });
}

export function getCalendarEvents(state: CalendarState): CalendarEventViewModel[] {
  return getFilteredVersions(state).flatMap((version) => {
    const idea = getIdeaById(state, version.contentIdeaId);
    const pillar = idea ? getPillarById(state, idea.pillarId) : undefined;
    if (!idea || !pillar) return [];
    return [{
      id: version.id,
      contentIdeaId: idea.id,
      title: idea.title,
      coreTopic: idea.coreTopic,
      pillarId: pillar.id,
      pillarName: pillar.name,
      pillarColor: pillar.color,
      platform: version.platform,
      assetType: version.assetType,
      publishDate: version.publishDate,
      publishTime: version.publishTime,
      timezone: version.timezone,
      status: version.status,
      createdBy: version.createdBy,
    }];
  });
}
