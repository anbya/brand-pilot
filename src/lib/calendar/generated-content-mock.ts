import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import type { GeneratedContentMock } from "@/lib/calendar/content-workflow-types";

export const generatedContentMockVersion = "cca-606-deterministic-v1" as const;

export function generateDeterministicContentMock(
  idea: AiPlanDraftItem,
  index: number,
  generatedAt: string,
): GeneratedContentMock {
  const title = idea.title.trim() || `Generated Content ${index + 1}`;
  const topic = idea.coreTopic.trim() || title;
  const platformTag = idea.platform.toLowerCase().replace(/[^a-z0-9]+/g, "");

  return {
    ...idea,
    id: `content-${idea.id}`,
    selected: false,
    title,
    coreTopic: topic,
    headline: idea.headline.trim() || `${title}: ${topic}`,
    caption: idea.caption.trim() || `Discover how ${topic.toLowerCase()} can support your goals. Save this post and share it with your team.`,
    cta: idea.cta.trim() || "Learn more",
    hashtags: idea.hashtags.length ? idea.hashtags : ["brandcontent", platformTag || "socialmedia"],
    visualBrief: idea.visualBrief.trim() || `Create a polished ${idea.assetType} visual for ${idea.platform} focused on ${topic}, using a clear hierarchy and brand-consistent styling.`,
    publishDate: "",
    publishTime: "",
    conflicts: [],
    generationStatus: "unscheduled",
    generatedAt,
    generatorVersion: generatedContentMockVersion,
  };
}
