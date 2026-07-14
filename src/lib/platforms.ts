export const socialPlatforms = ["instagram", "tiktok", "youtube", "facebook"] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export const socialPlatformLabels = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
} as const satisfies Record<SocialPlatform, string>;

export type SocialPlatformLabel = (typeof socialPlatformLabels)[SocialPlatform];

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && socialPlatforms.some((platform) => platform === value);
}

export function normalizeSocialPlatforms(value: unknown, fallback: SocialPlatform[] = []): SocialPlatform[] {
  if (!Array.isArray(value)) return fallback;
  const platforms = value.filter(isSocialPlatform);
  return platforms.length ? [...new Set(platforms)] : fallback;
}
