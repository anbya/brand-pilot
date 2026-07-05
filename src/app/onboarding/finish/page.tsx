import { Card, PrimaryButton, Shell, Stepper } from "@/components/brandpilot";
import { onboardingSteps } from "@/lib/mock-data";

export default function FinishOnboardingPage() {
  return (
    <Shell
      eyebrow="Onboarding"
      title="All set."
      description="Screen konfirmasi akhir sebelum user masuk ke dashboard."
    >
      <Card className="mx-auto w-full max-w-xl text-center">
        <Stepper steps={onboardingSteps} active={4} />
        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">
          ✓
        </div>
        <p className="mt-6 text-lg text-slate-500">
          Workspace dan brand profile sudah siap digunakan.
        </p>
        <div className="mt-6">
          <PrimaryButton href="/dashboard">Go to dashboard</PrimaryButton>
        </div>
      </Card>
    </Shell>
  );
}
