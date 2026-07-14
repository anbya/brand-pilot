"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { accountPlanMocks, timezoneOptions } from "@/lib/account/mock-data";
import type { AccountPermissions } from "@/lib/account/permissions";
import type { AccountPlan, AccountProfile, AccountSettingsSection, BillingInformation, SubscriptionInformation } from "@/lib/account/types";

type Props = {
  section: AccountSettingsSection;
  profile: AccountProfile;
  billing: BillingInformation;
  subscription: SubscriptionInformation;
  permissions: AccountPermissions;
  onSectionChange: (section: AccountSettingsSection) => void;
  onUpdateProfile: (profile: AccountProfile) => void;
  onUpdateBilling: (billing: BillingInformation) => void;
  onChangePlan: (plan: AccountPlan) => void;
  onCancelSubscription: () => void;
  onClose: () => void;
};

const sectionLabels: Record<AccountSettingsSection, string> = { profile: "Basic Profile", billing: "Billing Information", subscription: "Current Plan & Subscription" };

export function AccountSettingsDrawer(props: Props) {
  const sections: AccountSettingsSection[] = ["profile", ...(props.permissions.canViewBilling ? ["billing" as const] : []), ...(props.permissions.canViewSubscription ? ["subscription" as const] : [])];

  return <ResponsiveOverlayShell variant="drawer" title={sectionLabels[props.section]} eyebrow="Account Settings" description="Manage your profile and workspace account information." maxWidth="max-w-[640px]" bodyScrollable={false} bodyClassName="flex flex-col p-0" closeLabel="Close account settings" onClose={props.onClose}>
      <nav aria-label="Account settings sections" className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#d3e4fe] bg-[#f8faff] px-4 py-3 sm:px-7">
        {sections.map((item) => <button key={item} type="button" aria-current={props.section === item ? "page" : undefined} onClick={() => props.onSectionChange(item)} className={`min-h-10 shrink-0 rounded-lg px-3 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] ${props.section === item ? "bg-[#0058bc] text-white" : "text-[#526174] hover:bg-[#e5eeff]"}`}>{sectionLabels[item]}</button>)}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7">
        {props.section === "profile" ? <ProfileSection profile={props.profile} onSave={props.onUpdateProfile} onCancel={props.onClose} /> : props.section === "billing" ? <BillingSection billing={props.billing} canEdit={props.permissions.canEditBilling} onSave={props.onUpdateBilling} /> : <SubscriptionSection subscription={props.subscription} canManage={props.permissions.canManageSubscription} onChangePlan={props.onChangePlan} onCancel={props.onCancelSubscription} />}
      </div>
  </ResponsiveOverlayShell>;
}

function ProfileSection({ profile, onSave, onCancel }: { profile: AccountProfile; onSave: (profile: AccountProfile) => void; onCancel: () => void }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [errors, setErrors] = useState<{ fullName?: string; timezone?: string }>({});
  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required.";
    else if (fullName.trim().length < 2) nextErrors.fullName = "Full name must be at least 2 characters.";
    if (!timezone) nextErrors.timezone = "Timezone is required.";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave({ ...profile, fullName: fullName.trim(), timezone });
  }
  return <form onSubmit={submit} noValidate>
    <div className="mb-6 flex items-center gap-4 rounded-xl bg-[#eff4ff] p-4"><Avatar profile={profile} size="large" /><div className="min-w-0"><p className="truncate font-extrabold">{profile.fullName}</p><p className="truncate text-sm text-[#657080]">{profile.email}</p></div></div>
    <div className="grid gap-5">
      <Field label="Full name" id="profile-full-name" error={errors.fullName}><input id="profile-full-name" value={fullName} onChange={(event) => { setFullName(event.target.value); setErrors((current) => ({ ...current, fullName: undefined })); }} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "profile-full-name-error" : undefined} className={inputClass} /></Field>
      <Field label="Email address" id="profile-email"><input id="profile-email" value={profile.email} readOnly className={`${inputClass} bg-[#f4f6f9] text-[#657080]`} /></Field>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Role" id="profile-role"><input id="profile-role" value={formatRole(profile.role)} readOnly className={`${inputClass} bg-[#f4f6f9] text-[#657080]`} /></Field><Field label="Workspace name" id="profile-workspace"><input id="profile-workspace" value={profile.workspaceName} readOnly className={`${inputClass} bg-[#f4f6f9] text-[#657080]`} /></Field></div>
      <Field label="Timezone" id="profile-timezone" error={errors.timezone}><select id="profile-timezone" value={timezone} onChange={(event) => { setTimezone(event.target.value); setErrors((current) => ({ ...current, timezone: undefined })); }} aria-invalid={Boolean(errors.timezone)} aria-describedby={errors.timezone ? "profile-timezone-error" : undefined} className={inputClass}><option value="">Select timezone</option>{timezoneOptions.map((option) => <option key={option} value={option}>{timezoneLabel(option)}</option>)}</select></Field>
    </div>
    <div className="sticky bottom-0 -mx-5 mt-7 flex justify-end gap-3 border-t border-[#d3e4fe] bg-white px-5 py-4 sm:-mx-7 sm:px-7"><button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>Save Changes</button></div>
  </form>;
}

