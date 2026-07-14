"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AccountSettingsDrawer } from "@/components/account/account-settings-drawer";
import { DashboardIcon, type DashboardIconName } from "@/components/dashboard/dashboard-icon";
import { LogoutConfirmationDialog } from "@/components/logout-confirmation-dialog";
import { accountProfileMock, billingInformationMock, subscriptionInformationMock } from "@/lib/account/mock-data";
import { getAccountPermissions } from "@/lib/account/permissions";
import type { AccountPlan, AccountSettingsSection } from "@/lib/account/types";

const menuItems: Array<{ id: AccountSettingsSection; label: string; icon: DashboardIconName }> = [
  { id: "profile", label: "Basic Profile", icon: "user" },
  { id: "billing", label: "Billing Information", icon: "creditCard" },
  { id: "subscription", label: "Current Plan & Subscription", icon: "plan" },
];

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<AccountSettingsSection | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profile, setProfile] = useState(accountProfileMock);
  const [billing, setBilling] = useState(billingInformationMock);
  const [subscription, setSubscription] = useState(subscriptionInformationMock);
  const [toast, setToast] = useState("");
  const permissions = getAccountPermissions(profile.role);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    function outside(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("keydown", escape); };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    if (!items.length) return;
    event.preventDefault();
    const current = Math.max(0, items.indexOf(document.activeElement as HTMLButtonElement));
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowDown" ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
    items[next].focus();
  }

  function openSection(next: AccountSettingsSection) { setOpen(false); setSection(next); }
  function closeDrawer() { setSection(null); window.requestAnimationFrame(() => triggerRef.current?.focus()); }
  function changePlan(plan: AccountPlan) { setSubscription((current) => ({ ...current, planId: plan.id, planName: plan.name, billingPeriod: plan.billingPeriod, status: "active", features: plan.features })); setToast("Subscription plan updated."); }

  const visibleItems = menuItems.filter((item) => item.id === "profile" || item.id === "billing" ? item.id === "profile" || permissions.canViewBilling : permissions.canViewSubscription);

  return <>
    <div ref={rootRef} className="relative min-w-0">
      <button ref={triggerRef} type="button" aria-controls={open ? menuId : undefined} aria-expanded={open} aria-haspopup="menu" aria-label={`Open account menu for ${profile.fullName}`} onClick={() => setOpen((current) => !current)} className={`flex min-h-14 w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-inset ${open ? "bg-[#dce9ff]" : "bg-[#eff4ff] hover:bg-[#e5eeff]"}`}>
        <Avatar initials={profile.initials} />
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#0b1c30]">{profile.fullName}</span><span className="block truncate text-xs font-semibold text-[#717786]">{subscription.planName}</span></span>
        <DashboardIcon name="chevronDown" className={`h-4 w-4 shrink-0 text-[#657080] transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? <div id={menuId} role="menu" aria-label="Account menu" onKeyDown={navigate} className="absolute bottom-[calc(100%+.5rem)] left-0 z-[70] max-h-[calc(100dvh-2rem)] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden rounded-xl border border-[#bfd3f2] bg-white p-2 shadow-[0_18px_50px_rgba(7,27,51,.2)] lg:max-h-[calc(100dvh-6rem)] lg:w-72">
        <div className="flex min-w-0 items-center gap-3 px-3 py-3"><Avatar initials={profile.initials} /><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#0b1c30]">{profile.fullName}</p><p className="truncate text-xs font-semibold text-[#657080]">{subscription.planName}</p></div></div>
        <div className="my-1 h-px bg-[#d3e4fe]" />
        {visibleItems.map((item) => <button key={item.id} type="button" role="menuitem" onClick={() => openSection(item.id)} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-[#414755] outline-none hover:bg-[#eff4ff] focus-visible:bg-[#e5eeff] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-inset"><DashboardIcon name={item.icon} className="h-[18px] w-[18px] shrink-0 text-[#0058bc]" /><span className="min-w-0 flex-1">{item.label}</span><DashboardIcon name="chevronDown" className="h-4 w-4 shrink-0 -rotate-90 text-[#8a94a3]" /></button>)}
        <div className="my-1 h-px bg-[#d3e4fe]" />
        <button type="button" role="menuitem" onClick={() => { setOpen(false); setLogoutOpen(true); }} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-rose-700 outline-none hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-inset"><DashboardIcon name="logout" className="h-[18px] w-[18px] shrink-0" />Log Out</button>
      </div> : null}
    </div>

    {section ? <AccountSettingsDrawer section={section} profile={profile} billing={billing} subscription={subscription} permissions={permissions} onSectionChange={setSection} onUpdateProfile={(next) => { setProfile(next); setToast("Profile updated successfully."); }} onUpdateBilling={(next) => { setBilling(next); setToast("Billing details updated."); }} onChangePlan={changePlan} onCancelSubscription={() => { setSubscription((current) => ({ ...current, status: "cancel_scheduled" })); setToast("Subscription cancellation scheduled."); }} onClose={closeDrawer} /> : null}
    {logoutOpen ? <LogoutConfirmationDialog onClose={() => { setLogoutOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }} /> : null}
    {toast ? <div role="status" className="fixed right-4 top-4 z-[120] max-w-sm rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 shadow-lg">{toast}</div> : null}
  </>;
}

function Avatar({ initials }: { initials: string }) { return <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0058bc] text-xs font-extrabold text-white">{initials}</span>; }
