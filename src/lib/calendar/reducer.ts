import { addDays, addMonths } from "@/lib/calendar/date-utils";
import { getCalendarPostActions } from "@/lib/calendar/content-mutation-policy";
import { completePrototypePublishing, startPrototypePublishing, type PublishOutcome } from "@/lib/calendar/publishing-lifecycle";
import type {
  CalendarFilters,
  CalendarState,
  CalendarView,
  ContentIdea,
  ContentVersion,
} from "@/lib/calendar/types";

export type CalendarAction =
  | { type: "HYDRATE_STATE"; payload: CalendarState }
  | { type: "SET_VIEW"; payload: CalendarView }
  | { type: "SET_CURRENT_DATE"; payload: string }
  | { type: "GO_TO_PREVIOUS_PERIOD" }
  | { type: "GO_TO_NEXT_PERIOD" }
  | { type: "GO_TO_TODAY"; payload: string }
  | { type: "SELECT_DATE"; payload?: string }
  | { type: "SELECT_VERSION"; payload?: string }
  | { type: "OPEN_POST_DETAIL"; payload: string }
  | { type: "CLOSE_POST_DETAIL" }
  | { type: "SET_FILTER"; payload: { key: keyof CalendarFilters; value: CalendarFilters[keyof CalendarFilters] } }
  | { type: "RESET_FILTERS" }
  | { type: "ADD_IDEA"; payload: ContentIdea }
  | { type: "DELETE_SCHEDULED_IDEA"; payload: string }
  | { type: "ADD_VERSION"; payload: ContentVersion }
  | { type: "RESCHEDULE_VERSION"; payload: Pick<ContentVersion, "id" | "publishDate" | "publishTime" | "timezone" | "updatedAt"> }
  | { type: "START_PUBLISHING"; payload: { versionId: string; startedAt: string } }
  | { type: "COMPLETE_PUBLISHING"; payload: { versionId: string; outcome: PublishOutcome; completedAt: string } }
  | { type: "DELETE_SCHEDULED_VERSION"; payload: string }
  | { type: "DUPLICATE_VERSION"; payload: { sourceVersionId: string; duplicate: ContentVersion } };

const emptyFilters: CalendarFilters = {
  platform: "all",
  pillarId: "all",
  status: "all",
  createdBy: "all",
};

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case "HYDRATE_STATE":
      return action.payload;
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_CURRENT_DATE":
    case "GO_TO_TODAY":
      return { ...state, currentDate: action.payload };
    case "GO_TO_PREVIOUS_PERIOD":
      return { ...state, currentDate: state.view === "month" ? addMonths(state.currentDate, -1) : addDays(state.currentDate, -7) };
    case "GO_TO_NEXT_PERIOD":
      return { ...state, currentDate: state.view === "month" ? addMonths(state.currentDate, 1) : addDays(state.currentDate, 7) };
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "SELECT_VERSION":
      return { ...state, selectedVersionId: action.payload };
    case "OPEN_POST_DETAIL":
      return { ...state, selectedVersionId: action.payload, postDetailDrawerOpen: true };
    case "CLOSE_POST_DETAIL":
      return { ...state, selectedVersionId: undefined, postDetailDrawerOpen: false };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, [action.payload.key]: action.payload.value } };
    case "RESET_FILTERS":
      return { ...state, filters: emptyFilters };
    case "ADD_IDEA":
      return state.ideas.some((idea) => idea.id === action.payload.id) ? state : { ...state, ideas: [...state.ideas, action.payload] };
    case "DELETE_SCHEDULED_IDEA": {
      const ideaVersions = state.versions.filter((version) => version.contentIdeaId === action.payload);
      if (ideaVersions.length !== 1 || !getCalendarPostActions(ideaVersions[0].status).canDelete) return state;
      const deletedVersionIds = new Set(state.versions.filter((version) => version.contentIdeaId === action.payload).map((version) => version.id));
      const selectedWasDeleted = state.selectedVersionId ? deletedVersionIds.has(state.selectedVersionId) : false;
      return {
        ...state,
        ideas: state.ideas.filter((idea) => idea.id !== action.payload),
        versions: state.versions.filter((version) => version.contentIdeaId !== action.payload),
        selectedVersionId: selectedWasDeleted ? undefined : state.selectedVersionId,
        postDetailDrawerOpen: selectedWasDeleted ? false : state.postDetailDrawerOpen,
      };
    }
    case "ADD_VERSION":
      return state.versions.some((version) => version.id === action.payload.id) ? state : { ...state, versions: [...state.versions, action.payload] };
    case "DUPLICATE_VERSION": {
      const source = state.versions.find((version) => version.id === action.payload.sourceVersionId);
      if (!source || !getCalendarPostActions(source.status).canDuplicate || state.versions.some((version) => version.id === action.payload.duplicate.id)) return state;
      return { ...state, versions: [...state.versions, action.payload.duplicate] };
    }
    case "RESCHEDULE_VERSION":
      return {
        ...state,
        versions: state.versions.map((version) => version.id === action.payload.id && version.status === "scheduled"
          ? { ...version, publishDate: action.payload.publishDate, publishTime: action.payload.publishTime, timezone: action.payload.timezone, updatedAt: action.payload.updatedAt }
          : version),
      };
    case "START_PUBLISHING":
      return {
        ...state,
        versions: state.versions.map((version) => version.id === action.payload.versionId ? startPrototypePublishing(version, action.payload.startedAt) : version),
      };
    case "COMPLETE_PUBLISHING":
      return {
        ...state,
        versions: state.versions.map((version) => version.id === action.payload.versionId ? completePrototypePublishing(version, action.payload.outcome, action.payload.completedAt) : version),
      };
    case "DELETE_SCHEDULED_VERSION": {
      const version = state.versions.find((item) => item.id === action.payload);
      if (!version || !getCalendarPostActions(version.status).canDelete) return state;
      const selectedWasDeleted = state.selectedVersionId === action.payload;
      return {
        ...state,
        versions: state.versions.filter((version) => version.id !== action.payload),
        selectedVersionId: selectedWasDeleted ? undefined : state.selectedVersionId,
        postDetailDrawerOpen: selectedWasDeleted ? false : state.postDetailDrawerOpen,
      };
    }
    default:
      return state;
  }
}
