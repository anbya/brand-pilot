"use client";

import type { ReactNode, RefObject } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";

type Props = { open: boolean; title: string; description?: string; children: ReactNode; footer: ReactNode; maxWidth?: string; initialFocusRef?: RefObject<HTMLElement | null>; onClose: () => void };

export function PostActionDialogShell({ open, title, description, children, footer, maxWidth = "max-w-[720px]", initialFocusRef, onClose }: Props) {
  return <ResponsiveOverlayShell open={open} title={title} description={description} footer={footer} maxWidth={maxWidth} initialFocusRef={initialFocusRef} onClose={onClose}>{children}</ResponsiveOverlayShell>;
}
