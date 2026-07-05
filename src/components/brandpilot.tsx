import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function TopNav() {
  const items = [
    ["/dashboard", "Dashboard"],
    ["/brands", "Brands"],
    ["/campaigns", "Campaigns"],
    ["/calendar", "Calendar"],
    ["/assets", "Assets"],
    ["/schedule", "Schedule"],
    ["/analytics", "Analytics"],
    ["/settings", "Settings"],
    ["/pricing", "Pricing"],
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-semibold text-white shadow-sm">
            BP
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">BrandPilot AI</p>
            <p className="text-xs text-slate-500">AI Marketing OS</p>
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 xl:flex">
          {items.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-violet-50 hover:text-violet-700"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-violet-700"
        >
          Open Workspace
        </Link>
      </div>
    </header>
  );
}

export function Shell({
  title,
  eyebrow,
  description,
  children,
  actions,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.10),_transparent_28%),linear-gradient(180deg,#fcfcff_0%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {eyebrow ? (
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-600">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </section>
        {children}
      </div>
    </main>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    review: "border-violet-200 bg-violet-50 text-violet-700",
    generating: "border-blue-200 bg-blue-50 text-blue-700",
    draft: "border-slate-200 bg-slate-100 text-slate-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    need_revision: "border-amber-200 bg-amber-50 text-amber-700",
    queued: "border-slate-200 bg-slate-100 text-slate-700",
    running: "border-blue-200 bg-blue-50 text-blue-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed: "border-rose-200 bg-rose-50 text-rose-700",
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        tones[status] ?? "border-slate-200 bg-slate-100 text-slate-700",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-violet-700"
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}

export function StatGrid({
  stats,
}: {
  stats: Array<{ label: string; value: string; hint: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-900">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
        </Card>
      ))}
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-all duration-150 hover:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 align-top text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
    </div>
  );
}

export function MiniProgress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function AppFrame({
  title,
  children,
  sideLabel = "AI Marketing OS",
}: {
  title: string;
  children: ReactNode;
  sideLabel?: string;
}) {
  const nav = ["Dashboard", "Brands", "Campaign", "Calendar", "Assets", "Analytics", "Settings"];

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid min-h-[560px] lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-violet-600">
              Workspace
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{sideLabel}</p>
          </div>
          <nav className="mt-5 space-y-1">
            {nav.map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  index === 0
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-600",
                )}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-600">Workspace view</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-violet-100" />
              <div className="h-9 w-9 rounded-full bg-slate-100" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </Card>
  );
}

export function Stepper({
  steps,
  active,
}: {
  steps: string[];
  active: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
              index <= active
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-500",
            )}
          >
            {index + 1}
          </div>
          <span
            className={cn(
              "text-sm",
              index === active ? "font-semibold text-slate-900" : "text-slate-500",
            )}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <div className="hidden h-px w-8 bg-slate-200 sm:block" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function MockArtCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-violet-600">
            {subtitle}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Workspace AI untuk menyusun strategi, kalender konten, asset, dan publikasi.
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <div className="h-20 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-400" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-xl bg-slate-100" />
              <div className="h-16 rounded-xl bg-violet-100" />
              <div className="h-16 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
