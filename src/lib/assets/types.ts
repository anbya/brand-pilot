export type AssetKind = "image" | "video" | "logo" | "document" | "generated";
export type AssetSource = "upload" | "ai-generation" | "logo-render" | "imported";

export type AssetUsageReference = {
  type: "brand" | "brand-core" | "brand-logo" | "campaign" | "calendar" | "ai-output" | "logo-output";
  entityId: string;
  label: string;
};

export type WorkspaceAsset = {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  kind: AssetKind;
  source: AssetSource;
  previewUrl: string;
  description: string;
  tags: string[];
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  brandIds: string[];
  campaignIds: string[];
  usage: AssetUsageReference[];
};

export type AssetLibraryPermissions = {
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canLink: boolean;
};
