import { IndustryOption, OnboardingWizard } from "@/components/onboarding-wizard";

const industries = [
  ["Coffee Shop", "CF"],
  ["Restaurant", "RS"],
  ["Retail", "RT"],
  ["Tech/SaaS", "SA"],
  ["Health/Wellness", "HW"],
  ["Other", "OT"],
] as const;

export default function IndustryOnboardingPage() {
  return (
    <OnboardingWizard
      activeStep={3}
      title="What's your niche?"
      description="Our AI specializes in different sectors. Select yours to get tailored strategies."
      backHref="/onboarding/workspace"
      nextHref="/onboarding/brand-info"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {industries.map(([label, icon], index) => (
          <IndustryOption key={label} icon={icon} label={label} selected={index === 0} />
        ))}
      </div>
    </OnboardingWizard>
  );
}
