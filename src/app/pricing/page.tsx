import { Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <Shell
      eyebrow="Pricing Plans"
      title="Choose a plan for your workspace."
      description="Freemium planning for every team stage, with paid rendering as you scale."
    >
      <Card>
        <SectionTitle
          title="Plans"
          description="From starter access to custom multi-brand support."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-5 ${
                index === 1 ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              <div className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="text-sm text-slate-600">
                    - {feature}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <PrimaryButton href="/auth/login">
                  {plan.name === "Custom" ? "Contact Sales" : "Start Plan"}
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
