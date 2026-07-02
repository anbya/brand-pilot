import Link from "next/link";
import { Card, Shell } from "@/components/brandpilot";

export default function RegisterPage() {
  return (
    <Shell
      eyebrow="Authentication"
      title="Register owner account baru untuk brand pertama."
      description="Step ini mewakili onboarding awal sebelum user membuat brand profile."
    >
      <Card>
        <form className="grid gap-4 md:grid-cols-2">
          {["Full name", "Email", "Password", "Business name"].map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium text-slate-700">
              {field}
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder={field}
              />
            </label>
          ))}
          <div className="md:col-span-2">
            <Link
              href="/brands"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Lanjut buat brand profile
            </Link>
          </div>
        </form>
      </Card>
    </Shell>
  );
}
