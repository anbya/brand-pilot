export type AppStatus =
  | "draft"
  | "generating"
  | "review"
  | "approved"
  | "rejected"
  | "need_revision"
  | "failed";

export type BrandProfile = {
  id: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  businessDescription: string;
  usp: string;
  brandVoice: string;
  language: string;
  location: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  primaryColor: string;
  secondaryColor: string;
  aiSummary: string;
  aiPersonality: string;
  aiTone: string;
  aiKeywords: string[];
  aiNegativePrompt: string;
};

export type Campaign = {
  id: string;
  name: string;
  goal: "awareness" | "sales" | "promotion" | "education" | "event";
  platforms: string[];
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
  platform: "instagram" | "tiktok" | "facebook";
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

export type JobItem = {
  id: string;
  type: string;
  progress: number;
  status: "queued" | "running" | "completed" | "failed";
};

export const workflowSteps = [
  "Register",
  "Create Brand",
  "Upload Logo",
  "Describe Business",
  "AI Learn Brand",
  "Generate 30 Days Campaign",
  "Review",
  "Generate Assets",
  "Approve",
  "Download ZIP",
];

export const featureModules = [
  {
    title: "Authentication",
    bullets: ["Login", "Register", "Forgot Password", "JWT", "Refresh Token"],
  },
  {
    title: "Brand Profile",
    bullets: [
      "Company profile",
      "Brand voice",
      "Business photos",
      "AI summary",
      "Negative prompt",
    ],
  },
  {
    title: "Campaign Generator",
    bullets: ["Goal", "Platform", "Duration", "Strategy", "CTA recommendation"],
  },
  {
    title: "Content Calendar",
    bullets: ["Topic", "Hook", "Objective", "Caption preview", "Status"],
  },
  {
    title: "Caption AI",
    bullets: ["Hook", "Body", "CTA", "Hashtags", "Tone selection"],
  },
  {
    title: "Asset Studio",
    bullets: ["PNG/JPG", "HD images", "5-10s vertical video", "Subtitle", "Voice over"],
  },
  {
    title: "Approval Desk",
    bullets: ["Draft", "Review", "Approved", "Rejected", "Bulk approval"],
  },
  {
    title: "Download Center",
    bullets: ["ZIP", "Images", "Videos", "Calendar.csv", "README.txt"],
  },
];

export const brandProfile: BrandProfile = {
  id: "brand-1",
  companyName: "Anbya Coffee",
  industry: "Cafe & Beverage",
  targetAudience: "Mahasiswa, pekerja remote, dan pencinta kopi di Jakarta Selatan.",
  businessDescription:
    "Cafe artisan dengan seasonal menu, suasana hangat, dan area kerja nyaman.",
  usp: "Specialty coffee approachable dengan ambience cozy untuk nongkrong dan kerja.",
  brandVoice: "Ramah, modern, dan membumi.",
  language: "id",
  location: "Jakarta Selatan",
  website: "https://anbya.coffee",
  instagram: "@anbyacoffee",
  facebook: "Anbya Coffee",
  tiktok: "@anbyacoffee",
  primaryColor: "#C96A2B",
  secondaryColor: "#214336",
  aiSummary:
    "Brand lokal dengan karakter hangat, visual earthy, dan fokus pada ritual ngopi harian.",
  aiPersonality: "Warm guide, artisan host, and everyday motivator.",
  aiTone: "Friendly educational with subtle sales push.",
  aiKeywords: ["kopi susu", "cozy cafe", "work-friendly", "seasonal beans", "hangout"],
  aiNegativePrompt: "Visual terlalu mewah, industrial dingin, neon, crowded nightclub mood.",
};

export const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "30 Hari Kopi Pagi",
    goal: "awareness",
    platforms: ["instagram", "tiktok"],
    durationDays: 30,
    status: "review",
    strategy:
      "Bangun top-of-mind lewat ritual pagi, storytelling menu, dan UGC-friendly content.",
    contentPillars: ["Product spotlight", "Lifestyle", "Education", "Promotion"],
    postingFrequency: "1 feed + 4 short videos per week",
    ctaRecommendation: "Ajak audience save post dan mampir sebelum jam 11 pagi.",
  },
  {
    id: "cmp-2",
    name: "Weekend Signature Push",
    goal: "sales",
    platforms: ["instagram", "facebook"],
    durationDays: 14,
    status: "generating",
    strategy: "Fokus pada limited menu dan urgency untuk traffic akhir pekan.",
    contentPillars: ["Offer", "Testimonial", "Product close-up"],
    postingFrequency: "1 post per day",
    ctaRecommendation: "Dorong preorder dan share ke teman nongkrong.",
  },
];

