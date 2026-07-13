import type { ManualPostPermissions, ManualPostRole } from "@/lib/calendar/manual-post-types";

const permissions: Record<ManualPostRole, ManualPostPermissions> = {
  admin: { canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canRequestChanges: true, canView: true },
  manager: { canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canRequestChanges: true, canView: true },
  editor: { canCreate: true, canEdit: true, canSubmit: true, canApprove: false, canRequestChanges: false, canView: true },
  viewer: { canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canRequestChanges: false, canView: true },
};

export function getManualPostPermissions(role: ManualPostRole): ManualPostPermissions { return { ...permissions[role] }; }
export const activeManualPostPermissions = getManualPostPermissions("admin");
