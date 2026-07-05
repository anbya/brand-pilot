import { Card, PrimaryButton, SecondaryButton, Shell, Stepper } from "@/components/brandpilot";
import { onboardingSteps } from "@/lib/mock-data";

const industries = ["Coffee Shop / Cafe", "Restaurant", "Beauty & Skincare", "Retail"];

export default function IndustryOnboardingPage() {
  return (
    <Shell
      eyebrow="Onboarding"
      title="What's your industry?"
      description="Pilihan industri disajikan sebagai card/list sederhana seperti pada referensi."
    >
      <Card className="mx-auto w-full max-w-2xl">
        <Stepper steps={onboardingSteps} active={2} />
        <div className="mt-8 grid gap-3">
          {industries.map((industry, index) => (
            <div
              key={industry}
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${index === 0 ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {industry}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between gap-3">
          <SecondaryButton href="/onboarding/workspace">Back</SecondaryButton>
          <PrimaryButton href="/onboarding/brand-info">Continue</PrimaryButton>
        </div>
      </Card>
    </Shell>
  );
}
