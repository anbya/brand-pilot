import { OnboardingWizard, TextField } from "@/components/onboarding-wizard";

export default function BrandInfoOnboardingPage() {
  return (
    <OnboardingWizard
      activeStep={4}
      title="Defining your Brand DNA"
      description="Our AI uses these details to generate contextualized copy and visuals."
      backHref="/onboarding/industry"
      nextHref="/onboarding/finish"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="brand_name" label="Brand Name" placeholder="e.g. Lumos Digital" />
        <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor="brand_website">
          Brand Website
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              https://
            </span>
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-20 pr-4 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              id="brand_website"
              placeholder="lumos.digital"
              type="text"
            />
          </div>
        </label>
        <label
          className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2"
          htmlFor="brand_description"
        >
          Brand Description & Values
          <textarea
            className="min-h-32 resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            id="brand_description"
            placeholder="Describe your mission, audience, and unique value proposition..."
          />
          <span className="text-xs font-medium italic text-slate-500">
            Tip: Be descriptive. AI thrives on high-fidelity context.
          </span>
        </label>
      </div>
    </OnboardingWizard>
  );
}
