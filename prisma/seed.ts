import "dotenv/config";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const workspace = { id: "workspace-brand-pilot", name: "Brand Pilot Workspace" };

const users = [
  { id: "user-sarah-jenkins", email: "sarah@brandpilot.test", name: "Sarah Jenkins", initials: "SJ", role: "admin" },
  { id: "user-mika-putri", email: "mika@brandpilot.test", name: "Mika Putri", initials: "MP", role: "manager" },
  { id: "user-ari-pratama", email: "ari@brandpilot.test", name: "Ari Pratama", initials: "AP", role: "editor" },
  { id: "user-nina-wijaya", email: "nina@brandpilot.test", name: "Nina Wijaya", initials: "NW", role: "viewer" },
];

const memberships = [
  { id: "membership-sarah", workspaceId: workspace.id, userId: "user-sarah-jenkins", role: "admin" },
  { id: "membership-mika", workspaceId: workspace.id, userId: "user-mika-putri", role: "manager" },
  { id: "membership-ari", workspaceId: workspace.id, userId: "user-ari-pratama", role: "editor" },
  { id: "membership-nina", workspaceId: workspace.id, userId: "user-nina-wijaya", role: "viewer" },
];

const subscription = {
  id: "subscription-growth-july-2026",
  workspaceId: workspace.id,
  planId: "growth",
  status: "active",
  billingInterval: "month",
  currentPeriodStart: "2026-07-01",
  currentPeriodEnd: "2026-08-01",
  assignedCampaignPackLimit: 3,
  renderCreditLimit: 1500,
  startedAt: "2026-07-01T00:00:00+07:00",
};

const brands = [
  {
    id: "brand-coffee-xyz",
    workspaceId: workspace.id,
    companyName: "Coffee XYZ",
    slug: "coffee-xyz",
    industry: "Cafe & Beverage",
    targetAudience: "Young professionals, coffee hobbyists, and remote workers.",
    businessDescription: "Modern neighborhood coffee brand with premium beans and educational content.",
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
    brain: {
      voice: {
        primaryPersonality: "Friendly & Visionary",
        communicationStyle: "Lucid & Reliable",
        traits: ["Approachable", "Eco-Conscious", "Expert", "Optimistic"],
      },
      toneDial: { casualFormal: 27, playfulSerious: 68, conciseDetailed: 52 },
      logoAssetId: "logo-primary",
      coreAssetIds: ["asset-coffee-beans", "asset-ceramic-mug", "asset-coffee-shop"],
    },
  },
  {
    id: "brand-skincare-abc",
    workspaceId: workspace.id,
    companyName: "SkinCare ABC",
    slug: "skincare-abc",
    industry: "Beauty & Personal Care",
    targetAudience: "Urban skincare buyers.",
    businessDescription: "Practical skincare brand focused on everyday routines.",
    usp: "Simple skincare education with approachable product routines.",
    brandVoice: "Clear, caring, and confident",
    language: "id",
    location: "Jakarta",
    website: null,
    instagram: "@skincareabc",
    facebook: null,
    tiktok: "@skincareabc",
    youtube: null,
    primaryColor: "#0058bc",
    secondaryColor: "#d3e4fe",
    aiSummary: "Skincare brand for education and seasonal campaigns.",
    aiPersonality: "Helpful and careful",
    aiTone: "Clean and direct",
    aiKeywords: ["skincare", "routine", "healthy skin"],
    aiNegativePrompt: "Avoid exaggerated medical claims.",
    brain: Prisma.JsonNull,
  },
  {
    id: "brand-klinik-sehat",
    workspaceId: workspace.id,
    companyName: "Klinik Sehat",
    slug: "klinik-sehat",
    industry: "Healthcare",
    targetAudience: "Families and local health patients.",
    businessDescription: "Local health clinic with preventive care content.",
    usp: "Reliable care and simple health education.",
    brandVoice: "Trustworthy, calm, and clear",
    language: "id",
    location: "Jakarta",
    website: null,
    instagram: "@kliniksehat",
    facebook: "Klinik Sehat",
    tiktok: null,
    youtube: null,
    primaryColor: "#007a5a",
    secondaryColor: "#d9f4ea",
    aiSummary: "Healthcare brand for educational and trust-building content.",
    aiPersonality: "Reliable and supportive",
    aiTone: "Plain and careful",
    aiKeywords: ["health", "clinic", "preventive care"],
    aiNegativePrompt: "Avoid fear-based messaging.",
    brain: Prisma.JsonNull,
  },
];

