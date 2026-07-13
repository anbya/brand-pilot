import { dashboardMockData } from "@/lib/dashboard/mock-data";
import type { DashboardDataSource, DashboardStateScenario, DashboardWidgetStates } from "@/lib/dashboard/types";

export const readyDashboardWidgetStates: DashboardWidgetStates = {
  metrics: { status: "ready" },
  attention: { status: "ready" },
  campaigns: { status: "ready" },
  activity: { status: "ready" },
};

export const dashboardStateScenarios = {
  ready: { dashboard: { status: "ready" }, widgets: readyDashboardWidgetStates },
  loading: { dashboard: { status: "loading" }, widgets: readyDashboardWidgetStates },
  globalError: { dashboard: { status: "error", message: "Dashboard data could not be loaded." }, widgets: readyDashboardWidgetStates },
  partialLoading: {
    dashboard: { status: "ready" },
    widgets: {
      metrics: { status: "loading" },
      attention: { status: "ready" },
      campaigns: { status: "loading" },
      activity: { status: "ready" },
    },
  },
  partialError: {
    dashboard: { status: "ready" },
    widgets: {
      metrics: { status: "ready" },
      attention: { status: "error", message: "Attention items are temporarily unavailable." },
      campaigns: { status: "ready" },
      activity: { status: "error", message: "Latest activity is temporarily unavailable." },
    },
  },
} satisfies Record<string, DashboardStateScenario>;

export const dashboardEmptyWorkspaceMockData: DashboardDataSource = {
  ...dashboardMockData,
  brands: [],
  campaigns: [],
  attentionItems: [],
  activities: [],
};
