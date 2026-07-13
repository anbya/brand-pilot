"use client";

import { usePathname } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";

const workspaceRoutes = ["/dashboard", "/brands", "/brain", "/campaigns", "/calendar", "/assets", "/analytics", "/settings"];

export function isWorkspacePath(pathname: string) {
  return workspaceRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!isWorkspacePath(pathname)) return children;

  return (
    <div className="min-w-0 lg:pl-64">
      <WorkspaceSidebar />
      {children}
    </div>
  );
}