const campaigns = [
  {
    id: "cmp-1",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    name: "July Awareness",
    goal: "awareness",
    platforms: ["instagram", "tiktok", "facebook"],
    durationDays: 30,
    startDate: "2026-07-01",
    endDate: "2026-07-30",
    status: "published",
    campaignPackConsumed: true,
    campaignPackUsageId: "campaign-pack-cmp-1",
    publishedAt: "2026-07-01T09:00:00+07:00",
    publishedBy: "user-sarah-jenkins",
    strategy: "Push brand recall using coffee ritual, store ambiance, and educational reels.",
    contentPillars: ["Education", "Product", "Environment", "Offer"],
    postingFrequency: "5x per week",
    ctaRecommendation: "Drive profile visit and saved post.",
  },
  {
    id: "cmp-2",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    name: "Weekend Promo",
    goal: "sales",
    platforms: ["instagram", "facebook"],
    durationDays: 14,
    startDate: "2026-07-01",
    endDate: "2026-07-14",
    status: "ready",
    campaignPackConsumed: false,
    campaignPackUsageId: null,
    publishedAt: null,
    publishedBy: null,
    strategy: "Promote bundle menu and drive weekend in-store traffic.",
    contentPillars: ["Offer", "Testimonial", "Menu"],
    postingFrequency: "Daily",
    ctaRecommendation: "Use limited-time urgency.",
  },
  {
    id: "campaign-education-series",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    name: "Education Series",
    goal: "education",
    platforms: ["instagram", "youtube", "facebook"],
    durationDays: 30,
    startDate: "2026-07-01",
    endDate: "2026-07-20",
    status: "ready",
    campaignPackConsumed: false,
    campaignPackUsageId: null,
    publishedAt: null,
    publishedBy: null,
    strategy: "Explain coffee selection and brewing habits.",
    contentPillars: ["Education", "Product"],
    postingFrequency: "4x per week",
    ctaRecommendation: "Encourage saves and profile visits.",
  },
  {
    id: "campaign-summer-wellness",
    workspaceId: workspace.id,
    brandId: "brand-skincare-abc",
    name: "Summer Wellness",
    goal: "awareness",
    platforms: ["instagram", "tiktok"],
    durationDays: 30,
    startDate: "2026-07-10",
    endDate: "2026-08-10",
    status: "blueprint",
    campaignPackConsumed: false,
    campaignPackUsageId: null,
    publishedAt: null,
    publishedBy: null,
    strategy: "Seasonal wellness education and product discovery.",
    contentPillars: ["Education", "Routine"],
    postingFrequency: "3x per week",
    ctaRecommendation: "Drive routine quiz engagement.",
  },
  {
    id: "campaign-healthy-habits",
    workspaceId: workspace.id,
    brandId: "brand-klinik-sehat",
    name: "Healthy Habits",
    goal: "education",
    platforms: ["facebook"],
    durationDays: 30,
    startDate: "2026-07-05",
    endDate: "2026-07-28",
    status: "ready",
    campaignPackConsumed: false,
    campaignPackUsageId: null,
    publishedAt: null,
    publishedBy: null,
    strategy: "Preventive care tips for local families.",
    contentPillars: ["Education", "Trust"],
    postingFrequency: "2x per week",
    ctaRecommendation: "Book a consultation.",
  },
];

