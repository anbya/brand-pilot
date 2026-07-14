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
  description: string;
  items: string[];
  highlightedVoice: string;
  highlightedTone: string;
  performanceLift: number;
};

export type BrandAnalysisSource = {
  websiteUrl: string;
  instagramUsername: string;
  youtubeChannel: string;
  brandGuidelinesFileName: string;
  companyProfileFileName: string;
  productCatalogueFileName: string;
};

export type BrandAnalysis = {
  status: "idle" | "analyzing" | "complete" | "failed";
  progress: number;
  activeStep: number;
  lastAnalyzedAt: string | null;
  sources: BrandAnalysisSource;
};

export type BrandInsights = {
  overallReadiness: number;
  voiceConsistency: number;
  toneAlignment: number;
  visualReadiness: number;
  assetQuality: number;
};

export type BrandBrainState = {
  brand: BrandInformation;
  voice: BrandVoice;
  toneDial: ToneDial;
  logoAssetId: string | null;
  coreAssetIds: string[];
  recommendation: BrandRecommendation;
  analysis: BrandAnalysis;
  insights: BrandInsights;
};
