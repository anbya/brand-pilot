import type { DashboardUserRole } from "@/lib/dashboard/types";

export type AccountSettingsSection = "profile" | "billing" | "subscription";

export interface AccountProfile {
  id: string;
  fullName: string;
  email: string;
  role: DashboardUserRole;
  workspaceName: string;
  timezone: string;
  initials: string;
  avatarUrl?: string;
}

export interface BillingInformation {
  billingName: string;
  billingEmail: string;
  companyName: string;
  billingAddress: string;
  country: string;
  paymentMethodLabel: string;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
}

export type SubscriptionStatus = "active" | "trial" | "past_due" | "cancel_scheduled";

export interface SubscriptionInformation {
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingPeriod: "monthly" | "yearly";
  creditsUsed: number;
  creditsTotal: number;
  renewalDate: string;
  features: string[];
}

export interface AccountPlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: "monthly" | "yearly";
  features: string[];
}
