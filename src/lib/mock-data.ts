import type { SocialPlatform } from "@/lib/platforms";

export type AppStatus =
  | "draft"
  | "generating"
  | "review"
  | "approved"
  | "rejected"
  | "need_revision"
  | "failed";

export type Campaign = {
  id: string;
  name: string;
  goal: "awareness" | "sales" | "promotion" | "education" | "event";
  platforms: SocialPlatform[];
  durationDays: 7 | 14 | 30;
  status: AppStatus;
  strategy: string;
  contentPillars: string[];
  postingFrequency: string;
  ctaRecommendation: string;
};

export type CalendarItem = {
  id: string;
  dayNumber: number;
  topic: string;
  hook: string;
  objective: string;
  cta: string;
  assetNeeded: string;
  captionPreview: string;
  platform: SocialPlatform;
  status: AppStatus;
};

export type AssetItem = {
  id: string;
  type: "image" | "video" | "subtitle" | "zip";
  title: string;
  format: string;
  status: AppStatus;
  variant: string;
  prompt: string;
};

export const brandProfile = {
  id: "brand-1",
  companyName: "Coffee XYZ",
  industry: "Cafe & Beverage",
  targetAudience: "Young professionals, coffee hobbyists, and remote workers.",
  businessDescription:
    "Modern neighborhood coffee brand with premium beans and educational content.",
  usp: "Premium but approachable coffee experience with daily ritual storytelling.",
  brandVoice: "Warm, premium, confident",
  language: "id",
  location: "Jakarta",
  website: "https://coffeexyz.example",
  instagram: "@coffeexyz",
  facebook: "Coffee XYZ",
  tiktok: "@coffeexyz",
  youtube: "@coffeexyz",
  primaryColor: "#6D4CFF",
  secondaryColor: "#D6BCFA",
  aiSummary: "Coffee-focused brand with modern visual identity and educational positioning.",
  aiPersonality: "Helpful, curated, and polished",
  aiTone: "Premium, simple, and friendly",
  aiKeywords: ["coffee", "beans", "morning ritual", "premium cafe"],
  aiNegativePrompt: "No cluttered layout, no neon, no aggressive sales style.",
};

export const onboardingSteps = [
  "Login",
  "Create Workspace",
  "Choose Industry",
  "Brand Info",
  "Finish",
];

export const workspaceBrands = [
  { name: "Coffee XYZ", owner: "2 Campaigns", status: "active" },
  { name: "SkinCare ABC", owner: "4 Campaigns", status: "active" },
  { name: "Klinik Sehat", owner: "1 Campaign", status: "active" },
];

export const trendMetrics = [
  { label: "July awareness", value: "30" },
  { label: "Draft content", value: "12" },
  { label: "Pending review", value: "4" },
];

export const brandBrainFields = [
  ["Brand Name", "Coffee XYZ"],
  ["Industry", "Cafe"],
  ["Tone of Voice", "Warm, premium, easy-going"],
  ["Primary Color", "#6D4CFF"],
  ["Target Audience", "Young professional and coffee lovers"],
];

export const knowledgeBase = [
  { name: "Brand Summary", type: "md", updated: "Jul 5, 2026" },
  { name: "Brand Visual Prompt", type: "txt", updated: "Jul 4, 2026" },
  { name: "FAQ Menu", type: "csv", updated: "Jul 2, 2026" },
  { name: "Product Catalogue", type: "pdf", updated: "Jun 29, 2026" },
];

export const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "July Awareness",
    goal: "awareness",
    platforms: ["instagram", "tiktok", "facebook"],
    durationDays: 30,
    status: "approved",
    strategy: "Push brand recall using coffee ritual, store ambiance, and educational reels.",
    contentPillars: ["Education", "Product", "Environment", "Offer"],
    postingFrequency: "5x per week",
    ctaRecommendation: "Drive profile visit and saved post.",
  },
  {
    id: "cmp-2",
    name: "Weekend Promo",
    goal: "sales",
    platforms: ["instagram", "facebook"],
    durationDays: 14,
    status: "review",
    strategy: "Promote bundle menu and drive weekend in-store traffic.",
    contentPillars: ["Offer", "Testimonial", "Menu"],
    postingFrequency: "Daily",
    ctaRecommendation: "Use limited-time urgency.",
  },
];