const calendarItems = [
  {
    id: "cal-1",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    campaignId: "cmp-1",
    dayNumber: 1,
    topic: "5 Kesalahan Memilih Kopi",
    hook: "Banyak orang salah pilih beans untuk kebutuhan harian.",
    objective: "Education",
    cta: "Save post ini untuk referensi.",
    assetNeeded: "Carousel + reel teaser",
    captionPreview: "Biar ngopi harian lebih cocok, mulai dari pilihan beans.",
    platform: "instagram",
    status: "approved",
    scheduledDate: "2026-07-01",
    metadata: {},
  },
  {
    id: "cal-2",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    campaignId: "cmp-1",
    dayNumber: 2,
    topic: "Morning coffee setup",
    hook: "Rutinitas pagi dimulai dari satu cangkir yang tepat.",
    objective: "Awareness",
    cta: "Visit profile untuk menu terbaru.",
    assetNeeded: "Lifestyle image",
    captionPreview: "Start your day with the right brew.",
    platform: "instagram",
    status: "review",
    scheduledDate: "2026-07-02",
    metadata: {},
  },
  {
    id: "cal-3",
    workspaceId: workspace.id,
    brandId: "brand-coffee-xyz",
    campaignId: "cmp-2",
    dayNumber: 3,
    topic: "Promo duo set",
    hook: "Buy 1 get pastry untuk jam sibuk sore ini.",
    objective: "Sales",
    cta: "Datang sebelum jam 5 sore.",
    assetNeeded: "Promo graphic",
    captionPreview: "Cocok untuk meeting sore dan quick break.",
    platform: "facebook",
    status: "draft",
    scheduledDate: "2026-07-03",
    metadata: {},
  },
];

const assets = [
  {
    id: "logo-primary",
    workspaceId: workspace.id,
    name: "Coffee XYZ Primary Logo",
    fileName: "coffee_xyz_primary.svg",
    mimeType: "image/svg+xml",
    kind: "logo",
    source: "logo-render",
    previewUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuvwxHG-3aEQmbB3JVSbYYqCSmYs7mE3kB2z6pD7ZaBXEQWjPcSZ6MJemSSul7V5oSl9OiQTMHsjxqPBu3bdYF2xK6x7vmHAWAARG3T0aW665qff9bd7YUOZLBKML8CltnKMDwcr1uukBdhB5LiF79v340gUTFtuxk_DI1h7YmnqG3PssQD1RH2_mxk68KIl5fCekqUZs0SMAj-9PpO9SK67dlkFEchi3cHPdEY0acXCF08HHpREN-",
    description: "",
    tags: ["logo", "primary"],
    sizeBytes: 184320,
    brandIds: ["brand-coffee-xyz"],
    campaignIds: [],
    usage: [
      { type: "brand-logo", entityId: "brand-coffee-xyz", label: "Coffee XYZ brand logo" },
      { type: "logo-output", entityId: "logo-render-primary", label: "Primary logo render" },
    ],
  },
  {
    id: "asset-coffee-beans",
    workspaceId: workspace.id,
    name: "Organic Coffee Beans",
    fileName: "organic-coffee-beans.jpg",
    mimeType: "image/jpeg",
    kind: "image",
    source: "upload",
    previewUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXaPfHNhCGII6FOB-bAUyFQYQ7afrWP6VeREebGZXI6rvHG7tN4OyWBdtSYVy3ogAC4V5NeL9N0AMYECnmsfUQXRpvZgb2KFP-q35G78cUVDfeGAk1QVgt4d_UgB6WgNw9I9V3TtQmtmCCmesL4vJg8V_QI4ovtFjLCZJlwLJj89xCz6feBRG9GnRcwnWy5bg6cbMB4SS249dZrI1vfQlGTHLmCd25-9ljkID1P73ZyQFU-g_7Ds61",
    description: "Organic coffee beans for product and educational content.",
    tags: ["coffee", "beans", "premium"],
    sizeBytes: 2480000,
    brandIds: ["brand-coffee-xyz"],
    campaignIds: ["campaign-education-series"],
    usage: [
      { type: "brand-core", entityId: "brand-coffee-xyz", label: "Coffee XYZ core visual" },
      { type: "campaign", entityId: "campaign-education-series", label: "Education Series" },
    ],
  },
  {
    id: "asset-ai-summer",
    workspaceId: workspace.id,
    name: "Summer Wellness Hero",
    fileName: "ai-summer-wellness.webp",
    mimeType: "image/webp",
    kind: "generated",
    source: "ai-generation",
    previewUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLaCQ1KCRiF8l--45Fz4VFlVCExRYqKlReiII2QsVWTA_MTdcLi3fwNp3x6a4dkNXEWTsYngKb4NAuUaFlmrMxFz0dyRLEVRP_ym0sPPOiYWXqY4Yah4Se5CxnAxkGKv25O2p3ymtV35CKES8V_FuDV2jhAyrq0H3ySu_AeuB6scV6HZ_dC5khyrjpW37tj9J-UMcIvLwjsxpluWve6ANrKaURW-2NkYhRYhoCtZsQziLWSIz7DQwE",
    description: "AI-generated campaign hero visual.",
    tags: ["ai", "campaign", "hero"],
    sizeBytes: 1320000,
    brandIds: ["brand-skincare-abc"],
    campaignIds: ["campaign-summer-wellness"],
    usage: [
      { type: "ai-output", entityId: "generation-summer-hero", label: "AI image generation" },
      { type: "campaign", entityId: "campaign-summer-wellness", label: "Summer Wellness" },
    ],
  },
];

