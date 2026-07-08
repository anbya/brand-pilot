import { ChoiceOption, OnboardingWizard, TextField } from "@/components/onboarding-wizard";

export default function WorkspaceOnboardingPage() {
  return (
    <OnboardingWizard
      activeStep={2}
      title="Setup your Workspace"
      description="Let's get started by naming your collaborative environment."
      backHref="/onboarding/account"
      nextHref="/onboarding/industry"
    >
      <div className="grid gap-6">
        <TextField
          id="ws_name"
          label="Workspace Name"
          placeholder="e.g. Acme Marketing Team"
        />

        <div className="grid gap-3">
          <p className="text-sm font-semibold text-slate-700">Organization Type</p>
          <div className="grid grid-cols-3 gap-3">
            <ChoiceOption icon="CO" label="Company" selected />
            <ChoiceOption icon="AG" label="Agency" />
            <ChoiceOption icon="SO" label="Solo" />
          </div>
        </div>
      </div>
    </OnboardingWizard>
  );
}
