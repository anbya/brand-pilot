import Link from "next/link";
import { Card, Shell } from "@/components/brandpilot";

export default function ForgotPasswordPage() {
  return (
    <Shell
      eyebrow="Authentication"
      title="Forgot password flow untuk reset akses owner."
      description="Placeholder ini menutup scope auth Phase 1 sebelum integrasi Better Auth."
    >
      <Card className="max-w-2xl">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email account
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="owner@brandpilot.ai"
            type="email"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Kirim reset link
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Kembali ke login
          </Link>
        </div>
      </Card>
    </Shell>
  );
}
