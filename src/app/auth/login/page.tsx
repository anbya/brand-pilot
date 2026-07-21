"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const teamAvatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCQHC-W5LQ9NJ4-nE9V_zRa5CWEw90iF0tIz_8c3Yd-AZRso8MZfovzo5XvG6aY83_sQtfDhdWKS_w2ynUUMBVtyCrfj4Cc5LxTftpuHrRvPXi0vFiqgl__q01wvbHU_wHO0poIG-EL8xEh3hvX4DW7ex6XXDNdleO6ug3p-1yiPOjtIEl9eJO9Gn3Psv9ICRP1PDSBeCmzlfF3sbRjcE4sH9HB9kst4mWbvQpIupsrrrjedpp5T5cQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBfJPZutNDC1cZ1NUkiIe0_4OlzDaV15e3LCh6o-lpjpTdQ1QbIPCQXpt8oyTaNilBu8pYimTIbwQNWRerRVwX1DBfqK6D73hpmKEJT5t36xu3_OSiIiBI_xepe_7zC7rvTjq1opvx6I1jaETPp4WleGIpsoSBH-fxqWAGs2DDwndncdup_m5dMj1v4ZD3JZyCX5VyouuwTgERlm4hQYkkF-ZAKyX98bSiznYIj_6hbEbxDjyvPKCop",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWLvbVgdNx3lDmxVfDgMZD0KeUH03D2Ri8I_zpmine2LH5Ot5YV3jydQq8lxgLiyXR2WtRwWa_dmbbuRSTCN6Y4UZ8FeeeFSTozO6xI3mMvU2Ewpaaz0ZNDeORNLHH1zSNLJlmruoYs3S1zJ5cQkpRtBC-qovhxF5lYaFwCLOKKifzW1XFkQug951dxIQQ50exvERIQxZKD--Y7NT-QNKhdDw49qOTkAOQp_yg8Mh3x20PZDF_tLka",
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          remember: formData.get("remember") === "on",
        }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to log in.");
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      router.replace(next);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to log in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-24 text-slate-950 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
      </div>

      <header className="fixed left-0 top-0 z-20 flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            AI
          </span>
          <span className="text-lg font-bold text-slate-950">AI Marketing OS</span>
        </Link>
      </header>

      <section className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-950">Welcome back.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Log in to your account to continue.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <button
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
            >
              <AppleIcon />
              Continue with Apple
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="grid gap-4" onSubmit={submit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
                Email address
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  href="/auth/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 text-sm text-slate-600">
              <input
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                name="remember"
                type="checkbox"
              />
              Keep me logged in
            </label>

            {error ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}

            <button
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
              type="submit"
            >
              {pending ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link className="font-bold text-blue-600 transition hover:text-blue-700" href="/auth/register">
              Sign up
            </Link>
          </p>
        </div>

        <footer className="mt-8 flex flex-wrap justify-center gap-5 text-xs font-semibold text-slate-500">
          <Link className="transition hover:text-slate-700" href="#">
            Privacy Policy
          </Link>
          <Link className="transition hover:text-slate-700" href="#">
            Terms of Service
          </Link>
          <Link className="transition hover:text-slate-700" href="#">
            Contact Support
          </Link>
        </footer>
      </section>

      <aside className="absolute right-10 top-1/2 z-10 hidden w-[30%] max-w-md -translate-y-1/2 rounded-xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur xl:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white">
          OS
        </div>
        <h2 className="mt-6 text-2xl font-bold leading-tight text-slate-950">
          Accelerate your marketing with intelligence.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Create campaigns in seconds, manage assets clearly, and optimize performance
          from one focused workspace.
        </p>
        <div className="mt-6 flex items-center gap-4 rounded-xl bg-blue-50 p-4">
          <div className="flex -space-x-2">
            {teamAvatars.map((src, index) => (
              <Image
                key={src}
                src={src}
                width={32}
                height={32}
                alt={`AI Marketing OS user ${index + 1}`}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-blue-700">Join 10,000+ teams today</span>
        </div>
      </aside>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.2 0-2.39.6-3.21.6-1.57 0-3.9-2.58-3.9-5.91 0-3.32 2.22-5.08 4.31-5.08 1.09 0 2.01.59 2.81.59.79 0 1.9-.6 3.12-.6 1.28 0 2.37.5 3.1 1.57-2.53 1.34-2.12 4.74.43 5.91-.56 1.48-1.91 3.52-3.43 3.52zM13.88 7.42c-.04-2.11 1.83-3.91 3.84-4.14.2 2.34-2.11 4.26-3.84 4.14z" />
    </svg>
  );
}
