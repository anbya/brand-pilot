import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { pricingPlans } from "@/lib/billing/plans";
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

export const subscriptionInformationMock: SubscriptionInformation = { ...workspaceSubscriptionMock };
export const accountPlanMocks: AccountPlan[] = pricingPlans.map((plan) => ({ ...plan, entitlements: { ...plan.entitlements } }));

export const timezoneOptions = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC"] as const;
