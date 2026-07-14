import type { SocialPlatform } from "@/lib/calendar/types";
import { socialPlatformLabels, socialPlatforms } from "@/lib/platforms";

export const platformOptions: Array<{ value: SocialPlatform; label: string }> = socialPlatforms.map((value) => ({ value, label: socialPlatformLabels[value] }));

export const platformAssetTypes: Record<SocialPlatform, string[]> = {
  instagram: ["image", "carousel", "reel", "story"],
  tiktok: ["short-video", "photo-post"],
  youtube: ["short-video", "long-video", "community-post"],
  facebook: ["text-post", "image-post", "video", "story"],
};

export function formatPlatformLabel(platform: SocialPlatform): string {
  return socialPlatformLabels[platform];
}

export function formatAssetTypeLabel(assetType: string): string {
  return assetType.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
