import type { ContentWorkflowStage } from "@/lib/calendar/content-workflow-types";
import type { ContentStatus } from "@/lib/calendar/types";

export type ContentEntity =
  | { entityType: "content_work_item"; stage: ContentWorkflowStage }
  | { entityType: "calendar_post"; status: ContentStatus };

export type CalendarPostPermissions = {
  canDelete: boolean;
  canDuplicate: boolean;
  canReschedule: boolean;
};

export const activeCalendarPostPermissions: CalendarPostPermissions = {
  canDelete: true,
  canDuplicate: true,
  canReschedule: true,
};

export function canEditContent(entity: ContentEntity): boolean {
  return entity.entityType === "content_work_item" && entity.stage === "idea_draft";
}

export function getCalendarPostActions(status: ContentStatus, permissions: CalendarPostPermissions = activeCalendarPostPermissions) {
  return {
    canEditContent: false,
    canDelete: status === "scheduled" && permissions.canDelete,
    canDuplicate: (status === "scheduled" || status === "published") && permissions.canDuplicate,
    canReschedule: status === "scheduled" && permissions.canReschedule,
  } as const;
}
