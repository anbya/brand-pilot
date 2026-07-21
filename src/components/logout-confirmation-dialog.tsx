"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ResponsiveOverlayShell } from "@/components/ui/responsive-overlay-shell";
import { logoutFromSession } from "@/lib/auth/logout";

export function LogoutConfirmationDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);

  async function confirmLogout() {
    setPending(true);
    const result = await logoutFromSession();
    router.replace(result.redirectTo);
    router.refresh();
  }

  const footer = <><button ref={cancelRef} type="button" disabled={pending} onClick={onClose} className="min-h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#0058bc] disabled:cursor-not-allowed disabled:opacity-60">Cancel</button><button type="button" disabled={pending} onClick={confirmLogout} className="min-h-11 rounded-lg bg-rose-700 px-5 text-sm font-bold text-white outline-none hover:bg-rose-800 focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Logging out..." : "Log Out"}</button></>;
  return <ResponsiveOverlayShell role="alertdialog" title="Log out of Brand Pilot?" description="You will need to sign in again to access this workspace." footer={footer} initialFocusRef={cancelRef} maxWidth="max-w-md" showClose={false} onClose={onClose}><p className="text-sm leading-6 text-[#414755]">Your session will be revoked on the server.</p></ResponsiveOverlayShell>;
}
