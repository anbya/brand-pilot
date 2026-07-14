"use client";

import type { ReactNode } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";

export function BrandBrainDialog({
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
  return <ResponsiveOverlayShell title={title} description={description} footer={footer} maxWidth="max-w-[720px]" onClose={onClose}>{children}</ResponsiveOverlayShell>;
}
