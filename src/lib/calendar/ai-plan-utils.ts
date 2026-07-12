import { addDays, addMonths, parseLocalDate } from "@/lib/calendar/date-utils";
import type { AiPlanningPeriod, AiPlanRequest, CalendarWeekday } from "@/lib/calendar/ai-plan-types";

export type AiPlanValidationErrors = Partial<Record<keyof AiPlanRequest, string>>;
const weekdays: CalendarWeekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function getPlanningPeriodEndDate(startDate: string, period: Exclude<AiPlanningPeriod, "custom">): string {
  if (period === "one-week") return addDays(startDate, 6);
  if (period === "two-weeks") return addDays(startDate, 13);
  return addDays(addMonths(startDate, 1), -1);
}

export function getDatesInRange(startDate: string, endDate: string): string[] {
  const start = parseLocalDate(startDate); const end = parseLocalDate(endDate);
  if (end < start) return [];
  const dates: string[] = [];
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) dates.push(date);
  return dates;
}

export function countAllowedPublishingDates(startDate: string, endDate: string, allowedDays: CalendarWeekday[]): number {
  const allowed = new Set(allowedDays);
  return getDatesInRange(startDate, endDate).filter((date) => allowed.has(weekdays[parseLocalDate(date).getDay()])).length;
}

export function countAvailablePublishingSlots(startDate: string, endDate: string, allowedDays: CalendarWeekday[], maximumPostsPerDay: number): number {
  return countAllowedPublishingDates(startDate, endDate, allowedDays) * Math.max(0, maximumPostsPerDay);
}

export function normalizePreferredTimes(times: string[]): string[] {
  return [...new Set(times.map((time) => time.trim()).filter(Boolean))].sort();
}

export function validateAiPlanRequest(request: AiPlanRequest): AiPlanValidationErrors {
  const errors: AiPlanValidationErrors = {};
  if (!request.startDate) errors.startDate = "Start date is required.";
  if (!request.endDate) errors.endDate = "End date is required.";
  let rangeValid = false;
  try { if (request.startDate && request.endDate) { rangeValid = parseLocalDate(request.endDate) >= parseLocalDate(request.startDate); if (!rangeValid) errors.endDate = "End date cannot be before start date."; } } catch { errors.endDate = "Enter a valid date range."; }
  if (!Number.isFinite(request.numberOfPosts) || request.numberOfPosts < 1) errors.numberOfPosts = "Request at least one post.";
  if (!request.platforms.length) errors.platforms = "Select at least one platform.";
  if (!request.pillarIds.length) errors.pillarIds = "Select at least one content pillar.";
  if (!request.objective) errors.objective = "Objective is required.";
  if (!request.targetAudience.trim()) errors.targetAudience = "Target audience is required.";
  if (!request.allowedDays.length) errors.allowedDays = "Select at least one publishing day.";
  if (!normalizePreferredTimes(request.preferredTimes).length) errors.preferredTimes = "Add at least one preferred time.";
  if (!Number.isFinite(request.maximumPostsPerDay) || request.maximumPostsPerDay < 1 || request.maximumPostsPerDay > 5) errors.maximumPostsPerDay = "Maximum posts per day must be between 1 and 5.";
  if (!Number.isFinite(request.promotionalPercentage) || request.promotionalPercentage < 0 || request.promotionalPercentage > 100) errors.promotionalPercentage = "Promotional percentage must be between 0 and 100.";
  if (rangeValid && !errors.allowedDays && request.numberOfPosts > countAvailablePublishingSlots(request.startDate, request.endDate, request.allowedDays, request.maximumPostsPerDay)) errors.numberOfPosts = "Requested posts exceed the available publishing slots.";
  if (request.importantDates.some((item) => !item.date.trim() || !item.label.trim())) errors.importantDates = "Each important date needs both a date and label.";
  else if (rangeValid && request.importantDates.some((item) => item.date < request.startDate || item.date > request.endDate)) errors.importantDates = "Important dates must fall inside the planning range.";
  return errors;
}
