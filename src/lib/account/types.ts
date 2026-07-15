import type { DashboardUserRole } from "@/lib/dashboard/types";
import type { PricingPlan, WorkspaceSubscription } from "@/lib/billing/types";

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

export type SubscriptionInformation = WorkspaceSubscription;
export type AccountPlan = PricingPlan;
