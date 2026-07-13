"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/brandpilot";
import { isWorkspacePath } from "@/components/workspace-layout";

export function ConditionalTopNav() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    isWorkspacePath(pathname) ||
    pathname === "/auth/login" ||
    pathname.startsWith("/onboarding")
  ) {
    return null;
  }

  return <TopNav />;
}
