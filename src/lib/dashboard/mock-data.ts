import type { DashboardDataSource, DashboardUser, DashboardUserRole } from "@/lib/dashboard/types";

export const dashboardRoleUsers: Record<DashboardUserRole, DashboardUser> = {
  admin: { id: "user-sarah-jenkins", name: "Sarah Jenkins", role: "admin", initials: "SJ" },
  manager: { id: "user-mika-putri", name: "Mika Putri", role: "manager", initials: "MP" },
  editor: { id: "user-ari-pratama", name: "Ari Pratama", role: "editor", initials: "AP" },
  viewer: { id: "user-nina-wijaya", name: "Nina Wijaya", role: "viewer", initials: "NW" },
};

export const dashboardMockData: DashboardDataSource = {
  user: dashboardRoleUsers.admin,
  brands: [
    { id: "brand-coffee-xyz", name: "Coffee XYZ", slug: "coffee-xyz" },
    { id: "brand-skincare-abc", name: "SkinCare ABC", slug: "skincare-abc" },
    { id: "brand-klinik-sehat", name: "Klinik Sehat", slug: "klinik-sehat" },
  ],
  dateRanges: [
    { id: "range-jul-01-07", label: "Jul 1–7", startDate: "2026-07-01", endDate: "2026-07-07" },
    { id: "range-jul-08-14", label: "Jul 8–14", startDate: "2026-07-08", endDate: "2026-07-14" },
    { id: "range-july", label: "July 2026", startDate: "2026-07-01", endDate: "2026-07-31" },
  ],
  metrics: [
    { id: "metric-total-campaigns", label: "Active Campaigns", value: 0, icon: "campaign", tone: "blue", supportingText: "Follows selected filters", comparison: { state: "no-baseline", label: "No previous period data" }, href: "/campaigns" },
    { id: "metric-total-posts", label: "Total Posts", value: 0, icon: "dashboard", tone: "blue", supportingText: "Across matching campaigns", comparison: { state: "no-baseline", label: "No previous period data" }, href: "/calendar" },
    { id: "metric-ready-publish", label: "Ready to Publish", value: 0, icon: "spark", tone: "indigo", supportingText: "Ready across matching campaigns", comparison: { state: "no-baseline", label: "No previous period data" }, href: "/calendar" },
    { id: "metric-credits-left", label: "Credits Left", value: 158, icon: "bolt", tone: "red", supportingText: "Current workspace balance", comparison: { state: "no-baseline", label: "Current workspace balance" } },
  ],
  creditUsage: { id: "credit-usage-july-2026", remainingCredits: 158, totalCredits: 450 },
  referenceTime: "2026-07-11T10:30:00+07:00",
  campaigns: [
    { id: "campaign-july-promotion", brandId: "brand-coffee-xyz", brandName: "Coffee XYZ", name: "July Promotion", startDate: "2026-07-01", endDate: "2026-07-31", status: "published", completedPosts: 16, readyPosts: 3, totalPosts: 20, platforms: ["instagram", "tiktok", "youtube", "facebook"], icon: "spark", color: "bg-blue-600", textColor: "text-blue-700" },
    { id: "campaign-education-series", brandId: "brand-coffee-xyz", brandName: "Coffee XYZ", name: "Education Series", startDate: "2026-07-01", endDate: "2026-07-20", status: "ready", completedPosts: 12, readyPosts: 4, totalPosts: 20, platforms: ["instagram", "youtube", "facebook"], icon: "idea", color: "bg-indigo-600", textColor: "text-indigo-700" },
    { id: "campaign-summer-wellness", brandId: "brand-skincare-abc", brandName: "SkinCare ABC", name: "Summer Wellness", startDate: "2026-07-10", endDate: "2026-08-10", status: "blueprint", completedPosts: 3, readyPosts: 2, totalPosts: 20, platforms: ["instagram", "tiktok"], icon: "check", color: "bg-emerald-600", textColor: "text-emerald-700" },
    { id: "campaign-healthy-habits", brandId: "brand-klinik-sehat", brandName: "Klinik Sehat", name: "Healthy Habits", startDate: "2026-07-05", endDate: "2026-07-28", status: "ready", completedPosts: 5, readyPosts: 1, totalPosts: 10, platforms: ["facebook"], icon: "idea", color: "bg-amber-600", textColor: "text-amber-700" },
  ],
  attentionItems: [
    { id: "attention-failed-instagram", brandId: "brand-coffee-xyz", campaignId: "campaign-july-promotion", scope: "brand", type: "failed_publish", title: "Publishing failed", description: "A scheduled Instagram reel failed during publishing and needs review.", count: 1, countLabel: "post", occurredAt: "2026-07-11T10:15:00+07:00", href: "/calendar" },
    { id: "attention-overdue-review", brandId: "brand-skincare-abc", campaignId: "campaign-summer-wellness", scope: "brand", type: "overdue", title: "Posts are overdue", description: "Campaign posts passed their schedule without being completed or published.", count: 2, countLabel: "post", occurredAt: "2026-07-11T09:00:00+07:00", href: "/calendar" },
    { id: "attention-awaiting-approval", brandId: "brand-coffee-xyz", campaignId: "campaign-education-series", scope: "brand", type: "approval", title: "Posts waiting for approval", description: "Content is ready for reviewer or approver feedback.", count: 3, countLabel: "post", occurredAt: "2026-07-10T14:00:00+07:00", href: "/calendar" },
    { id: "attention-missing-assets", brandId: "brand-skincare-abc", campaignId: "campaign-summer-wellness", scope: "brand", type: "missing_asset", title: "Required assets are missing", description: "Scheduled posts still need their required visual or media assets.", count: 2, countLabel: "post", occurredAt: "2026-07-10T11:30:00+07:00", href: "/assets" },
    { id: "attention-low-credit", scope: "workspace", type: "low_credit", title: "Credits are running low", description: "The current workspace credit balance is below the configured threshold.", count: 158, countLabel: "credit", occurredAt: "2026-07-10T16:30:00+07:00" },
  ],
  activities: [
    { id: "activity-post-approved", scope: "brand", brandId: "brand-coffee-xyz", brandName: "Coffee XYZ", campaignId: "campaign-july-promotion", type: "post_approved", actorName: "Sarah Jenkins", actorInitials: "SJ", action: "approved", entityName: "Instagram Reel", supportingContext: "July Promotion", occurredAt: "2026-07-11T10:28:00+07:00", href: "/calendar" },
    { id: "activity-ai-ideas", scope: "brand", brandId: "brand-skincare-abc", brandName: "SkinCare ABC", campaignId: "campaign-summer-wellness", type: "ai_ideas_generated", actorName: "Mika Putri", actorInitials: "MP", action: "generated ideas for", entityName: "Summer Wellness", supportingContext: "SkinCare ABC", occurredAt: "2026-07-11T10:15:00+07:00" },
    { id: "activity-post-scheduled", scope: "brand", brandId: "brand-coffee-xyz", brandName: "Coffee XYZ", campaignId: "campaign-education-series", type: "post_scheduled", actorName: "Ari Pratama", actorInitials: "AP", action: "scheduled", entityName: "Facebook Education Post", supportingContext: "Education Series", occurredAt: "2026-07-11T09:45:00+07:00", href: "/calendar" },
    { id: "activity-asset-uploaded", scope: "brand", brandId: "brand-coffee-xyz", brandName: "Coffee XYZ", type: "asset_uploaded", actorName: "Nina Wijaya", actorInitials: "NW", action: "uploaded", entityName: "4 brand assets", supportingContext: "Coffee XYZ", occurredAt: "2026-07-11T09:10:00+07:00", href: "/assets" },
    { id: "activity-brand-brain", scope: "brand", brandId: "brand-klinik-sehat", brandName: "Klinik Sehat", type: "brand_brain_updated", actorName: "Sarah Jenkins", actorInitials: "SJ", action: "updated", entityName: "Brand Brain", supportingContext: "Klinik Sehat", occurredAt: "2026-07-10T17:20:00+07:00", href: "/brain" },
  ],
};

export function getDashboardMockDataForRole(role: DashboardUserRole): DashboardDataSource { return { ...dashboardMockData, user: dashboardRoleUsers[role] }; }
