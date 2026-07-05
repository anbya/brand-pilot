import { Card, PrimaryButton, SecondaryButton, Shell, Stepper } from "@/components/brandpilot";
import { onboardingSteps } from "@/lib/mock-data";

export default function BrandInfoOnboardingPage() {
  return (
    <Shell
      eyebrow="Onboarding"
      title="Tell us about your brand."
      description="Form ringkas untuk nama brand, target market, dan positioning."
    >
      <Card className="mx-auto w-full max-w-2xl">
        <Stepper steps={onboardingSteps} active={3} />
        <div className="mt-8 grid gap-4">
          {["Brand Name", "Target Market", "Location", "Brief Description"].map((field) => (
            <input
              key={field}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
              placeholder={field}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-between gap-3">
          <SecondaryButton href="/onboarding/industry">Back</SecondaryButton>
          <PrimaryButton href="/onboarding/finish">Continue</PrimaryButton>
        </div>
      </Card>
    </Shell>
  );
}
