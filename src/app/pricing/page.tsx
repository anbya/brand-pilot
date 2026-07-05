import { Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <Shell
      eyebrow="Pricing Plans"
      title="Choose a plan for your workspace."
      description="Layout pricing dibuat mengikuti grid cards pada referensi."
    >
      <Card>
        <SectionTitle title="Plans" description="From starter to enterprise." />
        <div className="grid gap-4 lg:grid-cols-4">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-5 ${index === 1 ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"}`}
            >
              <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{plan.price}</p>
              <div className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="text-sm text-slate-600">
                    • {feature}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <PrimaryButton href="/auth/login">
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Plan"}
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
