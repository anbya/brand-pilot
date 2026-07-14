"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [{ label: "Calendar", href: "/calendar" }, { label: "Content List", href: "/calendar/content" }] as const;

export function CalendarSubNavigation() {
  const pathname = usePathname();
  return <nav aria-label="Content Calendar navigation" className="flex max-w-full gap-2 overflow-x-auto pb-1">{items.map((item) => { const active = item.href === "/calendar" ? pathname === item.href : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`min-h-10 shrink-0 rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] ${active ? "bg-[#0058bc] text-white" : "border border-[#c5d2e5] bg-white text-[#414755] hover:bg-[#eff4ff]"}`}>{item.label}</Link>; })}</nav>;
}
