import { dashboardMockData } from "@/lib/dashboard/mock-data";
import type { AccountPlan, AccountProfile, BillingInformation, SubscriptionInformation } from "@/lib/account/types";

const currentUser = dashboardMockData.user;

export const accountProfileMock: AccountProfile = {
  id: currentUser.id,
  fullName: currentUser.name,
  email: "sarah.jenkins@brandpilot.com",
  role: currentUser.role,
  workspaceName: "Brand Pilot Workspace",
  timezone: "Asia/Jakarta",
  initials: currentUser.initials,
  avatarUrl: currentUser.avatarUrl,
};

export const billingInformationMock: BillingInformation = {
  billingName: "Brand Pilot Workspace",
  billingEmail: "billing@brandpilot.com",
  companyName: "Brand Pilot Inc.",
  billingAddress: "Jakarta, Indonesia",
  country: "Indonesia",
  paymentMethodLabel: "Visa ending in 4242",
  billingCycle: "monthly",
  nextBillingDate: "August 1, 2026",
};

const proFeatures = ["10 brands", "Team access", "All asset types", "SOC media workflow"];

export const subscriptionInformationMock: SubscriptionInformation = {
  planId: "pro",
  planName: "Pro",
  status: "active",
  billingPeriod: "monthly",
  creditsUsed: 720,
  creditsTotal: 1000,
  renewalDate: "August 1, 2026",
  features: proFeatures,
};

export const accountPlanMocks: AccountPlan[] = [
  { id: "free", name: "Free", price: "Rp0", billingPeriod: "monthly", features: ["1 brand", "Basic workspace", "Starter images", "30 credits/month"] },
  { id: "premium", name: "Premium", price: "Rp199K", billingPeriod: "monthly", features: ["3 brands", "Unlimited 30-day plan", "Carousel and reels", "500 credits/month"] },
  { id: "pro", name: "Pro", price: "Rp599K", billingPeriod: "monthly", features: proFeatures },
  { id: "enterprise", name: "Enterprise", price: "Custom", billingPeriod: "monthly", features: ["Unlimited brands", "Approval flow", "Dedicated support", "Custom integration"] },
];

export const timezoneOptions = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC"] as const;
