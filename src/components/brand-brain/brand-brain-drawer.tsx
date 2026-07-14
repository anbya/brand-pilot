"use client";

import type { ReactNode } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";

export function BrandBrainDrawer({
  children,
  description,
  footer,
  onClose,
  title,
}: {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return <ResponsiveOverlayShell variant="drawer" title={title} description={description} footer={footer} maxWidth="max-w-[820px]" bodyClassName="" closeLabel="Close drawer" onClose={onClose}>{children}</ResponsiveOverlayShell>;
}
