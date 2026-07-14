import { addDays, addMonths } from "@/lib/calendar/date-utils";
import type {
  CalendarFilters,
  CalendarState,
  CalendarView,
  ContentIdea,
  ContentVersion,
} from "@/lib/calendar/types";

export type CalendarAction =
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
  | { type: "UPDATE_IDEA"; payload: ContentIdea }
  | { type: "DELETE_IDEA"; payload: string }
  | { type: "ADD_VERSION"; payload: ContentVersion }
  | { type: "UPDATE_VERSION"; payload: ContentVersion }
  | { type: "DELETE_VERSION"; payload: string }
  | { type: "DUPLICATE_VERSION"; payload: ContentVersion };

const emptyFilters: CalendarFilters = {
  platform: "all",
  pillarId: "all",
  status: "all",
  createdBy: "all",
};

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
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
    case "UPDATE_IDEA":
      return { ...state, ideas: state.ideas.map((idea) => idea.id === action.payload.id ? action.payload : idea) };
    case "DELETE_IDEA": {
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
    case "DUPLICATE_VERSION":
      return state.versions.some((version) => version.id === action.payload.id) ? state : { ...state, versions: [...state.versions, action.payload] };
    case "UPDATE_VERSION":
      return { ...state, versions: state.versions.map((version) => version.id === action.payload.id ? action.payload : version) };
    case "DELETE_VERSION": {
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
