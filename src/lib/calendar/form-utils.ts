export function normalizeHashtags(value: string): string[] {
  const seen = new Set<string>();
  return value.split(",").map((tag) => tag.trim().replace(/^#+/, "").toLowerCase()).filter((tag) => {
    if (!tag || seen.has(tag)) return false;
    seen.add(tag);
    return true;
  });
}

export function validateOptionalUrl(value: string): boolean {
  if (!value.trim()) return true;
  try { new URL(value); return true; } catch { return false; }
}

export function hashtagsToInputValue(hashtags: string[]): string {
  return hashtags.join(", ");
}
