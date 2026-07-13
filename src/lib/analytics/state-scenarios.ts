import type { AnalyticsScenario } from "@/lib/analytics/types";

export const readyAnalyticsWidgetStates: AnalyticsScenario["widgets"] = { metrics: { status: "ready" }, chart: { status: "ready" }, channels: { status: "ready" }, content: { status: "ready" } };
export const analyticsStateScenarios = {
  ready: { analytics: { status: "ready" }, widgets: readyAnalyticsWidgetStates },
  loading: { analytics: { status: "loading" }, widgets: readyAnalyticsWidgetStates },
  globalError: { analytics: { status: "error", message: "Analytics data could not be loaded." }, widgets: readyAnalyticsWidgetStates },
  metricsError: { analytics: { status: "ready" }, widgets: { ...readyAnalyticsWidgetStates, metrics: { status: "error", message: "We couldn’t load the analytics summary." } } },
  chartError: { analytics: { status: "ready" }, widgets: { ...readyAnalyticsWidgetStates, chart: { status: "error", message: "We couldn’t load reach and engagement data." } } },
  channelsError: { analytics: { status: "ready" }, widgets: { ...readyAnalyticsWidgetStates, channels: { status: "error", message: "We couldn’t load channel performance data." } } },
  contentError: { analytics: { status: "ready" }, widgets: { ...readyAnalyticsWidgetStates, content: { status: "error", message: "We couldn’t load content performance data." } } },
} satisfies Record<string, AnalyticsScenario>;
