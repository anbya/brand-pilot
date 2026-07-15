import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { ANALYTICS_REFERENCE_TIME } from "@/lib/analytics/constants";
import type { AnalyticsCampaign, AnalyticsContentType, AnalyticsDataSource, AnalyticsPerformanceRecord, AnalyticsPlatform } from "@/lib/analytics/types";

export const analyticsCampaigns: AnalyticsCampaign[] = [
  { id: "campaign-july-promotion", brandId: "brand-coffee-xyz", name: "July Promotion", status: "published" },
  { id: "campaign-education-series", brandId: "brand-coffee-xyz", name: "Education Series", status: "ready" },
  { id: "campaign-summer-wellness", brandId: "brand-skincare-abc", name: "Summer Wellness", status: "blueprint" },
  { id: "campaign-healthy-habits", brandId: "brand-klinik-sehat", name: "Healthy Habits", status: "published" },
  { id: "campaign-weekend-promo", brandId: "brand-coffee-xyz", name: "Weekend Promo", status: "published" },
];

type RecordSeed = [string, string, AnalyticsPlatform, AnalyticsContentType, string, string, number, number, number, number, number, number, number, number, number, number, number, number];
const seeds: RecordSeed[] = [
  ["2026-05-18", "campaign-weekend-promo", "facebook", "image", "Weekend Duo Offer", "brand-coffee-xyz", 24800, 18100, 920, 54, 44, 95, 610, 28, 210, 1240, 1100, 2480],
  ["2026-05-24", "campaign-healthy-habits", "youtube", "video", "Healthy Morning Routine", "brand-klinik-sehat", 46300, 35100, 1810, 93, 71, 210, 1020, 36, 0, 0, 0, 0],
  ["2026-06-02", "campaign-education-series", "facebook", "carousel", "Coffee Origin Guide", "brand-coffee-xyz", 31900, 25400, 1380, 70, 96, 244, 740, 31, 420, 1970, 0, 0],
  ["2026-06-08", "campaign-summer-wellness", "instagram", "carousel", "Summer Skin Checklist", "brand-skincare-abc", 59400, 43700, 3120, 146, 118, 401, 1880, 67, 680, 4320, 2980, 8940],
  ["2026-06-12", "campaign-healthy-habits", "facebook", "image", "Clinic Service Reminder", "brand-klinik-sehat", 18200, 13400, 580, 28, 18, 42, 290, 11, 240, 980, 0, 0],
  ["2026-06-15", "campaign-july-promotion", "instagram", "image", "Cold Brew Preview", "brand-coffee-xyz", 37200, 28500, 1660, 83, 62, 218, 940, 39, 520, 2880, 1860, 4650],
  ["2026-06-18", "campaign-education-series", "youtube", "video", "Bean Selection Playbook", "brand-coffee-xyz", 28400, 22600, 1240, 76, 109, 198, 820, 42, 360, 1740, 1290, 3870],
  ["2026-06-21", "campaign-summer-wellness", "tiktok", "video", "SPF Myth Buster", "brand-skincare-abc", 88600, 67200, 6210, 244, 391, 812, 2650, 84, 770, 5180, 3260, 11410],
  ["2026-06-24", "campaign-healthy-habits", "youtube", "video", "Doctor Q&A Short", "brand-klinik-sehat", 54800, 41900, 2290, 128, 93, 336, 1100, 51, 0, 0, 0, 0],
  ["2026-06-27", "campaign-july-promotion", "facebook", "story", "July Launch Teaser", "brand-coffee-xyz", 74200, 56300, 2150, 78, 42, 121, 3410, 106, 1260, 7420, 4680, 15210],
  ["2026-06-30", "campaign-education-series", "instagram", "carousel", "Brew Better Carousel", "brand-coffee-xyz", 68100, 51200, 3980, 172, 214, 690, 2460, 91, 740, 4910, 3220, 9660],
  ["2026-07-01", "campaign-summer-wellness", "instagram", "image", "Hydration Essentials", "brand-skincare-abc", 51700, 39200, 2740, 121, 94, 388, 1610, 63, 610, 3560, 2250, 6975],
  ["2026-07-02", "campaign-healthy-habits", "facebook", "image", "Healthy Habits Tip", "brand-klinik-sehat", 22300, 16900, 720, 36, 29, 64, 390, 16, 280, 1140, 690, 1725],
  ["2026-07-03", "campaign-july-promotion", "tiktok", "video", "Iced Coffee Transformation", "brand-coffee-xyz", 112400, 84100, 8420, 326, 488, 1102, 3920, 137, 920, 6240, 3890, 15560],
  ["2026-07-04", "campaign-education-series", "tiktok", "video", "Cafe Operations Notes", "brand-coffee-xyz", 33600, 26800, 1490, 88, 117, 231, 960, 49, 430, 2100, 1470, 4410],
  ["2026-07-05", "campaign-summer-wellness", "youtube", "video", "Night Routine Explained", "brand-skincare-abc", 62100, 47800, 3020, 176, 104, 405, 1390, 58, 0, 0, 0, 0],
  ["2026-07-06", "campaign-july-promotion", "facebook", "story", "Launch Countdown", "brand-coffee-xyz", 80900, 61400, 2480, 93, 51, 149, 3850, 129, 1440, 8210, 5010, 17600],
  ["2026-07-07", "campaign-july-promotion", "instagram", "carousel", "Coffee Ritual Carousel", "brand-coffee-xyz", 82400, 63100, 5280, 214, 292, 904, 3208, 118, 980, 6830, 4160, 14560],
  ["2026-07-08", "campaign-summer-wellness", "tiktok", "video", "Summer Product Reel", "brand-skincare-abc", 124500, 93200, 10220, 381, 611, 1304, 4810, 164, 1180, 8060, 5270, 21080],
  ["2026-07-09", "campaign-education-series", "youtube", "video", "Enterprise Coffee Guide", "brand-coffee-xyz", 86200, 66700, 4210, 196, 344, 681, 2840, 102, 720, 5040, 3480, 12180],
  ["2026-07-10", "campaign-healthy-habits", "facebook", "image", "Wellness Appointment", "brand-klinik-sehat", 39100, 29700, 1540, 82, 61, 173, 920, 34, 490, 2670, 1560, 3900],
  ["2026-07-10", "campaign-july-promotion", "facebook", "story", "Coffee Offer Story", "brand-coffee-xyz", 93500, 70800, 2820, 108, 57, 166, 4420, 148, 1670, 9320, 5680, 22150],
  ["2026-07-11", "campaign-july-promotion", "instagram", "image", "Cold Brew Hero", "brand-coffee-xyz", 71400, 54800, 4480, 189, 205, 610, 2780, 96, 840, 5790, 3520, 10560],
  ["2026-07-11", "campaign-summer-wellness", "youtube", "video", "Ingredient Deep Dive", "brand-skincare-abc", 57600, 44100, 2980, 167, 92, 342, 1240, 47, 0, 0, 0, 0],
  ["2026-07-12", "campaign-education-series", "facebook", "carousel", "Team Brewing Handbook", "brand-coffee-xyz", 49200, 38100, 2260, 119, 186, 388, 1640, 69, 510, 3260, 2140, 7490],
  ["2026-07-12", "campaign-summer-wellness", "instagram", "carousel", "Skincare Layering Guide", "brand-skincare-abc", 76900, 58600, 4920, 207, 238, 746, 2510, 88, 760, 4980, 3140, 10990],
  ["2026-07-13", "campaign-july-promotion", "tiktok", "video", "Barista Story", "brand-coffee-xyz", 97200, 74600, 7310, 284, 402, 987, 3510, 121, 860, 5880, 3710, 14840],
  ["2026-07-13", "campaign-healthy-habits", "facebook", "image", "Monday Health Reminder", "brand-klinik-sehat", 27600, 21100, 990, 48, 34, 91, 520, 19, 310, 1390, 0, 0],
];

export const analyticsPerformanceRecords: AnalyticsPerformanceRecord[] = seeds.map((seed, index) => {
  const [date, campaignId, platform, contentType, postTitle, brandId, impressions, reach, likes, comments, shares, saves, clicks, conversions, spend, attributedRevenue] = seed;
  return {
    id: `analytics-record-${String(index + 1).padStart(2, "0")}`,
    brandId, campaignId, postId: `post-${index + 1}`, assetId: `asset-analytics-${index + 1}`, postTitle,
    thumbnailUrl: contentType === "image" || contentType === "carousel" ? "/globe.svg" : undefined,
    platform, contentType, publishedAt: `${date}T09:00:00+07:00`, recordedAt: `${date}T23:00:00+07:00`,
    impressions, reach, likes, comments, shares, saves, clicks, conversions, spend, attributedRevenue,
  };
});

export const analyticsMockData: AnalyticsDataSource = {
  user: dashboardMockData.user,
  referenceTime: ANALYTICS_REFERENCE_TIME,
  brands: dashboardMockData.brands.map(({ id, name }) => ({ id, name })),
  campaigns: analyticsCampaigns,
  records: analyticsPerformanceRecords,
};
