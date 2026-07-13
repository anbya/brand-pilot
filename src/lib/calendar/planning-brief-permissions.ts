import type { PlanningBriefPermissions, PlanningBriefRole } from "@/lib/calendar/planning-brief-types";

const permissions: Record<PlanningBriefRole, PlanningBriefPermissions> = {
  admin: { canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canRequestChanges: true, canGenerate: true, canApproveGeneratedContent: true },
  manager: { canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canRequestChanges: true, canGenerate: true, canApproveGeneratedContent: true },
  editor: { canCreate: true, canEdit: true, canSubmit: true, canApprove: false, canRequestChanges: false, canGenerate: true, canApproveGeneratedContent: true },
  viewer: { canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canRequestChanges: false, canGenerate: false, canApproveGeneratedContent: false },
};

export function getPlanningBriefPermissions(role: PlanningBriefRole): PlanningBriefPermissions { return { ...permissions[role] }; }
export const activePlanningBriefPermissions = getPlanningBriefPermissions("admin");
