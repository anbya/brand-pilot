import type { SocialPlatform } from "@/lib/calendar/types";

export const platformOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
];

export const platformAssetTypes: Record<SocialPlatform, string[]> = {
  instagram: ["image", "carousel", "reel", "story"],
  tiktok: ["short-video", "photo-post"],
  linkedin: ["text-post", "image-post", "carousel", "article", "video"],
  facebook: ["text-post", "image-post", "video", "story"],
  youtube: ["short-video", "long-video", "community-post"],
};

export function formatPlatformLabel(platform: SocialPlatform): string {
  return platformOptions.find((option) => option.value === platform)?.label ?? platform;
}

export function formatAssetTypeLabel(assetType: string): string {
  return assetType.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