export const calendarItems: CalendarItem[] = [
  {
    id: "cal-1",
    dayNumber: 1,
    topic: "5 Kesalahan Memilih Kopi",
    hook: "Banyak orang salah pilih beans untuk kebutuhan harian.",
    objective: "Education",
    cta: "Save post ini untuk referensi.",
    assetNeeded: "Carousel + reel teaser",
    captionPreview: "Biar ngopi harian lebih cocok, mulai dari pilihan beans.",
    platform: "instagram",
    status: "approved",
  },
  {
    id: "cal-2",
    dayNumber: 2,
    topic: "Morning coffee setup",
    hook: "Rutinitas pagi dimulai dari satu cangkir yang tepat.",
    objective: "Awareness",
    cta: "Visit profile untuk menu terbaru.",
    assetNeeded: "Lifestyle image",
    captionPreview: "Start your day with the right brew.",
    platform: "instagram",
    status: "review",
  },
  {
    id: "cal-3",
    dayNumber: 3,
    topic: "Promo duo set",
    hook: "Buy 1 get pastry untuk jam sibuk sore ini.",
    objective: "Sales",
    cta: "Datang sebelum jam 5 sore.",
    assetNeeded: "Promo graphic",
    captionPreview: "Cocok untuk meeting sore dan quick break.",
    platform: "facebook",
    status: "draft",
  },
];

export const contentOutput = {
  title: "Day 1 - Carousel",
  headline: "5 Kesalahan Memilih Kopi",
  sections: [
    "Slide 1: Hook dan intro singkat.",
    "Slide 2: Kesalahan memilih roast level.",
    "Slide 3: Kesalahan memilih grind size.",
    "Slide 4: Kesalahan memahami notes.",
    "Slide 5: CTA untuk save dan follow.",
  ],
};

export const canvasSlides = [
  "Cover",
  "Kesalahan 1",
  "Kesalahan 2",
  "Kesalahan 3",
];

export const previewSlides = [
  "5 Kesalahan",
  "Tangkai bitterness",
  "Jangan asal seduh",
];

export const assets: AssetItem[] = [
  {
    id: "asset-1",
    type: "image",
    title: "Carousel cover",
    format: "PNG 1080x1350",
    status: "approved",
    variant: "Instagram carousel",
    prompt: "Coffee beans macro, premium dark brown palette, headline safe area.",
  },
  {
    id: "asset-2",
    type: "image",
    title: "Promo buy 1 get 1",
    format: "PNG 1080x1350",
    status: "review",
    variant: "Feed promo",
    prompt: "Coffee cup with pastry, promotional layout, elegant warm scene.",
  },
  {
    id: "asset-3",
    type: "video",
    title: "Morning reel",
    format: "MP4 1080x1920",
    status: "generating",
    variant: "Short vertical",
    prompt: "Morning brew sequence with subtitle-safe composition.",
  },
];

export const renderQueue = [
  { name: "Episode 1 - Carousel Master", progress: 82, status: "running" },
  { name: "Reel - Coffee beans", progress: 44, status: "queued" },
  { name: "Image - Promo buy 1 get 1", progress: 100, status: "completed" },
];

export const assetLibrary = [
  "Carousel",
  "Promo Buy 1 Get 1",
  "New Matcha",
  "Coffee Story",
];

export const schedulePosts = [
  { channel: "Instagram", date: "Jun 7, 2026", time: "10:00 AM" },
  { channel: "TikTok", date: "Jun 8, 2026", time: "09:30 AM" },
];

export const analyticsStats = [
  { label: "Impressions", value: "125.4K", hint: "+12%" },
  { label: "Engagement", value: "8.7K", hint: "+8%" },
  { label: "Clicks", value: "2.3K", hint: "+5%" },
  { label: "Followers", value: "1.1K", hint: "+9%" },
];

export const teamMembers = [
  { name: "Sarah", role: "Owner", status: "online" },
  { name: "Mika", role: "Strategist", status: "online" },
  { name: "Ari", role: "Designer", status: "away" },
  { name: "Nina", role: "Publisher", status: "online" },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "US$199/mo",
    description:
      "1 brand, 30-day planning, limited renders, and 1 campaign pack.",
    features: [
      "1 brand",
      "30-day planning",
      "Limited renders",
      "1 campaign pack",
    ],
  },
  {
    name: "Growth",
    price: "US$999/mo",
    description:
      "1 brand, 6-month planning, more render credits, and 2-3 campaign packs.",
    features: [
      "1 brand",
      "6-month planning",
      "More render credits",
      "2-3 campaign packs",
    ],
  },
  {
    name: "Custom",
    price: "US$1,999-24,000+/mo",
    description:
      "Multi-brand support, 1-year planning, unlimited renders, and unlimited campaigns.",
    features: [
      "Multi-brand workspace",
      "1-year planning",
      "Unlimited renders",
      "Unlimited campaigns",
    ],
  },
];