export const calendarItems: CalendarItem[] = [
  {
    id: "cal-1",
    dayNumber: 1,
    topic: "Kenapa kopi pagi terasa lebih nikmat di ruang hangat",
    hook: "Kopi pagi itu bukan cuma soal kafein.",
    objective: "Awareness",
    cta: "Save untuk referensi cafe hopping.",
    assetNeeded: "Lifestyle image + subtitle video",
    captionPreview: "Mulai pagi dengan ruang, aroma, dan mood yang tepat.",
    platform: "instagram",
    status: "approved",
  },
  {
    id: "cal-2",
    dayNumber: 2,
    topic: "Behind the beans",
    hook: "Ada cerita panjang di balik satu cangkir ini.",
    objective: "Education",
    cta: "Tanya barista soal beans minggu ini.",
    assetNeeded: "Short video vertical",
    captionPreview: "Bean of the week kami datang dengan notes citrus dan caramel.",
    platform: "tiktok",
    status: "review",
  },
  {
    id: "cal-3",
    dayNumber: 3,
    topic: "Promo work-from-cafe bundle",
    hook: "Kerja lebih fokus kalau kopi dan camilan sudah aman.",
    objective: "Sales",
    cta: "Datang sebelum jam 3 sore.",
    assetNeeded: "Promo image set",
    captionPreview: "Paket kopi + pastry untuk teman kerja produktif.",
    platform: "instagram",
    status: "generating",
  },
  {
    id: "cal-4",
    dayNumber: 4,
    topic: "Customer mini testimonial",
    hook: "Tempat yang bikin laptop betah terbuka sampai sore.",
    objective: "Trust",
    cta: "Tag teman yang butuh tempat meeting santai.",
    assetNeeded: "Quote graphic",
    captionPreview: "Review jujur dari tamu tetap kami minggu ini.",
    platform: "facebook",
    status: "draft",
  },
];

export const assets: AssetItem[] = [
  {
    id: "asset-1",
    type: "image",
    title: "Morning coffee hero",
    format: "PNG HD",
    status: "approved",
    variant: "1:1 social post",
    prompt: "Cozy artisan coffee shop, earthy morning light, branded cup, warm tones.",
  },
  {
    id: "asset-2",
    type: "video",
    title: "Beans story reel",
    format: "MP4 1080x1920",
    status: "review",
    variant: "9:16 with subtitles",
    prompt: "Close-up beans to brewing sequence, intimate pacing, subtitle safe area.",
  },
  {
    id: "asset-3",
    type: "subtitle",
    title: "Beans story subtitle",
    format: "SRT",
    status: "approved",
    variant: "ID subtitle",
    prompt: "Subtitle track generated from script.",
  },
  {
    id: "asset-4",
    type: "zip",
    title: "Campaign export package",
    format: "ZIP",
    status: "draft",
    variant: "Awaiting packaging",
    prompt: "Aggregate approved assets and captions.",
  },
];

export const aiJobs: JobItem[] = [
  { id: "job-1", type: "campaign_generate", progress: 100, status: "completed" },
  { id: "job-2", type: "calendar_generate", progress: 78, status: "running" },
  { id: "job-3", type: "caption_generate", progress: 64, status: "running" },
  { id: "job-4", type: "video_generate", progress: 15, status: "queued" },
];

export const dashboardStats = [
  { label: "Total Campaign", value: "24", hint: "12 active, 8 approved" },
  { label: "Draft", value: "09", hint: "Menunggu final review" },
  { label: "Approved", value: "15", hint: "Siap diunduh" },
  { label: "Assets Generated", value: "186", hint: "Image, video, subtitle" },
];

export const queueStages = [
  "Generate Campaign",
  "Generate Calendar",
  "Generate Captions",
  "Generate Images",
  "Generate Videos",
  "Package ZIP",
];

export const databaseEntities = [
  "users",
  "refresh_tokens",
  "brands",
  "campaigns",
  "calendar_items",
  "captions",
  "assets",
  "image_assets",
  "video_assets",
  "ai_jobs",
  "prompt_histories",
  "download_packages",
  "settings",
];

export const apiExamples = [
  "POST /api/brands",
  "GET /api/brands",
  "POST /api/campaigns",
  "GET /api/campaigns",
  "POST /api/campaigns/:id/generate",
  "POST /api/calendar/:id/regenerate",
  "POST /api/caption/:id/regenerate",
  "POST /api/image/:id/generate",
  "POST /api/video/:id/generate",
  "POST /api/campaign/:id/approve",
  "POST /api/downloads/:campaignId",
];
