import type { BrandBrainState } from "@/lib/brand-brain/types";

export const initialBrandBrainData: BrandBrainState = {
  brand: {
    id: "brand-coffee-xyz",
    name: "Coffee XYZ",
  },
  voice: {
    primaryPersonality: "Friendly & Visionary",
    primaryPersonalityDescription:
      "We speak to our customers like a knowledgeable friend who sees the future of coffee. We are encouraging, optimistic, and deeply passionate about quality.",
    communicationStyle: "Lucid & Reliable",
    communicationStyleDescription:
      "Clarity is our priority. No jargon, just honest descriptions of our sustainable sourcing and roasting techniques that users can trust.",
    traits: ["Approachable", "Eco-Conscious", "Expert", "Optimistic"],
  },
  toneDial: {
    casualFormal: 27,
    playfulSerious: 68,
    conciseDetailed: 52,
  },
  logoAssetId: "logo-primary",
  coreAssetIds: ["asset-coffee-beans", "asset-ceramic-mug", "asset-coffee-shop"],
  recommendation: {
    id: "recommendation-primary",
    title: "AI Recommendation",
    description:
      "Based on your latest campaign performance, users respond best to a Friendly voice with a Concise tone. Your current assets are performing 24% higher than industry average.",
    items: [
      "Continue using an approachable and knowledgeable voice.",
      "Keep captions concise while maintaining reliable product information.",
      "Prioritize authentic coffee, product, and lifestyle visuals.",
    ],
    highlightedVoice: "Friendly",
    highlightedTone: "Concise",
    performanceLift: 24,
  },
  analysis: {
    status: "idle",
    progress: 0,
    activeStep: 0,
    lastAnalyzedAt: null,
    sources: {
      websiteUrl: "",
      instagramUsername: "",
      linkedinPage: "",
      brandGuidelinesFileName: "",
      companyProfileFileName: "",
      productCatalogueFileName: "",
    },
  },
  insights: {
    overallReadiness: 89,
    voiceConsistency: 92,
    toneAlignment: 86,
    visualReadiness: 88,
    assetQuality: 84,
  },
};
