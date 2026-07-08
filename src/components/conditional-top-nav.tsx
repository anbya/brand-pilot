"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/brandpilot";

export function ConditionalTopNav() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/analytics" ||
    pathname === "/brain" ||
    pathname === "/brands" ||
    pathname === "/calendar" ||
    pathname === "/campaigns" ||
    pathname === "/dashboard" ||
    pathname === "/auth/login" ||
    pathname.startsWith("/onboarding")
  ) {
    return null;
  }

  return <TopNav />;
}
