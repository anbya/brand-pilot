"use client";

import { usePathname } from "next/navigation";
import { PageTabs } from "@/components/ui/page-tabs";

const items = [{ label: "Calendar", href: "/calendar" }, { label: "Content List", href: "/calendar/content" }] as const;

export function CalendarSubNavigation() {
  const pathname = usePathname();
  return <PageTabs label="Content Calendar navigation" items={items.map((item) => ({ ...item, active: item.href === "/calendar" ? pathname === item.href : pathname.startsWith(item.href) }))} />;
}