function BillingSection({ billing, canEdit, onSave }: { billing: BillingInformation; canEdit: boolean; onSave: (billing: BillingInformation) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(billing);
  const [paymentDialog, setPaymentDialog] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); onSave(draft); setEditing(false); }
  if (editing) return <form onSubmit={submit}><div className="grid gap-5">{([['Billing name','billingName'],['Billing email','billingEmail'],['Company name','companyName'],['Billing address','billingAddress'],['Country','country']] as const).map(([label, key]) => <Field key={key} label={label} id={`billing-${key}`}><input id={`billing-${key}`} type={key === "billingEmail" ? "email" : "text"} required value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className={inputClass} /></Field>)}</div><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => { setDraft(billing); setEditing(false); }} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>Save Billing Details</button></div></form>;
  return <><Details rows={[["Billing name", billing.billingName], ["Billing email", billing.billingEmail], ["Company", billing.companyName], ["Billing address", billing.billingAddress], ["Country", billing.country], ["Payment method", billing.paymentMethodLabel], ["Billing cycle", formatRole(billing.billingCycle)], ["Next billing date", billing.nextBillingDate]]} />{canEdit ? <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setEditing(true)} className={primaryButton}>Edit Billing Details</button><button type="button" onClick={() => setPaymentDialog(true)} className={secondaryButton}>Update Payment Method</button></div> : <p className="mt-5 rounded-lg border border-[#d3e4fe] bg-[#f8faff] p-4 text-sm text-[#657080]">Billing information is read-only for your role.</p>}{paymentDialog ? <AccountDialog title="Update payment method" description="Payment method management will be available when billing integration is connected." footer={<button type="button" onClick={() => setPaymentDialog(false)} className={primaryButton}>Close</button>} onClose={() => setPaymentDialog(false)} /> : null}</>;
}

