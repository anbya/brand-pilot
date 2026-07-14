import type { DashboardUserRole } from "@/lib/dashboard/types";
import type { AssetLibraryPermissions } from "@/lib/assets/types";

const permissionMap: Record<DashboardUserRole, AssetLibraryPermissions> = {
  admin: { canUpload: true, canEdit: true, canDelete: true, canLink: true },
  manager: { canUpload: true, canEdit: true, canDelete: true, canLink: true },
  editor: { canUpload: true, canEdit: true, canDelete: false, canLink: true },
  viewer: { canUpload: false, canEdit: false, canDelete: false, canLink: false },
};

export function getAssetLibraryPermissions(role: DashboardUserRole) { return { ...permissionMap[role] }; }
