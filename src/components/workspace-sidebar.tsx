"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/account/account-menu";
import { DashboardIcon, type DashboardIconName } from "@/components/dashboard/dashboard-icon";

const navigation = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Brands", icon: "brands", href: "/brands", aliases: ["/brain"] },
  { label: "Campaigns", icon: "campaign", href: "/campaigns" },
  { label: "Content Calendar", icon: "calendar", href: "/calendar" },
  { label: "Assets", icon: "assets", href: "/assets" },
  { label: "Analytics", icon: "analytics", href: "/analytics" },
] satisfies Array<{
  label: string;
  icon: DashboardIconName;
  href: string;
  aliases?: string[];
}>;

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-w-0 border-b border-[var(--bp-border)] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex min-w-0 items-center px-4 py-4 lg:block lg:p-4">
        <Link
          aria-label="AI Marketing OS dashboard"
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2"
          href="/dashboard"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bp-primary)] text-white shadow-sm">
            <DashboardIcon name="check" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold text-[var(--bp-primary)] min-[375px]:text-base">AI Marketing OS</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--bp-text-muted)] min-[375px]:block">Enterprise Suite</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Workspace navigation" className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain px-4 pb-4 pt-1 lg:mt-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const active = matchesRoute(pathname, item.href) || item.aliases?.some((route) => matchesRoute(pathname, route));
          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--bp-focus)] focus-visible:ring-inset ${active ? "bg-[var(--bp-primary)] text-white shadow-sm" : "text-[var(--bp-text-secondary)] hover:bg-[var(--bp-surface-accent)] hover:text-[var(--bp-text)]"}`}
              href={item.href}
            >
              <DashboardIcon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-[var(--bp-border)] p-3 lg:p-4">
        <AccountMenu />
      </div>
    </aside>
  );
}
