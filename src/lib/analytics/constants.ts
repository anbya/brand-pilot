import type { AnalyticsContentType, AnalyticsDateRangeId, AnalyticsPlatform } from "@/lib/analytics/types";
import { socialPlatformLabels, socialPlatforms } from "@/lib/platforms";

export const ANALYTICS_REFERENCE_TIME = "2026-07-13T12:00:00+07:00";
export const analyticsDateRanges: Array<{ id: AnalyticsDateRangeId; label: string }> = [
  { id: "7-days", label: "7 Days" },
  { id: "30-days", label: "30 Days" },
  { id: "all-time", label: "All Time" },
];
export const analyticsPlatforms: AnalyticsPlatform[] = [...socialPlatforms];
export const analyticsContentTypes: AnalyticsContentType[] = ["image", "video", "carousel", "story", "document"];
export const platformLabels: Record<AnalyticsPlatform, string> = socialPlatformLabels;
export const contentTypeLabels: Record<AnalyticsContentType, string> = { image: "Image", video: "Video", carousel: "Carousel", story: "Story", document: "Document" };