function SubscriptionSection({ subscription, canManage, onChangePlan, onCancel }: { subscription: SubscriptionInformation; canManage: boolean; onChangePlan: (plan: AccountPlan) => void; onCancel: () => void }) {
  const [detailsOpen, setDetailsOpen] = useState(false); const [planDialog, setPlanDialog] = useState(false); const [pendingPlan, setPendingPlan] = useState<AccountPlan | null>(null); const [cancelDialog, setCancelDialog] = useState(false);
  const remaining = subscription.creditsTotal - subscription.creditsUsed;
  return <><div className="rounded-xl border border-[#bfd3f2] bg-[#f8faff] p-5"><Details rows={[["Current plan", subscription.planName], ["Subscription status", subscription.status === "cancel_scheduled" ? `Cancels on ${subscription.renewalDate}` : formatRole(subscription.status)], ["Billing period", formatRole(subscription.billingPeriod)], ["Renewal date", subscription.renewalDate], ["Credits", `${subscription.creditsUsed} used of ${subscription.creditsTotal.toLocaleString()}`], ["Credits remaining", remaining.toLocaleString()]]} /><label className="mt-5 block text-sm font-bold" htmlFor="credit-usage">{subscription.creditsUsed.toLocaleString()} of {subscription.creditsTotal.toLocaleString()} credits used</label><progress id="credit-usage" aria-label={`${subscription.creditsUsed.toLocaleString()} of ${subscription.creditsTotal.toLocaleString()} credits used`} value={subscription.creditsUsed} max={subscription.creditsTotal} className="mt-2 h-3 w-full accent-[#0058bc]" /></div>
    <button type="button" onClick={() => setDetailsOpen((current) => !current)} className={`mt-5 ${secondaryButton}`}>{detailsOpen ? "Hide Plan Details" : "View Plan Details"}</button>
    {detailsOpen ? <FeatureList features={subscription.features} /> : null}
    {canManage ? <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setPlanDialog(true)} className={primaryButton}>Change Plan</button>{subscription.status !== "cancel_scheduled" ? <button type="button" onClick={() => setCancelDialog(true)} className={destructiveButton}>Cancel Subscription</button> : null}</div> : <p className="mt-5 rounded-lg border border-[#d3e4fe] bg-[#f8faff] p-4 text-sm text-[#657080]">Subscription management is read-only for your role.</p>}
    {planDialog ? <AccountDialog title="Change plan" description="Choose the plan that fits your workspace." size="wide" onClose={() => setPlanDialog(false)}><div className="grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">{accountPlanMocks.map((plan) => {
      const isCurrent = plan.id === subscription.planId;
      const isFeatured = plan.id === "premium";
      return <article key={plan.id} className={`flex min-h-[300px] flex-col rounded-2xl border p-5 ${isFeatured ? "border-violet-200 bg-violet-50" : "border-[#d3e4fe] bg-white"}`}>
        <div className="flex items-start justify-between gap-2"><h3 className="text-lg font-extrabold">{plan.name}</h3>{isCurrent ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">Current Plan</span> : null}</div>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b1c30]">{plan.price}</p>
        <ul className="mt-5 grid gap-3 text-sm text-[#526174]">{plan.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
        <div className="mt-auto pt-6">{isCurrent ? <button type="button" disabled className="min-h-11 rounded-lg bg-[#e7edf5] px-4 text-sm font-bold text-[#657080]">Current Plan</button> : <button type="button" onClick={() => { setPlanDialog(false); setPendingPlan(plan); }} className={primaryButton}>{plan.id === "enterprise" ? "Contact Sales" : "Select Plan"}</button>}</div>
      </article>;
    })}</div></AccountDialog> : null}
    {pendingPlan ? <AccountDialog title="Change subscription plan?" description="This is a mockup action. No payment will be processed." footer={<><button type="button" onClick={() => setPendingPlan(null)} className={secondaryButton}>Cancel</button><button type="button" onClick={() => { onChangePlan(pendingPlan); setPendingPlan(null); }} className={primaryButton}>Confirm Change</button></>} onClose={() => setPendingPlan(null)} /> : null}
    {cancelDialog ? <AccountDialog title="Cancel subscription?" description="Your current plan will remain active until the end of the billing period." footer={<><button type="button" onClick={() => setCancelDialog(false)} className={secondaryButton}>Keep Subscription</button><button type="button" onClick={() => { onCancel(); setCancelDialog(false); }} className={destructiveButton}>Cancel Subscription</button></>} onClose={() => setCancelDialog(false)} /> : null}
  </>;
}

function AccountDialog({ title, description, children, footer, onClose, size = "normal" }: { title: string; description: string; children?: ReactNode; footer?: ReactNode; onClose: () => void; size?: "normal" | "wide" }) {
  return <ResponsiveOverlayShell title={title} description={description} footer={footer} maxWidth={size === "wide" ? "max-w-6xl" : "max-w-lg"} onClose={onClose}>{children ? <div className="flex min-w-0 flex-wrap justify-end gap-3">{children}</div> : null}</ResponsiveOverlayShell>;
}

function Avatar({ profile, size = "normal" }: { profile: AccountProfile; size?: "normal" | "large" }) { return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0058bc] font-extrabold text-white ${size === "large" ? "h-14 w-14 text-sm" : "h-10 w-10 text-xs"}`}>{profile.initials}</span>; }
function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) { return <div><label htmlFor={id} className="mb-2 block text-sm font-bold text-[#414755]">{label}</label>{children}{error ? <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-rose-700">{error}</p> : null}</div>; }
function Details({ rows }: { rows: Array<[string, string]> }) { return <dl className="grid gap-3 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="min-w-0 rounded-lg border border-[#d3e4fe] bg-white p-4"><dt className="text-xs font-extrabold uppercase tracking-[.1em] text-[#657080]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>)}</dl>; }
function FeatureList({ features }: { features: string[] }) { return <section aria-label="Plan features" className="mt-5 rounded-xl border border-[#d3e4fe] p-5"><h3 className="font-extrabold">Included features</h3><ul className="mt-3 grid gap-2 text-sm text-[#526174]">{features.map((feature) => <li key={feature} className="flex gap-2"><DashboardIcon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{feature}</li>)}</ul></section>; }
function formatRole(value: string) { return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function timezoneLabel(value: string) { return value === "Asia/Jakarta" ? "Asia/Jakarta (GMT+7)" : value === "Asia/Makassar" ? "Asia/Makassar (GMT+8)" : value === "Asia/Jayapura" ? "Asia/Jayapura (GMT+9)" : "UTC"; }
const inputClass = "h-11 w-full rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100";
const primaryButton = "min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2";
const secondaryButton = "min-h-11 rounded-lg border border-[#c5d2e5] bg-white px-4 text-sm font-bold text-[#414755] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]";
const destructiveButton = "min-h-11 rounded-lg border border-rose-300 bg-white px-4 text-sm font-bold text-rose-700 outline-none hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-700";
