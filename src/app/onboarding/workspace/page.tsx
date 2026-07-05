import { Card, PrimaryButton, SecondaryButton, Shell, Stepper } from "@/components/brandpilot";
import { onboardingSteps } from "@/lib/mock-data";

export default function WorkspaceOnboardingPage() {
  return (
    <Shell
      eyebrow="Onboarding"
      title="Let's create your workspace."
      description="Langkah awal sesuai flow referensi: buat workspace sebelum memilih industri dan mengisi brand."
    >
      <Card className="mx-auto w-full max-w-2xl">
        <Stepper steps={onboardingSteps} active={1} />
        <div className="mt-8 grid gap-4">
          <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100" placeholder="Workspace Name" />
          <div className="flex justify-between gap-3">
            <SecondaryButton href="/auth/login">Back</SecondaryButton>
            <PrimaryButton href="/onboarding/industry">Continue</PrimaryButton>
          </div>
        </div>
      </Card>
    </Shell>
  );
}
