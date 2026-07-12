import type { ContentObjective, SocialPlatform } from "@/lib/calendar/types";

export type AiPlanningPeriod = "one-week" | "two-weeks" | "one-month" | "custom";
export type CalendarWeekday = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
export type AiPlanImportantDate = { id: string; date: string; label: string };
export type AiPlanRequest = {
  planningPeriod: AiPlanningPeriod; startDate: string; endDate: string; numberOfPosts: number;
  platforms: SocialPlatform[]; pillarIds: string[]; objective: ContentObjective; targetAudience: string; priorityProduct?: string;
  allowedDays: CalendarWeekday[]; preferredTimes: string[]; maximumPostsPerDay: number; promotionalPercentage: number;
  importantDates: AiPlanImportantDate[];
};