async function main() {
  const seededPasswordHash = await hashPassword("Password123!");
  const passwordUpdatedAt = new Date();

  await prisma.workspace.upsert({ where: { id: workspace.id }, create: workspace, update: workspace });

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: { ...user, passwordHash: seededPasswordHash, passwordUpdatedAt, emailVerifiedAt: passwordUpdatedAt },
      update: { ...user, passwordHash: seededPasswordHash, passwordUpdatedAt },
    });
  }
  for (const membership of memberships) await prisma.workspaceMembership.upsert({ where: { id: membership.id }, create: membership, update: membership });

  await prisma.workspaceSubscription.upsert({
    where: { id: subscription.id },
    create: subscription,
    update: subscription,
  });

  for (const brand of brands) await prisma.brandProfile.upsert({ where: { id: brand.id }, create: brand, update: brand });
  for (const campaign of campaigns) await prisma.campaign.upsert({ where: { id: campaign.id }, create: campaign, update: campaign });
  for (const item of calendarItems) await prisma.calendarItem.upsert({ where: { id: item.id }, create: item, update: item });
  for (const asset of assets) await prisma.workspaceAsset.upsert({ where: { id: asset.id }, create: asset, update: asset });

  await prisma.campaignPackUsage.upsert({
    where: { subscriptionId_campaignId: { subscriptionId: subscription.id, campaignId: "cmp-1" } },
    create: {
      id: "campaign-pack-cmp-1",
      workspaceId: workspace.id,
      subscriptionId: subscription.id,
      campaignId: "cmp-1",
      billingPeriodStart: subscription.currentPeriodStart,
      billingPeriodEnd: subscription.currentPeriodEnd,
      consumedAt: "2026-07-01T09:00:00+07:00",
      consumedBy: "user-sarah-jenkins",
    },
    update: {
      billingPeriodStart: subscription.currentPeriodStart,
      billingPeriodEnd: subscription.currentPeriodEnd,
      consumedAt: "2026-07-01T09:00:00+07:00",
      consumedBy: "user-sarah-jenkins",
    },
  });

  const renderUsages = [
    {
      id: "render-usage-hero",
      workspaceId: workspace.id,
      subscriptionId: subscription.id,
      contentId: "asset-ai-summer",
      renderJobId: "render-job-hero",
      credits: 600,
      status: "consumed",
      createdAt: "2026-07-08T10:00:00+07:00",
      updatedAt: "2026-07-08T10:03:00+07:00",
    },
    {
      id: "render-usage-reel",
      workspaceId: workspace.id,
      subscriptionId: subscription.id,
      contentId: "post-coffee-reel",
      renderJobId: "render-job-reel",
      credits: 120,
      status: "reserved",
      createdAt: "2026-07-11T09:00:00+07:00",
      updatedAt: "2026-07-11T09:00:00+07:00",
    },
  ];

  for (const usage of renderUsages) {
    await prisma.renderCreditUsage.upsert({
      where: { renderJobId: usage.renderJobId },
      create: usage,
      update: usage,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
