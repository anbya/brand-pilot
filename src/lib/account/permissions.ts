import type { DashboardUserRole } from "@/lib/dashboard/types";

export interface AccountPermissions {
  canViewBilling: boolean;
  canEditBilling: boolean;
  canViewSubscription: boolean;
  canManageSubscription: boolean;
}

const permissionsByRole: Record<DashboardUserRole, AccountPermissions> = {
  admin: { canViewBilling: true, canEditBilling: true, canViewSubscription: true, canManageSubscription: true },
  manager: { canViewBilling: true, canEditBilling: true, canViewSubscription: true, canManageSubscription: false },
  editor: { canViewBilling: true, canEditBilling: false, canViewSubscription: false, canManageSubscription: false },
  viewer: { canViewBilling: true, canEditBilling: false, canViewSubscription: false, canManageSubscription: false },
};

export function getAccountPermissions(role: DashboardUserRole) {
  return permissionsByRole[role];
}
