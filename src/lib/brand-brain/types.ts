export type BrandInformation = {
  id: string;
  name: string;
};

export type BrandVoice = {
  primaryPersonality: string;
  primaryPersonalityDescription: string;
  communicationStyle: string;
  communicationStyleDescription: string;
  traits: string[];
};

export type ToneDial = {
  casualFormal: number;
  playfulSerious: number;
  conciseDetailed: number;
};

export type BrandLogoType = "primary" | "secondary" | "icon" | "monochrome" | "light" | "dark";
export type BrandLogoPreviewBackground = "light" | "dark" | "transparent";

export type BrandLogo = {
  id: string;
  displayName: string;
  logoType: BrandLogoType;
  previewBackground: BrandLogoPreviewBackground;
  fileName: string;
  fileType: "SVG" | "PNG" | "JPG" | "WEBP";
  previewUrl: string;
  alt: string;
};

export type BrandAssetType = "product-photo" | "lifestyle-photo" | "store-location" | "packaging" | "logo" | "illustration" | "icon" | "background" | "template" | "other";
export type BrandAssetUsage = "social-media" | "advertising" | "website" | "presentation" | "campaign" | "product-marketing" | "general";

export type BrandAsset = {
  id: string;
  name: string;
  imageUrl: string;
  alt: string;
  assetType: BrandAssetType;
  description: string;
  tags: string[];
  usage: BrandAssetUsage[];
  fileName: string;
  fileType: "SVG" | "PNG" | "JPG" | "WEBP";
  isCoreAsset: boolean;
};

export type BrandRecommendation = {
  id: string;
  title: string;
  message: string;
  highlightedVoice: string;
  highlightedTone: string;
  performanceLift: number;
};

export type BrandAnalysisSource = {
  id: string;
  label: string;
  type: "website" | "social" | "asset" | "manual";
  status: "pending" | "analyzed" | "failed";
};

export type BrandAnalysis = {
  status: "idle" | "analyzing" | "completed" | "failed";
  lastAnalyzedAt: string | null;
  sources: BrandAnalysisSource[];
};

export type BrandInsights = {
  voiceMatchScore: number;
  visualConsistencyScore: number;
  audienceFitScore: number;
  assetPerformanceScore: number;
};

export type BrandBrainState = {
  brand: BrandInformation;
  voice: BrandVoice;
  toneDial: ToneDial;
  logo: BrandLogo | null;
  assets: BrandAsset[];
  recommendation: BrandRecommendation;
  analysis: BrandAnalysis;
  insights: BrandInsights;
};
