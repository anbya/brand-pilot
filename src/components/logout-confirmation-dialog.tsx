"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { logoutFromMockSession } from "@/lib/auth/logout";

export function LogoutConfirmationDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);

  function confirmLogout() {
    const result = logoutFromMockSession();
    router.replace(result.redirectTo);
  }

  const footer = <><button ref={cancelRef} type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#0058bc]">Cancel</button><button type="button" onClick={confirmLogout} className="min-h-11 rounded-lg bg-rose-700 px-5 text-sm font-bold text-white outline-none hover:bg-rose-800 focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2">Log Out</button></>;
  return <ResponsiveOverlayShell role="alertdialog" title="Log out of Brand Pilot?" description="You will need to sign in again to access this workspace." footer={footer} initialFocusRef={cancelRef} maxWidth="max-w-md" showClose={false} onClose={onClose}><p className="text-sm leading-6 text-[#414755]">Your current work is stored in this prototype session.</p></ResponsiveOverlayShell>;
}
