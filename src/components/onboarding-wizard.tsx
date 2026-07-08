import Link from "next/link";
import type { ReactNode } from "react";

const steps = ["Account", "Workspace", "Industry", "Brand DNA", "Review"] as const;

const inputClass =
  "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export function OnboardingWizard({
  activeStep,
  title,
  description,
  children,
  backHref,
  nextHref,
  nextLabel = "Next Step",
  finishHref,
}: {
  activeStep: number;
  title: string;
  description: string;
  children: ReactNode;
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  finishHref?: string;
}) {
  const isFinal = activeStep === steps.length;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute left-[5%] top-[10%] h-96 w-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-blue-50 px-5 py-6 sm:px-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  AI
                </span>
                <span className="text-lg font-bold text-blue-700">AI Marketing OS</span>
              </Link>
              {!isFinal ? (
                <span className="text-sm font-semibold text-slate-600">
                  Step {activeStep} of {steps.length}
                </span>
              ) : null}
            </div>

            <div className="flex gap-1">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber <= activeStep;

                return (
                  <div
                    key={step}
                    className={
                      isActive
                        ? "h-2 flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        : "h-2 flex-1 rounded-full bg-slate-200"
                    }
                  />
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2 text-center text-[11px] font-semibold sm:text-xs">
              {steps.map((step, index) => {
                const stepNumber = index + 1;

                return (
                  <span
                    key={step}
                    className={stepNumber <= activeStep ? "text-blue-700" : "text-slate-400"}
                  >
                    {step}
                  </span>
                );
              })}
            </div>
          </header>

          <div className="flex min-h-[440px] flex-col p-5 sm:p-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-[-0.02em] text-slate-950">
                {title}
              </h1>
              <p className="text-base leading-7 text-slate-600">{description}</p>
            </div>

            <div className="mt-8 flex-1">{children}</div>

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
              {backHref ? (
                <Link
                  href={backHref}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </Link>
              ) : (
                <span />
              )}

              {finishHref ? (
                <Link
                  href={finishHref}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              ) : nextHref ? (
                <Link
                  href={nextHref}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  {nextLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {!isFinal ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TipCard
              label="Pro Tip:"
              text="Detailed inputs help the AI keep tone and positioning consistent across every platform."
            />
            <TipCard
              label="AI Identity Magic"
              text="The system uses your workspace, niche, and Brand DNA to create a sharper voice profile."
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

export function TextField({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor={id}>
      {label}
      <input className={inputClass} id={id} placeholder={placeholder} type={type} />
    </label>
  );
}

export function IndustryOption({
  label,
  icon,
  selected = false,
}: {
  label: string;
  icon: string;
  selected?: boolean;
}) {
  return (
    <label
      className={
        selected
          ? "flex cursor-pointer items-center gap-3 rounded-xl border border-blue-600 bg-blue-50 p-4 text-sm font-semibold text-blue-700 shadow-sm"
          : "flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
      }
    >
      <input className="sr-only" defaultChecked={selected} name="industry" type="radio" />
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
        {icon}
      </span>
      {label}
    </label>
  );
}

export function ChoiceOption({
  label,
  icon,
  selected = false,
}: {
  label: string;
  icon: string;
  selected?: boolean;
}) {
  return (
    <label
      className={
        selected
          ? "grid cursor-pointer place-items-center gap-2 rounded-xl border border-blue-600 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-700"
          : "grid cursor-pointer place-items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
      }
    >
      <input className="sr-only" defaultChecked={selected} name="org_type" type="radio" />
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
        {icon}
      </span>
      {label}
    </label>
  );
}

function TipCard({ label, text }: { label: string; text: string }) {
  return (
    <aside className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
        AI
      </span>
      <p className="text-sm leading-6 text-slate-600">
        <span className="font-bold text-blue-700">{label}</span> {text}
      </p>
    </aside>
  );
}
