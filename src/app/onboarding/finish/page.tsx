import { OnboardingWizard } from "@/components/onboarding-wizard";

export default function FinishOnboardingPage() {
  return (
    <OnboardingWizard
      activeStep={5}
      title="You're all set!"
      description="We've processed your Brand DNA and set up your workspace. Your AI Marketing OS is ready to start generating campaigns."
      finishHref="/dashboard"
    >
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
          OK
        </div>
        <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
          Workspace, niche, and brand profile are ready. Next, open the dashboard to
          generate your first campaign.
        </p>
      </div>
    </OnboardingWizard>
  );
}
