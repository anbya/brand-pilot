import Link from "next/link";
import { Card, Field, Shell } from "@/components/brandpilot";

export default function LoginPage() {
  return (
    <Shell
      eyebrow="Authentication"
      title="Login user untuk masuk ke workspace BrandPilot AI."
      description="Halaman ini merepresentasikan modul auth PRD: login, session, dan arah ke dashboard."
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-slate-50">
          <h2 className="text-2xl font-semibold text-slate-900">Access control</h2>
          <div className="mt-5 space-y-3">
            <Field label="Auth strategy" value="JWT access token + refresh token" />
            <Field label="Role default" value="owner / admin / member" />
            <Field label="Redirect after login" value="/dashboard" />
          </div>
        </Card>

        <Card>
          <form className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="owner@brandpilot.ai"
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
                type="password"
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm text-slate-500">
              <Link href="/auth/forgot-password">Forgot password</Link>
              <Link href="/auth/register">Belum punya akun?</Link>
            </div>
            <Link
              href="/dashboard"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Masuk ke dashboard
            </Link>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
