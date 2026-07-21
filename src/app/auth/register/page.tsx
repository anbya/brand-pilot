"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Card, Shell } from "@/components/brandpilot";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          businessName: formData.get("businessName"),
        }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to register.");
      router.replace("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to register.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell
      eyebrow="Authentication"
      title="Register owner account baru untuk brand pertama."
      description="Step ini mewakili onboarding awal sebelum user membuat brand profile."
    >
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <AuthField label="Full name" name="name" autoComplete="name" />
          <AuthField label="Email" name="email" type="email" autoComplete="email" />
          <AuthField label="Password" name="password" type="password" autoComplete="new-password" />
          <AuthField label="Business name" name="businessName" autoComplete="organization" />
          {error ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 md:col-span-2">{error}</p> : null}
          <div className="md:col-span-2">
            <button
              disabled={pending}
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Lanjut buat brand profile"}
            </button>
          </div>
        </form>
      </Card>
    </Shell>
  );
}

function AuthField({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        name={name}
        placeholder={label}
        required
        type={type}
      />
    </label>
  );
}
