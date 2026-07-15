export type ManualGeneratedIdeasLifecycle =
  | "draft"
  | "generated_ideas"
  | "approved"
  | "generating_content"
  | "content_generated"
  | "generation_failed";

export type ManualGeneratedIdeasTransition =
  | { ok: true; status: ManualGeneratedIdeasLifecycle }
  | { ok: false; status: ManualGeneratedIdeasLifecycle; error: "invalid_transition" };

const allowed: Record<ManualGeneratedIdeasLifecycle, ManualGeneratedIdeasLifecycle[]> = {
  draft: ["generated_ideas"],
  generated_ideas: ["approved"],
  approved: ["generating_content"],
  generating_content: ["content_generated", "generation_failed"],
  content_generated: [],
  generation_failed: ["generating_content"],
};

export function transitionManualGeneratedIdeas(current: ManualGeneratedIdeasLifecycle, next: ManualGeneratedIdeasLifecycle): ManualGeneratedIdeasTransition {
  return allowed[current].includes(next) ? { ok: true, status: next } : { ok: false, status: current, error: "invalid_transition" };
}
