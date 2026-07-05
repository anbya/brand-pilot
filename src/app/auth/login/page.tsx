import { Card, PrimaryButton, SecondaryButton, Shell } from "@/components/brandpilot";

export default function LoginPage() {
  return (
    <Shell
      eyebrow="Login"
      title="Welcome back."
      description="Masuk ke AI Marketing OS. Layout ini disusun seperti auth card pada referensi."
    >
      <div className="mx-auto grid w-full max-w-md gap-6">
        <Card>
          <div className="grid gap-3">
            <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50">
              Continue with Google
            </button>
            <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50">
              Continue with Apple
            </button>
          </div>
          <div className="my-5 h-px bg-slate-200" />
          <form className="grid gap-4">
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100" placeholder="Email" />
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100" placeholder="Password" type="password" />
            <PrimaryButton href="/onboarding/workspace">Login</PrimaryButton>
          </form>
          <div className="mt-4 flex justify-between text-sm text-slate-500">
            <a href="/auth/forgot-password">Forgot password</a>
            <a href="/auth/register">Register</a>
          </div>
        </Card>
        <SecondaryButton href="/">Back to landing</SecondaryButton>
      </div>
    </Shell>
  );
}
